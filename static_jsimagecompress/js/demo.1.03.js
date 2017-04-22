/**
 * Created by Daniel on 22/04/2017.
 */

function showError(text){
    $("#result_div").append(text+"</br>")
}

function validateInt(element, min, max ,defaultvalue){
    var result = 0;
    var field = $(element);

    if(!isNaN(parseInt(field.val()))){
        result = Math.ceil(field.val());
        if(result>max || result<min){
            showError("Please enter a valid integer for "+field.attr("name")+" between "+min+" and "+ max);
            throw RangeException;
        } else {
            return result
        }
    } else {
        return defaultvalue;
    }
}

function validateFloat(element, min, max ,defaultvalue){
    var result = 0;
    var field = $(element);

    if(!isNaN(parseFloat(field.val()))){
        result = field.val();
        if(result>max || result<min){
            showError("Please enter a valid decimal for "+field.attr("name")+" between "+min+" and "+ max);
            throw RangeException;
        } else {
            return result
        }
    } else {
        return defaultvalue;
    }
}

function compressAll() {
    var resultdiv = $("#result_div");
    resultdiv.empty();


    var formData = new FormData();
    var images = Array.from(document.getElementById('images').files);

    if (images.length === 0) {
        resultdiv.append("<h3>Please select 1 or more images</h3>");
    }

    try {
        var maxwidth = validateInt("#maxwidth", 1, 99999, 99999);
        var maxheight = validateInt("#maxheight", 1, 99999, 99999);
        var maxsize = validateFloat("#maxsize", 0.01, 9999, 0.15);
        var minquality = validateInt("#minquality", 10, 90, 10);
        var speed = $("#speed").val();
        var resize = $("#resize").val();
    }catch(e){
        return;
    }


    imagesToResizedDataUrls(images, {
        "maxWidth" : maxwidth,
        "maxHeight" : maxheight,
        "maxSize" : maxsize,
        "minQuality" : minquality,
        "speed" : speed,
        "resize" : resize,
        "adaptive" : false,
        "log" : true,
        "units" : "kb"
    }, function (resultArray) {



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

// setup
var options = "";
for(var i = 1; i<11;i++){
    if(i===5){
        options += "<option value="+i+" selected>"+i+"</option>";
    } else {
        options += "<option value=" + i + ">" + i + "</option>";
    }
}
$("#speed").html(options);

$("#submit_multi").click(function () {
        compressAll()
    }
);
