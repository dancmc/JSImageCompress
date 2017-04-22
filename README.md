# JS Image Compress
- Configurable client side image compression - saves bandwidth and time on uploads.   
- Works by decreasing quality and/or image dimensions till desired maximum parameters met.
- Demo at https://dancmc.io/projects/JSImageCompress
## Install
Make a local copy of jsimagecompress.1.02.js / jsimagecompress.1.02-min.js or link to https://dancmc.io/static_jsimagecompress/js/jsimagecompress.1.02-min.js 

## Quick Start
Call either imagesToResizedDataUrls or imagesToResizedBlobs
* 1st argument : blob array
* 2nd argument : specify any number of options
    * should at least specify maxSize or maxWidth/Height
* 3rd argument : callback function

Simplest way :
```javascript
var imageFiles = Array.from(document.getElementById('images').files);

imagesToResizedBlobs(imageFiles, {
    "maxSize" : 0.1  // size in MB
}, function (resultArray) {
     
     // passes back array of JS objects (see below for format)
     resultArray.forEach(function (result){
         
         // do something with result.blob     
     })
 })
```

Full option list :
```javascript
// retrieve file list from HTML file input
var imageFiles = Array.from(document.getElementById('images').files);

// call function to resize images
// 1st argument : blob array, 2nd : object with optional options,
imagesToResizedBlobs(imageFiles, {
    "maxWidth" : 1920,  // max width of output, default 99999
    "maxHeight" : 1920, // max height of output, default 99999
    "maxSize" : 0.1,  // max size of output in MB, default 999
    "minQuality" : 10, // minimum quality of jpeg output allowed, 10 to 90, default 10  
    "speed" : 1,  // 1 (fastest) to 10 (slowest), trades off optimal quality for speed, default 4
    "resize" : true,  // allows scaling of image, default false
    "adaptive" : false,  // tries to speed up conversion based on individual image size, may override other options, default false 
    "log" : true,  // turns console logging on or off, default true
    "units" : "mb" // format of sizes returned in result objects (b, kb, mb), default mb
}, function (resultArray) {
    
    // passes back array of JS objects (see below for format)
    resultArray.forEach(function (result){
            
    })
})
```

Result object formatted as follows :
```javascript
{
    // either dataurl or blob present depending on method called
    dataurl : "data:image/jpeg;base64,/9jdsaljkldasmlkdmald",
    blob : ....,
    
    filename : "Screenshot_32783782",  // original filename of upload
    mime : "image/png",  // mime type of original image
    originalSize : 0.634,  // size of original image, units as specified in options (default MB)
    finalSize : 0.063,  // size of final image
    compression : 90.00,  // percent compression of final image
    time: 278,  // time taken to compress image in ms
    originalWidth: 1920,  // width of original image 
    originalHeight: 1080,  // height of original image 
    finalWidth: canvas.width,  // width of compressed image
    finalHeight: canvas.height  // height of compressed image
}
```

## Notes
* Utility method dataUrlToBlob included to convert dataUrls to blobs if needed
* maxSize in options and original/finalSize in result refer to result blobs. Corresponding dataUrls are 4/3 times larger.
* use the base64StringFromDataUrl method to convert data url to plain base64 string