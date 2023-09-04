/*
* @Title: Javascript - Site
* @Author: JGuerreiro
* @Date:   2015-02-27 11:32:22
* @Last Modified by:   ASP Design
* @Last Modified time: 2019-08-05 10:47:11
*
*/

/**
 * @license
 * Lodash (Custom Build) lodash.com/license | Underscore.js 1.8.3 underscorejs.org/LICENSE
 * Build: `lodash include="debounce"`
 */
 ;(function(){function e(){}function t(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}function n(e){return null!=e&&typeof e=="object"}function o(e){var t;if(!(t=typeof e=="symbol")&&(t=n(e))){if(null==e)e=e===i?"[object Undefined]":"[object Null]";else if(v&&v in Object(e)){t=d.call(e,v);var o=e[v];try{e[v]=i;var r=true}catch(e){}var u=j.call(e);r&&(t?e[v]=o:delete e[v]),e=u}else e=j.call(e);t="[object Symbol]"==e}return t}function r(e){if(typeof e=="number")return e;if(o(e))return u;
 if(t(e)&&(e=typeof e.valueOf=="function"?e.valueOf():e,e=t(e)?e+"":e),typeof e!="string")return 0===e?e:+e;e=e.replace(f,"");var n=l.test(e);return n||a.test(e)?s(e.slice(2),n?2:8):c.test(e)?u:+e}var i,u=NaN,f=/^\s+|\s+$/g,c=/^[-+]0x[0-9a-f]+$/i,l=/^0b[01]+$/i,a=/^0o[0-7]+$/i,s=parseInt,b=typeof self=="object"&&self&&self.Object===Object&&self,p=typeof global=="object"&&global&&global.Object===Object&&global||b||Function("return this")(),y=(b=typeof exports=="object"&&exports&&!exports.nodeType&&exports)&&typeof module=="object"&&module&&!module.nodeType&&module,m=Object.prototype,d=m.hasOwnProperty,j=m.toString,v=(m=p.Symbol)?m.toStringTag:i,g=Math.max,O=Math.min,x=function(){
 return p.Date.now()};e.debounce=function(e,n,o){function u(t){var n=s,o=b;return s=b=i,j=t,y=e.apply(o,n)}function f(e){var t=e-d;return e-=j,d===i||t>=n||0>t||h&&e>=p}function c(){var e=x();if(f(e))return l(e);var t,o=setTimeout;t=e-j,e=n-(e-d),t=h?O(e,p-t):e,m=o(c,t)}function l(e){return m=i,T&&s?u(e):(s=b=i,y)}function a(){var e=x(),t=f(e);if(s=arguments,b=this,d=e,t){if(m===i)return j=e=d,m=setTimeout(c,n),v?u(e):y;if(h)return m=setTimeout(c,n),u(d)}return m===i&&(m=setTimeout(c,n)),y}var s,b,p,y,m,d,j=0,v=false,h=false,T=true;
 if(typeof e!="function")throw new TypeError("Expected a function");return n=r(n)||0,t(o)&&(v=!!o.leading,p=(h="maxWait"in o)?g(r(o.maxWait)||0,n):p,T="trailing"in o?!!o.trailing:T),a.cancel=function(){m!==i&&clearTimeout(m),j=0,s=d=b=m=i},a.flush=function(){return m===i?y:l(x())},a},e.isObject=t,e.isObjectLike=n,e.isSymbol=o,e.now=x,e.toNumber=r,e.VERSION="4.17.5",typeof define=="function"&&typeof define.amd=="object"&&define.amd?(p._=e, define(function(){return e})):y?((y.exports=e)._=e,b._=e):p._=e;
 }).call(this);

