'use strict'

var ctx;

window.onload = function(){
	var ctx = document.getElementById("chart").getContext("2d");


	var data = {
		labels: [1, 2, 3, 4, 5, 6, 7],
		datasets: [
			{
				label: "Frequency",
				fill: false,
				lineTension: 0.1,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40],
				spanGaps: false,
			}
		]
	};
	var latestLabel = data.labels[6];


	var myLineChart = Chart.Line(ctx, {
		data: data
	});;
}



//------------- TOGGLE VISIBILITY ------------- // 
function toggle_visibility(id) {
	var div = document.getElementById(id);
	if(div.style.display == 'block')
		div.style.display = 'none';
	else
		div.style.display = 'block';
}

if (window.DeviceMotionEvent) {
    alert('Devicemotion supported');
    window.addEventListener('devicemotion', function(ev) {
        var acc = ev.accelerationIncludingGravity;
        dmHdlr(acc.x, acc.y, acc.z);
    }, false);
}
else {
    log("devicemotion not supported on your device");
}

var lastDM = new Date().getTime();

function dmHdlr(aX, aY, aZ) {
    var currDM = new Date().getTime();
    lastDM = currDM;
    
    s$('aX').innerHTML = aX ? aX.toFixed(3) : '?';
    s$('aY').innerHTML = aY ? aY.toFixed(3) : '?';
    s$('aZ').innerHTML = aZ ? aZ.toFixed(3) : '?';
}