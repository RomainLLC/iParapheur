

angular.module('appParapheur').factory('Annotations', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/dossiers/:idDossier/:idDocument/annotations/:id', {id: '@id', idDossier: '@idDossier', idDocument: '@idDocument'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        save: {
            method: 'POST',
            extend: true
        },
        remove: {
            method: 'DELETE'
        },
        update: {
            method: 'PUT'
        }
    });
}]);