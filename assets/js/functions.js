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
		emails: $('.wrapper>div'),
		paddingTop:window.innerHeight,
		messages:'',
		dayCount: '',
		init: function(){
			site.spreadsheet();
			site.miscFunctions();   
		},
		probe: function(){
			$('#logo').attr('src','assets/img/logo.svg');
			var position;

			function loaded () {
				document.addEventListener("touchmove", ScrollStart, false);
				document.addEventListener("scroll", Scroll, false);

				function ScrollStart() {
					updateTime();
					scrollValue = $(window).scrollTop();
				}

				function Scroll() {
					updateTime();
					scrollValue = $(window).scrollTop();
					if(scrollValue >= window.innerHeight/2){
						$('#aboutImg').css('display','block');
					}
					else {
						$('#aboutImg').css('display','hidden');
					}
				}
			}
			function updateTime(){
			};
			loaded();
		},
		resize: function(){
		},
		paddingBottom: function(){
			$('.message').css('padding-bottom','0px');
			paddingBottom = ( site.paddingTop-$('.wrapper>div').last().height() )/2;
			if(paddingBottom <= 50){
				paddingBottom = 100
			}
			$('.wrapper>div').last().css('padding-bottom', '25px');
		},
		spreadsheet: function(){
			$.getJSON("assets/js/messages.json", function(json) {
			    // console.log(json); // this will show the info it in firebug console
				site.messages = json;
				site.buildFeed(json);
				site.probe();
			});
		},

		userTime: function(){
			var newDate = moment().year(2010);
			return newDate.unix();
		},

		buildFeed: function(data){
			wrapper = document.getElementsByClassName('wrapper')[0];
			current_miliseconds = site.userTime();
			var messages = site.messages;

			// our variable holding starting index of this "page"
			var index = 0;

			displayNext();

			$("#facebook").click(function() {
				if(navigator.userAgent.match('CriOS')){
					console.log('ios Chrome');
				}else {
					FB.ui({
					  method: 'share',
					  href: 'http://beforewemet.com/',
					}, function(response){});
					return false;
				}
			});

			function displayNext() {
			console.log($('.message').length, site.messages.length);
			if($('.message').length < site.messages.length){
				Waypoint.destroyAll()
				// get the list element
				var amount = 0;
				var list = $('.wrapper');

				// get index stored as a data on the list, if it doesn't exist then assign 0
				var index = list.data('index') % messages.length || 0;

				// 1) get 20 elements from array - starting from index, using Array.slice()
				// 2) map them to array of li strings
				// 3) join the array into a single string and set it as a HTML content of list

				$.each(messages.slice(index, index + messages.length), function(index, val) {

					var item_date = moment(""+val.DATE+" "+val.TIME+"");
					item_miliseconds = item_date.unix();

					if(current_miliseconds >= item_miliseconds ){
						amount++;
						parseMessage();
						last = $('.message').last();
						lastDate = messages[last.index()];
						if(author != 'none'){
							$('.wrapper').append('<div class="'+side+' '+type+' message"><h2>'+subject+'</h2><p>'+copy+'</p></div>');
							$('.message').last().children('p').linkify();
							
							if(last.index()>0){
								if(lastDate.DATE != val.DATE){
								 	site.dayCount++;
									newLast = $('div.message').last();
									newLast.prepend('<span><img src="assets/img/days/day'+(site.dayCount+1)+'.svg" alt="day1" /></span>');
								}
							}
						}
						if(item_attachments && val.SUBJECT != "gchat" && author != 'none'){
							item = wrapper.lastChild.getElementsByTagName("p")[0];
							item.appendChild(item_attachments);
						}

					}
					function parseMessage(){
						author();
						subject();
						copy();
						attachments();
					};
						function author(){
						// set author per item
						if(val.AUTHOR.substring(0,3) == 'tal'){
							author = val.AUTHOR.substring(0,3);
							side = 'right';
						}else if(val.AUTHOR.substring(0,4) == 'josh'){
							author = val.AUTHOR.substring(0,4);
							side = 'left'
						}else{
							author = 'none';
							side = 'middle someone'
						}
					};
					function subject(){
						// use subject to determine if message is ghat or email
						if(val.SUBJECT == "gchat"){
							// if gchat, set subject to nothing to know it's gchat
							subject = '';
							type = 'gchat';
						}else{
							subject = ''+val.SUBJECT+'';
							type = '';
						}
					};
					function attachments(){
						if(val.ATTACHMENTS == ''){
							item_attachments = false;
						}else{
							item_attachments_raw = JSON.stringify(val.ATTACHMENTS).split(/[\\]n/g), parts = [];

							function makeUL(array) {
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
							    // Finally, return the constructed list:
							    return list;
							}
							item_attachments = makeUL(item_attachments_raw);
						}
					}
					function copy(){
						copyRaw = JSON.stringify(val.COPY).replace(/[\\]n/g, '<br/>').replace(/\\/g, "");
						copy = copyRaw.substring(1, copyRaw.length-1);
					};

				});
				list.data('index', parseInt(index) + parseInt(amount));
				if(amount > 0 ){
					site.postBuild();
				}
			}
		}
		},
		postBuild: function(){
  			document.body.scrollTop = document.documentElement.scrollTop = 0;
			ps = $('.message').children('p');
        	psArray = [];
        	for (i = 0; i < ps.length; i++) { 
			    psArray.push(ps[i]);
			}
			site.paddingBottom();
			$.each(['message'], function(i, classname) {
			  var $elements = $('.' + classname);
			  console.log(classname);
			  $elements.each(function() {
			    new Waypoint({
			      element: this,
			      handler: function(direction) {
			        var previousWaypoint = this.previous()
			        var nextWaypoint = this.next()

			        $elements.removeClass('np-previous np-current np-next')
			        $(this.element).addClass('np-current')
			        	item = $(this.element);
			        	p = item.children('p').last()[0];
				 		itemIndex = jQuery.inArray(p, psArray);
				 		itemTime = moment(""+site.messages[itemIndex].DATE+" "+site.messages[itemIndex].TIME+"");

				 		var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				 		var selectedMonthName = months[itemTime.month()];

				 		$('#date').html(selectedMonthName +" "+ itemTime.date() +", "+ itemTime.year() +"");
				 		if(itemTime.hour() >= 12){
				 			period = 'pm';
				 		}else {
				 			period = 'am';
				 		}

				 		$('#time').html(((itemTime.hour() + 11) % 12 + 1) +":"+('0' + itemTime.minutes()).slice(-2) +" "+period+"");
			        if (previousWaypoint) {
			          $(previousWaypoint.element).addClass('np-previous')
			        }
			        if (nextWaypoint) {
			          $(nextWaypoint.element).addClass('np-next')
			        }
			      },
			      offset: '75%',
			      group: classname
			    })
			  })
			});
  			document.body.scrollTop = document.documentElement.scrollTop = 0;
			$('html,body').css('overflow','auto');
			$('#header').css('height','75%');
			$('footer').css('height','auto');
			$('.loading').animate({opacity: 0});
		},
		miscFunctions: function(){
			$("#backToTop").click(function() {
				$('html, body').stop();
				$('html, body').css('overflow','hidden');
				var scrollTop = $(document).scrollTop();
				speed = (scrollTop-$(document).height())/2;
				if(speed < 3000 || speed > 3000){
					speed = 3000;
				}
				$("html, body").animate({ scrollTop: $(document).height() }, speed, function(){
					$('html, body').css('overflow','auto');
				});
			  return false;
			});
			$("#aboutBtn").click(function() {
				if($('#about').hasClass('open')){
					about.closeAbout();
				}else{
					about.showAbout();
				}
				return false;
			});
			$('.wrap').on('click',function(){
				if($('#about').hasClass('open')){
					about.closeAbout();
				}
			});
		},
	};
	about = {
		showAbout: function(){
			$('#about').addClass('open');
			$('.wrap').addClass('hide');
		},
		closeAbout: function(){
			$('#about').removeClass('open');
			$('.wrap').removeClass('hide');
		}
	};

$(document).ready(function (){
	setTimeout(function(){
  		window.scrollTo(0,0);
		site.init();
	},1000)
});

$( window ).resize(function() {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
});

})(window.jQuery);

