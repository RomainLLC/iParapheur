/**
 * User: lhameury
 * Date: 28/03/13
 * Time: 16:08
 */

var configurationModule = angular.module('configurationModule', []);

configurationModule.factory('configuration', ['$http', function($http) {
    //noinspection JSUnresolvedVariable
    var context = urlContext;
    var isAdminCircuits = false;
    var isAdminFonctionnel = false;
    var adminFonctionnel = [];
    var prop = properties;
    var theme = userTheme;
    var connexionType = connectionType;

    var buildTheme = function() {
        var result = [];
        var list = prop["parapheur.ihm.themes.disponibles"].split(",");
        for(var i = 0; i < list.length; i++) {
            var name = list[i].split("/");
            if(name.length > 1 && name[0] === tenantName) {
                result.push(list[i]);
            } else if(name.length === 1) {
                result.push(list[i]);
            }
        }
        return result;
    };

    var themes = buildTheme();

    $http.get(context + "/proxy/alfresco/parapheur/utilisateurs/infos").success(function(data) {
        isAdminCircuits = data.isGestionnaire;
        adminFonctionnel = data.administres;
        if(data.administres && data.administres.length > 0) {
            isAdminFonctionnel = true;
        }
        obj.id = data.id;
    });

    var obj = {
        theme: theme,
        properties : prop,
        fullname : fullname,
        username: currentUserId,
        connexionType: connexionType,
        tenant: tenantName,
        context: context,
        isAdmin: isAdmin,
        isAdminCircuits: function() {
            return isAdminCircuits;
        },
        isAdminFonctionnel: function() {
            return isAdminFonctionnel;
        },
        adminFonctionnel: function() {
            return adminFonctionnel;
        },
        isAdminFonctionnelOf: function(id) {
            return isAdminFonctionnel ? adminFonctionnel.indexOf(id) !== -1 : true;
        },
        setProperties: function(p) {
            prop = p;
        },
        isSecretaire : false,
        APIACCESS : context + "/proxy/alfresco/parapheur/api/",
        RESTACCESS: context + "/proxy/alfresco/parapheur/",
        ALFRESCO : context +  "/proxy/alfresco/api/",
        themes : themes,
        signNode : signId ? signId[signId.length-1] : ""
    };

    return obj;
}]);