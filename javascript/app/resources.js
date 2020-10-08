

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
}]);;


angular.module('appParapheur').factory('Archives', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/archives/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        destroy: {
            method: 'DELETE',
            action: true
        },
        rename: {
            method: 'POST'
        }
    });
}]);;


angular.module('appParapheur').factory('Attestation', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/attestation', {}, {
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        }
    });
}]);;
angular.module('appParapheur').factory('Audits', ['$resource', 'configuration', function ($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/audit/:type', {}, {
        tempsTraitement: {
            method: 'GET',
            params: {
                type: "tempsTraitement"
            }
        },
        crees: {
            method: 'GET',
            params: {
                type: "dossiersCrees"
            }
        },
        emis: {
            method: 'GET',
            params: {
                type: "dossiersEmis"
            }
        },
        emisRefuses: {
            method: 'GET',
            params: {
                type: "dossiersEmisRefuses"
            }
        },
        instruits: {
            method: 'GET',
            params: {
                type: "dossiersInstruits"
            }
        },
        refuses: {
            method: 'GET',
            params: {
                type: "dossiersRefuses"
            }
        },
        traites: {
            method: 'GET',
            params: {
                type: "dossiersTraites"
            }
        },
        retard: {
            method: 'GET',
            params: {
                type: "dossiersEnRetard"
            }
        },
        causesRejet: {
            isArray: true,
            method: 'GET',
            params: {
                type: "causesRejet"
            }
        }
    });
}]);;


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
}]);;
angular.module('appParapheur').factory('Cachets', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/seals/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        update: {
            method: 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        },
        getMailforwarn: {
            method: 'GET',
            params : {
                id : "mailforwarn"
            }
        },
        setMailforwarn: {
            method: 'POST',
            params : {
                id : "mailforwarn"
            }
        }
    });
}]);;
angular.module('appParapheur').factory('Calques', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/calques/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        listWithCache : {
            method : 'GET',
            isArray : true,
            cache: true
        },
        update: {
            method: 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        }
    });
}]);

angular.module('appParapheur').factory('SubCalques', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/calques/:idCalque/:type/:id', {id: '@id', type: '@type', idCalque: '@idCalque'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        save: {
            method: 'POST',
            extend: true
        }
    });
}]);;


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
}]);;


angular.module('appParapheur').factory('Connecteurs', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/connecteurs/:tdt/:type/:action', {type:'@type', tdt:'@tdt'}, {
        testConfig : {
            method : 'POST',
            params: {
                action: 'testConfig',
                type: ''
            }
        },
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        },
        info: {
            method : 'GET',
            params: {
                tdt: 's2low',
                type: 'actes',
                action: 'info'
            }
        },
        classifications: {
            method: 'GET',
            params: {
                tdt: 's2low',
                type: 'actes',
                action:"classifications"
            }
        }
    });
}]);;


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
}]);;
angular.module('appParapheur').factory('Dossiers', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/dossiers/:id/:action/:idaction/:complementary', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        listAsAdmin : {
            method : 'GET',
            isArray : true,
            params: {
                asAdmin: true
            }
        },
        consecutiveSteps : {
            method : 'GET',
            extend : true,
            params : {
                action : "consecutiveSteps"
            }
        },
        attest : {
            method : 'POST',
            action : true,
            params : {
                action : 'attest'
            }
        },
        visa : {
            method : 'POST',
            action : true,
            params : {
                action : 'visa'
            }
        },
        signature : {
            method : 'POST',
            action : true,
            params : {
                action : 'signature'
            }
        },
        seal : {
            method : 'POST',
            action : true,
            params : {
                action : 'seal'
            }
        },
        getSignInfo : {
            method : 'GET',
            extend : true,
            params : {
                action : 'getSignInfo'
            }
        },
        tdtHelios : {
            method : 'POST',
            action : true,
            params : {
                action : 'tdtHelios'
            }
        },
        tdtActes : {
            method : 'POST',
            action : true,
            params : {
                action : 'tdtActes'
            }
        },
        archive : {
            method : 'POST',
            action : true,
            params : {
                action : 'archive'
            }
        },
        rejet : {
            method : 'POST',
            action : true,
            params : {
                action : 'rejet'
            }
        },
        secretariat : {
            method : 'POST',
            action : true,
            params : {
                action : 'secretariat'
            }
        },
        remorse : {
            method : 'POST',
            action : true,
            params : {
                action : 'remorse'
            }
        },
        annexes : {
            method: 'GET',
            extend : true,
            params : {
                action : 'annexes'
            }
        },
        getSecureMailTemplate : {
            method : 'GET',
            cache : true,
            extend : true,
            params : {
                action : 'getSecureMailTemplate'
            }
        },
        avis : {
            method : 'POST',
            action : true,
            params : {
                action : 'avis'
            }
        },
        chain : {
            method : 'POST',
            action : true,
            params : {
                action : 'chain'
            }
        },
        merge : {
            method : 'POST',
            action : true,
            params : {
                action : 'merge'
            }
        },
        getCircuitWithTypo : {
            method : 'POST',
            params : {
                action : 'circuit'
            }
        },
        transfertSignature: {
            method : 'POST',
            action : true,
            params : {
                action: 'transfertSignature'
            }
        },
        transfertVisa : {
            method : 'POST',
            action : true,
            params : {
                action : 'transfertVisa'
            }
        },
        notifications : {
            method : 'GET',
            extend : true,
            params : {
                action : 'notifications'
            }
        },
        setNotifications : {
            method : 'PUT',
            action : true,
            params : {
                action : 'setNotifications'
            }
        },
        getCircuit : {
            method : 'GET',
            extend : true,
            params : {
                action : 'circuit'
            }
        },
        update : {
            method : 'PUT',
            extend : true
        },
        setProperties : {
            method : 'POST',
            action : true,
            params : {
                action : 'setProperties'
            }
        },
        setCircuit : {
            method : 'POST',
            action : true,
            params : {
                action : 'setCircuit'
            }
        },
        removeDocument : {
            method : 'POST',
            action : true,
            params : {
                action : 'removeDocument'
            }
        },
        evenements : {
            method : 'GET',
            extend : true,
            params : {
                action : 'evenements'
            }
        },
        raz : {
            method : 'POST',
            action : true,
            params : {
                action : 'raz'
            }
        },
        destroy: {
            method: 'DELETE',
            action: true,
            params: {
                action: 'destroy'
            }
        },
        transfert: {
            method: 'POST',
            action: true,
            params: {
                action: 'transfert'
            }
        },
        mailsec: {
            method: 'POST',
            action: true,
            params: {
                action: 'mailsec'
            }
        },
        secureMailTemplate: {
            method: 'GET',
            extend: true,
            params: {
                action: 'secureMailTemplate'
            }
        },
        infosMailSec: {
            method: 'GET',
            extend: true,
            params: {
                action: 'infosMailSec'
            }
        },
        status: {
            method: 'GET',
            extend: true,
            params: {
                action: 'status'
            }
        },
        properties: {
            method: 'GET',
            extend: true,
            params: {
                action: 'properties'
            }
        },
        addSignature: {
            method: 'POST',
            action: true,
            params: {
                action: 'addSignature'
            }
        },
        signPapier: {
            method: 'POST',
            action: true,
            params: {
                action: 'signPapier'
            }
        },
        bestBureau: {
            method: 'GET',
            params: {
                action: 'bestBureau'
            }
        },
        unlock : {
            method : 'POST',
            action : true,
            params : {
                action : 'unlock'
            }
        }
    });
}]);;


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
}]);;


