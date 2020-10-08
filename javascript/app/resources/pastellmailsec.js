angular.module('appParapheur').factory('PastellMailsec', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/pastell-connector/api/server/:id/:action/:idDoc/:action2', {id: '@id'}, {
        get: {
            method: 'GET'
        },
        list : {
            method : 'GET',
            isArray : true
        },
        update: {
            method: 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        },
        listEntities: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'entities'
            }
        },
        listTypes: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'types'
            }
        },
        events: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'document',
                action2: 'journal'
            }
        }
    });
}]);