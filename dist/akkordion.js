/*!
 * akkordion 0.1.1
 * Accordion UI Element
 * https://github.com/TrySound/akkordion
 * 
 * Released under the MIT license
 * Copyright (c) 2015, Bogdan Chadkin <trysound@yandex.ru>
 */

(function (module) {

	window.akkordion = module(window, document)

} (function (window, document, undefined) {


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


	var transition = false,
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



	function bind(el, options) {
		var self = this;
		self.root = el;
		self.options = extend({}, options, getDataAttrs(el, dataPrefix));
		self.cache();
		self.setDefaultState();
		self.bindEvents();
		trigger('init', self);
	};

	bind.prototype = {
		cache: function () {
			var self = this,
				root = self.root,
				elements = root.querySelectorAll('.' + PLUGIN_NAME + '-title'),
				empty = document.createElement('div'),
				titleSet = [],
				contentSet = [],
				outerSet = [],
				i, title, content, outer;

			empty.className = PLUGIN_NAME + '-outer';
			for(i = elements.length - 1; i > -1; i--) {

				// Exclude nested structures
				if((title = elements[i]).parentNode === root) {

					// Get next non-text node
					content = ! (content = title.nextSibling) ? null : content.nodeType === 1 ? content :
								! (content = content.nextSibling) ? null : content.nodeType === 1 ? content : null;

					// Check is content
					content = content && content.className.indexOf(PLUGIN_NAME + '-content') > -1 ? content : null;

					// Make outer and add to sets
					if(content) {
						titleSet.unshift(title);
						
						outer = empty.cloneNode();
						outer.appendChild(root.replaceChild(outer, content));
						outerSet.unshift(outer);
						contentSet.unshift(content);
					}

				}
			}

			self.titleSet = titleSet;
			self.outerSet = outerSet;
			self.contentSet = contentSet;
		},

		setDefaultState: function () {
			var self = this,
				outerSet = self.outerSet,
				contentSet = self.contentSet,
				i;

			for(i = outerSet.length - 1; i > -1; i--) {
				contentSet[i].style.height = 'auto';

				// States
				if(contentSet[i].className.indexOf(PLUGIN_NAME + '-active') > -1) {
					setActive(self, i, true);
					outerSet[i].style.height = 'auto';
				}
			}
		},

		bindEvents: function () {
			var self = this;

			on(self.root, 'click', function (e) {
				var title = e.target,
					titleSet = self.titleSet,
					index = titleSet.indexOf(title),
					i;

				if(title.className.indexOf(PLUGIN_NAME + '-title') > -1) {
					e.preventDefault();
				}

				if(index > -1) {
					if(attr(title, dataActive)) {
						self.close(index);
					} else {
						self.open(index);
						if(self.options.single) {
							for(i = titleSet.length -1; i > -1; i--) if(i !== index) {
								self.close(i);
							}
						}
					}
				}
			});

			on(self.root, transitionEnd, function (e) {
				var el = e.target,
					index;

				if(e.propertyName === 'height' && (index = self.outerSet.indexOf(el)) > -1) {
					attr(el, dataAnimating, null);
					if(attr(el, dataActive)) {
						el.style.cssText = 'height:auto;';
						trigger('open', self, index);
						trigger('afteropen', self, index);
					} else {
						el.style.cssText = '';
						trigger('close', self, index);
						trigger('afterclose', self, index);
					}

				}
			});
		},

		open: function (index, noAnim) {
			var self = this,
				outer = self.outerSet[index],
				content = self.contentSet[index],
				options = self.options,
				opacity = options.opacity ? 'height:auto;opacity:' : false,
				speed = options.speed,
				transitionDuration = transition + '-duration:' + speed + 'ms;',
				transitionDelay = transition + '-delay:' + speed / 3 + 'ms;',
				height;

			if( ! transition || noAnim || speed === 0) {
				if( ! trigger('beforeopen', self, index)) {
					trigger('abort', self, index);
					return;
				}

				setActive(self, index, true);
				outer.style.cssText = 'height:auto;';

				trigger('open', self, index);
				trigger('afteropen', self, index);

			} else if( ! attr(outer, dataAnimating) && ! attr(outer, dataActive)) {
				if( ! trigger('beforeopen', self, index)) {
					trigger('abort', self, index);
					return;
				}

				setActive(self, index, true);
				attr(outer, dataAnimating, true);

				outer.style.height = 'auto';
				height = getComputedStyle(outer).height;
				outer.style.height = 0;
				outer.offsetWidth;
				outer.style.cssText = 'height:' + height + ';' + transitionDuration;

				if(opacity) {
					content.style.cssText = opacity + '0;';
					outer.offsetWidth;
					content.style.cssText = opacity + '1;' + transitionDuration + transitionDelay;
				}
			}
		},

		close: function (index, noAnim) {
			var self = this,
				outer = self.outerSet[index],
				content = self.contentSet[index],
				options = self.options,
				opacity = options.opacity ? 'height:auto;opacity:' : false,
				speed = options.speed,
				transitionDuration = transition + '-duration:' + speed + 'ms;',
				transitionDelay = transition + '-delay:' + speed / 3 + 'ms;';

			if( ! transition || noAnim || speed === 0) {
				if( ! trigger('beforeclose', self, index)) {
					trigger('abort', self, index);
					return;
				}

				setActive(self, index, false);
				outer.style.cssText = '';

				trigger('close', self, index);
				trigger('afterclose', self, index);

			} else if( ! attr(outer, dataAnimating) && attr(outer, dataActive)) {
				if( ! trigger('beforeclose', self, index)) {
					trigger('abort', self, index);
					return;
				}

				setActive(self, index, false);
				attr(outer, dataAnimating, true);

				outer.style.height = getComputedStyle(outer).height;
				outer.offsetHeight;
				outer.style.cssText = transitionDuration + (opacity ? transitionDelay : '');

				if(opacity) {
					content.style.cssText = opacity + '1;';
					outer.offsetWidth;
					content.style.cssText = opacity + '0;' + transitionDuration;
				}
			}
		}
	}


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

		if(collection && typeof cb === 'function') {
			collection.push(cb);
		}

		return akkordion;
	};


	on(document, 'DOMContentLoaded', function () {
		akkordion('.' + PLUGIN_NAME);
	});



	return akkordion;


	function trigger(event, inst, index) {
		var collection = callbacks[event],
			root = inst.root,
			title = inst.titleSet[index],
			content = inst.contentSet[index],
			result = true,
			i, max;

		for(i = 0, max = collection.length; i < max; i++) {
			result = collection[i].call(root, title, content) === false ? false : result;
		}

		return result;
	}

	function setActive(inst, index, state) {
		state = state ? true : null;
		attr(inst.titleSet[index], dataActive, state);
		attr(inst.outerSet[index], dataActive, state);
		attr(inst.contentSet[index], dataActive, state);
	}


	function attr(el, name, val) {
		return val === undefined ? el.hasAttribute(name) :
			val === null ? el.removeAttribute(name) : el.setAttribute(name, val);
	}

	function on(el, event, cb) {
		el.addEventListener(event, cb, false);
	}

	function extend() {
		var result = arguments[0] || {};
		var i, max, options, key;

		for (i = 1, max = arguments.length; i < max; i++) {
			options = arguments[i];
			if (options != null) {
				for (key in options) if(options.hasOwnProperty(key) && options[key] !== undefined) {
					result[key] = options[key];
				}
			}
		}

		return result;
	}

	function getDataAttrs(el, prefix) {
		var attrs = el.attributes,
			prefixLength = prefix.length,
			i, name, val,
			result = {};

		for(i = attrs.length; i--; ) {
			name = attrs[i].name;
			val = attrs[i].value;
			if(name.indexOf(prefix) > -1) {
				result[name.substring(prefixLength)] =
					val === 'true' ? true :
					val === 'false' ? false :
					isNaN(val) ? val : Number(val);
			}
		}

		return result;
	}


}));
