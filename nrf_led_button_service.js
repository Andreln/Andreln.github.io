'use strict'

// LED = RX   -> LED notifications
// BUTTON = TX



const serviceUUID = '00001523-1212-efde-1523-785feabcd123';
const rxUUID = '00001524-1212-efde-1523-785feabcd123';  // BUTTON
const txUUID = '00001525-1212-efde-1523-785feabcd123';	// LED

var bleDevice;
var bleServer;
var bleService;
var rxCharacteristics;	// BUTTON
var txCharacteristics;  // LED

window.onload = function(){
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#disconnect').addEventListener('click', disconnect);
  document.querySelector('#COMMAND1').addEventListener('click', COMMAND_1);
};

function connect() {
  if (!navigator.bluetooth) {
      log('Web Bluetooth API is not available.\n' +
          'Please make sure the Web Bluetooth flag is enabled.');
      return;
  }
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [{services: [serviceUUID]}]})
  .then(device => {
    bleDevice = device;
	log('Gonnecting to GATT server... ');
    return device.gatt.connect();
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
    log('Got characteristic... ');
    rxCharacteristics = characteristic;
    return rxCharacteristics.startNotifications();
  })
  .then(() => {
    log('Notifications enabled... ');
    rxCharacteristics.addEventListener('characteristicvaluechanged',COMMAND_1);
  })
  .then(() => {
    return bleService.getCharacteristic(txUUID);
  })
  .then( characteristic => {
    txCharacteristics = characteristic;
    log('Got rxCharacteristics...');
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
}

function COMMAND_1(){
	var newData = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]);
	log('COMMAND_1 button pressed. Data written: ' + newData);
	// return txCharacteristics.writeValue(newData).then(function() {
		// log('COMMAND_1 Button pressed Successfully. Data sent!');
	// });
}


function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}