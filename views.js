//------------- TOGGLE VISIBILITY ------------- //

function buttonToggle(buttonShowId, buttonHideId) {
	let buttonShow = document.getElementById(buttonShowId);
	let buttonHide = document.getElementById(buttonHideId);

	buttonShow.style.display = 'block'
	buttonHide.style.display = 'none';
}

function toggleDiv(divId){
	let div = document.getElementById(divId);
	
	if(div.style.display !== 'none') {
		div.style.display ='none';
	}
	else{
		div.style.display = 'block';
	}
}


function View(currentPage) {
	let views = new Array('Resonator', 'measureDiv', 'aboutSectionDiv', 'frequencyControl');
	
	for(i = 0; i<views.length; i++) {
		
		let div = document.getElementById(views[i]);
		
		if(currentPage !== views[i]) {
			div.style.display = 'none';
		}
		else {
			div.style.display = 'block';
		}
	}	
}
