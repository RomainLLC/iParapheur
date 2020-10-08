angular.module('appParapheur').factory('PastellConnector', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/pastell/mailsec/:action/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        save: {
            method: 'POST',
            extend: true
        },
        infos: {
            method: 'GET',
            extend: true,
            params: {
                action: 'node'
            }
        }
    });
}]);