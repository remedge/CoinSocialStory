function collapsePercent() {

 	var percentUp = document.getElementsByClassName('param-up');
 	var percentDown = document.getElementsByClassName('param-down');

	var upTD = document.getElementsByClassName('td-param-up');
 	var downTD = document.getElementsByClassName('td-param-down');

	Array.prototype.slice(percentUp);
 	Array.prototype.slice(percentDown);
 	Array.prototype.slice(upTD);
 	Array.prototype.slice(downTD);

 	for( var i = 0; i < percentUp.length; i++ ) {
 		if  (percentUp[i].style.display === 'none') {
 			percentUp[i].style.display = '';
 			upTD[i].style.color = 'black';
 		} else {
 			percentUp[i].style.display = 'none';
 			upTD[i].style.color = 'green';
 		}
 	}

 	for( var i = 0; i < percentDown.length; i++ ){

 		if (percentDown[i].style.display === 'none') {
 			percentDown[i].style = '';
 			downTD[i].style.color = 'black'; 
 		} else {
 			percentDown[i].style.display = 'none';
 			downTD[i].style.color = 'red';
 		}
 	}

 	if(localStorage.getItem('collapse') == 'true') {
 		var  notIndex = document.getElementsByClassName('not-index');
	 	var heads = document.getElementsByClassName('collapsable');
	 	var colspan = ['4', '4', '5', '3'];
		Array.prototype.slice(notIndex);
		Array.prototype.slice(heads);

	 	for( var i = 0; i < notIndex.length; i++ ) {
	 		notIndex[i].style.display = 'none';
	 	}

		for( var i = 0; i < heads.length; i++ ) {
 			heads[i].setAttribute("colspan", '1');	
 		}
		
	}
}

function collapseNotIndex() {
 	var notIndex = document.getElementsByClassName('not-index');
 	var heads = document.getElementsByClassName('collapsable');
 	var colspan = ['4', '4', '5', '4'];
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


if(localStorage.getItem('collapse') == 'true') {
	document.addEventListener('DOMContentLoaded', function(){
		collapseNotIndex();
		document.getElementById('buttonCollapsePercent').setAttribute('disable', 'true');
	});
}