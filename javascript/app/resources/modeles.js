

angular.module('appParapheur').factory('Modeles', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/modeles/:id/:action', {id: '@id'}, {
        //Récupération de toutes les metadonnées (administration, ou non)
        list: {
            method: 'GET',
            isArray: true
        },
        get: {
            method: 'GET',
            extend: true
        },
        set: {
            method: 'PUT'
        },
        reload: {
            method: 'GET',
            action: true,
            params: {
                action: 'reload'
            }
        }
    });
}]);