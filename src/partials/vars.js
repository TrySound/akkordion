
	var transform = false,
		transition = false,
		transitionEnd = false,
		dataPrefix = 'data-akkordion-',
		dataActive = dataPrefix + 'active',
		dataAnimating = dataPrefix + 'animating',
		dataIndex = dataPrefix + 'index',
		dataInit = dataPrefix + 'initialized';

	(function () {
		var el = document.createElement("div");
		
		if(el.style.WebkitTransform !== undefined) {
			transform = '-webkit-transform';
		}

		if(el.style.transform !== undefined) {
			transform = 'transform';
		}

		if(el.style.WebkitTransition !== undefined) {
			transition = '-webkit-transition';
			transitionEnd = 'webkitTransitionEnd';
		}

		if(el.style.transition !== undefined) {
			transition = 'transition';
			transitionEnd = 'transitionend';
		}
	} ());


	var defaults = {
		single: true,
		speed: 300,
		opacity: false
<<<<<<< HEAD
=======
	}, callbacks = {
		'init': [],
		'abort': [],
		'beforeopen': [],
		'open': [],
		'afteropen': [],
		'beforeclose': [],
		'close': [],
		'afterclose': []
>>>>>>> master
	};
