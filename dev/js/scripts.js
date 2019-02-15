document.getElementsByTagName("html")[0].classList = ''; // removes no-js
document.createElement("video"); // make sure video tag will render bg image as fallback

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

// scroll to top btn
window.onscroll = function() {
	scrollFunction();
};

function scrollFunction() {
	if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
		document.getElementById("top-link").style.display = "block";
	} else {
		document.getElementById("top-link").style.display = "none";
	}
}

jQuery(document).ready(function($){
	$('html').removeClass('no-js'); // the first is faster but doesn't work in IE
	$('.nojs-warning').remove();
	var $googleInput = $('#google-input');

	$('#top-link').click(function(event){
		event.preventDefault();
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
	
	// disabled links
	$('a[disabled="disabled"]').click(function(event){
		event.preventDefault();
	});

	// Google Search
	$googleInput.addClass('closed').width('1px').keydown(function(event){
		if(event.keyCode === 13){
			$('#open-search').click();
		}
	});
	$('#open-search').click(function(event){
		event.preventDefault();

		var checkInput = $googleInput.width();
		if(checkInput === 1){
			$googleInput.focus().removeClass('closed').animate({
				width: '200px'
			});
		} else {
			if($googleInput.val() !== ''){
				$('#gsc-i-id1').val($googleInput.val());
				$('button.gsc-search-button').click();
			} else {
				$googleInput.blur().addClass('closed').animate({
				width: '1px'
			});
			}
		}

	});

	var $navInfo = $('.nav.information');
	var $quicklinks = $('.quicklinks-wrapper');

	// gold bar responsive
	$('#quicklinks-btn').click(function(){
		if($navInfo.is(':visible')){
			$navInfo.slideUp();
			$quicklinks.slideUp();

		} else {
			$navInfo.slideDown();
			$quicklinks.slideDown();
		}
	});
	window.addEventListener("resize", fixNav);
	function fixNav(){
		if( window.innerWidth >= 992 ){
			$quicklinks.slideDown();
			$navInfo.slideDown();
		}
	}

	// bs modal events
	 $(".modal").on('shown.bs.modal', function () {
			$('main').addClass('blur-content');
	});
	$(".modal").on('hidden.bs.modal', function () {
			$('main').removeClass('blur-content');
	});




}); // end jQuery
