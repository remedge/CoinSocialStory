function collapsePercent() {
 	var a = document.getElementsByClassName('param-up');
 	var b = document.getElementsByClassName('param-down');
		Array.prototype.slice(a);
 	Array.prototype.slice(b);

 	for( var i = 0; i < a.length; i++ ) {
 		if (a[i].getAttribute('style') == "display: none;"){
 			a[i].setAttribute("style", "display: static;");
 		} else {
 			a[i].setAttribute("style", "display: none;");
 		}
 	}
 	for( var i = 0; i < b.length; i++ ){
 		if (b[i].getAttribute('style') == "display: none;"){
 			b[i].setAttribute("style", "display: static;");
 		} else {
 			b[i].setAttribute("style", "display: none;");
 		}
 	}
 }