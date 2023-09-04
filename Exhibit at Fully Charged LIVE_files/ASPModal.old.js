/**
 * Open a new modal window.
 * @param target The target div destination
 * @return
 */
var _paq = _paq || [];
function openModal(target, multiple) {

	//passing through 'multiple' true or false in openRemoteModal so it behaves where you want.
	if (typeof multiple === 'undefined') multiple = 'false';

	//check initial amount of multi pop ups
	var initPopLen = $('*[class*="multiple-"]')
		.filter(function() {
			return this.className.match(/(?:^|\s)multiple-/);
		}).length;

	/*if there are multiple pop ups, dont run usual magnificPopup open, as this does not allow multiple
	as it closes the previous pop up. Instead, we are gonna hide the pop up so it can still be accessed.
	this is specifically for contentLink, when an openRemoteModal() then uses openModal() in
	contentLinkSelectorAdmin.cfm ELSE run magnificPopup.open() as usual*/
	if (initPopLen != 0 && multiple == true) {

		//Add a identifying class to the wrapped modal content div, so we know how many pop ups are active
		$(".mfp-content div").first().addClass("multiple-1", function() {

			//check amount of pop ups after creation
			var pops = $('*[class*="multiple-"]')
				.filter(function() {
					return this.className.match(/(?:^|\s)multiple-/);
				});

			//loop through pop ups
			pops.each(function(i, v) {
				//add 1 to index, because it starts at 0
				var trueIndex = i + 1;
				//the class id number for the new pop up
				var newPop = trueIndex + 1;

				//only add a new pop up after the latest. where trueIndex is the class id of previous popUp
				//see if previous pop up equals current length, so we know its the top level pop up
				if (trueIndex == (pops.length)) {

					//append this div at the end of current pop up
					$(".multiple-" + trueIndex).after("<div class='multiple-" + newPop +
						"'></div>");

					//load contents of pop up
					$(".multiple-" + newPop).append(target);

					//use css styling to hide the previous pop up
					$(".multiple-" + trueIndex).css({
						'z-index': -99,
						'position': "absolute",
						'opacity': 0
					});

				}

			});

			//overide mfp-close button, so it does not close the pop up window, and instead removing the pop up divs.
			$('button.mfp-close').unbind('click');
			$('button.mfp-close').click(function(event) {

				//update current Pop up list on click
				var curPops = $('*[class*="multiple-"]')
					.filter(function() {
						return this.className.match(/(?:^|\s)multiple-/);
					});

				//only prevent the default mfp-close when there are multiple pop ups, else close as usual
				if (curPops.length != 0) {
					event.preventDefault();
					event.stopPropagation();
				}

				//function for multi pop ups
				closeForMultiModal(curPops);

			});

		});

		//END OF MULTIPLE POP UP
	} else {
		$.magnificPopup.open({
			items: {
				src: target,
				type: 'inline'
			},
			closeOnContentClick: false,
			closeOnBgClick: false,
			showCloseBtn: true,
			closeBtnInside: false,
			callbacks: {
				beforeOpen: function() {
					$('body').addClass('has-modal-opening');
				},
				open: function() {
					$('body').removeClass('has-modal-opening');
					$('body').addClass('has-modal-open');

					// move button back inside (closeBtnInside remains false to prevent duplicates)
					$('.mfp-close').appendTo('.mfp-content');

					$(document).triggerHandler('modal-open');
					$(document).triggerHandler('modal-ready');

					//$("select.js-select2").select2({ width:'100%' , dropdownAutoWidth:true , minimumResultsForSearch:10 });
				},
				beforeClose: function() {
					$('body').addClass('has-modal-closing');
				},
				close: function() {
					$('body').removeClass('has-modal-open');
					$('body').removeClass('has-modal-closing');
					$('body').removeClass('has-confirm-it');
				}
			}
		});
	}

	$(document).trigger('modal-opened');
}

/**
 * Open a new remote modal window Ajax style.
 * @param url The URL ajax destination
 * @return
 */
