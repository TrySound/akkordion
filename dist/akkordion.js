/*!
 * akkordion 0.2.5
 * Accordion UI Element
 * https://github.com/TrySound/akkordion
 * 
 * Released under the MIT license
 * Copyright (c) 2015, Bogdan Chadkin <trysound@yandex.ru>
 */

;(function (module) {

	window.akkordion = module(window, document)

} (function (window, document, undefined) {


	var defaults = {
		single: true,
		speed: 350,
		hover: false
	}, callbacks = {
		'init': [],
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
		dataAnim = 'animating',
		dataIndex = 'index',
		dataInit = 'initialized';


	(function () {
		var el = document.createElement("div");

		if(el.style.transition !== undefined) {
			transition = 'transition';
			transitionEnd = 'transitionend';
		}
	} ());



	function bind(el, options) {
		var self = this;
		self.root = el;
		self.options = extend({}, options, getDataAttrs(el));
		self.cache();
		self.bindEvents();
		trigger('init', self);
	};

	bind.prototype = {
		cache: function () {
			var self = this,
				root = self.root,
				children = root.children,
				empty = document.createElement('div'),
				titleSet = [],
				contentSet = [],
				outerSet = [],
				classList, i, title, content, outer;

			self.titleSet = titleSet;
			self.outerSet = outerSet;
			self.contentSet = contentSet;

			empty.className = PLUGIN_NAME + '-outer';
			for(i = children.length - 1; i > -1; i--) {
				title = children[i];

				if(title.className.split(' ').indexOf(PLUGIN_NAME + '-title') > -1) {
					classList = (content = title.nextElementSibling).className.split(' ');
					if(classList.indexOf(PLUGIN_NAME + '-content') > -1) {
						titleSet.unshift(title);
						contentSet.unshift(content);
						outerSet.unshift(outer = empty.cloneNode());

						outer.appendChild(root.replaceChild(outer, content));
						// Default state
						content.style.height = 'auto';
						if(classList.indexOf(PLUGIN_NAME + '-active') > -1) {
							setActive(self, 0, true);
							outer.style.height = 'auto';
						}
					}
				}
			}
		},

		bindEvents: function () {
			var self = this,
				root = self.root,
				hover = self.options.hover,
				mouseInst;

			if(hover !== false) {
				on(root, 'mouseover', function (e) {
					mouseInst = setTimeout(function () {
						push(e);
					}, hover);
				});

				on(root, 'mouseout', function (e) {
					clearTimeout(mouseInst);
				});
			}

			on(root, 'click', push);

			function push (e) {
				var titleSet = self.titleSet,
					el = e.target,
					title = el,
					index;

				while(root !== title) {
					if((index = titleSet.indexOf(title)) > -1) {
						break;
					}
					title = title.parentNode;
				}

				if(index > -1) {
					if(attr(title, dataActive)) {
						self.close(index);
					} else {
						self.open(index);
					}

					e.preventDefault();
				}
			}

			on(root, transitionEnd, function (e) {
				var el = e.target,
					index;

				if(e.propertyName === 'height' && (index = self.outerSet.indexOf(el)) > -1) {
					attr(el, dataAnim, null);
					if(attr(el, dataActive)) {
						el.style.cssText = 'height:auto;';
						trigger('afteropen', self, index);
					} else {
						el.style.cssText = '';
						trigger('afterclose', self, index);
					}

				}
			});
		},

		open: function (index, noAnim) {
			var self = this,
				outerSet = self.outerSet,
				options = self.options,
				speed = options.speed,
				height, i, outer;

			index = index === -1 ? outerSet.length - 1 : index;
			outer = outerSet[index];

			if(options.single) {
				for(i = outerSet.length - 1; i > -1; i--) if(i !== index) {
					self.close(i, noAnim);
				}
			}

			if(outer && ! attr(outer, dataAnim) && ! attr(outer, dataActive) && trigger('beforeopen', self, index)) {
				setActive(self, index, true);
				trigger('open', self, index);

				if( ! transition || noAnim || speed === 0) {
					outer.style.cssText = 'height:auto;';
					trigger('afteropen', self, index);
				} else {
					outer.style.height = 'auto';
					height = outer.offsetHeight;
					if(height !== 0) {
						attr(outer, dataAnim, true);
						outer.style.height = 0;
						outer.offsetWidth;
						outer.style.cssText = 'height:' + height + 'px;' + transition + '-duration:' + speed + 'ms;';
					}

				}

				return true;
			}
		},

		close: function (index, noAnim) {
			var self = this,
				outerSet = self.outerSet,
				speed = self.options.speed;

			index = index === -1 ? outerSet.length - 1 : index;
			outer = outerSet[index];

			if(outer && ! attr(outer, dataAnim) && attr(outer, dataActive) && trigger('beforeclose', self, index)) {
				setActive(self, index, false);
				trigger('close', self, index);

				if( ! transition || noAnim || speed === 0) {
					outer.style.cssText = '';
					trigger('afterclose', self, index);
				} else {
					attr(outer, dataAnim, true);
					outer.style.height = outer.offsetHeight + 'px';
					outer.offsetWidth;
					outer.style.cssText = transition + '-duration:' + speed + 'ms;';
				}

				return true;
			}
		}
	}



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
		action(root, index, noanim, 'open');
	};

	akkordion.close = function (root, index, noanim) {
		action(root, index, noanim, 'close');
	};

	function action(root, index, noanim, method) {
		var inst, next;

		if(root) {
			for(i = registry.length - 1; i > -1; i--) if(registry[i].root === root) {
				inst = registry[i];

				if( ! Number.isInteger(index)) {
					if(next = inst.titleSet.indexOf(index) > -1) {
						index = next;
					} else if(next = inst.contentSet.indexOf(index) > -1) {
						index = next;
					}
				}

				return !! inst[method](Number(index), noanim);
			}
		}
	}


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
		name = 'data-' + PLUGIN_NAME + '-' + name;
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

	function getDataAttrs(el) {
		var attrs = el.attributes,
			prefix = 'data-' + PLUGIN_NAME + '-',
			i, name, val,
			result = {};

		for(i = attrs.length; i--; ) {
			name = attrs[i].name;
			val = attrs[i].value;
			if(name.indexOf(prefix) === 0) {
				result[name.substring(prefix.length)] =
					val === 'true' ? true :
					val === 'false' ? false :
					isNaN(val) ? val : Number(val);
			}
		}

		return result;
	}


}));
