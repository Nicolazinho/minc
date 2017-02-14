angular.module('app.directives', ['ngSanitize'])

.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "href onClick=\"window.open('$1', '_system', 'location=yes');return false;\"");
        return $sce.trustAsHtml(newString);
    }
});