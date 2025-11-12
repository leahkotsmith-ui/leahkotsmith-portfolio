// Parallax effect for gold background circles
if (document.querySelector('.shape.circle1')) {
	document.addEventListener('mousemove', function(e) {
		var w = window.innerWidth, h = window.innerHeight;
		var x = e.clientX / w, y = e.clientY / h;
		// Amplify the movement for a stronger parallax effect
		document.querySelector('.shape.circle1').style.transform = `translate(${x*120}px, ${y*120}px)`;
		document.querySelector('.shape.circle2').style.transform = `translate(${-x*90}px, ${-y*90}px)`;
	});
}
