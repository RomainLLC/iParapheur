

angular.module('appParapheur').factory('Bureaux', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/bureaux/:id/:action/:idaction', {id: '@id'}, {
        //Récupération de tous les bureaux (administration)
        list : {
            params : { asAdmin : 'true' },
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            params : { asAdmin : 'true' },
            method : 'GET',
            isArray : true,
            cache: true
        },
        query : {
            method :"GET",
            isArray: true
        },
        //Update de bureau
        update : {
            method : 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        },
        remove: {
            method: 'DELETE'
        },
        associes: {
            method: 'GET',
            extend: true,
            params: {
                action: 'associes'
            }
        },
        associesAsAdmin: {
            method: 'GET',
            extend: true,
            params: {
                asAdmin: 'true',
                action: 'associes'
            }
        }
    });
}]);