/**
 * Created by Daniel on 22/04/2017.
 */

function compressAll() {
    var formData = new FormData();
    var images = Array.from(document.getElementById('images').files);

    if (images.length === 0) {
        const resultdiv = $("#result_div");
        resultdiv.empty();
        resultdiv.append("<h3>Please select 1 or more images</h3>");
    }

    imagesToResizedDataUrls(images, {
        "maxSize": 0.1,
        "resize": true,
        "speed": 5,
        "log": true,
        "units" : "kb"
    }, function (resultArray) {

        var resultdiv = $("#result_div");
        resultdiv.empty();

        resultArray.forEach(function (item) {

            var newdiv = $('<div />');

            var image = new Image();
            image.src = item.dataurl;

            var info = $("<p/>");

            info.append("</br>");
            info.append('Filename : ' + item.filename+"</br>");
            info.append('MIME type : ' + item.mime+"</br>");
            info.append('Original size : ' + item.originalSize +" kB"+"</br>");
            info.append('Final size : ' + item.finalSize + " kB"+"</br>");
            info.append('Compression : ' + item.compression+"%"+"</br>");
            info.append('Time taken : ' + item.time+" ms"+"</br>");
            info.append('Original width : ' + item.originalWidth+" px</br>");
            info.append('Original height : ' + item.originalHeight+" px</br>");
            info.append('Final width : ' + item.finalWidth+" px</br>");
            info.append('Final height : ' + item.finalHeight+" px</br>");
            info.append("</br>");

            newdiv.append(image);
            newdiv.append(info);
            resultdiv.append(newdiv);

        });

    })
}


$("#submit_multi").click(function () {
        compressAll()
    }
);
