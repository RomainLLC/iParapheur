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
}]);