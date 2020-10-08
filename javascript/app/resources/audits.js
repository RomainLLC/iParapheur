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
}]);