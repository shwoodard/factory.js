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
      var self = this;
      options = options || {};

      if(Factory.whiny && !this._fieldsSet) {
        throw new Error('You must call set fields before generating factory instances');
      }

      var fields = {};

      for (var field in this.fields) {
        if(this.fields.hasOwnProperty(field)) {
          fields[field] = this.fields[field];
        }
      }

      for (var option in options) {
        if(options.hasOwnProperty(option)) {
          fields[option].value = options[option];
        }
      }

      for (var field in fields) {
        if(fields.hasOwnProperty(field)) {
          fields[field] = fields[field].value;
        }
      }

      for (var field in this.fields) {
        if (this.fields.hasOwnProperty(field)) {
          if(this.fields[field].sequence) {
            this.fields[field].sequence.value++;
            this._setValueForSequence(this.fields[field], field);
          }
        }
      }

      fields.json = function (overrides) {
        overrides = overrides || {};
        json = {}

        for (var field in fields) {
          if (fields.hasOwnProperty(field)) {
            json[field] = fields[field];
          }
        }

        for(var override in overrides) {
          if (overrides.hasOwnProperty(override)) {
            json[override] = overrides[override];
          }
        }

        return JSON.stringify(json);
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
