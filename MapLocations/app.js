var win = Ti.UI.createWindow();

Ti.Geolocation.purpose="Test Location";

Titanium.Geolocation.getCurrentPosition(function(e)
{
               
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;

    Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
		{
			if (evt.success) {
				var places = evt.places;
				if (places && places.length) {
					reverseGeo = places[0].address;
				} else {
					reverseGeo = "No address found";
				}
            
            alert("You are at:\n "+longitude+"\n"+latitude+"\n\nAddress:\n"+reverseGeo+"\n\nFinding venues...");
			
            }
            else {
				Ti.UI.createAlertDialog({
					title:'Reverse geo error',
					message:evt.error
				}).show();
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
			}
		});

latMax= latitude+0.5;
latMin= latitude-5.5;
longMax= longitude +3.5;
longMin= longitude -3.5;

annotations=[];

var region = {latitude:latitude,longitude:longitude,latitudeDelta:10, longitudeDelta:10};

var myLoc = Titanium.Map.createAnnotation({
	latitude:latitude,
	longitude:longitude,
	title:"My Location",
	animate:true,
    pincolor:Titanium.Map.ANNOTATION_GREEN
});
annotations.push(myLoc);

var loc1 = Titanium.Map.createAnnotation({
	latitude:37.54537,
	longitude:-121.670101,
	title:"Business 1",
    animate:true,
    pincolor:Titanium.Map.ANNOTATION_RED
});

if(latMin<loc1.latitude && loc1.latitude<latMax && longMin<loc1.longitude && loc1.longitude<longMax){
annotations.push(loc1);
}

var mapview = Titanium.Map.createView({
	mapType: Titanium.Map.STANDARD_TYPE,
	animate:true,
    region:region,
    regionFit:true,
	annotations:annotations
});

win.add(mapview);
    
});

win.open();

