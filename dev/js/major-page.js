$(document).ready(function(){
	if($('body').hasClass('majors')){
	
		var $intro = $('#intro');
		var interestsArrText = $intro.attr('data-interests').trim();
		var interestsArr = interestsArrText.split(' ');
		var college = $intro.attr('data-college');
		var curMajor = $intro.find('h1').text().trim();

		$careersListItems = $('#career-interest-list li');
		$majorsListItems = $('#career-major-list li');

		for(var i = 0; i < $careersListItems.length; i++){
			for(var c = 0; c < interestsArr.length; c++){
				if( $careersListItems.eq(i).hasClass(interestsArr[c]) ){
					$careersListItems.eq(i).removeClass('hide');
				} 
			}
		}
		for(var k = 0; k < $majorsListItems.length; k++){
			for(var m = 0; m < interestsArr.length; m++){
				/*if( $majorsListItems.eq(k).find('a').hasClass(interestsArr[m]) && 
				   $majorsListItems.eq(k).hasClass(college) &&  $majorsListItems.eq(k).find('a').text().trim() != curMajor ){
					$majorsListItems.eq(k).removeClass('hide');
				}*/
				if( $majorsListItems.eq(k).hasClass(college) ){
					$majorsListItems.eq(k).removeClass('hide');
				}
			}

		}

		$('#college-for-majors').text( $('#college-link').text().trim() );

		$('.aside.main-content .hide').remove();
		
		if(interestsArrText == ''){
		   $('#related-interests').remove();
		   $('#related-majors').remove();
		   }
		if(college == '' || college == "exploratory-studies"){
		   $('#related-majors').remove();
		   }
		if(college == "exploratory-studies"){
		   $('.aside.main-content h2').remove();
			$('#career-text').remove();
			$('#related-interests-btn').click();
		   }
		
		$('button[data-target="#mailing-list"]').click(function(){
			$(this).blur();
			$('#form_e6973c33-d7ab-41f2-8bf3-44672980bf6e').focus();
		});

	}
});