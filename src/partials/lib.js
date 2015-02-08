
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
