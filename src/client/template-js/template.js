(function($){
	/*!
		* Copy necessary code from: assets/core.js
		* Area covered
			- Settings button pop up [Top right]
			- Navigation panel [Left side]
			- Menu icon click (Navigation hide) [Top left]
			- Tab-panel nav live click > .active toggle
	*/

	jQuery(document).ready(function(){

		$('#login_toggle').click(function(){
			$('#frm_login').show();
			$('#frm_register').hide();
		});
		$('#register_toggle').click(function(){
			$('#frm_login').hide();
			$('#frm_register').show();
		});
		//***********************************BEGIN Main Menu Toggle *****************************
			$('#layout-condensed-toggle').click(function(){
				$.sidr('close', 'sidr');
				if($('#main-menu').attr('data-inner-menu')=='1'){
					//Do nothing
					console.log("Menu is already condensed");
				}
				else{
					if($('#main-menu').hasClass('mini')){
						$('body').removeClass('grey');
						$('#main-menu').removeClass('mini');
						$('.page-content').removeClass('condensed');
						$('.scrollup').removeClass('to-edge');
						$('.header-seperation').show();
						//Bug fix - In high resolution screen it leaves a white margin
						$('.header-seperation').css('height','61px');
						$('.footer-widget').show();
					}
					else{
						$('body').addClass('grey');
						$('#main-menu').addClass('mini');
						$('.page-content').addClass('condensed');
						$('.scrollup').addClass('to-edge');
						$('.header-seperation').hide();
						$('.footer-widget').hide();
					}
				}
			});
		//***********************************END Main Menu Toggle *****************************

		//**********************************BEGIN MAIN MENU********************************
		var handleSidenarAndContentHeight = function () {
			var content = $('.page-content');
			var sidebar = $('.page-sidebar');

			if (!content.attr("data-height")) {
				content.attr("data-height", content.height());
			}

			if (sidebar.height() > content.height()) {
				content.css("min-height", sidebar.height() + 120);
			} else {
				content.css("min-height", content.attr("data-height"));
			}
		}

		//***********************************BEGIN Fixed Menu*****************************
		var eleHeight =window.screen.height;
		eleHeight=eleHeight-(eleHeight*22.5/100);
		if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))  ) {
			$('#main-menu-wrapper').slimScroll({
				color: '#a1b2bd',
				size: '4px',
				height: eleHeight,
				alwaysVisible: true
			});
		}


		//Delegated
		jQuery('.page-sidebar').on('click', 'li > a',function (e) {
			if ($(this).next().hasClass('sub-menu') == false) {
				return;
			}
			var parent = $(this).parent().parent();

			parent.children('li.open').children('a').children('.arrow').removeClass('open');
			parent.children('li.open').children('a').children('.arrow').removeClass('active');
			parent.children('li.open').children('.sub-menu').slideUp(200);
			parent.children('li').removeClass('open');
			//  parent.children('li').removeClass('active');


			var sub = jQuery(this).next();
			if (sub.is(":visible")) {
				jQuery('.arrow', jQuery(this)).removeClass("open");
				jQuery(this).parent().removeClass("active");
				sub.slideUp(200, function () {
					handleSidenarAndContentHeight();
				});
			} else {
				jQuery('.arrow', jQuery(this)).addClass("open");
				jQuery(this).parent().addClass("open");
				sub.slideDown(200, function () {
					handleSidenarAndContentHeight();
				});
			}

			e.preventDefault();
		});
		//Auto close open menus in Condensed menu
		if( $('.page-sidebar').hasClass('mini'))  {
			var elem = jQuery('.page-sidebar ul');
			elem.children('li.open').children('a').children('.arrow').removeClass('open');
			elem.children('li.open').children('a').children('.arrow').removeClass('active');
			elem.children('li.open').children('.sub-menu').slideUp(200);
			elem.children('li').removeClass('open');
		}
		//**********************************END MAIN MENU********************************

		$('#user-options').click(function(){
			$('#my-task-list').popover('hide');
		});

		//Tab-panel nav > .active toggle

		$('[arm-sidebar]').on('click', '> li', function(){
			var tarEl = $(this);
			if( !tarEl.hasClass('open') ){
				var closeThis = tarEl.parent()
				.find('> li.open a')[0];


				if ($(closeThis).next().hasClass('sub-menu') == false) {
					return;
				}
				var parent = $(closeThis).parent().parent();

				parent.children('li.open').children('a').children('.arrow').removeClass('open');
				parent.children('li.open').children('a').children('.arrow').removeClass('active');
				parent.children('li.open').children('.sub-menu').slideUp(200);
				parent.children('li').removeClass('open');
				//  parent.children('li').removeClass('active');


				var sub = jQuery(closeThis).next();
				console.log(jQuery(closeThis)[0]);
				console.log(jQuery(closeThis).next()[0]);
				if (sub.is(":visible")) {
					jQuery('.arrow', jQuery(closeThis)).removeClass("open");
					jQuery(closeThis).parent().removeClass("active");
					sub.slideUp(200, function () {
						handleSidenarAndContentHeight();
					});
				} else {
					jQuery('.arrow', jQuery(closeThis)).addClass("open");
					jQuery(closeThis).parent().addClass("open");
					sub.slideDown(200, function () {
						handleSidenarAndContentHeight();
					});
				}

			}
		});

	});

})(jQuery);
