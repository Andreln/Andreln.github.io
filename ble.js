//
//    BLE Connection for Resonator
//
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const rxCharUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const txCharUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const MPU_Service_UUID = '6e409999-b5a3-f393-e0a9-e50e24dcca9e'
const acc_Characteristics_UUID = '6e408888-b5a3-f393-e0a9-e50e24dcca9e';

var bleDevice;
var bleServer;
var bleService;
var rxChar;
var txChar;

var MPU_Service;
var accChar;

window.onload = function(){
  document.querySelector('#connectBtn').addEventListener('click', connect);
  document.querySelector('#disconnectBtn').addEventListener('click', disconnect);
  document.querySelector('#refresh').addEventListener('click', disconnect);
  //
  // document.querySelector('#ON').addEventListener('click', disconnect);				// CHANGE!
  // document.querySelector('#OFF').addEventListener('click', disconnect);				// CHANGE!
  //
  // document.querySelector('#refresh').addEventListener('click', disconnect);			// CHANGE!

}

function connect() {
  'use strict'

	if (!navigator.bluetooth) {
    log('Web Bluetooth API is not available.\n' +
        'Please make sure the Web Bluetooth flag is enabled.');
	  return;
	}

  let UUIDS = { filters:[{ services: [ serviceUUID ]}], optionalServices: [MPU_Service_UUID] };
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(UUIDS)
  .then(device => {
      bleDevice = device;
      bleDevice.addEventListener('gattserverdisconnected', disconnectedFromPeripheral)
      log('Found ' + bleDevice.name + '...');
      log('Connecting to GATT server...')
      return bleDevice.gatt.connect()
  })

  .then(gattServer => {
      bleServer = gattServer;
      log('> Bluetooth Device connected: ');
      return bleServer.getPrimaryService(serviceUUID)
  })

  .then(service => {
      bleService = service;
      log('serviceReturn: ' + service);
      return bleService.getCharacteristic(txCharUUID);
  })

  	.then( characteristic => {
		txChar = characteristic;
		log('TX Characteristic ok');
  	})

  	.then(() => {
		return bleService.getCharacteristic(rxCharUUID);
  	})

  	.then((characteristic) => {
		rxChar = characteristic;
		characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
		console.log('RX characteristic ok');
		characteristic.startNotifications();
  	})

	.then(() => {
		return bleService.getCharacteristic(acc_Characteristics_UUID);
  	})

  	.then((characteristic) => {
		accChar = characteristic;
		characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
		console.log('ACC characteristic ok');
		characteristic.startNotifications();
  	})

  	.catch(error => {
  	log('> connect ' + error);
  	});
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

function disconnectedFromPeripheral () {
  log('Something went wrong. You are now disconnected from the device');
  buttonToggle('disconnectDiv','connectDiv');
}

function DATARECEIVED(event){
  log ('Data received!');
  let value = event.target.value;
	value = value.buffer ? value : new DataView(value);
  let data = value.getUint8(0);
  log(data);
	// //let data = new Uint8Array(value);
	// for (let i = 0; i <= 8; i++) {
	// 	let data = getUint8(value[i]);
	// 	log(i + ': ' + data);
	//}
}

function sliderChange(value){
	log(value);
	let newData = new Uint8Array([value]);
	return txCharacteristics.writeValue(newData).then(function() {
		log('Data sent!');
	});
}

function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}
