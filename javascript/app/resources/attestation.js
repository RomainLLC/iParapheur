

angular.module('appParapheur').factory('Attestation', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/attestation', {}, {
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        }
    });
}]);