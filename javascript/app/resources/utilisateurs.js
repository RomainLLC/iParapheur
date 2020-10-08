

angular.module('appParapheur').factory('Users', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/utilisateurs/:id/:resource/:resourceId', {id: '@id'}, {

        //Update d'utilisateur
        update : {
            method : 'PUT'
        },

        listWithCache: {
            method: 'GET',
            isArray: true,
            cache: true
        },

        save: {
            method: 'POST',
            extend: true
        },
        // Dissocier un utilisateur d'un bureau
        deleteBureau : {
            method : 'DELETE',
            params : {
                resource : 'bureaux',
                isProprietaire:true
            }
        },

        //Associer un utilisateur à un bureau
        saveBureau : {
            method : 'POST',
            params : {
                resource : 'bureaux',
                isProprietaire:true
            }
        },

        getBureaux : {
            method : 'GET',
            isArray : true,
            extend : true,
            extendParameter : "bureaux",
            params : {
                resource : 'bureaux',
                administres:false
            }
        },

        getBureauxAdministres : {
            method : 'GET',
            isArray : true,
            extend : true,
            extendParameter : "bureauxAdministres",
            params : {
                resource : 'bureaux',
                administres:true
            }
        },

        getCertificatDetails : {
            method : 'POST',
            isArray : false,
            params : {
                resource : 'certificats',
                resourceId : 'details'
            }
        },

        removeFromGroup : {
            method : 'DELETE',
            params : {
                resource : 'groups'
            }
        },

        saveNotificationsPreferences : {
            method : 'PUT',
            params : {
                resource : 'notifications'
            }
        }
    });
}]);