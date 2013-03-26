(function () {
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
      var self = this;
      jQuery.each(fields, function (i, field) {
        self.fields[field] = {value: null};
      });
      this._fieldsSet = true;
    },


    setDefault: function (field, value, sequence) {
      sequence = sequence || false;

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
      var self = this;
      options = options || {};

      if(Factory.whiny && !this._fieldsSet) {
        throw new Error('You must call set fields before generating factory instances');
      }

      var fields = jQuery.extend(true, {}, this.fields);

      jQuery.each(options, function (option, value) {
        fields[option].value = value;
      });

      jQuery.each(fields, function (option, value) {
        fields[option] = value.value;
      });

      jQuery.each(this.fields, function (option, value) {
        if (value.sequence) {
          value.sequence.value++;
          self._setValueForSequence(value, option);
        }
      });

      fields.json = function (overrides) {
        overrides = overrides || {};
        return JSON.stringify(jQuery.extend({}, fields, overrides));
      };
      
      return fields;
    },

    toJson: function (options) {
      options = options || {};
      return this.asObject.call(this, options).json();
    },

    _setValueForSequence: function (value, field) {
      if(value.sequence.fn) {
        value.value = value.sequence.fn.call(this, value.sequence.value);
      } else {
        value.value = value.sequence.value;
      }
    }
  };
})();
