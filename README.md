# Factory.js

A library that produces plain javascript objects or json.  Configure
your factory using sequences or static defaults and away you go.

## Creating a Factory

```js
var factory = new Factory("widget", function (config) {
  // set the fields that comprise the factory
  config.setFields(["id", "name", "description"]);

  // configure id to be an integer sequence
  config.setDefault("id", 1, {sequence: true});

  // configure name to be a custom sequence
  config.setDefault("name", 1, {sequence: function (n) {
    return "Widget " + n;
  }});

  // configure description with a static (string) default
  config.setDefault("description", "Lorem ipsum");
});
```

## Using your factory

### Retrieve current factory snapshot as a json string.

```js
var widgetJson = factory.toJson();
```

### Retrieve current factory snapshot as an object.

```js
var widgetData = factory.asObject();
```

### Using overrides

```js
var widgetJson = factory.toJson({name: "Purple Widget"})
// OR
var widgetData = factory.asObject({name: "Green Widget"})"
```

##  Converting object factory snapshot to json

```js
var widgetData = factor.asObject();
var widgetJson = Factory.asJson(widgetData);
```

## Dependencies

There are none unless you need json2.js polyfill.  It is included in the lib directory.

# Developing on factory.js
Fork us!

- You need Ruby.
- Bundle
- rake
- Make your changes
- Send a PR
