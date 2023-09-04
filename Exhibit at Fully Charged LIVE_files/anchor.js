$(document).ready(function () {

  // Add the anchor class to a tags anchors added by user trough the back office
  $('a[id][name]').each(function(){
    if ($(this).attr('id') === $(this).attr('name')) {
      $(this).addClass('anchor');
    }

  });

  // Adjust the anchor position when there is a fixed nav
  setTimeout(() => {
    
    if ($(window.headerSticky).length) {
      
      var headerStickyHeight = $(window.headerSticky).outerHeight() + 20;
      $('.anchor').each(function () {
        $(this).css({
          'position': 'relative',
          'visibility': 'hidden',
          'top': -headerStickyHeight
        });
      });
    }
  }, 500);

  // Scroll to anchor on click
  $('a[href*="#"]:not([href="#"]):not([href="##"]):not([href^="#/"]):not([href="#searchToggle"]):not([href*="#Tab--"]):not([class*="js-tab-toggle"]):not([href*="#/login"])').click(function (e) {
    // Check if the it is local or external
    if (location.hostname === this.hostname || !this.hostname.length) {
      // Local
      var viewportWidth = $(window).width();
      var anchorLink = $(this).attr('href').split('#')[1];

      if ( $('a[name*="' + decodeURI(anchorLink) + '"]').length ) {
        var anchorTarget = $('a[name*="' + decodeURI(anchorLink) + '"]').attr('name');
        var offsetHeight;

        if (this.pathname === window.location.pathname) {
          $('html, body').animate({
            scrollTop: $('a[name*="' + decodeURI(anchorLink) + '"]').offset().top
          }, 500);
  
          e.preventDefault();
        }
      }

    } else {
      // External
    }

    // Scroll on mobile when navigation is open - #167442
    var openNavigation = $(".l-navigation-mobile.is-visible");

    if(openNavigation.length) {
      openNavigation.removeClass("is-visible");
    }

  });

});


// Scroll to anchor if the page url has #
$(window).on( "load", function() {

  if (location.hash) {
    let target = location.hash.split('#')[1];

    // Boolean for engage websites and missing anchors on the page
    if (target !== "" && !target.indexOf('/') >= 0 && !$('a[name*="' + decodeURI(target) + '"]').length <= 0) {
      setTimeout(function(){
        $('html, body').animate({
          scrollTop: $('a[name*="' + decodeURI(target) + '"]').offset().top
        }, 500);
      }, 500);
    }  

  }
});
