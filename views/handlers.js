

function collapsePercent() {

 	var a = document.getElementsByClassName('param-up');
 	var b = document.getElementsByClassName('param-down');

	var aTD = document.getElementsByClassName('td-param-up');
 	var bTD = document.getElementsByClassName('td-param-down');

	Array.prototype.slice(a);
 	Array.prototype.slice(b);
 	Array.prototype.slice(aTD);
 	Array.prototype.slice(bTD);

 	for( var i = 0; i < a.length; i++ ) {
 		if (a[i].getAttribute('style') == "display: none;"){
 			a[i].setAttribute("style", "display: static;");
 			aTD[i].setAttribute("style", "color: black;");
 		} else {
 			a[i].setAttribute("style", "display: none;");
 			aTD[i].setAttribute("style", "color: green;");
 		}
 	}
 	for( var i = 0; i < b.length; i++ ){
 		if (b[i].getAttribute('style') == "display: none;"){
 			b[i].setAttribute("style", "display: static;");
 			bTD[i].setAttribute("style", "color: black;");
 		} else {
 			b[i].setAttribute("style", "display: none;");
 			bTD[i].setAttribute("style", "color: red;");
 		}
 	}
 	if(localStorage.getItem('collapse') == 'true') {
 		var c = document.getElementsByClassName('not-index');
	 	var heads = document.getElementsByClassName('collapsable');
	 	var colspan = ['4', '4', '5', '3'];
		Array.prototype.slice(c);
		Array.prototype.slice(heads);

	 	for( var i = 0; i < c.length; i++ ) {
 			c[i].setAttribute("style", "display: none;");
	 	}

		for( var i = 0; i < heads.length; i++ ) {
 			heads[i].setAttribute("colspan", '1');	
 		}
		
	}
}

function collapseNotIndex() {
 	var a = document.getElementsByClassName('not-index');
 	var heads = document.getElementsByClassName('collapsable');
 	var colspan = ['4', '4', '5', '3'];
	Array.prototype.slice(a);
	Array.prototype.slice(heads);

 	for( var i = 0; i < a.length; i++ ) {
 		if (a[i].getAttribute('style') == "display: none;"){
 			a[i].setAttribute("style", "display: static;");
 			localStorage.setItem('collapse', 'false');
 		} else {
 			a[i].setAttribute("style", "display: none;");
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