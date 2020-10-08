

angular.module('appParapheur').factory('Circuits', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/circuits/:id/:action/:idaction', {id: '@id'}, {
        //Récupération de tous les circuits (administration)
        list : {
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache: true
        },
        //Update de circuit
        update : {
            method : 'PUT',
            extend: true
        },
        getWithTypo : {
            method : 'GET',
            cache : true,
            params : { bureau : '@bureau' }
        },
        save: {
            method: 'POST',
            extend: true
        }
    });
}]);