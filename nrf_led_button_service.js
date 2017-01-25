'use strict'

const serviceUUID = '0x0001';
const txCharacteristicUUID = '0x0002';
const rxCharacteristicUUID = '0x0003';

var bleDevice;
var bleServer;
var bleService;
var txchar;
var rxchar;

window.onload = function(){
  document.querySelector('#connect').addEventListener('click', connect);
  document.querySelector('#disconnect').addEventListener('click', disconnect);
  document.querySelector('#COMMAND_1').addEventListener('click', COMMAND_1);
  document.querySelector('#COMMAND_2').addEventListener('click', COMMAND_2);
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
    return device.gatt.connect();
  })
  .then(server => {
    bleServer = server;
    log('Got bleServer');
    return server.getPrimaryService(serviceUUID);
  })
  .then(service => {
    log('Got bleService');
    bleService = service;
  })
  .then(() => bleService.getCharacteristic(txCharacteristicUUID))
  .then( characteristic => {
    log('Got txcharacteristic');
    txchar = characteristic;
    return txchar.startNotifications();
  })
  .then(() => {
    log('Notifications enabled');
    txchar.addEventListener('characteristicvaluechanged',handleNotifyButton1);
  })
  .then(() => {
    return bleService.getCharacteristic(txCharacteristicUUID);
  })
  .then( characteristic => {
    rxchar = characteristic;
    log('Got rxChar');
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

}

function COMMAND_2(){

}


function log(text) {
    console.log(text);
    document.querySelector('#log').textContent += text + '\n';
}
