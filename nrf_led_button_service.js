'use strict'

// LED = RX   -> LED notifications
// BUTTON = TX



const serviceUUID = '00001523-1212-efde-1523-785feabcd123';
const buttonCharacteristicUUID = '00001524-1212-efde-1523-785feabcd123';
const ledCharacteristicUUID = '00001525-1212-efde-1523-785feabcd123';

var bleDevice;
var bleServer;
var bleService;
var button1char;
var ledChar;
var button1count = 0;
var toggleFlag = false;

window.onload = function(){
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#disconnect').addEventListener('click', disconnect);
  document.querySelector('#led2').addEventListener('click', toggleLED);
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
	return bleService.getCharacteristic(ledCharacteristicUUID);
  })
  .then( characteristic => {
    log('Got characteristic... ');
    buttonChar = characteristic;
    return button1Char.startNotifications();
  })
  .then(() => {
    log('Notifications enabled... ');
    button1char.addEventListener('characteristicvaluechanged',handleNotifyButton1);
  })
  .then(() => {
    return bleService.getCharacteristic(ledCharacteristicUUID);
  })
  .then( characteristic => {
    ledChar = characteristic;
    log('Got ledChar...');
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

function handleNotifyButton1(event) {
  log('Notification: COMMAND_1 Button pressed');
  document.getElementById("COMMAND_1").innerHTML = button1count;
}

function handleNotifyButton2(event) {
  log('Notification: COMMAND_2 Button pressed');
  document.getElementById("COMMAND_2").innerHTML = button1count;
}


function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}