function openRemoteModal(url, displayType, extraOptions, multiple, style, tracking) {

	if (typeof displayType === 'undefined') displayType = 'ajax';
	if (typeof extraOptions === 'undefined') extraOptions = {};
	//passing through 'multiple' true or false in openRemoteModal so it behaves where you want.
	if (typeof multiple === 'undefined') multiple = 'false';
	if (typeof style === 'undefined') style = '';

	//build options
	var options = {
		items: {
			src: url,
			type: displayType
		},
		tLoading: '<div class="spinner"></div>',
		removalDelay: 250,
		callbacks: {
			ajaxContentAdded: function() {
				$(document).triggerHandler('remote-modal-ready');
				$(document).triggerHandler('modal-ready');

				/*if ($('.mfp-content .icheckbox').length == 0) {
					$('.mfp-content').find(':checkbox,:radio').icheck();
				}*/
				if ($.fn.icheck) {
					$(
						'.mfp-content input:checkbox:not(.icheck-input),.mfp-content input:radio:not(.icheck-input)'
					).icheck();
				}
				//$("select.js-select2").select2({ width:'100%' , dropdownAutoWidth:true , minimumResultsForSearch:10 });
				// track matomo page view
				/*_paq.push(['setCustomUrl', url]);
				var _matomoTitle = this.content.find('h1:eq(0)').text().trim();
				//check if matomo tracking variables exist
				if (typeof tracking === 'undefined'){
					//set dimension12 (area) to modal so we know
					var tObj = {dimension12:"modal"};
				}else{
					var tObj = tracking;
					if(typeof tracking === 'string'){
						tObj = JSON.parse(tracking);
					}
					tObj.dimension12 = "modal";
				}
				//console.log(tObj);
				_paq.push(['trackPageView', _matomoTitle,tObj]);
				*/

			},
			beforeOpen: function() {
				$('body').addClass('has-modal-opening');
			},
			open: function() {
				$('body').removeClass('has-modal-opening');
				$('body').addClass('has-modal-open');

				// checks its style
				if (style == 'fullwidth') {
					//console.log('CHECKING');
					//console.log('fullwidth');
					$('.mfp-content').addClass('mfp-content--style-fullwidth');
				}

				// move button back inside (closeBtnInside remains false to prevent duplicates)
				$('.mfp-close').appendTo('.mfp-content');

				$(document).triggerHandler('modal-open');
			},
			beforeClose: function() {
				$('body').addClass('has-modal-closing');
			},
			close: function() {
				$('body').removeClass('has-modal-open');
				$('body').removeClass('has-modal-closing');
				$(document).trigger('modal-closed');
				_paq.push(['setCustomUrl', window.location.href]);
			}
		},
		closeOnContentClick: false,
		closeOnBgClick: false,
		showCloseBtn: true,
		closeBtnInside: false
	};

	$.extend(options, extraOptions);

	//if there are multiple pop ups, dont run usual magnificPopup open, as this does not allow multiple
	//as it closes the previous pop up. Instead, we are gonna hide the pop up so it can still be accessed.
	if ($.magnificPopup.instance.isOpen && multiple == true) {

		//Add a identifying class to the wrapped modal content div, so we know how many pop ups are active
		$(".mfp-content div").first().addClass("multiple-1", function() {

			//get current pop ups
			var pops = $('*[class*="multiple-"]')
				.filter(function() {
					return this.className.match(/(?:^|\s)multiple-/);
				});

			//loop through all the pop ups
			pops.each(function(i, v) {
				//add 1 to index, because it starts at 0
				var trueIndex = i + 1;
				//the class id number for the new pop up
				var newPop = trueIndex + 1;

				//only add a new pop up after the latest, where true index is the id for the previous pop up
				if (trueIndex == (pops.length)) {

					//append this div at the end of current pop up
					$(".multiple-" + trueIndex).after("<div class='multiple-" + newPop +
						"'></div>");

					//load contents of pop up
					$(".multiple-" + newPop).load(url, function() {

						/*Using css to hide the main content underneath new content, as when using display:none from 'is-hidden'
						 * doesn't seem to work for firefox, as it cannot get the hidden cke instance. (works on chrome)
						 */
						//$(".multiple-1").addClass("is-hidden");
						$(".multiple-" + trueIndex).css({
							'z-index': -99,
							'position': "fixed",
							'opacity': 0
						});

					});

				}

			});

			//overide mfp-close button, so it does not close the pop up window, and instead removing the pop up divs.
			$('button.mfp-close').unbind('click');
			$('button.mfp-close').click(function(event) {

				//update current Pop up list on click
				var curPops = $('*[class*="multiple-"]')
					.filter(function() {
						return this.className.match(/(?:^|\s)multiple-/);
					});

				//only prevent the default mfp-close when there are multiple pop ups, else close as usual
				if (curPops.length != 0) {
					event.preventDefault();
					event.stopPropagation();
				}

				//function for multi pop ups
				closeForMultiModal(curPops);

			});

		});

	} else {
		$.magnificPopup.open(options);

		$('.mfp-content').attr('data-modalurl', url);
	}

	$(document).triggerHandler('modal-opened');

}

