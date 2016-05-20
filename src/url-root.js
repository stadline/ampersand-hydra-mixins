module.exports = function (url) {
    var urlPattern = /(http|https):\/\/([\w\.-]+)\/.*/;
    var urlParts = url.match(urlPattern);

    if (urlParts) {
        return urlParts[1] + '://' + urlParts[2];
    } else {
        return "";
    }
};