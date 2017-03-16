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


var ctx;
var data;
var myLineChart;
var N = 10;
var zero_array = [];
var i = 0;

window.onload = function(){
  document.querySelector('#connectBtn').addEventListener('click', connect);
  document.querySelector('#disconnectBtn').addEventListener('click', disconnect);
  document.querySelector('#refresh').addEventListener('click', disconnect);

  initChart();
  setChartData();
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
              MPU_Characteristic.addEventListener('characteristicvaluechanged', MPU_Data_Received);
              MPU_Characteristic.startNotifications();
          }),
      ])
  })

  .then(() => {
      return bleServer.getPrimaryService(UART_Service_UUID);
  })

  .then(service => {
      UART_Service = service;
      log('UART Service Retrieved...');
      return Promise.all([
          UART_Service.getCharacteristic(UART_TX_Char_UUID)
          .then(characteristic => {
              txChar = characteristic;
              log('UART TX characteristic retrieved...');
          }),
          UART_Service.getCharacteristic(UART_RX_Char_UUID)
          .then(characteristic => {
              rxChar = characteristic;
              log('UART RX characteristic retrieved...');
              //characteristic.addEventListener('characteristicvaluechanged', DATARECEIVED);
              //characteristic.startNotifications();
          }),
      ])
  })

  .catch(error => {
    log('> connect ' + error);
  });
}

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

function disconnectedFromPeripheral () {
  log('Something went wrong. You are now disconnected from the device');
  buttonToggle('disconnectDiv','connectDiv');
}


function MPU_Data_Received(){
  let value = event.target.value;
  value = value.buffer ? value: new DataView(value);

  for(i = 0; i<3; i++) {
    let accelValue = value.getUint8(i) | ((value.getUint8(i+1) << 8 )&0xff00);
    document.getElementById(i).value = accelValue;

    let d = new Date();
    let n = d.getSeconds();
    document.getElementById(3).value = n;

		myLineChart.data.datasets[0].data.shift();                       // Shift array one step to the left
		myLineChart.data.datasets[0].data.push(accelValue);          // Insert accelerometer value to the right in array
		myLineChart.data.labels = [(i+0), (i+1), (i+2), (i+3), (i+4), (i+5), (i+6), (i+7), (i+8)];    // Incremet x-labels
		i++;
		myLineChart.update();
    if(i==10000); i=0;
  }
}


function DATARECEIVED(event){
  log ('Data received!');
  let value = event.target.value;
	value = value.buffer ? value : new DataView(value);
  let data = value.getUint8(0);
  log(data);
}

//------------- Init chart------------- //
function initChart(){
  var ctx = document.getElementById("chart").getContext("2d");

  var myLineChart = new Chart(ctx, {
  type: 'line',
    data: data,
    options: {
      responsive: true,
      animation: false,
    }
  });
  log('Chart Initialized');
}

function setChartData(){
  for (let x = 0; x < N; x++)
      zero_array.push(0);

  var data = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: [{
      title: "Z-data",
      label: "Frequency",
      data: [1, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      fill: false,
      lineTension: 0.1,
      backgroundColor: "rgba(75,192,192,0.4)",
      borderColor: "rgba(75,192,192,1)",
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: "rgba(75,192,192,1)",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      duration: 10,

      spanGaps: false,
    }]
  };
  log('Chart data set');
}

// function sliderChange(value){
// 	log(value);
// 	let newData = new Uint8Array([value]);
// 	return txCharacteristics.writeValue(newData).then(function() {
// 		log('Data sent!');
// 	});
// }
