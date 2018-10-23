
$(function(){ 
"use strict";
if($('body').hasClass('home')){
		
	
	// ------------------------------------------------------------------------
	// Vars
	// ------------------------------------------------------------------------
	var $interactiveExampleP = $('.interactive-exampleP');
	var $majorsList = $('#majors-list');
	var $majors = $majorsList.find('li');
	var $majorsLinks = $majors.find('a');
	var $school = $('#school-choice');
	var $interest = $('#interest-choice');
	var $noMatchNote = $('#no-match-note');
	var windowWidth = $( window ).width();
	$noMatchNote.hide();
	
	function getScrollBarWidth () { //https://stackoverflow.com/questions/986937/how-can-i-get-the-browsers-scrollbar-sizes
	  var inner = document.createElement('p');
	  inner.style.width = "100%";
	  inner.style.height = "200px";

	  var outer = document.createElement('div');
	  outer.style.position = "absolute";
	  outer.style.top = "0px";
	  outer.style.left = "0px";
	  outer.style.visibility = "hidden";
	  outer.style.width = "200px";
	  outer.style.height = "150px";
	  outer.style.overflow = "hidden";
	  outer.appendChild (inner);

	  document.body.appendChild (outer);
	  var w1 = inner.offsetWidth;
	  outer.style.overflow = 'scroll';
	  var w2 = inner.offsetWidth;
	  if (w1 === w2){ w2 = outer.clientWidth; }

	  document.body.removeChild (outer);

	  return (w1 - w2);
	}
	
	// ------------------------------------------------------------------------
	// Bootstrap Carousel - ROI section
	// ------------------------------------------------------------------------
	 $('.carousel').carousel({ interval: 4000, cycle: true });
	
	// ------------------------------------------------------------------------
	// FAQ content slide downs
	// ------------------------------------------------------------------------
	if(windowWidth + getScrollBarWidth() >= 768 ){
	   $interactiveExampleP.slideUp(10);
		
	} else {
		//add class to carousels so won't be applied for mobile and tablet & add collapsible class
		$interactiveExampleP.addClass('collapse').find('.rankings').addClass('stop');
		
		$interactiveExampleP.each(function(){
			// for mobile and tablet view 
			var whichNav = $(this).attr('id');
			var navText = $('#faq-squares ').find('a[data-target="#' + whichNav + '"] .text').html();
			var linkElem = '<button class="faq-button" data-target="#' + whichNav + '" data-toggle="collapse">' + navText + '</button>';
			$(this).before(linkElem);
		});
		
	}
	
	$('#faq-squares a').click(function(event){
		event.preventDefault();
		$interactiveExampleP.slideUp(1);
		$( $(this).attr('data-target') ).slideDown();
	});
	$interactiveExampleP.find('.closeXP').click(function(event){
		event.preventDefault();
		$(this).parents('.interactive-exampleP').slideUp();
	});
	
	var lineH = parseInt($interactiveExampleP.find('.inner-text p').eq(0).css('line-height').slice(0,-2));
	
	$('.rm-it').click(function(event){
		event.preventDefault();
		var container = $(this).prev('.cut-off');
		var scrollTo = parseInt($(this).attr('data-scroll'));
		$(container).animate({
			scrollTop: scrollTo
		});
		$(this).attr('data-scroll', scrollTo + overflowH - (lineH*2));
	});
	$('.inner-text.cut-off').mouseenter(function(){
		$('body').addClass('noScroll').css('margin-right', getScrollBarWidth() + 'px');
	});
	$('.inner-text.cut-off').mouseleave(function(){
		$('body').removeClass('noScroll').css('margin-right', 0);
	});
	
	
	// ------------------------------------------------------------------------
	// FAQ inner text overflow
	// ------------------------------------------------------------------------
	var overflowH, overflowHIn;
	if(windowWidth < 1200){
		overflowH = 160;
	} else {
		overflowH = 235;
	}
	$interactiveExampleP.find('.inner-text').each(function(ind,elem){
		
		if( $(elem).height() > overflowH ){
			
			var carouselH = $(elem).next().find('.carousel-text-wrap').height();
			if( carouselH > 50 ) {
				var diff = carouselH - 50;
				overflowHIn = overflowH - diff;
				
			} else {
				overflowHIn = overflowH;
			}
			$(elem).addClass('cut-off').height(overflowHIn);
		}
	}); 
	
	// ------------------------------------------------------------------------
	// Student and faculty profile hover images
	// ------------------------------------------------------------------------
	$('.profiles').hover(
		function(){
			$(this).css( 'background-image', 'url("' + $(this).attr('data-hoverImg') + '")' );
		},
		function(){
			$(this).css('background-image', 'url("' + $(this).attr('data-returnImg') + '")');
		}
	);

	// ------------------------------------------------------------------------
	// Find undergrad majors
	// ------------------------------------------------------------------------
	$majors.find('a').css('width','1px');
	$majors.hide();
	
	$school.change(function(){
		$noMatchNote.hide();
		var whichSchool = $(this).val();
		$majorsList.find('.currentS').not('.currentI').hide().find('a').css('width','1px');
			
		$majors.each(function(ind,elem){
			$(elem).removeClass('currentS');
			if( $(elem).attr('data-show').indexOf(whichSchool) !== -1 ){
				$(elem).show().addClass('currentS').find('a').animate({
					width: '100%'
				}, 300 );
			}
		});
		removeNoncross();
	});
	
	var whichInterest;
	$interest.change(function(){
		$noMatchNote.hide();
		whichInterest = $(this).val();
		$majorsList.find('.currentI').not('.currentS').hide().find('a').css('width','1px'); 
		
		$majors.delay(5000).each(function(ind,elem){
			$(elem).removeClass('currentI');
			if( $(elem).attr('data-show').indexOf(whichInterest) !== -1 ){
				$(elem).show().addClass('currentI').find('a').animate({
					width: '100%'
				}, 300 );
			}
			
		});
		removeNoncross();
	});
	
	function removeNoncross(){ // remove those that aren't in both if both choices set
		if( $school.val() !== 'initial' && $interest.val() !== 'initial' ){
			
			var $noCrosses = $majors.not('.currentS.currentI');
			var $crosses = $majorsList.find('.currentS.currentI');
			$noCrosses.hide().find('a').css('width','1px').removeClass('currentS currentI');
			
			if($crosses.length === 0) {
				$noMatchNote.show();
			}
			
		} else {
			
			if( $school.val() === 'initial' && $interest.val() !== 'initial'){
				
				$noMatchNote.hide();
				whichInterest = $interest.val();
				$majorsList.find('.currentS').hide().find('a').css('width','1px').removeClass('currentS'); 

				$majors.delay(5000).each(function(ind,elem){
					$(elem).removeClass('currentI');
					if( $(elem).attr('data-show').indexOf(whichInterest) !== -1 ){
						$(elem).show().addClass('currentI').find('a').animate({
							width: '100%'
						}, 300 );
					}

				});
				
			}
			if($school.val() !== 'initial' && $interest.val() === 'initial'){
				
				$noMatchNote.hide();
				whichInterest = $school.val();
				$majorsList.find('.currentI').hide().find('a').css('width','1px').removeClass('currentI'); 

				$majors.delay(5000).each(function(ind,elem){
					$(elem).removeClass('currentS');
					if( $(elem).attr('data-show').indexOf(whichInterest) !== -1 ){
						$(elem).show().addClass('currentS').find('a').animate({
							width: '100%'
						}, 300 );
					}

				});
			}
		}
	}
	
	// for hover colors
	var majorLinkColorClasses = [
		  '#849E2A',
		  '#BAA892',
		  '#C28E0E',
		  '#B46012',
		  '#C28E0E',
		  '#AD1F65',
		  '#29A592',
		  '#C28E0E',
		  '#A3D6D7',
		  '#FF9B1A',
		  '#E9E45B',
		  '#C28E0E',
		  '#C3BE0B',
		  '#6E99B4',
		  '#C28E0E',
		  '#FFD100',
	  ];
	  
	  var colorCount = 0;
	  $majorsLinks.each(function(ind,elem){
		  if(colorCount === majorLinkColorClasses.length){
			  colorCount = 0;
		  }
		  $(elem).attr('data-hover',majorLinkColorClasses[colorCount]);

		colorCount++;
	  });
	  $majorsLinks.hover(
		  function(){
			  $(this).css('background-color',$(this).attr('data-hover'));
		  },
		  function(){
			  $(this).css('background-color','#ddd');
		  }
		  
	  );
	
}
});

