angular.module('appParapheur').factory('Xemelios', ['$resource', 'configuration', function ($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/connecteurs/xemelios/:action', {}, {
        get: {
            method: 'GET'
        },
        restart: {
            method: 'GET',
            action: true,
            params: {
                action: 'restart'
            }
        },
        status: {
            method: 'GET',
            params: {
                action: 'status'
            }
        }
    });
}]);