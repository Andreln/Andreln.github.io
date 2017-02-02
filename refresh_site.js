'use strict'

window.onload = function(){
  document.querySelector('#refresh').addEventListener('click', refresh);
};

function connect() {
	location.reload(forceGet);
}