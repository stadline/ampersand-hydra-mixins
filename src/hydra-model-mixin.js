var result = require('lodash.result');
var mapValues = require('lodash.mapvalues');
var assign = require('lodash.assign');
var forOwn = require('lodash.forown');
var urlRoot = require('./url-root');

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
    throw new Error('A "url" property or function must be specified');
};

module.exports = {
    idAttribute: '@id',
    typeAttribute: '@type',
    extraProperties: 'reject',

    parse: function (data) {
        return mapValues(data, function (value, key) {
            // transform children and collections properties
            if (key in this._children || key in this._collections) {
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
            res[key] = result(this[key], 'url');
        }.bind(this));

        forOwn(this._collections, function (value, key) {
            res[key] = result(this[key], 'url');
        }.bind(this));

        return res;
    },

    url: function () {
        if (this.isNew()) {
            return result(this.collection, 'url') || urlError();
        } else {
            var base = result(this, 'urlRoot') || urlError();
            return base + this.getId();
        }
    },

    urlRoot: function () {
        var collectionUrl = result(this.collection, 'url');

        if (collectionUrl) {
            return urlRoot(collectionUrl);
        }
    }
};