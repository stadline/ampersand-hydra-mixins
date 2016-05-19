module.exports = {
    parse: function (data) {
        if (data['@type'].indexOf("hydra:") === 0) {
            return data["hydra:member"];
        } else {
            return data.members;
        }
    }
};