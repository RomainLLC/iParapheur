//noinspection JSUnresolvedFunction
/**
 * User: lhameury
 * Date: 20/03/13
 * Time: 14:08
 */


//TODO : Séparer les modules (userModule, bureauModule)
var baseModule = angular.module('baseModule', []);

baseModule.factory('baseService', ['$window', '$rootScope', '$http', function($window, $rootScope, $http) {
    //Initialisation
    //noinspection JSUnresolvedVariable
    var data = {
        //Objet initialisé ?
        isInit: false,
        //user admin ?
        isAdmin : isAdmin,
        //Propriétaire d'un seul parapheur = redirection
        ownOneParapheur: false,
        //Nom complet de l'utilisateur
        fullName: undefined,
        //Nom de login de l'utilisateur
        loginName: undefined,
        //Bureau courant de l'utilisateur
        currentBureau: undefined,
        //Dossier courant de l'utilisateur
        currentFolder: undefined,
        //Si l'utilisateur est secretaire
        isSecretaire: false,
        //Id du nodeRef de l'image de signature
        signId: "",
        //Preferences utilisateur
        preferences: {
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
            //Colonnes à afficher sur le dashboard - ici valeurs par defaut. 6 champs maximums
            enabledColumns: {
                c0: "titre",
                c1: "actionDemandee",
                c2: "type",
                c3: "parapheurCourant",
                c4: "dateLimite",
                c5: "dateEmission",
                c6: "banetteCourante"
            },
            enabledColumnsArchives: {
                c0: "titre",
                c1: "archivepar",
                c2: "type",
                c3: "dateCreation",
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
                enabled: false,
                dailydigest: {
                    enabled: false
                },
                digest: {
                    cron: "0 0/10 * * * ?"
                }
            },
            cron: {
                enabled: false,
                values: ["1", "7", "1"],
                canSelect: ["notifs-hours", "notifs-quotidien", "notifs-hebdo"],
                selected: ""
            }
        },
        //urlContext
        urlContext: undefined,
        //Constantes ajax
        ajaxHelper: {
            BASEPREF: "/proxy/alfresco/api/people/",
            ENDPREF: "/preferences",
            URLPASS: "/proxy/alfresco/api/person/changepassword/",
            PATHFILTER: "org.adullact.iparapheur.savedFilters"
        },
        //Nom de la clé sur le localStorage
        STORAGEKEY: "ParapheurUser"
    };

    var BESTBUREAU = "/proxy/alfresco/parapheur/api/getBestBureauForDossier";

    var findBestBureau = function(nodeRef) {
        //Requete ajax
        $http.post(data.urlContext + BESTBUREAU,
            {
                "username": data.loginName,
                "dossier" : nodeRef
            }
        ).success(function(resp) {
                //Récupération du flag de secretariat
                data.isSecretaire = resp.secretaire;
                if(data.bureau) {
                    data.setCurrentBureau(getBureau(resp.bureau));
                }
                $rootScope.$broadcast('bureauModule.findBestBureau.success');
            }
        ).error(function() {
                $rootScope.$broadcast('bureauModule.findBestBureau.error');
            }
        );
    };

    /**
     * Initialisation de l'utilisateur, avec son nom et son login, suivi de l'urlContext
     */
    var init = function () {
        data.isInit = true;
        //Récupération des préférences utilisateur dès l'initialisation de l'objet
        getPreferences();
        //ObjectLoaded est un tableau des objets chargés ou initialisés
//        objectLoaded.push(data);
    };
    /**
     * Permet la récupération des préférences. Si non défini, les récuperer via ajax
     */
    var getPreferences = function () {
        //Les preferences sont celles par defaut
        if (data.preferences.isDefault) {
            var url = data.urlContext + data.ajaxHelper.BASEPREF + data.loginName + data.ajaxHelper.ENDPREF;
            //Recupération des préférences
            $http.get(url).success(function(resp) {
                //noinspection JSUnresolvedVariable
                if (resp.hasOwnProperty("org") && resp.org.hasOwnProperty("adullact") &&
                    resp.org.adullact.hasOwnProperty("iparapheur")) {
                    //noinspection JSUnresolvedVariable
                    var prefs = resp.org.adullact.iparapheur;
                    //Sauvegarde des preferences dans l'object actuel
                    data.preferences.pagesize = (prefs.pagesize !== undefined) ? prefs.pagesize : data.preferences.pagesize;
                    data.preferences.pagesizeArchives = (prefs.pagesizeArchives !== undefined) ? prefs.pagesizeArchives : data.preferences.pagesizeArchives;
                    data.preferences.displayDelegation = (prefs.displayDelegation !== undefined) ? prefs.displayDelegation : data.preferences.displayDelegation;
                    data.preferences.theme = (prefs.theme !== undefined) ? prefs.theme : data.preferences.theme;
                    if (prefs.enabledColumns !== undefined) {
                        //6 colonnes maximum
                        for (var i = 0; i < 6; i++) {
                            data.preferences.enabledColumns["c" + i] = prefs.enabledColumns["c" + i];
                        }
                    }
                    if (prefs.enabledColumnsArchives !== undefined) {
                        //5 colonnes maximum
                        for (i = 0; i < 5; i++) {
                            data.preferences.enabledColumnsArchives["c" + i] = prefs.enabledColumnsArchives["c" + i];
                        }
                    }
                    if (prefs.dashletsPosition !== undefined) {
                        data.preferences.dashletsPosition = prefs.dashletsPosition;
                    }
                    //Filtres
                    if (prefs.savedFilters !== undefined) {
                        $.each(prefs.savedFilters, function (index, value) {
                            data.preferences.savedFilters[index] = {};
                            data.preferences.savedFilters[index].types = [];
                            data.preferences.savedFilters[index].subtypes = [];
                            try {
                                $.extend(data.preferences.savedFilters[index], $.parseJSON(value));
                            } catch (e) {
                                console.error("Can't handle filter " + index);
                                console.error(value);
                            }
                        });
                    }
                    data.preferences.language = (prefs.language !== undefined) ? prefs.language : data.preferences.language;
                    //Notifications
                    if (prefs.hasOwnProperty("notifications")) {
                        if (prefs.notifications.hasOwnProperty("digest") && prefs.notifications.digest.hasOwnProperty("cron")) {
                            data.preferences.notifications.digest.cron = prefs.notifications.digest.cron;
                        }
                        if (prefs.notifications.hasOwnProperty("dailydigest") && prefs.notifications.dailydigest.hasOwnProperty("enabled")) {
                            data.preferences.notifications.dailydigest.enabled = prefs.notifications.dailydigest.enabled;
                            data.preferences.notifications.enabled = prefs.notifications.enabled;
                        }
                        cronHandler.init();
                    }
                }
                //Sauvegarde de l'objet
                data.preferences.isDefault = false;
                //Objet Initialisé
                $rootScope.$broadcast('userModule.getPreferences.success');
            }).error(function() {
                $rootScope.$broadcast('userModule.getPreferences.error');
            });
        }
        //Retour
        return data.preferences;
    };
    /**
     * Force la récupérations des préférences
     */
    var updatePreferences = function () {
        data.preferences.isDefault = true;
        return getPreferences();
    };
    /**
     * Sauvegarde des preferences
     */
    var savePreferences = function () {
        cronHandler.saveCronConfig();
        var url = data.urlContext + data.ajaxHelper.BASEPREF + data.loginName + data.ajaxHelper.ENDPREF;
        $.each(data.preferences.savedFilters, function (index, value) {
            data.preferences.savedFilters[index] = JSON.stringify(value);
        });
        $http.post(url,
            {
                "org.adullact.iparapheur": data.preferences
            }
        ).success(function() {
                $.each(data.preferences.savedFilters, function (index) {
                    data.preferences.savedFilters[index] = $.parseJSON(data.preferences.savedFilters[index]);
                });
                $rootScope.$broadcast('userModule.savePreferences.success');
            }
        ).error(function() {
                $rootScope.$broadcast('userModule.savePreferences.error');
            }
        );
    };
    /**
     * Permet de changer de mot de passe
     * @param {String} oldPassword Ancien mot de passe
     * @param {String} newPassword Nouveau mot de passe
     */
    var changePassword = function (oldPassword, newPassword) {
        var params = {
                "userName": data.loginName,
                "oldpw": oldPassword,
                "newpw": newPassword
            },
            url = data.urlContext + data.ajaxHelper.URLPASS + data.loginName;
        $http.post(url, params).success(function() {
                $rootScope.$broadcast('userModule.changePassword.success');
            }).error(function() {
                $rootScope.$broadcast('userModule.changePassword.error');
            }
        );
    };
    /**
     * Definition du bureau actuel
     * @param {Bureau} bureau
     */
    var setCurrentBureau = function (bureau) {
        data.currentBureau = bureau;
    };
    /**
     * Permet la sauvegarde d'un filtre
     * @param {filter} filter Objet Filtre
     * @param {String} name Nom du filtre à sauvegarder
     */
    var saveFilter = function (filter, name) {
        var savedFilters = {},
            url = data.urlContext + data.ajaxHelper.BASEPREF + data.loginName + data.ajaxHelper.ENDPREF;
        delete filter.name;
        savedFilters[name] = JSON.stringify(filter);
        data.preferences.savedFilters[name] = {};
        data.preferences.savedFilters[name].types = [];
        data.preferences.savedFilters[name].subtypes = [];
        $.extend(data.preferences.savedFilters[name],filter);
        $http.post(url,
            {
                "org.adullact.iparapheur.savedFilters": savedFilters
            }
        ).success(function() {

                $rootScope.$broadcast('userModule.saveFilter.success');
            }
        ).error(function() {
                $rootScope.$broadcast('userModule.saveFilter.error');
            }
        );
    };
    /**
     * Permet la suppresion d'un filtre
     * @param {String} name Nom du filtre à supprimer
     */
    var removeFilter = function (name) {
        var url = data.urlContext + data.ajaxHelper.BASEPREF + data.loginName + data.ajaxHelper.ENDPREF;
        if (name !== "custom") {
            delete data.preferences.savedFilters[name];
            $http['delete'](url+"?pf=org.adullact.iparapheur.savedFilters." + name).success(function() {
                    $rootScope.$broadcast('userModule.removeFilter.success');
                }
            ).error(function(){
                    $rootScope.$broadcast('userModule.removeFilter.error');
                }
            );
        }
    };
    /**
     * Enregistre la position des dashlets. Attention, il faut d'abord supprimer l'objet dans les préférences
     */
    var saveDashletsPosition = function (dashRight, dashLeft) {
        var url = data.ajaxHelper.BASEPREF + data.loginName + data.ajaxHelper.ENDPREF;
        delete data.preferences.dashletsPosition.right;
        delete data.preferences.dashletsPosition.left;
        $http['delete'](url).success(function() {
                data.preferences.dashletsPosition.right = dashRight;
                data.preferences.dashletsPosition.left = dashLeft;
                savePreferences();
                $rootScope.$broadcast('userModule.saveDashletsPosition.success');
            }
        ).error(function() {
                $rootScope.$broadcast('userModule.saveDashletsPosition.error');
            }
        );
    };
    /**
     * Handler de gestion du cron utilisateur
     * @type {{init: Function, toData: Function, toString: Function, saveCronConfig: Function}}
     */
    var cronHandler = {
        /**
         * Initialise l'objet cron à partir des préférences utilisateur
         */
        init: function () {
            this.toData(data.preferences.notifications.digest.cron);
            data.preferences.cron.enabled = data.preferences.notifications.dailydigest.enabled;
        },
        /**
         * Transforme un cron en string en objet cron, trouve le radio séléctionné entre les 3 possibles
         * @param {String} cron String représentant la fréquence d'appel
         */
        toData: function (cron) {
            var cronData = cron.split(" ");
            var index, value;
            if (cronData[5] !== "?") {
                index = 2;
                value = cronData[5];
            } else if (cronData[2].indexOf("/") === -1) {
                index = 1;
                value = cronData[2];
            } else if (cronData[2].indexOf("/") !== -1) {
                index = 0;
                value = cronData[2].split("/")[1];
            }
            data.preferences.cron.selected = data.preferences.cron.canSelect[index];
            data.preferences.cron.values[index] = value;
        },
        toString: function () {
            var cronStr = "0 0 ";
            if (data.preferences.cron.selected === data.preferences.cron.canSelect[0]) {
                cronStr += "0/" + data.preferences.cron.values[0] + " * * ?";
            } else if (data.preferences.cron.selected === data.preferences.cron.canSelect[1]) {
                cronStr += data.preferences.cron.values[1] + " * * ?";
            } else if (data.preferences.cron.selected === data.preferences.cron.canSelect[2]) {
                cronStr += "7 ? * " + data.preferences.cron.values[2];
            }
            return cronStr;
        },
        saveCronConfig: function () {
            data.preferences.notifications.enabled = data.preferences.cron.enabled;
            data.preferences.notifications.dailydigest.enabled = data.preferences.cron.enabled;
            data.preferences.notifications.digest.cron = this.toString();
        }
    };
    var setInfo = function(fullName, currentUserId, urlContext) {
        data.fullName = fullName;
        data.loginName = currentUserId;
        data.urlContext = urlContext;
        init();
    };

    //noinspection JSUnresolvedVariable
    setInfo(fullname, currentUserId, urlContext);

    return $.extend(data, {
        showFilters : false,
        findBestBureau : findBestBureau,
        setInfo : setInfo,
        setCurrentBureau : setCurrentBureau,
        getPreferences : getPreferences,
        updatePreferences : updatePreferences,
        savePreferences : savePreferences,
        changePassword : changePassword,
        saveFilter : saveFilter,
        removeFilter : removeFilter,
        saveDashletsPosition : saveDashletsPosition,
        initCron : cronHandler.init,
        toStringCron : cronHandler.toString,
        toDataCron : cronHandler.toData,
        saveCronConfig : cronHandler.saveCronConfig
    });
}]).factory('i18nService', ['$rootScope', 'baseService', function($rootScope, baseService) {
    var isInit = false;
    // Correction
    var doI18n = function() {
        var lang = baseService.preferences.language;
        $.i18n.init({
            lng: lang,
            ns: { namespaces: ['ns.special'], defaultNs: 'ns.special'},
            resGetPath: urlContext+'/res/locales/__lng__/__ns__.json',
            useLocalStorage: false
        }, function() {
            $rootScope.$broadcast("i18n.init.success");
            isInit = true;
        });
    };
    doI18n();
    var apply = function(element, attrs) {
        var kind = attrs.kind;
        var count = attrs.count ? attrs.count : 0;
        var placement = attrs.placement ? attrs.placement : "bottom";
        var attr = attrs.attr ? attrs.attr : "title";
        if(kind === "tooltip") {
            //Delete the previous tooltip
            $(element).tooltip('destroy');
            $(element)
                .attr("title", $.t(attrs.i18n, {
                    count: count
                }))
                .tooltip({placement: placement});
        } else if (kind === "attr") {
            $(element)
                .attr(attr, $.t(attrs.i18n, {
                    count: count
                }));
        } else {  //HTML
            $(element)
                .html($.t(attrs.i18n, {
                    count: count
                }));
        }
    };
    var applyI18n = function(element, attrs) {
        if(isInit) {
            apply(element, attrs);
        } else {
            $rootScope.$on("i18n.init.success", function() {
                apply(element, attrs);
            });
        }
    };
    return {
        isInit : isInit,
        apply : applyI18n
    }
}]);;
/**
 * Created by lhameury on 05/02/15.
 */


