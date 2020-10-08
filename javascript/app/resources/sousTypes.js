angular.module('appParapheur').factory('SousTypes', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/types/:parent/:id', {id: '@id', parent: '@parent'}, {
        //Update de types
        update : {
            method : 'PUT'
        }
    });
}]);