

angular.module('appParapheur').factory('Archives', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/archives/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        destroy: {
            method: 'DELETE',
            action: true
        },
        rename: {
            method: 'POST'
        }
    });
}]);