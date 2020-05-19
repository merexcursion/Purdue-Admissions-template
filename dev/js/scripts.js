document.getElementsByTagName("html")[0].classList = ''; // removes no-js
document.createElement("video"); // make sure video tag will render bg image as fallback

var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

// for older browsers /
document.createElement("header");
document.createElement("section");
document.createElement("footer");
document.createElement("aside");
document.createElement("nav");
document.createElement("main");
document.createElement("article");
document.createElement("figure");

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


var socialSidebar = document.getElementById("social-sidebar");

if(socialSidebar !== null){
	

// share vars
var fbSDKId = '492762947795038';
var pageTitle = document.getElementsByTagName("H1");
var pageTitleText = pageTitle[0].innerText;
var metas = document.getElementsByTagName("META");
var metaTitle = '', metaDesc = '';
for(var i = 0; i < metas.length; i++){
	if(metas[i].name === 'og:title'){
	   	metaTitle = metas[i].content;
	   }
	if(metas[i].name === 'og:description'){
	   	metaDesc = metas[i].content;
	   }
}
if(metaTitle !== ''){
   pageTitleText = metaTitle;
   }


// FB share
var getWindowOptions0 = function() {
  var width = 500;
  var height = 450;
  var left = (window.innerWidth / 2) - (width / 2);
  var top = (window.innerHeight / 2) - (height / 2);

  return [
    'resizable,scrollbars,status',
    'height=' + height,
    'width=' + width,
    'left=' + left,
    'top=' + top,
  ].join();
};

var fbBtn = document.querySelector('.fb-share');
	// not sure why but the below stopped working
/*var fbLink = 'https://www.facebook.com/v3.0/dialog/share?' +
	'app_id=' + fbSDKId +
	'&channel_url=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fvy-MhgbfL4v.js%3Fversion%3D44%23cb%3Df5724576a443fc%26domain%3Dwww.admissions.purdue.edu%26origin%3Dhttps%253A%252F%252Fwww.admissions.purdue.edu%252Ff17af18a01c645%26relation%3Dopener' +
	'&display=popup' + 
	'&e2e=%7B%7D' +
	'&fallback_redirect_uri=' + encodeURIComponent(location.href) +
	'&href=' + encodeURIComponent(location.href) +
	'&locale=en_US' +
	'&mobile_iframe=true' +
	'&scrape=true' +
	'&next=https%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2Fvy-MhgbfL4v.js%3Fversion%3D44%23cb%3Dffddf91054f2e4%26domain%3Dwww.admissions.purdue.edu%26origin%3Dhttps%253A%252F%252Fwww.admissions.purdue.edu%252Ff17af18a01c645%26relation%3Dopener%26frame%3Df31fd828ad6ebfc%26result%3D%2522xxRESULTTOKENxx%2522' +
	'&sdk=joey' +
	'&version=v3.0'; */
var completeURL = encodeURIComponent(location.href);
var useURLArr = completeURL.split('www');
var fbLink = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2F' + useURLArr[1] + '&display=popup&mobile_iframe=true&scrape=true&src=sdkpreparse';
fbBtn.href = fbLink;
fbBtn.target = '_blank';
/*fbBtn.addEventListener('click', function(e) {
  e.preventDefault();

	 var win = window.open(fbLink, 'ShareOnFacebook', getWindowOptions0());
	 win.opener = null; // 2
});*/


// twitter share
var getWindowOptions = function() {
  var width = 500;
  var height = 350;
  var left = (window.innerWidth / 2) - (width / 2);
  var top = (window.innerHeight / 2) - (height / 2);

  return [
    'resizable,scrollbars,status',
    'height=' + height,
    'width=' + width,
    'left=' + left,
    'top=' + top,
  ].join();
};

var twitterBtn = document.querySelector('.twitter-share');
var hashtags = encodeURIComponent(twitterBtn.getAttribute('data-hashes'));
var shareUrl = 'https://twitter.com/intent/tweet?url=' + location.href + '&text=' + encodeURIComponent(pageTitleText) + '&hashtags=' + hashtags;
twitterBtn.href = shareUrl; // 1

twitterBtn.addEventListener('click', function(e) {
  e.preventDefault();
  var win = window.open(shareUrl, 'ShareOnTwitter', getWindowOptions());
  win.opener = null; // 2
});

// email share
var eLink = 'mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + location.href;
var emailShareBtn = document.getElementById('email-share');
emailShareBtn.href = eLink;

// sms share
var smsLink = 'sms:?&body=' + location.href;
var smsShareBtn = document.getElementById('sms-share');
smsShareBtn.href = smsLink;


// reddit share
var getWindowOptions2 = function() {
  var width = 554;
  var height = 600;
  var left = (window.innerWidth / 2) - (width / 2);
  var top = (window.innerHeight / 2) - (height / 2);

  return [
    'resizable,scrollbars,status',
    'height=' + height,
    'width=' + width,
    'left=' + left,
    'top=' + top,
  ].join();
};

var redditShareBtn = document.getElementById('reddit-share');
var rLink = '//www.reddit.com/submit?url=' +  encodeURIComponent(location.href);
redditShareBtn.href = rLink; 

redditShareBtn.addEventListener('click', function(e) {
  e.preventDefault();
  var win = window.open(rLink, 'ShareOnReddit', getWindowOptions2());
  win.opener = null; // 2
});

// tumblr share
var getWindowOptions3 = function() {
  var width = 554;
  var height = 600;
  var left = (window.innerWidth / 2) - (width / 2);
  var top = (window.innerHeight / 2) - (height / 2);

  return [
    'resizable,scrollbars,status',
    'height=' + height,
    'width=' + width,
    'left=' + left,
    'top=' + top,
  ].join();
};

var tumblrShareBtn = document.getElementById('tumblr-share');
var tLink = 'http://tumblr.com/widgets/share/tool?canonicalUrl=' + location.href;
tumblrShareBtn.href = tLink; 

tumblrShareBtn.addEventListener('click', function(e) {
  e.preventDefault();
  var win = window.open(tLink, 'ShareOnTumblr', getWindowOptions3());
  win.opener = null; // 2
});

// blogger share
var getWindowOptions4 = function() {
  var width = 500;
  var height = 600;
  var left = (window.innerWidth / 2) - (width / 2);
  var top = (window.innerHeight / 2) - (height / 2);

  return [
    'resizable,scrollbars,status',
    'height=' + height,
    'width=' + width,
    'left=' + left,
    'top=' + top,
  ].join();
};

var bloggerShareBtn = document.getElementById('blogger-share');

var firstP = document.querySelector(".main-content p"), desc;

if(firstP === null){
   desc = '';
   } else {
	   desc = firstP.innerText;
   }
if(metaDesc !== ''){
   desc = metaDesc;
   }
if (desc === ''){
	desc = pageTitleText;
}
var bLink = 'https://www.blogger.com/blog_this.pyra?t=' + encodeURIComponent(desc) + '&u=' + location.href + '&n=' + encodeURIComponent(pageTitleText);
bloggerShareBtn.href = bLink; 

bloggerShareBtn.addEventListener('click', function(e) {
  e.preventDefault();
  var win = window.open(bLink, 'ShareOnBlogger', getWindowOptions4());
  win.opener = null; // 2
});
	
}
