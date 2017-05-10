
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
  document.querySelector('#connectToAccBtn').addEventListener('click', connectAccelerometer);
  document.querySelector('#connectToFreqBtn').addEventListener('click', connectFrequencyControl);
  document.querySelector('#disconnectBtn').addEventListener('click', disconnect);
  document.querySelector('#refresh').addEventListener('click', disconnect);

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
		bleDeviceFreqControl.addEventListener('gattserverdisconnected', disconnectedFromPeripheral);
		log('Found ' + bleDeviceFreqControl.name + '...');
		log('Connecting to GATT-server...');
		connectLoaderToggle('connectingToFreqDiv','connectBtnToFreqDiv');
		return bleDeviceFreqControl.gatt.connect();
	})

	.then(gattServer => {
		bleServerFreqControl = gattServer;
		log('Connected to Frequency Control...');
		return bleServerFreqControl.getPrimaryService(FREQ_Service_UUID);
	})

	.then(service => {
	  FREQ_Service = service;
	  log('Freq Service Retrieved...');
	  return Promise.all([
		  FREQ_Service.getCharacteristic(FREQ_Char_UUID)
		  .then(characteristic => {
				FREQ_Characteristic = characteristic;
				log('Freq characteristic retrieved...');
				connectLoaderToggle('connectToAccelerometerDiv','connectToFreqDiv');
				connectLoaderToggle('connectBtnToFreqDiv','connectingToFreqDiv');
		  }),
	  ])
	})

	.catch(error => {
		log('> connect ' + error);
	});


}

function connectAccelerometer() {
  'use strict'

	if (!navigator.bluetooth) {
	log('Web Bluetooth API is not available.\n' +
		'Please make sure the Web Bluetooth flag is enabled.');
	  return;
	}

	let deviceUUIDS = { filters:[{ services: [MPU_Service_UUID]}],
                                optionalServices: [MPU_Control_Service_UUID, MPU_Control_Char_UUID]};

	log('Requesting Bluetooth Device...');
	navigator.bluetooth.requestDevice(deviceUUIDS)
	.then(device => {
		bleDeviceAccelerometer = device;
		bleDeviceAccelerometer.addEventListener('gattserverdisconnected', disconnectedFromPeripheral);
		log('Found ' + bleDeviceAccelerometer.name + '...');
		log('Connecting to GATT-server...');
		connectLoaderToggle('connectingToAccelerometerDiv','connectBtnToAccelerometerDiv');
		return bleDeviceAccelerometer.gatt.connect();
	})

	.then(gattServer => {
		bleServerAccelerometer = gattServer;
		log('Bluetooth Device Connected...');
		return bleServerAccelerometer.getPrimaryService(MPU_Service_UUID);
	})

	.then(service => {
		MPU_Service = service;
		log('MPU Service Retrieved...');
		return Promise.all([
			MPU_Service.getCharacteristic(MPU_Char_UUID)
			.then(characteristic => {
				MPU_Characteristic = characteristic;
        console.dir(MPU_Characteristic);
				log('MPU characteristic retrieved...');
				MPU_Characteristic.addEventListener('characteristicvaluechanged', MPU_Data_Received);
				//MPU_Characteristic.startNotifications();
		  }),
	  ])
	})

  .then(() => {
		log('Getting MPU Control Service...');
		return bleServerAccelerometer.getPrimaryService(MPU_Control_Service_UUID);
	})

  .then(service => {
    MPU_Control_Service = service;
    log('MPU Control Service Retrieved...');
    return Promise.all([
      MPU_Control_Service.getCharacteristic(MPU_Control_Char_UUID)
      .then(characteristic => {
        MPU_Control_Characteristic = characteristic;
        console.dir(MPU_Control_Characteristic);
        log('MPU Control characteristic retrieved...');
        MPU_Control_Characteristic.addEventListener('characteristicvaluechanged', MPU_Control_Data_Received);
        // MPU_Control_Characteristic.startNotifications();
        View('ControlView');
        connectLoaderToggle('connectBtnToAccelerometerDiv','connectingToAccelerometerDiv');
        statusBar('connected');
      }),
    ])
  })

  .then(_ => {
    MPU_Control_Characteristic.startNotifications();
    log('Notifications started on MPU Control');
  })

  // .then(_ => {
  //   MPU_Characteristic.startNotifications();
  //   log('Notifications started on MPU');
  // })

	.catch(error => {
		log('> connect ' + error);
	});


}
// BLE-Connection End


function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}

function disconnect() {
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
    isConnected = false;
}

function connectedToPeripheral(){
	View('ControlView');
  statusBar('connected');
  buttonToggle('disconnectDiv', 'connectDiv');
}

function disconnectedFromPeripheral () {
    log('Something went wrong. You are now disconnected from the device');
    View('ConnectionView');
    statusBar('notConnected');
    buttonToggle('connectDiv', 'disconnectDiv');
}


function setModeMPU(input) {

  if(input=='toggleMode'){
    if(setAccMode==1){
      setAccMode=2;
      document.getElementById('chartDiv').style.display ='none';
      document.getElementById('freqDiv').style.display ='block';
    }
    else{
      setAccMode=1;
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
  log('test');
  let value = event.target.value;
  value = value.buffer ? value: new DataView(value);

  console.dir(value);
  // log(value[1] + '  ' + value[2] + '  ' + value[2] + '  ' + value[3] + '  ' + value[4] + '  ' + value[5] + '  ' + value[6]);
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

function changeVolumeValue(value){
	let volumeValue = document.getElementById("amplitudeInput").value;
	volumeValue = Number(volumeValue);
	value = Number(value);
	let newValue = volumeValue + value;
	document.getElementById("amplitudeInput").value = newValue;
	sendFrequency();
}

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

  let volumeValue = document.getElementById("amplitudeInput").value;
  volumValue = parseInt(volumeValue);

  data[0] = isFreqOn;
  data[1] = (freqValue >> 8) & 0xff;
  data[2] = (freqValue & 0xff);
  data[3] = volumValue;

 //  log(data);
  try {
    log(data);
    FREQ_Characteristic.writeValue(data);
  } catch (error) {
    log(error);
  }
}
