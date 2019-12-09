function setUpNav()
{
	var header = document.getElementById("header");
	window.addEventListener('scroll', function () { if(window.pageYOffset > 30) { header.className = "scroll"; } else { header.className = ""; }});
}