$(document).ready(function(){
	//== GLOBAL VARIABLE
	window.headerSticky = $('.l-header-sticky'); //@note: Accessed from anchor.js

	//== LAYOUT: HEADER STICKY
	if ($('.l-header').length) {
		var headerOffsetTop = $( '.l-header' ).offset().top + $( '.l-header' ).outerHeight();
	}

	$(window).scroll(function(){
		var scrollTop = $(window).scrollTop();

		if ( scrollTop > headerOffsetTop ){
			$( '.l-header-sticky' ).addClass( 'is-visible' );
		}
		else {
			$( '.l-header-sticky' ).removeClass( 'is-visible' );
		}
	});

	//== SCROLL TO TOP
	if ($('.js-to-top').length) {
		var heroOffsetTop;

		if( $('.l-hero').length) {
			heroOffsetTop = $( '.l-hero' ).offset().top;
		}

		$( window).scroll(function(){
			var scrollTopTriggerPoint= 400;
			var scrollTop = $(window).scrollTop();

			if( $('.l-hero').length) {
				scrollTopTriggerPoint= heroOffsetTop + $( '.l-hero' ).outerHeight();
			}

			scrollTop > scrollTopTriggerPoint ? $( '.js-to-top' ).fadeIn() : $( '.js-to-top' ).fadeOut()

			if($(window).scrollTop() + $(window).height() > $(document).height() - $( '.l-footer__menu-showoff' ).height() ) {
		       $( '.js-to-top' ).addClass( 'is-bottom' );
   			}
			else {
				$( '.js-to-top' ).removeClass( 'is-bottom' );
			}
		});

		$( '.js-to-top' ).click(function() {
			$( 'html, body' ).animate( { scrollTop: 0 }, 'fast' );
		});
	}

	//== TEMPLATE: HOMEPAGE
	if ( $( '.t-homepage') ) {
		//-- LAYOUT: HERO

		//.. LAYOUT: HERO - PADDING

		function setHeroPadding() {
			var $header = $( '.l-header' );
			var headerHeight = $( '.l-header' ).outerHeight(true);

			var $hero = $( '.l-hero' );

			if ( $hero.data( 'hero-option' ) == 1 ) {
				if ( $hero.data( 'hero-style') == 1 || $hero.data( 'hero-style') == 2 ) {
					var $heroPanel = $( '.l-hero .panel' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroPanel.attr( 'padding-top', '');
					}
					else {
						$heroPanel.css( 'padding-top', headerHeight + 'px');
					}
				}
				else if ( $hero.data( 'hero-style') == 3 ) {
					var $heroPanelContent = $( '.l-hero .panel .panel__header-body' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroPanelContent.attr( 'padding-top', '');
					}
					else {
						$heroPanelContent.css( 'padding-top', headerHeight + 'px');
					}
				}
			}
			else if ( $hero.data( 'hero-option' ) == 2 ) {
				if ( $hero.data( 'hero-style') == 1 ) {
					var $heroSlideBody = $( '.l-hero .w-icatcher-slider__list__item__body' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroSlideBody.attr( 'padding-top', '');
					}
					else {
						$heroSlideBody.css( 'padding-top', headerHeight + 'px');
					}
				}
				else if ( $hero.data( 'hero-style') == 2 ) {
					var $heroSlideItem = $( '.l-hero .w-icatcher-slider__list__item' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroSlideItem.attr( 'padding-top', '');
					}
					else {
						$heroSlideItem.css( 'padding-top', headerHeight + 'px');
					}
				}
				else if ( $hero.data( 'hero-style') == 3 ) {
					var $heroSlideBody = $( '.l-hero .w-icatcher-slider__list__item__body' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroSlideBody.attr( 'padding-top', '');
					}
					else {
						$heroSlideBody.css( 'padding-top', headerHeight + 'px');
					}
				}
			}
			else if ( $hero.data( 'hero-option' ) == 3 ) {
				if ( $hero.data( 'hero-style') == 1 || $hero.data( 'hero-style') == 2 ) {
					var $heroPanel = $( '.l-hero .panel' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroPanel.attr( 'padding-top', '');
					}
					else {
						$heroPanel.css( 'padding-top', headerHeight + 'px');
					}
				}
				else if ( $hero.data( 'hero-style') == 3 ) {
					var $heroPanelContent = $( '.l-hero .panel .panel__header-body' );

					if ( $header.css( 'position' ) === 'fixed' ) {
						$heroPanelContent.attr( 'padding-top', '');
					}
					else {
						$heroPanelContent.css( 'padding-top', headerHeight + 'px');
					}
				}
			}

			else if ( $hero.data( 'hero-option' ) == 4 ) {
				var $heroPanel = $( '.l-hero .panel' );

				if ( $header.css( 'position' ) === 'fixed' ) {
					$heroPanel.attr( 'padding-top', '');
				}
				else {
					$heroPanel.css( 'padding-top', headerHeight + 'px');
				}
			}
		}

		setHeroPadding();

		$( window ).resize( setHeroPadding );



		//.. LAYOUT: HERO - SLIDER

		if ( $( '.l-hero' ).data( 'hero-option' ) == 2 ) {
			// This is so I don't need to overwrite a bunch of default styles set for the iCatcher Slider
			$( '.l-hero .w-icatcher-slider' ).addClass( 'w-icatcher-slider--hero' );
		}



		//.. LAYOUT: HERO - VIDEO
		if ( $( '.l-hero' ).data( 'hero-option' ) == 3 ) {
			var $heroPanel = $( '.l-hero .panel' );
			var $heroVideo = $heroPanel.find( '.w-video' );
			$heroVideo.appendTo($heroPanel.find( '.panel__video' ));
		}

	}




	//== TEMPLATE: SUBPAGE

	//-- PAGE TITLE IMAGE
	var pageTitleImage = $( '.l-page-title__image .panel__body img' ).attr( 'src' );

	if ( pageTitleImage && pageTitleImage.length ) {
		$( '.js-l-header-page-title-background' ).css( 'background-image', 'url("' + pageTitleImage + '")' );
		$( '.js-l-page-title' ).css( 'background-image', 'url("' + pageTitleImage + '")' );
	}

	//-- PAGE TITLE PADDING FROM HEADER
	function setPageTitlePadding() {
		var $header = $( '.l-header' );
		var headerHeight = $( '.l-header' ).outerHeight(true);

		var $pageTitle = $( '.l-page-title' );

		if ( $header.css("position") == "fixed" ) {
			$pageTitle.attr( 'padding-top', '');
		}
		else {
			$pageTitle.css( 'padding-top', headerHeight + 'px');
		}
	}

	setPageTitlePadding();

	$( window ).resize( setPageTitlePadding );


	//== BUTTONS

	$( '.ck-button-one.is-aligned, .ck-button-two.is-aligned, .ck-button-three.is-aligned, .ck-button-four.is-aligned, .ck-button-five.is-aligned' ).each( function(){
		var $button = $( this );
		var $parentArticle = $button.parents( '.article' );

		if ( $parentArticle.hasClass( 'article--boxed' ) || $parentArticle.hasClass( 'article--default' ) || $parentArticle.hasClass( 'article--button' ) ) {
			if ( $button.is( ':only-child' )) {
				$button.parent().remove();
			}

			$parentArticle.addClass( 'has-buttons-aligned' ).append( $button.wrap( '<div class="article__buttons" />' ).parent());
		}
	});

	//== ARTICLES
	$( '.article--stats' ).each(function(){
		var $article = $(this);

		if ( $article.find('.article__header__title p[style*="text-align"]').length ) {
			$article.addClass('is-centered');
		}	
	});


	//== SECTIONS

	//-- SECTION TITLE UNDERLINE
	$( '.section' ).each(function(){
		var $section = $(this);
		var $sectionTitle = $section.find(".section__header__title");

		if ( $section.find('.section__header__title p[style*="text-align"]').length ) {
			$sectionTitle.addClass('is-centered');
		}	
	});

	$( '.section--Background-Image, .section--Background-Parallax-Image, .section--Background-Image-No-Overlay' ).each( function(){
		var $this = $(this);
		var sectionImage = $this.find( '.section__image img' ).attr( 'src' );

		if ( sectionImage && sectionImage.length ) {
			$this.css( 'background-image', 'url("' + sectionImage + '")' );
		}
	});


	function wrapGridSections() {
		if ( $(window).width() <= 1023 && !$('.has-section-grid-small').length ) {

			$('.l-content').addClass('has-section-grid-small');

			if($('.has-section-grid-large').length) {
				$('.l-content').removeClass('has-section-grid-large');
			}

			$( '.section__body__article-wrapper-1, .section__body__article-wrapper-2, .section__body__article-wrapper-3' ).each( function(){
				$( this ).contents().unwrap();
			});

			$( '.section--Grid-3-Style-4' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1' ).wrap( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-2, .section__body__article--id-3' ).wrapAll( '<div class="section__body__article-wrapper-2"/ >');
			});

			$( '.section--Grid-3-Style-5' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1, .section__body__article--id-2' ).wrapAll( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-3' ).wrap( '<div class="section__body__article-wrapper-2"/ >');
			});


		} else if ( $(window).width() >= 1024 && !$('.has-section-grid-large').length ) {

			$('.l-content').addClass('has-section-grid-large');

			if($('.has-section-grid-small').length) {
				$('.l-content').removeClass('has-section-grid-small');
			}

			$( '.section--Grid-3-Style-4' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1' ).wrap( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-2, .section__body__article--id-3' ).wrapAll( '<div class="section__body__article-wrapper-2"/ >');
			});

			$( '.section--Grid-3-Style-5' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1, .section__body__article--id-2' ).wrapAll( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-3' ).wrap( '<div class="section__body__article-wrapper-2"/ >');
			});

			$( '.section--Grid-4-Style-1, .section--Grid-4-Style-2' ).each( function(){
			var $section = $( this );
			$section.find( '.section__body__article--id-1' ).wrap( '<div class="section__body__article-wrapper-1"/ >');
			$section.find( '.section__body__article--id-2, .section__body__article--id-3, .section__body__article--id-4' ).wrapAll( '<div class="section__body__article-wrapper-2"/ >');
			});

			$( '.section--Grid-4-Style-3, .section--Grid-4-Style-4' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1, .section__body__article--id-2, .section__body__article--id-3' ).wrapAll( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-4' ).wrap( '<div class="section__body__article-wrapper-2"/ >');
			});

			$( '.section--Grid-4-Style-5' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1, .section__body__article--id-2' ).wrapAll( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-3' ).wrap( '<div class="section__body__article-wrapper-2"/ >');
				$section.find( '.section__body__article--id-4' ).wrap( '<div class="section__body__article-wrapper-3"/ >');
			});

			$( '.section--Grid-4-Style-6' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1' ).wrap( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-2, .section__body__article--id-3' ).wrapAll( '<div class="section__body__article-wrapper-2"/ >');
				$section.find( '.section__body__article--id-4' ).wrap( '<div class="section__body__article-wrapper-3"/ >');
			});

			$( '.section--Grid-4-Style-7' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1' ).wrap( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-2' ).wrap( '<div class="section__body__article-wrapper-2"/ >');
				$section.find( '.section__body__article--id-3, .section__body__article--id-4' ).wrapAll( '<div class="section__body__article-wrapper-3"/ >');
			});

			$( '.section--Grid-4-Style-8' ).each( function(){
				var $section = $( this );
				$section.find( '.section__body__article--id-1, .section__body__article--id-2' ).wrapAll( '<div class="section__body__article-wrapper-1"/ >');
				$section.find( '.section__body__article--id-3, .section__body__article--id-4' ).wrapAll( '<div class="section__body__article-wrapper-2"/ >');
			});
		}

		// @Note: Edge Fix - Reset the video tag after the DOM has been manipulated to prevent loading issues on Edge
		if(navigator.userAgent.indexOf('Edge') >= 0 && $( "[class*='section--Grid'] .article--video-only" ).length) {
			$( "[class*='section--Grid'] .article--video-only" ).each( function(){
				var $article = $( this );
				var $articleVideo = $article.find('.article__video');
				var $video = $articleVideo.find('video');
				var $videoClass = $video.attr('class');
				var $videoSrc = $video.find('source').attr('src');

				$articleVideo.remove('video');
				$articleVideo.append('<video class="'+ $videoClass +'" playsinline="" autoplay="" muted="" loop=""><source  src="' + $videoSrc + '" type="video/mp4"></video>');
			});
			console.log('Errors HTML1512 and HTTP412 related to video tag have been fixed'); // Log this to informe those errors have been fixed.
		}
	}

	wrapGridSections();

	$( window ).resize( function() {
		wrapGridSections();
	});



	//== SECTION: TABS
	if ( $( '.section--Tabs' ).length ) {
		$script('/themes/_base-snippets/1-2-0/includes/javascripts/dist/components/pages/sections/tabs.js', function () {
			componentsPagesSectionsTabs.init( {target: '.section--Tabs'} );
		});
	}

	// note: recalling the tabs function for button modal 
	$(document).on('modal-ready', function(){
		if ( $( '.section--Tabs' ).length ) {
			$script('/themes/_base-snippets/1-2-0/includes/javascripts/dist/components/pages/sections/tabs.js', function () {
				componentsPagesSectionsTabs.init( {target: '.section--Tabs'} );
			});
		}
	});


	//== LAYOUT: TABS
	if ( $( '.l-tabs' ).length ) {
		$script('/themes/_base-snippets/1-2-0/includes/javascripts/dist/components/panels/tabs.js', function () {
			componentsPanelsTabs.init( {target: '.l-tabs__body'} );
		});
	}


	//== MOBILE NAVIGATION

	$( '.js-navigation-mobile-open' ).click( function( e ){
		$( '.js-navigation-mobile' ).addClass( 'is-visible' );
		$( 'body' ).addClass( 'has-menu-visible' );

		e.preventDefault();
	});

	$( '.js-navigation-mobile-close' ).click( function( e ){
		$( '.js-navigation-mobile' ).removeClass( 'is-visible' );
		$( 'body' ).removeClass( 'has-menu-visible' );

		e.preventDefault();
	});


	//== TYPE: TOGGLE
	//-- Accordion style menu. Used mostly as the default mobile option.

	$( '.js-menu-dropdown-toggle' ).each(function(){
		var $menu 		= $(this),
			$menuItems 	= $menu.find( '.menu__item' );

		$menuItems.each(function(){
			var $menuItem = $(this);
			var $menuItemSubMenu = $menuItem.children( '.menu--sub-menu' );
			if ( $menuItem.parent().is('.js-menu-dropdown-toggle') ) {
				$menuItem.addClass('is-parent');
			}
			if ( $menuItemSubMenu.length ) {
				var $menuItemLink = $menuItem.children( '.menu__item__link' );
				var $menuItemText = $menuItem.children( '.menu__item__text' );
				if ( $menuItemLink.length ) {
					$menuItemLink.append( '<span class="menu__item__link__trigger js-menu-dropdown-toggle-submenu-trigger"></span>' );
				}
				else {
					$menuItemText.addClass( 'js-menu-dropdown-toggle-submenu-trigger is-linked' );
					$menuItemText.append( '<span class="menu__item__text__trigger js-menu-dropdown-toggle-submenu-trigger"></span>' );
				}
			}
		});
	});

    $( '.js-menu-dropdown-toggle-submenu-trigger' ).on( 'click touchstart', function(e) {
    	var $currentTrigger = $(this);
    	var $currentMenuItem = $currentTrigger.closest('.menu__item');
        $currentMenuItem.children( '.menu--sub-menu' ).stop().slideToggle().toggleClass( 'is-visible' );
        $currentMenuItem.children( '.menu__item__text, .menu__item__link').children( '.js-menu-dropdown-toggle-submenu-trigger' ).toggleClass( 'is-active' );
        e.stopPropagation();
        e.preventDefault();
    });


    if ( $( '.js-header' ).data( 'header-option' ) == 3 ) {
		$( '.js-header-navigation-menu-trigger' ).mouseenter(function() {
			$( '.js-header-navigation-menu' ).addClass( 'is-visible' );
		}).mouseleave(function() {
			$( '.js-header-navigation-menu' ).removeClass( 'is-visible' );
		});
    }





    //== PATTERN: RESPONSIVE DROPDOWN MENU
	if (window.matchMedia("(min-width: 1024px)").matches) {
	;(function ( $, window, document, undefined ) {

	// Create the defaults
    var pluginName = "showoffMenuDropDownResponsive",
        defaults = {
            moreItemText: '<i class="fa fa-ellipsis-h" aria-hidden="true"></i> <i class="fa fa-angle-down"></i>'
        };


    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.createMoreMenuItem(this.element, this.options);
            this.calculateAvailableMenuSpace(this.element);
            this.initBinders(this.element);

			$(window).on('resize', _.debounce(function(){
				
					this.calculateAvailableMenuSpace(this.element);
				
			}.bind(this), 150));
        },

        initBinders: function(menu) {
        	// On mouse enter
			$( menu ).on( 'mouseenter', '.menu__item', function(){
				$(this).addClass( 'hover' );
			});

			// On mouse leave
			$( menu ).on( 'mouseleave', '.menu__item', function(){
				$(this).removeClass( 'hover' );
			});
        },

        createMoreMenuItem: function(menu, options){
			var html = '<li class="menu__item menu__item--more"><span class="menu__item__text">'+ options.moreItemText + '</span><ul class="menu--sub-menu menu--sub-menu--level-1"></ul></li>';
			$(html).appendTo(menu);
        },

        calculateAvailableMenuSpace: function(menu) {
        	// Calculate the current menu items width
        	var menuWidth = 0;

			$(menu).children().not('.menu__item--more').each(function(){
				menuWidth += Math.ceil($(this).outerWidth(true));
			});

			// Calculate the 'more' menu item width
			var moreMenuWidth = $(menu).find('.menu__item--more').outerWidth(true);

			// Calculate the navigation available space by getting the total menu item width minus the more menu item width
			var navigationAvailableSpace = $(menu).parent().outerWidth(true) - moreMenuWidth;

			// Decides on the space whether menu items need to be moved to the 'more' item or out of it
			if ( menuWidth > navigationAvailableSpace ) {
				// Grabs the last menu item
				var $lastMenuItem = $(menu).children('.menu__item').not('.menu__item--more').last();

				// Sets the width so that we know the width it takes when on the main menu items
				$lastMenuItem.attr('data-width', $lastMenuItem.outerWidth(true));

				// Sends the last menu item to be inserted in the 'more' menu item sub menu
				this.addToMoreMenuItem(menu, $lastMenuItem);
			}
			else {
				this.removeFromMoreMenuItem(menu, menuWidth, navigationAvailableSpace);
			}
        },

        addToMoreMenuItem: function(menu, $menuItem) {
        	// Before prepending it, we need to increment the level of the sub menus so that they get
        	// the correct styling applied
        	$menuItem.find('.menu--sub-menu').each(function(){
        		var $subMenu = $(this);
        		var subMenuClass = $subMenu.attr('class');
        		var levelIndex = subMenuClass.indexOf("--level-");

        		var incrementedSubMenuClass = subMenuClass.replace(/\d+$/, function(n){ return ++n });

        		$subMenu.attr('class', incrementedSubMenuClass);
        	});

        	// Prepend the menu item to the 'more menu items'
        	var $moreMenuItems = $(menu).find('.menu__item--more').children('.menu--sub-menu');
        	$menuItem.prependTo($moreMenuItems);

        	this.setMoreMenuItemVisibility(menu);
        	this.calculateAvailableMenuSpace(menu);
        },

        removeFromMoreMenuItem: function(menu, menuWidth, navigationAvailableSpace) {
        	// Grabs the first menu item from the 'more' menu items and puts it back on the main menu items list
			var $moreMenuItem = $(menu).find('.menu__item--more');
			var $firstMoreMenuItem = $moreMenuItem.children('.menu--sub-menu').children('.menu__item').first();
			var firstMoreMenuItemWidth = $firstMoreMenuItem.data('width');

			// Grabs the first menu item from the 'more' menu items checks for its original width,
			// and if there is enough space, puts it back on the main menu items list
			if( $moreMenuItem.children('.menu--sub-menu').children().length && ((menuWidth + firstMoreMenuItemWidth) < navigationAvailableSpace) ) {
	        	// Before putting it back, we need to decrement the level of the sub menus so that they get
	        	// the correct styling applied
	        	$firstMoreMenuItem.find('.menu--sub-menu').each(function(){
	        		var $subMenu = $(this);
	        		var subMenuClass = $subMenu.attr('class');
	        		var levelIndex = subMenuClass.indexOf("--level-");

	        		var incrementedSubMenuClass = subMenuClass.replace(/\d+$/, function(n){ return --n });

	        		$subMenu.attr('class', incrementedSubMenuClass);
	        	});

				$firstMoreMenuItem.removeAttr('data-width');
				$firstMoreMenuItem.insertBefore($moreMenuItem);

				this.calculateAvailableMenuSpace(menu);
			}

			this.setMoreMenuItemVisibility(menu);
        },

        setMoreMenuItemVisibility: function(menu) {
        	var $moreMenuItem = $(menu).find('.menu__item--more');

			if ( $moreMenuItem.children('.menu--sub-menu').children().length ) {
				$moreMenuItem.show();
			} else {
				$moreMenuItem.hide();
			}
        }
		
    };


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

	})( jQuery, window, document );
	}

	if (window.matchMedia("(min-width: 1024px)").matches) {
		if ( $( '.menu--dropdown-responsive' ).length ) {
			$( '.menu--dropdown-responsive' ).showoffMenuDropDownResponsive();
		}
	}

	//== TESTIMONIALS

	var $testimonials = $( '.l-testimonials' );
	var $testimonialsImage = $( '.l-testimonials .panel__image img' );

	if ( $testimonialsImage.length ) {
		$testimonials.css('background-image', 'url("' + $testimonialsImage.attr( 'src' ) + '")');
	}

	//== POPUP
	if ( $( '.l-popup' ).length ) {
		var $popup = $( '.l-popup' );

		if ( $popup.data( 'enabled' ) == "yes" ) {
			$script('/__themes/_template_expo_crio_01/includes/javascripts/global/plugins/js.cookie.js', function(){

				// The whole cookie businness
				var delay = $popup.data( 'delay' );
				var expires = $popup.data( 'expires' );
				var timer = 0;
				var id = $popup.find(".panel").attr("data-id") || "";

				if ( Cookies.get('popupTimer') ) {
					timer = Cookies.get('popupTimer');
				}

				if ( !Cookies.get('popup' + id) ) {
					if ( delay ) {
						setInterval( function(){
							if ( !Cookies.get('popup' + id) ) {
								Cookies.set('popupTimer', timer, { path: '' });

								if ( timer >= delay ) {
									if ( expires > 0 ) {
										Cookies.set('popup' + id, 'true', { expires: expires });
									}
									else {
										Cookies.set('popup' + id, 'true');
									}

									Cookies.remove('popupTimer');

									$popup.addClass( 'is-visible' );
									$( 'body' ).addClass( 'has-popup-visible' );
								}

								timer++;
							}
						}, 1000 );
					}
					else {
						if ( expires > 0 ) {
							Cookies.set('popup' + id, 'true', { expires: expires });
						}
						else {
							Cookies.set('popup' + id, 'true');
						}

						$popup.addClass( 'is-visible' );
						$( 'body' ).addClass( 'has-popup-visible' );
					}
				}

				// The close button
				$( '.js-popup-close' ).click( function() {
					$popup.removeClass( 'is-visible' );
					$( 'body' ).removeClass( 'has-popup-visible' );
				});

				// Pressing the esc
				$(document).keydown(function(e) {
					if (e.keyCode == 27) {
						$popup.removeClass( 'is-visible' );
						$( 'body' ).removeClass( 'has-popup-visible' );
					}
				});
			});
		}

	}

	//== EXIT POPUP PANEL
	if ( $( '.l-popup-exit' ).length ) {
		var $popupExit = $( '.l-popup-exit' );
		var $popup = $( '.l-popup' );

		if ( $popupExit.data( 'enabled' ) == "yes" ) {
			$script('/__themes/_template_expo_bloom_01/includes/javascripts/global/plugins/js.cookie.js', function(){
				function showExitPopup(){
					setTimeout(() => {
						if ( !Cookies.get('popupExit') ) {
							$(document).on('mouseout', function(event) {
								if(!event.toElement && !event.relatedTarget) {
									$popup.removeClass( 'is-visible' );

									$popupExit.addClass( 'is-visible' );
									$( 'body' ).addClass( 'has-popup-visible' );

									Cookies.set('popupExit', 'true', {});

									$(document).off( 'mouseout' );									
								}
							});
						}
					}, 5000);
				}

				$( '.js-popup-exit-close' ).click( function(){
					$popupExit.removeClass( 'is-visible' );
					$( 'body' ).removeClass( 'has-popup-visible' );
				});

				$( '.js-popup-exit-close' ).on('touchstart', function(){
					$popupExit.removeClass( 'is-visible' );
					$( 'body' ).removeClass( 'has-popup-visible' );
				});

				$(window).load(showExitPopup);
			});
		};
	};
});
