//532 project

var map;
var selLayer;
var curLayer;
var regionLayer;
var dateCnst = "";
var layerPolys;
var valueGroups = [];
var units = "";
var layersHidden = true;
var isZoomed = false;
var selLayerNum;
var style = [];

//change layer bar
var nav = document.createElement("div");
nav.id = "nav";
var layerText = document.createElement("span");
layerText.appendChild(document.createTextNode("Layer: "));
nav.appendChild(layerText);

var arrow = (document.createElement("span"));
arrow.className = "arrowDown";
arrow.onclick = function(){
	if(layersHidden){
		$(".hideLayers").removeClass("hideLayers");
		arrow.className = "arrowUp";
		layersHidden = false;
	} else {
		$(".layer").addClass("hideLayers");
		arrow.className = "arrowDown";
		layersHidden = true;
	}
}

//add layer nav items to map
var layerIds = ["bdisc","drp","ecoli","nh4","tb","tn","ton","turb"];
var layerText = ["Black disc visibility","Dissolved reactive Phosphorus","E. coli","Ammoniacal Nitrogen","Total Phosphorus","Total Nitrogen","Total Oxidised Nitrogen","Turbidity"];

nav.appendChild(arrow);

for(var i = 0; i < 8; i++){
	var tmp = document.createElement("div");
	tmp.id = layerIds[i];
	tmp.appendChild(document.createTextNode(layerText[i]));
	tmp.setAttribute('onclick', 'setLayer('+i+')');
	$(tmp).addClass("layer");
	$(tmp).addClass("hideLayers");
	nav.appendChild(tmp);
}

//slider
var slider = document.createElement("input");
var sliderValue = document.createElement("output");
var sliderContainer = document.createElement("div");

slider.setAttribute("type","range");
slider.setAttribute("min","1");
slider.setAttribute("max","120");
slider.setAttribute("value","120");
slider.className = "slider";
slider.id = "slide";
slider.oninput = function(){
	updateSlider();
}
sliderValue.setAttribute("for","slide");
sliderValue.id = "sliderValue";
sliderContainer.id = "sliderContainer";

var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
	
updateSlider = function(){
	if(curLayer!=null){
		var month = ((slider.value-1)%12)+1;
		var year = 2007+Math.floor((slider.value-1)/12);
		sliderValue.innerHTML = months[month-1]+" "+year;
		dateCnst = "'DateTime' >= '"+month+"/01/"+year+"' AND 'DateTime' <= '"+month+"/31/"+year+"'";
		curLayer.setOptions({
			query: {
				select: "Latitude",
				from: selLayer,
				where: dateCnst
			}
		});
		var width = sliderContainer.offsetWidth;
		var tmp = (slider.value-1)/119;
		if(width*tmp-25<0){
			tmp=(25/width);
		} if(width*tmp >width-30){
			tmp = (width-30)/width;
		}
		$(sliderValue).css('left','calc('+tmp*100+'% - 25px)');	
		getData();	
	}
}
function getData() {
	//update region styles
	var opts = {sendMethod: 'auto'};
	var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata', opts);
	query.setQuery("SELECT 'col2', 'OriginalValue' FROM "+selLayer+" WHERE "+dateCnst);
	query.send(handleQueryResponse);
}

function region(_name, _value){
	this.name = _name, 
	this.value = _value, 
	this.count = 1
};
			
function handleQueryResponse(response){
	if(!response.isError()){
		var regions = [];
		var data = response.getDataTable();
		var rows = data.getNumberOfRows();
		for(var i = 0; i < rows; i++){
			var contains = false;
			var x = 0;
			while((x < regions.length) && !contains){
				if(regions[x].name == data.getValue(i,0)){
					regions[x].value += data.getValue(i,1);
					regions[x].count++;
					contains = true;
				}
				x++;
			}
			if(!contains){
				regions.push(new region(data.getValue(i,0),data.getValue(i,1)));
			}
		}
		var red;
		var yellow;
		var green;
		var blue;
		for(var n = 0; n < regions.length; n++){
			var avg = (regions[n].value/regions[n].count);
			if(avg > valueGroups[2]){
				red+=",'"+regions[n].name+"'";
				} else if((avg <= valueGroups[2])&& (avg > valueGroups[1])){
					yellow+=",'"+regions[n].name+"'";
					} else if((avg <= valueGroups[2])&&(avg > valueGroups[1])){
						green+=",'"+regions[n].name+"'";	
						} else{
							blue+=",'"+regions[n].name+"'";
						}
			}
			
			style.push({where: "'regNames' IN('nores'"+red+")",
								polygonOptions:{
									fillColor: "#ff2d00"
								}
							});
			style.push({where: "'regNames' IN('nores'"+yellow+")",
								polygonOptions:{
									fillColor: "#fbff00"
								}
							});
			style.push({where: "'regNames' IN('nores'"+green+")",
								polygonOptions:{
									fillColor: "#42d004"
								}
							});
			style.push({where: "'regNames' IN('nores'"+blue+")",
								polygonOptions:{
									fillColor: "#0442d0"
								}
							});						
	}
}
slider.oninput = function(){
	updateSlider();
}

