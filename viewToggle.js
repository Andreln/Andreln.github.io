//------------- TOGGLE VISIBILITY ------------- //
function toggle_visibility(showId, hideId1, hideId2) {
	let showDiv = document.getElementById(showId);
  let hideDiv1 = document.getElementById(hideId1);
  let hideDiv2 = document.getElementById(hideId2);

  showDiv.style.display = 'block'
	hideDiv1.style.display = 'none';
	hideDiv2.style.display = 'none';
}
