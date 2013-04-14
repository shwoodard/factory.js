describe("When using a Factory", function() {
  it("has a name", function() {
    var factory = new Factory("factoryName");
    expect(factory.name).toEqual("factoryName");
  });

  it("throws an error if you try to generate factory objects without setting fields", function() {
    var factory = new Factory("factory");
    expect(factory.asObject).toThrow(new Error('You must call setFields before generating factory instances'));
  });

  it("throws an error if you try to set a default on an unregistered field", function() {
    var factory = new Factory("factory");
    expect(function(){factory.setDefault("bad")}).toThrow(new Error('This field is not registered on the factory'));
  });

  describe("configuration", function() {
    var factory = null;

    beforeEach(function() {
      factory = new Factory("factory", function(config) {
        config.setFields(["id", "name", "position"]);
      });
    });

    it("it's fields are configurable", function() {
      var factoryFields = _.map(factory.fields, function (value, key) {
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

    describe("sequences", function () {

      it("allows a basic numerical sequence", function() {
        factory.setDefault("id", 1, {sequence: true});
        _.each([1, 2], function(times) {
          expect(JSON.parse(factory.toJson())).toEqual({
            id: times,
            name: null,
            position: null
          });
        });
      });

      it("allows a sequence with a custom funtion", function() {
        factory.setDefault("name", 1, {sequence: function(n) {
          return "Foo " + n;
        }});

        _.each([1, 2], function(times) {
          expect(JSON.parse(factory.toJson())).toEqual({
            id: null,
            name: "Foo " + times,
            position: null
          });
        });
      });

      it("allows zero to be the seed value for the sequence", function () {
        factory.setDefault("position", 0, {sequence: true});

        expect(factory.asObject().position).toEqual(0);
      });
    });
  });

  describe("with a configured factory", function() {
    var factory = null;

    beforeEach(function() {
      factory = new Factory("factory", function(config) {
        config.setFields(["id", "name", "position"]);
        config.setDefault("id", 1, {sequence: true});
        config.setDefault("name", 1, {sequence: function(n) {
          return "Story " + n;
        }});
        config.setDefault("position", 1, {sequence: true});
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

      it("you can use Factory.asJson to convert the object to json string", function() {
        var typeOfJson = typeof Factory.asJson(factoryAsObject);
        expect(typeOfJson).toEqual("string");
      });
    });
  });
});

