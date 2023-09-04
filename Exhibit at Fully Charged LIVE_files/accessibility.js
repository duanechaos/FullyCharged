$(document).ready(function () {
	//== SET CURRENT ELEMENT IN ALL MENUS
	$('ul.menu li').each(function () {
		if($(this).hasClass('is-active')) {
			$(this).attr('aria-current', 'page');
		};
	});

	//== HIDE STICKY HEADER OFF SCREEN
	$('.header-sticky, .l-header-sticky').css('display', 'none');
	$(window).on('scroll', function() {
		if(!$('.header-sticky, .l-header-sticky').hasClass('is-visible')) {
			$('.header-sticky, .l-header-sticky').css('display', 'none');
		} else {
			$('.header-sticky, .l-header-sticky').css('display', 'block');
		};
	});

	$('ul.menu span.menu__item__link, ul.menu span.menu__item__text').each(function () {
		$(this).attr('tabindex', '0');
	});

	// Add Aria roles
	$('.menu--dropdown-responsive > .menu__item, .menu--mega-responsive .menu__item').each(function(){
		if($(this).find('> .menu__sub-menu')){
			$(this).find('.menu__item__link, .menu__item__text').attr('aria-role', 'button');
		};
	});

	function closeTopLevelSubmenus() {
		$('.menu--dropdown-responsive > .menu__item, .menu--mega-responsive > .menu__item').each(function () {
			$('> .menu__item__link, > .menu__item__text').attr('aria-expanded', 'false');
			$('ul.menu--sub-menu').removeClass('open-submenu');
			$('ul.menu--sub-menu').css('display', 'none');
		});		
	};
	
	function closeLowerSubmenus() {
		$('ul.menu--sub-menu--level-1 > .menu__item').each(function () {
			$('> .menu__item__link, > .menu__item__text').attr('aria-expanded', 'false');
			$('ul.menu--sub-menu--level-2').removeClass('open-submenu');
		});		
	};
	
	function toggleSubmenu(menuItem) {		
		var currentMenu = $('> ul.menu--sub-menu', menuItem);
		if($(currentMenu).hasClass('open-submenu')) {
			$(currentMenu).siblings('.menu__item__link, > .menu__item__text').attr('aria-expanded', 'false');
			$(currentMenu).removeClass('open-submenu');
			$(currentMenu).css('display', 'none');
		} else {
			if($(currentMenu).hasClass('menu--sub-menu--level-2')) {
				closeLowerSubmenus();
			} else {
				closeTopLevelSubmenus();
			};
			$(currentMenu).siblings('.menu__item__link, > .menu__item__text').attr('aria-expanded', 'true');
			$(currentMenu).addClass('open-submenu');
			$(currentMenu).css('display', 'block');
		};
		event.preventDefault();
		return false;		
	};

	// Trigger submenu on enter if it has one
	$('ul.menu .menu__item__link, ul.menu span.menu__item__text').on('keydown', function(e) {
		if (e.key === 'Enter' || e.key === ' ') {
			var menu = $(e.target).parent('li');
			if (menu.children('.menu--sub-menu').length > 0) {
				toggleSubmenu(menu);
			};
		};
	});

	//== FULLSCREEN MENU
	function modalHandler(elem) {
		$('.menu--fullscreen span').each(function () {
			$(this).removeAttr('tabindex');
		});

		$('.menu-fullscreen-close').each(function() {
			$(this).attr('aria-role', 'button');
		});

		var tabbable = elem.find('select, input, textarea, button, a').filter(':visible');		
		var firstTabbable = tabbable.first();
		var lastTabbable = tabbable.last();

		// Remove flashing transitions
		tabbable.each(function() {
			$(this).css('transition', 'none');
		});

		// Focus on first modal element
		// setTimeout required because of CSS transition: 0.25s
		setTimeout(function(){
			firstTabbable.focus();
		}, 260);
	
		// Loops focus forwards into the modal
		lastTabbable.on('keydown', function (e) {
		    if ((e.key === 'Tab' && !e.shiftKey)) {
			    e.preventDefault();
			    firstTabbable.focus();
   		    };
		});
	
		// Loops focus backwards into the modal
		firstTabbable.on('keydown', function (e) {
			if ((e.key === 'Tab' && e.shiftKey)) {
				e.preventDefault();
				lastTabbable.focus();
			};
		});
		
		// Close modal on escape
		elem.on('keyup', function(e){
		    if (e.key === 'Escape') {
				$('.navigation, .l-navigation').removeClass('is-visible');
				$(document.body).removeClass('has-menu-visible');
				$('.header__navigation__menu__trigger, .l-header__navigation__menu__trigger, .l-header-sticky__navigation__menu__trigger').focus();
		  	};
		});
	};
	  
	// Open modal with button on enter
	$('.header__navigation__menu__trigger, .l-header__navigation__menu__trigger, .l-header-sticky__navigation__menu__trigger').on('keydown click', function(e){
		if (e.key === 'Enter' || e.type === 'click') {
			e.preventDefault();		
			$('.navigation, .l-navigation').addClass('is-visible');
			$('.l-navigation__menu').attr('aria-role', 'dialog');
			$('.l-navigation__menu').attr('aria-modal', 'true');			
			$(document.body).addClass('has-menu-visible');
			modalHandler($('.navigation, .l-navigation'));
		};
	});
	  
	// Close modal with button on enter
	$('.menu-fullscreen-close').on('keydown', function(e){
		if (e.key === 'Enter') {
			e.preventDefault();		
			$('.navigation, .l-navigation').removeClass('is-visible');
			$('.l-navigation__menu').removeAttr('aria-role');
			$('.l-navigation__menu').removeAttr('aria-modal');			
			$(document.body).removeClass('has-menu-visible');
			$('.header__navigation__menu__trigger, .l-header__navigation__menu__trigger, .l-header-sticky__navigation__menu__trigger').focus();
		};
	});

	//== SEARCH WIDGET MODAL
	function searchModalHandler(searchModal) {
		var tabbable = searchModal.find('select, input, textarea, button, a').filter(':visible');		
		var firstTabbable = tabbable.first();
		var lastTabbable = tabbable.last();
		var searchForm = searchModal.find('.w-search');

		searchModal.on('keydown click', function(e){
			if(e.key === 'Escape') {
				$('.w-modal-search').css('display','none');
				$('.menu__item--search > a').focus();
				$('.l-header__navigation__quick-links__button.js-search-trigger').focus();
			} 
			$('.menu__item--search > a').focus();
			$('.w-modal-search .js-search-trigger').focus();
			$('.w-modal-search .w-search__form__input').focus();
		});

		searchForm.on('keydown click', function(e){
			if(e.key === 'Enter' && $(this) !== '.js-search-trigger') {
				$('.w-search__form').submit();
			};
		});
	
		// Loops focus forwards into the modal
		lastTabbable.on('keydown', function (e) {
		    if ((e.key === 'Tab' && !e.shiftKey)) {
			    e.preventDefault();
			    firstTabbable.focus();
   		    };
		});
	
		// Loops focus backwards into the modal
		firstTabbable.on('keydown', function (e) {
			if ((e.key === 'Tab' && e.shiftKey)) {
				e.preventDefault();
				lastTabbable.focus();
			};
		});
	};

	$('.menu__item--search > a').on('keydown click', function(e){
		if(e.key === 'Enter' || e.type === 'click') {
			setTimeout(function(){
				$('a.js-search-trigger').focus();
				searchModalHandler($('.w-modal-search'));
			}, 260);
		};
	});

	$('.l-header__navigation__quick-links__button.js-search-trigger').on('keydown click', function(e){
		if(e.key === 'Enter' || e.type === 'click') {
			setTimeout(function(){
				$('a.js-search-trigger').focus();
				searchModalHandler($('.w-modal-search'));
			}, 260);
		};
	});	

	//== POPUP
	function popupHandler(popup) {
		var tabbable = popup.find('select, input, textarea, button, a').filter(':visible');		
		var firstTabbable = tabbable.first();
		var lastTabbable = tabbable.last();

		popup.on('keydown click', function(e){
			if(e.key === 'Escape') {
				e.preventDefault();
				$('.l-popup').css('display','none');
				$(document.body).focus();
			};
		});
	
		// Loops focus forwards into the modal
		lastTabbable.on('keydown', function (e) {
		    if ((e.key === 'Tab' && !e.shiftKey)) {
			    e.preventDefault();
			    firstTabbable.focus();
   		    };
		});
	
		// Loops focus backwards into the modal
		firstTabbable.on('keydown', function (e) {
			if ((e.key === 'Tab' && e.shiftKey)) {
				e.preventDefault();
				lastTabbable.focus();
			};
		});
	};

	// Popup delay
	setTimeout(function(){
		if($('.l-popup').hasClass('is-visible')) {
			popupHandler($('.l-popup'));
			$('.l-popup__close__button').focus();
		};
	}, 1000);

	//== OPEN DROPDOWN TOGGLE ACCORDION MENU
	$('.menu--dropdown-toggle .menu__item').each(function(){
		if($(this).find('> .menu__sub-menu')){
			$(this).find('.menu__item__link').attr('aria-role', 'button');
		};
	});

	$('.l-header__navigation__navigation-trigger').attr('tabindex', '0').attr('aria-role', 'button');
	$('.l-header__navigation__navigation-trigger').on('keydown', function(e){
		if(e.key === 'Enter') {
			if($('.l-header__navigation__menu').hasClass('is-visible')) {
				$('.l-header__navigation__menu').removeClass('is-visible');
				$('.l-header__navigation__navigation-trigger').attr('aria-expanded', 'false')
			} else {
				$('.l-header__navigation__menu').addClass('is-visible');
				$('.l-header__navigation__navigation-trigger').attr('aria-expanded', 'true')
				setTimeout(function(){
					$('.l-header__navigation__menu ul li:first-child > .menu__item__link').focus();
				}, 260);
			};
		};
	});
	
	//== DROPDOWN TOGGLE ACCORDION MENU	
	$('.menu--dropdown-toggle .menu__item__link').on('keydown click', function (e) {
		function closeLowerSubmenus() {
			$('.menu--dropdown-toggle > .menu__item > .menu--sub-menu--level-1').each(function() {
				$('.menu--sub-menu--level-2').attr('aria-expanded', 'false');
				$('.menu--sub-menu--level-1 .menu__item__link__trigger').removeClass('is-active');
				$('.menu--sub-menu--level-2').removeClass('is-visible').css('display', 'none');				
				$('.menu--sub-menu--level-2').removeClass('open-submenu')
			});		
		};

		if(e.key === 'Enter' || e.type === 'click') {
			if($(this).find('.menu__item__link__trigger').hasClass('is-active')) {
				$(this).attr('aria-expanded', 'false');
				$(this).find('.menu__item__link__trigger').removeClass('is-active');
				$(this).siblings('.menu--sub-menu').removeClass('is-visible').css('display', 'none');					
			} else {
				closeLowerSubmenus();
				$(this).attr('aria-expanded', 'true');
				$(this).find('.menu__item__link__trigger').addClass('is-active');
				$(this).siblings('.menu--sub-menu').addClass('is-visible').css('display', 'block');
			};
		} 
		if(e.key === 'Escape'){
			$('.menu--dropdown-toggle .menu--sub-menu').each(function() {
				$('.l-header__navigation__menu').removeClass('is-visible');
				$(this).attr('aria-expanded', 'false');
				$(this > '.menu__item__link__trigger').removeClass('is-active');
				$(this).removeClass('is-visible').css('display', 'none');				
				$(this).removeClass('open-submenu');
				$('.l-header__navigation__navigation-trigger').focus();
			});		
		};
	});
});