angular.module('appParapheur').factory('Horodate', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/horodate', {}, {
        set: {
            method : 'PUT'
        },
        get: {
            method : 'GET'
        }
    });
}]);;


angular.module('appParapheur').factory('Mails', ['$resource', 'configuration', function($resource, configuration) {

    return $resource(configuration.context + '/proxy/alfresco/parapheur/mails/:type', {},  {
        //Envoi de dossiers par mail
        dossiers : {
            method : 'POST',
            params : {
                type : "dossiers"
            }
        }
    });
}]);;


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
}]);;


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
}]);;


angular.module('appParapheur').factory('Office', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/connecteurs/office/:action', {}, {
        get: {
            method : 'GET'
        },
        restart: {
            method : 'GET',
            action : true,
            params : {
                action : 'restart'
            }
        },
        status: {
            method: 'GET',
            params: {
                action: 'status'
            }
        }
    });
}]);;
angular.module('appParapheur').factory('PastellConnector', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/pastell/mailsec/:action/:id', {id: '@id'}, {
        list : {
            method : 'GET',
            isArray : true
        },
        save: {
            method: 'POST',
            extend: true
        },
        infos: {
            method: 'GET',
            extend: true,
            params: {
                action: 'node'
            }
        }
    });
}]);;
angular.module('appParapheur').factory('PastellMailsec', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/pastell-connector/api/server/:id/:action/:idDoc/:action2', {id: '@id'}, {
        get: {
            method: 'GET'
        },
        list : {
            method : 'GET',
            isArray : true
        },
        update: {
            method: 'PUT'
        },
        save: {
            method: 'POST',
            extend: true
        },
        listEntities: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'entities'
            }
        },
        listTypes: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'types'
            }
        },
        events: {
            method: 'GET',
            isArray: true,
            params: {
                action: 'document',
                action2: 'journal'
            }
        }
    });
}]);;
angular.module('appParapheur').factory('SousTypes', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/types/:parent/:id', {id: '@id', parent: '@parent'}, {
        //Update de types
        update : {
            method : 'PUT'
        }
    });
}]);;

angular.module('appParapheur').factory('Tenants', ['$resource', 'configuration', function($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/mc/:tenantDomain/:action', {tenantDomain: '@tenantDomain'}, {
        list: {
            method: 'GET',
            isArray: true
        },
        get: {
            method: 'GET',
            extend: true
        },
        isEnabled: {
            method: 'GET',
            params : {
                action : 'enabled'
            }
        },
        details: {
            method: 'GET',
            extend: true,
            params : {
                action : 'details'
            }
        },
        update : {
            method : 'PUT'
        },
        enable : {
            method : 'POST',
            params : {
                action : 'enable'
            }
        },
        changePassword: {
            method: 'POST',
            params: {
                action: 'changepassword'
            }
        },
        getPesProperties: {
            method: 'GET',
            extend: true,
            params: {
                action: 'pes'
            }
        },
        updatePesProperties: {
            method: 'POST',
            params: {
                action: 'pes'
            }
        },
        reloadMail: {
            method: 'GET',
            action: true,
            params: {
                action: 'reloadTenantEmails'
            }
        }
    });
}]);;


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
}]);;


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
}]);;
angular.module('appParapheur').factory('Xemelios', ['$resource', 'configuration', function ($resource, configuration) {
    return $resource(configuration.context + '/proxy/alfresco/parapheur/connecteurs/xemelios/:action', {}, {
        get: {
            method: 'GET'
        },
        restart: {
            method: 'GET',
            action: true,
            params: {
                action: 'restart'
            }
        },
        status: {
            method: 'GET',
            params: {
                action: 'status'
            }
        }
    });
}]);