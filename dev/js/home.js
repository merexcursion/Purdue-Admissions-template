
$(function(){ 
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
			clearTimeout(self.startRestart);
			self.find('.carousel-text-item.current').removeClass('current');
			self.find($(this).attr('href')).addClass('current');
			self.setIndicators();
			self.startRestart = setTimeout( restart(), settings.delay + 4000);
		});
	
		function restart(){
			self.cycle = setInterval(function(){
				showNext();
			}, settings.delay);
		}
		
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

