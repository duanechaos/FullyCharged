
// TODO: Wrap this in a container so not polluting global scope.
var PageSelector       = '.js-form-page';
var ButtonSelector     = '.js-controls :button,.js-controls :submit';
var ValidationSelector = '.js-validation-container';
var UserFieldsSelector = 'input:not([type=hidden]),select,textarea,input.mediafield__upload__value';
var FieldOuterSelector = '.form__group';//'.js-field-group';

$(function() {
	js_init_formpages();
});
// trigger if form within a modal
$(document).on('modal-ready', js_init_formpages);
// trigger if form loaded via ajax
$(document).on('ajaxloaded', js_init_formpages);

window.onbeforeunload = function() {
	if ( $('form #_incompletewarning').length && $('form.js-unsaved').length > 0 ) {
		return "Are you sure you want to navigate away?";
	}
}

function js_init_formpages() {
	var $forms = $('form.js-formbuilder-form').not('.js-forminit');
	if ($forms.length === 0) {
		return;
	}
	$forms.addClass('js-forminit');
	$forms
		.on( 'click'  , '.js-back-btn'     , goBack          )
		.on( 'click'  , '.js-next-btn'     , goForward       )
		.on( 'click'  , '.js-submit-btn'   , goForward       )
		.on( 'change' , UserFieldsSelector , checkPageRoutes )
		.on( 'formpageloaded' , formpageloaded )
		.on( 'submit' , goSubmit       )
		;

	// Check question routing within all pages...
	$forms.find(PageSelector).each(checkPageRoutes);
	$forms.trigger('formpageloaded');

	$forms.on('change keyup blur validate', 'input[customtype="number"]', function() {
		if ( !$.isNumeric( $(this).val() ) && $(this).val() != '' ) {
			var errorMessage = 'Please enter a valid number';
			if (typeof formtranslations.cb_form_error_nan != 'undefined') {
				errorMessage = formtranslations.cb_form_error_nan;
			}
			if ( $(this).parent().children('.customerror').length == 0 ) {
				$(this).addClass('error')
				$(this).after('<label id="NumberField-error" class="error customerror" for="NumberField" style="display: block;">' + errorMessage + '</label>');
			} else {
				// Bit of a quick fix for error message
				$(this).parent().children('.customerror').text(errorMessage);
				$(this).parent().children('.customerror').css({ "display": "block" });
			}
		} else {
			$(this).removeClass('error')
			$(this).parent().children('.customerror').remove();
		}
		$(this).closest('form').addClass('js-unsaved');
	});

	$forms.on('change keyup blur validate', 'input[type="text"],input[type="hidden"],textarea', function(e) {
		// get the word limit
		var wordLimit = $(this).attr('wordlimit');
		// get the characters
		var char = $(this).val();
		// count the word length
		var wordLength = countWords(char);
		if (wordLength > wordLimit) {
			var errorMessage = 'Maximum word limit exceeded ' + '('+wordLimit+')';
			if (typeof formtranslations.cb_form_error_wordlimit != 'undefined') {
				errorMessage = formtranslations.cb_form_error_wordlimit.replace('{-{wordlimit}}', wordLimit);
			}

			if ( $(this).parent().children('.customerror').length == 0 ) {
				$(this).addClass('error')
				$(this).after('<label id="TextField-error" class="error customerror" for="tex" style="display: block;">' + errorMessage + '</label>');

				//piwik track form error for this specific error
				if( typeof _paq !== "undefined"){
					//get form
					var CurForm = $(this).closest('form');
					// form - error - question
					piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Error',this.name);
				}
			}
			else {
				// Bit of a quick fix for error message
				$(this).parent().children('.customerror').text(errorMessage);
				$(this).parent().children('.customerror').css({ "display": "block" });
			}
		}
		else {
			$(this).removeClass('error')
			$(this).parent().children('.customerror').remove();
		}
		$(this).closest('form').addClass('js-unsaved');

		// if pressing enter on a textfield, submit the form
		if (e.currentTarget.type == 'text' && e.type == 'keyup' && e.keyCode == 13) {
			$(this).closest('form').find('.js-submit-btn,.js-next-btn').last().trigger('click');
		}
	});

	$forms.on('change validate', 'input[type="checkbox"],input[type="radio"]', function() {
		var $wrapper = $(this).closest('.option_column__wrapper');
		var minoptions = $wrapper.attr('minlength');
		var maxoptions = $wrapper.attr('maxlength');
		var numSelected = $wrapper.find('input[type=checkbox]:checked,input[type=radio]:checked').length;

		if (numSelected > maxoptions) {
			var errorMessage = 'You have selected too many options ' + '(maximum '+maxoptions+')';
			if (typeof formtranslations.cb_form_error_maxoptions != 'undefined') {
				errorMessage = formtranslations.cb_form_error_maxoptions.replace('{-{maxoptions}}', maxoptions);
			}
			form_applycustomerror($wrapper, errorMessage);
		}
		else if (numSelected < minoptions) {
			var errorMessage = 'You have not selected enough options ' + '(minimum '+minoptions+')';
			if (typeof formtranslations.cb_form_error_minoptions != 'undefined') {
				errorMessage = formtranslations.cb_form_error_minoptions.replace('{-{minoptions}}', minoptions);
			}
			form_applycustomerror($wrapper, errorMessage);
		}
		else {
			$wrapper.removeClass('error')
			$wrapper.parent().children('.customerror').remove();
		}
		$(this).closest('form').addClass('js-unsaved');
	});

	$forms.on('click', '.form__group--captcha .resetcaptcha', function() {
		var CurPage = $(this).closest(PageSelector);
		resetCaptcha( CurPage );
	});



	// For use to help with word limiting
	function countWords(char){
	    char = char.replace(/(^\s*)|(\s*$)/gi,"");//exclude  start and end white-space
	    char = char.replace(/[ ]{2,}/gi," ");//2 or more space to 1
	    char = char.replace(/\n /,"\n"); // exclude newline with a start spacing
	    return char.split(' ').length;
	}
	// *****causes infinite auto-refreshing in safari*****
	//window.addEventListener("popstate",function(event){ location.href = location.href });

	// if submitting to new page, this div will contain the form response
	if ($('form #js-formresponserender').length) {
		var CurForm = $('form #js-formresponserender').closest('form');
		CurForm.find('.js-form-page .js-next-btn,.js-form-page .js-submit-btn').trigger('click');
	}
}


