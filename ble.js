//
//    BLE Connection for Resonator
//
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const rxUUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const txUUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const MPU_Service_UUID = '6e409999-b5a3-f393-e0a9-e50e24dcca9e'
const acc_Characteristics_UUID = '6e408888-b5a3-f393-e0a9-e50e24dcca9e';

var bleDevice;
var bleServer;
var bleService;
var rxCharacteristics;
var txCharacteristics;

var MPU_Service;


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

	log('Requesting Bluetooth Device...');
	navigator.bluetooth.requestDevice({
    filters: [ {services: [serviceUUID]} ],
    optionalServices: [MPU_Service_UUID]
  })
  .then(device => {
      bleDevice = device;

      // Adding event listener to detect loss of connection
      //bleDevice.addEventListener('gattserverdisconnected', disconnect);
      log('Found ' + bleDevice.name + '...');
      log('Connecting to GATT Server...');

       // Connect to gattserver
      return bleDevice.gatt.connect();
      log('> Bluetooth Device connected: ');
	})

  	.then(server => {
  	bleServer = server;
  	log('Got GATT server... ');
  	log('Getting service... ');
  	return server.getPrimaryService(serviceUUID);
  	})

  	.then(service => {
  	log('Got service... ');
  	bleService = service;
  	log('Getting characteristic... ');
  	return bleService.getCharacteristic(rxUUID);
  	})

  	.then( characteristic => {
  	log('Got rxCharacteristic... ');
  	rxCharacteristics = characteristic;
  	return rxCharacteristics.startNotifications();
  	})

  	.then(() => {
  	log('Notifications enabled... ');
  	rxCharacteristics.addEventListener('characteristicvaluechanged',DATARECEIVED);
  	})

  	.then(() => {
  	return bleService.getCharacteristic(txUUID);
  	})

    .then(() => {
    log('Getting MPU Service... ');
    return bleServer.getPrimaryService(MPU_Service_UUID);
    })

    .then(service => {
    log('Got MPU service... ');
    MPU_Service = service;
    log('Getting characteristic... ');
    return bleService.getCharacteristic(acc_Characteristics_UUID);
    })

    .then(characteristic => {
    log('Got ACC characteristic... ');
    acc_Characteristics = characteristic;
    return acc_Characteristics.startNotifications();
    })

    .then(() => {
    log('Notifications enabled... ');
    acc_Characteristics.addEventListener('characteristicvaluechanged',DATARECEIVED);
    })

  	.then( characteristic => {
  	txCharacteristics = characteristic;
  	log('Got txCharacteristics...');
    buttonToggle('disconnectDiv', 'connectDiv')
  	log('Connected...');
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
	} else {
	log('> Bluetooth Device is already disconnected');
	}
	isConnected = false;
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
