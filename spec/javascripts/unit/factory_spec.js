describe("When using a Factory", function() {
  it("has a name", function() {
    var factory = new Factory("factoryName");
    expect(factory.name).toEqual("factoryName");
  });

  it("throws an error if you try to generate factory objects without setting fields", function() {
    var factory = new Factory("factory");
    expect(factory.asObject).toThrow(new Error('You must call set fields before generating factory instances'));
  });

  describe("configuration", function() {
    var factory = null;

    beforeEach(function() {
      factory = new Factory("factory", function(config) {
        config.setFields(["id", "name", "position"]);
      });
    });

    it("it's fields are configurable", function() {
      var factoryFields = jQuery.map(factory.fields, function (value, key) {
        return key;
      });
      factoryFields = factoryFields.sort();

      expect(factoryFields).toEqual(["id", "name", "position"]);
    });

    it("allows a default value", function() {
      factory.setDefault("name", "foo");
      expect(JSON.parse(factory.toJson())).toEqual({
        id: null,
        name: "foo",
        position: null
      });
    });

    it("allows a basic numerical sequence", function() {
      factory.setDefault("id", 1, true);
      jQuery.each([1, 2], function(i, times) {
        expect(JSON.parse(factory.toJson())).toEqual({
          id: times,
          name: null,
          position: null
        });
      });
    });

    it("allows a sequence with a custom funtion", function() {
      factory.setDefault("name", 1, function(n) {
        return "Foo " + n;
      });

      jQuery.each([1, 2], function(i, times) {
        expect(JSON.parse(factory.toJson())).toEqual({
          id: null,
          name: "Foo " + times,
          position: null
        });
      });
    });
  });

  describe("with a configured factory", function() {
    var factory = null;

    beforeEach(function() {
      factory = new Factory("factory", function(config) {
        config.setFields(["id", "name", "position"]);
        config.setDefault("id", 1, true);
        config.setDefault("name", 1, function(n) {
          return "Story " + n;
        });
        config.setDefault("position", 1, true);
      });
    });

    it("allows you to pass in overrides", function() {
      expect(JSON.parse(factory.toJson({
        id: 4
      }))).toEqual({
        id: 4,
        name: "Story 1",
        position: 1
      });

      expect(JSON.parse(factory.toJson({
        name: "Foo"
      }))).toEqual({
        id: 2,
        name: "Foo",
        position: 2
      });

      expect(JSON.parse(factory.toJson({
        position: 11
      }))).toEqual({
        id: 3,
        name: "Story 3",
        position: 11
      });

      expect(JSON.parse(factory.toJson())).toEqual({
        id: 4,
        name: "Story 4",
        position: 4
      });
    });

    describe("when you get the factory as an object", function() {
      var factoryAsObject = null;

      beforeEach(function() {
        factoryAsObject = factory.asObject();
      });

      it("is an object and the asObject property is not included", function() {
        var typeOfFactoryAsObject = typeof factoryAsObject;
        expect(typeOfFactoryAsObject).toEqual("object");
      });
      it("you can get the json even if you ask for it as an object", function() {
        var typeOfJson = typeof factoryAsObject.json();
        expect(typeOfJson).toEqual("string");
      });
      return it("and you can override the json", function() {
        expect(JSON.parse(factoryAsObject.json())).toEqual(JSON.parse(factoryAsObject.json()));
        expect(JSON.parse(factoryAsObject.json({
          name: "Bas"
        }))).not.toEqual(JSON.parse(factoryAsObject.json()));
      });
    });
  });
});

