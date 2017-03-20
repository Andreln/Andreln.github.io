
var ctx;
var data;
var myLineChart;

//------------- Set data in chart------------- //

var data = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: [{
      title: "Z-data",
      label: "Frequency",
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
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
  log('Chart data set');

  ctx = document.getElementById("chart").getContext("2d");

  var myLineChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: {
    scales: {
        yAxes: [{
            ticks: {
                max: 5,
                min: -5,
                stepSize: 1
            }
        }]
    },
    animation: {
      duration: 0
    },
    responsive: true
  }
});

  log('Chart Initialized');

function updateGraph(y) {
    let d = new Date();
    timeX = d.getMilliseconds();

    myLineChart.data.datasets[0].data.shift();           // Shift array one step to the left
  	myLineChart.data.datasets[0].data.push(y);          // Insert accelerometer value to the right in array
 	  myLineChart.data.labels.shift();
    myLineChart.data.labels.push(timeX)   // Incremet x-labels

  	myLineChart.update();
}


//------------- Accessing and showing sensordata from phone ------------- //
// function deviceMotion(){
// 	var s$ = function(e) {return document.getElementById(e);};
//
// 	if (window.DeviceMotionEvent) {
// 		window.addEventListener('devicemotion', function(ev) {
// 			var acc = ev.acceleration;
// 			dmHdlr(acc.z);
// 		}, false);
// 	}
// 	else {
// 		log("devicemotion not supported on your device");
// 	}
//
// 	var lastDM = new Date().getTime();
//
// 	function dmHdlr(aZ) {
// 		var currDM = new Date().getTime();
// 		lastDM = currDM;
//
// 		s$('aZ').innerHTML = aZ ? aZ.toFixed(3) : '?';
//
//     let i = 0;
// 		myLineChart.data.datasets[0].data.shift();           // Shift array one step to the left
// 		myLineChart.data.datasets[0].data.push(aZ);          // Insert accelerometer value to the right in array   // Incremet x-labels
// 		myLineChart.update();
// 	}
// }