function form_applycustomerror(obj, errorMessage) {
	if (obj.closest('.form__group').parent().hasClass('form_page')) {
		var $customerror = obj.closest('.form__group').find('.customerror');
		if ( $customerror.length == 0 ) {
			obj.addClass('error')
			obj.after('<label id="FormField-error" class="error customerror" style="display: inline-block; margin-right: 10px;">' + errorMessage + '</label>');
		} else {
			// Bit of a quick fix for error message
			$customerror.text(errorMessage);
			$customerror.css({ "display": "inline-block" });
		}
	}
}
function goBack(e) {
	var CurPage = $(this).closest(PageSelector);
	var PrevPage = CurPage.prev(PageSelector);

	if (PrevPage.length > 0)
	{
		PrevPage.show();
		CurPage.hide().remove();

		PrevPage.find(ButtonSelector).removeAttr('disabled');
		PrevPage.find(ButtonSelector).removeClass('is-loading');

		var CurForm = PrevPage.closest('form');

		CurForm.find(':hidden[name=_pageid]').val(PrevPage.attr('data-pageid'));
		CurForm.find(':hidden[name=_pageorder]').val(PrevPage.attr('data-pageorder'));
		CurForm.find(':hidden[name=_pageslug]').val(PrevPage.attr('data-slug'));

		//piwik track form for page view when going backward
		if( typeof _paq !== "undefined"){
			//form - page view - current pageSlug
			piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Page',PrevPage.attr('data-slug'));
		}
		// Progress Bar
		$('#js-form__progressbar__currentpage').text(PrevPage.attr('data-pageorder'));
		$('#js-form__progressbar__bar').css( "width", ((PrevPage.attr('data-pageorder') - 1) * 100 / $('#js-form__progressbar__totalpages').text()).toFixed() + '%' );
		$('#js-form__progressbar__percent').text( ((PrevPage.attr('data-pageorder') - 1) * 100 / $('#js-form__progressbar__totalpages').text()).toFixed() );

		// Check question routing within all pages...
		CurForm.find(PageSelector).each(checkPageRoutes);

		CurForm.trigger('formprogress');
		resetCaptcha( PrevPage );
	}
}

