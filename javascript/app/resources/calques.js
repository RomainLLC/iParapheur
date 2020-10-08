angular.module('appParapheur').factory('Calques', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/calques/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache: true
        },
        update: {
            method: 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        }
    });
}]);

angular.module('appParapheur').factory('SubCalques', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/calques/:idCalque/:type/:id', {id: '@id', type: '@type', idCalque: '@idCalque'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        save: {
            method: 'POST',
            extend: true
        }
    });
}]);