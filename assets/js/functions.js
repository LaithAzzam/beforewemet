// Browser detection for when you get desparate. A measure of last resort.
// http://rog.ie/post/9089341529/html5boilerplatejs
// sample CSS: html[data-useragent*='Chrome/13.0'] { ... }
//
// var b = document.documentElement;
// b.setAttribute('data-useragent',  navigator.userAgent);
// b.setAttribute('data-platform', navigator.platform);


// remap jQuery to $
(function($){


	site = {

		myScroll:'',
		emails: $('.wrapper>div'),
		paddingTop: window.innerHeight,
		pixels:'',

		init: function(){
			site.spreadsheet();
			site.miscFunctions();
		},
		probe: function(){
			$('#logo').attr('src','assets/img/logo.svg');
			$('#header h1').animate({opacity:'1'});
			site.resize();
			var position;

			function loaded () {
				site.pixels = parseInt($('.wrapper').height())-site.paddingTop;
				$('#slider').attr('max',site.pixels);

				$('#slider').bind('mousemove change',function(){
					// value =	$('#slider').val();
					// scrollPercent = (value/site.pixels);
					// scrollPoint = scrollPercent*($('.wrapper').height()-site.paddingTop);
					// $(window).scrollTop(0, -scrollPoint);
					// updatePosition();
					// console.log('slider:' +$(window).scrollTop());
				})
				document.addEventListener("touchmove", ScrollStart, false);
				document.addEventListener("scroll", Scroll, false);

				function ScrollStart() {
					updatePosition(),
					scrollValue = $(window).scrollTop();
					$( "#slider" ).val(scrollValue);
				}

				function Scroll() {
					updatePosition(),
					scrollValue = $(window).scrollTop();
					$( "#slider" ).val(scrollValue);
				}
			}
			loaded();

			function updatePosition () {
				scrollDistance = site.paddingTop/1.5;
				logoPosition = 50-(($(window).scrollTop()/scrollDistance)*50);
				logoScale = 1-($(window).scrollTop()/scrollDistance);
				logoOpacity = 1-($(window).scrollTop()/scrollDistance);

				logo = $('#header>a');
				scrollPercent = ($(window).scrollTop()/site.pixels)*100;
				$('.leftFill').css('width',scrollPercent+"%");

				if($(window).scrollTop() <= window.innerHeight){
					if(logoScale <= 1 && logoScale >= .3){
						logo.css({
							'-webkit-transform' : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-moz-transform'    : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-ms-transform'     : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-o-transform'      : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'transform'         : 'translate(-50%,-50%) scale(' + logoScale + ')'
						});
					}
					if(logoPosition >= 5 && logoPosition <= 50 ){
						logo.css({
							'top' 				: logoPosition+'%',
						});
					}
					logo.children('h1').css('opacity',logoOpacity);
					$('#timeline').css({
						opacity: 0,
						pointerEvents: 'none',
					});
					
				}else {
					logo.css({
						'top' 				: '5%',
					});
					logo.css({
						'-webkit-transform' : 'translate(-50%,-50%) scale(.3)',
						'-moz-transform'    : 'translate(-50%,-50%) scale(.3)',
						'-ms-transform'     : 'translate(-50%,-50%) scale(.3)',
						'-o-transform'      : 'translate(-50%,-50%) scale(.3)',
						'transform'         : 'translate(-50%,-50%) scale(.3)'
					});
					logo.children('h1').css('opacity','0');
					$('#timeline').css({
						opacity: 1,
						pointerEvents: 'inherit',
					});

				}
				// if(logoPosition>=5 && logoPosition <=50){
				// 	
				// }else{
					
				// }
			}
		},
		resize: function(){
			$('.wrapper>div:eq(0)').css('padding-top',site.paddingTop+15);
			paddingBottom = ( site.paddingTop-$('.wrapper>div').last().height() )/2;
			if(paddingBottom <= 50){
				paddingBottom = 100
			}
			$('.wrapper>div').last().css('padding-bottom', paddingBottom);

			site.pixels = parseInt($('.wrapper').height())-site.paddingTop;
			$('#slider').attr('max',site.pixels);
		},
		spreadsheet: function(){

			  var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1ullH-GuUMvywG410oyDghFYKcVtMrcALGngWaW7b57g/pubhtml';

			  function init() {
			    Tabletop.init( { key: public_spreadsheet_url,
			                     callback: showInfo,
			                     debug: true,
			                     simpleSheet: true } )
			  }

			  $.getJSON("assets/js/messages.json", function(json) {
				    // console.log(json); // this will show the info it in firebug console
			    	site.buildFeed(json);
					site.probe();
					
				});

			  function showInfo(data, tabletop) {
			  }
			  init();
		},
		buildFeed: function(data){
			wrapper = document.getElementsByClassName('wrapper')[0];
			
			function userTime(){
				year = 2010;
				month = 5;
				day = 19;
				hours = 24;
				minutes = 0;
				var currentDate = new Date(year, month, day, hours, minutes);
				current_miliseconds = currentDate.getTime();
			}
			userTime();

			$.each(data, function( index, value ) {
				index = JSON.stringify(index);
				content = JSON.stringify(value);

				item_date_parts = value.DATE.split("/"), parts = [];
				item_time_parts = value.TIME.split(":"), parts = [];

				year = item_date_parts[2];
				month = item_date_parts[0]-1;
				day = item_date_parts[1];
				hours = item_time_parts[0];
				minutes = item_time_parts[1];
				var item_date = new Date(year, month, day, hours, minutes);

				item_miliseconds = item_date.getTime();

				function author(){
					// set author per item
					if(value.AUTHOR.substring(0,3) == 'tal'){
						author = value.AUTHOR.substring(0,3);
						side = 'right';
					}else if(value.AUTHOR.substring(0,4) == 'josh'){
						author = value.AUTHOR.substring(0,4);
						side = 'left'
					}else{
						author = 'none';
						side = 'middle someone'
					}
				};
				function subject(){
					// use subject to determine if message is ghat or email
					if(value.SUBJECT == "gchat"){
						// if gchat, set subject to nothing to know it's gchat
						subject = ''
					}else{
						subject = 'Subject: '+value.SUBJECT+'';
					}
				};
				function copy(){
					copyRaw = JSON.stringify(value.COPY);
					copy = copyRaw.replace(/[\\]n/g, '<br/>').replace(/\"/g, "");
				};
				function attachments(){
					if(value.ATTACHMENTS == ''){
						item_attachments = false;
					}else{
						item_attachments_raw = JSON.stringify(value.ATTACHMENTS).split(/[\\]n/g), parts = [];

						function makeUL(array) {
							console.log('makingLIst');
						    // Create the list element:
						    var list = document.createElement('ul');

						    for(var i = 0; i < array.length; i++) {
						        // Create the list item:
						        var link = document.createElement('a');
						        link.href = 'assets/attachments/'+array[i].replace(/\"/g, "");
						        link.target = '_blank';
						        var item = document.createElement('li');

						        // Set its contents:
						        item.appendChild(link).appendChild(document.createTextNode(array[i].replace(/\"/g, "")));

						        // Add it to the list:
						        list.appendChild(item);
						    }

						    console.log(list);
						    // Finally, return the constructed list:
						    return list;
						}
						item_attachments = makeUL(item_attachments_raw);
					}
				}
				function buildMessage(){
					// build message content
					author();
					subject();
					copy();
					attachments();
				}

				if(current_miliseconds >= item_miliseconds ){
					buildMessage();
					last = $('.wrapper>div').last();
					if(last.attr('class')==side){
						$('.wrapper>div').last().append('<p>'+value.COPY+'</p>');
					}else if(author != 'none'){
						$('.wrapper').append('<div class="'+side+'"><h2>'+subject+'</h2><p>'+copy+'</p></div>');
					}
					if(item_attachments && value.SUBJECT != "gchat" && author != 'none'){
						item = wrapper.lastChild.getElementsByTagName("p")[0];
						item.appendChild(item_attachments);
					}
				}
			});
		},
		miscFunctions: function(){
			$(document).keydown(function(e){
			    if (e.keyCode == 40) { 
			    	newVal = parseInt($('#slider').val())+1;
			       $('#slider').val(newVal);
			       return false;
			    }
			});
		},
	};

	$(document).ready(function (){
		site.init();
	});
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
		site.resize();
	});

})(window.jQuery);