/**
 * Close an existing modal window.
 * @return
 */
function closeModal() {
	$(document).trigger('modal-closed');
	$.magnificPopup.close();
}

/**
 * Close all Multi windows, and return to the original
 * @return
 */
function closeForMultiModal(curPops, closeAllMulti) {

	if (typeof closeAllMulti === 'undefined') multiple = 'false';

	//curPops args of multi pop up objects
	//update current amount of popups
	if (typeof curPops === 'undefined') {
		curPops = $('*[class*="multiple-"]')
			.filter(function() {
				return this.className.match(/(?:^|\s)multiple-/);
			});
	}

	var aCurPop = curPops.length;

	//if closeAllMulti is true, remove all modal windoes except original
	if (closeAllMulti) {
		curPops.each(function(i, v) {
			//add 1 to index, because it starts at 0
			var trueIndex = i + 1;

			if (trueIndex == 1) {
				//remove all styling and class from initial first div/pop up to return in to normal
				$(".multiple-" + trueIndex).removeAttr("style");
				$(".multiple-" + trueIndex).removeClass("multiple-1");
			} else {
				//remove the rest of the pop ups
				$("div").remove(".multiple-" + trueIndex);
			}
		});

	} else {
		//get pop up number behind the current
		var prevPop = aCurPop - 1;

		//remove the current pop up
		$("div").remove(".multiple-" + aCurPop);

		//remove the styling that hides the previous pop up layer
		$(".multiple-" + prevPop).removeAttr("style");

		//if it is the final pop up, remove the multiple pop up class indentifier to return it to normal
		if (aCurPop == 2 && prevPop == 1) {
			$(".multiple-" + prevPop).removeClass("multiple-1");
		}
	}
}

/**
 * A-la-Carte closing of remote modal windows
 * @return
 */
function closeRemoteModal(closeAllMulti) {
	if (typeof closeAllMulti === 'undefined') multiple = 'false';

	//check/get any multiple pop ups
	var curPops = $('*[class*="multiple-"]')
		.filter(function() {
			return this.className.match(/(?:^|\s)multiple-/);
		});

	var curPopID = curPops.length;
	/*check if current created div for multiple pop up exists. If multiple pop ups exist, use
	method to hide the divs/pop ups, else use normal magnificPopup.close()*/
	if ($('div.multiple-' + curPopID).length) {

		closeForMultiModal(curPops, closeAllMulti);

	} else {
		$(document).trigger('modal-closed');
		$.magnificPopup.close();
	}
}

function openModalElement(url, element) {
	$.ajax({
		type: "GET",
		url: url,
		success: function(result) {
			$html = $('<div>').html(result);
			if (typeof element != 'undefined') {
				$html = $html.find(element);
			}
			openModal($html);
		},
		error: function(result) {}
	});
}

$(document).ready(function() {
	$('.js-ajax-popup-link').magnificPopup({
		type: 'ajax',
		midClick: true,
		closeOnContentClick: false,
		closeOnBgClick: false,
		showCloseBtn: true,
		closeBtnInside: false
	});

	$('.js-iframe-popup-link').magnificPopup({
		type: 'iframe',
		midClick: true,
		closeOnContentClick: false,
		closeOnBgClick: false,
		showCloseBtn: true,
		closeBtnInside: false
	});

	$('[data-toggle="modal"]').magnificPopup({
		type: 'inline',
		midClick: true,
		closeOnContentClick: false,
		closeOnBgClick: false,
		showCloseBtn: true,
		closeBtnInside: false
	});

	$('[data-dismiss="modal"]').on('click', function() {
		$.magnificPopup.close();
	});



});
