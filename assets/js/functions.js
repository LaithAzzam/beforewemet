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
		pixels:'',
		paddingTop:window.innerHeight,
		messages:'',

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
				items = $('.wrapper').children('div');
				$.each(items, function(){
					var scrollTop     = $(window).scrollTop(),
					    elementOffset = $(this).offset().top,
					    distance      = (elementOffset - scrollTop);

					 topLimit = (window.innerHeight/4)*2;
					 if(distance < topLimit  ){
					 	if(item != this){
					 		item = this;
					 		$(item).addClass('active');
					 		itemIndex = $(this).index();
					 		itemTime = moment(""+site.messages[itemIndex].DATE+" "+site.messages[itemIndex].TIME+"");

					 		var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
					 		var selectedMonthName = months[itemTime.month()];

					 		$('#date').html(selectedMonthName +" "+ itemTime.date() +", "+ itemTime.year() +" // "+itemTime.hour() +":"+itemTime.minute());
					 	}
					 }else {
					 	$(this).removeClass('active');
					 }
				})
			};
			loaded();
		},
		resize: function(){
			paddingBottom = ( site.paddingTop-$('.wrapper>div').last().height() )/2;
			if(paddingBottom <= 50){
				paddingBottom = 100
			}
			$('.wrapper>div').last().css('padding-bottom', paddingBottom);

			site.pixels = parseInt($('.wrapper').height())-site.paddingTop;
			$('#slider').attr('max',site.pixels);
		},
		spreadsheet: function(){
			$.getJSON("assets/js/messages.json", function(json) {
			    // console.log(json); // this will show the info it in firebug console
				site.messages = json;
				site.buildFeed(json);
				site.probe();
			});
		},
		buildFeed: function(data){
			wrapper = document.getElementsByClassName('wrapper')[0];
			
			function userTime(){
				var newDate = moment().year(2010).month(5).date(25);
				current_miliseconds = newDate.unix();
			}
			userTime();

			$('#backToTop').on('click',function(){
				displayMessages();
			})

			function displayMessages(){
				// just preparing some data
				var arr = site.messages;

				// our variable holding starting index of this "page"
				var index = 0;

				// display our initial list
				displayNext();

				function displayNext() {
				  // get the list element
				  var list = $('.wrapper');
				  
				  // get index stored as a data on the list, if it doesn't exist then assign 0
				  var index = list.data('index') % arr.length || 0;
				  
				  // save next index - for next call
				  list.data('index', index + 20);
				  
				  // 1) get 20 elements from array - starting from index, using Array.slice()
				  // 2) map them to array of li strings
				  // 3) join the array into a single string and set it as a HTML content of list
				  list.append($.map(arr.slice(index, index + 20), function(val) {
				  	console.log();
				    return '<li id=' + val.DATE + '>' + val.DATE + '</li>';
				  }).join(''));
				}
			};

			displayMessages();
			page = 0;
			page_limit = 10;

			// /////////// Message Pagination Loop ////////////////
			// for (i = 0; i > page*pagelimit && i < page+1*page_limit; i++) { 
			// }

			////////////////////////////////////////////////////

			// $.each(data, function( index, value ) {
			// 	index = JSON.stringify(index);
			// 	content = JSON.stringify(value);
			// 	var item_date = moment(""+value.DATE+" "+value.TIME+"");
			// 	item_miliseconds = item_date.unix();

			// 	function author(){
			// 		// set author per item
			// 		if(value.AUTHOR.substring(0,3) == 'tal'){
			// 			author = value.AUTHOR.substring(0,3);
			// 			side = 'right';
			// 		}else if(value.AUTHOR.substring(0,4) == 'josh'){
			// 			author = value.AUTHOR.substring(0,4);
			// 			side = 'left'
			// 		}else{
			// 			author = 'none';
			// 			side = 'middle someone'
			// 		}
			// 	};
			// 	function subject(){
			// 		// use subject to determine if message is ghat or email
			// 		if(value.SUBJECT == "gchat"){
			// 			// if gchat, set subject to nothing to know it's gchat
			// 			subject = ''
			// 		}else{
			// 			subject = 'Subject: '+value.SUBJECT+'';
			// 		}
			// 	};
			// 	function copy(){
			// 		copyRaw = JSON.stringify(value.COPY);
			// 		copy = copyRaw.replace(/[\\]n/g, '<br/>').replace(/\"/g, "");
			// 	};
			// 	function attachments(){
			// 		if(value.ATTACHMENTS == ''){
			// 			item_attachments = false;
			// 		}else{
			// 			item_attachments_raw = JSON.stringify(value.ATTACHMENTS).split(/[\\]n/g), parts = [];

			// 			function makeUL(array) {
			// 			    // Create the list element:
			// 			    var list = document.createElement('ul');

			// 			    for(var i = 0; i < array.length; i++) {
			// 			        // Create the list item:
			// 			        var link = document.createElement('a');
			// 			        link.href = 'assets/attachments/'+array[i].replace(/\"/g, "");
			// 			        link.target = '_blank';
			// 			        var item = document.createElement('li');

			// 			        // Set its contents:
			// 			        item.appendChild(link).appendChild(document.createTextNode(array[i].replace(/\"/g, "")));

			// 			        // Add it to the list:
			// 			        list.appendChild(item);
			// 			    }
			// 			    // Finally, return the constructed list:
			// 			    return list;
			// 			}
			// 			item_attachments = makeUL(item_attachments_raw);
			// 		}
			// 	}
			// 	function buildMessage(){
			// 		// build message content
			// 		author();
			// 		subject();
			// 		copy();
			// 		attachments();
			// 	}

			// 	if(current_miliseconds >= item_miliseconds ){
			// 		buildMessage();
			// 		last = $('.wrapper>div').last();
			// 		if(last.attr('class')==side){
			// 			$('.wrapper>div').last().children('p').append('<br/><br/>'+value.COPY+'');
			// 		}else if(author != 'none'){
			// 			$('.wrapper').append('<div class="'+side+'"><h2>'+subject+'</h2><p>'+copy+'</p></div>');
			// 			$('.wrapper>div').last().children('p').linkify();
			// 		}
			// 		if(item_attachments && value.SUBJECT != "gchat" && author != 'none'){
			// 			item = wrapper.lastChild.getElementsByTagName("p")[0];
			// 			item.appendChild(item_attachments);
			// 		}
			// 	}
			// });
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