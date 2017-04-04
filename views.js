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

	log('Does this work?');
}


function View(currentPage) {

	let div = document.getElementsByClassName("View");

	for(i = 0; i<div.length; i++) {

		if(currentPage !== div[i].id) {
			div[i].style.display = 'none';
		}
		else {
			div[i].style.display = 'block';
		}
	}
}
