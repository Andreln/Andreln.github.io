//------------- TOGGLE VISIBILITY ------------- //
function viewToggle(showId, hideId1, hideId2) {
	let showDiv = document.getElementById(showId);
  let hideDiv1 = document.getElementById(hideId1);
  let hideDiv2 = document.getElementById(hideId2);

  showDiv.style.display = 'block'
	hideDiv1.style.display = 'none';
	hideDiv2.style.display = 'none';
}


function buttonToggle(buttonShowId, buttonHideId) {
	let buttonShow = document.getElementById(buttonShowId);
	let buttonHide = document.getElementById(buttonHideId);

  buttonShow.style.display = 'block'
	buttonHide.style.display = 'none';
}