// Set the layer (water quality test) according to the user's selection
setLayer = function(i){
	selLayerNum = i;
	switch(i){
        case 0: selLayer="1fLMfcSWoNcHWxAntzKnXmNrfjfy-YSC_QbXqNcZI";   // Assign the appropriate table reference
		$(".selectedLayer").removeClass("selectedLayer");               // Remove the highlight from previous selection
		$('#bdisc').addClass("selectedLayer");                          // Add highlight to current selection
        setGroups(2, 5, 12);                                            // Set the range divisions for low, medium & high
        units = "mg/m<sup>3</sup>";                                                     // Set the units to be used
		addLayer();                                                     // Update the map with user selections
		break;
    	case 1: selLayer="1ejAYrtvIR-S7XzY7s6Qjj7d7sQu2TqLrMDTykwef";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#drp').addClass("selectedLayer");
        setGroups(0.010, 0.020, 0.050);
        units = "mg/m<sup>3</sup>";
		addLayer();
    	break;
    	case 2: selLayer="1ia1bHfcAQrChqxtF9AEYz6_4MYfkegYJKDGcHZj8";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ecoli').addClass("selectedLayer");
        setGroups(540, 1000, 1200);
        units = "E. coli/100 mL";
		addLayer();
    	break;
    	case 3: selLayer="1HqqTJHr7nyNccYWFrvvozPpqb0HXKcOPYxOg8v8S";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#nh4').addClass("selectedLayer");
        setGroups(0.03, 0.24, 1.30);
        units = "mg NH<sub>4</sub>-N/L";
		addLayer();
    	break;
    	case 4: selLayer="1xPnv-6ahUxikMdn23Q2hF4ZFoDGmpFqx2zsoHBKf";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tb').addClass("selectedLayer");
        setGroups(0.03, 0.24, 1.30);
        units = "mg/m<sup>3</sup>";
		addLayer();
    	break;
    	case 5: selLayer="1xEsdP3obQ3-vbR37KD7mXKSydQsfr8LQjIzpaQKI";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#tn').addClass("selectedLayer");
        setGroups(160, 350, 750);
        units = "mg/m<sup>3</sup>";
		addLayer();
    	break;
    	case 6: selLayer="1teN8WRrxEDmLfZbfGgGmXrEXYBR1nWCotJUy1_Hc";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#ton').addClass("selectedLayer");
        setGroups(0.008, 0.007, 0.005);
        units = "mg NO<sub>3</sub>-N/L";
		addLayer();
    	break;
    	case 7: selLayer="1Ztq6JuufyZ2Vq4UDK_i3RKv7OT9PDW0SYe035JGp";
		$(".selectedLayer").removeClass("selectedLayer");
		$('#turb').addClass("selectedLayer");
        setGroups(1, 2.4, 6.9);
        units = "mg NO<sub>3</sub>-N/L";
		addLayer();
    	break;
    }
    updateSlider();
}

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
	  suppressInfoWindows: true,
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
    
    // Create the legend and display on the map
    var tmp = document.getElementById("legend");

    var content = [];
    content.push('<h3>Values ('+units+')</h3>');
    content.push('<p><div class="color blue"></div>0 - '+valueGroups[0]+'</p>');
    content.push('<p><div class="color green"></div>'+valueGroups[0]+' - '+valueGroups[1]+'</p>');
    content.push('<p><div class="color yellow"></div>'+valueGroups[1]+' - '+valueGroups[2]+'</p>');
    content.push('<p><div class="color red"></div>'+valueGroups[2]+'+</p>');

    if(document.body.contains(tmp))
    {
        tmp.innerHTML = content.join('');
    }else{
        var legend = document.createElement('div');
        legend.id = 'legend';
        legend.innerHTML = content.join('');
        legend.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    }

    // Collection site click event
    google.maps.event.addListener(curLayer, 'click', function(e) {

        var content = [];
        content.push('<h2 style=padding-top: 10px; padding-left: 20px; ><b>'+ e.row['SiteName'].value +'</b></h2>');
        content.push('<div style=padding-left: 30px; padding-bottom: 5px; font-size: 16px;><i>'
            + e.row['Region'].value + '</i><br>Site ID: ' + e.row['LawaID'].value + '</div>');
        content.push('<div style=padding-left: 30px; padding-top:5px; font-size: 10px;><b>Longitude:</b>'
            + e.row['Longitude'].value + ' <br><b>Latitude:</b>' + e.row['Latitude'].value + '</div>');
        content.push('<div style=padding-top: 15px;>' +
            '<img src="http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue='
                + e.row['OriginalValue'].value + '&average=9&tubeColor=4&previousAverage=1&year='+ e.row['DateTime'].value +'&percentile=89th">' +
            '<img src="http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue='
                + e.row['OriginalValue'].value + '&average=3&tubeColor=2&previousAverage=5&year='+ e.row['DateTime'].value +'&percentile=66th">');


        // content.push('<div style=padding-top: 15px;><img src="http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue='
        //     + e.row['OriginalValue'].value + '&average=3&tubeColor=2&previousAverage=5&year='+ e.row['DateTime'].value +'&percentile=66th">');
        // content.push('<div style=padding-top: 15px;><img src="http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue='
        //     + e.row['OriginalValue'].value + '&average=6&tubeColor=3&previousAverage=6&year='+ e.row['DateTime'].value +'&percentile=38th">');
        // content.push('<div style=padding-top: 15px;><img src="http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue='
        //     + e.row['OriginalValue'].value + '&average=4&tubeColor=1&previousAverage=3&year='+ e.row['DateTime'].value +'&percentile=75th">');


        var infoG = document.getElementById('infographic');
        if(document.body.contains(infoG)) {
            // Update the existing info graphic window
            infoG.innerHTML = content.join('');
        }else{
            // Create the info graphic window
            var infoGraphic = document.createElement('div');
            infoGraphic.id = 'infographic';
            infoGraphic.innerHTML = content.join('');
            infoGraphic.index = 1;
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(infoGraphic);
        }

        // e.infoWindowHtml = "<div style=\" width: 650px; height: 350px; overflow: auto\">"+
        //     "<h2 style=\"padding-top: 10px; padding-left: 20px;\"><b>"+ e.row['SiteName'].value + "</b></h2>" +
        //     "<div style=\"padding-left: 30px; padding-bottom: 5px; font-size: 16px;\"><i>" + e.row['Region'].value + "</i><br>Site ID: " + e.row['LawaID'].value + "</div>" +
        //     "<div style=\"padding-left: 30px; padding-top:5px; font-size: 10px;\"><b>Longitude:</b>" + e.row['Longitude'].value + " <br><b>Latitude:</b>" + e.row['Latitude'].value + "</div>" +
        //     "<div style=\"padding-top: 15px;\"><img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=" + e.row['OriginalValue'].value + "&average=9&tubeColor=4&previousAverage=1&year="+ e.row['DateTime'].value +"&percentile=89th\">" +
        //     "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=9&average=9&tubeColor=2&previousAverage=1&year=2007&percentile=99th\" height=\"170\" width=\"120\">" +
        //     "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=2.13&average=5&tubeColor=1&previousAverage=9&year=2008&percentile=17th\" height=\"170\" width=\"120\">" +
        //     "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=5.7&average=7&tubeColor=3&previousAverage=5&year=2009&percentile=50th\" height=\"170\" width=\"120\">" +
        //     "<img src=\"http://occupodo.ddns.net:3000/?minIn=0&maxIn=10&originalValue=5.7&average=7&tubeColor=0&previousAverage=7&year=2009&percentile=50th\" height=\"170\" width=\"120\"> "+
        //     "</div></div>";
    });
}

