
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
