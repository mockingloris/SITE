// ================================================================= //
// ================================================================= //
// ================================================================= //
// ==================== [GREENSOCK Animation] ====================== //
// =============== [javaScript DOM Manipulation] =================== //
// ================== [javaScript Variables] ======================= //
// ================================================================= //
// ================================================================= //
		$(document).ready(function() {
		  $('.navigation li').click(function() {
			$('.navigation li').removeClass('selected');
			$(this).addClass('selected');
			var index = $('.navigation li').index($(this));
			$('.my-panel').css('z-index', 0);
			$('.my-panel').eq(index).css('z-index', 2);
		  })
		});
		
		var header = document.getElementById("user"),
			h3 = document.getElementsByTagName('h3'),
			intro = document.getElementsByClassName("user_info");
			// firstItem = document.getElementsByClassName("list")[0].firstElementChild,
			// secondItem = document.getElementsByClassName("list")[0].children[1],
			// lastItem = document.getElementsByClassName("list")[0].lastElementChild;

		TweenMax.to(h3, 3, {opacity: 0, y: 10});

