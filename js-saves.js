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