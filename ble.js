
const FREQ_Service_UUID         = '49f89999-edd1-4c81-8702-585449ba92a8';
const FREQ_Char_UUID            = '49f88888-edd1-4c81-8702-585449ba92a8';

const MPU_Service_UUID          = '00000004-1212-efde-1523-785fef13d123';
const MPU_Char_UUID             = '00000005-1212-efde-1523-785fef13d123';

const MPU_Control_Service_UUID  = '11115555-1212-efde-1523-785fef13d123';
const MPU_Control_Char_UUID     = '11116666-1212-efde-1523-785fef13d123';

var bleDeviceFreqControl;
var bleServerFreqControl;

var bleDeviceAccelerometer;
var bleServerAccelerometer;

var MPU_Service;
var MPU_Characteristic;
var MPU_Control_Service;
var MPU_Control_Characteristic;

var accValueZ;
var timeY;

var FREQ_Service;
var FREQ_Characteristic;

var isAccOn = 0;
var setAccMode = 1;

var isFreqOn = 0;

window.onload = function(){
  document.querySelector('#connectToFreqBtn').addEventListener('click', function() { connectFrequencyControl();},);
  document.querySelector('#connectToAccBtn').addEventListener('click', function() { connectAccelerometer();},);

  document.querySelector('#disconnectAccBtn').addEventListener('click', function() { disconnect(bleDeviceAccelerometer);},);
  document.querySelector('#disconnectFreqBtn').addEventListener('click', function() { disconnect(bleDeviceFreqControl);},);

  document.querySelector('#refresh').addEventListener('click', Refresh);

  document.getElementById("MPU_Service_UUID").textContent=MPU_Service_UUID;
  document.getElementById("MPU_Char_UUID").textContent=MPU_Char_UUID;
  document.getElementById("MPU_Control_Service_UUID").textContent=MPU_Control_Service_UUID;
  document.getElementById("MPU_Control_Char_UUID").textContent=MPU_Control_Char_UUID;

  document.getElementById("FREQ_Service_UUID").textContent=FREQ_Service_UUID;
  document.getElementById("FREQ_Char_UUID").textContent=FREQ_Char_UUID;
}

// BLE-Connection
function connectFrequencyControl() {
  'use strict'

	if (!navigator.bluetooth) {
    log('Web Bluetooth API is not available.\n' +
        'Please make sure the Web Bluetooth flag is enabled.');
	  return;
	}

	let deviceUUIDS = { filters:[{ services: [FREQ_Service_UUID]}]};

	log('Requesting Bluetooth Device...');
	navigator.bluetooth.requestDevice(deviceUUIDS)

  .then(device => {
		bleDeviceFreqControl = device;
		bleDeviceFreqControl.addEventListener('gattserverdisconnected', function(){disconnect(bleDeviceFreqControl);},);
		log('Found ' + bleDeviceFreqControl.name + '...');
		log('Connecting to GATT-server...');
		return bleDeviceFreqControl.gatt.connect();
	})


	.then(gattServer => {

    document.getElementById('connectingToFreqDiv').style.display ='block';
    document.getElementById('freqControlDiv').style.display ='none';


		bleServerFreqControl = gattServer;
		log('Connected to Frequency Control...');
		return bleServerFreqControl.getPrimaryService(FREQ_Service_UUID);
	})

  .then(service => {
    FREQ_Service = service;
    log('Freq Service Retrieved...');
    log('Getting Freq Characteristc...');
    return FREQ_Service.getCharacteristic(FREQ_Char_UUID);
  })

  .then(characteristic => {
    FREQ_Characteristic = characteristic;
    log('Freq characteristic retrieved...');
  })

  .then(() => {
    document.getElementById('freqControlDiv').style.display ='block';
    document.getElementById('connectingToFreqDiv').style.display ='none';
    log('Connected to Frequency Control');
    connectedToPeripheral('frequencycontrol');
  })

	.catch(error => {

		log('> connect ' + error);
	});


}

