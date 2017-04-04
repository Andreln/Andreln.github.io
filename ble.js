//
//    BLE Connection for Resonator
//
const UART_Service_UUID   = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_RX_Char_UUID   = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_Char_UUID   = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const MPU_Service_UUID    = '00000004-1212-efde-1523-785fef13d123';
const MPU_Char_UUID       = '00000005-1212-efde-1523-785fef13d123';

const FREQ_Service_UUID   = '49f89999-edd1-4c81-8702-585449ba92a8';
const FREQ_Char_UUID      = '49f88888-edd1-4c81-8702-585449ba92a8';

var bleDevice;
var bleServer;
var UART_Service;
var rxChar;
var txChar;

var MPU_Service;
var MPU_Characteristic;
var accValueZ;
var timeY;

var FREQ_Service;
var FREQ_Characteristic;

window.onload = function(){
  document.querySelector('#connectBtn').addEventListener('click', connect);
  document.querySelector('#disconnectBtn').addEventListener('click', disconnect);
  document.querySelector('#refresh').addEventListener('click', disconnect);
  document.querySelector('#frequencyInput').addEventListener("change", sendFrequency);

  document.getElementById("MPU_Service_UUID").textContent=MPU_Service_UUID;
  document.getElementById("MPU_Char_UUID").textContent=MPU_Char_UUID;

  document.getElementById("FREQ_Service_UUID").textContent=FREQ_Service_UUID;
  document.getElementById("FREQ_Char_UUID").textContent=FREQ_Char_UUID;
}

// BLE-Connection
function connect() {
  'use strict'

	if (!navigator.bluetooth) {
    log('Web Bluetooth API is not available.\n' +
        'Please make sure the Web Bluetooth flag is enabled.');
	  return;
	}

  let deviceUUIDS = { filters:[{ services: [UART_Service_UUID]}],
                      optionalServices: [MPU_Service_UUID, MPU_Char_UUID, FREQ_Service_UUID, FREQ_Char_UUID]};

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(deviceUUIDS)
  .then(device => {
      bleDevice = device;
      bleDevice.addEventListener('gattserverdisconnected', disconnectedFromPeripheral);
      log('Found ' + bleDevice.name + '...');
      log('Connecting to GATT-server...');
      return bleDevice.gatt.connect();
  })

  .then(gattServer => {
      bleServer = gattServer;
      log('Bluetooth Device Connected...');
      return bleServer.getPrimaryService(MPU_Service_UUID);
  })


  .then(service => {
      MPU_Service = service;
      log('MPU Service Retrieved...');
      return Promise.all([
          MPU_Service.getCharacteristic(MPU_Char_UUID)
          .then(characteristic => {
              MPU_Characteristic = characteristic;
              log('MPU characteristic retrieved...');
              // MPU_Characteristic.addEventListener('characteristicvaluechanged', MPU_Data_Received);
              // MPU_Characteristic.startNotifications();
          }),
      ])
  })

  .then(() => {
      return bleServer.getPrimaryService(FREQ_Service_UUID);
  })

  .then(service => {
      FREQ_Service = service;
      log('FREQ Service Retrieved...');
      return Promise.all([
          FREQ_Service.getCharacteristic(FREQ_Char_UUID)
          .then(characteristic => {
              FREQ_Characteristic = characteristic;
              log('FREQ characteristic retrieved...');
			  connectedToPeripheral();

          }),
      ])
  })

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
	View('App');
}

function disconnectedFromPeripheral () {
    log('Something went wrong. You are now disconnected from the device');
    buttonToggle('connectDiv','disconnectDiv');
}


function MPU_Data_Received(){
    let value = event.target.value;
    value = value.buffer ? value: new DataView(value);

    accValueZ = value.getUint8(0) | ((value.getUint8(1) << 8)&0xff00);

    accValueZ = (accValueZ / 16384) - 1;
    accValueZ = accValueZ.toFixed(2);

    document.getElementById('accelerometerValue').value = accValueZ;
    // document.getElementById('timeGet').value = timeY;

    updateGraph(accValueZ);
}


function DATARECEIVED(event){
    log ('Data received!');
    let value = event.target.value;
  	value = value.buffer ? value : new DataView(value);
    let data = value.getUint8(0);
    log(data);
}

function sendFrequency(){
  log('Fly data, fly!');
  let freqValue = document.getElementById("frequencyInput").value;

  let data = new Uint8Array(8);

  // data[0] = 1;
  // data[1] = freqValue & 0xff;
  // data[2] = (freqValue >> 8) & 0xff;
  data[0] = 0;
  data[1] = 0;
  data[2] = 0;
  data[3] = 0;
  data[4] = 0;
  data[5] = 0;
  data[6] = 0;
  data[7] = 0;

  log(data);
  try {
    FREQ_Characteristic.writeValue(data);
    log('Data sent');
  } catch (error) {
    log(error);
  }
}

function changeFreqValue(value){
  let freqValue = document.getElementById("frequencyInput").value;
  freqValue = Number(freqValue);
  value = Number(value);
  let newValue = freqValue + value;
  document.getElementById("frequencyInput").value = newValue;
  sendFrequency();
}
