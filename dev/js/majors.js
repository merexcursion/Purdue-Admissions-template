$(function(){ 
if($('body').hasClass('all-majors')){
			 
		var $collegePanels = $('#college-panels');
		var $interestChecks = $('#interest-check input');
		var $schoolChecks = $('#school-check input');
		var $majorLinks = $('#college-panels ul li a');
		var $showSchoolsBtn = $('#show-all-schools');
		var $learnMoreBtns = $('.learn-more');
		var $alpha = $('.alpha');
		var $clearAllBtn = $('#clear-all');
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
			$clearAllBtn.removeClass('disabled');
		});
		
		$clearAllBtn.click(function(){
			$showSchoolsBtn.addClass('disabled');
			$schoolChecks.each(function(){
				$(this).prop('checked',false);
			});
			$interestChecks.each(function(){
				$(this).prop('checked',false);
			});
			$learnMoreBtns.addClass('hide-major');
			$collegePanels.attr('class','').addClass('row');
			showHide();
			$majorLinks.css('display','inline-block');
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
			$clearAllBtn.removeClass('disabled');
			
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
				$clearAllBtn.addClass('disabled');
				
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