var cacheModule = angular.module('cacheModule', []);

cacheModule.factory('cache', ["$q", "Bureaux", "Metadonnees", "Types", "Groupes", "Calques", "Users", function($q, Bureaux, Metadonnees, Types, Groupes, Calques, Users) {
    var bureauxList = [];
    var metaList = {
        true: [],
        false: []
    };
    var typesList = [];
    var groupesList = [];
    var calquesList = [];
    var usersList = [];

    return {
        bureaux: {
            list: function() {
                var deferred = $q.defer();
                if(bureauxList.length === 0) {
                    bureauxList = Bureaux.list(function() {
                        deferred.resolve(bureauxList);
                    });
                } else {
                    deferred.resolve(bureauxList);
                }
                return deferred.promise;
            }
        },
        metadonnees: {
            list: function(asAdmin) {
                var deferred = $q.defer();
                if(metaList[asAdmin].length === 0) {
                    metaList[asAdmin] = Metadonnees.list({asAdmin: asAdmin}, function() {
                        deferred.resolve(metaList[asAdmin]);
                    });
                } else {
                    deferred.resolve(metaList[asAdmin]);
                }
                return deferred.promise;
            },
            forceReload: function() {
                metaList = {
                    true: [],
                    false: []
                };
            }
        },
        calques: {
            list: function() {
                var deferred = $q.defer();
                if(calquesList.length === 0) {
                    calquesList = Calques.list(function() {
                        deferred.resolve(calquesList);
                    });
                } else {
                    deferred.resolve(calquesList);
                }
                return deferred.promise;
            }
        },
        types: {
            list: function() {
                var deferred = $q.defer();
                if(typesList.length === 0) {
                    typesList = Types.list(function() {
                        deferred.resolve(typesList);
                    });
                } else {
                    deferred.resolve(typesList);
                }
                return deferred.promise;
            }
        },
        groupes: {
            list: function() {
                var deferred = $q.defer();
                if(groupesList.length === 0) {
                    groupesList = Groupes.list(function() {
                        deferred.resolve(groupesList);
                    });
                } else {
                    deferred.resolve(groupesList);
                }
                return deferred.promise;
            }
        },
        users: {
            list: function() {
                var deferred = $q.defer();
                if(usersList.length === 0) {
                    usersList = Users.query({search:""}, function() {
                        deferred.resolve(usersList);
                    });
                } else {
                    deferred.resolve(usersList);
                }
                return deferred.promise;
            }
        }
    }
}]);;
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
}]);;
;
/**
 * User: lhameury
 * Date: 20/03/13
 * Time: 14:06
 */

