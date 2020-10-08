

angular.module('appParapheur').factory('Types', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/types/:id/:action/:idaction', {id: '@id'}, {
        //Récupération de tous les types (administration)
        list : {
            method : 'GET',
            isArray : true,
            params : { asAdmin : 'true' }
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache: true,
            params : { asAdmin : 'true' }
        },
        query : {
            method : 'GET',
            isArray : true
            //,cache : true
        },
        queryWithBureau : {
            method : 'GET',
            isArray : true,
            params : { bureau : '@bureau' }
        },
        //Update de types
        update : {
            method : 'PUT'
        },
        getOverrideActes: {
            method: 'GET',
            extend: true,
            params: { action: 'overrideActes' }
        },
        overrideActes: {
            method: 'PUT',
            action: true,
            params: { action: 'overrideActes' }
        },
        getOverrideHelios: {
            method: 'GET',
            extend: true,
            params: { action: 'overrideHelios' }
        },
        overrideHelios: {
            method: 'PUT',
            action: true,
            params: { action: 'overrideHelios' }
        },
        getOverrideSig: {
            method: 'GET',
            extend: true,
            params: { action: 'overrideSig' }
        },
        overrideSig: {
            method: 'PUT',
            action: true,
            params: { action: 'overrideSig' }
        },
        getOverridePades: {
            method: 'GET',
            extend: true,
            params: { action: 'overridePades' }
        },
        overridePades: {
            method: 'PUT',
            action: true,
            params: { action: 'overridePades' }
        }
    });
}]);