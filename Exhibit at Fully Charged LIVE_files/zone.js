js_zone_fn = function() {
	this.inited = false;
	this.contentissaving = false;
	this.requiredTasks = 0;
	this.modalState = '';

	this.dashboard_init = function() {
		this.destroyckeditors();
		openRemoteModal('__zone/renderModule?zonemodule=dashboard&uuid='+Math.random());
	}
	this.lostpassword = function() {
		openRemoteModal('__zone/renderModule?zonemodule=lostpassword');
	}

	this.savecontentform = function( $form, useLoader, callback ) {
		$this = this;
		if (typeof useLoader === 'undefined') useLoader = true;
		if (useLoader)
			js_zone.toggleLoader(true);
		js_zone.contentissaving = true;

		$.magnificPopup.instance.wrap.animate({ scrollTop: 0 }, "slow");

		// copy ckEditor back into textarea field ready for submit
		for (var instance in CKEDITOR.instances) {
			var ckeditObj = $form.find('#'+instance);
			ckeditObj.val(CKEDITOR.instances[instance].getData());
		}
		var $formData = $form.serialize();

		$form.find('.w-zone-contentform__status').hide();

		$.ajax({
			type: "post" ,
			url: $form.attr('action') ,
			data: $formData ,
			success: function (json) {
				js_zone.contentissaving = false;
				if (useLoader)
					js_zone.toggleLoader(false);
				if (json.STATUS === 'error') {
					if (typeof(json.ERRORS.FIELDS) !== 'undefined') {
						for(var fieldname in json.ERRORS.FIELDS){
							var errorText = json.ERRORS.FIELDS[fieldname]['desc'];
							//for(var errorType in json.ERRORS.FIELDS[fieldname]){
				           	//	errorText += errorType+' '+json.ERRORS.FIELDS[fieldname][errorType];
				        	//}
							js_zone.applyFieldError(fieldname, errorText);
				        }
					}
					if (typeof(json.ERRORS.FIELDS.ERRORMESSAGE) !== 'undefined') {
						$form.find('.w-zone-contentform__status').html('<div class="notification notification--danger">'+json.ERRORS.FIELDS.ERRORMESSAGE+'</div>').show();
					}
				}
				else if (js_zone.requiredTasks !== 0) {
					// destroy ckEditors ready for new page
					$this.destroyckeditors();
					js_zone.dashboard_init();
					/*$.ajax({url:'/__zone/renderModule?zonemodule=dashboard',
						success: function(html){
							$('.w-zone-dashboard').html($(html).find('.w-zone-dashboard'));
						}
					});*/
				}
				else if (json.STATUS === 'success'){
					$form.find('.w-zone-contentform__status').html('Entry updated').show();

					js_zone.refreshChecklist();

					if (typeof callback === 'function') {
						callback(json);
					}

					//piwik tracking
					if( typeof _paq !== "undefined"){
						if("LIBRARYTYPE" in json && json.LIBRARYTYPE !== ''){
							_paq.push(['trackEvent','Ezone',json.P_EVENTACTION,json.P_EVENTNAME,null,{dimension7:json.CONTENTID,dimension13:json.CONTENTTYPE,dimension14:json.LIBRARYTYPE,dimension15:json.SLUG}]);
						}else{
							_paq.push(['trackEvent','Ezone',json.P_EVENTACTION,json.P_EVENTNAME,null,{dimension7:json.CONTENTID,dimension13:json.CONTENTTYPE,dimension15:json.SLUG}]);
						}
					}
				}
				else {
					$form.find('.w-zone-contentform__status').html('<div class="notification notification--danger">There was an error saving your entry</div>').show();
				}
			}
		});
	}

	this.refreshChecklist = function() {
		$.ajax({url:'__zone/renderModule?zonemodule=checklist',
			cache: false,
			success: function(html){
				$('.w-zone-dashboard__overview__checklist').html(html);
				$(document).trigger('ajaxupdate');
			}
		});
	}

	this.applyFieldError = function(fieldname, errorText) {
		// don't apply error to hidden fields (ie ckeditor textareas)
	    if ($('.w-zone-dashboard__main :input[name="'+fieldname+'"]:first').is(':visible')) {
			if ($('.w-zone-dashboard__main :input#'+fieldname).length === 0) {
				$('.w-zone-dashboard__main :input[name="'+fieldname+'"]:first').attr('id', fieldname);
			}
	    	field = document.getElementById( fieldname );
	        field.setCustomValidity('error - '+errorText);
			field.className = 'customerror';
		}
		else {
			field = $('.w-zone-dashboard__main :input[name="'+fieldname+'"]:first');
		}
		if ($(field).siblings('label.error').length != 0) {
			$(field).siblings('label.error').remove();
		}
		$(field).before('<label class="error">'+errorText+'</label>');
		$('.w-zone-dashboard__main :input[name="'+fieldname+'"]').off('focus').on('focus', function(){
			field = document.getElementById( fieldname );
			field.className = '';
			field.setCustomValidity('');
			$(field).siblings('label.error').fadeOut('fast',function(){$(this).remove();});
		});
	}

	this.deletecontent = function(contentid, libraryid) {
		if (confirm('Are you sure you want to delete this entry?')) {
			$.ajax({url: '__zone/deleteLibraryEntry?editcontentid='+contentid ,
				cache: false,
				success: function (json) {
					js_zone.loadmodule('library_'+libraryid);

					if( typeof _paq !== "undefined"){
						if(json.status = 'success'){

							if("LIBRARYTYPE" in json && json.LIBRARYTYPE !== ''){
								_paq.push(['trackEvent','Ezone',json.P_EVENTACTION,json.P_EVENTNAME,null,{dimension7:json.CONTENTID,dimension13:json.CONTENTTYPE,dimension14:json.LIBRARYTYPE,dimension15:json.SLUG}]);
							}else{
								_paq.push(['trackEvent','Ezone',json.P_EVENTACTION,json.P_EVENTNAME,null,{dimension7:json.CONTENTID,dimension13:json.CONTENTTYPE,dimension15:json.SLUG}]);
							}
						}
					}
				}
			});
		}
	}

	this.loadmodule = function(module, data) {
		this.destroyckeditors();

		if ($('.w-zone-dashboard__main').length) {
			$.magnificPopup.instance.wrap.animate({ scrollTop: 0 }, "slow");

			$('.w-zone-dashboard__main').html('Loading...');

			$.ajax({url:'__zone/renderModule?zonemodule='+module,
				data: data,
				cache: false,
				success: function(html){
					$('.w-zone-dashboard__main').html(html).trigger('ajaxupdate');
					// trigger ajaxloaded, which init's the form js
					$(document).trigger('ajaxloaded');
				}
			});
		}
		else if (!$('body').hasClass('has-modal-open')) {
			this._openmodule = module;
			if (this.modalState == '') {
				$(document).on('modal-ready', function(){
					if (js_zone.modalState == 'initing') {
						js_zone.modalState = 'ready';
						if (typeof js_zone.requiredTasks == 'undefined' || js_zone.requiredTasks == 0) {
							js_zone.loadmodule(js_zone._openmodule, data);
							js_zone.login_init();
						}
					}
				});
			}
			this.modalState = 'initing';
			this.dashboard_init();
		}
	}

	this.destroyckeditors = function() {
		if (typeof CKEDITOR !== 'undefined') {
			// destroy ckEditors ready for new page
			for (var instance in CKEDITOR.instances) {
				if ($('#'+instance).length) {
					CKEDITOR.instances[instance].destroy(true);
				}
				else {
					CKEDITOR.remove(instance);
					delete CKEDITOR.instances[instance];
				}
			}
		}
	}

	this.toggleLoader = function(state){
		$('.w-zone-dashboard__loader').fadeToggle();
	}

	this.loginMessage = function($form, message) {
		$form.closest('.js-zone-login').find('.js-zone-login__no-access').html(message);
	}

	this.initMenu = function() {
		$(document).on('click', '.w-zone-dashboard__overview__checklist .menu__item__toggle', function(){
			$(this).parent('.menu__item').toggleClass('is-expanded');
			$(this).next('ul').slideToggle();
		})
	}

	this.init = function() {
		if (!js_zone.inited) {
			js_zone.inited=true;
    		$.ajax({url:'__zone/renderModule?zonemodule=login',
				cache: false,
				success: function(html){
					//$('.w-zone-loginwrapper').html(html);
					$('.w-zone-loginwrapper').each(function(){
						if ($(html).find('form.zoneloginform').length === 0) {
							$(this).html(html);
						}
					});
					js_zone.login_init();
				}
			})
		}
	}

	this.login_init = function() {
		/*$('.w-zone-loginwrapper').each(function(){
			if (!$(this).data('lostpassword')) {
				$(this).find('.w-zone-login__lostpassword').remove();
			}
		});*/

		$('.js-zonelogout').off('click').on('click', function(e){
			e.preventDefault();
			$.ajax({
				type: "post" ,
				url: '__zone/logout',
				success: function (json) {
					$.ajax({url:'__zone/renderModule?zonemodule=login',
						cache: false,
						success: function(html){
							$('.js-zone-login-dashboard').replaceWith(html);
							js_zone.login_init();

							if( typeof _paq !== "undefined"){
								//track log out event for the user
								_paq.push(['trackEvent','Ezone','Logout']);
								//force new piwik visit and delete tracking cookies, so that userid is no longer active for the coming visit
								//_paq.push(['appendToTrackingUrl', 'new_visit=1']); // (1) forces a new visit
								//_paq.push(['deleteCookies']); // (2) deletes existing tracking cookies to start the new visit
								// the two lines must be above the call to track* function
								//_paq.push(['trackPageView']);
							}

						}
					});
				}
			});
		});

		$(document).off('submit', '.zoneloginform').on('submit', '.zoneloginform', function(e){
			e.preventDefault();
			var $zoneloginform=$(this);
			$zoneloginform.find('#loginSubmitButton').addClass('is-loading');
			$.ajax({
				type: "post" ,
				url: $zoneloginform.attr('action') ,
				data: $zoneloginform.serialize() ,
				success: function (json) {
					$zoneloginform.find('#loginSubmitButton').removeClass('is-loading');
					if (json.STATUS === 'success') {
						$.ajax({url:'__zone/renderModule?zonemodule=login',
							cache: false,
							success: function(html){
								$('.js-zone-login').replaceWith(html);
								js_zone.login_init();

								//piwik log log in
								if( typeof _paq !== "undefined"){
									//get js cookie function
									function getCookie(cname) {
											    var name = cname + "=";
											    var decodedCookie = decodeURIComponent(document.cookie);
											    var ca = decodedCookie.split(';');
											    for(var i = 0; i <ca.length; i++) {
											        var c = ca[i];
											        while (c.charAt(0) == ' ') {
											            c = c.substring(1);
											        }
											        if (c.indexOf(name) == 0) {
											            return c.substring(name.length, c.length).replace(/['"]+/g, '');
											        }
											    }
											    return "";
									}
									//get the personUUID from cookie
									var personUuidCookie = getCookie("VISITORUUID");
									//set the user id to personUUID and track log in event.
									_paq.push(['setUserId' ,personUuidCookie]);
									//_paq.push(['setCustomDimension','3',personUuidCookie]);
									_paq.push(['trackEvent','Ezone','Login']);
								}
							}
						});
						js_zone.dashboard_init();
					}
					else if (json.STATUS === 'redirect') {
						window.location = json.redirecturl;
					}
					else if (json.STATUS === 'ratelimit') {
						// rate limited
						js_zone.loginMessage($zoneloginform, '<p style="color:red;">Your account has been locked due to too many failed password attempts. Please try again in 15 minutes</p>');
					}
					else {
						// error logging in
						js_zone.loginMessage($zoneloginform, '<p style="color:red;">Login failed, incorrect username or password</p>');
					}
				}
			});
		});
	}

}
js_zone = new js_zone_fn();

//js_zone.login_init();
if (window.location.href.indexOf('?enterzone') !== -1) {
	js_zone.dashboard_init();
}
$(function() {
	js_zone.initMenu();
});
