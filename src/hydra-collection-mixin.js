var result = require('lodash.result');
var urlRoot = require('./url-root');

module.exports = {
    parse: function (data) {
        // replace @id property with hydra:view @id if it exists
        if (data['hydra:view']) {
            data['@id'] = data['hydra:view']['@id'];
        }

        // use @id property to update internal url
        if (data['@id'].indexOf('/') === 0) {
            this.url = urlRoot(result(this, 'url')) + data['@id'];
        } else {
            this.url = data['@id'];
        }

        // return results
        if (!data['@type']) {
            return [];
        } else if (data['@type'].indexOf("hydra:") === 0) {
            return data["hydra:member"];
        } else {
            return data.members;
        }
    },

    // Get or fetch a model by Id.
    getOrFetch: function (id, options, cb) {
        if (arguments.length !== 3) {
            cb = options;
            options = {};
        }

        var self = this;
        var model = this.get(id);

        if (model && !model.isEmpty()) {
            return setTimeout(cb.bind(null, null, model), 0);
        }

        if (options.all) {
            //preserve original `options.always`
            var always = options.always;
            options.always = function (err, resp, body) {
                if (always) {
                    always(err, resp, body);
                }
                if (!cb) {
                    return;
                }

                var model = self.get(id);
                var err2 = model ? null : new Error('not found');
                cb(err2, model);
            };
            return this.fetch(options);
        } else {
            return this.fetchById(id, options, cb);
        }
    },

    // fetchById: fetches a model and adds it to
    // collection when fetched.
    fetchById: function (id, options, cb) {
        if (arguments.length !== 3) {
            cb = options;
            options = {};
        }

        var self = this;
        var idObj = {};
        idObj[this.mainIndex] = id;
        var model = new this.model(idObj, {collection: this});

        //preserve original `options.success`
        var success = options.success;
        options.success = function (resp) {
            model = self.add(model, {merge: true});

            if (success) {
                success(self, resp, options);
            }
            if (cb) {
                cb(null, model);
            }
        };

        //preserve original `options.error`
        var error = options.error;
        options.error = function (collection, resp) {
            delete model.collection;

            if (error) {
                error(collection, resp, options);
            }

            if (cb) {
                var err = new Error(resp.rawRequest.statusText);
                err.status = resp.rawRequest.status;
                cb(err);
            }
        };

        return model.fetch(options);
    }
};