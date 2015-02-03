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

		init: function(){
			site.resize();
			site.probe();
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
			$('.wrapper>div>div:eq(0)').css('padding-top',site.paddingTop);
		},
	};

	/* trigger when page is ready */
	$(document).ready(function (){
		// your functions go here
		site.init();
	});
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
		site.resize();
	});

})(window.jQuery);