(function ( $ ) {
	"use strict";
    $.fn.cycleRanks = function( options ) {
 		var self = this;
		
        // Default options
        var settings = $.extend({
            delay: 3000,
			height: 50
        }, options );
		
		self.find('.carousel-text-wrap').height(settings.height);
        self.find('.carousel-text-item:first-child').addClass('current');
		self.find('.carousel-text-item:last-child').addClass('last');
		
		self.find('.faq-rank-nav a').click(function(event){
			event.preventDefault();
			clearInterval(self.cycle);
			self.find('.carousel-text-item.current').removeClass('current');
			self.find($(this).attr('href')).addClass('current');
			self.setIndicators();
			
			setTimeout(function(){
				self.cycle = setInterval(function(){
					showNext();
				}, settings.delay);
			}, settings.delay + 2000);
			
		});
		
		function showNext(){
			self.find('.carousel-text-item.current').addClass('trans').removeClass('current');
			
			if( self.find('.carousel-text-item.trans').hasClass('last') ){
				
				self.find('.carousel-text-item:first-child').addClass('current');
				
			} else {
				
				self.find('.carousel-text-item.trans').next().addClass('current');
			}
			
			self.find('.carousel-text-item.trans').removeClass('trans');
			self.setIndicators();
			
		}
		
		self.cycle = setInterval(function(){
			showNext();
		}, settings.delay);
		
		self.setIndicators = function(){
			self.indicatorHref = self.find('.carousel-text-item.current').attr('id');
			self.find('.faq-rank-nav a i').removeClass('fas').addClass('far');
			self.find('.faq-rank-nav a[href="#' + self.indicatorHref + '"] i').removeClass('far').addClass('fas');
		};
		
        return self;
    };

}( jQuery ));


