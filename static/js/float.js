var float_windows;
var ec = 0;
var dc = 0;
var zc = { n : 1000, d : 2000 };
var store_pos = [];
var prop;
function get_ec(el, tp) {
	var flid = el.attr('flid');
	var cur_ec = false;
	var el_index;
	for (el_index=1; el_index<store_pos.length; ++el_index) {
		if (!cur_ec) {
			cur_ec = store_pos[el_index]['identifier'] == flid ? flid : false;
		}
	}
	cur_ec = cur_ec || tp ? cur_ec : ++dc;

	if (el.attr('flid') === 'undefined') {
		el.attr('flid', cur_ec);
		store_pos[cur_ec]['identifier'] = cur_ec;
	}	
	return cur_ec;
}

function make_resizable(){
	$('ul.modules>li, .dialog').hover(function(){
		convert_windows();
		$(this).find('h2').css('cursor', 'move');
		var res = $(this).children('div');
		if (!res.hasClass('ui-resizable')){
			fdiv = $('>div:not(.placeholder)', $(this));
			prop.dw = fdiv.width(),
			prop.dh = fdiv.height()
			var cur_ec = get_ec($(this), true);
			if (!cur_ec) return;
			store_pos[cur_ec]['w'] = store_pos[cur_ec]['w'] ? store_pos[cur_ec]['w'] : prop.dw;
			store_pos[cur_ec]['h'] = store_pos[cur_ec]['h'] ? store_pos[cur_ec]['h'] : prop.dh;
			res.resizable({ ghost: true });
		}
	});
}

function convert_windows(){

	// convert the current windows to absolute positioning
	
	$($('ul.modules>li:not(.float):not(.float_placeholder), .dialog').get().reverse()).each(function(){
		el = $(this);
		if ($('>div', el).hasClass('initialised')) return;
		cur_ec = ++dc;
		prop = {
			x : el.offset().left,
			y : el.offset().top,
			w : el.width() + 1,
			h : el.height() + 1,
		}

		// store original position of windows for animation
		
		store_pos[cur_ec] = store_pos[cur_ec] === undefined ? new Array() : store_pos[cur_ec];
		store_pos[cur_ec]['identifier'] = cur_ec;
		store_pos[cur_ec]['static'] = store_pos[cur_ec]['static'] ? store_pos[cur_ec]['static'] : el.clone();
		store_pos[cur_ec]['l'] = store_pos[cur_ec]['l'] ? store_pos[cur_ec]['l'] : prop.x;
		store_pos[cur_ec]['t'] = store_pos[cur_ec]['t'] ? store_pos[cur_ec]['t'] : prop.y;

		if (el.attr('flid') !== 'undefined') el.attr('flid', cur_ec);
		el.after($('<li></li>').addClass('float_placeholder').css({ height: el.outerHeight( true ) + 50 }));
//		setTimeout((function (el) {
			el.css({width: prop.w, height: prop.h, left: prop.x, top: prop.y, position:'absolute'});
			el.addClass('float');
//		})(el), 500);
	});
}

function start_float() {
	$('body').css('overflow', 'hidden');

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

		var cur_ec = get_ec(el);

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
	make_resizable();
}

function stop_float() {
	
	// put the windows back in docked position
	
	var el_index;
	for (el_index=1; el_index<store_pos.length; ++el_index) {
		var flid = store_pos[el_index]['identifier'];
		var el = $('[flid=' + flid + ']');
		var restore_relative = function(el, cbi){
			return function(){
				el.replaceWith(store_pos[cbi]['static']);
				$('.add_module, div[id^=add_]').show();
			}
		}(el, el_index);
		$('>div:not(.placeholder)', el).animate({
			width: store_pos[el_index]['w'],
			height: store_pos[el_index]['h']
		},{
			duration : 100,
			queue : false
		});
		el.animate({
			left:store_pos[el_index]['l'], 
			top: store_pos[el_index]['t'], 
		}, 
			'slow', 
			restore_relative
		);
	}
	$('.float').removeClass('float');
	$('.float_placeholder').remove();
	$('ul.modules>li, .dialog').unbind('mousedown').unbind('mouseenter').unbind('mouseleave');
}
function init_float(){
	float_windows = true;
	$('#settings_icon').on('click', function(){
		if ($('body').hasClass('f_operation_mode')){
			$('.add_module, div[id^=add_]').hide();
			stop_float();
		}
		else {
			start_float();
		}
	});
	start_float();
}
