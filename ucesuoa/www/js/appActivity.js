function getDistance() {
alert('getting distance');
// getDistanceFromPoint is the function called once the distance has been found
navigator.geolocation.getCurrentPosition(getDistanceFromPoint);
}
function getDistanceFromPoint(position) {
// find the coordinates of a point using this website: 
// these are the coordinates for Warren Street
L.marker([51.524616,-0.13818]).addTo(mymap).bindPopup("<b>I am Warren Street!</b>").openPopup();

var lat = 51.524616;
var lng = -0.13818;
// return the distance in kilometers
var distance = calculateDistance(position.coords.latitude, position.coords.longitude, lat,lng, 'K');
alert('The distance is: '+distance +'km');
if (distance < 0.1){
    alert ('Your are close to Warren Street!');
    L.marker([position.coords.latitude,position.coords.longitude]).addTo(mymap).bindPopup("<b>I am your place!</b>").openPopup();
}
else{
    alert ('Your are not close to Warren Street!');
}
//document.getElementById('showDistance').innerHTML = "Distance: " + distance;
}
// code adapted from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-inyour-web-apps.html
function calculateDistance(lat1, lon1, lat2, lon2, unit) {
 var radlat1 = Math.PI * lat1/180;
 var radlat2 = Math.PI * lat2/180;
 var radlon1 = Math.PI * lon1/180;
 var radlon2 = Math.PI * lon2/180;
 var theta = lon1-lon2;
 var radtheta = Math.PI * theta/180;
 var subAngle = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
 subAngle = Math.acos(subAngle);
 subAngle = subAngle * 180/Math.PI; // convert the degree value returned by acos back to degrees from radians
 dist = (subAngle/360) * 2 * Math.PI * 3956; // ((subtended angle in degrees)/360) * 2 * pi * radius )
// where radius of the earth is 3956 miles
 if (unit=="K") { dist = dist * 1.609344 ;} // convert miles to km
 if (unit=="N") { dist = dist * 0.8684 ;} // convert miles to nautical miles
 return dist;
}




function getLocation() {
alert('getting location');
navigator.geolocation.getCurrentPosition(getPosition);
}
function getPosition(position) {
L.marker([position.coords.latitude,position.coords.longitude]).addTo(mymap).bindPopup("<b>Hello world!</b><br/>I am your position."
        +"<dt>This is the postion: </dt>"
        +"("+position.coords.latitude + "," + position.coords.longitude + ")"
        ).openPopup();
}

function deleteAll(){
//    if (earthquakelayer==True){
//        mymap.removeLayer(earthquakelayer);
//    }
//    if (busstoplayer==True){
//        mymap.removeLayer(busstoplayer);
//    }
//    mymap.removeLayer(earthquakelayer);
//    mymap.setView([51.505,-0.09],13);
   mymap.eachLayer(function (layer) {
   mymap.removeLayer(layer);
});
   mymap.setView([51.505,-0.09],13);
    
        
}
function menuClicked(){
    alert("You clicked the menu!")
}

function addGeometry(){
    //add a point
    L.marker([51.5,-0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br/>I am a popup.").openPopup();
    //add a circle
    L.circle([51.508, -0.11],500,{
        color:'red',
        fillColor:'#f03',
        fillOpacity:0.5
    }).addTo(mymap).bindPopup("I am a circle.");
    //add a polygon with 3 end points(i.e. a triangle)
    var myPolygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ],{
        color:'red',
        fillColor:'#f03',
        fillOpacity:0.5
    }).addTo(mymap).bindPopup("I am a polygon.");
    mymap.setView([51.505,-0.09],13);
}

function replaceGraphs(){
    document.getElementById("graphdiv").innerHTML ="<img src='images/ucl.png'>"
}

//create a variable for each of the layer we want to load/remove-->
var earthquakelayer;
var busstoplayer;
//create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the some varaible
var client;
var testMarkerRed = L.AwesomeMarkers.icon({
    icon: 'play',
    markerColor: 'red'
});
        
var testMarkerPink = L.AwesomeMarkers.icon({
    icon: 'play',
    markerColor: 'pink'
});
        
//create the code to get the data using an XMLHttpRequest
function getData(layername){
    client = new XMLHttpRequest();
           
    //depending on the layername we get differnet URLs
    var url;
    if (layername == "earthquakes"){
        url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"
    }
    if (layername == "busstops") {
        url = "http://developer.cege.ucl.ac.uk:31265/busstops.geojson"
    }
    client.open('GET',url);
    client.onreadystatechange = dataResponse;
    client.send();
}
// create the code to wait for the response from the data server, and process the response once it is received
function dataResponse(){
    // this function listens out for the server to say that the data is ready - i.e. has state 4
    if(client.readyState==4){
        // once the data is ready, process the data
        var geoJSONData = client.responseText;
        loadLayer(geoJSONData);
    }
}
       
// convert the received data - which is text - to JSON format and add it to the map
function loadLayer(geoJSONData){
    //which layer did we actually load?
    if (geoJSONData.indexOf("earthquake")>0){
        var loadingEarthquakes = true;
    }
    if (geoJSONData.indexOf("IIT_METHOD")>0){
        var loadingBusstops = true;
    }
    //convert the text to JSON
    var json = JSON.parse(geoJSONData);
           
    //add the JSON layer onto the map - it will appear using the default icons
    if (loadingEarthquakes == true){
        earthquakelayer = L.geoJson(json,{
            pointToLayer: function(feature,latlng)
                {
                    if (feature.properties.mag>1.75){
                        return L.marker(latlng,{icon:testMarkerRed}).bindPopup("<dt>I am an earthquake, sniff :( </dt>"+"<dt>This is the address: </dt>"+feature.properties.place
                            +"<dt>This is the magnititude: </dt>"+ feature.properties.mag
                            +"<dt>Take care!!!</dt>");
                        
                    }
                    else{
                        //magnitude is 1.75 or less
                        return L.marker(latlng,{icon:testMarkerPink}).bindPopup("<dt>I am an earthquake, sniff :( </dt>"+"<dt>This is the address: </dt>"+feature.properties.place
                            +"<dt>This is the magnititude: </dt>"+ feature.properties.mag
                            +"<dt>Take care!!!</dt>");
                    }
                }
        }).addTo(mymap);
        if(earthquakelayer.feature == null){
            alert('Luckily, no earthquake in past one hour!');
        }
        mymap.fitBounds(earthquakelayer.getBounds());
        
    }
    if (loadingBusstops == true){
        busstoplayer = L.geoJson(json).addTo(mymap).bindPopup("<b>"+"I am just a bus stop :)!"+"<b>");
        mymap.fitBounds(busstoplayer.getBounds());
    }
}

//make sure that there is a variable for the earthquake layer to be referenced by 
//this should be GLOBAL - i.e. not inside a function - so that any code can see the varible
var earthquakelayer;
var busstoplayer;
//create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the some varaible
var client;
function removeData(layername){
    if (layername == "earthquakes"){
        alert ("remove the earthquake data here!");
        mymap.removeLayer(earthquakelayer);
    }
    if (layername == "busstops") {
        alert ("remove the bus data here!");
        mymap.removeLayer(busstoplayer);
    }
            
}




