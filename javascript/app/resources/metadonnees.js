

angular.module('appParapheur').factory('Metadonnees', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/metadonnees/:id/:action/:idaction', {id: '@id'}, {
        //Récupération de toutes les metadonnées (administration, ou non)
        list : {
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache : true
        },
        getWithTypo : {
            method : 'GET',
            cache : true,
            isArray : true
        },
        reload: {
            method: 'GET',
            action: true,
            params: {
                action: "reload"
            }
        },
        update: {
            method: 'PUT'
        }
    });
}]);