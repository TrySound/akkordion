# akkordion
VanillaJS Accordion Library

##Install

```
<<<<<<< HEAD
boewr i akkordion
=======
bower i akkordion
>>>>>>> master
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



##License

[The MIT License (MIT)](LICENSE)

Copyright &copy; 2015 Bogdan Chadkin