function goForward(e) {
	e.preventDefault();

	var CurPage = $(this).closest(PageSelector);
	var CurForm = CurPage.closest('form');
	CurForm.addClass('js-unsaved');

	if ( typeof CurForm.valid == "undefined" )
		CurForm.valid = function(){return true;}

	// if submitting to new page, this div will contain the form response
	if (CurForm.find('#js-formresponserender').length) {
		var html = CurForm.find('#js-formresponserender').html();
		CurForm.find('#js-formresponserender').remove();
		handleResponse( html );
	}
	else if ( CurForm.find('.customerror').length == 0 && CurForm.valid())
	{
		// Disable controls whilst submitting...
		//CurPage.find(ButtonSelector).addClass('is-loading');
		CurPage.find('.js-next-btn').addClass('is-loading');
		CurPage.find(ButtonSelector).attr('disabled',true);

		if (typeof(formtranslations.cb_form_submitting_label) == 'undefined' ) {
			formtranslations.cb_form_submitting_label = 'Submitting...';
		}
		// copy original button text, in case we need to revert it on error
		CurPage.find('.js-submit-btn').attr('origtext', CurPage.find('.js-submit-btn').text());
		CurPage.find('.js-submit-btn').text( formtranslations.cb_form_submitting_label ).addClass('is-loading');

		CurPage.find(ValidationSelector).hide().remove();
		if (CurForm.attr('ajaxaction') && CurForm.attr('ajaxaction') !== '') {
			if (CurForm.find('#_autosubmit').val() === 'YES') {
				CurPage.hide();
			}
			$.post
				( CurForm.attr('ajaxaction')//'/cbFormBuilder/formRender/getNextFormPage'
				, CurForm.serialize()
				, handleResponse
				);
		}
		else {
			CurForm.submit();
		}
	}

	function handleResponse( Response )
	{
		//console.log(Response);
		if ( $(Response).is(PageSelector) )
		{
			CurPage.hide().after( Response );

			CurForm.find(':hidden[name=_pageid]').val($(Response).attr('data-pageid'));
			CurForm.find(':hidden[name=_pageorder]').val($(Response).attr('data-pageorder'));
			CurForm.find(':hidden[name=_pageslug]').val($(Response).attr('data-slug'));

			// Progress Bar
			if ( $(Response).attr('data-pagetypeid') == 0) {
				$('#js-form__progressbar__currentpage').text($(Response).attr('data-pageorder'));
				$('#js-form__progressbar__bar').css( "width", (($(Response).attr('data-pageorder') - 1) * 100 / $('#js-form__progressbar__totalpages').text()).toFixed() + '%' );
				$('#js-form__progressbar__percent').text( (($(Response).attr('data-pageorder') - 1) * 100 / $('#js-form__progressbar__totalpages').text()).toFixed() );
				CurForm.trigger('formprogress');
				CurForm.trigger('formpageloaded');
				//piwik track form for page view when going forward
				if( typeof _paq !== "undefined"){
					//form - page view - current pageSlug
					piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Page',$(Response).attr('data-slug'));
				}

			} else {
				CurForm.removeClass('js-unsaved');
				/* If you want to hide on completion */
				//$('#js-form__progressbar').hide();
				$('#js-form__progressbar__page').hide();
				$('#js-form__progressbar__bar').css( "width", "100%" );
				$('#js-form__progressbar__percent').text( '100' );

				// TODO: Change ?success per completion page...
				history.pushState( "{loc:location.href}" , null , window.location.href.split('?')[0] + '?success' );
				CurForm.trigger('formsuccess');

				//piwik track form for completion and its pageSlug
				if( typeof _paq !== "undefined"){
					if(CurForm.find(':hidden[name=formSubmissionUuid]').length > 0){
						//track when form is edited - include formSubmissionUuid
						piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Edit',CurForm.find(':hidden[name=formSubmissionUuid]').val());
					}else{
						//track when form is completed
						piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Completed',$(Response).attr('data-slug'));
					}
				}

			}

			if ( typeof($(Response).attr('data-redirectUrl')) !== 'undefined') {
				CurForm.removeClass('js-unsaved');
				if ( $(Response).attr('data-redirecturl').indexOf('javascript:') == 0) {
					eval( $(Response).attr('data-redirectUrl').substr(11,99) );
				}
				else if ( typeof($(Response).attr('data-redirecturltarget')) !== 'undefined' && $(Response).attr('data-redirecturltarget') === '_blank') {
					window.open( $(Response).attr('data-redirectUrl') );
				}
				else {
					window.location = $(Response).attr('data-redirectUrl');
				}
			}
		}
		// error response
		else if ( typeof (Response.errors) !== 'undefined') {
			CurPage.show()
			if ($(Response.errors).is(ValidationSelector) )
			{
				CurPage.prepend(Response.errors);

				CurPage.find(ButtonSelector).removeAttr('disabled');
				CurPage.find(ButtonSelector).removeClass('is-loading');

				CurPage.find('.js-submit-btn').text( CurPage.find('.js-submit-btn').attr('origtext') );

			}
			$.each(Response.fieldErrors, function(fieldname,error) {
				var obj = $('input[name="'+fieldname+'"]').trigger('validate');

				// for 2-tiered
				if (obj.closest('.js-form-field__tiered').length) {
					var $wrapper = $(obj).closest('.option_column__wrapper');
					form_applycustomerror($wrapper, error);
				}
				else {
					form_applycustomerror(obj, error);
				}

				//piwik track form errors in general
				if( typeof _paq !== "undefined"){
					//form - error - question
					piwikFormTrack(CurForm.find(':hidden[name=slug]').val(),'Form','Error',fieldname);
				}

			});
			resetCaptcha( CurPage );

			CurForm.trigger('formprogresserror');
		}
		else if ( typeof($(Response).attr('data-redirectUrl')) !== 'undefined') {
			CurForm.removeClass('js-unsaved');
			window.location = $(Response).attr('data-redirectUrl');
		}
		else {
			CurPage.show()
			// TODO: Handle unexpected response...
			//console.error('Unexpected Response');
			CurPage.find(ButtonSelector).removeAttr('disabled');
			CurPage.find(ButtonSelector).removeClass('is-loading');
		}

		// Check question routing within all pages...
		CurForm.find(PageSelector).each(checkPageRoutes);

		var HeaderHeight = 120;
		if (typeof window.headerHeight != 'undefined') {
			HeaderHeight = window.headerHeight;
		}
		else if ($('header.header').length) {
			HeaderHeight += $('header.header').outerHeight();
		}
		if ($('.mfp-content').find(CurForm).length) {
			$.magnificPopup.instance.wrap.animate({ scrollTop: 0 }, "slow");
		}
		else {
			window.scrollTo( CurForm.offset().left , CurForm.offset().top - HeaderHeight );
		}
	}
}

