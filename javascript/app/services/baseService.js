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
}]);