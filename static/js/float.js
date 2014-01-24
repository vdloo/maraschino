$(document).on('mousedown', 'ul.modules>li', function(e){
	if (e.which != 1) return;
	el = $(this);
	// convert current css to absolute
	var prop = {
		x : el.offset().left,
		y : el.offset().top,
		w : el.width(),
		h : el.height()
	}
	el.css({width: prop.w, height: prop.h, left: prop.x, top: prop.y, position:'absolute'});
	console.log(prop);

	var mpos = {
		start : {},
		end : {}
	}
	mpos.start.x = event.pageX;
	mpos.start.y = event.pageY;
	$(document).bind('mousemove', function(event) {
		mpos.end.x = event.pageX;
		mpos.end.y = event.pageY;
		var dif = {
			x : mpos.end.x - mpos.start.x,
			y : mpos.end.y - mpos.start.y
		}
		el.css({left: prop.x + dif.x, top: prop.y + dif.y});
	});
	$(document).mouseup(function() {
		$(document).unbind('mousemove');
		console.log('unbinding!')
	});
});
