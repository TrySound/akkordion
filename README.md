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

##Options

`options.single` - collapse another on open

`options.speed` - animation duration

`options.opacity` - animate opacity

##Callbacks
```js
akkordion.on(event, cb);
```

###Events

- `init` - with every accordion-root element
- `abort` - when `beforeOpen` or `beforeClose` will return `false`
- `beforeOpen`
- `open`
- `afterOpen`
- `beforeClose`
- `close`
- `afterClose`



##License

[The MIT License (MIT)](LICENSE)

Copyright &copy; 2015 Bogdan Chadkin
