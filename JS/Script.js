//532 project

var map;
var selLayer;
var curLayer;
var dateCnst = "";
var layerPolys;
var month;
var year;
var valueGroups = [];
//slider
var slider = document.getElementById("myRange");
	
updateSlider = function(){
	var month = ((slider.value-1)%12)+1;
	var year = 2007+Math.floor((slider.value-1)/12);
    document.getElementById("sliderValue").innerHTML = month+" "+year;
	curLayer.setOptions({
		query: {
			select: "Latitude",
			from: selLayer,
			where: "'DateTime' >= '"+month+"/01/"+year+"' AND 'DateTime' <= '"+month+"/31/"+year+"'"
		}
	});
};
slider.oninput = function(){
	updateSlider();
};

// Set the layer (water quality test) according to the user's selection (RHS of main page)
setLayer = function(i){
	switch(i){
        case 0: selLayer="1fLMfcSWoNcHWxAntzKnXmNrfjfy-YSC_QbXqNcZI"; // Assign the appropriate table reference
		$(".selectedLayer").removeClass("selectedLayer");             // Remove the highlight from previous selection
		$('#bdisc').addClass("selectedLayer");                        // Add highlight to current selection
        setGroups(2, 5, 12);                                          // Set the range divisions for low, medium & high
		addLayer();                                                   // Update the map with user selections
    	break;
    	case 1: selLayer="1ejAYrtvIR-S7XzY7s6Qjj7d7sQu2TqLrMDTykwef";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#drp').addClass("selectedLayer");
        setGroups(0.010, 0.020, 0.050);
		addLayer();
    	break;
    	case 2: selLayer="1ia1bHfcAQrChqxtF9AEYz6_4MYfkegYJKDGcHZj8";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ecoli').addClass("selectedLayer");
        setGroups(540, 1000, 1200);
		addLayer();
    	break;
    	case 3: selLayer="1HqqTJHr7nyNccYWFrvvozPpqb0HXKcOPYxOg8v8S";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#nh4').addClass("selectedLayer");
        setGroups(0.03, 0.24, 1.30);
		addLayer();
    	break;
    	case 4: selLayer="1xPnv-6ahUxikMdn23Q2hF4ZFoDGmpFqx2zsoHBKf";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tb').addClass("selectedLayer");
        setGroups(0.03, 0.24, 1.30);
		addLayer();
    	break;
    	case 5: selLayer="1xEsdP3obQ3-vbR37KD7mXKSydQsfr8LQjIzpaQKI";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tn').addClass("selectedLayer");
        setGroups(160, 350, 750);
		addLayer();
    	break;
    	case 6: selLayer="1teN8WRrxEDmLfZbfGgGmXrEXYBR1nWCotJUy1_Hc";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ton').addClass("selectedLayer");
        setGroups(0.008, 0.007, 0.005);
		addLayer();
    	break;
    	case 7: selLayer="1Ztq6JuufyZ2Vq4UDK_i3RKv7OT9PDW0SYe035JGp";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#turb').addClass("selectedLayer");
        setGroups(1, 2.4, 6.9);
		addLayer();
    	break;
    }
    updateSlider();
};

// Marker divisions for assigning colours
function setGroups(a, b, c){
    valueGroups = [];
    valueGroups.push(a);
    valueGroups.push(b);
    valueGroups.push(c);
}

