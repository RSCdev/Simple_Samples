var win = Ti.UI.createWindow({ backgroundColor: '#fff' });

var view = Ti.UI.createView();

var web = Ti.UI.createWebView({
    url: 'http://www.google.com/'
});

var image = Ti.UI.createImageView({
    image: 'default_app_logo.png'
});

view.add(web);
view.add(image);


win.add(view);

web.addEventListener('load', function() {
    var image = web.toImage();
    Ti.Filesystem
            .getFile(Titanium.Filesystem.applicationDataDirectory, 'snapshot_blob.png')
            .write(Ti.Android ? image.media : image);
    alert('PASS: Image saved.');
});

win.open();


