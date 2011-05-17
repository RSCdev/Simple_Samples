var win = Ti.UI.createWindow();


win.open();

// the desired image widths
var imageSizes = [1200,800,600,200];

// open the photo gallery
Titanium.Media.openPhotoGallery({

// if success:
	success:function(event){
		// this is the image chosen
		var myImage = event.media;
		if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
			// let's loop through that array
			for(var i = 0; i < imageSizes.length; i++){
				// create a new file
				var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, 'image'+i+'.png');
				// get the width from the array
				var newWidth = imageSizes[i];
				// write the file as toImage()
				file.write(
					Ti.UI.createImageView({
						image:myImage, //file name
						width:newWidth, // file new width
						height:(newWidth/myImage.width)*myImage.height // some math to get the height
					}).toImage()
				);	
				// done, loop again
			}		
		} else {

		}
	},
	cancel:function(){

	},
	error:function(error){
	},
	mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO]
});
