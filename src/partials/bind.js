
	function bind(el, options) {
		var self = this;
		self.root = el;
		self.options = extend({}, options, getDataAttrs(el));
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
			var self = this,
				root = self.root,
				mouseInst;

			on(root, 'mouseover', function (e) {
				var hover = self.options.hover;

				if(hover !== false) {
					mouseInst = setTimeout(function () {
						push(e);
					}, hover);
				}
			});

			on(root, 'mouseout', function (e) {
				clearTimeout(mouseInst);
			});

			on(root, 'click', push);

			on(root, transitionEnd, function (e) {
				var el = e.target,
					index;

				if(e.propertyName === 'height' && (index = self.outerSet.indexOf(el)) > -1) {
					attr(el, dataAnimating, null);
					if(attr(el, dataActive)) {
						el.style.cssText = 'height:auto;';
						trigger('afteropen', self, index);
					} else {
						el.style.cssText = '';
						trigger('afterclose', self, index);
					}

				}
			});

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
		},

		open: function (index, noAnim) {
			var self = this,
				outerSet = self.outerSet,
				options = self.options,
				speed = options.speed,
				height, i, outer;

			index = index === -1 ? outerSet.length - 1 : index;
			outer = outerSet[index];

			if( ! outer) {
				return false;
			}

			if(options.single) {
				for(i = outerSet.length - 1; i > -1; i--) if(i !== index) {
					self.close(i, noAnim);
				}
			}

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

				outer.style.height = 'auto';
				height = getComputedStyle(outer).height;
				if(height !== '0px') {
					attr(outer, dataAnimating, true);
					outer.style.height = 0;
					outer.offsetWidth;
					outer.style.cssText = 'height:' + height + ';' + transition + '-duration:' + speed + 'ms;';
				}

				trigger('open', self, index);
			}
		},

		close: function (index, noAnim) {
			var self = this,
				outerSet = self.outerSet,
				speed = self.options.speed;

			index = index === -1 ? outerSet.length - 1 : index;
			outer = outerSet[index];

			if( ! outer) {
				return false;
			}

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
				outer.style.cssText = transition + '-duration:' + speed + 'ms;';

				trigger('close', self, index);
			}
		}
	}
