angular.module('appParapheur').factory('Cachets', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/seals/:id', {id: '@id'}, {
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
        getMailforwarn: {
            method: 'GET',
            params : {
                id : "mailforwarn"
            }
        },
        setMailforwarn: {
            method: 'POST',
            params : {
                id : "mailforwarn"
            }
        }
    });
}]);