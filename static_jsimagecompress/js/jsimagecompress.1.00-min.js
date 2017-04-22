function defaultFor(a,b){return void 0!==a?a:b}function formatSize(a,b,c){var d=a;switch(c&&(d=3*(a-22)/4),b.toLowerCase()){case"b":return d;case"kb":return d/1024;case"mb":return d/1024/1024}}function imagesToResizedDataUrls(a,b,c){var d=a.length,e=[],f=(new Date).getTime();a.forEach(function(a){var g=new FileReader,h=new Image,i=a.type;h.onload=function(){var g=defaultFor(b.maxWidth,99999),j=defaultFor(b.maxHeight,99999),k=defaultFor(b.maxSize,999),l=Math.max(defaultFor(b.minQuality,10)/100,.1),m=defaultFor(b.speed,4),n=defaultFor(b.log,!0),o=defaultFor(b.resize,!1),p=defaultFor(b.units,"MB"),q=defaultFor(b.adaptive,!1),r=document.createElement("CANVAS"),s=.9,t=Math.max((.9-l)/m,.05),u=.1,v=Math.min(Math.min(g/h.width,j/h.height),1),w=.9;r.width=h.width*v,r.height=h.height*v;var x=r.getContext("2d");x.drawImage(h,0,0,r.width,r.height);var y=r.toDataURL("image/jpeg",s),z=formatSize(a.size,"mb",!1),A=formatSize(y.length,"mb",!0);for(q&&A>20*k?t=.9-l:q&&A>10*k&&(t=.4);A>k&&s>l;)s-=t,y=r.toDataURL("image/jpeg",s),A=formatSize(y.length,"mb",!0);for(q&&A>3*k&&(w=.7,u=.15);A>k&&o&&w>.1;){for(r.width=h.width*v*w,r.height=h.height*v*w,s=1,x.drawImage(h,0,0,r.width,r.height);A>k&&s>l;)s-=t,y=r.toDataURL("image/jpeg",s),A=formatSize(y.length,"mb",!0);w-=u}var B=(new Date).getTime()-f;f=(new Date).getTime(),console.log(s),n&&console.log("For "+a.name+", took "+B+"ms, size is "+formatSize(y.length,p,!0).toFixed(3)+" "+p),e.push({dataurl:y,filename:a.name,mime:i,originalSize:formatSize(a.size,p,!1),finalSize:formatSize(y.length,p,!0),compression:parseFloat((100*(1-A/z)).toFixed(2)),time:B,originalWidth:h.width,originalHeight:h.height,finalWidth:r.width,finalHeight:r.height}),e.length===d&&(e=e.filter(function(a){return null!==a}),c(e))},h.onerror=function(){console.log(a.name+" is not a supported image format."),e.push(null)},g.onload=function(a){h.src=a.target.result},g.readAsDataURL(a)})}function imagesToResizedBlobs(a,b,c){imagesToResizedDataUrls(a,b,function(a){a.forEach(function(a){a.blob=dataURLtoBlob(a.dataurl),delete a.dataurl}),c(a)})}function dataURLtoBlob(a){for(var b=a.split(","),c=b[0].match(/:(.*?);/)[1],d=atob(b[1]),e=d.length,f=new Uint8Array(e);e--;)f[e]=d.charCodeAt(e);return new Blob([f],{type:c})}function base64StringFromDataUrl(a){try{return a.split(",")[1]}catch(b){return a}}