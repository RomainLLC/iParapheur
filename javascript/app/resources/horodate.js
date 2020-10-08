

angular.module('appParapheur').factory('Horodate', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/horodate', {}, {
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        }
    });
}]);