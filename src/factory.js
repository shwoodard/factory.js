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

  /**
   * @public
   *
   * This will cause the lib to throw an exception
   * if you try to do setDefault on feild before
   * calling `setFields`.
   *
   * Turn this off in your spec_helper if you prefer!
   */
  Factory.whiny = true

  Factory.prototype = {

    // Public
    /**
     * Call this first!  Set the fields that your
     * factory knows about.
     *
     * @param fields [Array] an array of strings
     *   indicating the fields for the factory
     */
    setFields: function (fields) {
      for (var i = 0; i < fields.length; i++) {
        this.fields[fields[i]] = {value: null};
      }
      this._fieldsSet = true;
    },

    /**
     * Configure a single fields default.  Allows
     * for creating sequences for fields.
     *
     * Sequences can be enabled like, with passing
     * `options.sequence` -> true.  This will result
     * in a simple integer incrementing value.
     *
     * Also, `options.sequence` can be a function.
     * The function receives the current count of
     * of the sequnce and then can return a calculated
     * value such as, `"Widget " + n`, where n is the
     * count passed into the callback.
     *
     * For simple string defaults (that don't change),
     * simply supply the string value and no options;
     * sequnce is the only currently supported option.
     *
     * @param field [Stirng] - the field name for which
     *   to set the default
     *
     * @param value [String|Integer] - if String, the
     *   static value for the factory's field value.
     *   if Integer and options.sequence, this will be
     *   the initial count value for the sequence,
     *   defaults to 1 (if null or undefined is passed)
     *
     * @param options [Object] - can elect for this factory
     *   field to be a sequence, e.g. {sequence: true}
     *
     */
    setDefault: function (field, value, options) {
      if (!this.fields[field]) {
        throw new Error('This field is not registered on the factory');
      }

      sequence = options && options.sequence || false;

      if(sequence) {
        this.fields[field].sequence = {};
        this.fields[field].sequence.value =
          value == 0 ? 0 : (value || 1);

        if(typeof sequence == "function") {
          this.fields[field].sequence.fn = sequence;
        }

        this._setValueForSequence(this.fields[field], field);
      } else {
        this.fields[field].value = value;
      }
    },

    /**
     * Return the current Factory snapshot as an object.
     *
     * @param options [Object] - overrides for defaults
     * @return [Object] - the Factory snapshot as an object
     */
    asObject: function (options) {
      options = options || {};

      if(Factory.whiny && !this._fieldsSet) {
        throw new Error('You must call setFields before generating factory instances');
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

    /**
     * Return the factory snapshot as a json string.
     *
     * @param options [Object] - overrides for defaults
     * @return [Object] - the Factory snapshot as a json
     *   string.
     */
    toJson: function (options) {
      return Factory.asJson(this.asObject.call(this, options));
    },

    //Private
    _setValueForSequence: function (value, field) {
      if(value.sequence.fn) {
        value.value = value.sequence.fn.call(this, value.sequence.value);
      } else {
        value.value = value.sequence.value;
      }
    }
  };

  // Public, Static
  /**
   * A utility method to convert factories Factory
   * snapshots fetched as objects to JSON
   *
   * @param object [Object] the object to be converted
   *   to string json
   * @return [String] the json value of the object.
   */
  Factory.asJson = function (object) {
    return JSON.stringify(object);
  }
})();
