(function (module) {

	window.akkordion = module(window, document)

} (function (window, document, undefined) {

// @@include('partials/vars.js')

// @@include('partials/bind.js')


	var registry = [];

	/* Initialize */
	function akkordion(elements, options) {
		var options = extend({}, defaults, options),
			el;

		if(typeof elements === 'string') {
			elements = document.querySelectorAll(elements);
		}


		for(i = 0, max = elements.length; i < max; i++) {
			el = elements[i];
			if( ! attr(el, dataInit)) {
				attr(el, dataInit, true);
				registry.push(new bind(el, options));
			}
		}
	}


	akkordion.on = function (event, cb) {
		var collection = callbacks[(event = event.toLowerCase())];

		if(collection && typeof cb === 'function') {
			collection.push(cb);
		}

		return akkordion;
	};

	akkordion.open = function (root, index, noanim) {
		if(root) {
			for(i = registry.length - 1; i > -1; i--) if(registry[i].root === root) {
				return registry[i].open(Number(index), noanim) !== false;
			}
		}
	};

	akkordion.close = function (root, index, noanim) {
		if(root) {
			for(i = registry.length - 1; i > -1; i--) if(registry[i].root === root) {
				return registry[i].close(Number(index), noanim) !== false;
			}
		}
	};


	on(document, 'DOMContentLoaded', function () {
		akkordion('.' + PLUGIN_NAME);
	});



	return akkordion;

// @@include('partials/lib.js')

}));
