(function (module) {
	
	window.akkordion = module(window, document)

} (function (window, document, undefined) {

// @@include('partials/vars.js')

// @@include('partials/bind.js')

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
				new bind(el, options);
			}
		}
	}


	akkordion.on = function (event, cb) {
		var collection = callbacks[(event = event.toLowerCase())];

		if(collection && typeof collection.length === 'number' && typeof cb === 'function') {
			collection.push(cb);
		}

		return akkordion;
	};


	on(document, 'DOMContentLoaded', function () {
		akkordion('.akkordion');
	});



	return akkordion;

// @@include('partials/lib.js')

}));