// Create the underlying map
initialize = function() {
    var mapDiv = document.getElementById('map');
       
    map = new google.maps.Map(mapDiv, {
      center: new google.maps.LatLng(-41.273627, 172.524935),
      zoom: 5,
	  maxZoom: 15,
	  minZoom: 5,
	  gestureHandling: 'greedy',
	  mapTypeControl: false,
	  streetViewControl: false,
	  fullscreenControl: true,
	  zoomControlOptions: {
		  position: google.maps.ControlPosition.RIGHT_TOP
	  },
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
	  suppressInfoWindows: true,
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
	
	regionLayer = new google.maps.FusionTablesLayer({
		heatmap: { enabled: false },
		query: {
			select: 'geometry',
			from: "1EELxO6MjbVJW6_LG-n0_xrZ9qtNYLHIQIim7iNUN",
		},
		map: map,
		options: {
			styleId: 2,
			templateId: 2
      }
	});	
	
	sliderContainer.appendChild(sliderValue);
	sliderContainer.appendChild(slider);
	map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(sliderContainer);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(nav);
	
	google.maps.event.addListenerOnce(map, 'idle', function() {
		var checkLoad = window.setInterval(check, 1000);
		
		function check(){
			if(!$(".selectedLayer").length){
				updateSlider();
				setLayer(0);
				clearInterval(checkLoad);
			}
		}
	});
}
// initialises the map
initialize();

//hide show layers on zoom
//currently as test
google.maps.event.addListener(map, 'zoom_changed', function() { 
	var zoomLevel = map.getZoom(); 
	// Show a finer geometry when the map is zoomed in 
	if (zoomLevel > 8 && !isZoomed) { 
		changeZoomLayers(true);
	} 
	// Show a coarser geometry when the map is zoomed out 
	else if(zoomLevel <= 8 && isZoomed) { 
		changeZoomLayers(false);
	} 	
});
//update slider on map resize incl fullscreen
google.maps.event.addListener(map, 'resize', function() {
	updateSlider();
});

function changeZoomLayers(isZoomedIn){
	if(isZoomedIn){
		regionLayer.setMap(null);
		isZoomed = true;
	} else {
		regionLayer.setMap(map);
		if(curLayer!=null){
			curLayer.setMap(null);
			curLayer.setMap(map);
		}
		isZoomed = false;
	}	
}

google.charts.load('current', {callback: getData});
