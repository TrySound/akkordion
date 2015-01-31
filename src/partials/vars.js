
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
			transition = '-webkit-transition-duration';
			transitionEnd = 'webkitTransitionEnd';
		}

		if(el.style.transition !== undefined) {
			transition = 'transition-duration';
			transitionEnd = 'transitionend';
		}
	} ());


	var defaults = {
		single: true,
		speed: 300
	};
