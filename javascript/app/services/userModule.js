/**
 * User: lhameury
 * Date: 28/03/13
 * Time: 17:13
 */
/*jslint browser: true*/
/*global localStorage, $, angular, console*/

var userModule = angular.module('userModule', []);

userModule.factory('navigationService', ["Bureaux", "$rootScope", function (Bureaux, $rootScope) {
    "use strict";
    var idStorage = "ip-navigation",
        obj = {
            isLoggedIn: true,
            corbeille : "a-traiter",
            bureauCourant : {},
            dossierCourant : {},
            dash: {
                hasNext: false,
                hasPrev: false,
                //Champ de tri sélectionné
                currentChamp: "cm:created",
                //Tri ascendant ou descendant
                ascBase: false,
                skipped: [0],
                pendingNumber: [0],
                currentPage : 0,
                filter : ""
            },
            archives: {
                hasNext: false,
                hasPrev: false,
                //Champ de tri sélectionné
                currentChamp: "cm:created",
                //Tri ascendant ou descendant
                ascBase: false,
                skipped: [0],
                currentPage : 0,
                filter : ""
            },
            currentFilter : {
                types: [],
                subtypes: [],
                metadonnees: []
            },
            currentFilterArchive : {},
            hasToSetDefaultFilter: true,
            hasToReset : false
        },
        tmpStr = localStorage[idStorage],
        tmp = tmpStr !== undefined ? $.parseJSON(tmpStr) : null;
    if (tmp !== null) {
        $.extend(obj, tmp);
        if (obj.bureauCourant.id) {
            Bureaux.query(function (result) {
                var idToFind = obj.bureauCourant.id,
                    i;
                for (i = 0; i < result.length; i++) {
                    if (result[i].id === idToFind) {
                        obj.bureauCourant = result[i];
                        $rootScope.currentBureau = result[i];
                        break;
                    }
                }
            });
        }
    }

    $(window).on('beforeunload', function () {
        if (obj.hasToReset) {
            localStorage.removeItem(idStorage);
        } else {
            localStorage[idStorage] = JSON.stringify(obj);
        }
    });
    return obj;
}]).factory('preferences', ['configuration', '$http', '$translate', function (configuration, $http, $translate) {
    "use strict";
    var idStorage = "ip-preferences",
        api = {
            CHANGEPASS  : configuration.ALFRESCO + "person/changepassword/" + configuration.username,
            PREFS       : configuration.ALFRESCO + "people/" + configuration.username + "/preferences"
        },
        paths = {
            base: "org.adullact.iparapheur",
            LANG : {
                path : "language"
            },
            THEME : {
                path : "theme"
            },
            DISDELEG : {
                path : "displayDelegation"
            },
            FILTERDEFAULT: {
                path : "filterDefault"
            },
            DASHLETS : {
                path : "dashletsPosition",
                remove : true
            },
            VIEWXEM: {
                path : "viewXemelios"
            },
            PAGESIZE : {
                path : "pagesize"
            },
            COLDASH : {
                path : "enabledColumns",
                remove : true
            },
            PAGESIZEARCH : {
                path : "pagesizeArchives"
            },
            COLARCH : {
                path : "enabledColumnsArchives",
                remove : true
            },
            CRON : {
                path : "notifications",
                remove : true
            },
            BUREAUXORDER : {
                path : "bureauxOrder"
            },
            COLORATION : {
                path : "coloration",
                remove : true
            },
            FILTERS: {
                path : "savedFilters"
            },
            ASC: {
                path: "asc"
            },
            PROPSORT: {
                path: "propSort"
            }
        },
        prefs = {
            //Les preferences sont-elles celles par defaut
            isDefault: true,
            //Langue préférée
            language: "fr",
            //Taille des résultats de la liste des dossiers, 10 par defaut
            pagesize: 10,
            //Taille des résultats de la liste des dossiers, 10 par defaut
            pagesizeArchives: 10,
            //Affichage des délégations, vrai par défaut
            displayDelegation: true,
            //tri par défaut
            propSort: "cm:title",
            //Filtre par défaut
            filterDefault: "",
            //Tri ascendant
            asc: true,
            //Colonnes à afficher sur le dashboard - ici valeurs par defaut. 6 champs maximums
            enabledColumns: {
                c0: "title",
                c1: "actionDemandee",
                c2: "type",
                c3: "bureauName",
                c4: "dateLimite",
                c5: "dateEmission",
                c6: "banetteName"
            },
            enabledColumnsArchives: {
                c0: "title",
                c1: "creator",
                c2: "type",
                c3: "created",
                c4: "telechargements"
            },
            dashletsPosition: {
                right: {
                    c0: {
                        name: "nom-dossier",
                        show: "true"
                    },
                    c1: {
                        name: "circuit",
                        show: "true"
                    },
                    c2: {
                        name: "details-dossier",
                        show: "true"
                    },
                    c3: {
                        name: "postit",
                        show: "true"
                    },
                    c4: {
                        name: "annotindex",
                        show: "true"
                    },
                    c5: {
                        name: "annoter",
                        show: "true"
                    },
                    c6: {
                        name: "annotations",
                        show: "true"
                    }
                },
                left: {
                    c0: {
                        name: "liste-dossiers",
                        show: "true"
                    }
                }
            },
            //Theme de l'utilisateur
            theme: "default",
            //Filtres sauvegardés
            savedFilters: {},
            //Notifications
            notifications: {
                enabled: true,
                dailydigest: {
                    enabled: false
                },
                digest: {
                    cron: "0 0/10 * * * ?"
                },
                mail: "",
                mode: "always"
            },
            coloration : "[]"
        },
        init = false,
        tmpStr = localStorage[idStorage],
        tmp = tmpStr !== undefined ? $.parseJSON(tmpStr) : null,
        extendDeep = function extendDeep(dst) {
            angular.forEach(arguments, function (obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function (value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extendDeep(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        },
        correctDoubleColumn = function() {
            var orderedColumn = {};
            Object.keys(prefs.enabledColumns).sort().forEach(function(key) {
                orderedColumn[key] = prefs.enabledColumns[key];
            });

            var array = $.map(orderedColumn, function(value, index) {
                return [value];
            });
            var uniqueCols = [];
            $.each(array, function(i, el){
                if($.inArray(el, uniqueCols) === -1) uniqueCols.push(el);
            });
            prefs.enabledColumns =  {};
            $.each(uniqueCols, function(i, el) {
                prefs.enabledColumns["c" + i] = el;
            });
        },
        initPreferences = function (success) {
            if (prefs.isDefault && !init) {
                $http.get(api.PREFS).success(function (resp) {
                    try {
                        var notifs = prefs.notifications;
                        /** On sait que cela existe... Au pire, exception
                         * @namespace resp.org.adullact.iparapheur */
                        if (resp.org.adullact.iparapheur.notifications) {
                            extendDeep(prefs.notifications, resp.org.adullact.iparapheur.notifications);
                            notifs = prefs.notifications;
                        }
                        angular.extend(prefs, resp.org.adullact.iparapheur);
                        prefs.notifications = notifs;
                        prefs.isDefault = false;
                        $translate.use(prefs.language);
                        correctDoubleColumn();
                    } catch (e) {
                        console.log(e);
                        //Preferences non initialisé, récupération de celles par défault
                    } finally {
                        if (typeof success === 'function') {
                            success(prefs);
                        }
                        init = true;
                    }
                });
            } else {
                $translate.use(prefs.language);
                if (typeof success === 'function') {
                    success(prefs);
                }
            }
            return prefs;
        },
        /**
         * Permet de changer de mot de passe
         * @param {String} oldPassword Ancien mot de passe
         * @param {String} newPassword Nouveau mot de passe
         */
        ret = {},
        changePassword = function (oldPassword, newPassword) {
            angular.copy({}, ret);
            var params = {
                "userName": configuration.username,
                "oldpw": oldPassword,
                "newpw": newPassword
            };
            $http.post(api.CHANGEPASS, params).success(function (resp) {
                angular.copy(resp, ret);
            }).error(function () {
                angular.copy({error: true}, ret);
            });
            return ret;
        },
        removeProperty = function (key, success) {
            $http["delete"](api.PREFS + "?pf=" + paths.base + "." + key).success(function () {
                if (typeof success === "function") {
                    success();
                }
            });
        },
        //Considéré comme instantané
        changeProperty = function (key, value, success) {
            var change = function () {
                var params = {};
                params[paths.base + "." + key.path] = value;
                prefs[key.path] = value;
                $http.post(api.PREFS, params).success(success);
            };
            if (key.remove) {
                removeProperty(key.path, change);
            } else {
                change();
            }
        },
        saveFilter = function (name, value) {
            var params = {};
            params[paths.base] = {};
            params[paths.base][paths.FILTERS.path] = {};
            params[paths.base][paths.FILTERS.path][name.replace(/-/g, '')] = JSON.stringify(value);
            prefs.savedFilters[name.replace(/-/g, '')] = JSON.stringify(value);
            $http.post(api.PREFS, params);
        },
        removeFilter = function (key, success) {
            delete prefs.savedFilters[key];
            $http["delete"](api.PREFS + "?pf=" + paths.base + ".savedFilters." + encodeURIComponent(key)).success(function () {
                if (typeof success === "function") {
                    success();
                }
            });
        };

    if (tmp !== null) {
        init = true;
        if (tmp.enabledColumns) {
            prefs.enabledColumns = {};
        }
        $.extend(prefs, tmp);
    }

    $(window).on('beforeunload', function () {
        localStorage[idStorage] = JSON.stringify(angular.copy(prefs));
    });

    return {
        paths : paths,
        changeProperty : changeProperty,
        initPreferences : initPreferences,
        changePassword : changePassword,
        saveFilter: saveFilter,
        removeFilter: removeFilter,
        removeProperty: removeProperty
    };
}]);