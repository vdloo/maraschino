var ec = 0;
var dc = 0;
var zc = { n : 1000, d : 2000 };
var store_pos = [];
var prop;
function start_float() {
	$('body').css('overflow', 'hidden');

	// convert the current windows to absolute positioning
	
	$($('ul.modules>li, .dialog').get().reverse()).each(function(){
		el = $(this);
		cur_ec = ++dc;
		prop = {
			x : el.offset().left,
			y : el.offset().top,
			w : el.width(),
			h : el.height()
		}

		// store original position of windows for animation
		
		store_pos[cur_ec] = store_pos[cur_ec] === undefined ? new Array() : store_pos[cur_ec];
		store_pos[cur_ec]['identifier'] = cur_ec;
		store_pos[cur_ec]['static'] = store_pos[cur_ec]['static'] ? store_pos[cur_ec]['static'] : el.clone();
		store_pos[cur_ec]['left'] = store_pos[cur_ec]['left'] ? store_pos[cur_ec]['left'] : prop.x;
		store_pos[cur_ec]['top'] = store_pos[cur_ec]['top'] ? store_pos[cur_ec]['top'] : prop.y;

		if (el.attr('flid') !== 'undefined') el.attr('flid', cur_ec);
		el.css({width: prop.w, height: prop.h, left: prop.x, top: prop.y, position:'absolute'});
		el.resizable();
		console.log(el.find('h2'));
	});
	$('h2').css('cursor', 'move');

	// calculations and handlers for moving the windows around

	$('ul.modules>li, .dialog').bind('mousedown', function(e){
		if (e.which != 1) return;
		if (!$(e.target).is('h2')) return;
		el = $(this);

		var t;
		t = el.hasClass('dialog') ? 'd' : 'n';
		dim = $("#dimmer");
		if (dim.length > 0){
			dim.css({'z-index': zc['n'] + 1});
		}
		zc[t]++;
		el.css({'z-index': zc[t]});

		var flid = el.attr('flid');
		var cur_ec = false;
		var el_index;
		for (el_index=1; el_index<store_pos.length; ++el_index) {
			if (!cur_ec) {
				cur_ec = store_pos[el_index]['identifier'] == flid ? flid : false;
			}
		}
		cur_ec = cur_ec ? cur_ec : ++dc;
		if (el.attr('flid') === 'undefined') {
			el.attr('flid', cur_ec);
			store_pos[cur_ec]['identifier'] = cur_ec;
		}	

		prop = {
			x : el.offset().left,
			y : el.offset().top,
			w : el.width(),
			h : el.height()
		}
		var mpos = { start : {}, end : {} }
		mpos.start.x = event.pageX;
		mpos.start.y = event.pageY;
		$(document).bind('mousemove', function(event) {
			mpos.end.x = event.pageX;
			mpos.end.y = event.pageY;
			var dif = {
				x : mpos.end.x - mpos.start.x,
				y : mpos.end.y - mpos.start.y
			}
			prop.ww = $( window ).width();
			prop.wh = $( window ).height();
			prop.ph = $('#currently_playing').outerHeight(true);
			prop.sx = prop.x + dif.x;
			prop.sy = prop.y + dif.y;
			prop.sl = 50 - prop.w;
			prop.sr = prop.ww - 50;
			prop.sx = prop.sx > prop.sl ? prop.sx : prop.sl;
			prop.sx = prop.sx < prop.sr ? prop.sx : prop.sr;
			prop.sb = prop.wh - prop.ph - 25;
			prop.sy = prop.sy > 0 ? prop.sy : 0;
			prop.sy = prop.sy < prop.sb ? prop.sy : prop.sb;
			el.css({left: prop.sx, top: prop.sy});
		});

		$(document).mouseup(function() {
			$(document).unbind('mousemove');
		});
	});

	$('ul.modules>li, .dialog').hover(function(){
		$(this).find('h2').css('cursor', 'move');
	});
}
function stop_float() {
	$('body').css('overflow', 'visible');
	
	// put the windows back in docked position
	
	var el_index;
	for (el_index=1; el_index<store_pos.length; ++el_index) {
		var flid = store_pos[el_index]['identifier'];
		var el = $('[flid=' + flid + ']');
		var restore_relative = function(el, cbi){
			return function(){
				el.replaceWith(store_pos[cbi]['static']);
			}
		}(el, el_index);
		el.animate({left:store_pos[el_index]['left'], top: store_pos[el_index]['top']}, 'slow', restore_relative);
	}
	$('ul.modules>li, .dialog').unbind('mousedown').unbind('mouseenter').unbind('mouseleave');
}

$('#settings_icon').on('click', function(){
	if ($('body').hasClass('f_operation_mode')){
		stop_float();
		var addbuttons = $('.add_module');
		addbuttons.css('opacity', 0);
		setTimeout(function() { 
			addbuttons.animate({opacity:1}, 500);
		}, 500);
	}
	else {
		start_float();
	}
});
start_float();
