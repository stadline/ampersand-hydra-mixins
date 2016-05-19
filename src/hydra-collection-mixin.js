module.exports = {
    parse: function (data, options) {
        console.log("parse collection", data, options);

        return data["hydra:member"];
    }
};