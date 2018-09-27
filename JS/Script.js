//532 project

var map;
var selLayer;
var curLayer;
var dateCnst = "";
var layerPolys;
var month;
var year;

setLayer = function(i){
	switch(i){
    	case 0: selLayer="1fLMfcSWoNcHWxAntzKnXmNrfjfy-YSC_QbXqNcZI";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#bdisc').addClass("selectedLayer");
		addLayer();
    	break;
    	case 1: selLayer="1ejAYrtvIR-S7XzY7s6Qjj7d7sQu2TqLrMDTykwef";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#drp').addClass("selectedLayer");
		addLayer();
    	break;
    	case 2: selLayer="1ia1bHfcAQrChqxtF9AEYz6_4MYfkegYJKDGcHZj8";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ecoli').addClass("selectedLayer");
		addLayer();
    	break;
    	case 3: selLayer="1HqqTJHr7nyNccYWFrvvozPpqb0HXKcOPYxOg8v8S";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#nh4').addClass("selectedLayer");
		addLayer();
    	break;
    	case 4: selLayer="1xPnv-6ahUxikMdn23Q2hF4ZFoDGmpFqx2zsoHBKf";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tb').addClass("selectedLayer");
		addLayer();
    	break;
    	case 5: selLayer="1xEsdP3obQ3-vbR37KD7mXKSydQsfr8LQjIzpaQKI";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tn').addClass("selectedLayer");
		addLayer();
    	break;
    	case 6: selLayer="1teN8WRrxEDmLfZbfGgGmXrEXYBR1nWCotJUy1_Hc";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ton').addClass("selectedLayer");
		addLayer();
    	break;
    	case 7: selLayer="1Ztq6JuufyZ2Vq4UDK_i3RKv7OT9PDW0SYe035JGp";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#turb').addClass("selectedLayer");
		addLayer();
    	break;
    }
}
addLayer = function() {
	if(curLayer!=null){
		curLayer.setMap(null);
	}
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
      }
    });
}

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
}

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

//slider
var slider = document.getElementById("myRange");
sliderFunction = function(){
	month = getMonth((slider.value-1)%12);
	year = 2006+Math.floor((slider.value-1)/12);
    document.getElementById("sliderValue").innerHTML = month+" "year;
}
sliderFunction();
// Update the current slider value (each time you drag the slider handle)
slider.oninput = sliderFunction();
