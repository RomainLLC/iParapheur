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
