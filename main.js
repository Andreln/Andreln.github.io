'use strict'

var ctx;
var data;
var myLineChart;
var N = 10;
var zero_array = [];
var i = 0;

for (let x = 0; x < N; x++)
    zero_array.push(0);

var data = {
	labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	datasets: [{
		title: "Z-data",
		label: "Frequency",
		data: [1, 1, 2, 3, 4, 5, 6, 7, 8, 9],
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
		duration: 10,
		
		spanGaps: false,
	}]
};

window.onload = function(){
	var ctx = document.getElementById("chart").getContext("2d");
		
	var myLineChart = new Chart(ctx, {
	type: 'line',
    data: data,
    options: {
        responsive: true,
		animation: false,
        scales: {
            yAxes: [{
                ticks: {
                    max: 20,
                    min: -20,
                    stepSize: 4
                }
            }]
		}
	}
});
	
	var index = 1;
	
	
	//------------- Accessing and showing sensordata from phone ------------- // 
	
	var s$ = function(e) {return document.getElementById(e);};

	if (window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', function(ev) {
			var acc = ev.acceleration;
			dmHdlr(acc.z);
		}, false);
	}
	else {
		log("devicemotion not supported on your device");
	}

	var lastDM = new Date().getTime();

	function dmHdlr(aZ) {
		var currDM = new Date().getTime();
		lastDM = currDM;
	
		s$('aZ').innerHTML = aZ ? aZ.toFixed(3) : '?';
	
	myLineChart.data.datasets[0].data.shift();
	myLineChart.data.datasets[0].data.push(az);
	myLineChart.data.labels = [(i+0), (i+1), (i+2), (i+3), (i+4), (i+5), (i+6), (i+7), (i+8), (i+9)];
	i++;
	myLineChart.update();
	}
}


//------------- TOGGLE VISIBILITY ------------- // 
function toggle_visibility(id) {
	var div = document.getElementById(id);
	if(div.style.display == 'block')
		div.style.display = 'none';
	else
		div.style.display = 'block';
}




