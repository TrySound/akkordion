
	function bind(el, options) {
		this.root = el;
		this.options = extend({}, options, getDataAttrs(el, dataPrefix));
		this.cache();
		this.setDefaultState();
		this.bindEvents();
		trigger('init', this);
	};

	bind.prototype = {
		cache: function () {
			var root = this.root,
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

			this.titleSet = titleSet;
			this.outerSet = outerSet;
			this.contentSet = contentSet;
		},

		setDefaultState: function () {
			var titleSet = this.titleSet,
				outerSet = this.outerSet,
				contentSet = this.contentSet,
				i, max, outer, content,
				single = this.options.single,
				initSingle = false;

			for(i = 0, max = titleSet.length; i < max; i++) {
				outer = outerSet[i];
				(content = contentSet[i]).style.height = 'auto';

				// States
				if(content.className.indexOf(PLUGIN_NAME + '-active') > -1 && (single && ! initSingle || ! single)) {
					initSingle = true;
					attr(titleSet[i], dataActive, true);
					attr(outer, dataActive, true);
					attr(content, dataActive, true);
				} else {
					outer.style.height = 0;
				}
			}
		},

		bindEvents: function () {
			var self = this;

			on(this.root, 'click', function (e) {
				var title = e.target,
					index = self.titleSet.indexOf(title),
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
							for(i = self.outerSet.length -1; i > -1; i--) if(i !== index) {
								self.close(i);
							}
						}
					}
				}
			});

			on(this.root, transitionEnd, function (e) {
				var el = e.target,
					prop = e.propertyName,
					index, title, content;

				if(prop === 'height' && (index = self.outerSet.indexOf(el)) > -1) {
					attr(el, dataAnimating, null);
					if(attr(el, dataActive)) {
						el.style.cssText = 'height:auto;';
						trigger('open', self, index);
						trigger('afteropen', self, index);
					} else {
						el.style.cssText = 'height:0;';
						trigger('close', self, index);
						trigger('afterclose', self, index);
					}

				}
			});
		},

		open: function (index, noAnim) {
			var outer = this.outerSet[index],
				content = this.contentSet[index],
				options = this.options,
				opacity = options.opacity ? 'height:auto;opacity:' : false,
				speed = options.speed,
				transitionDuration = transition + '-duration:' + speed + 'ms;',
				transitionDelay = transition + '-delay:' + speed / 2 + 'ms;',
				height;

			if( ! transition || noAnim || speed === 0) {
				if( ! trigger('beforeopen', this, index)) {
					trigger('abort', this, index);
					return;
				}

				setActive(this, index, true);
				outer.style.cssText = 'height:auto;';

				trigger('open', this, index);
				trigger('afteropen', this, index);

			} else if( ! attr(outer, dataAnimating) && ! attr(outer, dataActive)) {
				if( ! trigger('beforeopen', this, index)) {
					trigger('abort', this, index);
					return;
				}

				setActive(this, index, true);
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
			var outer = this.outerSet[index],
				content = this.contentSet[index],
				options = this.options,
				opacity = options.opacity ? 'height:auto;opacity:' : false,
				speed = options.speed,
				transitionDuration = transition + '-duration:' + speed + 'ms;',
				transitionDelay = transition + '-delay:' + speed / 3 + 'ms;';

			if( ! transition || noAnim || speed === 0) {
				if( ! trigger('beforeclose', this, index)) {
					trigger('abort', this, index);
					return;
				}

				setActive(this, index, false);
				outer.style.cssText = 'height:0;';

				trigger('close', this, index);
				trigger('afterclose', this, index);

			} else if( ! attr(outer, dataAnimating) && attr(outer, dataActive)) {
				if( ! trigger('beforeclose', this, index)) {
					trigger('abort', this, index);
					return;
				}

				setActive(this, index, false);
				attr(outer, dataAnimating, true);

				outer.style.height = getComputedStyle(outer).height;
				outer.offsetHeight;
				outer.style.cssText = 'height:0;' + transitionDuration + (opacity ? transitionDelay : '');

				if(opacity) {
					content.style.cssText = opacity + '1;';
					outer.offsetWidth;
					content.style.cssText = opacity + '0;' + transitionDuration;
				}
			}
		}
	}
