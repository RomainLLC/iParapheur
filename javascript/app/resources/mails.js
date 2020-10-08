

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
}]);