// Function for connectng to the accelerometer - START
function connectAccelerometer() {
  'use strict'

	if (!navigator.bluetooth) {
	log('Web Bluetooth API is not available.\n' +
		'Please make sure the Web Bluetooth flag is enabled.');
	  return;
	}

	let deviceUUIDS = { filters:[{ services: [MPU_Service_UUID]}],
                                optionalServices: [MPU_Control_Service_UUID]};

	log('Requesting Bluetooth Device...');
	navigator.bluetooth.requestDevice(deviceUUIDS)
	.then(device => {
		bleDeviceAccelerometer = device;
		bleDeviceAccelerometer.addEventListener('gattserverdisconnected', function(){disconnect(bleDeviceAccelerometer);},);
		log('Found ' + bleDeviceAccelerometer.name + '...');
		log('Connecting to GATT-server...');
		return bleDeviceAccelerometer.gatt.connect();
	})

	.then(gattServer => {

    document.getElementById('connectingToAccDiv').style.display ='block';
    document.getElementById('accelerometerControlDiv').style.display ='none';

		bleServerAccelerometer = gattServer;
		log('Bluetooth Device Connected...');
    log('Getting MPU Service...')
		return bleServerAccelerometer.getPrimaryService(MPU_Service_UUID);
	})

	.then(service => {
		MPU_Service = service;
		log('MPU Service Retrieved...');
    log('Getting MPU Characteristic');
    return MPU_Service.getCharacteristic(MPU_Char_UUID);
  })

  .then(characteristic => {
    MPU_Characteristic = characteristic;
    log('MPU Characteristic Retrieved...');
    MPU_Characteristic.addEventListener('characteristicvaluechanged', MPU_Data_Received);
    log('Listening for changes in the characteristic...');
    MPU_Characteristic.startNotifications();
    log('Starting Notifications...');
  })

  // Getting the MPU control service.
  .then(() => {
    log('Getting MPU Control Service...');
    return bleServerAccelerometer.getPrimaryService(MPU_Control_Service_UUID);
  })

  .then((service) => {
    MPU_Control_Service = service;
    log('MPU Control Service Retrieved...');
    return MPU_Control_Service.getCharacteristic(MPU_Control_Char_UUID);
  })

  .then((characteristic) => {
    MPU_Control_Characteristic = characteristic;
    log('MPU Control Service Retrieved...');
    MPU_Control_Characteristic.addEventListener('characteristicvaluechanged', MPU_Control_Data_Received);
    log('Listening for changes in the characteristic...');
    MPU_Control_Characteristic.startNotifications();
    log('Starting Notifications...');
  })

  .then(() => {
    document.getElementById('accelerometerControlDiv').style.display ='block';
    document.getElementById('connectingToAccDiv').style.display ='none';
    log('Connected to Accelrometer');
    connectedToPeripheral('accelerometer');
  })


	.catch(error => {
		log('> connect ' + error);
	});
}
// Function for connectng to the accelerometer - END


function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}


function connectedToPeripheral(Peripheral){

  if(Peripheral == 'frequencycontrol'){
    document.getElementById('connectedFrequencyControlProgress').style.display ='block';
    document.getElementById('notConnectedFrequencyControlProgress').style.display ='none';
    document.getElementById('connectToFreqBtn').style.display ='none';
    document.getElementById('disconnectFreqBtn').style.display ='block';
  }

  if(Peripheral == 'accelerometer'){
    document.getElementById('connectedAccelerometerProgress').style.display ='block';
    document.getElementById('notConnectedAccelerometerProgress').style.display ='none';
    document.getElementById('connectToAccBtn').style.display ='none';
    document.getElementById('disconnectAccBtn').style.display ='block';
  }
}

