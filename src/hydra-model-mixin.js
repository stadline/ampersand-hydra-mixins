module.exports = {
    idAttribute: '@id',
    typeAttribute: '@type',
    extraProperties: 'reject',

    url: function () {
        if (this["@id"]) {
            return this.urlRoot + this["@id"];
        } else {
            return null;
        }
    }
};