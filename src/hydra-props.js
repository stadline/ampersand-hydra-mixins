var assignIn = require('lodash.assignin');

module.exports = function (userProps) {
    return assignIn({
        '@context': ['string'],
        '@id': ['string'],
        '@type': ['string', false]
    }, userProps);
};