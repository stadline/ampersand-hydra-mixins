var result = require('lodash.result');

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
    throw new Error('A "url" property or function must be specified');
};

module.exports = {
    idAttribute: '@id',
    typeAttribute: '@type',
    extraProperties: 'reject',

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
            var urlPattern = /(http|https):\/\/([\w\.-]+)\/.*/;
            var urlParts = collectionUrl.match(urlPattern);

            if (urlParts) {
                return urlParts[1] + '://' + urlParts[2];
            }
        }
    }
};