function disconnect(bleDevice) {
    if (!bleDevice) {
       log('No Bluetooth Device connected...');
        return;
    }

    log('Disconnecting from Bluetooth Device...');
    if (bleDevice.gatt.connected) {
       bleDevice.gatt.disconnect();
        log('> Bluetooth Device connected: ' + bleDevice.gatt.connected);
    }
    else {
       log('> Bluetooth Device is already disconnected');
    }
}

function Refresh(){
  log('Disconnecting from devices and refreshing site...');

  disconnect(bleDeviceFreqControl);
  disconnect(bleDeviceAccelerometer);

  setTimeout(window.location.reload.bind(window.location), 1000);
}




function setModeMPU(input) {

  if(input=='toggleMode'){
    if(setAccMode==1){
      setAccMode=2;
      document.getElementById('chartDiv').style.display ='none';
      document.getElementById('freqDiv').style.display ='block';
    }
    else{
      setAccMode=1
      document.getElementById('chartDiv').style.display ='block';
      document.getElementById('freqDiv').style.display ='none';
    }
  }

  else if(input=='toggleOnOff'){
    if(isAccOn==1){
      isAccOn=0;
    }
    else{
      isAccOn=1;
    }
  }
  sendModeMPU();
}



function sendModeMPU(){

  onOff = parseInt(isAccOn);
  Mode = parseInt(setAccMode);

  if(onOff==1 || onOff==0){
    let data = new Uint8Array(3);
    data[0] = onOff;
    data[1] = Mode;

    try {
      log(data);
      MPU_Control_Characteristic.writeValue(data);
    } catch (error) {
      log(error);
    }

    }
    else{
        // Nothing
    }
}

function MPU_Data_Received(){
    let value = event.target.value;
    value = value.buffer ? value: new DataView(value);

    accValueZ = value.getUint8(0) | ((value.getUint8(1) << 8)&0xff00);

    accValueZ = (accValueZ / 16384) - 1;
    accValueZ = accValueZ.toFixed(2);

    // document.getElementById('accelerometerValue').value = accValueZ;
    // document.getElementById('timeGet').value = timeY;

    updateGraph(accValueZ);
}



function MPU_Control_Data_Received() {

  let value = event.target.value;
  value = value.buffer ? value: new DataView(value);

  let data = value.getFloat32(2, true);    // Get float from array, use little endian.

  document.getElementById("freqDivInput").innerHTML = data + " Hz";

}



function changeFreqValue(value){
	let freqValue = document.getElementById("frequencyInput").value;
	freqValue = Number(freqValue);
	value = Number(value);
	let newValue = freqValue + value;
  if(newValue<25){
    newValue = 25;
  }
  if(newValue>800){
    newValue = 800;
  }
  document.getElementById("frequencyInput").value = newValue;
	sendFrequency();
}

// function changeVolumeValue(value){
// 	let volumeValue = document.getElementById("amplitudeInput").value;
// 	volumeValue = Number(volumeValue);
// 	value = Number(value);
// 	let newValue = volumeValue + value;
// 	document.getElementById("amplitudeInput").value = newValue;
// 	sendFrequency();
// }



function frequencyMode(){   // On/Off
  if(isFreqOn==0) {
    isFreqOn=1;
  }
  else {
    isFreqOn=0;
  }
  sendFrequency();
}

// Sends frequency value and volumevalue
function sendFrequency(){
  let freqValue = document.getElementById("frequencyInput").value;
  let data = new Uint8Array(4);
  freqValue = parseInt(freqValue);

  // let volumeValue = document.getElementById("amplitudeInput").value;
  // volumValue = parseInt(volumeValue);
  let volumValue = 10;      // Hardcoded to 20% on firmware side. This is just a placeholder.


  data[0] = isFreqOn;
  data[1] = (freqValue >> 8) & 0xff;
  data[2] = (freqValue & 0xff);
  data[3] = volumValue;                 // Will be removed

 //  log(data);
  try {
    log(data);
    FREQ_Characteristic.writeValue(data);
  } catch (error) {
    log(error);
  }
}
