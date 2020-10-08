

angular.module('appParapheur').factory('Delegations', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/delegations/:id/:action/:idaction', {id: '@id'}, {
        //Récupération de toutes les délégations (administration)
        list : {
            params : { asAdmin : 'true' },
            method : 'GET',
            isArray : true
        },
        //Update de la délégation
        update : {
            method : 'PUT'
        },
        willItLoop: {
            method: 'POST',
            extend: true,
            params: {
                action : 'loop',
                idaction: '@idCible'
            }
        },
        titulaires: {
            method: 'GET',
            params: {
                action: 'titulaires'
            }
        }
    });
}]);