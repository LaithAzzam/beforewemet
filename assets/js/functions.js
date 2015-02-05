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

		paddingTop: window.innerHeight,
		emails: $('.wrapper>div>div'),

		init: function(){
			site.resize();
			site.spreadsheet();
		},
		probe: function(){
			var myScroll;
			var position;

			function updatePosition () {
				scrollDistance = site.paddingTop/2;
				logoPosition = 50+(myScroll.y/scrollDistance)*50;
				logoScale = 1.2+(myScroll.y/scrollDistance);
				logoOpacity = .8+(myScroll.y/scrollDistance);

				logo = $('#header>a');
				if(logoPosition>=5){
					logo.css({
						'top' 				: logoPosition+'%',
					});
					if(logoScale <= 1){
						logo.css({
							'-webkit-transform' : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-moz-transform'    : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-ms-transform'     : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'-o-transform'      : 'translate(-50%,-50%) scale(' + logoScale + ')',
							'transform'         : 'translate(-50%,-50%) scale(' + logoScale + ')'
						});
						logo.children('h1').css('opacity',logoOpacity);
					}

					$('#timeline').fadeOut();
				}else{
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
					logo.children('h1').css('opacity',logoOpacity);

					$('#timeline').fadeIn();
				}
			}

			function loaded () {
				myScroll = new IScroll('.wrapper', { probeType: 3, mouseWheel: true });

				myScroll.on('scroll', updatePosition);
				myScroll.on('scrollEnd', updatePosition);
			}
			loaded();

			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		resize: function(){
			site.paddingTop = window.innerHeight;
			$('.wrapper>div>div:eq(0)').css('padding-top',site.paddingTop);
			$('.wrapper>div>div:eq('+(parseInt(site.emails.length)-1)+')').css('padding-bottom',site.paddingTop/2);
		},
		spreadsheet: function(){

			  var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1ullH-GuUMvywG410oyDghFYKcVtMrcALGngWaW7b57g/pubhtml';

			  function init() {
			    Tabletop.init( { key: public_spreadsheet_url,
			                     callback: showInfo,
			                     simpleSheet: true } )
			  }

			  function showInfo(data, tabletop) {
			    alert("Successfully processed!")
			    site.buildFeed(data);
				site.probe();
			  }
			  init();
		},
		buildFeed: function(data){
			$.each(data, function( index, value ) {
				index = JSON.stringify(index);
				content = 	JSON.stringify(value);
			  console.log(JSON.stringify(index) +': '+JSON.stringify(value) );
			  if(index % 2 === 0){
			  	$('.wrapper>div').append('<div class="left"><h1>'+value.AUTHOR+' // '+value.SUBJECT+'</h1><p>'+value.COPY+'</p></div>');
			  }else{
			  	$('.wrapper>div').append('<div class="right"><h1>'+value.AUTHOR+' // '+value.SUBJECT+'</h1><p>'+value.COPY+'</p></div>');
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
		console.log('fired');
		site.resize();
	});

})(window.jQuery);