$(function(){ 
"use strict";
if($('body').hasClass('all-majors')){
			 
		var $collegePanels = $('#college-panels');
		var $interestChecks = $('#interest-check input');
		var $schoolChecks = $('#school-check input');
		var $majorLinks = $('#college-panels ul li a');
		var $showSchoolsBtn = $('#show-all-schools');
		var $learnMoreBtns = $('.learn-more');
		var $alpha = $('.alpha');
		var collegeClasses = [];
		var icons = [];
			 
		
		$interestChecks.each(function(){
			collegeClasses.push( $(this).val() );
			icons.push( $(this).attr('data-icon') );
		});
				
		$interestChecks.click(function(){
			$majorLinks.css('display','inline-block'); // reset for alpha
			if( $(this).is(':checked')  ){
				$collegePanels.addClass( $(this).val() );
			} else {
				$collegePanels.removeClass( $(this).val() );
			}
			showHide();
		});
		$schoolChecks.click(function(){
			$majorLinks.css('display','inline-block'); // reset for alpha
			$majorLinks.removeClass('show-major');
			$learnMoreBtns.addClass('hide-major');
			var whichSchool = $(this).val();
			$('.' + whichSchool + ' a').addClass('show-major');
			showHide();
			$('.learn-more.' + whichSchool).removeClass('hide-major');
			$showSchoolsBtn.removeClass('disabled');
		});
			 
		$alpha.click(function(event){
			event.preventDefault();
			var whichLetter = $(this).text().trim();
			$majorLinks.css('display','none');
			$('#college-panels ul li a[data-letter="' + whichLetter + '"]').css('display','inline-block');
		});
		
		
		$showSchoolsBtn.click(function(){
			$showSchoolsBtn.addClass('disabled');
			$schoolChecks.each(function(){
				$(this).prop('checked',false);
			});
			showHide();
			$learnMoreBtns.addClass('hide-major');
		});
			 
		// add interest icons based on classes
		$majorLinks.each(function(){
			var curLetter = $(this).text().trim().charAt(0);
			$(this).attr('data-letter', curLetter);
			
			for(var c = 0; c < collegeClasses.length; c++){
				if( $(this).hasClass( collegeClasses[c] ) ){
					$(this).prepend( ' <i class="fas fa-' + icons[c] + ' ' + collegeClasses[c] + '"></i> ');
				}
			}
			
		});
		
		function showHide(){
			// if all unchecked, show all
			var intCheck = false, schCheck = false;
			$interestChecks.each( function(){
				if( $(this).is(':checked')  ){
					intCheck = true;
				}
			});
			$schoolChecks.each( function(){
				if( $(this).is(':checked')  ){
					schCheck = true;
				}
			});
			
			if( !intCheck && !schCheck ){
				$majorLinks.each(function(){
					$(this).removeClass('hide-major');
				});
				$alpha.show();
				
			} else {
				
				$alpha.hide();
			
				$majorLinks.each(function(){
					var $innerIcons = $(this).children('i');
					var hasVisibleIcon = false;
					$innerIcons.each(function(){
						if( !( $(this).css('display') === 'none' ) ){
							hasVisibleIcon = true;
						}
					});
					
					if(intCheck === true && schCheck === false){
						
						if( !hasVisibleIcon ){
							$(this).addClass('hide-major');
						} else {
							$(this).removeClass('hide-major');
						}
						//$showSchoolsBtn.removeClass('disabled');
						
					} else if( intCheck === false && schCheck === true ){
						
						if( !$(this).hasClass('show-major') ){
							$(this).addClass('hide-major');
						} else {
							$(this).removeClass('hide-major');
						}
						
					} else {
						
						if( $(this).hasClass('show-major') && hasVisibleIcon ){
							$(this).removeClass('hide-major');
						} else {
							$(this).addClass('hide-major');
						}
					}

				});
			}
		}
}
});
(function(){
	"use strict";

	document.getElementsByTagName("html")[0].classList = ''; // removes no-js
	document.createElement("video"); // make sure video tag will render bg imag as fallback
	
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
		$('.nojs-warning').remove();
		var $googleInput = $('#google-input');
		
		$('#top-link').click(function(event){
			event.preventDefault();
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
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
}());