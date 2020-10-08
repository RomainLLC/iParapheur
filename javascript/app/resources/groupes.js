

angular.module('appParapheur').factory('Groupes', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/groupes/:id/:user', {id: '@id', user: '@userToChange'}, {
        //Récupération de tous les groupes
        list : {
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache: true
        },
        getMembers : {
            method: 'GET',
            extend: true
        },
        addUser: {
            method: 'POST',
            action: true
        },
        removeUser: {
            method: 'DELETE',
            action: true
        },
        save: {
            method: 'POST',
            extend: true
        },
        saveSub: {
            method: 'POST'
        }
    });
}]);