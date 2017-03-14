//
//    BLE Connection for Resonator
//
const UART_Service_UUID  = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const UART_RX_Char_UUID  = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const UART_TX_Char_UUID  = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const MPU_Service_UUID   = '00000004-1212-efde-1523-785fef13d123';
const MPU_Char_UUID      = '00000005-1212-efde-1523-785fef13d123';

var bleDevice;
var bleServer;
var UART_Service;
var rxChar;
var txChar;

var MPU_Service;
var MPU_Characteristic;

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

  let deviceUUIDS = { filters:[{ services: [UART_Service_UUID]}], optionalServices: [MPU_Service_UUID, MPU_Char_UUID]};

  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(deviceUUIDS)
  .then(device => {
      bleDevice = device;
      bleDevice.addEventListener('gattserverdisconnected', disconnectedFromPeripheral);
      log('Found ' + bleDevice.name + '...');
      log('Connecting to GATT server...');
      return bleDevice.gatt.connect();
  })

  // .then(gattServer => {
  //     bleServer = gattServer;
  //     log('Bluetooth Device connected...');
  //     return bleServer.getPrimaryService(UART_Service_UUID);
  // })
  //
  //
  // .then(service => {
  //     UART_Service = service;
  //     return Promise.all([
  //         UART_Service.getCharacteristic(UART_TX_Char_UUID)
  //         .then(characteristic => {
  //             txChar = characteristic;
  //         }),
  //         UART_Service.getCharacteristic(UART_RX_Char_UUID)
  //         .then(characteristic => {
  //             rxChar = characteristic;
  //             characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
  //             characteristic.startNotifications();
  //         }),
  //     ])
  // })

  .then(gattServer => {
      bleServer = gattServer;
      log('Bluetooth Device connected...');
      return bleServer.getPrimaryService(MPU_Service_UUID);
  })


  .then(service => {
      MPU_Service = service;
      return Promise.all([
          MPU_Service.getCharacteristic(MPU_Char_UUID)
          .then(characteristic => {
              MPU_Characteristic = characteristic;
              log('Got MPU char')
          }),
      ])
  })

  // .then(() => {
  //     return bleServer.getPrimaryService(MPU_Service_UUID);
  // })
  //
  // .then(service => {
  //     log('Succsessully retrieved primary mpu service...')
  //     MPU_Service = service;
  //     return Promise.all([
  //       MPU_Service.getCharacteristic(MPU_Char_UUID)
  //       .then(characteristic => {
  //           log('Succsessully retrieved MPU characteristic');
  //           MPU_Characteristic = characteristic;
  //           //characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
  //           // characteristic.startNotifications();
  //           log('Got MPU_Characteristic...');
  //         }),
  //       ])
  //   })

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
