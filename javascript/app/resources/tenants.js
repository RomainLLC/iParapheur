
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
}]);