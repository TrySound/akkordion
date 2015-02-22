
	var defaults = {
		single: true,
		speed: 350,
		hover: false
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


	var transition = false,
		transitionEnd = false,
		dataActive = 'active',
		dataAnimating = 'animating',
		dataIndex = 'index',
		dataInit = 'initialized';


	(function () {
		var el = document.createElement("div");

		if(el.style.transition !== undefined) {
			transition = 'transition';
			transitionEnd = 'transitionend';
		}
	} ());