addLayer = function() {
    // Map in initial clear state
	if(curLayer!=null){
		curLayer.setMap(null);
	}

	// Add user's selected layer
	curLayer = new google.maps.FusionTablesLayer({
      map: map,
      heatmap: { enabled: false },
      query: {
        select: "Latitude",
        from: selLayer,
        where: dateCnst
      },
      options: {
        styleId: 2,
        templateId: 2
      },
      styles: [
          {
              where: "'OriginalValue' > " + valueGroups[2],
              markerOptions: {
                  iconName: "small_red"
              }
          },
          {
              where: "'OriginalValue' <= " + valueGroups[2],
              markerOptions: {
                  iconName: "small_yellow"
              }
          },
          {
              where: "'OriginalValue' <= " + valueGroups[1],
              markerOptions: {
                  iconName: "small_green"
              }
          },
          {
              where: "'OriginalValue' <= " + valueGroups[0],
              markerOptions: {
                  iconName: "small_blue"
              }
          }
      ]
    });

    // Collection site click event
    google.maps.event.addListener(curLayer, 'click', function(e) {

        // Add contents to the InfoWindow
        e.infoWindowHtml = "<div style=\" width: 650px; height: 400px; overflow: auto\">"+
            "<h2 style=\"padding-top: 15px; padding-left: 20px;\"><b>"+ e.row['SiteName'].value + "</b></h2>" +
            "<div style=\"padding-left: 30px; font-size: 16px;\">" + e.row['Region'].value + "<br>Site ID: " + e.row['LawaID'].value + "</div>" +
            "<div style=\"padding-left: 30px; font-size: 12px;\"><b>Longitude:</b>" + e.row['Longitude'].value + "<b> Latitude:</b>" + e.row['Latitude'].value + "</div>" +
            "<div style=\"padding-top: 20px;\"><img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=" + e.row['OriginalValue'].value + "&average=9&tubeColor=4&previousAverage=1&year="+ e.row['DateTime'].value +"&percentile=89th\">" +
            "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=9&average=9&tubeColor=2&previousAverage=1&year=2007&percentile=99th\" height=\"170\" width=\"120\">" +
            "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=2.13&average=5&tubeColor=1&previousAverage=9&year=2008&percentile=17th\" height=\"170\" width=\"120\">" +
            "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=5.7&average=7&tubeColor=3&previousAverage=5&year=2009&percentile=50th\" height=\"170\" width=\"120\">" +
            "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=5.7&average=7&tubeColor=0&previousAverage=7&year=2009&percentile=50th\" height=\"170\" width=\"120\"> "+
            "</div></div>";
    });
};

// Create the underlying map
initialize = function() {
    var mapDiv = document.getElementById('map');
	setLayer(0);
       
    map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(-40.173627, 172.524935),
      zoom: 5,
      styles: [
          {
            elementType: 'geometry',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#f5f5f5'}]
          },
          {
            featureType: 'administrative.land_parcel',
            elementType: 'labels.text.fill',
            stylers: [{color: '#bdbdbd'}]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#ffffff'}]
          },
          {
            featureType: 'road.arterial',
            elementType: 'labels.text.fill',
            stylers: [{color: '#757575'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#dadada'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#616161'}]
          },
          {
            featureType: 'road.local',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          },
          {
            featureType: 'transit.line',
            elementType: 'geometry',
            stylers: [{color: '#e5e5e5'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'geometry',
            stylers: [{color: '#eeeeee'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#c9c9c9'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9e9e9e'}]
          }
        ]
    });
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend-open'));
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('googft-legend'));

    // Add the layer which displays the river boundaries
    layerPolys = new google.maps.FusionTablesLayer({
      map: map,
      heatmap: { enabled: false },
      query: {
        select: "col3",
        from: "1ImJBP7m2013jjmbLg6Hm0oxe4WwPizbbAr-6_GpT",
        where: ""
      },
      options: {
        styleId: 2,
        templateId: 2
      }
    });

    addLayer();
};

//initilises the map
initialize();



//hide show layers on zoom
//currently as test
google.maps.event.addListener(map, 'zoom_changed', function() { 
    var zoomLevel = map.getZoom(); 
    // Show a finer geometry when the map is zoomed in 
    if (zoomLevel >= 5) { 
          layerPolys.setMap(map);
    } 
    // Show a coarser geometry when the map is zoomed out 
     else { 
          layerPolys.setMap(null);          
    } 
});

updateSlider();