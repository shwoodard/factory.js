/**
 * Factory.js
 *
 * Json factories allow you to build json programatically
 * for a variety of use cases.  For example, when using sinonjs
 * fakeServer (or similar) it becomes possible to generate json
 * to return from your fake XHR requests.
 *
 * Also, often you want to use json, with common attributes, more
 * than once in a test.  For example,
 *
 *    it("works", function () {
 *      widget = Factories.widget.toJson({name: "Widget 1"});
 *      ...
 *      // psuedo code
 *      // resondWith "POST", "/widgets", [201,{},widget]
 *      ...
 *      // psuedo code:
 *      // respondWith "GET", /\/widgets\/\d+/, [200, {}, widget]
 *    });
 *
 * This is help helpful because widget will have the same attributes,
 * such as `id`, for both POST and GET.
 */
(function () {
  /**
   * Construct a Factory.  Allows for configuration.
   *
   * @param name [String] - the name of the factory.
   * @param configFn [Function] - an optional callback.
   *   Receives the factory to be configured.
   */
  window.Factory = function (name, configFn) { 
    this._fieldsSet = false;
    this.fields = {};
    this.name = name;
    if (configFn) {
      configFn.call(this, this);
    }
  };

  Factory.whiny = true

  Factory.prototype = {
    setFields: function (fields) {
      for (var i = 0; i < fields.length; i++) {
        this.fields[fields[i]] = {value: null};
      }
      this._fieldsSet = true;
    },


    setDefault: function (field, value, options) {
      sequence = options && options.sequence || false;

      if(sequence) {
        this.fields[field].sequence = {};
        this.fields[field].sequence.value = value || 1;

        if(typeof sequence == "function") {
          this.fields[field].sequence.fn = sequence;
        }

        this._setValueForSequence(this.fields[field], field);
      } else {
        this.fields[field].value = value;
      }
    },

    asObject: function (options) {
      options = options || {};

      if(Factory.whiny && !this._fieldsSet) {
        throw new Error('You must call set fields before generating factory instances');
      }

      var fields = {};

      for (var field in this.fields) {
        if(this.fields.hasOwnProperty(field)) {
          fields[field] = options[field] || this.fields[field].value;

          // finally increment the sequece and set the new value
          if(this.fields[field].sequence) {
            this.fields[field].sequence.value++;
            this._setValueForSequence(this.fields[field], field);
          }
        }
      }

      return fields;
    },

    toJson: function (options) {
      return Factory.asJson(this.asObject.call(this, options));
    },

    _setValueForSequence: function (value, field) {
      if(value.sequence.fn) {
        value.value = value.sequence.fn.call(this, value.sequence.value);
      } else {
        value.value = value.sequence.value;
      }
    }
  };

  Factory.asJson = function (object) {
    return JSON.stringify(object);
  }
})();
