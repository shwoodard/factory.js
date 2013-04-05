# Factory.js

A library that produces plain javascript objects or json.  Configure
your factory using sequences or static defaults and away you go.

## Creating a Factory

### Js

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

  // configure description with a static (string) default)
  config.setDefault("description", "Lorem ipsum");
});
```

### Coffee

```coffee
factory = new Factory "widget", (config) ->
  config.setFields ["id", "name", "description"]
  config.setDefault "id", 1, {sequence: true}
  config.setDefault "name", 1,
    sequence: (n) ->
      return "Widget " + n;
  config.setDefault "description", "Lorem ipsum"
```
