var isEmpty = require('lodash.isempty');

module.exports = {
    parse: function (data) {
        if (data['@type'].indexOf("hydra:") === 0) {
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

        if (model && !isEmpty(model.getAttributes({props: true}, true))) {
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