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
		emails: $('.wrapper>div>div'),
		paddingTop: window.innerHeight,
		pixels:'',

		init: function(){
			site.spreadsheet();
			site.miscFunctions();
		},
		probe: function(){
			$('#logo').attr('src','assets/img/logo.svg');
			$('#header h1').css('opacity','1');
			site.resize();
			var position;

			function loaded () {
				site.myScroll = new IScroll('.wrapper', { probeType: 3, mouseWheel: true });

				site.pixels = parseInt($('.wrapper>div').height())-site.paddingTop;
				$('#slider').attr('max',site.pixels);

				$('#slider').bind('mousemove change',function(){
					value =	$('#slider').val();
					scrollPercent = (value/site.pixels);
					scrollPoint = scrollPercent*($('.wrapper>div').height()-site.paddingTop);
					site.myScroll.scrollTo(0, -scrollPoint);
					updatePosition();
					console.log(scrollPercent ,value+' scrollPoint: ' +scrollPoint);
				})

				site.myScroll.on('scroll', function(){
					updatePosition(),
					scrollValue = -site.myScroll.y;
					console.log('scrollValue: ' +scrollValue);
					$( "#slider" ).val(scrollValue);
				});
				site.myScroll.on('scrollEnd', function(){
					updatePosition(),
					scrollValue = -site.myScroll.y;
					$( "#slider" ).val(scrollValue);
				});
			}
			loaded();

			document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			function updatePosition () {
				scrollDistance = site.paddingTop/1.5;
				logoPosition = 50+(site.myScroll.y/scrollDistance)*50;
				logoScale = 1.2+(site.myScroll.y/scrollDistance);
				logoOpacity = 1+(site.myScroll.y/scrollDistance);

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

					$('#timeline').css({
						opacity: 0,
						pointerEvents: 'none',
					});
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

					$('#timeline').css({
						opacity: 1,
						pointerEvents: 'inherit',
					});
				}
			}
		},
		resize: function(){
			$('.wrapper>div>div:eq(0)').css('padding-top',site.paddingTop+15);
			paddingBottom = ( site.paddingTop-$('.wrapper>div>div').last().height() )/2;
			if(paddingBottom <= 50){
				paddingBottom = 100
			}
			$('.wrapper>div>div').last().css('padding-bottom', paddingBottom);

			site.pixels = parseInt($('.wrapper>div').height())-site.paddingTop;
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

			  function showInfo(data, tabletop) {
			    site.buildFeed(data);
				site.probe();
			  }
			  init();
		},
		buildFeed: function(data){
			$.each(data, function( index, value ) {
				if(index <= 100){
				index = JSON.stringify(index);
				content = 	JSON.stringify(value);
			  if(value.AUTHOR.substring(0,3) == 'tal'){
			  	author = value.AUTHOR.substring(0,3);
			  	side = 'left';
			  }else if(value.AUTHOR.substring(0,4) == 'josh'){
			  	author = value.AUTHOR.substring(0,4);
			  	side = 'right'
			  }else{
			  	author = value.AUTHOR;
			  	side = 'middle someone'
			  }
			  if(value.SUBJECT == "gchat"){
			  	subject = 'gchat'
			  }else{
			  	subject = 'Subject: '+value.SUBJECT+'';
			  }
			  $('.wrapper>div').append('<div class="'+side+'"><ul class="timestamp"><li>'+value.DATE+'</li><li>'+value.TIME+'</li></ul><h1>From: '+author+' </h1><h2>'+subject+'</h2><p>'+value.COPY+'</p><ul class="attachments"><li>'+value.ATTACHMENTS+'</li></ul></div>');
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