//Service for view construction
var viewModule = angular.module('viewModule', []);
viewModule.factory('viewService', ['preferences', 'Metadonnees', function(prefs, Metadonnees) {
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return !(a.indexOf(i) > -1);});
    };
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }


    var possibleColumns = [{
        key: "cm:title",
        value : "title",
        i18n : 'Name',
        disabled : true
    }, {
        value : "actionDemandee",
        i18n : "State"
    }, {
        key: "ph:typeMetier",
        value : "type",
        i18n : "Type"
    }, {
        value : "bureauName",
        i18n : "CurrentBureau"
    }, {
        key: "ph:dateLimite",
        value : "dateLimite",
        i18n : "LimitDate"
    }, {
        key: "cm:creator",
        value : "creator",
        i18n : "Creator"
    }, {
        key: "cm:created",
        value : "dateEmission",
        i18n : "Emit"
    }, {
        value : "banetteName",
        i18n : "CurrentBanette"
    }, {
        value : "visual",
        i18n: "Visual"
    }, {
        value: "emitby",
        i18n: "EmitBureau"
    }];

    var possibleColumnsArchive = [{
        key: "cm:title",
        value : "title",
        i18n : "Name",
        disabled : true
    }, {
        key: "cm:creator",
        value : "creator",
        i18n : "ArchivedBy"
    }, {
        key: "ph:typeMetier",
        value : "type",
        i18n : "Type"
    }, {
        key: "cm:created",
        value : "created",
        i18n : "Created"
    }, {
        value : "telechargements",
        i18n : "Download"
    }];

    var getDashboardColumns = function(enCol, f) {
        var enabled = [];
        return Metadonnees.list(function(data) {
            var possibleColumnMeta = angular.copy(possibleColumns);
            $.each(data, function(index, value) {
                possibleColumnMeta.push({
                    key: value.id,
                    value : "cu:" + value.id,
                    i18n : value.name,
                    type: value.type
                })
            });
            if(enCol) {
                var count = 0;
                var i;
                for (i in enCol) {
                    if (enCol.hasOwnProperty(i)) {
                        count++;
                    }
                }
                var col = [];
                for(var j = 0; j < count; j++) {
                    col.push(enCol["c"+j]);
                }
                $.each(col, function(index, value) {
                    //Patch migration de préférences 4.1 > 4.2
                    value = value === "titre" ? "title" : value;
                    value = value === "parapheurCourant" ? "bureauName" : value;
                    //ENDPATCH
                    $.each(possibleColumnMeta, function(vindex, walue) {
                        if(value === walue.value) {
                            enabled.push(walue);
                        }
                    });
                });
            } else {
                enabled.push(possibleColumnMeta[0]);
            }
            var disabled = possibleColumnMeta.diff(enabled);
            f({
                enabled : enabled,
                disabled : disabled
            });
        });
    };

    var getArchiveColumns = function(enCol, f) {
        var enabled = [];
        return Metadonnees.list({type:"",sousType:""}).$promise.then(function(data) {
            var possibleColumnMeta = angular.copy(possibleColumnsArchive);
            $.each(data, function(index, value) {
                possibleColumnMeta.push({
                    key: value.id,
                    value : value.id,
                    i18n : value.name
                })
            });
            if(enCol) {
                $.each(enCol, function(index, value) {
                    //Patch migration de préférences 4.1 > 4.2
                    value = value === "titre" ? "title" : value;
                    value = value === "archivepar" ? "creator" : value;
                    value = value === "dateCreation" ? "created" : value;
                    //ENDPATCH
                    $.each(possibleColumnMeta, function(vindex, walue) {
                        if(value === walue.value) {
                            enabled.push(walue);
                        }
                    });
                });
            } else {
                enabled.push(possibleColumnMeta[0]);
            }
            var disabled = possibleColumnMeta.diff(enabled);
            f({
                enabled : enabled,
                disabled : disabled
            });
        });
    };

    var toSaveColumns = function(enCol) {
        var toSave = {};
        var added = [];
        $.each(enCol, function(index, value) {
            //Si la valeur de la colonne n'est pas déjà renseignée
            if(!~added.indexOf(value.value)) {
                toSave["c"+index] = value.value;
                added.push(value.value);
            }
        });
        return toSave;
    };

    var extractCron = function(cronStr) {
        var cronData = cronStr.split(" ");
        return {
            hourly : cronData[2].split("/")[1] && cronData[2].split("/")[1] !== "*" ? cronData[2].split("/")[1] : "1",
            daily : cronData[2].split("/")[0] && cronData[2].split("/")[0] !== "*" ? cronData[2].split("/")[0] : "7",
            weekly : cronData[5] && cronData[5] !== "?" && cronData[5] !== "null" ? cronData[5] : "1"
        }
    };

    var buildCron = function(type, value) {
        if(type === "hourly") {
            return "0 0 0/" + value + " * * ?";
        } else if (type === "daily") {
            return "0 0 " + value + " * * ?";
        } else if (type === "weekly") {
            return "0 0 7 ? * " + value;
        }
        return "0 0 7 ? * 1";
    };

    var getCronMode = function(cronStr) {
        var cronData = cronStr.split(" ");
        if(cronData[2].split("/")[1]) {
            return "hourly";
        } else if (cronData[5] !== "?" && cronData[5] !== "null") {
            return "weekly";
        }
        return "daily";
    };

    var toPrefCron = function(digest, cron, selected) {
        /*
         notifications: {
         enabled: false,
         dailydigest: {
         enabled: false
         },
         digest: {
         cron: "0 0/10 * * * ?"
         }
         }
         */
        var cronStr = buildCron(selected, cron[selected]);
        return {
            enabled : (digest === "true"),
            dailydigest : {
                enabled : (digest === "true")
            },
            digest : {
                cron : cronStr
            }
        }
    };

    var corbeillesList = {};
    angular.copy({
        secretariat: "app.dashboard.filters.files.arelire",
        "en-preparation": "app.dashboard.filters.files.enpreparation",
        "a-traiter": "app.dashboard.filters.files.atraiter",
        "a-archiver": "app.dashboard.filters.files.aarchiver",
        "retournes": "app.dashboard.filters.files.retournes",
        "en-cours": "app.dashboard.filters.files.encours",
        "a-venir": "app.dashboard.filters.files.avenir",
        "traites": "Traités",
        "recuperables": "app.dashboard.filters.files.recuperables",
        "en-retard": "app.dashboard.filters.files.enretard",
        "a-imprimer": "app.dashboard.filters.files.aimprimer",
        "dossiers-delegues": "app.dashboard.filters.files.delegues",
        "no-corbeille": "app.dashboard.filters.files.allCorbeilles",
        "no-bureau": "app.dashboard.filters.files.allBureaux"
    }, corbeillesList);

    var corbeillesListFilter = [];

    corbeillesListFilter.push({key: "a-traiter", value: "À traiter"});
    corbeillesListFilter.push({key: "en-preparation", value: "À transmettre"});
    corbeillesListFilter.push({key: "a-venir", value: "À venir"});
    corbeillesListFilter.push({key: "en-cours", value: "En cours"});
    corbeillesListFilter.push({key: "dossiers-delegues", value: "En délégation"});
    corbeillesListFilter.push({key: "a-archiver", value: "En fin de circuit"});
    corbeillesListFilter.push({key: "en-retard", value: "En retard"});
    corbeillesListFilter.push({key: "recuperables", value: "Récupérables"});
    corbeillesListFilter.push({key: "retournes", value: "Rejetés"});
    corbeillesListFilter.push({key: "traites", value: "Traités"});

    corbeillesListFilter.push({key: "no-corbeille", value: "Toutes les bannettes"});
    corbeillesListFilter.push({key: "no-bureau", value: "Tout i-Parapheur"});

    var corbeillesListSecretariat = corbeillesListFilter;
    corbeillesListSecretariat.unshift({key: "secretariat", value: "À relire"});
    corbeillesListSecretariat.unshift({key: "a-imprimer", value: "À imprimer"});

    var getCorbeillesList = function(isSecretaire, showVenir) {
        var corbeillesListFilter = [];

        corbeillesListFilter.push({key: "a-traiter", value: "À traiter"});
        corbeillesListFilter.push({key: "en-preparation", value: "À transmettre"});
        if(showVenir) {
            corbeillesListFilter.push({key: "a-venir", value: "À venir"});
        }
        corbeillesListFilter.push({key: "en-cours", value: "En cours"});
        corbeillesListFilter.push({key: "dossiers-delegues", value: "En délégation"});
        corbeillesListFilter.push({key: "a-archiver", value: "En fin de circuit"});
        corbeillesListFilter.push({key: "en-retard", value: "En retard"});
        corbeillesListFilter.push({key: "recuperables", value: "Récupérables"});
        corbeillesListFilter.push({key: "retournes", value: "Rejetés"});
        corbeillesListFilter.push({key: "traites", value: "Traités"});

        corbeillesListFilter.push({key: "no-corbeille", value: "Toutes les bannettes"});
        corbeillesListFilter.push({key: "no-bureau", value: "Tout i-Parapheur"});

        if(isSecretaire) {
            corbeillesListFilter.unshift({key: "secretariat", value: "À relire"});
            corbeillesListFilter.unshift({key: "a-imprimer", value: "À imprimer"});
        }
        return corbeillesListFilter;
    };

    var flags = {
        backdrop : false
    };

    return {
        flags : flags,
        getDashboardColumns : getDashboardColumns,
        getArchiveColumns : getArchiveColumns,
        toSaveColumns : toSaveColumns,
        possibleColumns : possibleColumns,
        corbeillesList : corbeillesList,
        corbeillesListFilter : getCorbeillesList,
        extractCron : extractCron,
        buildCron : buildCron,
        getCronMode : getCronMode,
        toPrefCron : toPrefCron
    }
}]);

