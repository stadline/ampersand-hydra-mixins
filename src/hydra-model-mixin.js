var result = require('lodash.result');
var mapValues = require('lodash.mapvalues');
var assign = require('lodash.assign');
var forOwn = require('lodash.forown');
var isEmpty = require('lodash.isempty');

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
    throw new Error('A "url" property or function must be specified');
};

module.exports = {
    isHydra: true,

    idAttribute: '@id',
    extraProperties: 'reject',

    isEmpty: function () {
        return isEmpty(this.getAttributes({props: true}, true));
    },

    parse: function (data) {
        return mapValues(data, function (value, key) {
            // transform children and collections properties
            if (typeof value === 'string' && (key in this._children || key in this._collections)) {
                return {'@id': value};
            } else {
                return value;
            }
        }.bind(this));
    },

    serialize: function (options) {
        var attrOpts = assign({props: true}, options);
        var res = this.getAttributes(attrOpts, true);

        forOwn(this._children, function (value, key) {
            if (this[key].isHydra) {
                res[key] = result(this[key], 'getId');
            } else {
                res[key] = this[key].serialize();
            }
        }.bind(this));

        forOwn(this._collections, function (value, key) {
            if (this[key].isHydra) {
                res[key] = result(this[key], 'getId');
            } else {
                res[key] = this[key].serialize();
            }
        }.bind(this));

        return res;
    },

    url: function () {
        if (this.isNew()) {
            return result(this.collection, 'url') || undefined;
        } else {
            var base = result(this, 'urlRoot');
            return base + this.getId();
        }
    }
};
