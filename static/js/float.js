document.body.style.overflow = 'hidden';
var ec = 0;
var dc = 0;
var zc = { n : 1000, d : 2000 };
var store_pos = [];
function start_float() {
	$('ul.modules>li, .dialog').bind('mousedown', function(e){
		if (float_windows) {
			if (e.which != 1) return;
			el = $(this);
			var t;
			t = el.hasClass('dialog') ? 'd' : 'n';
			console.log('t is ' + t );
			zc[t]++;

			dim = $("#dimmer");
			if (dim.length > 0){
				dim.css({'z-index': zc['n'] + 1});
			}


			// convert current css to absolute
			var prop = {
				x : el.offset().left,
				y : el.offset().top,
				w : el.width(),
				h : el.height()
			}
			var el_index;
			var cur_ec;
			for (el_index=0; el_index<store_pos.length; ++el_index) {
				console.log('curec is ' + cur_ec);
				console.log('checking ' +  store_pos[el_index]['identifier'] + ' against ' + el.attr('flid'));
				console.log('elindex is ' + el_index);
				cur_ec = store_pos[el_index]['identifier'] == el.attr('flid') ? el_index : false;
				console.log('checking ' + el_index);
			}
			console.log(store_pos);
			cur_ec = cur_ec ? cur_ec : ec++;
			store_pos[cur_ec] = store_pos[cur_ec] ? store_pos[cur_ec] : new Array();
			store_pos[cur_ec]['static'] = store_pos[cur_ec]['static'] ? store_pos[cur_ec]['static'] : el.clone();
			el.css({width: prop.w, height: prop.h, left: prop.x, top: prop.y, position:'absolute', 'z-index': zc[t]});
			if (el.attr('flid') !== 'undefined') el.attr('flid', dc++);
			store_pos[cur_ec]['identifier'] = el.attr('flid');

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
		}
	});
}
function stop_float() {
	console.log(store_pos);
	var el_index;
	for (el_index=0; el_index<store_pos.length; ++el_index) {
		console.log($('[fl_id=' + store_pos[el_index]['identifier'] + ']'));
		$('[flid=' + store_pos[el_index]['identifier'] + ']').replaceWith(store_pos[el_index]['static']);
	}
	$('ul.modules>li, .dialog').unbind('mousedown');
}
start_float();