var socket = angular.module('socketIO', []);
socket.factory('notifications', ['$rootScope', function($rootScope) {
    var socket = io.connect(window.location.origin, {secure:true, "sync disconnect on unload":true});
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}]);

var modals = angular.module('ipModals', []);
modals.factory('modals', ['$modal', 'configuration', 'navigationService', '$filter', function($modal, configuration, navigationService, $filter) {
    /**
     * Gestion des fenetres modales
     */
    var launchModalDossier = function(title, setPending, ctrl, modalFile, success, dossiers, fadeDis) {

        var modalOpt = {
            templateUrl: modalFile,
            controller: ctrl,
            backdrop : 'static',
            resolve: {
                setPending : function() {
                    return setPending;
                },
                titleModal : function () {
                    return title;
                },
                dossiers: dossiers,
                bureau: function() {
                    return navigationService.bureauCourant;
                }
            }
        };

        if(fadeDis) {
            modalOpt.size = "signature";
        }
        var modalInstance = $modal.open(modalOpt);

        modalInstance.result.then(function (result) {
            if(typeof success === "function") {
                success(result);
            }
        }, function () {
        });
    };

    var launchModalType = function(title, ctrl, modalFile, success, type) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop : 'static',
            resolve: {
                titleModal : function () {
                    return title;
                },
                type: function() {
                    return type;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if(typeof success === "function") {
                success(result);
            }
        }, function () {
        });
    };

    var launchModalBase = function(title, message, ctrl, modalFile, success, dismiss, object) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop : 'static',
            resolve: {
                title : function () {
                    return title;
                },
                message : function() {
                    return message;
                },
                object: function() {
                    return object;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if(typeof success === "function") {
                success(result);
            }
        }, function () {
            if(typeof dismiss === "function") {
                dismiss();
            }
        });
    };

    var launch = {};
    launch["VALIDATION"] = function(dossier, success) {
        launchModalDossier("Validation de dossiers", true, ValidationController, 'partials/modals/validationModal.html', success, dossier, true);
    };
    launch["TDT_HELIOS"] = function(dossier, success) {
        launchModalDossier("Envoi de dossier(s) - HELIOS", true, TdTHeliosController, 'partials/modals/tdtModal.html', success, dossier);
    };
    launch["TDT_ACTES"] = function(dossier, success) {
        launchModalDossier("Envoi du dossier vers la plateforme S²LOW (Actes)", true, TdTActesController, 'partials/modals/actesModal.html', success, dossier);
    };
    launch["REMORD"] = function(dossier, success) {
        launchModalDossier($filter('translate')('confirmationModal.get_back_confirmation'), true, RemorseController, 'partials/modals/confirmationModal.html', success, dossier);
    };
    launch["SUPPRESSION"] = function(dossier, success) {
        launchModalDossier($filter('translate')('confirmationModal.delete_confirmation'), true, DeleteController, 'partials/modals/confirmationModal.html', success, dossier);
    };
    launch["EMAIL"] = function(dossier, success) {
        launchModalDossier("Envoi de mail", false, MailController, 'partials/modals/mailModal.html', success, dossier);
    };
    launch["REJET"] = function(dossier, success) {
        launchModalDossier("Rejet", true, RejectController, 'partials/modals/rejectModal.html', success, dossier);
    };
    launch["MAILSEC"] = function(dossier, success) {
        launchModalDossier("Envoyer par Mail Sécurisé", true, MailSecController, 'partials/modals/mailsecModal.html', success, dossier);
    };
    launch["MAILSECINFOS"] = function(dossier, success) {
        launchModalDossier("Etat du dossier sur la plate-forme de Mail Securisé", true, MailSecInfosController, 'partials/modals/mailsecInfosModal.html', success, dossier);
    };
    launch["SECRETARIAT"] = function(dossier, success) {
        launchModalDossier($filter('translate')('confirmationModal.secretariat_confirmation'), true, SecretariatController, 'partials/modals/confirmationModal.html', success, dossier);
    };
    launch["ARCHIVAGE"] = function(dossier, success) {
        launchModalDossier("Archivage", true, ArchivageController, 'partials/modals/archiveModal.html', success, dossier);
    };
    launch["PRINT"] = function(dossier, success) {
        launchModalDossier("Imprimer le dossier", false, PrintController, 'partials/modals/printModal.html', success, dossier);
    };
    launch["JOURNAL"] = function(dossier, success) {
        launchModalDossier("Journal d'événements", false, JournalController, 'partials/modals/journalModal.html', success, dossier);
    };
    launch["PROPERTIES"] = function(dossier, success) {
        launchModalDossier("Propriétés du noeud", false, PropertiesController, 'partials/modals/propertiesModal.html', success, dossier);
    };
    launch["RAZ"] = function(dossier, success) {
        launchModalDossier($filter('translate')('confirmationModal.recovery_confirmation'), true, RazController, 'partials/modals/confirmationModal.html', success, dossier);
    };
    launch["MOVE"] = function(dossier, success) {
        launchModalDossier("Transfert du dossier", false, MoveController, 'partials/modals/moveModal.html', success, dossier);
    };
    launch["AVIS_COMPLEMENTAIRE"] = function(dossier, success) {
        launchModalDossier("Demande d'avis complémentaire", true, AvisCompController, 'partials/modals/validationModal.html', success, dossier);
    };
    launch["TRANSFERT_SIGNATURE"] = function(dossier, success) {
        launchModalDossier("Transférer le dossier à signer", true, ChangeSigController, 'partials/modals/validationModal.html', success, dossier);
    };
    launch["TRANSFERT_VISA"] = function(dossier, success) {
        launchModalDossier("Transférer le dossier à viser", true, ChangeVisaController, 'partials/modals/validationModal.html', success, dossier);
    };
    launch["TRANSFERT"] = function(dossier, success) {
        launchModalDossier("Transférer les dossiers", true, ChangeVisaController, 'partials/modals/validationModal.html', success, dossier);
    };
    launch["CACHET"] = function(dossier, success) {
        launchModalDossier("Cachet serveur", true, CachetCompController, 'partials/modals/validationModal.html', success, dossier);
    };
    launch["NOTIFICATIONS"] = function(dossier, success) {
        launchModalDossier("Notifier et ajouter un droit de consultation", false, NotificationsController, 'partials/modals/notificationModal.html', success, dossier);
    };
    launch["READ"] = function(dossier, success) {
        launchModalDossier("Lecture du dossier obligatoire", false, MandatoryReadController, 'partials/modals/mandatoryReadModal.html', success, dossier);
    };
    launch["PAPIER"] = function(dossier, success) {
        launchModalDossier("Confirmation de signature papier", false, SignPapierConfirmController, 'partials/modals/signPapierConfirmationModal.html', success, dossier);
    };
    launch["PAPIERSIGN"] = function(dossier, success) {
        launchModalDossier("Confirmation de signature papier", true, SignPapierController, 'partials/modals/signPapierModal.html', success, dossier);
    };
    launch["CHAIN"] = function(dossier, success) {
        launchModalDossier("Enchaîner un circuit", true, ChainController, 'partials/modals/chainModal.html', success, dossier);
    };
    launch["OverrideS2low"] = function(type, success) {
        launchModalType("Surcharger le connecteur - " + type.id, OverrideS2lowController, 'partials/modals/overrideS2low.html', success, type);
    };

    launch["SimpleConfirmation"] = function(infos, success, dismiss) {
        launchModalBase(infos.title, infos.message, infos.ctrl, 'partials/modals/simpleConfirmationModal.html', success, dismiss);
    };

    launch["SimpleInput"] = function(infos, success) {
        launchModalBase(infos.title, infos.message, infos.ctrl, 'partials/modals/inputModal.html', success);
    };

    launch["base"] = function(infos, success, dismiss) {
        launchModalBase(infos.title, infos.message, infos.ctrl, infos.template, success, dismiss, infos.object);
    };

    return {
        action : {
            VALIDATION: "VALIDATION",
            TDT_ACTES: "TDT_ACTES",
            TDT_HELIOS: "TDT_HELIOS",
            REMORD : "REMORD",
            SUPPRESSION : "SUPPRESSION",
            EMAIL : "EMAIL",
            REJET : "REJET",
            SECRETARIAT : "SECRETARIAT",
            ARCHIVAGE : "ARCHIVAGE",
            PRINT : "PRINT",
            JOURNAL : "JOURNAL",
            RAZ : "RAZ",
            CACHET: "CACHET"
        },
        launch : function(action, object, success, dismiss) {
            if(~Object.keys(launch).indexOf(action)) {
                launch[action](object, success, dismiss);
            }
        }
    }
}]);

