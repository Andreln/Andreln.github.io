//
//    BLE Connection for Resonator
//
const serviceUUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const rxCharUUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const txCharUUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const MPU_Service_UUID         = '72ed0004-9ae5-4dbe-9172-3cdf3c68c1ea';
const acc_Characteristics_UUID = '72ed0005-9ae5-4dbe-9172-3cdf3c68c1ea';

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

  // let UUIDS = { filters:[{ services: [ serviceUUID ]}], optionalServices: [MPU_Service_UUID] };
  // navigator.bluetooth.requestDevice({
  //     filters: [ {services: [serviceUUID]} ]
  // })


  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({
      filters: [ {services: [MPU_Service_UUID]} ]
  })
  .then(device => {
      bleDevice = device;
      bleDevice.addEventListener('gattserverdisconnected', disconnectedFromPeripheral);
      log('Found ' + bleDevice.name + '...');
      log('Connecting to GATT server...');
      return bleDevice.gatt.connect();
  })

  .then(gattServer => {
      bleServer = gattServer;
      log('Bluetooth Device connected...');
      return bleServer.getPrimaryService(serviceUUID);
  })


  .then(service => {
      bleService = service;
      log('serviceReturn: ' + bleService);

      return Promise.all([
          service.getCharacteristic(txCharUUID)
          .then(characteristic => {
              txChar = characteristic;
              log('Got txChar...');
          }),
          service.getCharacteristic(rxCharUUID)
          .then(characteristic => {
              rxChar = characteristic;
              characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
              characteristic.startNotifications();
              log('Got rxChar...');
          }),
      ])
  })

  .then(() => {
      return bleServer.getPrimaryService(MPU_Service_UUID);
  })

  .then(service => {
      MPU_Service = service;
      log('serviceReturn: ' + MPU_Service);

      return Promise.all([
          service.getCharacteristic(acc_Characteristics_UUID)
          .then(characteristic => {
              accChar = characteristic;
              //characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
              characteristic.startNotifications();
              log('Got accChar...');
          }),
      ])
  })

  	.catch(error => {
  	log(error);
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
