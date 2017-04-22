
function ImageCompressor() {
    function defaultFor(arg, val) {
        return typeof arg !== 'undefined' ? arg : val;
    }

    function formatSize (size, units, isdataurl) {

        var r = size;
        if (isdataurl) {
            r = (size - 22) * 3 / 4;
        }

        switch (units.toLowerCase()) {
            case "b" || "bytes":
                return r;
            case "kb" || "kilobytes":
                return r / 1024;
            case "mb" || "megabytes":
                return r / 1024 / 1024;
        }
    }


    this.imagesToResizedDataUrls=function(fileArray, options, callback) {

        var totalcount = fileArray.length;
        var resultArray = [];
        var startTime = new Date().getTime();


        fileArray.forEach(function (file) {

            var reader = new FileReader();
            var img = new Image();
            var mime = file.type;

            img.onload = function () {
                var maxWidth = defaultFor(options["maxWidth"], 99999);
                var maxHeight = defaultFor(options["maxHeight"], 99999);
                var maxSize = defaultFor(options["maxSize"], 999);
                var minQuality = Math.max(defaultFor(options["minQuality"], 10) / 100.0, 0.1);
                var speed = defaultFor(options["speed"], 4);
                var logging = defaultFor(options["log"], true);
                var resize = defaultFor(options["resize"], false);
                var units = defaultFor(options["units"], "MB");
                var adaptive = defaultFor(options["adaptive"], false);


                var canvas = document.createElement("CANVAS");
                var currentQuality = 0.9;
                var qualityDecrement = Math.max((0.9 - minQuality) / speed, 0.05);
                var rescaleDecrement = 0.1;

                //resize img first
                var ratio = Math.min(Math.min(maxWidth / img.width, maxHeight / img.height), 1.0);
                var ratioception = 0.9;

                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;

                var ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                var dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
                var originalSize = formatSize(file.size, "mb", false);
                var imgFileSize = formatSize(dataUrl.length, "mb", true);

                if (adaptive && imgFileSize > maxSize * 20) {
                    qualityDecrement = 0.9 - minQuality;
                } else if (adaptive && imgFileSize > maxSize * 10) {
                    qualityDecrement = 0.4;
                }

                while (imgFileSize > maxSize && currentQuality > minQuality) {
                    currentQuality -= qualityDecrement;
                    dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
                    imgFileSize = formatSize(dataUrl.length, "mb", true);
                }

                if (adaptive && imgFileSize > maxSize * 3) {
                    ratioception = 0.7;
                    rescaleDecrement = 0.15
                }
                while ((imgFileSize > maxSize && resize && ratioception > 0.1)) {
                    canvas.width = img.width * ratio * ratioception;
                    canvas.height = img.height * ratio * ratioception;
                    currentQuality = 1.0;
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    while (imgFileSize > maxSize && currentQuality > minQuality) {
                        currentQuality -= qualityDecrement;
                        dataUrl = canvas.toDataURL('image/jpeg', currentQuality);
                        imgFileSize = formatSize(dataUrl.length, "mb", true);
                    }
                    ratioception -= rescaleDecrement;
                }

                var timeTaken = new Date().getTime() - startTime;
                startTime = new Date().getTime();

                if (logging) {
                    console.log("For " + file.name + ", took " + timeTaken + "ms, size is " + formatSize(dataUrl.length, units, true).toFixed(3) + " " + units);
                }

                resultArray.push({
                    dataurl: dataUrl,
                    filename: file.name,
                    mime: mime,
                    originalSize: formatSize(file.size, units, false),
                    finalSize: formatSize(dataUrl.length, units, true),
                    compression: parseFloat(((1 - imgFileSize / originalSize) * 100).toFixed(2)),
                    time: timeTaken,
                    originalWidth: img.width,
                    originalHeight: img.height,
                    finalWidth: canvas.width,
                    finalHeight: canvas.height
                });
                if (resultArray.length === totalcount) {
                    resultArray = resultArray.filter(function (val) {
                        return val !== null;
                    });
                    callback(resultArray);
                }
            };

            img.onerror = function () {
                console.log(file.name + " is not a supported image format.");
                resultArray.push(null);
            };

            reader.onload = function (event) {
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    this.imagesToResizedBlobs=function(fileArray, options, callback) {
        imagesToResizedDataUrls(fileArray, options, function (resultArray) {
            resultArray.forEach(function (result) {
                result.blob = dataURLtoBlob(result.dataurl);
                delete result.dataurl;
            });
            callback(resultArray);
        })
    };

    this.dataURLtoBlob = function(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type: mime});
    };

    this.base64StringFromDataUrl = function(dataurl) {
        try {
            return dataurl.split(",")[1];
        } catch (error) {
            return dataurl;
        }
    }
}