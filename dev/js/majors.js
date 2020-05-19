$(function(){ 
if($('body').hasClass('all-majors')){
			 
		var $collegePanels = $('#college-panels').not('.interests');
		var $interestChecks = $('#interest-check input');
		var $schoolChecks = $('#school-check input');
		var $majors = $collegePanels.find('li');
		var $majorLinks = $majors.find('a');
		var $showSchoolsBtn = $('#show-all-schools');
		var $learnMoreBtns = $('.learn-more');
		var $alpha = $('.alpha');
		var $clearAllBtn = $('#clear-all');
		var collegeClasses = [];
		var icons = [];
		var $majorsSearchForm = $('#search-majors');
		var $searchField = $('#search-term');
		var $autocomplete = $('#autocomplete');
		var $autocompleteParent = $('.autocomplete');
		var $nonSearchCategories = $('.non-search-categories');
		var $noMajorsFoundNotice = $('#empty-search-notice');
	
		$searchField.val(''); // clear on load to prevent saving stats that are old or browser cached
	
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
			$majors.removeClass('hide');
			$autocompleteParent.addClass('hide');
			$searchField.val('');
			$majors.removeClass('hide');
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
	
		// record which major clicked after search bar used
		$majorLinks.click(function(event){ 
			
			event.preventDefault();
			var page = $(this).attr('href');
			var searchTerm = $searchField.val().trim();
			
			if(searchTerm != ''){
				
				var returnPage = 'search-majors-stats.php' + '?search-term=' + encodeURI(searchTerm) + '&major-clicked=' + encodeURI($(this).text().trim());
				
				$.get(returnPage, function(data, status){
					//console.log(data);
				});
				
			} 
			window.location.assign("https://" + window.location.hostname + "/majors/" + page);
		});
		
		// majors search
		$('#submit-search-form').click(function(){
			$majorsSearchForm.submit();
		})
		$majorsSearchForm.submit(function(event){
			event.preventDefault();
			$nonSearchCategories.hide();
			var searchTerm = $searchField.val().trim();
			var returnPage = 'search-majors.php' + '?search-term=' + encodeURI(searchTerm);

			$.get(returnPage, function(data, status){
				var returnMajors = JSON.parse(data);
				$majors.addClass('hide');
				$autocompleteParent.addClass('hide');
				for(var m=0;m<returnMajors.length;m++){
					$majors.each(function(){
						if( $(this).attr('data-search-major') == returnMajors[m] ){
						   $(this).removeClass('hide').attr('data-save-search', searchTerm);
						}
					});
				}
				$searchField.blur();
				$autocompleteParent.addClass('hide');
				// record empty search
				var majorsShowing = $('#college-panels ul li').not('.hide');
				//console.log(majorsShowing);
				if(majorsShowing.length === 0){
					var returnPage = 'search-majors-stats.php' + '?search-term=' + encodeURI(searchTerm) + '&major-clicked=none';
					$.get(returnPage, function(data, status){
						//console.log(data);
					});
					$noMajorsFoundNotice.removeClass('hide');
					$searchField.focus();
				} else {
					$noMajorsFoundNotice.addClass('hide');
				}
			});
			
		});
			
		var cleared = false;
		$searchField.keyup(function(){
			
			var searchTerm = $searchField.val().trim();
			if(searchTerm !== ''){
				
				if(!cleared){
					$clearAllBtn.click();
					cleared = true;
					$searchField.val(searchTerm);
				}
				
				var returnPage = 'search-majors.php' + '?search-chars=' + encodeURI(searchTerm);

				$.get(returnPage, function(data, status){
					var returnKeywords = JSON.parse(data);
					$autocomplete.html('');
					if(returnKeywords.length > 0){
						$autocompleteParent.removeClass('hide');
						$noMajorsFoundNotice.addClass('hide');
						$autocomplete.attr('size',returnKeywords.length);
					} else {
						$autocompleteParent.addClass('hide');
					}
					for(var x=0;x<returnKeywords.length;x++){
						$autocomplete.append('<a href="#">' + returnKeywords[x] + '</a><br>');
						$autocomplete.find('a').click(function(event) {
							event.preventDefault();
							$searchField.val( $(this).text() );
							$majorsSearchForm.submit();
						});
					}
				});
				$nonSearchCategories.hide();
				$majors.addClass('hide');
				
			} else {
				$autocompleteParent.addClass('hide');
				$majors.removeClass('hide');
				$nonSearchCategories.show();
				cleared = false;
				$noMajorsFoundNotce.addClass('hide');
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