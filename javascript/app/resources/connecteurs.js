

angular.module('appParapheur').factory('Connecteurs', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/connecteurs/:tdt/:type/:action', {type:'@type', tdt:'@tdt'}, {
        testConfig : {
            method : 'POST',
            params: {
                action: 'testConfig',
                type: ''
            }
        },
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        },
        info: {
            method : 'GET',
            params: {
                tdt: 's2low',
                type: 'actes',
                action: 'info'
            }
        },
        classifications: {
            method: 'GET',
            params: {
                tdt: 's2low',
                type: 'actes',
                action:"classifications"
            }
        }
    });
}]);