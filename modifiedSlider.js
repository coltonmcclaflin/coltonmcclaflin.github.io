;(function ( $, window, document, undefined ) {
 
var pluginName = "ikSlider",
	defaults = {
		selectedIndex: 0,
		paused: false,
		delay: 5000,
		timer: null
	};
 

function Plugin( element, options ) {
	this.element = element;
	this.options = $.extend( {}, defaults, options) ;
	this._defaults = defaults;
	this._name = pluginName;
	this.keys = {
		tab: 9,
		enter: 13,
		esc: 27,
		space: 32,
		left: 37,
		up: 38,
		right: 39,
		down:  40
	};
	this.init();
}
 
Plugin.prototype.init = function () {
	var $elem, $slides, $buttons, $info;
	$elem = $(this.element).addClass("ik-slider").attr({'role': 'region', 'aria-live': 'off', 'aria-label': 'Accessibility image slider', tabindex: 0})
		.on('mouseenter', {me: this}, function(event) {
			var me = event.data.me;
			me.options.paused = true;
			clearTimeout(me.options.timer);
			$('.next, .prev').attr({role: 'presentation', 'aria-hidden': true}).css({ visibility: 'visible', opacity: 1 });
			console.log('in');
		})
		.on('mouseleave', {me: this}, function(event) {
			var me = event.data.me;
			if (!$(me.element).is(':focus')) {
				me.options.paused = false;
				me.selectSlide({data:{me: me, next: 1}});
			}
			$('.next, .prev').attr({role: 'presentation', 'aria-hidden': true}).css({ visibility: 'hidden', opacity: 0 });
			console.log('out');
		})
		.on('focus', {me: this}, function(event) {
			var me = event.data.me;
			me.options.paused = true;
			//$(event.target).attr({'aria-live': 'assertive'});
			clearTimeout(me.options.timer);
		})
		.on('blur', {me: this}, function(event) { 
			var me = event.data.me;
			me.options.paused = false;
			//$(event.target).attr({'aria-live': 'off'});
			me.selectSlide({data:{me: me, next: 1}});
		})
		.on('keypress', {me: this}, this.onKeyPress)
		.on('keydown', {me: this}, this.onKeyDown);
	
	$slides = $elem.children('div').addClass('slide');
	
	$buttons = $('<ul/>').addClass('buttons').attr({role: 'presentations', 'aria-hidden': true});
	for (var i = 0; i < $slides.length; i++) {
		$('<li/>').html('&bull;').appendTo($buttons);
	}
	$('<div/>').addClass('dots').attr({role: 'presentations', 'aria-hidden': true}).append($buttons).appendTo($elem);
	$('<div/>').addClass('prev')
		.on('click', {me: this, next: -1}, this.selectSlide)
		.appendTo($elem);
	$('<div/>').addClass('next')
		.on('click', {me: this, next: 1}, this.selectSlide)
		.appendTo($elem);
	
	$('<div/>').addClass('readers_only')
		.text('Use right and left arrow keys to navigate through the slides')
		.appendTo($elem);
	
	this.selectSlide({data:{me: this, next: 0}});
	
};
Plugin.prototype.selectSlide = function (event) {
	var me = event.data.me, next = event.data.next, $slides, $dots, nextInd;
	$slides = $(me.element).find('.slide');
	$dots = $(me.element).find('.dots li');
	nextInd = me.options.selectedIndex + next;
	nextInd = nextInd > $slides.length - 1 ? 0 : nextInd < 0 ? $slides.length - 1 : nextInd;
	me.options.selectedIndex = nextInd;
		
	$slides.attr({'aria-hidden': true}).removeClass('selected');
	$($slides[nextInd]).attr({'aria-hidden': false}).addClass('selected');
	$dots.removeClass('selected').eq(nextInd).addClass('selected');
	
	if (!me.options.paused && me.options.delay > 0) {
		me.options.timer = window.setTimeout(function() {
			 me.selectSlide({data:{me: me, next: 1}});
		}, me.options.delay);
	} 
}
Plugin.prototype.onKeyPress = function(event) {
	var me = event.data.me;
	switch (event.keyCode) {
		case me.keys.left:
		case me.keys.up:
		case me.keys.right:
		case me.keys.down:
			event.stopPropagation();
			return false;
	}
}
Plugin.prototype.onKeyDown = function(event) {
	var me = event.data.me;
	switch (event.keyCode) {
		case me.keys.left:
			me.selectSlide({data: {me: me, next: -1}});
			break;
		case me.keys.right:
			me.selectSlide({data: {me: me, next: 1}});
			break;
	}
}

$.fn[pluginName] = function ( options ) {
	return this.each(function () {
		if ( !$.data(this, "plugin_" + pluginName )) {
			$.data( this, "plugin_" + pluginName,
			new Plugin( this, options ));
		}
	});
}
 
})( jQuery, window, document );