function goSubmit(e)
{	var CurForm = $(this).closest('form');
	if (CurForm.attr('ajaxaction') && CurForm.attr('ajaxaction') !== '') {
		return false;
	}
}


function resetCaptcha( CurPage ) {
	var $container = CurPage.find('.form__group--captcha');
	if ($container.find('.g-recaptcha').length) {
		grecaptcha.reset();
	}
	else {
		$.get('__zone/generateCaptcha', function(json){
			var $captchaid =$container.find('input[name=captchaid]');
			$captchaid.val(json.captchauuid);
			$captchaid.closest('.form__group').find('img').attr('src', json.src);
			$container.find('input[type="text"]').val('');
		});
	}
}





/**
	checkPageRoutes - triggered when a field changes; shows/hides other fields on same page.
*/
function checkPageRoutes()
{

	// find relevant page and check routing on all fields within it.
	$(this)
		.closest(PageSelector)
		.find( UserFieldsSelector )
		.each( checkFieldVisibility )
		;

}

function formpageloaded() {
	var $curForm = $(this);

	if ($curForm.find('.js-date-picker').length) {
		$script('/includes/javascript/jquery.datetimepicker.js', function(){
			$curForm.find('.js-date-picker').datetimepicker({closeOnDateSelect:true, timepicker:false, format:'d M Y'});
		});
	}

	// if autosubmitting the form, find and trigger the active submit button
	if ($curForm.find('#_autosubmit').val() === 'YES') {
		var CurPage = $curForm.find('.js-form-page').filter(":visible");
		CurPage.find('.js-submit-btn,.js-next-btn').trigger('click');
	}
	//piwik track page view for inital first page load
	if( typeof _paq !== "undefined"){
		if ($curForm.find('#_pageorder').val() === '1'){
			var CurPage = $curForm.find('.js-form-page').filter(":visible");

			piwikFormTrack($curForm.find(':hidden[name=slug]').val(),'Form','Initial Page',CurPage.attr('data-slug'));

		}
	}
}