$.arrayIntersect = function(a, b)
{
    return $.grep(a, function(i)
    {
        return $.inArray(i, b) > -1;
    });
};

$.fn.draghover = function(options) {
    return this.each(function() {

        var collection = $(),
            self = $(this);

        self.on('dragenter', function(e) {
            if (collection.length === 0) {
                self.trigger('draghoverstart');
            }
            collection = collection.add(e.target);
        });

        self.on('dragleave drop', function(e) {
            collection = collection.not(e.target);
            if (collection.length === 0) {
                self.trigger('draghoverend');
            }
        });
    });
};

navigator.browserInfo = (function(){
    var N= navigator.appName, ua= navigator.userAgent, tem;

    // if IE11+
    if (new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})").exec(ua) !== null) {
        var M= ["Internet Explorer"];
        if(M && (tem= ua.match(/rv:([0-9]{1,}[\.0-9]{0,})/))!= null) M[2]= tem[1];
        M= M? [M[0], M[2]]: [N, navigator.appVersion,'-?'];
        return M;
    }

    var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
    if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
    M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
    return M;
});
;
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
}]);;
/**
 * User: lhameury
 * Date: 28/03/13
 * Time: 17:13
 */

var utilsModule = angular.module('utilsModule', []);

utilsModule.factory('utils', [function() {
        return {
            diff : function(base, edited) {
                var type = typeof edited;
                if(type === "string" || type === "boolean") {
                    if(base !== edited) {
                        return edited;
                    }
                } else if (edited instanceof Array) {
                    if (!this.isArrayEqual(base, edited)) {
                        return edited;
                    }
                } else if (type === "object") {
                    if ($.isEmptyObject(base) || $.isEmptyObject(edited)) {
                        if (!($.isEmptyObject(base) && $.isEmptyObject(edited))) {
                            return edited;
                        }
                    }
                    else {
                        var newObj = {};
                        var keys = Object.keys(edited);
                        for(var i = 0; i < keys.length; i++) {
                            if(keys[i].substring(0,1) !== "$") {
                                var obj = this.diff(base[keys[i]], edited[keys[i]]);
                                obj = obj === null ? "" : obj;
                                if (obj !== undefined) {
                                    newObj[keys[i]] = obj;
                                }
                            }
                        }
                        return ($.isEmptyObject(newObj))? undefined : newObj;
                    }
                }
                return undefined;
            },
            isArrayEqual : function(arr1, arr2) {
                var equal = true;
                if((arr1 == null || arr2 == null)) {
                    if(arr1 !== arr2) {
                        return false;
                    }
                } else {
                    if(arr1.length !== arr2.length) {
                        equal = false;
                    } else {
                        if(arr1.length != 0) {
                            for(var i = 0; i < arr1.length; i++) {
                                if(this.diff(arr2[i], arr1[i]) !== undefined) {
                                    equal = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                return equal;
            },
            //Fonction permettant d'ordonner une liste de bureaux suivant leur supérieur hierarchique
            reorderBureaux : function(bureaux) {
                //Profondeur maximale
                var max = 0;
                var min = Number.MAX_VALUE;
                var assocsBureaux = {};
                //Algo compliqué - voir Jason
                for( var i=0; i < bureaux.length; i++ ) {
                    var profondeur = bureaux[i].profondeur;
                    if(!assocsBureaux[profondeur]) assocsBureaux[profondeur] = {};
                    if(profondeur > max) max = profondeur;
                    if(profondeur < min) min = profondeur;
                    assocsBureaux[profondeur][bureaux[i].id] = bureaux[i];
                }
                for(var j = max ; j > min; j--) {
                    angular.forEach(assocsBureaux[j], function(value) {
                        if(!assocsBureaux[j-1][value.hierarchie].child) assocsBureaux[j-1][value.hierarchie].child = [];
                        assocsBureaux[j-1][value.hierarchie].child.push(value);
                    });
                }
                var ordered = [];
                angular.forEach(assocsBureaux[min], function(value, key) {
                    ordered.push(value);
                });
                //Fin de l'algo compliqué
                return ordered;
            },
            reorderGroupes: function(nodes) {
                var map = {}, node, roots = [];
                for (var i = 0; i < nodes.length; i += 1) {
                    node = nodes[i];
                    node.subGroups = [];
                    map[node.shortName] = i; // use map to look-up the parents
                    if (node.parent != undefined && nodes[map[node.parent]] != undefined) {
                        nodes[map[node.parent]].subGroups.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            },
            windowSize : function() {
                var myWidth = 0, myHeight = 0;
                if( typeof( window.innerWidth ) == 'number' ) {
                    //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
                } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                    //IE 6+ in 'standards compliant mode'
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                    //IE 4 compatible
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
                return {
                    width: myWidth,
                    height: myHeight
                };
            },
            generateFilter : function(filterObj) {
                var filter = {};
                filter.and = [];
                if(filterObj["dateFrom"] || filterObj["dateTo"]) {
                    var str = "[";
                    str += filterObj["dateFrom"] ? filterObj.dateFrom : "MIN";
                    str += filterObj["dateTo"] ? " TO " + filterObj.dateTo + "]" : " TO MAX]";

                    filter.and.push({
                        "cm:created" : str
                    });
                }
                if(filterObj["title"] !== undefined && filterObj["title"] !== "") {
                    filter.and.push({
                        "or": [
                            {
                                "cm:title" : "*" + filterObj.title + "*"
                            },
                            {
                                "cm:name" : "*" + filterObj.title + "*"
                            }
                        ]
                    });
                }
                if(filterObj["types"] !== undefined) {
                    filter.and.push({
                        "or": []
                    });
                    for(var i = 0; i < filterObj.types.length; i++) {
                        filter.and[filter.and.length - 1].or.push({
                            "ph:typeMetier": filterObj.types[i]
                        });
                    }
                }
                if(filterObj["subtypes"] !== undefined) {
                    filter.and.push({
                        "or": []
                    });
                    for(var j = 0; j < filterObj.subtypes.length; j++) {
                        filter.and[filter.and.length - 1].or.push({
                            "ph:soustypeMetier": filterObj.subtypes[j]
                        });
                    }
                }
                var buildMeta = {};
                if(filterObj["metadonnees"] !== undefined) {
                    for(var k = 0; k < filterObj.metadonnees.length; k++) {
                        if(buildMeta[filterObj.metadonnees[k].id] === undefined) {
                            buildMeta[filterObj.metadonnees[k].id] = [];
                        }
                        buildMeta[filterObj.metadonnees[k].id].push(filterObj.metadonnees[k]);
                    }

                    for(var key in buildMeta) {
                        var type = buildMeta[key][0].type;
                        filter.and.push({
                            "or": []
                        });
                        for(var l = 0; l < buildMeta[key].length; l++) {
                            var metadonnee = buildMeta[key][l];
                            var obj = {};
                            if(type === "STRING") {
                                obj[metadonnee.id] = "*" + metadonnee.text + "*";
                            } else if(type === "DATE") {
                                str = "[";
                                str += metadonnee["dateFrom"] !== undefined ? metadonnee.dateFrom : "MIN";
                                str += metadonnee["dateTo"] !== undefined ? " TO " + metadonnee.dateTo + "]" : " TO MAX]";

                                obj[metadonnee.id] = str;
                            } else {
                                obj[metadonnee.id] = metadonnee.text;
                            }
                            filter.and[filter.and.length - 1].or.push(obj);
                        }
                    }
                }
                return filter;
            }
        };
    }]);