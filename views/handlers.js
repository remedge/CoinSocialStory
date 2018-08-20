function collapseNotIndex() {
 	var notIndex = document.getElementsByClassName('not-index');
 	var heads = document.getElementsByClassName('collapsable');
 	var colspan = ['2', '4', '5', '4'];
	Array.prototype.slice(notIndex);
	Array.prototype.slice(heads);

 	for( var i = 0; i < notIndex.length; i++ ) {

 		if (notIndex[i].style.display === 'none') {
 			notIndex[i].style.display = '';
 			localStorage.setItem('collapse', 'false');
 		} else {
 			notIndex[i].style.display = 'none';
 			localStorage.setItem('collapse', 'true');
 		}
 	}
	if(localStorage.getItem('collapse') == 'true') {
		for( var i = 0; i < heads.length; i++ ) {
 			heads[i].setAttribute("colspan", '1');
 		}
	} else {
		for( var i = 0; i < heads.length; i++ ) {
 			heads[i].setAttribute("colspan", colspan[i]);
 		}
	}
}

function showPeriod(period) {
	for (let el of document.querySelectorAll('.hour, .day, .week, .month')) {
		el.style.display = 'none';
		el.classList.remove('d-none');
	}
	for (let el of document.querySelectorAll(`.${period}`)) {
		el.style.display = 'block';
	}
}

if(localStorage.getItem('collapse') == 'true') {
	document.addEventListener('DOMContentLoaded', function(){
		collapseNotIndex();
		document.getElementById('buttonCollapsePercent').setAttribute('disable', 'true');
	});
}