//
// Global state
//
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
// 
//

//
// First time run: request current location, with callback to Start
//
$( document ).ready(function() {

	if (navigator.geolocation)  {
		navigator.geolocation.getCurrentPosition(Start);
	}


	function UpdateMapById(id, tag) {

		var target = document.getElementById(id);
		if (target != null) {
		var data = target.innerHTML;

		var rows  = data.split("\n");
   
		for (i in rows) {
		var cols = rows[i].split("\t");
		var lat = cols[0];
		var long = cols[1];

		markers.push(new google.maps.Marker({ map:map,
								position: new google.maps.LatLng(lat,long),
								title: tag+"\n"+cols.join("\n")}));
	
		}
		}
	}

	function ClearMarkers()
	{
		// clear the markers
		while (markers.length>0) { 
		markers.pop().setMap(null);
		}
	}


	function UpdateMap(selections)
	{
		var color = document.getElementById("color");
	
		color.innerHTML="<b><blink>Updating Display...</blink></b>";
		color.style.backgroundColor='white';

		ClearMarkers();

		var num_selections = 0;
		if (selections["Committee"] === true) {
		  UpdateMapById("committee_data","COMMITTEE");
		  num_selections++;
		} 
		if (selections["Candidate"] === true) {
		  UpdateMapById("candidate_data","CANDIDATE");
		}
		if (selections["Individual"] === true) {
		  UpdateMapById("individual_data","INDIVIDUAL");
		  num_selections++;
		}
		if (selections["Opinion"] === true) {
		  UpdateMapById("opinion_data","OPINION");
		  num_selections++;
		}

		//UpdateMapById("committee_data","COMMITTEE");
		//UpdateMapById("candidate_data","CANDIDATE");
		//UpdateMapById("individual_data", "INDIVIDUAL");
		//UpdateMapById("opinion_data","OPINION");


		color.innerHTML="Ready";
		/*
		if (Math.random()>0.5) { 
		color.style.backgroundColor='blue';
		} else {
		color.style.backgroundColor='red';
		}
		*/
		
		if ($('#color-com').length > 0 || $('#color-ind').length > 0 || $('#color-opinions').length > 0) {
		  color.innerHTML = '';
		}
		
		if ($('#color-com').length > 0) {  
		  if (num_selections === 2) {
		    $('#color-com').css('width', '50%');
		  } else if (num_selections === 3) {
		    $('#color-com').css('width', '34%');
		  }
		  $('#color-com').appendTo('#color');
		}
		
		if ($('#color-ind').length > 0) {
		  if (num_selections === 2) {
		    $('#color-ind').css('width', '50%');
		  } else if (num_selections === 3) {
		    $('#color-ind').css('width', '33%');
		  }
		  $('#color-ind').appendTo('#color');
		}
		
		if ($('#color-opinions').length > 0) {
		  if (num_selections === 2) {
		    $('#color-opinions').css('width', '50%');
		  } else if (num_selections === 3) {
		    $('#color-opinions').css('width', '33%');
		  }
		  $('#color-opinions').appendTo('#color');
		}
	
	}

	function NewData(data, selections)
	{
	  var target = document.getElementById("data");
  
	  target.innerHTML = data;

	  UpdateMap(selections);

	}

	function ViewShift()
	{
		var bounds = map.getBounds();

		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();

		var color = document.getElementById("color");

		color.innerHTML="<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>";
		color.style.backgroundColor='white';
		var selections = {};
		var cycle = $('#Cycle').val();
		var url = "rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng()+"&cycle="+cycle+"&format=raw&what=";

		if ($('#Committee').is(':checked')) {
		  url += "committees,";
		  selections["Committee"] = true;
		}
		if ($('#Candidate').is(':checked')) {   
		  url += "candidates,";
		  selections["Candidate"] = true;
		}
		if ($('#Individual').is(':checked')) {   
		  url += "individuals,";
		  selections["Individual"] = true;
		}
		if ($('#Opinion').is(':checked')) {
		  url += "opinions,";
		  selections["Opinion"] = true;
		}
		url = url.substring(0, url.length-1);
		// debug status flows through by cookie
		$.get(url, function(data) {NewData(data, selections);});
	}


	function Reposition(pos)
	{
		var lat=pos.coords.latitude;
		var long=pos.coords.longitude;
	
		map.setCenter(new google.maps.LatLng(lat,long));
		usermark.setPosition(new google.maps.LatLng(lat,long));
	}


	function Start(location) 
	{
	  var lat = location.coords.latitude;
	  var long = location.coords.longitude;
	  var acc = location.coords.accuracy;
  
	  if ($('#give-opinion-data').length) { 
		var old_url = $('#give-opinion-data').attr('href');
		var new_url = old_url+"&lat="+lat+"&long="+long;
		$('#give-opinion-data').attr('href',new_url);
	  }

	  var mapc = $( "#map");

	  map = new google.maps.Map(mapc[0], 
					{ zoom:16, 
					center:new google.maps.LatLng(lat,long),
					mapTypeId: google.maps.MapTypeId.HYBRID
					} );

	  usermark = new google.maps.Marker({ map:map,
							position: new google.maps.LatLng(lat,long),
							title: "You are here"});

	  markers = new Array;

	  var color = document.getElementById("color");
	  color.style.backgroundColor='white';
	  color.innerHTML="<b><blink>Waiting for first position</blink></b>";

	  google.maps.event.addListener(map,"bounds_changed",ViewShift);
	  google.maps.event.addListener(map,"center_changed",ViewShift);
	  google.maps.event.addListener(map,"zoom_changed",ViewShift);

	  navigator.geolocation.watchPosition(Reposition);

	}

	$('#Cycle').change(function() {
	  ViewShift();
	});

	$('#Committee').change(function() {
	  ViewShift();
	});

	$('#Candidate').change(function() {
	  ViewShift();
	});

	$('#Individual').change(function() {
	  ViewShift();
	});

	$('#Opinion').change(function() {
	  ViewShift();
	});

});

