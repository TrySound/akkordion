# akkordion
VanillaJS Accordion Library

##Why?

- No flash on page load
- Initialize by class name and data-* attributes
- Graceful Degradation for non-transition browsers
- Could be nested
- No need jQuery or other dependencies


##Install

```
bower i akkordion
```


##Usage

Use `.akkordion` className for initialize

Add `.akkordion-active` className to content element to make it active at start. Note: any will be active even with option `single:true`

P.S.: Recommend do not use vertical paddings on content to prevent flashing on start

```html
<html>
<head>
	<link rel="stylesheet" href="bower_copmonents/akkordion/dist/akkordion.css">
</head>
<body>

	<div class="akkordion" data-akkordion-single="true" data-akkordion-speed="400">
		<div class="akkordion-title">Title</div>
		<div class="akkordion-content akkordion-active"><p>Content</p></div>

		<div class="akkordion-title">Title</div>
		<div class="akkordion-content"><p>Content</p></div>

		...
	</div>

	<script src="bower_copmonents/akkordion/dist/akkordion.js"></script>
</body>
</html>
```

or you may init custom elements

```js
akkordion(selector, options);
```

##Effects

Add to root element this classes

- `.akkordion-fade` - for opacity animation
- `.akkordion-shiftX` - to move 100px horizontally
- `.akkordion-shiftY` - to move 30px vertically

*Effects are inheritable*


##Options

- `options.single` - collapse another on open
- `options.speed` - animation duration (ms)
- `options.hover` - hover delay (ms) or false to disable

##Methods

- `root` - HTMLElement initialized by akkordion
- `index` is index of valid (with title and content) item. Could be equal `-1` for last. Also could be equal one of title or content elements.
- `noAnim` - prevent height animation (don't prevent effects)
- `return true` if index exists else `false`

```js
// Open content
akkordion.open(root, index, noAnim);
// Close content
akkordion.close(root, index, noAnim);
// Event listener
akkordion.on(event, callback);
```

####Events

- `init` - with every accordion-root element
- `beforeOpen` - prevent openning if return `false`
- `open`
- `afterOpen`
- `beforeClose` - prevent closing if return `false`
- `close`
- `afterClose`



##License

[The MIT License (MIT)](LICENSE)

Copyright &copy; 2015 Bogdan Chadkin
