
	var defaults = {
		single: true,
		speed: 300,
		opacity: false
	}, callbacks = {
		'init': [],
		'abort': [],
		'beforeopen': [],
		'open': [],
		'afteropen': [],
		'beforeclose': [],
		'close': [],
		'afterclose': []
	}, PLUGIN_NAME = 'akkordion';


	var transform = false,
		transition = false,
		transitionEnd = false,
		dataPrefix = 'data-' + PLUGIN_NAME + '-',
		dataActive = dataPrefix + 'active',
		dataAnimating = dataPrefix + 'animating',
		dataIndex = dataPrefix + 'index',
		dataInit = dataPrefix + 'initialized';


	(function () {
		var el = document.createElement("div");

		if(el.style.WebkitTransition !== undefined) {
			transition = '-webkit-transition';
			transitionEnd = 'webkitTransitionEnd';
		}

		if(el.style.transition !== undefined) {
			transition = 'transition';
			transitionEnd = 'transitionend';
		}
	} ());