/**
	checkFieldVisibility - checks if target field should be shown or hidden
*/
function checkFieldVisibility(index,TargetField) {

	if (typeof $(TargetField).attr('name') == 'undefined') {
		return;
	}

	TargetFieldName = $(TargetField).attr('name').toLowerCase();

	// if no routes, nothing to change
	if ( typeof Routes[TargetFieldName] === 'undefined' || Routes[TargetFieldName].length === 0 ) {
		return true;
	}

	/* determine if any routes apply and if they require hiding/showing. */
	var isVisible = true;

	for ( var i = 0 ; i < Routes[TargetFieldName].length ; i++ ) {


		// If RouteAction is show, hide field until isRoutingValid is checked.
		if ( Routes[TargetFieldName][i]['RouteAction'] == 'show' )
			isVisible = false;

		if ( isRoutingValid( Routes[TargetFieldName][i]['Data'] ) ) {
			isVisible = ! isVisible;
			break;
		}
	}

	var FieldGroup = $(this).closest( FieldOuterSelector )
	// if it's a tiered option, hide it's outer <li>
	if (FieldGroup.parent().hasClass('js-form-field__tiered')) {
		FieldGroup = FieldGroup.parent();
	}

	/* hide/show field depending on outcome of above */
	if ( isVisible ) {
		// re-enable fields that were deactivated by logic below
		FieldGroup.find(UserFieldsSelector+'[data-deactivated]')
			.removeAttr('data-deactivated')
			.removeAttr('disabled')
			;

		FieldGroup.show();
	}
	else {
		FieldGroup.hide();

		// disable all enabled fields, with marker to allow correct un-disabling.
		FieldGroup.find(UserFieldsSelector).filter(':enabled')
			.attr('data-deactivated',true)
			.attr('disabled',true)
			;
	}
}

/**
	isRoutingValid - determines if the conditions described in group are a match
*/
function isRoutingValid( group )
{
	if ( typeof group === 'undefined' )
		return false;

	var isValid = false;

	if ( typeof group.children !== 'undefined' && group.children.length > 0 )
	{
		for ( var i=0 ; i < group.children.length ; i++ )
		{
			isValid = isRoutingValid( group.children[i] );

			// short circuit - break if AND+false or OR+true
			if ( group.logicAND != isValid )
				break;
		}

	}
	else if ( typeof group.options !== 'undefined' && group.options.length > 0 )
	{
		var ThisField = $('[name="'+group.fieldid+'"]');


		if ( ThisField.length == 0 )
			return false;

		var isValid = false;

		for ( var i=0 ; i < group.options.length ; i++ )
		{	// trim the checkValue
			var checkValue = String(group.options[i]).replace(/^\s+|\s+$/gm,'');
			// Check active value of checkboxes/radio and select options.
			isValid = ThisField.filter('[value="'+checkValue+'"],[value="'+checkValue+' "]').is(':selected,:checked')
				|| ThisField.filter('select').find('option[value="'+checkValue+'"],option[value="'+checkValue+' "]').is(':selected,:checked')
				;

			// short circuit - break if AND+false or OR+true
			if ( group.logicAND != isValid )
				break;
		}

	}

	return isValid;
}
/*** function to track piwik***/
function piwikFormTrack(formSlug, eventCat, evenAction, eventName){
	//set custom dimensions, dimension 11 'form slug'
	var customDimensions = {dimension11:formSlug};
	//if in ezone set dimension 12 'area' to ezone
	if($('div.w-zone-dashboard').length > 0){
		customDimensions.dimension12 = 'Ezone';
	}
	//console.log(customDimensions);
	//console.log(eventCat + ' ' + evenAction + ' ' + eventName);
	//tracker
	_paq.push(['trackEvent',eventCat,evenAction,eventName,null,customDimensions]);

}
