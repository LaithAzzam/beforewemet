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
				}
			}
			function updateTime(){
			};
			loaded();
		},
		resize: function(){
		},
		paddingBottom: function(){
			paddingBottom = ( site.paddingTop-$('.wrapper>div').last().height() )/2;
			if(paddingBottom <= 50){
				paddingBottom = 100
			}
			$('.wrapper>div').last().css('padding-bottom', paddingBottom);
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
			var newDate = moment().year(2010).month(5).date(25);
			return newDate.unix();
		},
		buildFeed: function(data){
			wrapper = document.getElementsByClassName('wrapper')[0];
			current_miliseconds = site.userTime();
			var messages = site.messages;

			// our variable holding starting index of this "page"
			var index = 0;

			displayNext();

			function displayNext() {
			  // get the list element
			  var list = $('.wrapper');
			  
			  // get index stored as a data on the list, if it doesn't exist then assign 0
			  var index = list.data('index') % messages.length || 0;
			  
			  // save next index - for next call
			  list.data('index', index + messages.length);
			  
			  // 1) get 20 elements from array - starting from index, using Array.slice()
			  // 2) map them to array of li strings
			  // 3) join the array into a single string and set it as a HTML content of list
			  $.each(messages.slice(index, index + messages.length), function(index, val) {
				var item_date = moment(""+val.DATE+" "+val.TIME+"");
				item_miliseconds = item_date.unix();

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
						subject = ''
					}else{
						subject = 'Subject: '+val.SUBJECT+'';
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
					copyRaw = JSON.stringify(val.COPY);
					copy = copyRaw.replace(/[\\]n/g, '<br/>').replace(/\"/g, "");
				};

				author();
				subject();
				copy();
				attachments();

				if(current_miliseconds >= item_miliseconds ){
					last = $('.wrapper>div').last();
					if(last.attr('class')==side){
						$('.wrapper>div').last().children('p').append('<br/><br/>'+val.COPY+'');
					}else if(author != 'none'){
			    		$('.wrapper').append('<div class="'+side+'"><h2>'+subject+'</h2><p>'+copy+'</p></div>');
			    		$('.wrapper>div').last().children('p').linkify();
					}
					if(item_attachments && val.SUBJECT != "gchat" && author != 'none'){
						item = wrapper.lastChild.getElementsByTagName("p")[0];
						item.appendChild(item_attachments);
					}
				}
			});
			site.postBuild();
			}
		},
		postBuild: function(){
			site.paddingBottom();
			classname = 'wrapper';
			var $elements = $('.' + classname+'>div');

			$elements.each(function() {
				new Waypoint({
				  element: this,
				  handler: function(direction) {
				    $(this.element).addClass('active')
				 		item = $(this.element);
				 		itemIndex = item.index();
				 		itemTime = moment(""+site.messages[itemIndex].DATE+" "+site.messages[itemIndex].TIME+"");

				 		var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
				 		var selectedMonthName = months[itemTime.month()];

				 		$('#date').html(selectedMonthName +" "+ itemTime.date() +", "+ itemTime.year() +"");
				 		$('#time').html(((itemTime.hour() + 11) % 12 + 1) +":"+('0' + itemTime.minutes()).slice(-2));
				  },
				  offset: '80%',
				  group: classname
				})
			});
		},
		miscFunctions: function(){
			$("#backToTop").click(function() {
			  $("html, body").animate({ scrollTop: 0 }, "slow");
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
		},
	};
	about = {
			showAbout: function(){
				$('#about').addClass('open');
				$('.wrapper, #header').css('opacity','.1');
			},
			closeAbout: function(){
				$('#about').removeClass('open');
				$('.wrapper, #header').css('opacity','1');
			}
	},


	$(document).ready(function (){
		site.init();
	});
	
	$(window).load(function() {
		
	});
	
	$(window).resize(function() {
	});

})(window.jQuery);