//------------- Accessing and showing sensordata from phone ------------- // 
var s$ = function(e) {return document.getElementById(e);};

if (window.DeviceMotionEvent) {
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
    
    //s$('aX').innerHTML = aX ? aX.toFixed(3) : '?';
    //s$('aY').innerHTML = aY ? aY.toFixed(3) : '?';
    s$('aZ').innerHTML = aZ ? aZ.toFixed(3) : '?';
}





	function toggleAcc(){
		if(startAcc==false){
			log('GOO!');
			startAcc=true;
		}
		else {
			startAcc=false;
			log('STAAAHP');
		}
	}

	//------------- Accessing and showing sensordata from phone ------------- // 
	do{
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
			myLineChart.data.datasets[0].data.push(aZ);
			myLineChart.data.labels = [(i+0), (i+1), (i+2), (i+3), (i+4), (i+5), (i+6), (i+7), (i+8), (i+9)];
			i++;
			myLineChart.update();
		}
	}
	while(startAcc==true);