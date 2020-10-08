//Controller for about page
function AboutController($scope, modals) {

    var javaVersion = PluginDetect.getVersion("Java");

    var isWindows = navigator.platform.indexOf('Win') > -1;
    var isLinux = navigator.platform.indexOf('Linux') > -1;

    var isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
    var isIE = navigator.browserInfo()[0].toLowerCase().indexOf('explorer') > -1;

    var isChrome = navigator.browserInfo()[0].toLowerCase().indexOf('chrome') > -1 && !isEdge;
    var isFirefox = navigator.browserInfo()[0].toLowerCase().indexOf('firefox') > -1;

    $scope.navigator = isEdge ? ["Edge"] : navigator.browserInfo();
    
    $scope.client = {
        signature: {
            isCompatible: (isWindows && !isEdge) || (isLinux && isFirefox),
            canExtension: isWindows && !isEdge && !isIE && (isFirefox || isChrome),
            canJava: (isWindows && (isIE || isFirefox)) || (isLinux && isFirefox),
            isIE: isIE,

            extension: false,
            version: "",
            error: ""
        },
        java: {
            enabled: javaVersion !== null,
            version: javaVersion !== null ? javaVersion.replace(/,/g, '.') : ""
        }
    };

    window.addEventListener('libersignready', function () {
        testForLiberSign();
    });

    var testForLiberSign = function () {
        // Si l'objet LiberSign est défini, l'extension chrome est installée
        if (typeof LiberSign === "object") {
            $scope.client.signature.extension = true;
            LiberSign.getVersion().then(function (version) {
                $scope.$apply(function () {
                    $scope.client.signature.version = version;
                });
            }).catch(function (error) {
                console.log(error);
                $scope.$apply(function () {
                    $scope.client.signature.error = error.result;
                });
            });
        }
    };
    testForLiberSign();

    $scope.launchHelpModal = function () {
        modals.launch("base", {
            ctrl: HelpExtensionController,
            template: 'partials/modals/extensionHelpModal.html'
        });
    };
}
AboutController.$inject = ['$scope', 'modals']; //For JS compilers

var HelpExtensionController = function ($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.navigator = navigator.browserInfo()[0];

    $scope.installFFExtension = function () {
        var params = {
            "LiberSign": {
                URL: $scope.properties['parapheur.extension.libersign.firefox.url'],
                toString: function () {
                    return this.URL;
                }
            }
        };
        InstallTrigger.install(params);
    };

    $scope.testExtension = function () {
        location.reload();
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};
;
/**
 * Modals Controllers !
 */

var ValidationController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, $sce, cache) {

    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    if(dossiers.length === 1) {
        $scope.action.annotPub = localStorage[dossiers[0].id + "-annotation-" + bureau.id];
    }

    if (dossiers[0].actionDemandee === "VISA") {
        dossiers[0].$consecutiveSteps();
    }

    $scope.metaToDefine = [];
    dossiers.map(function(value) {
        if(value.listeMetadatas) {
            $scope.metaToDefine = $scope.metaToDefine.concat(value.listeMetadatas.filter(function(item) {
                return $scope.metaToDefine.indexOf(item) < 0;
            }));
        }
    });

    $scope.metaInfos = {};
    cache.metadonnees.list(false).then(function(list) {
        list.forEach(function(meta) {
            if($scope.metaToDefine.indexOf(meta.id) !== -1) {
                // Add this metadata to metaInfos
                //delete meta.values;
                $scope.metaInfos[meta.id] = meta;
            }
        });
    });

    $scope.metaValues = {};
    $scope.dossiersToSign = [];
    $scope.signLoaded = false;
    var numberSign = 0, signLoaded = 0;
    var dossiersToVisa = [];
    var dossiersToSeal = [];

    var hasSignature = false;
    var hasVisa = false;
    var hasSeal = false;

    $scope.progress = 0;
    for (var i = 0; i < dossiers.length; i++) {
        var d = dossiers[i];

        if (d.actionDemandee === "SIGNATURE") {
            numberSign++;

            d.$getSignInfo({
                bureauCourant: bureau.id
            }, function () {
                // SignInfo already generated, and retrieved directly
                signLoaded++;
                $scope.progress++;
                $scope.checkIfEverySignInfoIsRetrieved();
            }, function (error) {
                $scope.errorMessage = error.data.message;
            });
            $scope.dossiersToSign.push(d);
            $scope.max = $scope.dossiersToSign.length;
            $scope.lengthToSign = $scope.dossiersToSign.length;
            hasSignature = true;
        } else if(d.actionDemandee === "VISA") {
            dossiersToVisa.push(d);
            hasVisa = true;
        } else {
            dossiersToSeal.push(d);
            hasSeal = true;
        }
    }

    $scope.titleModal = hasVisa ? titleModal : hasSeal ? "Cacheter les dossiers" : "Signer les dossiers";

    if (!hasSignature) {
        $scope.progress = 0;
        $scope.max = dossiers.length;
    }

    var loadSignature = function () {
        $scope.signObj = [];
        $scope.signatures = [];

        for (var i = 0; i < $scope.dossiersToSign.length; i++) {
            $scope.signObj.push($scope.dossiersToSign[i].signatureInformations);
        }
        $scope.readyToSign = true;
    };

    $scope.checkIfEverySignInfoIsRetrieved = function () {
        if (signLoaded === numberSign) {
            loadSignature();
            $scope.signLoaded = true;
            $scope.progress = 0;
            $scope.max = dossiers.length;
        }
    };

    $scope.hasSignature = hasSignature;
    $scope.liberSignLoading = hasSignature;

    $scope.loaded = function () {
        $scope.$apply(function () {
            $scope.liberSignLoading = false;
        })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if($scope.metaToDefine.length > 0) {
            var toUpdate = $scope.dossiers.length;
            $scope.dossiers.forEach(function(element) {
                Object.keys($scope.metaValues).map(function(objectKey) {
                    if(!element.metadatas["cu:" + objectKey]) {
                        element.metadatas["cu:" + objectKey] = {};
                    }
                    element.metadatas["cu:" + objectKey].value = $scope.metaValues[objectKey];
                });
                element.$update($scope.action, function() {
                    toUpdate--;
                    if (toUpdate === 0) {
                        process();
                    }
                }, function(error) {
                    console.log(error);
                    // ERROR - keep going
                    toUpdate--;
                    if (toUpdate === 0) {
                        process();
                    }
                });
            });
        } else {
            process();
        }
    };

    var process = function() {
        if (hasSignature) {
            $scope.action.signatures = $scope.signatures;
            for (var j = 0; j < $scope.dossiersToSign.length; j++) {
                var actionDossier = {
                    annotPub: $scope.action.annotPub,
                    annotPriv: $scope.action.annotPriv,
                    bureauCourant: bureau.id,
                    signature: $scope.action.signatures[j]
                };
                if (setPending) {
                    $scope.dossiersToSign[j].locked = true;
                }
                $scope.dossiersToSign[j].$signature(actionDossier, function () {
                    $scope.progress++;
                    if ($scope.progress === $scope.max) {
                        closemodal();
                    }
                });
            }
        }
        for (var i = 0; i < dossiersToVisa.length; i++) {
            if (setPending) {
                dossiersToVisa[i].locked = true;
            }
            dossiersToVisa[i].$visa($scope.action, function () {
                $scope.progress++;
                if ($scope.progress === $scope.max) {
                    closemodal();
                }
            });
        }
        for (var j = 0; j < dossiersToSeal.length; j++) {
            if (setPending) {
                dossiersToSeal[j].locked = true;
            }
            dossiersToSeal[j].$seal($scope.action, function () {
                $scope.progress++;
                if ($scope.progress === $scope.max) {
                    closemodal();
                }
            });
        }
    };

    var closemodal = function() {
        if(dossiers.length === 1) {
            localStorage[dossiers[0].id + "-annotation-" + bureau.id] = "";
        }
        $modalInstance.close();
    }
};

var RemorseController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.textModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$remorse($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var SecretariatController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, $filter) {
    if (bureau.isSecretaire) {
        $scope.textModal = $filter('translate')('confirmationModal.reject_confirmation');
    } else {
        $scope.textModal = titleModal;
    }
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };
    $scope.showAnnot = true;

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$secretariat($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var DeleteController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.textModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$delete($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var MailController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Dossiers, Mails) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        dossiers: dossiers,
        annexesIncluded: false,
        destinataires: "",
        includeFirstPage: true,
        message: "",
        attachments: []
    };
    $scope.hasAnnexes = true;

    $scope.max = dossiers.length;
    $scope.progress = 0;

    if (dossiers.length === 1) {
        dossiers[0].$annexes(function () {
            $scope.action.attachments = angular.copy(dossiers[0].annexes);
            if ($scope.action.attachments.length === 0) {
                $scope.hasAnnexes = false;
            }
        });
    }

    var objet = "";
    for (var i = 0; i < dossiers.length; i++) {
        if (i > 0) {
            objet += " - ";
        }
        objet += dossiers[i].title;
    }

    $scope.action.objet = objet;

    var splitDestinataires = function () {
        $scope.action.destinataires = $scope.action.destinataires.split(";");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        splitDestinataires();
        Mails.dossiers({}, $scope.action);

        $modalInstance.close();
    };
};

var MailSecController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;

    var obj = "";
    for (var i = 0; i < dossiers.length; i++) {
        if(i > 0) {
            obj += "; ";
        }
        obj += dossiers[i].title;
    }

    $scope.action = {
        objet: obj,
        bureauCourant: bureau.id,
        destinataires: "",
        destinatairesCC: "",
        destinatairesCCI: "",
        showpass: false,
        password: "",
        annexesIncluded: false,
        includeFirstPage: true
    };

    dossiers[0].$secureMailTemplate(function (data) {
        $scope.action.message = angular.copy(data.secureMailTemplate);
    });

    $scope.hasAnnexes = true;

    if (dossiers.length === 1) {
        dossiers[0].$annexes(function () {
            $scope.action.attachments = angular.copy(dossiers[0].annexes);
            if ($scope.action.attachments.length === 0) {
                $scope.hasAnnexes = false;
            }
        });
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    var splitDestinataires = function () {
        $scope.action.destinataires = $scope.action.destinataires.split(";");
        $scope.action.destinatairesCC = $scope.action.destinatairesCC.split(";");
        $scope.action.destinatairesCCI = $scope.action.destinatairesCCI.split(";");
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        splitDestinataires();
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$mailsec($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var ForceMailsecController = function ($scope, $modalInstance, infos, bureau, dossier, usSpinnerService) {
    $scope.infos = infos;
    $scope.action = {
        annotation: ""
    };

    var tmpAnnot = localStorage[dossier.id + "-annotation-" + bureau.id];
    if (tmpAnnot !== undefined) {
        $scope.action.annotPub = tmpAnnot;
    }

    $scope.ok = function () {
        usSpinnerService.spin("spinner");
        var actionDossier = {
            annotPub: $scope.action.annotation,
            annotPriv: "",
            bureauCourant: bureau.id
        };
        dossier.locked = true;
        dossier.$visa(actionDossier, function () {
            usSpinnerService.stop("spinner");
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var MailSecInfosController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, $modal, modals, configuration, usSpinnerService, PastellMailsec, PastellConnector, $timeout, $route) {
    $scope.titleModal = titleModal;
    $scope.dossier = dossiers[0];

    $scope.updating = false;

    $scope.action = {
        bureauCourant: bureau.id
    };

    var updatePastellMailsecEvents = function(callback) {
        // Get node informations -> ServerId and DocumentId
        PastellConnector.infos({id: $scope.dossier.id}, function(result) {

            // We have serverID and mailId, now get journal
            PastellMailsec.events({id: result.serverId, idDoc: result.mailId}, function(r2) {

                // Get only type 5 events
                var events = r2.filter(function(v) {
                    return v.type === "5";
                });

                var sentDateEvent = r2.find(function(e) {
                    return e.message === "Le document a été envoyé";
                });

                // Create skeleton object
                $scope.dossier.infosMailSec = {
                    statut: "Envoyé",
                    envoi: sentDateEvent.date,
                    documentId: sentDateEvent.documentId,
                    details: []
                };

                var sendedMails = {};

                // 1 - Look for all mails sended !
                events.forEach(function (value) {
                    if(value.action === "envoi") {
                        var mail = value.message.substring(23, value.message.length);
                        sendedMails[mail] = {
                            email: mail,
                            confirmed: false,
                            confirmationDate: undefined
                        };
                    }
                });

                // 2 - Look for mail confirmation
                events.forEach(function (value) {
                    if(value.action === "Consulté") {
                        $scope.dossier.infosMailSec.statut = "Partiellement confirmé";

                        var mail = value.message.split(' ')[0];
                        if(sendedMails[mail] !== undefined) {
                            sendedMails[mail].confirmed = true;
                            sendedMails[mail].confirmationDate = value.date;
                        }
                    }
                });

                // 3 - Add all sendedMails to event array
                $.each(sendedMails, function(index, value) {
                    $scope.dossier.infosMailSec.details.push(value);
                });


                if(r2[0].action === "reception") {
                    $scope.dossier.infosMailSec.statut = "confirmé";
                    $timeout(function() {
                        location.reload();
                    }, 3000);
                }

                if(callback) callback();

            });
        }, function() {
            if(callback) callback();

            $scope.error = true;
        });
    };

    if($scope.dossier.actionDemandee === "MAILSEC") {
        $scope.dossier.$infosMailSec();
    } else if($scope.dossier.actionDemandee === "MAILSECPASTELL") {
        updatePastellMailsecEvents();
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.update = function () {
        usSpinnerService.spin("spinner");
        $scope.updating = true;
        if($scope.dossier.actionDemandee === "MAILSEC") {
            $scope.dossier.$infosMailSec(function () {
                usSpinnerService.stop("spinner");
                $scope.updating = false;
            });
        } else if($scope.dossier.actionDemandee === "MAILSECPASTELL") {
            updatePastellMailsecEvents(function () {
                usSpinnerService.stop("spinner");
                $scope.updating = false;
            });
        }
    };

    $scope.force = function () {
        $scope.animate = false;
        var confirmation = $modal.open({
            templateUrl: 'partials/modals/confirmForceModal.html',
            controller: ForceMailsecController,
            resolve: {
                infos: function () {
                    return $scope.dossier.infosMailSec.details;
                },
                bureau: function () {
                    return bureau;
                },
                dossier: function () {
                    return dossiers[0];
                }
            }
        });

        confirmation.result.then(function () {
            $modalInstance.close();
        }, function () {
            $scope.animate = true;
        });
    };

    $scope.remorse = function () {
        var title = "Confirmer";
        var message = "Voulez-vous réellement annuler la transaction ?";
        if($scope.dossier.actionDemandee === "MAILSECPASTELL") {
            title = "Confirmer l'interruption de la récupération de l'état";
            message = "Voulez-vous réellement interrompre la récupération de l'état du dossier ? Il vous sera par la suite possible de faire un nouvel envoi."
        }

        $scope.animate = false;
        modals.launch("SimpleConfirmation", {
            title: title,
            message: message,
            ctrl: BaseController
        }, function () {
            dossiers[0].$remorse({
                bureauCourant: bureau.id
            }, function () {
                $modalInstance.close();
            });
        }, function () {
            $scope.animate = true;
        });
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$rejet($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var RejectController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$rejet($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var AvisCompController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Bureaux) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id,
        bureauCible: ""
    };

    $scope.view = {
        bureauCible: undefined
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.bureau = new Bureaux(bureau).$associes(function (data) {
        $scope.bureau = data;
    });

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            $scope.action.bureauCible = $scope.view.bureauCible.id;
            dossiers[i].$avis($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var CachetCompController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Bureaux) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$seal($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var ChangeSigController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Bureaux) {
    $scope.primaryIcon = "fa-share";
    $scope.primaryLabel = "Transférer";
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id,
        bureauCible: ""
    };

    $scope.view = {
        bureauCible: undefined
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.bureau = new Bureaux(bureau).$associes(function (data) {
        $scope.bureau = data;
    });

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            $scope.action.bureauCible = $scope.view.bureauCible.id;
            dossiers[i].$transfertSignature($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var ChangeVisaController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Bureaux) {
    $scope.primaryIcon = "fa-share";
    $scope.primaryLabel = "Transférer";
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id,
        bureauCible: ""
    };

    $scope.view = {
        bureauCible: undefined
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.bureau = new Bureaux(bureau).$associes(function (data) {
        $scope.bureau = data;
    });

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            $scope.action.bureauCible = $scope.view.bureauCible.id;
            if(dossiers[i].actionDemandee === "VISA") {
                dossiers[i].$transfertVisa($scope.action, function () {
                    $scope.progress++;
                    if ($scope.max === $scope.progress) {
                        $modalInstance.close();
                    }
                });
            } else if(dossiers[i].actionDemandee === "SIGNATURE") {
                dossiers[i].$transfertSignature($scope.action, function () {
                    $scope.progress++;
                    if ($scope.max === $scope.progress) {
                        $modalInstance.close();
                    }
                });
            }
        }


    };
};

var ArchivageController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;

    $scope.archivesNames = [];
    $scope.archivesAnnexes = [];
    $scope.annexesToInclude = [];

    /**
     * Gestion des checkbox
     */
    //Checkboxes annexes
    $scope.checkboxAnnexes = [];
    //Initialisation de la variable stockant les id annexes selectionnés
    $scope.annexesToInclude = [];
    //Initialisation des checkbox
    $scope.setAllCheck = function (toSet) {
        if ($scope.dossiers.length === 1) {
            $scope.checkboxAnnexes.length = 0;
            for (var i = 0; i < $scope.dossiers[0].annexes.length; i++) {
                $scope.checkboxAnnexes[i] = toSet;
            }
        } else {
            for (var j = 0; j < $scope.dossiers.length; j++) {
                $scope.checkboxAnnexes[j] = toSet;
            }
        }
    };
    $scope.masterCheckbox = false;
    //Au changement de checkbox, vérification de la master
    $scope.$watch('checkboxAnnexes', function () {
        $scope.masterCheckbox = $.inArray(false, $scope.checkboxAnnexes) === -1 && $scope.checkboxAnnexes.length > 0;
        $scope.annexesToInclude = [];
        for (var i = 0; i < $scope.checkboxAnnexes.length; i++) {
            if ($scope.checkboxAnnexes[i]) {
                if ($scope.dossiers.length === 1) {
                    $scope.annexesToInclude.push($scope.dossiers[0].annexes[i].id);
                }
            }
        }
    }, true);
    //6----------9\\

    if (dossiers.length === 1) {
        dossiers[0].$annexes().then(function () {
            $scope.setAllCheck(false);
        });
    } else {
        $scope.setAllCheck(false);
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        var oneDossier = dossiers.length === 1;
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            var a = {
                bureauCourant: bureau.id,
                name: $scope.archivesNames[i] || $scope.dossiers[i].title + ".pdf"
            };
            if (!oneDossier) {
                a.annexesIncluded = $scope.checkboxAnnexes[i];
            } else {
                a.annexes = $scope.annexesToInclude;
            }
            dossiers[i].$archive(a, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var PrintController = function ($scope, $modalInstance, titleModal, setPending, dossiers) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {};

    $scope.annexesToInclude = [];
    //Checkboxes annexes
    $scope.checkboxAnnexes = [];
    $scope.includeFirstPage = true;

    $scope.setAllCheck = function (toSet) {
        if ($scope.dossiers.length === 1) {
            $scope.checkboxAnnexes.length = 0;
            for (var i = 0; i < $scope.dossiers[0].annexes.length; i++) {
                $scope.checkboxAnnexes[i] = toSet;
            }
        }
    };
    //Au changement de checkbox, vérification de la master
    $scope.$watch('checkboxAnnexes', function () {
        $scope.annexesToInclude = [];
        for (var i = 0; i < $scope.checkboxAnnexes.length; i++) {
            if ($scope.checkboxAnnexes[i]) {
                $scope.annexesToInclude.push($scope.dossiers[0].annexes[i].id);
            }
        }
    }, true);

    dossiers[0].$annexes().then(function () {
        $scope.setAllCheck(false);
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};

var JournalController = function ($scope, $modalInstance, titleModal, setPending, dossiers, $sce) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;

    if (!$scope.dossiers[0].events) {
        $scope.dossiers[0].$evenements(function () {
            for (var i = 0; i < $scope.dossiers[0].events.length; i++) {
                $scope.dossiers[0].events[i].annotation = $sce.trustAsHtml($scope.dossiers[0].events[i].annotation.replace(/\n/g, '<br/>'));
            }
        });
    }

    $scope.ok = function () {
        $modalInstance.close();
    };
};

var PropertiesController = function ($scope, $modalInstance, titleModal, setPending, dossiers) {
    $scope.titleModal = titleModal;
    $scope.nodes = dossiers;

    if (!$scope.nodes[0].properties) {
        $scope.nodes[0].$properties();
    }

    $scope.ok = function () {
        $modalInstance.close();
    };
};

var RazController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.textModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$raz($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var MoveController = function ($scope, $modalInstance, titleModal, setPending, dossiers, Bureaux) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.bureaux = Bureaux.listWithCache();
    $scope.showSpinner = false;
    $scope.action = {
        bureau: ""
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $scope.showSpinner = true;
        if (setPending) {
            $scope.dossiers[0].locked = true;
        }
        dossiers[0].$transfert({bureau: $scope.action.bureau.id}, function () {
            $scope.showSpinner = false;
            dossiers[0].parent = $scope.action.bureau.id;
            $modalInstance.close();
        });
    };
};

var BaseController = function ($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};

var InputController = function ($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.ctrl = {
        value: ""
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.ctrl);
    };
};

var AskPasswordController = function ($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.newPass = {};

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.newPass.newOne);
    };
};

var TdTHeliosController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.progress = 0;
    $scope.max = dossiers.length;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            $scope.dossiers[i].$tdtHelios($scope.action, function () {
                $scope.progress++;
                if ($scope.progress === $scope.max) {
                    $modalInstance.close();
                }
            });
        }
    };
};

var TdTActesController = function ($scope, Connecteurs, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossier = dossiers[0];
    $scope.action = {
        bureauCourant: bureau.id
    };

    $scope.timestamp = new Date().getTime();

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.actesInfo = Connecteurs.info(function () {
        $scope.orderedClassification = [];
        angular.forEach($scope.actesInfo.classification, function (value, key) {
            if (key.length !== 1) {
                this.push({
                    group: key.split("-")[0] + " " + $scope.actesInfo.classification[key.split("-")[0]],
                    value: value,
                    key: key
                });
            }
        }, $scope.orderedClassification);

    });

    $scope.$watch('action.numero', function (newValue) {
        if (newValue) {
            $scope.action.numero = newValue.toUpperCase().replace(/[^A-Z0-9_\s]/g, '').substring(0, 15);
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if (setPending) {
            $scope.dossier.locked = true;
        }
        // Obligé de passer par là... Si l'utilisateur tape la date à la main...
        $scope.action.dateActe = (new Date($scope.action.dateActe)).getTime();
        $scope.dossier.$tdtActes($scope.action, function () {
            $modalInstance.close();
        });
    };
};

var NotificationsController = function ($scope, Connecteurs, $modalInstance, titleModal, setPending, dossiers, bureau, Bureaux) {
    $scope.titleModal = titleModal;
    $scope.dossier = dossiers[0];

    $scope.dossier.$notifications();

    $scope.bureau = new Bureaux(bureau).$associes(function (data) {
        $scope.bureau = data;
    });

    $scope.addToNotifications = function (bureauId) {
        //Unshift => Ajout en début de list
        $scope.dossier.notifications.unshift({
            id: bureauId,
            mandatory: false
        })
    };

    $scope.removeFromNotifications = function (notif) {
        for (var i = 0; i < $scope.dossier.notifications.length; i++) {
            if ($scope.dossier.notifications[i].id === notif.id) {
                $scope.dossier.notifications.splice(i, 1);
            }
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $scope.dossier.$setNotifications({
            notifications: $scope.dossier.notifications
        }, function () {
            $modalInstance.close();
        });
    };
};

var MandatoryReadController = function ($scope, Connecteurs, $modalInstance, titleModal, setPending, dossiers) {
    $scope.titleModal = titleModal;
    $scope.dossier = dossiers[0];

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.getFileExtIcon = function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        ext = ext === null ? "" : ext[1].toLowerCase();

        var iconName = "fa-";

        switch(ext) {
            case 'pdf':
                iconName += "file-pdf-o";
                break;
            case 'zip':
                iconName += "file-archive-o";
                break;
            case 'xml':
                iconName += "file-code-o";
                break;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                iconName += "file-image-o";
                break;
            case 'pptx':
            case 'ppt':
            case 'odp':
                iconName += "file-powerpoint-o";
                break;
            case 'xlsx':
            case 'xls':
            case 'ods':
                iconName += "file-excel-o";
                break;
            case 'docx':
            case 'doc':
            case 'odt':
            case 'rtf':
            case 'txt':
            case 'htm':
            case 'html':
                iconName += "file-word-o";
        }

        return iconName;
    };

    $scope.ok = function () {
        $scope.dossier.isRead = true;
        $scope.dossier.hasRead = true;
        $scope.dossier.actions.push("SIGNATURE");
        $scope.dossier.actions.push("AVIS_COMPLEMENTAIRE");
        $scope.dossier.actions.push("TRANSFERT_ACTION");
        $modalInstance.close();
    };
};

var SignPapierConfirmController = function ($scope, Connecteurs, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossier = dossiers[0];
    var action = {
        bureauCourant: bureau.id
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $scope.dossier.$signPapier(action, function () {
            $scope.dossier.isSignPapier = true;
            $modalInstance.close();
        });
    };
};

var SignPapierController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;
    $scope.action = {
        bureauCourant: bureau.id
    };

    if (dossiers.length === 1) {
        var tmpAnnot = localStorage[$scope.dossiers[0].id + "-annotation-" + bureau.id];
        if (tmpAnnot !== undefined) {
            $scope.action.annotPub = tmpAnnot;
        }
    }

    $scope.max = dossiers.length;
    $scope.progress = 0;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        for (var i = 0; i < dossiers.length; i++) {
            if (setPending) {
                $scope.dossiers[i].locked = true;
            }
            dossiers[i].$visa($scope.action, function () {
                $scope.progress++;
                if ($scope.max === $scope.progress) {
                    $modalInstance.close();
                }
            });
        }


    };
};

var ChainController = function ($scope, $modalInstance, titleModal, setPending, dossiers, bureau, Types, navigationService, Dossiers, Metadonnees, Circuits, Bureaux, $http, configuration) {
    $scope.titleModal = titleModal;
    $scope.dossiers = dossiers;

    $scope.dossier = dossiers[0];

    $scope.action = {
        bureauCourant: bureau.id,
        type: $scope.dossier.type,
        sousType: $scope.dossier.sousType,
        metadatas: {},
        acteursVariables: []
    };

    $scope.max = dossiers.length;
    $scope.progress = 0;


    //Récupération de la typologie pour le bureau courant
    $scope.typo = Types.queryWithBureau({
        bureau: navigationService.bureauCourant.id
    });

    $scope.upgrading = false;


    $scope.getActionTooltip = function (etape) {
        var tooltip = "Fin de circuit";

        switch(etape.actionDemandee.toLowerCase()) {
            case 'visa':
                tooltip = 'Visa';
                break;
            case 'signature':
                tooltip = 'Signature';
                break;
            case 'mailsecpastell':
                tooltip = 'Mail sécurisé Pastell';
                break;
            case 'mailsec':
                tooltip = 'Mail sécurisé S²LOW';
                break;
            case 'tdt':
                tooltip = 'Télé-transmission';
                break;
            case 'cachet':
                tooltip = 'Cachet serveur';
                break;
            default:
                break;
        }

        return tooltip;
    };

    $scope.getIconClass = function(actionDemandee) {
        var classes = "";

        switch(actionDemandee.toLowerCase()) {
            case 'visa':
                classes += ' fa-check-square-o';
                break;
            case 'signature':
                classes += ' ls-signature';
                break;
            case 'mailsecpastell':
                classes += ' fa-envelope-o';
                break;
            case 'mailsec':
                classes += ' fa-envelope';
                break;
            case 'tdt':
                classes += ' fa-cloud-upload';
                break;
            case 'cachet':
                classes += ' ls-stamp';
                break;
            default:
                classes += ' fa-flag-checkered';
                break;
        }

        return classes;
    };

    $scope.$watch("action.sousType", function () {
        if ($scope.action.sousType) {
            $scope.circuit = Circuits.getWithTypo({
                id: $scope.action.type,
                action: $scope.action.sousType,
                bureau: navigationService.bureauCourant.id
            }, function () {
                angular.copy(new Bureaux(navigationService.bureauCourant), navigationService.bureauCourant);
                navigationService.bureauCourant.$associes(function () {
                    var indexVariable = 0;

                    for (var i = 0; i < $scope.circuit.etapes.length; i++) {
                        var etape = $scope.circuit.etapes[i];
                        if (etape.transition === "VARIABLE") {
                            $scope.action.acteursVariables[i] =
                                $scope.dossier.acteursVariables[indexVariable] || null;
                            indexVariable++;
                        } else {
                            $scope.action.acteursVariables[i] = null;
                        }
                    }

                    $scope.metaInfos = Metadonnees.getWithTypo({
                        id: $scope.action.type,
                        action: $scope.action.sousType
                    }, function () {

                        for (var i = 0; i < $scope.metaInfos.length; i++) {
                            var meta = $scope.metaInfos[i];
                            var obj = {};
                            obj[meta.id] = meta;

                            // If any, display already defined metadata.
                            if ($scope.dossier.metadatas[meta.id] && $scope.dossier.metadatas[meta.id].value.length > 0) {
                                obj[meta.id].value = $scope.dossier.metadatas[meta.id].value;
                            }
                            // Else, SubType's default value
                            else if (obj[meta.id]["default"]) {
                                obj[meta.id].value = obj[meta.id]["default"];
                            }
                            // Else, nothing to display
                            else {
                                obj[meta.id].value = "";
                            }

                            angular.extend($scope.action.metadatas, obj);
                        }
                        if ($scope.circuit.hasSelectionScript) {
                            $scope.updateCircuit();
                        }
                    });

                });

                if ($scope.circuit.sigFormat === 'XAdES/enveloped') {
                    $scope.action['xPathSignature'] = ".";
                }
            });

        } else {
            $scope.circuit = {};
            $scope.metaInfos = [];
        }
    });

    $scope.updateCircuit = function (callback) {
        $scope.errorMessage = undefined;
        $scope.dossier.$merge($scope.action, function () {
            $scope.circuit = Dossiers.getCircuitWithTypo({
                id: $scope.dossier.id,
                type: $scope.action.type,
                sousType: $scope.action.sousType,
                bureauCourant: navigationService.bureauCourant.id
            }, function () {
                //SUCCESS
                if (typeof callback == "function") {
                    callback();
                }
            }, function (error) {
                $scope.errorMessage = error.data.message;

                // Hardcoded fix
                $scope.circuit.hasSelectionScript = true;
            });
        });
    };

    $scope.metaHasChange = false;

    $scope.valuesMetaUndefined = function (idMeta) {
        $scope.action.metadatas[idMeta].value = $scope.action.metadatas[idMeta].value === "" ? undefined : $scope.action.metadatas[idMeta].value;
    };

    $scope.metaChanged = function () {
        $scope.metaHasChange = true;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $scope.updateCircuit(function () {
            for (var i = 0; i < dossiers.length; i++) {
                if (setPending) {
                    $scope.dossiers[i].locked = true;
                }

                $http.post(configuration.context + '/proxy/alfresco/parapheur/dossiers/' + $scope.dossiers[i].id + '/chain', $scope.action).then(function () {
                    $scope.progress++;
                    if ($scope.max === $scope.progress) {
                        $modalInstance.close();
                    }
                });
            }
        });
    };
};;
//Controller for apercu page
function ApercuController($scope, navigationService, Dossiers, Annotations, configuration, preferences, $sce, $location, modals, utils, $timeout, bestBureau, $http, $filter, viewService) {

    var step = 0;
    $scope.currentDocument = {};
    $scope.savedFilters = {};
    $scope.uploadErrorMessage = undefined;
    $scope.local = {
        annot : ""
    };

    $scope.getFileExtIcon = function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        ext = ext === null ? "" : ext[1].toLowerCase();

        var iconName = "fa-";

        switch(ext) {
            case 'pdf':
                iconName += "file-pdf-o";
                break;
            case 'zip':
                iconName += "file-archive-o";
                break;
            case 'xml':
                iconName += "file-code-o";
                break;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                iconName += "file-image-o";
                break;
            case 'pptx':
            case 'ppt':
            case 'odp':
                iconName += "file-powerpoint-o";
                break;
            case 'xlsx':
            case 'xls':
            case 'ods':
                iconName += "file-excel-o";
                break;
            case 'docx':
            case 'doc':
            case 'odt':
            case 'rtf':
            case 'txt':
            case 'htm':
            case 'html':
                iconName += "file-word-o";
        }

        return iconName;
    };

    $scope.getActionTooltip = function (etape) {
        var tooltip = "Fin de circuit";

        switch(etape.actionDemandee.toLowerCase()) {
            case 'visa':
                tooltip = 'Visa';
                break;
            case 'signature':
                tooltip = 'Signature';
                break;
            case 'mailsecpastell':
                tooltip = 'Mail sécurisé Pastell';
                break;
            case 'mailsec':
                tooltip = 'Mail sécurisé S²LOW';
                break;
            case 'tdt':
                tooltip = 'Télé-transmission';
                break;
            case 'cachet':
                tooltip = 'Cachet serveur';
                break;
            default:
                break;
        }

        return tooltip;
    };

    $scope.getIconClass = function(etape, folderEtape) {
        var classes = "";
        // etape.approved && (!etape.rejected || !dossier.circuit.etapes[$index+1].isCurrent
        // text-success
        if(etape.approved && (!etape.rejected || !folderEtape.isCurrent)) {
            classes += " text-success";
        }
        // etape.approved && etape.rejected && dossier.circuit.etapes[$index+1].isCurrent
        // text-danger
        if(etape.approved && etape.rejected && folderEtape.isCurrent) {
            classes += " text-danger";
        }

        switch(etape.actionDemandee.toLowerCase()) {
            case 'visa':
                classes += ' fa-check-square-o';
                break;
            case 'signature':
                classes += ' ls-signature';
                break;
            case 'mailsecpastell':
                classes += ' fa-envelope-o';
                break;
            case 'mailsec':
                classes += ' fa-envelope';
                break;
            case 'tdt':
                classes += ' fa-cloud-upload';
                break;
            case 'cachet':
                classes += ' ls-stamp';
                break;
            default:
                classes += ' fa-flag-checkered';
                break;
        }

        return classes;
    };

    var oldFilter = {};
    if (!navigationService.dash.selected) {
        oldFilter = angular.copy(navigationService.currentFilter);
    }

    $scope.changeFilter = function(name) {
        var filter;
        if ($scope.savedFilters.hasOwnProperty(name)) {
            //séléction d'un filtre
            $scope.nav.selected = name;

            $scope.nav.currentPage = 0;
            filter = JSON.parse($scope.savedFilters[$scope.nav.selected]);

        } else if (name === "dashboard.Unsaved_filter") {
            //Récupération du filtre précédent

            $scope.nav.currentPage = 0;
            filter = oldFilter;

        } else if (name === "dashboard.Default") {
            //Suppression du filtre actuel - par défaut -> dossier à traiter

            $scope.nav.currentPage = 0;
            filter = {dossier : "a-traiter"};
        } else {
            //Sélection d'une bannette

            $scope.nav.currentPage = 0;
            filter = {dossier : name};
        }
        angular.extend(navigationService.currentFilter, filter);
        getDossiers();
    };

    $scope.currentDocumentIndex = 0;
    $scope.currentPage = 0;

    $scope.changedAnnotation = function(data) {
        if ($scope.dossier) {
            localStorage[$scope.dossier.id + "-annotation-" + navigationService.bureauCourant.id] = data;
        }
    };

    $scope.loaded = false;

    var defaultPosition = {
        "right" : [
            {
                "name" : "annotations",
                "show" : true
            },
            {
                "name" : "actions",
                "show" : true
            },
            {
                "name" : "circuit",
                "show" : true
            },
            {
                "name" : "nom-dossier",
                "show" : true
            },
            {
                "name" : "details-dossier",
                "show" : true
            },
            {
                "name" : "postit",
                "show" : true
            },
            {
                "name" : "annotindex",
                "show" : true
            },
            {
                "name" : "annoter",
                "show" : true
            }
        ],
        "left" : [
            {
                "name" : "liste-dossiers",
                "show" : true
            }
        ]
    };

    var prefsDashletsToView = function() {
        var numberOfDashlets = 9;
        var dashletsAdded = 0;
        var dashletsPosition = $scope.prefs.dashletsPosition;
        var result = {
            right : [],
            left : []
        };
        var hasElement = true;
        var i = 0;
        do {
            if (dashletsPosition.right && dashletsPosition.right.hasOwnProperty("c" + i)) {
                result.right.push(dashletsPosition.right["c" + i]);
                dashletsAdded++;
            } else {
                hasElement = false;
            }
            i++;
        } while (hasElement);
        hasElement = true;
        i = 0;
        do {
            if (dashletsPosition.left && dashletsPosition.left.hasOwnProperty("c" + i)) {
                result.left.push(dashletsPosition.left["c" + i]);
                dashletsAdded++;
            } else {
                hasElement = false;
            }
            i++;
        } while (hasElement);

        if (dashletsAdded !== numberOfDashlets) {
            result = defaultPosition;
        }

        return result;
    };

    var prefs;
    var hasInitOnce = false;

    $scope.timestamp = new Date().getTime();

    var initController = function() {

        $scope.apercu.flags.reset();
        $scope.timestamp = new Date().getTime();
        step = 0;

        if ($scope.apercu.annotations.canLoad) {
            var tmp = $scope.apercu.annotations.hasDashlets;
            $scope.apercu.annotations.reset();
            $scope.apercu.annotations.hasDashlets = tmp;
        }

        $scope.hasAnnotPub = false;

        preferences.initPreferences(function(data) {

            prefs = data;
            $scope.apercu.iframe.init(prefs.viewXemelios);
            $scope.savedFilters = prefs.savedFilters;

            if (!bestBureau.error) {

                $scope.dossier = Dossiers.get({
                    id : navigationService.dossierToEdit,
                    bureauCourant : navigationService.bureauCourant.id
                }, function() {

                    $scope.local.annot = localStorage[$scope.dossier.id + "-annotation-" + navigationService.bureauCourant.id];

                    if ($scope.dossier.documents && $scope.dossier.documents.length > 0 && $scope.dossier.documents[$scope.currentDocumentIndex].pageCount > 0) {

                        $scope.currentDocument = angular.copy($scope.dossier.documents[$scope.currentDocumentIndex]);
                        $scope.apercu.annotations.pageCount = $scope.dossier.documents[$scope.currentDocumentIndex].pageCount;

                        //$scope.urlImages = document.location.origin + configuration.context + "/proxy/alfresco/parapheur/dossiers/" + $scope.dossier.id + "/" + $scope.dossier.documents[0].id + "/";
                    } else {
                        $scope.apercu.flags.noVisuel = true;
                    }
                    $scope.hasEditableMeta = false;
                    for (var j in $scope.dossier.metadatas) {
                        var current = $scope.dossier.metadatas[j];
                        if (current.editable === "true") {
                            $scope.hasEditableMeta = true;
                            break;
                        }
                    }

                    //Récupération du circuit
                    $scope.dossier.$getCircuit().then(function() {
                        if ($scope.dossier.circuit) {
                            $scope.flags.noCircuit = false;
                            if ($scope.dossier.circuit.annotPriv) {
                                $scope.dossier.circuit.annotPriv = $sce.trustAsHtml($scope.dossier.circuit.annotPriv.replace(/\n/g, '<br/>'));
                            }
                            //Affichage ou non des annotations publiques
                            for (var i = 0; i < $scope.dossier.circuit.etapes.length; i++) {
                                if (!!$scope.dossier.circuit.etapes[i].annotPub) {
                                    $scope.hasAnnotPub = true;
                                    $scope.dossier.circuit.etapes[i].annotPub = $sce.trustAsHtml($scope.dossier.circuit.etapes[i].annotPub.replace(/\n/g, '<br/>'));
                                }
                                if ($scope.dossier.circuit.etapes[i].approved) {
                                    step += 1;
                                } else {
                                    $scope.dossier.listeMetadatas = $scope.dossier.circuit.etapes[i].listeMetadatas;
                                    break;
                                }
                            }
                        } else {
                            $scope.flags.noCircuit = true;
                        }
                        initAnnotationsAndContent();
                        hasInitOnce = true;

                    }, function() {
                        $scope.flags.noCircuit = true;
                        initAnnotationsAndContent();
                        hasInitOnce = true;
                    })
                });
                if (!hasInitOnce) {
                    getDossiers();
                }
            } else {
                $scope.bestBureauError = bestBureau.error;
            }
        });

        $scope.isFirst = true;

        /**
         * Gestion de la liste des dossiers
         */
            //récupération des données de navigation du dashboard
        $scope.nav = navigationService.dash;
        $scope.dashFilter = navigationService.currentFilter;
    };

    var initAnnotationsAndContent = function() {

        if (!$scope.dashletsPosition) {
            $scope.dashletsPosition = prefsDashletsToView();
        }

        //Timeout to render dashlets
        $timeout(function() {
            if (!$scope.apercu.flags.noVisuel) {
                $scope.updateUrlImageSource();
                $scope.apercu.annotations.canLoad = true;
            }

            $scope.loaded = true;
        });
    };

    var nextDossier = null;

    //Changement de page
    $scope.changePage = function(next) {
        if (next && navigationService.dash.hasNext || !next && navigationService.dash.hasPrev) {
            navigationService.dash.currentPage += next ? 1 : -1;
            getDossiers();
        }
    };

    var getDossiers = function() {
        $scope.gettingDossier = true;
        navigationService.dash.hasNext = false;
        navigationService.dash.hasPrev = false;
        //Récupération de la dernière valeur de 'skipped'
        var skipped = navigationService.dash.currentPage > 0 ? navigationService.dash.skipped[navigationService.dash.currentPage - 1] : 0;
        var pendingNumber = navigationService.dash.currentPage > 0 ? navigationService.dash.pendingNumber[navigationService.dash.currentPage - 1] : 0;
        //Récupération des dossiers
        $scope.dossiers = Dossiers.list({
            bureau : navigationService.bureauCourant.id,
            pageSize : prefs.pagesize,
            page : navigationService.dash.currentPage,
            corbeilleName : navigationService.currentFilter.dossier,
            skipped : skipped,
            pendingFile : pendingNumber,
            sort : navigationService.dash.currentChamp,
            asc : navigationService.dash.ascBase,
            filter : utils.generateFilter(navigationService.currentFilter)
        }, function() {
            $scope.gettingDossier = false;
            //pour affichage ou non de la pagination
            if ($scope.dossiers.length > 0) {
                navigationService.dash.hasNext = $scope.dossiers[0].total > prefs.pagesize;
                navigationService.dash.skipped[+navigationService.dash.currentPage] = $scope.dossiers[0].skipped;
                navigationService.dash.pendingNumber[+navigationService.dash.currentPage] = $scope.dossiers[0].pendingFile;
            }
            navigationService.dash.hasPrev = navigationService.dash.currentPage > 0;
            findNextDossier();
        });
    };

    //6----------9\\

    var findNextDossier = function() {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            if ($scope.dossier.id === $scope.dossiers[i].id && (i + 1) < $scope.dossiers.length) {
                nextDossier = $scope.dossiers[i + 1];
            }
        }
    };

    $scope.removeDocument = function(index) {
        $scope.dossier.$removeDocument({
            doc : $scope.dossier.documents[index].id,
            bureauCourant : navigationService.bureauCourant.id
        }).then(function() {
            $scope.dossier.documents.splice(index, 1);

        }, function() {
            document.state = "";
        });
    };

    $scope.getSignatureFormat = function () {
        return $scope.dossier.circuit.sigFormat;
    };

    $scope.getProtocol = function () {
        return $scope.dossier.circuit.protocol;
    };

    $scope.wrongType = function(ext, isValid, isAuthorized) {

        $scope.$apply(function() {
            if (!isAuthorized) {
                $scope.typeError = false;
                $scope.formatError = true;
                $scope.uploadErrorMessage = undefined;
            } else {
                $scope.typeError = true;
                $scope.formatError = false;
                $scope.uploadErrorMessage = undefined;
            }
        });
    };

    $scope.wrongPDF = function() {
        $scope.$apply(function() {
            $scope.formatError = true;
        });
    };

    $scope.beginReplace = function(files) {
        $scope.$apply(function() {
            $scope.typeError = false;
            $scope.formatError = false;
            $scope.uploadErrorMessage = undefined;
            $scope.dossier.documents[0].state = "replace";
            $scope.dossier.documents[0].name = files[0].name;
            $scope.dossier.documents[0].visuelPdf = false;
        });
        return 0;
    };

    $scope.documentAdded = function(resp, index) {

        $scope.$apply(function() {

            if (resp.exception) {

                $scope.existLog = true;
                $scope.existDoc = $scope.dossier.documents[index].name;

            } else {

                // Adding the new document

                $scope.existLog = false;
                $.extend($scope.dossier.documents[index], {
                    canDelete : true,
                    downloadUrl : resp.downloadUrl,
                    id : resp.success
                });

                // If it is the current selected document, we refresh the view

                if (index === 0) {
                    var previousVersion = $scope.apercu.annotations.replacedVersions[$scope.dossier.documents[0].id];
                    $scope.apercu.annotations.replacedVersions[$scope.dossier.documents[0].id] = (previousVersion ? (previousVersion + 1) : 1);
                    setTimeout(function() { initController(); }, 250);
                }
            }

            $scope.dossier.documents[index].state = "";
        });
    };

    $scope.updateVisuEnd = function(resp, index) {
        $scope.$apply(function() {
            if (resp.exception) {
                $scope.existLog = true;
                $scope.existDoc = $scope.dossier.documents[index].name;
            } else {
                $scope.existLog = false;
                $scope.dossier.documents[index].visuelPdf = true;
            }
            $scope.dossier.documents[index].state = "";
            initController();
        });
    };

    $scope.updateVisu = function() {
        //L'état doit etre initialisé, donc à faire dans un apply différent, afin qu'il passe après la mise à jour de la vue
        $scope.$apply(function() {
            $scope.typeError = false;
            $scope.formatError = false;
            $scope.uploadErrorMessage = undefined;
            $scope.dossier.documents[0].state = "visuel";
        });
        return 0;
    };

    $scope.addDocument = function(files) {
        $scope.$apply(function() {
            $scope.typeError = false;
            $scope.formatError = false;
            $scope.uploadErrorMessage = undefined;

            $scope.dossier.documents.push({
                name : files[0].name
            });
        });
        //L'état doit etre initialisé, donc à faire dans un apply différent, afin qu'il passe après la mise à jour de la vue
        $scope.$apply(function() {
            $scope.dossier.documents[$scope.dossier.documents.length - 1].state = "saving";
        });
        return $scope.dossier.documents.length - 1;
    };

    $scope.addDocumentUrl = $sce.getTrustedResourceUrl($scope.context + "/addDocument");
    $scope.addVisuelUrl = $sce.getTrustedResourceUrl($scope.context + "/addVisuel");

    //6----------9\\

    var viewToPrefsDashlets = function() {
        var dashletsPosition = angular.copy($scope.dashletsPosition);
        var result = {
            right : {},
            left : {}
        };
        for (var i = 0; i < dashletsPosition.right.length; i++) {
            result.right["c" + i] = dashletsPosition.right[i];
        }
        for (var j = 0; j < dashletsPosition.left.length; j++) {
            result.left["c" + j] = dashletsPosition.left[j];
        }
        return result;
    };

    $scope.saveDashletsPosition = function() {
        preferences.changeProperty(preferences.paths.DASHLETS, viewToPrefsDashlets());
        preferences.changeProperty(preferences.paths.VIEWXEM, $scope.apercu.iframe.visuType);
        $scope.dashletsSaved = true;
        $timeout(function() {
            $scope.dashletsSaved = false;
        }, 3000);
    };

    $scope.editDossier = function() {
        navigationService.dossierToEdit = $scope.dossier.id;
    };

    /**
     * Gestion des fenetres modales
     */
    var getDossierModal = function() {
        var dossiers = [];
        dossiers.push($scope.dossier);
        return dossiers;
    };

    $scope.oneOrMoreAttestError = function() {
        if($scope.dossier &&  $scope.dossier.documents) {
            for(var i = 0; i < $scope.dossier.documents.length; i++) {
                if(!~$scope.dossier.documents[i].attestState) {
                    return true;
                }
            }
        }
        return false;
    };

    $scope.launchAttest = function() {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('apercu.refresh_signature_attestations') + " - " + $scope.dossier.title,
            message: $filter('translate')('apercu.refresh_signature_attestations_detail'),
            ctrl: BaseController
        }, function() {
            $scope.dossier.locked = true;
            for(var j = 0; j < $scope.dossier.documents.length; j++) {
                if($scope.dossier.documents[j].attestState == -1) {
                    $scope.dossier.documents[j].attestState = 1;
                }
            }
            var action = {
                bureauCourant: navigationService.bureauCourant.id
            };
            $scope.dossier.$attest(action);
        });
    };

    $scope.launchModal = function(action) {
        modals.launch(action, getDossierModal);
    };

    $scope.launchModalWithRedirect = function(action) {

        var defaultPublicAnnotation = $scope.local.annot || "";

        // Ajout 4.3.01 - En cas de rejet, on récupère le texte des annotations graphiques de l'étape en cours
        if ((action === "REJET") && (defaultPublicAnnotation.length === 0)) {
            defaultPublicAnnotation = $scope.apercu.annotations.getAnnotationsText();
        }

        $scope.changedAnnotation(defaultPublicAnnotation);
        modals.launch(action, getDossierModal, $scope.selectNextDossier);
    };

    var metaHasChanged = false;

    $scope.metaChanged = function() {
        metaHasChanged = true;
    };

    $scope.metasForm = {};
    $scope.setFormScope = function(scope) {
        $scope.metasForm = scope;
    };

    $scope.checkReadAndLaunchModalWithRedirect = function(action) {
        //Si action de signature et non lu, alors demande de confirmation
        if ($scope.dossier.actionDemandee === "SIGNATURE" && !$scope.dossier.hasRead && configuration.properties["parapheur.ihm.confirmbox.read"] === "true") {
            modals.launch("base", {
                title : "Attestation de lecture",
                message : "Je reconnais avoir pris connaissance des documents sélectionnés",
                template : 'partials/modals/readConfirmModal.html',
                ctrl : BaseController
            }, function() {
                $scope.readDossier(0);
                modals.launch(action, getDossierModal, $scope.selectNextDossier);
            });
        } else {
            modals.launch(action, getDossierModal, $scope.selectNextDossier);
        }
        if(metaHasChanged && $scope.metasForm.metasForm.$valid) {
            modals.launch("base", {
                title : "Enregistrement des métadonnées",
                message : "Les métadonnées ont été modifiées. Souhaitez-vous enregistrer les modification ?",
                template : 'partials/modals/simpleConfirmationModal.html',
                ctrl : BaseController
            }, function() {
                $scope.saveMetadatas();
            });
        }
    };

    $scope.readDossier = function(index) {
        // TODO : read every document ?
        if (index === 0 && ~$scope.dossier.actions.indexOf('REJET') && !$scope.dossier.hasRead) {
            //Lecture OK
            $scope.dossier.hasRead = true;
            $scope.dossier.isRead = true;
            //Ajout des actions si lecture obligatoire
            if ($scope.dossier.readingMandatory) {
                $scope.dossier.actions.push("SIGNATURE");
                $scope.dossier.actions.push("AVIS_COMPLEMENTAIRE");
                $scope.dossier.actions.push("TRANSFERT_SIGNATURE");
            }
        }
    };

    $scope.launchModalWithRefresh = function(action) {
        modals.launch(action, getDossierModal, function() {
            $scope.refreshDossier = true;
            $timeout(function() {
                initController();
                $scope.refreshDossier = false;
            }, 5000);
        });
    };

    /**
     * Lors de la réception d'une notification de fin de traitement, on doit enlever le dossier de la liste affichée
     * @param id l'id du dossier à enlever de la liste
     */
    var removeDossierFromList = function(id) {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            var dossier = $scope.dossiers[i];
            if (dossier.id === id) {
                $scope.dossiers.splice(i, 1);
                if ($scope.dossiers.length < ($scope.prefs.pagesize / 2) && (navigationService.dash.hasNext || navigationService.dash.hasPrev)) {
                    getDossiersRetain();
                }
            }
        }
    };

    $scope.saveMetadatas = function() {
        $scope.metaSaved = false;
        $scope.metaSavedError = false;
        $scope.dossier.$update({
            bureauCourant : navigationService.bureauCourant.id
        }, function() {
            $scope.metaSaved = true;
            $scope.dossier.$getCircuit().then(function() {
                $timeout(function() {
                    $scope.metaSaved = false;
                }, 3000);
            });
            metaHasChanged = false;
        }, function (error) {
            $scope.metaSavedError = true;
            $scope.metaSavedErrorMsg = error.data.message;
        });
    };

    //Handle notifications
    $scope.$on('notificationReceived', function(event, obj) {
        //Handle notifs
        var changed = false;
        if(obj.action === "TRANSFORM" || obj.action === "GET_ATTEST") {
            var doc, index;
            for (var j = 0; j < $scope.dossier.documents.length; j++) {
                if ($scope.dossier.documents[j].id === obj.id) {
                    doc = $scope.dossier.documents[j];
                    changed = true;
                    index = j;
                }
            }
            if(doc) {
                switch(obj.state) {
                    case "NEW":
                        doc.isLocked = true;
                        doc.canDelete = false;
                        break;
                    case "END":
                        if(obj.action === "TRANSFORM") {
                            doc.visuelPdf = true;
                            doc.pageCount = obj.pageCount;
                            if($scope.currentDocumentIndex === index) {
                                $scope.currentDocumentIndex = -1;
                                $scope.selectDocument(index);
                            }
                        } else {
                            doc.attestState = 2;
                            break;
                        }
                    case "ERROR":
                        if(obj.action === "TRANSFORM") {
                            break;
                        } else {
                            doc.attestState = -1;
                            break;
                        }
                    default:
                        doc.isLocked = false;
                        doc.canDelete = true;
                        break;
                }
            } else {
                if(obj.id === $scope.dossier.id) {
                    $scope.dossier.locked = false
                }
            }
        } else if (obj.bureauId === navigationService.bureauCourant.id) {
            if (~obj.banettes.indexOf(navigationService.currentFilter.dossier)) {
                if (obj.state === "new") {
                    //getDossiersRetain();
                } else {
                    removeDossierFromList(obj.id);
                }
            }
        }
    });

    $scope.refreshStatus = function() {
        $scope.dossier.$status();
    };

    $scope.apercu = {
        flags : {
            annotShownOnce : false,
            noVisuel : false,
            reset : function() {
                this.noVisuel = false;
            }
        },
        options: {
            getOptionsFromMeta: function (metaInfo) {
                var values = [];
                if (metaInfo.mandatory !== 'true') {
                    values.push({text: "", value: ""});
                }
                if (metaInfo.type === "BOOLEAN") {
                    values.push({text: $filter('translate')('details-dossier.true'), value: "true"});
                    values.push({text: $filter('translate')('details-dossier.false'), value: "false"});
                } else {
                    if (metaInfo.values) {
                        for (var i = 0; i < metaInfo.values.length; i++) {
                            values.push({text: metaInfo.values[i], value: metaInfo.values[i]});
                        }
                    }
                }
                return values;
            },
            filters: function () {
                var result = [];

                result.push({key: "dashboard.Unsaved_filter", value: $filter('translate')("dashboard.Unsaved_filter")});
                result.push({key: "dashboard.Default", value: $filter('translate')("dashboard.Default")});

                result.push({
                    key: "en-preparation",
                    value: $filter('translate')("liste-dossier.toTransmit"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "a-traiter",
                    value: $filter('translate')("liste-dossier.toTreat"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "a-archiver",
                    value: $filter('translate')("liste-dossier.endOfCircuit"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "retournes",
                    value: $filter('translate')("liste-dossier.returned"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "en-cours",
                    value: $filter('translate')("liste-dossier.pending"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "a-venir",
                    value: $filter('translate')("liste-dossier.upcoming"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "recuperables",
                    value: $filter('translate')("liste-dossier.retrievables"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "en-retard",
                    value: $filter('translate')("liste-dossier.late"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "traites",
                    value: $filter('translate')("liste-dossier.treated"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });
                result.push({
                    key: "dossiers-delegues",
                    value: $filter('translate')("liste-dossier.delegatedFolders"),
                    group: $filter('translate')("liste-dossier.traySelection")
                });

                var keys = Object.keys($scope.savedFilters);
                for (var i = 0; i < keys.length; i++) {
                    result.push({
                        key: keys[i],
                        value: keys[i],
                        group: $filter('translate')("liste-dossier.filterSelection")
                    });
                }

                return result;
            }
        },
        signature : {
            sigWrongType : false,
            isSigUploaded : false,
            filename : "",
            wrongTypeSig : function() {
                var that = this;
                $scope.$apply(function() {
                    that.sigWrongType = true;
                    $timeout(function() {
                        that.sigWrongType = false;
                    }, 3000);
                });
            },
            sigAdded : function(files) {
                this.filename = files[0].name;
            },
            sigUploaded : function(uploadedFile) {
                var that = this;
                $scope.$apply(function() {
                    var action = {
                        content : uploadedFile.encodedFile,
                        name : that.filename
                    };
                    $scope.dossier.$addSignature(action, function() {
                        //Update circuit !
                        $scope.dossier.$getCircuit();

                        that.isSigUploaded = true;
                        $timeout(function() {
                            that.isSigUploaded = false;
                        }, 3000);
                    });
                });
            }
        },
        annotations : {
            list : [],              // Liste des annotations
            orderedList : {},       // Liste des annotations ordonnées, pour l'affichage de la dashlet
            pagesLoaded : [],       // Pages déjà chargées en mémoire
            replacedVersions : {},  // Document version number, useful when we replace the main document.
            documentPage : {        // Current page & documentIndex
                documentIndex : 0,
                page : 0
            },
            page : 0,               // Page actuelle
            viewPage : 1,           // Page de la vue actuelle (pour pagination, page = 0 --> viewPage = 1)
            maxSize : 7,            // Taille maximale de la pagination (7 défini arbitrairement
            src : "",               // Source de l'url des images à récupérer
            pageCount : 0,
            canLoad : false,        // Booléen permettant de notifier à annotorious que le dossier est chargé
            isInit : false,         // Le module est-il initialisé ?
            hasAnnotation : false,  // Il existe au moins une annotation (utilisé pour l'affichage de la dashlet)
            fullscreen : false,     // True = Mode fullscreen
            signatureMode: false,   // Mode positionnement de signature PAdES
            hasDashlets : {         // Dashlets détectés, côté droit et gauche
                left : true,
                right : true
            },
            positionSignature: {},  // Positions de signature PAdES
            docHasAnnot: {},        // Le document a-t-il une annotation ?

            reset : function() {
                this.list = [];
                this.orderedList = {};
                this.pagesLoaded = [];
                this.page = 0;
                this.viewPage = 1;
                this.maxSize = 7;
                this.src = "";
                this.canLoad = false;
                this.isInit = false;
                this.hasAnnotation = false;
                this.fullscreen = false;
                this.signatureMode = false;
                this.pageCount = 0;
                this.documentPage = {documentIndex : 0, page : 0};
                this.hasDashlets = {
                    left : true,
                    right : true
                };
            },

            /**
             * initialisatin du watch, pour le resize en fonction des dashlets
             */
            init : function() {
                var that = this;
                $scope.$watch("apercu.annotations.hasDashlets", function() {
                    if (that.src !== "") {
                        //Timeout pour attendre que le rendu soit effectué sur la page
                        $timeout(function() {
                            $scope.$broadcast("resizeAnnotation");
                        });
                    }
                }, true);
            },

            /**
             * Peut-on positionner la signature PAdES ?
             * Pour le savoir, il faut voir si nous sommes l'emetteur ou signataire, et qu'on fait bien du PAdES...
             */
            canPositionSignature: function() {
                // PAdES ?
                if($scope.dossier.circuit && $scope.dossier.circuit.sigFormat.indexOf('PAdES') > -1) {
                    // Sommes-nous emetteur, secretaire ou signataire ?
                    if((!$scope.dossier.circuit.etapes[0].approved && ($scope.dossier.actions.indexOf("VISA") > -1 || $scope.dossier.actions.indexOf("SECRETARIAT") > -1)) || $scope.dossier.actions.indexOf("SIGNATURE") > -1 || $scope.dossier.actions.indexOf("CACHET") > -1) {
                        // Seems to be OK ...
                        return true;
                    }
                }
                return false;
            },

            /**
             * Switch vers le mode plein écran
             */
            switchFullscreen : function() {
                this.fullscreen = !this.fullscreen;
                //Timeout pour attendre que le rendu soit effectué sur la page
                $timeout(function() {
                    $scope.$broadcast("resizeAnnotation");
                });
            },

            /**
             * Changement de page sur la vue, mise à jour de la page pour les annotation (vue - 1)
             */
            pageChanged : function() {
                this.page = this.viewPage - 1;
                this.documentPage = {documentIndex : $scope.currentDocumentIndex, page : this.page};
            },

            //Gère un objet annotation récupéré depuis l'API, et la transforme en annotation gérée par annotorious
            handleAnnotation : function(annotation, canEdit, page) {

                var annotObj = angular.copy(annotation);
                var currentVersion = $scope.getCurrentDocumentVersionNumber($scope.dossier.documents[$scope.currentDocumentIndex].id);

                annotObj.shapes = [{
                    type : "rect",
                    geometry : {
                        x : annotObj.rect.topLeft.x / this.currentWidth,
                        y : annotObj.rect.topLeft.y / this.currentHeight,
                        width : (annotObj.rect.bottomRight.x - annotObj.rect.topLeft.x) / this.currentWidth,
                        height : (annotObj.rect.bottomRight.y - annotObj.rect.topLeft.y) / this.currentHeight
                    },
                    style: {
                        stroke:"rgba(0, 0, 0, 1)",
                        hi_stroke:"rgba(0, 0, 0, 1)",
                        fill:"rgba(0, 0, 255, 0.1)",
                        hi_fill:"rgba(0, 0, 255, 0.15)",
                        Ce: 2, //outline_width
                        xe: 2, //hi_outline_width
                        Ee: 1, //stroke_width
                        ye: 1 //hi_stroke_width
                    }
                }];
                annotObj.editable = canEdit;
                annotObj.date = new Date(annotObj.date);
                annotObj.src = this.src + (+page) + "?version=" + currentVersion;

                return annotObj;
            },

            /**
             * Gestion de la position de signature
             *
             * @param anno Objet fourni par annotorious
             * @param page Page actuelle
             */
            handlePosition: function(anno, page) {
                // Gestion de la position de signature PAdES
                if (this.positionSignature[$scope.currentDocumentIndex.toString()] && this.positionSignature[$scope.currentDocumentIndex.toString()].page === page) {
                    anno.addAnnotation(this.positionSignature[$scope.currentDocumentIndex.toString()]);
                }
            },

            /**
             * Gestion de la liste complète des annotations.
             * Chargement en mémoire uniquement de la page actuelle
             *
             * @param anno Objet fourni par annotorious
             * @param width Largeur originale de l'image actuelle
             * @param height Hauteur originale de l'image actuelle
             * @param page Page actuelle
             */
            handleList : function(anno, width, height, page) {
                var that = this;
                var list = this.list;
                var documentId = $scope.dossier.documents[$scope.currentDocumentIndex].id;

                // Si multi-doc, on affiche toujours l'encadré des annotations graphiques
                if ($scope.dossier.documents.length > 1) {
                    this.hasAnnotation = true;
                }

                //Pour toutes les étapes - et tous les documents
                for (var etapeIndex = 0; etapeIndex < list.length; etapeIndex++) {
                    var isEditable = (etapeIndex === step);

                    for (var pageNumber in list[etapeIndex][documentId]) {

                        //Ici faire attention, il s'agit d'un objet angularJS !
                        if (pageNumber.indexOf('$') < 0) {

                            //Au moins une annotation est présente, on peut afficher la dashlet de la liste d'annotations
                            if (list[etapeIndex][documentId][pageNumber].length > 0) {
                                this.hasAnnotation = true;
                            }
                            //Si la page dans l'itération pageNumber est égale à la page actuelle
                            if (+pageNumber === page) {

                                if (list[etapeIndex][documentId][pageNumber] !== undefined) {
                                    //On ajoute les annotations trouvés à l'objet annotorious
                                    for (var j = 0; j < list[etapeIndex][documentId][pageNumber].length; j++) {
                                        var annotObj = that.handleAnnotation(list[etapeIndex][documentId][pageNumber][j], isEditable, pageNumber);
                                        anno.addAnnotation(annotObj);
                                    }
                                }
                                //On garde en mémoire la page chargée
                                that.pagesLoaded.push(pageNumber);
                            }
                        }
                    }
                }
            },

            /**
             * Sorting Annotation list, not by etapes/documentId/page,
             * but only by documentId/page, for the dashlet.
             */
            orderList : function() {
                var that = this;
                var list = this.list;
                that.orderedList = {};

                for (var etapeIndex = 0; etapeIndex < list.length; etapeIndex++) {

                    for (var documentId in list[etapeIndex]) {
                        if (documentId.indexOf('$') < 0) {
                            var documentIndex = $scope.getDocumentIndex(documentId);

                            if (that.orderedList[documentIndex] === undefined) {
                                that.orderedList[documentIndex] = {};
                            }

                            for (var pageNumber in list[etapeIndex][documentId]) {
                                if (pageNumber.indexOf('$') < 0) {
                                    if (that.orderedList[documentIndex][pageNumber] === undefined) {
                                        that.orderedList[documentIndex][pageNumber] = [];
                                    }

                                    if (list[etapeIndex][documentId][pageNumber] !== undefined) {
                                        for (var annotationIndex = 0; annotationIndex < list[etapeIndex][documentId][pageNumber].length; annotationIndex++) {
                                            var annotObj = that.handleAnnotation(list[etapeIndex][documentId][pageNumber][annotationIndex], false, pageNumber);
                                            that.orderedList[documentIndex][pageNumber].push(annotObj)
                                        }
                                    }
                                }
                            }

                        }
                    }
                }

            },

            /**
             * Selecting and highlighting the given Annotation,
             * switching current document page if needed.
             *
             * @param documentIndex, on which document the Annotation is
             * @param page, on which page the Annotation is
             * @param annot , the annotation to highlight
             */
            select : function(documentIndex, page, annot) {
                page = +page; // Set to int !
                if ((this.page !== page) || (documentIndex !== $scope.currentDocumentIndex)) {
                    $scope.selectDocument(documentIndex);
                    $scope.currentPage = page;
                    $scope.updateUrlImageSource();
                    this.documentPage = {documentIndex : documentIndex, page : page};
                    this.page = page;
                    this.viewPage = page + 1;
                    var offSelect = $scope.$on("annotoriousLoaded", function() {
                        anno.highlightAnnotation(annot);
                        offSelect();
                    });
                } else {
                    anno.highlightAnnotation(annot);
                }
            },

            getAnnotationsText: function() {
                var list = this.list;
                var annotText = "";
                var etapeIndex = step;
                var hasAnnot = false;

                for (var i = 0; i < $scope.dossier.documents.length; i++ ) {
                    var documentId = $scope.dossier.documents[i].id;
                    var hasDoc = false;
                    for (var pageNumber in list[etapeIndex][documentId]) {
                        var hasPage = false;
                        //Ici faire attention, il s'agit d'un objet angularJS !
                        if (pageNumber.indexOf('$') < 0) {
                            for (var j = 0; j < list[etapeIndex][documentId][pageNumber].length; j++) {
                                if (!hasAnnot) {
                                    annotText += "\n\nAnnotations graphiques :";
                                    hasAnnot = true;
                                }
                                if (!hasDoc) {
                                    annotText += "\n- Document : " + $scope.dossier.documents[i].name;
                                    hasDoc = true;
                                }
                                if (!hasPage) {
                                    annotText += "\n- Page : " + (+pageNumber + 1) + "\n";
                                    hasPage = true;
                                }
                                annotText += list[etapeIndex][documentId][pageNumber][j].text + "\n";
                            }
                        }
                    }
                }

                return annotText;
            },

            /**
             * Récupération des annotations via l'API.
             *
             * @param anno Objet fourni par annotorious
             * @param width Largeur originelle de l'image
             * @param height Hauteur originelle de l'image
             */
            load : function(anno, width, height) {

                this.currentWidth = width;
                this.currentHeight = height;
                var that = this;

                if (!this.isInit) {

                    // Retrieving Annotations
                    this.list = Annotations.list({idDossier : $scope.dossier.id}, function() {
                        that.handleList(anno, width, height, that.page);
                        that.orderList();
                        that.getAnnotationsText();
                    });

                    if(this.canPositionSignature()) {
                        // La prochaine étape est-elle cachet serveur ou signature ?
                        $scope.forCachet = false;
                        for(var i = 0; $scope.dossier.circuit.etapes.length > i; i++) {
                            var etape = $scope.dossier.circuit.etapes[i];
                            if(!etape.approved) {
                                if(etape.actionDemandee === "SIGNATURE") {
                                    break;
                                }
                                if(etape.actionDemandee === "CACHET") {
                                    $scope.forCachet = true;
                                }
                            }
                        }
                        $http({
                            url: configuration.context +
                                '/proxy/alfresco/parapheur/dossiers/' +
                                $scope.dossier.id + '/customSignature',
                            method: "GET",
                            params: {cachet: $scope.forCachet}
                        }).success(function(data) {
                            if(data[0] && data[0].page === 0) {
                                data[0].page = $scope.apercu.annotations.pageCount;
                            }

                            if(that.positionSignature[$scope.currentDocumentIndex]) {
                                anno.removeAnnotation(that.positionSignature[$scope.currentDocumentIndex]);
                            }

                            that.positionSignature = that.positionsToAnnotations(data);
                            that.handlePosition(anno, that.page);
                        });
                    }

                    this.isInit = true;
                } else {
                    if (that.pagesLoaded.indexOf(that.page) < 0) {
                        that.handleList(anno, width, height, that.page);
                    }
                    if(this.canPositionSignature()) {
                        this.handlePosition(anno, this.page);
                    }
                }
            },

            /**
             * Translating an iText annotation into an Annotorious annotation.
             * @param positions
             * @returns Object JSON object
             */
            positionsToAnnotations: function(positions) {

                var localWidth = 594;
                var localHeight = 840;
                if(this.currentWidth > this.currentHeight) {
                    localWidth = 840;
                    localHeight = 594;
                }

                var currentVersion = $scope.getCurrentDocumentVersionNumber($scope.dossier.documents[$scope.currentDocumentIndex].id);

                var annotations = {};
                for (var key in positions) {
                    var height = (positions[key].height / localHeight);
                    annotations[key] = {
                        src : document.location.origin + configuration.context + "/proxy/alfresco/parapheur/dossiers/" + $scope.dossier.id + "/"+ $scope.dossier.documents[key].id + "/" + (positions[key].page -1) + "?version=" + currentVersion,
                        text : "",
                        type : "rect",
                        context : document.location.origin + configuration.context + "/#/apercu",
                        author : "Signature location",
                        isSignaturePosition : true,
                        page : (positions[key].page - 1),
                        shapes : [
                            {
                                type : "rect",
                                geometry : {
                                    x : (positions[key].x / localWidth),
                                    y : (1 - height - (positions[key].y / localHeight)),
                                    width : (positions[key].width / localWidth),
                                    height : height
                                },
                                style : {
                                    stroke : "rgba(0, 0, 0, 1)",
                                    hi_stroke : "rgba(0, 0, 0, 1)",
                                    fill : "rgba(255, 0, 0, 0.1)",
                                    hi_fill : "rgba(255, 0, 0, 0.15)",
                                    Ce : 2,
                                    xe : 2,
                                    Ee : 1,
                                    ye : 1
                                }
                            }
                        ]
                    };
                }

                return annotations;
            },

            /**
             * Position de la signature PAdES !
             * @param anno Objet annotator
             * @param annotation Rectangle de position
             */
            setPosition: function(anno, annotation) {

                var localWidth = 594;
                var localHeight = 840;
                if(this.currentWidth > this.currentHeight) {
                    localWidth = 840;
                    localHeight = 594;
                }

                if(this.positionSignature[$scope.currentDocumentIndex]) {
                    anno.removeAnnotation(this.positionSignature[$scope.currentDocumentIndex]);
                }
                this.positionSignature[$scope.currentDocumentIndex] = annotation;
                var height = Math.round(annotation.shapes[0].geometry.height * localHeight);
                var position = {
                    x: Math.round(annotation.shapes[0].geometry.x * localWidth),
                    y: localHeight - Math.round(annotation.shapes[0].geometry.y * localHeight) - height, // Le y est inversé !
                    width: Math.round(annotation.shapes[0].geometry.width * localWidth),
                    height: height,
                    page: annotation.page+1
                };
                // Send new signature position...
                $http.post(configuration.context +
                        '/proxy/alfresco/parapheur/dossiers/' +
                        $scope.dossier.id + '/' +
                        $scope.dossier.documents[$scope.currentDocumentIndex].id +
                        '/customSignature', position);
                // Maintenant, on re-switch en mode annotation classique
                this.signatureMode = false;
            },

            /**
             * Création d'une annotation
             *
             * @param annotation L'annotation à créer
             * @returns {*} Promise angularJS de l'annotation sauvegardée
             */
            create : function(annotation) {

                annotation = new Annotations(annotation);
                var documentId = $scope.dossier.documents[$scope.currentDocumentIndex].id;

                // Update local data

                if (this.list[step][documentId][this.page] === undefined) {
                    this.list[step][documentId][this.page] = [];
                }
                if (this.orderedList[$scope.currentDocumentIndex][this.page] === undefined) {
                    this.orderedList[$scope.currentDocumentIndex][this.page] = [];
                }
                this.list[step][documentId][this.page].push(annotation);
                this.orderedList[$scope.currentDocumentIndex][this.page].push(annotation);
                this.hasAnnotation = true;

                // Sending request

                return annotation.$save({idDossier : $scope.dossier.id, idDocument : documentId});
            },

            /**
             * Mise à jour d'une annotation
             *
             * @param annotation L'annotation à mettre à jour
             * @returns {*} Promise angularJS de l'annotation sauvegardée
             */
            update : function(annotation) {

                var documentId = $scope.dossier.documents[$scope.currentDocumentIndex].id;
                var a = new Annotations(annotation);

                // Update local data

                for (var i = 0; i < this.list[step][documentId][this.page].length; i++) {
                    if (this.list[step][documentId][this.page][i].id === a.id) {
                        this.list[step][documentId][this.page][i] = angular.copy(a);
                        break;
                    }
                }
                for (var j = 0; this.orderedList[$scope.currentDocumentIndex][this.page].length; j++) {
                    if (this.orderedList[$scope.currentDocumentIndex][this.page][j].id === a.id) {
                        this.orderedList[$scope.currentDocumentIndex][this.page][j] = angular.copy(a);
                        break;
                    }
                }

                // Sending request

                return a.$update({idDossier : $scope.dossier.id, idDocument : documentId});

            },

            /**
             * Suppression d'une annotation
             *
             * @param annotation L'annotation à supprimer
             * @returns {*} Promise angularJS de l'annotation supprimée
             */
            remove : function(annotation) {

                if (annotation.isSignaturePosition) {
                    var that = this;

                    // Deleting signature position and retrieving the default one.
                    // ... Maybe we could get it in the delete request result ?
                    return $http.delete(configuration.context +
                        '/proxy/alfresco/parapheur/dossiers/' +
                        $scope.dossier.id + '/' +
                        $scope.dossier.documents[$scope.currentDocumentIndex].id +
                        '/customSignature').success(function(data) {

                        $http.get(configuration.context +
                            '/proxy/alfresco/parapheur/dossiers/' +
                            $scope.dossier.id + '/customSignature?cachet=' + $scope.forCachet).success(function(data) {

                            that.positionSignature = that.positionsToAnnotations(data);
                            that.handlePosition(anno, that.page);
                        });
                    });

                } else {
                    $scope.apercu.annotations.docHasAnnot[$scope.currentDocumentIndex] = false;
                    // Suppression de l'annotation...
                    var a = new Annotations(annotation);
                    var documentId = $scope.dossier.documents[$scope.currentDocumentIndex].id;

                    // Update local data

                    for (var i = 0; i < this.list[step][documentId][this.page].length; i++) {
                        if (this.list[step][documentId][this.page][i].id === a.id) {
                            this.list[step][documentId][this.page].splice(i, 1);
                            break;
                        }
                    }
                    for (var j = 0; this.orderedList[$scope.currentDocumentIndex][this.page].length; j++) {
                        if (this.orderedList[$scope.currentDocumentIndex][this.page][j].id === a.id) {
                            this.orderedList[$scope.currentDocumentIndex][this.page].splice(j, 1);
                            break;
                        }
                    }
                    for (var pageIndex in this.orderedList[$scope.currentDocumentIndex]) {
                        if (this.orderedList[$scope.currentDocumentIndex].hasOwnProperty(pageIndex)) {
                            if (this.orderedList[$scope.currentDocumentIndex][pageIndex].length > 0) {
                                $scope.apercu.annotations.docHasAnnot[$scope.currentDocumentIndex] = true;
                                break;
                            }
                        }
                    }

                    // Sending request

                    return a.$remove({idDossier : $scope.dossier.id, idDocument : documentId});
                }
            }
        },
        iframe : {
            visuType : "xemelios",
            iframeId : "visionneuse",
            current : -3,
            max : -3,
            userChangePage : false,
            isLoaded : false,
            init : function(viewXem) {
                var that = this;
                try {
                    var propTenant = JSON.parse(configuration.properties["parapheur.ihm.apercu.helios.tenant"]);
                } catch (e) {
                    //Can't handle property or JSON...
                }
                if (viewXem) {
                    this.visuType = viewXem;
                } else if (configuration.tenant && propTenant[configuration.tenant]) {
                    this.visuType = propTenant[configuration.tenant];
                } else {
                    this.visuType = configuration.properties["parapheur.ihm.apercu.helios"]
                }
                //On gère le cas où le PDF de visualisation est mauvais
                $scope.$watch("apercu.flags.noVisuel", function() {
                    if ($scope.apercu.flags.noVisuel && $scope.dossier.isXemEnabled) {
                        that.visuType = "xemelios";
                    }
                });
                this.postLoad();
            },
            postLoad : function() {
                var defaultLoading = navigator.userAgent.indexOf("Chrome") != -1 ? -3 : -2;
                this.current = defaultLoading;
                this.max = defaultLoading;
                this.isLoaded = false;
            },
            onIframeLoad : function() {
                if (!this.userChangePage) {
                    this.current++;
                    if (this.current === 0) {
                        $scope.readDossier(0);
                    }
                    this.max = this.current;
                } else {
                    this.userChangePage = false;
                }
            },
            changePage : function(changed) {
                this.userChangePage = true;
                this.current += changed;
                document.getElementById(this.iframeId).contentWindow.history.go(changed);
            },
            previousPage : function() {
                if (this.current > 0) {
                    this.changePage(-1);
                }
            },
            nextPage : function() {
                if (this.current < this.max) {
                    this.changePage(1);
                }
            },
            switchVisu : function() {
                if (this.current >= 0 || this.visuType === "visuelpdf") {
                    this.visuType = this.visuType === "xemelios" ? "visuelpdf" : "xemelios";
                    if (this.visuType === "xemelios") {
                        this.postLoad();
                    } else {
                        //Timeout pour prise en compte de la variable "visuType" dans la vue
                        $timeout(function() {
                            //Timeout pour affichage de la div annotorious
                            $timeout(function() {
                                //Déclenchement de l'auto-size annotorious
                                $scope.$broadcast("resizeAnnotation");
                            });
                        });
                    }
                }
            }
        }
    };

    $scope.apercu.annotations.init();

    $scope.updateUrlImageSource = function() {
        $scope.apercu.annotations.src = window.location.protocol + "//" + window.location.host + configuration.context + "/proxy/alfresco/parapheur/dossiers/" + $scope.dossier.id + "/" + $scope.dossier.documents[$scope.currentDocumentIndex].id + "/";
    };

    // <editor-fold desc="liste-dossiers.html">

    $scope.selectNextDossier = function(dossier) {
        //$scope.dossier.locked = true;
        //Si on fourni un dossier cible, pris en compte ssi son id n'est pas actuel
        if (!!dossier) {
            if (dossier.id === $scope.dossier.id) {
                return;
            }
            nextDossier = dossier;
        } else {
            //selection du prochain dossier dans la liste si aucun dossier fourni
            findNextDossier();
        }

        //Si le prochain dossier n'existe pas ou est d'id egal avec l'actuel, on retourne sur le dashboard
        if (nextDossier === null || nextDossier.id === $scope.dossier.id) {
            $location.path("/dashboard");
        } else {
            //Prise en compte du dossier selectionné, reset des annotations, ré-initialisation du controlleur
            navigationService.dossierToEdit = nextDossier.id;
            $scope.currentDocumentIndex = 0;
            initController();
            //Affichage d'un message pendant 5 secondes si selection automatique
            if (!dossier) {
                $scope.nextDossierSelected = true;
                $timeout(function() {
                    $scope.nextDossierSelected = false;
                }, 5000);
            }
        }
    };

    // </editor-fold desc="liste-dossiers.html">

    // <editor-fold desc="nom-dossier.html">

    $scope.selectDocument = function(index) {

        if ($scope.currentDocumentIndex !== index) {

            // Refresh data

            $scope.readDossier(index);
            $scope.currentDocumentIndex = index;
            $scope.currentPage = 0;
            //Pour la vue
            $scope.apercu.annotations.viewPage = 0;
            //Pour le controlleur
            $scope.apercu.annotations.page = 0;
            $scope.apercu.annotations.pageCount = $scope.dossier.documents[index].pageCount;

            $scope.updateUrlImageSource();
            $scope.apercu.annotations.documentPage = {documentIndex : $scope.currentDocumentIndex, page : 0};
            $scope.apercu.flags.reset();
        }
    };

    $scope.getDocumentIndex = function(documentId) {
        var currentDocumentIndex = 0;

        for (var documentIndex = 0; documentIndex < $scope.dossier.documents.length; documentIndex++) {
            if ($scope.dossier.documents[documentIndex].id === documentId) {
                currentDocumentIndex = documentIndex;
            }
        }

        return currentDocumentIndex;
    };

    $scope.getDocumentListItemClass = function(index) {

        if ($scope.isCurrentDocumentSelected(+index)) {
            return 'document-list-element document-list-element-selected';
        }
        else if ($scope.isCurrentMainDocument(+index)) {
            return 'document-list-element document-list-element-unselected';
        }
        else {
            return 'document-list-element';
        }
    };

    $scope.isPdf = function(index) {
        return $scope.dossier.documents[index].name.indexOf(".pdf", $scope.dossier.documents[index].name.length - ".pdf".length) !== -1;
    };

    $scope.isCurrentDocumentSelected = function(index) {
        return +$scope.currentDocumentIndex === +index;
    };

    $scope.isCurrentMainDocument = function(index) {
        return $scope.dossier.documents[+index].isMainDocument
            && (index == 0 || $scope.dossier.circuit.isMultiDocument);
    };

    $scope.isFirstAnnex = function(index) {

        if (index === 0) {
            return false;
        }

        return $scope.isCurrentMainDocument(index-1) && !$scope.isCurrentMainDocument(index);
    };

    // </editor-fold desc="nom-dossier.html">

    // <editor-fold desc="details-dossier.html">

    $scope.uploadError = function(resp, document) {

        $scope.$apply(function() {
            $scope.uploadErrorMessage = $scope.getErrorMessage(resp);

            // Removing wrong uploaded doc from the displayed list
            $scope.dossier.documents.splice(document, 1);

        });
    };

    /**
     * Get the appropriate error message translation (from error code, or HTTP status).
     *
     * @param resultData
     */
    $scope.getErrorMessage = function(resultData) {
        var resultMessage;

        if (resultData.status == 400) {
            var message = ((!!resultData.responseJSON) ? resultData.responseJSON.message : resultData.data.message);

            if (!isNaN(message)) {
                resultMessage = $filter('translate')('ErrorCodes.' + message);
            } else {
                // This shouldn't happen,
                // every error messages needs to be numbered by the server.
                console.log("Missing translation : " + message);
                resultMessage = message;
            }
        } else {
            resultMessage = $filter('translate')('ErrorCodes.' + resultData.status);
        }

        return resultMessage
    };

    $scope.getCurrentProtocol = function() {
        if ($scope.dossier.circuit) {
            return $scope.dossier.circuit.protocol;
        }
    };

    $scope.getCurrentSignatureFormat = function() {
        if ($scope.dossier.circuit) {
            return $scope.dossier.circuit.sigFormat;
        }
    };

    $scope.isDocumentNameAlreadyExist = function(fileName) {
        var alreadyExists = false;
        for (var i=0; i<$scope.dossier.documents.length; i++) {
            if ($scope.dossier.documents[i].name ===  fileName) {
                alreadyExists = true;
                $scope.$apply(function() {
                    $scope.uploadErrorMessage = $filter('translate')('ErrorCodes.3003');
                });
                break;
            }
        }
        return alreadyExists;
    };

    // </editor-fold desc="details-dossier.html">

    // <editor-fold desc="apercu.html">

    $scope.hasNoVisualToDisplay = function() {
        return $scope.apercu.flags.noVisuel
            && (!$scope.dossier.isXemEnabled || $scope.apercu.iframe.visuType !== 'xemelios')
            && !$scope.dossier.documents[$scope.currentDocumentIndex].isLocked;
    };

    $scope.isGenerating = function() {
        return $scope.apercu.flags.noVisuel
            && (!$scope.dossier.isXemEnabled || $scope.apercu.iframe.visuType !== 'xemelios')
            && $scope.dossier.documents[$scope.currentDocumentIndex].isLocked;
    };

    var timestamp = (new Date()).getTime();
    $scope.getCurrentDocumentVersionNumber = function() {
        var version = timestamp;

        if ($scope.dossier.documents && $scope.dossier.documents[$scope.currentDocumentIndex]) {
            if ($scope.apercu.annotations.replacedVersions[$scope.dossier.documents[$scope.currentDocumentIndex].id]) {
                version = $scope.apercu.annotations.replacedVersions[$scope.dossier.documents[$scope.currentDocumentIndex].id];
            }
        }

        return version;
    };

    // </editor-fold desc="apercu.html">

    // <editor-fold desc="annotindex.html">

    $scope.getDocumentName = function(documentIndex) {
        return $scope.dossier.documents[documentIndex].name;
    };

    $scope.isMultiDocument = function() {
        return $scope.dossier.circuit.isMultiDocument;
        //return ($scope.dossier.documents.length > 1);
    };

    // </editor-fold desc="annotindex.html">

    initController();

}
ApercuController.$inject = ['$scope', 'navigationService', 'Dossiers', 'Annotations', 'configuration', 'preferences', '$sce', '$location', 'modals', 'utils', '$timeout', 'bestBureau', '$http', '$filter', 'viewService']; //For JS compilers

function onIframeLoad() {
    var scopetemp = angular.element("iframe").scope();
    if (!scopetemp.$$phase) {
        scopetemp.$apply(function() {
            scopetemp.apercu.iframe.onIframeLoad();
        });
    } else {
        if (scopetemp.apercu) {
            scopetemp.apercu.iframe.onIframeLoad();
        }
    }
};
//Controller for dashboard page
function ArchivesController($scope, Metadonnees, Types, Archives, navigationService, viewService, preferences, utils, modals, $filter) {
    /**
     * Récupération des préferences et initialisation des colomnes
     */
    var prefs = preferences.initPreferences(function(resp) {
        //Récupération de l'ordre d'affichage des colonnes
        viewService.getArchiveColumns(resp.enabledColumnsArchives, function(data) {
            $scope.columns = data;
        });
    });

    // Handle archives names without .pdf extension
    $scope.getFullTitle = function(title) {
        var s = ".pdf";
        if(title.length >= s.length && title.substr(title.length - s.length) === s) {
            return title;
        } else {
            return title + s;
        }
    };

    // Fonction de suppression d'archives
    $scope.deleteArchive = function(archive) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('archives.delete') + " " + archive.title,
            message: $filter('translate')('archives.delete_confirm'),
            ctrl: BaseController
        }, function () {
            archive.$destroy(function() {
                $scope.dossiers.length = 0;
                getDossiers();
            });
        });
    };

    // Fonction de suppression d'archives
    $scope.renameArchive = function(archive) {
        modals.launch("SimpleInput", {
            title: $filter('translate')('archives.rename') + " " + archive.title,
            message: $filter('translate')('archives.rename_confirm'),
            ctrl: InputController
        }, function (ret) {
            archive.title = ret.value;
            archive.$rename(function() {
                $scope.dossiers.length = 0;
                getDossiers();
            });
        });
    };

    //Lors du click sur une colomne sortable -> réorganisation
    $scope.sortTable = function(column) {
        if(column) {
            navigationService.archives.currentChamp === column ? navigationService.archives.ascBase = !navigationService.archives.ascBase : navigationService.archives.currentChamp = column;
            getDossiers();
        }
    };
    //6----------9\\

    $scope.noFilterName = 'archives.No_filter';
    $scope.unsavedFilterName = 'archives.Unsaved_filter';

    /**
     * Partie filtrage avancé
     */
        //Options
    $scope.optionsFiltersAvailable = [];
    //Liste des metadonnées
    $scope.metadonnees = Metadonnees.list({type: "", sousType: ""}, function () {
        $scope.optionsFiltersAvailable.push({
            value: "",
            key: $filter('translate')("archives.select_a_filter_to_create")
        });
        var groupName = "Metadonnées";
        for (var i = 0; i < $scope.metadonnees.length; i++) {
            $scope.optionsFiltersAvailable.push({
                group: groupName,
                value: i,
                key: $scope.metadonnees[i].name
            })
        }
    });
    //Metadonnée selectionnée
    $scope.selectedMetadonnee = {};
    //Filtre en cours d'édition
    $scope.metaTmpFilter = {};
    //Liste de conditions sur les metadonnées
    $scope.metaFilter = [];
    //Index selectionné pour le filtre en cours de création et en cours d'édition
    $scope.selectedMetadonneeIndex = {
        index : "",
        bis : ""
    };
    //Récupération du filtre stocké dans le storage
    if (navigationService.currentFilterArchive.metadonnees) {
        //angular.copy(navigationService.currentFilterArchive.metadonnees, $scope.metaFilter);
    }
    var selectedIndex = undefined;
    //FONCTION APPELLEE LORS DU CHANGEMENT DU PREMIER SELECT
    $scope.createAdvancedFilter = function(index) {
        $scope.selectedMetadonneeIndex.bis = "";
        $scope.metaTmpFilter = angular.copy($scope.metadonnees[index]);
        selectedIndex = undefined;
    };
    //FONCTION APPELLEE LORS DE LA SELECTION D'UN FILTRE DEJA EXISTANT
    $scope.selectAdvancedFilter = function(index) {
        $scope.selectedMetadonneeIndex.index = "";
        $scope.metaTmpFilter = $scope.metaFilter[index];
        selectedIndex = index;
    };
    //Sauvegarde du filtre avancé
    $scope.saveAdvancedFilter = function() {
        $scope.selectedMetadonneeIndex.bis = "";
        selectedIndex = undefined;
        $scope.metaTmpFilter = angular.copy($scope.metadonnees[$scope.selectedMetadonneeIndex.index]);
    };
    //Suppression du filtre avancé
    $scope.deleteAdvancedFilter = function() {
        $scope.metaFilter.splice(selectedIndex, 1);
        $scope.selectedMetadonneeIndex.bis = "";
        $scope.metaTmpFilter = angular.copy({});
        selectedIndex = undefined;
    };
    //FONCTION APPELLEE LORS DE L'EDITION D'UN FILTRE EXISTANT OU NON
    $scope.editAdvancedFilter = function() {
        if(selectedIndex === undefined) {
            selectedIndex = $scope.metaFilter.length;
            $scope.metaFilter.push(angular.copy($scope.metaTmpFilter));
        } else {
            if($scope.metaTmpFilter.text || $scope.metaTmpFilter.dateFrom || $scope.metaTmpFilter.dateTo) {
                $scope.metaFilter[selectedIndex] = angular.copy($scope.metaTmpFilter);
            } else {
                $scope.metaFilter.splice(selectedIndex, 1);
                $scope.selectedMetadonneeIndex.bis = "";
                selectedIndex = undefined;
            }
        }
    };
    //Sauvegarde du filtre lors de l'appui sur la touche "Entrée"
    $scope.keyDownAdvancedFilter = function($event) {
        if($event.keyCode === 13) {
            $scope.saveAdvancedFilter();
        }
    };
    //Suppression du filtre lors d'un retour ou d'un suppr
    $scope.keyDownAdvancedActiveFilter = function($event) {
        if($event.keyCode === 8 || $event.keyCode === 46) {
            $scope.deleteAdvancedFilter();
        }
    };
    //6----------9\\

    /**
     * Gestion de la Navigation
     */
        //récupération des données de navigation du dashboard
    $scope.nav = navigationService.archives;

    //Changement de page
    $scope.changePage = function(next) {
        if(next && navigationService.archives.hasNext || !next && navigationService.archives.hasPrev) {
            navigationService.archives.currentPage += next ? 1 : -1;
            getDossiers();
        }
    };
    //6----------9\\;
    /**
     * Partie filtrage basique
     */

    //Initialisation de la typologie
    $scope.typo = Types.query();

    //Récupération du filtre actuel
    $scope.currentFilter = navigationService.currentFilterArchive;

    $scope.dashboard = {
        //Liste des filtres sauvegardés
        list: {},
        //Filtre temporaire (en cours de création) et filtre en cours
        showed : {},
        //Filtre courant, sur lequel la dernière requête à été faite. Ce filtre reste en mémoire entre les pages (navigationService)
        current: navigationService.currentFilterArchive,
        //Elements de navigation -- Objet sauvegardé en localstorage
        navigation: navigationService.archives,
        //Recherche de contenu
        content: "false",
        //Colones affichées
        columns: [],
        //Préférences
        prefs: {},
        //Viens de sélectionner un filtre !
        hasSelectFilter: false,
        //Initialisation de l'objet handler du dashboard
        init: function() {
            var that = this;
            this.prefs = preferences.initPreferences(function(resp) {
                //Récupération de l'ordre d'affichage des colonnes
                viewService.getArchiveColumns(resp.enabledColumnsArchives, function(data) {
                    that.columns = data;
                });
                that.list = angular.copy(resp.savedFilters);
                that.list[$scope.unsavedFilterName] = "";
            });
            $scope.$watch("dashboard.showed", function() {
                //Sélection du filtre par défaut
                if(!that.hasSelectFilter) {
                    that.navigation.selected = $scope.noFilterName;
                } else {
                    that.hasSelectFilter = false;
                }
            }, true);
            //Copie du filtre pour éviter le bind
            this.showed = angular.copy(this.current);
        },
        //Sauvegarde d'un filtre
        save: function() {
            var that = this;
            //Lancement de modale pour le nom du filtre
            modals.launch("SimpleInput", {
                title: "Sauvegarde du filtre",
                message: "Merci de renseigner le nom du nouveau filtre",
                ctrl: InputController
            }, function(ret) {
                //Sauvegarde du filtre
                preferences.saveFilter(ret.value, that.current);
                //Sélection du nouveau filtre
                that.navigation.selected = ret.value;
            });
        },
        //Suppression d'un filtre
        remove: function() {
            //Suppression de la propriété
            preferences.removeProperty("savedFilters." + encodeURIComponent(this.navigation.selected));
            //Suppression de la liste actuelle
            delete this.list[this.navigation.selected];
            //Suppression de la selection du filtre
            this.navigation.selected = $scope.noFilterName;
            this.change();
        },
        //event -- Changement de filtre sauvegardé
        change: function() {
            if (this.navigation.selected === $scope.unsavedFilterName) {
                angular.copy([], $scope.metaFilter);
            }
            else if (this.navigation.selected) {
                this.hasSelectFilter = true;
                this.navigation.currentPage = 0;
                var filter = JSON.parse(this.list[this.navigation.selected]);
                angular.copy(filter, this.current);
                angular.copy(filter, this.showed);
                $scope.metaFilter = angular.copy(this.current.metadonnees);
            } else {
                this.navigation.selected = $scope.noFilterName;
                this.resetFilter();
            }
            getDossiers();
        },
        //On applique le filtre actuel puis récupération de dossiers
        doFilter: function() {
            //Page 0
            this.navigation.currentPage = 0;
            //Si on recherche par contenu, changement de corbeille
            //Copie du filtre temporaire vers le filtre actuel
            angular.copy(this.showed, this.current);
            this.current.metadonnees = angular.copy($scope.metaFilter);
            //Si il n'y a pas eu de changement de corbeille, récupération des dossiers
            getDossiers();
        },
        resetFilter: function() {
            //On Réinitialise le filtre

            this.showed = angular.extend({
                types: [],
                subtypes: [],
                dateTo: "",
                dateFrom: "",
                title: "",
                metadonnees: []
            });
            angular.copy(this.showed, this.current);

            $scope.metaFilter = angular.copy([]);
            getDossiers();
        }
    };

    $scope.dashboard.init();
    //6----------9\\

    var extractMeta = function(columns) {
        var metas = [];
        $.each(columns, function(index, value) {
            if(~value.indexOf("cu:")) {
                metas.push(value);
            }
        });
        return JSON.stringify({metas : metas});
    };
    /**
     * Fonction principale de la page de dashboard
     * Récupération de dossiers
     */
    var getDossiers = function() {
        //Clean des checkbox
        //Clean des dossiers selectionnés
        $scope.dossiersToDo = angular.copy({});
        //Désactivation des bouttons pour changement de page
        navigationService.archives.hasNext = false;
        navigationService.archives.hasPrev = false;
        //Récupération de la dernière valeur de 'skipped'
        var skipped = navigationService.archives.currentPage > 0 ? navigationService.archives.skipped[navigationService.archives.currentPage - 1] : 0;
        //Récupération des dossiers
        $scope.dossiers = Archives.list({
            pageSize : prefs.pagesizeArchives,
            page : navigationService.archives.currentPage,
            skipped : skipped,
            sort : navigationService.archives.currentChamp,
            asc : navigationService.archives.ascBase,
            filter : utils.generateFilter(navigationService.currentFilterArchive),
            metas : extractMeta($scope.prefs.enabledColumnsArchives)
        }, function() {
            //pour affichage ou non de la pagination
            if($scope.dossiers.length > 0) {
                navigationService.archives.hasNext = $scope.dossiers[0].total > prefs.pagesizeArchives;
                navigationService.archives.skipped[navigationService.archives.currentPage] = $scope.dossiers[0].skipped;
            }
            navigationService.archives.hasPrev = navigationService.archives.currentPage > 0;
        });
    };
    //6----------9\\

    $scope.translateFilter = function(name) {
        if (name === $scope.unsavedFilterName) {
            return $filter('translate')(name);
        }
        else {
            return name;
        }
    };

    //Récupération des dossiers
    getDossiers();

    //Handle notifications
    $scope.$on('notificationReceived', function(event, obj) {
        //Handle archives notifs

    });

    $scope.removeSlash = function (title) {
        return title.replace(/\//g, '-');
    };

    //Colorations
    var coloration = JSON.parse($scope.prefs.coloration);

    $scope.checkColoration = function(dossier) {
        var color = "";
        var background = "";
        var passed = false;
        $.each(coloration, function(index, value) {
            var locallyPassed = false;
            if(dossier[value.property.value] !== undefined && !passed) {
                $.each(value.test, function(jndex, jalue) {
                    switch(jalue.comparator) {
                        case "=" :
                            locallyPassed = jalue.value === dossier[value.property.value] + "";
                            break;
                        case "!=" :
                            locallyPassed = jalue.value !== dossier[value.property.value] + "";
                            break;
                    }
                });
            }
            if(locallyPassed) {
                passed = true;
                color = value.textColor;
                background = value.backgroundColor;
            }
        });
        return passed ? '{"background-color":"'+background+' !important", "color":"'+color+' !important"}' : '';
    };
}
ArchivesController.$inject = ['$scope', 'Metadonnees', 'Types', 'Archives', 'navigationService', 'viewService', 'preferences', 'utils', 'modals', '$filter']; // For JS compilers;
//Controller for bureau page
function BureauController($scope, $rootScope, navigationService, prefs, bureaux) {
    "use strict";
    $scope.selectBureau = function (bureau) {
        $rootScope.currentBureau = bureau;
        navigationService.bureauCourant = bureau;
    };

    //Construction des bureaux ordonnés
    if (!$rootScope.orderedBureaux) {
        $rootScope.orderedBureaux = [];
        /** Trust me
         * @namespace prefs.bureauxOrder */
        if (prefs.bureauxOrder !== undefined) {
            var array = JSON.parse(prefs.bureauxOrder),
                added = [],
                i,
                j,
                k;
            //Ajout des bureaux ordonnés
            for (i = 0; i < array.length; i++) {
                for (j = 0; j < bureaux.length; j++) {
                    if (bureaux[j].id === array[i]) {
                        $rootScope.orderedBureaux.push(bureaux[j]);
                        added[j] = true;
                    }
                }
            }
            //Ajout des bureaux non ajoutés
            for (k = 0; k < bureaux.length; k++) {
                if (!added[k]) {
                    $rootScope.orderedBureaux.push(bureaux[k]);
                }
            }
        } else {
            $rootScope.orderedBureaux = bureaux;
        }
    }
}
BureauController.$inject = ['$scope', '$rootScope', 'navigationService', 'prefs', 'bureaux']; // For JS compilers;
//Controller for dashboard page
function DashboardController($rootScope, $scope, Metadonnees, Types, Dossiers, Delegations, navigationService, viewService, preferences, $location, modals, utils, configuration, corbeilleFromMail, $timeout, $filter, cache) {

    //Lors du click sur une colomne sortable -> réorganisation
    $scope.sortTable = function (column) {
        if (column) {
            var sortColumn = ~column.value.indexOf("cu:") ? column.value : column.key;
            navigationService.dash.currentChamp === sortColumn ? navigationService.dash.ascBase = !navigationService.dash.ascBase : navigationService.dash.currentChamp = sortColumn;
            getDossiers();
        }
    };
    //6----------9\\

    $scope.defaultFilterName = 'dashboard.Default';
    $scope.unsavedFilterName = 'dashboard.Unsaved_filter';

    /**
     * Partie filtrage avancé
     */
    //Liste des metadonnées
    $scope.metadonnees = Metadonnees.list({type: "", sousType: ""});

    // Liste toutes les métadonnées pour validation d'étape sur circuit
    cache.metadonnees.list(false).then(function(metaList) {
        $scope.allmetadonnees = metaList;
    });
    //Metadonnée selectionnée
    $scope.selectedMetadonnee = {};
    //Filtre en cours d'édition
    $scope.metaTmpFilter = {};
    //Liste de conditions sur les metadonnées
    $scope.metaFilter = [];
    //Index selectionné pour le filtre en cours de création et en cours d'édition
    $scope.selectedMetadonneeIndex = {
        index: "",
        bis: ""
    };
    //Récupération du filtre stocké dans le storage
    angular.copy(navigationService.currentFilter.metadonnees, $scope.metaFilter);
    var selectedIndex = undefined;

    //FONCTION APPELLEE LORS DU CHANGEMENT DU PREMIER SELECT
    $scope.createAdvancedFilter = function (index) {
        $scope.selectedMetadonneeIndex.bis = "";
        $scope.metaTmpFilter = angular.copy($scope.metadonnees[index]);
        selectedIndex = undefined;
    };
    //FONCTION APPELLEE LORS DE LA SELECTION D'UN FILTRE DEJA EXISTANT
    $scope.selectAdvancedFilter = function (index) {
        $scope.selectedMetadonneeIndex.index = "";
        $scope.metaTmpFilter = $scope.metaFilter[index];
        selectedIndex = index;
    };
    //Sauvegarde du filtre avancé
    $scope.saveAdvancedFilter = function () {
        $scope.editAdvancedFilter();
        $scope.selectedMetadonneeIndex.bis = "";
        selectedIndex = undefined;
        $scope.metaTmpFilter = angular.copy($scope.metadonnees[$scope.selectedMetadonneeIndex.index]);

        angular.copy($scope.metaFilter, $scope.dashboard.showed.metadonnees);
        $scope.dashboard.changed();
    };
    //Suppression du filtre avancé
    $scope.deleteAdvancedFilter = function () {
        $scope.metaFilter.splice(selectedIndex, 1);
        $scope.selectedMetadonneeIndex.bis = "";
        $scope.metaTmpFilter = angular.copy({});
        selectedIndex = undefined;
        angular.copy($scope.metaFilter, $scope.dashboard.showed.metadonnees);
        $scope.dashboard.changed();
    };
    //FONCTION APPELLEE LORS DE L'EDITION D'UN FILTRE EXISTANT OU NON
    $scope.editAdvancedFilter = function () {
        var isDefined = selectedIndex !== undefined;
        selectedIndex = !isDefined && $scope.metaFilter ? $scope.metaFilter.length : selectedIndex;

        // Special case for checkboxes, metaTmpFilter.text is undefined right after loading
        if ($scope.metaTmpFilter.type === "BOOLEAN" && (!$scope.metaTmpFilter.text)) {
            $scope.metaTmpFilter.text = "false";
        }

        if ($scope.metaTmpFilter.text || $scope.metaTmpFilter.dateFrom || $scope.metaTmpFilter.dateTo) {
            $scope.metaFilter[selectedIndex] = angular.copy($scope.metaTmpFilter);
        } else if (isDefined) {
            $scope.metaFilter.splice(selectedIndex, 1);
            $scope.selectedMetadonneeIndex.bis = "";
            selectedIndex = undefined;
        }
    };
    //6----------9\\

    /**
     * Délégations
     */
    $scope.delegation = {
        current: {},
        timestamp: new Date().getTime(),
        showed: true,
        hasToShow: false,
        dossiers: navigationService.bureauCourant["dossiers-delegues"],
        titulaires: [],
        init: function (hasToShow) {
            var that = this;
            this.current = Delegations.get({id: navigationService.bureauCourant.id});
            Delegations.titulaires({id: navigationService.bureauCourant.id}, function (ret) {
                angular.extend(that, ret);
            });
            this.hasToShow = hasToShow;
        },
        showDossiers: function () {
            navigationService.currentFilter.dossier = "dossiers-delegues";
            getDossiers();
        }
    };

    /**
     * Récupération des préferences et initialisation des colonnes
     */
    var prefs;

    /**
     * Gestion de la Navigation
     */
    //récupération des données de navigation du dashboard
    $scope.nav = navigationService.dash;

    //Changement de page
    $scope.changePage = function (next) {
        if (next && navigationService.dash.hasNext || !next && navigationService.dash.hasPrev) {
            navigationService.dash.currentPage += next ? 1 : -1;
            getDossiers();
        }
    };
    //6----------9\\;
    /**
     * Partie filtrage basique
     */
    //Initialisation de la typologie
    $scope.typo = Types.query();

    //Récupération du filtre actuel
    $scope.currentFilter = navigationService.currentFilter;
    //Nom complet des banettes
    $scope.corbeilleList = viewService.corbeillesList;
    $scope.corbeillesListFilter = viewService.corbeillesListFilter(navigationService.bureauCourant.isSecretaire, navigationService.bureauCourant.show_a_venir);

    $scope.dashboard = {
        //Liste des filtres sauvegardés
        list: {},
        //Filtre temporaire (en cours de création) et filtre en cours
        showed: {},
        //Filtre courant, sur lequel la dernière requête à été faite. Ce filtre reste en mémoire entre les pages (navigationService)
        current: navigationService.currentFilter,
        //Elements de navigation -- Objet sauvegardé en localstorage
        navigation: navigationService.dash,
        //Recherche de contenu
        content: "false",
        //Colones affichées
        columns: [],
        //Préférences
        prefs: {},
        //Initialisation de l'objet handler du dashboard
        init: function () {
            if ($.isEmptyObject(navigationService.bureauCourant)) {
                $location.path("/bureaux");
                return;
            }
            angular.copy([], $scope.metaFilter);
            var that = this;
            this.prefs = preferences.initPreferences(function (resp) {
                prefs = resp;
                $scope.delegation.init(resp.displayDelegation);
                //Récupération de l'ordre d'affichage des colonnes
                viewService.getDashboardColumns(resp.enabledColumns, function (data) {
                    that.columns = data;
                });
                that.list = angular.copy(resp.savedFilters);
                that.list[$scope.unsavedFilterName] = "";

                navigationService.dash.currentChamp = resp.propSort;
                navigationService.dash.ascBase = resp.asc;
                if (resp.filterDefault && navigationService.hasToSetDefaultFilter && !corbeilleFromMail) {
                    that.navigation.selected = resp.filterDefault;
                    that.change();
                } else {
                    if (corbeilleFromMail) {
                        that.resetFilter();
                        navigationService.currentFilter.dossier = corbeilleFromMail;
                        corbeilleFromMail = undefined;
                    }
                    that.showed.dossier = navigationService.currentFilter.dossier =
                        navigationService.currentFilter.dossier == "a-venir" && !navigationService.bureauCourant.show_a_venir ?
                            "a-traiter" : navigationService.currentFilter.dossier;
                    if (!hasGetDossiersInEvent) {
                        getDossiers();
                    }
                }
            });
            //Copie du filtre pour éviter le bind
            this.showed = angular.copy(this.current);
            $scope.$watch("dashboard.showed", function () {
                that.changed();
            }, true);
        },
        changed: function () {

            var that = this;

            // If the user did change something in its filter, we switch to the "Unsaved filter" selectable.
            
            if (!angular.equals(that.showed, that.current)) {
                that.navigation.selected = $scope.unsavedFilterName;
            } else if (!that.navigation.selected) {
                angular.copy($scope.defaultFilterName, that.navigation.selected);
            }
        },
        //Sauvegarde d'un filtre
        save: function () {
            var that = this;
            angular.copy($scope.metaFilter, that.showed.metadonnees);

            //Lancement de modale pour le nom du filtre
            modals.launch("SimpleInput", {
                title: "Enregistrer le filtre",
                message: "Merci de renseigner le nom du nouveau filtre",
                ctrl: InputController
            }, function (ret) {

                // Send create request and save locally
                preferences.saveFilter(ret.value, that.showed);
                that.list[ret.value] = JSON.stringify(that.showed);

                // Select the new one as current
                that.navigation.selected = ret.value;
                that.change();
            });
        },
        //Suppression d'un filtre
        remove: function () {
            //Suppression de la propriété
            preferences.removeFilter(this.navigation.selected);
            //Suppression de la liste actuelle
            delete this.list[this.navigation.selected];
            //Suppression de la selection du filtre
            this.navigation.selected = $scope.defaultFilterName;
            this.change();
        },

        //event -- Changement de filtre sauvegardé
        change: function () {

            if (this.navigation.selected === $scope.unsavedFilterName) {
                angular.copy([], $scope.metaFilter);
            }
            else {
                this.navigation.currentPage = 0;
                var filter = {dossier: "a-traiter", types: [], subtypes: [], metadonnees: []};

                if (this.navigation.selected !== $scope.defaultFilterName) {
                    try {
                        filter = JSON.parse(this.list[this.navigation.selected]);
                    } catch (e) {
                        // Can't parse json
                    }
                }

                filter.dossier = filter.dossier == "a-venir" && !navigationService.bureauCourant.show_a_venir ? "a-traiter" : filter.dossier;
                angular.copy(filter, this.current);
                angular.copy(filter, this.showed);
                angular.copy(filter.metadonnees, $scope.metaFilter);
                angular.copy(filter, navigationService.currentFilter);
            }

            getDossiers();

            // Reset advanced filters selection
            $scope.selectAdvancedFilter("");
        },

        //On applique le filtre actuel puis récupération de dossiers
        doFilter: function () {
            //Page 0
            this.navigation.currentPage = 0;
            //Si on recherche par contenu, changement de corbeille
            /** @namespace $scope.searchContent */
            if (this.searchContent === "true") this.showed.dossier = "content";
            //Copie du filtre temporaire vers le filtre actuel
            angular.copy(this.showed, this.current);
            this.current.metadonnees = angular.copy($scope.metaFilter);
            //Récupération des dossiers
            getDossiers();
        },
        resetFilter: function () {
            if (this.prefs.filterDefault && !corbeilleFromMail) {
                this.navigation.selected = this.prefs.filterDefault;
                this.change();
            } else {
                navigationService.currentFilter.types.length = 0;
                navigationService.currentFilter.subtypes.length = 0;
                navigationService.currentFilter.metadonnees.length = 0;
                delete navigationService.currentFilter.dateFrom;
                delete navigationService.currentFilter.dateTo;
                delete navigationService.currentFilter.title;
                //On Réinitialise le filtre
                this.showed = angular.copy(navigationService.currentFilter);
                this.navigation.selected = "";
                if (this.searchContent === "true") {
                    this.searchContent = "false";
                    this.change();
                } else {
                    getDossiers();
                }
            }
        }
    };

    //6----------9\\

    //Flag pour fonction en cours d'execution
    var currentlyRetainDossiers = false;
    //Flag pour nécéssité d'executer la fonction (si appels concurentiels
    var hasToRetainDossiers = false;
    //Récupération des dossiers dynamiques (la liste des dossiers n'est pas directement supprimé, pour avoir un effet de fluidité)
    var getDossiersRetain = function () {
        var skipped = navigationService.dash.currentPage > 0 ? navigationService.dash.skipped[navigationService.dash.currentPage - 1] : 0;
        var pendingNumber = navigationService.dash.currentPage > 0 ? navigationService.dash.pendingNumber[navigationService.dash.currentPage - 1] : 0;
        if (!currentlyRetainDossiers) {
            //Si un getDossier est en cours d'execution, il faudra réexecuter le getDossiersRetain pour la mise à jour des notifications
            if (currentlyGetDossiers) {
                hasToRetainDossiers = true;
            }
            currentlyRetainDossiers = true;
            Dossiers.list({
                bureau: navigationService.bureauCourant.id,
                pageSize: prefs.pagesize,
                page: navigationService.dash.currentPage,
                corbeilleName: navigationService.currentFilter.dossier,
                skipped: skipped,
                pendingFile: pendingNumber,
                sort: navigationService.dash.currentChamp,
                asc: navigationService.dash.ascBase,
                filter: utils.generateFilter(navigationService.currentFilter),
                metas: extractMeta($scope.prefs ? $scope.prefs.enabledColumns : undefined)
            }, function (data) {
                //Clean des checkbox
                $scope.setAllCheck(false);
                //Clean des dossiers selectionnés
                $scope.dossiersToDo = angular.copy({});
                $scope.dossiers = data;
                //pour affichage ou non de la pagination
                if ($scope.dossiers.length > 0) {
                    navigationService.dash.hasNext = $scope.dossiers[0].total > prefs.pagesize;
                    navigationService.dash.skipped[navigationService.dash.currentPage] = $scope.dossiers[0].skipped;
                    navigationService.dash.pendingNumber[navigationService.dash.currentPage] = $scope.dossiers[0].pendingFile;
                }
                navigationService.dash.hasPrev = navigationService.dash.currentPage > 0;
                //Gestion des actions possibles (VISA === SIGNATURE === CACHET)
                for (var i = 0; i < $scope.dossiers.length; i++) {
                    var dossier = $scope.dossiers[i];
                    var present = false;
                    if (dossier.actions.indexOf("VISA") !== -1) {
                        dossier.actions.splice(dossier.actions.indexOf("VISA"), 1);
                        present = true;
                    } else if (dossier.actions.indexOf("SIGNATURE") !== -1) {
                        dossier.actions.splice(dossier.actions.indexOf("SIGNATURE"), 1);
                        present = true;
                    } else if (dossier.actions.indexOf("CACHET") !== -1) {
                        dossier.actions.splice(dossier.actions.indexOf("CACHET"), 1);
                        present = true;
                    }
                    if (present) {
                        dossier.actions.push("VALIDATION");
                    }
                }
                currentlyRetainDossiers = false;
            });
        }
    };

    var handleDashboardNotif = function (obj) {
        //Handle dashboard notifs
        if (obj.bureauId === navigationService.bureauCourant.id) {
            if (~obj.banettes.indexOf("dossiers-delegues") && obj.state !== "ERROR") {
                if (obj.state === "NEW") {
                    $scope.delegation.dossiers++;
                } else if (obj.state === "END") {
                    $scope.delegation.dossiers--;
                }
            }
            if (~obj.banettes.indexOf($scope.currentFilter.dossier) && obj.state !== "ERROR") {
                if (obj.state === "NEW") {
                    $timeout.cancel(getDossiersPromise);
                    getDossiersPromise = $timeout(function () {
                        getDossiersRetain();
                    }, 1000);
                } else if (obj.state === "END") {
                    var removedFromList = removeDossierFromList(obj.id);
                    /**
                     * ATTENTION ICI ! On ne récupère pas tout le temps les dossiers,
                     * ce n'est pas nécéssaire et surtout overkill !!!
                     *
                     * On récupère seulement s'il y a une page suivante
                     */
                    if(removedFromList && navigationService.dash.hasNext) {
                        $scope.loaded = false;
                        getDossiers();
                        $scope.loaded = true;
                    }
                } else if(obj.state === "EMITTED") {
                    setDossierSent(obj.id);
                    removePendingFromDossier(obj.id);
                }
            } else {
                removePendingFromDossier(obj.id);
            }
        } else {
            removePendingFromDossier(obj.id);
        }
    };

    var handleHandlingNotifs = function () {
        var obj = $scope.notifsReceived.pop();
        while (obj != undefined) {
            handleDashboardNotif(obj);
            obj = $scope.notifsReceived.pop();
        }
    };

    /**
     * Lors de la réception d'une notification de fin de traitement, on doit enlever le dossier de la liste affichée
     * @param id l'id du dossier à enlever de la liste
     */
    var removePendingFromDossier = function (id) {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            var dossier = $scope.dossiers[i];
            if (dossier.id === id) {
                $scope.dossiers[i].locked = false;
            }
        }
    };

    var setDossierSent = function (id) {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            var dossier = $scope.dossiers[i];
            if (dossier.id === id) {
                $scope.dossiers[i].isSent = true;
                $scope.dossiers[i].actions = [
                    "EMAIL",
                    "JOURNAL",
                    "SECRETARIAT"
                ]
            }
        }
    };

    /**
     * Lors de la réception d'une notification de fin de traitement, on doit enlever le dossier de la liste affichée
     * @param id l'id du dossier à enlever de la liste
     */
    var removeDossierFromList = function (id) {
        for (var i = 0; i < $scope.dossiers.length; i++) {
            var dossier = $scope.dossiers[i];
            if (dossier.id === id) {
                $scope.dossiers.splice(i, 1);
                if ($scope.dossiers.length < (prefs.pagesize / 2) && (navigationService.dash.hasNext || navigationService.dash.hasPrev)) {
                    getDossiersRetain();
                } else {
                    $scope.setAllCheck(false);
                }
                return true;
            }
        }
        return false;
    };

    //Get dossier en cours d'execution
    var currentlyGetDossiers = false;
    var extractMeta = function (columns) {
        var metas = [];
        $.each(columns, function (index, value) {
            if (~value.indexOf("cu:")) {
                metas.push(value);
            }
        });
        return JSON.stringify({metas: metas});
    };
    $scope.loaded = false;
    $scope.error = false;
    $scope.errorMessage = "";
    /**
     * Fonction principale de la page de dashboard
     * Récupération de dossiers
     */
    var getDossiers = function () {
        $scope.error = false;
        $scope.errorMessage = "";
        $scope.loaded = false;
        //Clean des checkbox
        $scope.setAllCheck(false);
        //Clean des dossiers selectionnés
        $scope.dossiersToDo = angular.copy({});
        //Désactivation des bouttons pour changement de page
        navigationService.dash.hasNext = false;
        navigationService.dash.hasPrev = false;
        //Récupération de la dernière valeur de 'skipped'
        var skipped = navigationService.dash.currentPage > 0 ? navigationService.dash.skipped[navigationService.dash.currentPage - 1] : 0;
        var pendingNumber = navigationService.dash.currentPage > 0 ? navigationService.dash.pendingNumber[navigationService.dash.currentPage - 1] : 0;
        currentlyGetDossiers = true;
        //Récupération des dossiers
        Dossiers.list({
            bureau: navigationService.bureauCourant.id,
            pageSize: prefs.pagesize,
            page: navigationService.dash.currentPage,
            corbeilleName: navigationService.currentFilter.dossier,
            skipped: skipped,
            pendingFile: pendingNumber,
            sort: navigationService.dash.currentChamp,
            asc: navigationService.dash.ascBase,
            filter: utils.generateFilter(navigationService.currentFilter),
            metas: extractMeta($scope.prefs ? $scope.prefs.enabledColumns : undefined)
        }, function (data) {
            $scope.dossiers = data;
            //pour affichage ou non de la pagination
            if ($scope.dossiers.length > 0) {
                navigationService.dash.hasNext = $scope.dossiers[0].total > prefs.pagesize;
                navigationService.dash.skipped[navigationService.dash.currentPage] = $scope.dossiers[0].skipped;
                navigationService.dash.pendingNumber[navigationService.dash.currentPage] = $scope.dossiers[0].pendingFile;
            }
            navigationService.dash.hasPrev = navigationService.dash.currentPage > 0;
            //Gestion des actions possibles (VISA === SIGNATURE === CACHET)
            for (var i = 0; i < $scope.dossiers.length; i++) {
                var dossier = $scope.dossiers[i];
                var present = false;
                if (dossier.actions.indexOf("VISA") !== -1 && dossier.actionDemandee === "VISA") {
                    dossier.actions.splice(dossier.actions.indexOf("VISA"), 1);
                    present = true;
                } else if (dossier.actions.indexOf("SIGNATURE") !== -1 && dossier.actionDemandee === "SIGNATURE") {
                    dossier.actions.splice(dossier.actions.indexOf("SIGNATURE"), 1);
                    present = true;
                } else if (dossier.actions.indexOf("CACHET") !== -1 && dossier.actionDemandee === "CACHET") {
                    dossier.actions.splice(dossier.actions.indexOf("SIGNATURE"), 1);
                    present = true;
                }
                if (present) {
                    dossier.actions.unshift("VALIDATION");
                }
            }

            $scope.loaded = true;

            currentlyGetDossiers = false;
            if (hasToRetainDossiers) {
                getDossiersRetain();
            }
            handleHandlingNotifs();
        }, function () {
            //Erreur lors de la récupération des dossiers
            $scope.error = true;
            $scope.errorMessage = "Erreur lors de la récupération des dossiers.";
            $scope.loaded = true;
        });
    };
    //6----------9\\

    /**
     * Gestion des checkbox
     */
    //Checkboxes dossiers
    $scope.checkboxDossier = [];
    //Initialisation de la variable stockant les dossiers selectionnés
    $scope.dossiersToDo = [];
    //Initialisation des checkbox
    $scope.setAllCheck = function (toSet) {
        if ($scope.dossiers) {
            $scope.checkboxDossier.length = 0;
            for (var i = 0; i < $scope.dossiers.length; i++) {
                $scope.checkboxDossier[i] = toSet;
            }
        }
    };
    $scope.masterCheckbox = false;
    //Au changement de checkbox, vérification de la master
    $scope.$watch('checkboxDossier', function () {
        $scope.masterCheckbox = $.inArray(false, $scope.checkboxDossier) === -1 && $scope.checkboxDossier.length > 0;
        $scope.dossiersToDo = [];
        for (var i = 0; i < $scope.checkboxDossier.length; i++) {
            if ($scope.checkboxDossier[i]) {
                $scope.dossiersToDo.push($scope.dossiers[i]);
            }
        }
    }, true);
    //6----------9\\

    //Récupération des dossiers
    //getDossiers();
    $scope.selectDossier = function (dossier) {
        navigationService.dossierToEdit = dossier.id;
    };

    // ATTENTION ! Ne définir cet événement qu'une seule fois !!!
    //En cas de changement de corbeille à partir de la barre de navigation
    var hasGetDossiersInEvent = false;
    $rootScope.eventGetDossiers = $rootScope.$on('getDossiers', function (ev) {
        navigationService.currentFilter.types.length = 0;
        navigationService.currentFilter.subtypes.length = 0;
        navigationService.currentFilter.metadonnees.length = 0;
        delete navigationService.currentFilter.dateFrom;
        delete navigationService.currentFilter.dateTo;
        delete navigationService.currentFilter.title;
        //On Réinitialise le filtre
        $scope.dashboard.showed = angular.copy(navigationService.currentFilter);
        $scope.dashboard.navigation.selected = $scope.unsavedFilterName;
        navigationService.dash.currentPage = 0;
        hasGetDossiersInEvent = true;
        getDossiers();
    });

    $scope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.eventGetDossiers();
    });

    /**
     * Gestion des fenetres modales
     */
    var getDossierModal = function () {
        return $scope.dossiersToDo;
    };
    $scope.launchModal = function (action) {
        modals.launch(action, getDossierModal, function () {
            //getDossiersRetain();
        });
    };
    $scope.checkReadAndLaunchModal = function (action) {
        var hasToValidate = false;
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            var dossier = $scope.dossiersToDo[i];
            hasToValidate = hasToValidate || dossier.actionDemandee === "SIGNATURE" && !dossier.hasRead && configuration.properties["parapheur.ihm.confirmbox.read"] === "true";

        }
        if (hasToValidate) {
            modals.launch("base", {
                title: "Attestation de lecture",
                message: "Je reconnais avoir pris connaissance des documents sélectionnés",
                template: 'partials/modals/readConfirmModal.html',
                ctrl: BaseController
            }, function () {
                modals.launch(action, getDossierModal);
            });
        } else {
            modals.launch(action, getDossierModal);
        }
    };
    //6----------9\\

    var getDossiersPromise;
    $scope.notifsReceived = [];
    //Handle notifications
    $scope.$on('notificationReceived', function (event, obj) {

        if ($scope.loaded) {
            handleDashboardNotif(obj);
        } else {
            $scope.notifsReceived.push(obj);
        }

    });

    $scope.$watch("flags.backdrop", function (val) {
        if (!val) {
            $scope.setAllCheck(false);
        }
    });

    //Colorations
    if ($scope.prefs) {
        var coloration = JSON.parse($scope.prefs.coloration);
    }

    $scope.checkColoration = function (dossier) {
        var color = "";
        var background = "";
        var passed = false;
        $.each(coloration, function (index, value) {
            var locallyPassed = false;
            if (dossier[value.property.value] !== undefined && !passed) {
                $.each(value.test, function (jndex, jalue) {
                    switch (jalue.comparator) {
                        case "=" :
                            locallyPassed = jalue.value === dossier[value.property.value] + "";
                            break;
                        case "!=" :
                            locallyPassed = jalue.value !== dossier[value.property.value] + "";
                            break;
                    }
                });
            }
            if (locallyPassed) {
                passed = true;
                color = value.textColor;
                background = value.backgroundColor;
            }
        });
        return passed ? '{"background-color":"' + background + ' !important", "color":"' + color + ' !important"}' : '';
    };

    $scope.isDossierLockedInSelection = function () {
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            if ($scope.dossiersToDo[i].locked) {
                return true;
            }
        }
        return false;
    };

    $scope.isSignPapier = function () {
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            if ($scope.dossiersToDo[i].isSignPapier) {
                return true;
            }
        }
        return false;
    };

    $scope.isOnlySignature = function () {
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            if ($scope.dossiersToDo[i].actionDemandee !== 'SIGNATURE') {
                return false;
            }
        }
        return true;
    };

    $scope.isOnlyCachet = function () {
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            if ($scope.dossiersToDo[i].actionDemandee !== 'CACHET') {
                return false;
            }
        }
        return true;
    };

    $scope.isOnlyVisa = function () {
        for (var i = 0; i < $scope.dossiersToDo.length; i++) {
            if ($scope.dossiersToDo[i].actionDemandee !== 'VISA') {
                return false;
            }
        }
        return true;
    };

    $scope.readDossier = function (dossier) {
        if (~dossier.actions.indexOf('REJET') && !dossier.hasRead) {
            //Lecture OK
            dossier.hasRead = true;
            dossier.isRead = true;
            //Ajout des actions si lecture obligatoire
            if (dossier.readingMandatory) {
                dossier.actions.push("SIGNATURE");
            }
        }
    };

    $scope.$on('$routeChangeStart', function (next, current) {
        $scope.dossiersToDo = [];
    });

    // <editor-fold desc="dashboard.html">

    $scope.translateFilter = function (name) {
        if (name === $scope.unsavedFilterName) {
            return $filter('translate')(name);
        }
        else {
            return name;
        }
    };

    $scope.getIconClass = function (dossier, data) {
        var result = "fa";

        // Icon tag
        if (dossier.banetteName === 'Dossiers retournés') {
            result += ' text-danger';
        }
        else if (dossier.isSent) {
            result += ' text-orange';
        }

        switch(dossier[data.value].toLowerCase()) {
            case 'visa':
                result += ' fa-check-square-o';
                break;
            case 'signature':
                result += ' ls-signature';
                break;
            case 'mailsecpastell':
                result += ' fa-envelope-o';
                break;
            case 'mailsec':
                result += ' fa-envelope';
                break;
            case 'tdt':
                result += ' fa-cloud-upload';
                break;
            case 'cachet':
                result += ' ls-stamp';
                break;
            default:
                result += ' fa-flag-checkered';
                break;
        }


        return result;
    };

    $scope.getActionTooltip = function (dossier, data) {
        var tooltip = "Fin de circuit";

        switch(dossier[data.value].toLowerCase()) {
            case 'visa':
                tooltip = 'Visa';
                break;
            case 'signature':
                tooltip = 'Signature';
                break;
            case 'mailsecpastell':
                tooltip = 'Mail sécurisé Pastell';
                break;
            case 'mailsec':
                tooltip = 'Mail sécurisé S²LOW';
                break;
            case 'tdt':
                tooltip = 'Télé-transmission';
                break;
            case 'cachet':
                tooltip = 'Cachet serveur';
                break;
            default:
                break;
        }

        if (dossier.banetteName === 'Dossiers retournés') {
            tooltip += ' rejeté';
            if(dossier[data.value].toLowerCase() === "signature" || dossier[data.value].toLowerCase() === "tdt") {
                tooltip += 'e';
            }
        }

        if (dossier.isSent) {
            tooltip += ' envoyé';
            if(dossier[data.value].toLowerCase() === "tdt") {
                tooltip += 'e';
            }
        }

        return tooltip;
    };


    $scope.getFileExtIcon = function(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        ext = ext === null ? "" : ext[1].toLowerCase();

        var iconName = "fa-";

        switch(ext) {
            case 'pdf':
                iconName += "file-pdf-o";
                break;
            case 'zip':
                iconName += "file-archive-o";
                break;
            case 'xml':
                iconName += "file-code-o";
                break;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                iconName += "file-image-o";
                break;
            case 'pptx':
            case 'ppt':
            case 'odp':
                iconName += "file-powerpoint-o";
                break;
            case 'xlsx':
            case 'xls':
            case 'ods':
                iconName += "file-excel-o";
                break;
            case 'docx':
            case 'doc':
            case 'odt':
            case 'rtf':
            case 'txt':
            case 'htm':
            case 'html':
                iconName += "file-word-o";
        }

        return iconName;
    };

    $scope.getIconSrc = function (dossier, data) {
        var result = configuration.context + '/res/images/';

        // Icon tag
        if (dossier.banetteName === 'Dossiers retournés') {
            result += 'ir-';
        }
        else if (dossier.isSent) {
            result += 'ic-';
        }
        else {
            result += 'iw-';
        }

        // Icon name
        result += dossier[data.value].toLowerCase() + '.png';

        return result;
    };

    $scope.getReadMandatoryTooltip = function (dossier) {
        var result;

        if (dossier.hasRead) {
            result = $filter('translate')('dashboard.Read_folder');
        } else if (dossier.readingMandatory && dossier.actionDemandee === 'SIGNATURE') {
            result = $filter('translate')('dashboard.Unread_folder_with_mandatory_reading');
        } else {
            result = $filter('translate')('dashboard.Unread_folder');
        }

        return result;
    };

    // </editor-fold desc="dashboard.html">

    $scope.dashboard.init();
}
DashboardController.$inject = ['$rootScope', '$scope', 'Metadonnees', 'Types', 'Dossiers', 'Delegations', 'navigationService', 'viewService', 'preferences', '$location', 'modals', 'utils', 'configuration', 'corbeilleFromMail', '$timeout', '$filter', 'cache']; // For JS compilers;
var DelegationController = function($scope, $location, $timeout, Delegations, Bureaux, navigationService) {

    if($.isEmptyObject(navigationService.bureauCourant)) {
        $location.path("/bureaux");
        return;
    }

    var timestamp = new Date().getTime();

    $scope.bureau = new Bureaux(navigationService.bureauCourant);
    $scope.bureau.$associes(function(data) {
        $scope.bureau = data;
    });
    $scope.searchObj = {};
    $scope.saved = false;
    $scope.loaded = false;

    var handleDelegationView = function() {
        //Flag pour check de delegation activée - delegationEnabled statique
        $scope.delegationEnabled = angular.copy(!!$scope.selectedDelegation.idCible);
        $scope.delegationActivated = !!$scope.selectedDelegation.idCible;

        var debut = $scope.selectedDelegation['date-debut-delegation'] ? $scope.selectedDelegation['date-debut-delegation'] : 0;
        var fin = $scope.selectedDelegation['date-fin-delegation'] ? $scope.selectedDelegation['date-fin-delegation'] : Number.MAX_VALUE;

        if(debut < timestamp && fin > timestamp) {
            $scope.when = "present";
        } else if(fin < timestamp) {
            $scope.when = "past";
        } else {
            $scope.when = "future";
        }
    };

    //Get current delegation
    $scope.selectedDelegation = Delegations.get({id:$scope.bureau.id}, function() {
        handleDelegationView();
        if(!!$scope.selectedDelegation.idCible) {
            $scope.selectedBureauForDelegation = {
                id: $scope.selectedDelegation.idCible,
                title: $scope.selectedDelegation.titreCible
            };
        } else {
            $scope.selectedBureauForDelegation = undefined;
        }

        // If begin date is not defined, set it to 'now'
        if(!$scope.selectedDelegation['date-debut-delegation']) {
            $scope.selectedDelegation['date-debut-delegation'] = Date.now();
        }

        $scope.loaded = true;
    });

    //Sélection de la checkbox des délégations possibles
    $scope.checkDelegationPossible = function(checked, id) {
        var indexInArray = $scope.bureau['delegations-possibles'].indexOf(id);
        if(checked && indexInArray == -1) {
            $scope.bureau['delegations-possibles'].push(id);
        } else if(!checked && indexInArray != -1) {
            $scope.bureau['delegations-possibles'].splice(indexInArray, 1);
        }
    };

    $scope.checkDelegation = function(item) {
        if(!!item) {
            $scope.selectedDelegation.idCible = item.id;
        }
        if($scope.selectedDelegation.idCible && ($scope.selectedDelegation['date-debut-delegation'] || $scope.selectedDelegation['date-fin-delegation'])) {
            if($scope.selectedDelegation['date-fin-delegation']) {
                //On Décale la date de fin à 23h59... Pour prendre en compte la fin de journée sans devoir sélectionner le jour suivant
                var fin =  new Date($scope.selectedDelegation['date-fin-delegation']);
                $scope.selectedDelegation['date-fin-delegation'] = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate(), 23, 59, 0, 0).getTime();
            }
            $scope.selectedDelegation.$willItLoop();
        }
    };

    $scope.save = function() {
        $scope.selectedDelegation;
        //Le décalage de la date de fin a été fait lors de la vérification de boucle
        //Mise à jour de la délégation
        Delegations.update({id:$scope.bureau.id}, $scope.selectedDelegation, function() {
            $scope.saved = true;
            $timeout(function() {
                $scope.saved = false;
            }, 5000);
            handleDelegationView();
        });
    }
};
DelegationController.$inject = ['$scope', '$location', '$timeout', 'Delegations', 'Bureaux', 'navigationService']; // For JS compilers
;
//Controller for about page
function LogoutController(navigationService, $location) {
    if(navigationService.isLoggedIn) {
        $location.path("/bureaux");
    }
}
LogoutController.$inject = ['navigationService', '$location']; //For JS compilers;
//Controller for navbar
function NavbarController($rootScope, $route, $location, configuration, navigationService, preferences, viewService, notifications, utils, $http, $timeout, $filter) {
    $rootScope.isLoggedIn = navigationService.isLoggedIn;
    //Définition configuration (pour affichage icones admins)
    $rootScope.config = configuration;
    //Définition fichier de propriétés
    $rootScope.properties = configuration.properties;
    $rootScope.updateProperties = function(p) {
        $rootScope.properties = p;
        configuration.properties = p;
    };
    //Bureau en cours
    $rootScope.currentBureau = navigationService.bureauCourant;
    //Context de l'application
    $rootScope.context = configuration.context;
    //Nom de la page actuelle, pour icone 'active'
    $rootScope.pagename = function() {
        return $location.path();
    };
    //initialisation helpers rootscope
    $rootScope.empty = function(value) {
        return $.isEmptyObject(value);
    };

    $rootScope.isEmptyOrNull = function(value) {
        return !value || $.isEmptyObject(value);
    };

    $rootScope.log = function(toLog) {
        console.log(toLog);
    };
    //Preferences
    $rootScope.prefs = preferences.initPreferences();
    //Flags for view
    $rootScope.flags = viewService.flags;
    $rootScope.cleanCurrentDossier = function() {
        navigationService.dossierToEdit = undefined;
    };
    $rootScope.redirectToNew = function() {
        $location.path("/nouveau");
    };
    $rootScope.extension = function(file) {
        var ext = /^.+\.([^.]+)$/.exec(file);
        return ext === null ? "" : ext[1];
    };
    $rootScope.inArray = function(element, array) {
        return $.inArray(element, array) !== -1;
    };
    $rootScope.logout = function() {
        $rootScope.isLoggedIn = false;
        navigationService.isLoggedIn = false;
        navigationService.hasToReset = true;
    };
    $rootScope.login = function() {
        $rootScope.isLoggedIn = true;
        navigationService.isLoggedIn = true;
        navigationService.hasToReset = false;
        $location.path("/bureaux");
    };

    $rootScope.showBrand = true;
    $rootScope.logoLoaded = function() {
        $rootScope.showBrand = false;
    };

    //Binding
    $rootScope.showedNotifs = false;
    $rootScope.events = {};

    var eventsBureau = {
        success : {
            "a-traiter" : [],
            "en-preparation" : [],
            traite : [],
            "retournes" : [],
            "a-archiver" : [],
            archive : []
        },
        error : []
    };

    $rootScope.unread = 0;

    notifications.emit('binding', {userName: configuration.username});
    notifications.on('message', function(data) {
        var obj = $.parseJSON(data);
        $rootScope.$broadcast('notificationReceived', obj);
    });

    var errortask;

    //Pour mise à jour
    $rootScope.$on('notificationReceived', function(event, obj) {

        if(Object.keys($rootScope.events).indexOf(obj.bureauId) === -1) {
            $rootScope.events[obj.bureauId] = {};
            angular.extend($rootScope.events[obj.bureauId], angular.copy(eventsBureau));
        }

        //handleMessage(obj);

        if($rootScope.orderedBureaux) {
            for (var i = 0; i < $rootScope.orderedBureaux.length; i++) {
                if(obj.bureauId === $rootScope.orderedBureaux[i].id && obj.state !== "ERROR") {
                    handleMessageBureau(obj, $rootScope.orderedBureaux[i]);
                }
            }
        } else {
            if(obj.bureauId === navigationService.bureauCourant.id && obj.state !== "ERROR") {
                handleMessageBureau(obj, navigationService.bureauCourant);
            }
        }
        if(obj.state === "ERROR") {
            if(obj.action !== "TRANSFORM" && obj.action !== "GET_ATTEST") {
                $timeout.cancel(errortask);
                $rootScope.errorNotification = angular.copy(obj);

                if (!isNaN($rootScope.errorNotification.message)) {
                    $rootScope.errorNotification.message = $filter('translate')('ErrorCodes.' + $rootScope.errorNotification.message);
                }

                errortask = $timeout(function() {
                    $rootScope.errorNotification = {};
                }, 5000);
            }
        }
    });

    $rootScope.showFiltersWindow = function() {
        $timeout(function() {
            $rootScope.$broadcast("fixbottom");
        }, 400);
    };

    $rootScope.stopErrorTask = function() {
        $timeout.cancel(errortask);
    };

    $rootScope.startErrorTask = function() {
        errortask = $timeout(function() {
            $rootScope.errorNotification = {};
        }, 5000);
    };

    $rootScope.errorNotification = {};

    var handleMessageBureau = function(obj, bureau) {
        //Handle bureau
        var toAdd = obj.state === "NEW" ? 1 : obj.state === "END" ? -1 : 0;
        for(var i = 0; i < obj.banettes.length; i++) {
            bureau[obj.banettes[i]] += toAdd;
        }

        //Comparaison au niveau de a clé, en cas de non égalité des objets
        if($rootScope.currentBureau !== bureau) {
            //handleMessage(obj, false);
        }
    };


    var handleCorbeilleMessage = function(obj, corbeille) {
        if(~obj.banettes.indexOf(corbeille)) {
            if(obj.state === "NEW") {
                if(obj.bureauId === $rootScope.currentBureau.id) {
                    $rootScope.currentBureau[corbeille]++;
                }
            } else if(obj.state === "END") {
                if(obj.bureauId === $rootScope.currentBureau.id) {
                    $rootScope.currentBureau[corbeille]--;
                }
            }
        }
    };

    var handleMessage = function(obj) {
        if(obj.state !== "ERROR") {
            //SUCCESS
            handleCorbeilleMessage(obj, 'en-preparation');
            handleCorbeilleMessage(obj, 'secretariat');
            handleCorbeilleMessage(obj, 'a-traiter');
            handleCorbeilleMessage(obj, 'a-archiver');
            handleCorbeilleMessage(obj, 'retournes');
        }
    };

    $rootScope.asyncSelected = {title:""};

    $rootScope.selectAsyncDossier = function(model) {
        if ($rootScope.pagename() === "/archives") {
            navigationService.currentFilterArchive = {title:model.title};
            $route.reload();
        }
        else {
            var newPath = "/apercu/" + model.id;
            if($location.path() === newPath) {
                $route.reload();
            } else {
                $location.path(newPath);
            }
        }

    };


    /**
     * Fonction principale de la page de dashboard
     * Récupération de dossiers
     */
    var hasRequested = false;
    var task;
    $rootScope.getDossiersNavbar = function(viewValue) {
        var launchRequest = function() {
            return $timeout(function() {
                var resource;
                if ($rootScope.pagename() === "/archives") {
                    resource = "archives";
                }
                else {
                    resource = "dossiers";
                }
                //Récupération des dossiers ou archives
                return $http({
                    url: configuration.context + '/proxy/alfresco/parapheur/' + resource,
                    method: 'GET',
                    params: {
                        pageSize : 5,
                        page : 0,
                        skipped : 0,
                        sort : "cm:title",
                        asc : true,
                        filter : utils.generateFilter({title: viewValue}),
                        metas : {metas : []}
                    }
                }).then(function(response) {
                    hasRequested = false;
                    return response.data;
                });
            }, 500);
        };

        if(!hasRequested) {
            hasRequested = true;
            task = launchRequest();
        } else {
            $timeout.cancel(task);
            task = launchRequest();
        }
        return task.then(function(data) {
            return data;
        });
    };

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var currentLocation = current.substr(current.lastIndexOf('/') + 1);
        var nextLocation = next.substr(next.lastIndexOf('/') + 1);
        if ((currentLocation !== nextLocation) && ((currentLocation === "archives") || (nextLocation === "archives"))) {
            $rootScope.asyncSelected = {title:""};
        }
    });
}
NavbarController.$inject = ['$rootScope', '$route', '$location', 'configuration', 'navigationService', 'preferences', 'viewService', 'notifications', 'utils', '$http', '$timeout',  '$filter']; // For JS compilers

//Controller for navbar
function MainController($rootScope) {
    $rootScope.themeSelected = userTheme;
}
MainController.$inject = ['$rootScope']; // For JS compilers;
//Controller for nouveau page
NouveauController.$inject = ['$scope', 'navigationService', 'configuration', 'Dossiers', 'Types', 'Circuits', 'Metadonnees', '$location', '$sce', 'modals', '$timeout', '$filter']; //For JS compilers
function NouveauController($scope, navigationService, configuration, Dossiers, Types, Circuits, Metadonnees, $location, $sce, modals, $timeout, $filter) {
    if ($.isEmptyObject(navigationService.bureauCourant) || !navigationService.bureauCourant) {
        $location.path("/bureaux");
        return;
    }

    var choices = configuration.properties["parapheur.ihm.creerdossier.visibilite.valeurs"].split(",");

    $scope.mainDocsMax = configuration.properties["parapheur.ihm.creerdossier.maindocuments.max"];
    if (!$scope.mainDocsMax) {
        $scope.mainDocsMax = 6;
    }

    $scope.visibilityChoices = [];

    for (var i = 0; i < choices.length; i++) {
        if (choices[i] === "public") {
            $scope.visibilityChoices.push({
                value: choices[i],
                text: "Public"
            });
        } else if (choices[i] === "confidentiel") {
            $scope.visibilityChoices.push({
                value: choices[i],
                text: "Confidentiel"
            });
        } else {
            $scope.visibilityChoices.push({
                value: choices[i],
                text: "Groupe"
            });
        }
    }

    $scope.getIconClass = function (action) {
        var result = "fa";

        // Icon tag
        switch(action.toLowerCase()) {
            case 'visa':
                result += ' fa-check-square-o';
                break;
            case 'signature':
                result += ' ls-signature';
                break;
            case 'mailsecpastell':
                result += ' fa-envelope-o';
                break;
            case 'mailsec':
                result += ' fa-envelope';
                break;
            case 'tdt':
                result += ' fa-cloud-upload';
                break;
            case 'cachet':
                result += ' ls-stamp';
                break;
            default:
                result += ' fa-flag-checkered';
                break;
        }


        return result;
    };

    $scope.getActionTooltip = function (action) {
        var tooltip = "Fin de circuit";

        switch(action.toLowerCase()) {
            case 'visa':
                tooltip = 'Visa';
                break;
            case 'signature':
                tooltip = 'Signature';
                break;
            case 'mailsecpastell':
                tooltip = 'Mail sécurisé Pastell';
                break;
            case 'mailsec':
                tooltip = 'Mail sécurisé S²LOW';
                break;
            case 'tdt':
                tooltip = 'Télé-transmission';
                break;
            case 'cachet':
                tooltip = 'Cachet serveur';
                break;
            default:
                break;
        }

        return tooltip;
    };

    //Récupération de la typologie pour le bureau courant
    $scope.typo = Types.queryWithBureau({
        bureau: navigationService.bureauCourant.id
    });

    $scope.acteursVariables = {};
    $scope.dossier = {};
    $scope.upgrading = false;
    //Récupération du dossier stocké en localStorage ou à créer + circuit
    if (navigationService.dossierToEdit === undefined) {
        $scope.dossier = Dossiers.save({
            bureauCourant: navigationService.bureauCourant.id
        }, function () {
            $scope.dossier.$get({
                bureauCourant: navigationService.bureauCourant.id
            }, function () {
                var visibility = "public";

                try {
                    var propTenant = JSON.parse(configuration.properties["parapheur.ihm.creerdossier.visibilite.defaut.tenant"]);
                } catch (e) {
                    //Can't handle property or JSON...
                }
                if (configuration.tenant && propTenant[configuration.tenant])
                    visibility = propTenant[configuration.tenant];
                else
                    visibility = configuration.properties["parapheur.ihm.creerdossier.visibilite.defaut"];

                buildListDocuments();
                $scope.dossier.visibility = ~choices.indexOf(visibility) ? visibility : "public";
                $scope.dossier.$getCircuit();
                $scope.docsExists = !!$scope.dossier.documents.length;
            });
        });
    } else {
        $scope.dossier = Dossiers.get({
            id: navigationService.dossierToEdit,
            bureauCourant: navigationService.bureauCourant.id
        }, function () {

            for (var i = 0; i < $scope.dossier.documents.length; i++) {
                $scope.dossier.documents[i].state = '';
            }
            buildListDocuments();

            try {
                $scope.dossier.$getCircuit();
            } catch (e) {
                console.log(e);
            }
        });
    }

    $scope.$watch("dossier.sousType", function () {
        if ($scope.dossier.sousType) {
            $scope.circuit = Circuits.getWithTypo({
                id: $scope.dossier.type,
                action: $scope.dossier.sousType,
                bureau: navigationService.bureauCourant.id
            }, function () {
                navigationService.bureauCourant.$associes(function () {
                    var indexVariable = 0;

                    for (var i = 0; i < $scope.circuit.etapes.length; i++) {
                        var etape = $scope.circuit.etapes[i];
                        if (etape.transition === "VARIABLE") {
                            $scope.acteursVariables[i] =
                                $scope.dossier.acteursVariables[indexVariable] || null;
                            indexVariable++;
                        } else {
                            $scope.acteursVariables[i] = null;
                        }
                    }
                });
                
                buildListDocuments();
                if (($scope.circuit.sigFormat === 'XAdES/enveloped') && (!$scope.dossier['xPathSignature'])) {
                    $scope.dossier['xPathSignature'] = ".";
                }

                $scope.metaInfos = Metadonnees.getWithTypo({
                    id: $scope.dossier.type,
                    action: $scope.dossier.sousType
                }, function () {
                    // remove from metainfo metadatas defined in "circuit"
                    for (var i = 0; i < $scope.circuit.etapes.length; i++) {
                        var etape = $scope.circuit.etapes[i];
                        for (var j = 0; j < etape.listMetadatas.length; j++) {
                            $scope.metaInfos = $scope.metaInfos.filter(function(value) {
                                return value.id !== "cu:"+etape.listMetadatas[j];
                            });
                        }
                    }
                    for (var i = 0; i < $scope.metaInfos.length; i++) {
                        var meta = $scope.metaInfos[i];
                        var obj = {};
                        obj[meta.id] = meta;
                        obj[meta.id].value = $scope.dossier.metadatas[meta.id] ? $scope.dossier.metadatas[meta.id].value : obj[meta.id]["default"] ? obj[meta.id]["default"] : "";
                        angular.extend($scope.dossier.metadatas, obj);
                    }
                });
            });
        } else {
            $scope.circuit = {};
            $scope.metaInfos = [];
            buildListDocuments();
        }
    });

    $scope.removeDocument = function (document) {
        $scope.dossier.$removeDocument({
            doc: document.id,
            bureauCourant: navigationService.bureauCourant.id
        }).then(function () {
            for (var i = 0; i < $scope.documentsPrincipaux.length; i++) {
                if ($scope.documentsPrincipaux[i].id === document.id) {
                    $scope.documentsPrincipaux.splice(i, 1);
                }
            }
            for (var j = 0; j < $scope.documentsAnnexes.length; j++) {
                if ($scope.documentsAnnexes[j].id === document.id) {
                    $scope.documentsAnnexes.splice(j, 1);
                }
            }
            buildListDocuments();
        }, function () {
            document.state = "";
        });
    };

    $scope.updateVisu = function () {
        //L'état doit etre initialisé, donc à faire dans un apply différent, afin qu'il passe après la mise à jour de la vue
        $scope.$apply(function () {
            $scope.typeError = false;
            $scope.formatError = false;
            $scope.pdfError = false;
            $scope.requestError = false;
            $scope.existLog = false;
            $scope.dossier.documents[0].state = "visuel";
        });
        return 0;
    };

    $scope.metaHasChange = false;
    $scope.valuesMetaUndefined = function (idMeta) {
        $scope.dossier.metadatas[idMeta].value = $scope.dossier.metadatas[idMeta].value === "" ? undefined : $scope.dossier.metadatas[idMeta].value;
    };

    $scope.updateVisuEnd = function (resp, index) {
        $scope.$apply(function () {
            if (resp.exception) {
                $scope.existLog = true;
                $scope.existDoc = $scope.dossier.documents[index].name;
            } else {
                $scope.existLog = false;
                $scope.dossier.documents[index].visuelPdf = true;
            }
            $scope.dossier.documents[index].state = "";
        });
    };

    $scope.addDocumentUrl = $sce.getTrustedResourceUrl($scope.context + "/addDocument");
    $scope.addVisuelUrl = $sce.getTrustedResourceUrl($scope.context + "/addVisuel");

    $scope.loadingDocuments = 0;

    var initErrorsStates = function () {
        $scope.typeError = false;
        $scope.formatError = false;
        $scope.pdfError = false;
        $scope.requestError = false;
        $scope.existLog = false;
    };

    $scope.addDocument = function (files, isMainDoc) {
        var document = undefined;
        $scope.$apply(function () {
            initErrorsStates();
            if (isMainDoc && (($scope.circuit.isMultiDocument && !$scope.isMainDocumentListFull()) || $scope.documentsPrincipaux.length === 0)) {
                $scope.documentsPrincipaux.push({
                    name: files[0].name.replace(/[\^&:\"£*/<>?%|+;]/g, ''),
                    isMainDocument: true
                });
            } else {
                $scope.documentsAnnexes.push({
                    name: files[0].name.replace(/[\^&:\"£*/<>?%|+;]/g, ''),
                    isMainDocument: false
                });
            }

            buildListDocuments();
        });

        //L'état doit etre initialisé, donc à faire dans un apply différent, afin qu'il passe après la mise à jour de la vue
        $scope.$apply(function () {
            if (isMainDoc && $scope.documentsPrincipaux.length > 0 && $scope.documentsPrincipaux[$scope.documentsPrincipaux.length - 1].state !== "saving") {
                document = $scope.documentsPrincipaux[$scope.documentsPrincipaux.length - 1];
            } else {
                document = $scope.documentsAnnexes[$scope.documentsAnnexes.length - 1];
            }
            document.state = "saving";
            $scope.loadingDocuments++;
        });

        return document;
    };

    $scope.uploadError = function (resp, document) {

        $scope.$apply(function () {
            initErrorsStates();
            $scope.existLog = true;
            $scope.message = $scope.getErrorMessage(resp);

            // Removing wrong uploaded doc from the displayed list

            $scope.dossier.documents.splice(0, 1);

            for (var i = 0; i < $scope.documentsPrincipaux.length; i++) {
                if ($scope.documentsPrincipaux[i].name === document.name) {
                    $scope.documentsPrincipaux.splice(i, 1);
                }
            }

            for (var j = 0; j < $scope.documentsAnnexes.length; j++) {
                if ($scope.documentsAnnexes[j].name === document.name) {
                    $scope.documentsAnnexes.splice(j, 1);
                }
            }

            buildListDocuments();

            $scope.loadingDocuments--;
        });
    };

    $scope.replaceError = function (resp) {
        initErrorsStates();
        $scope.existLog = true;
        $scope.message = $scope.getErrorMessage(resp);
        $scope.loadingDocuments--;
        $scope.dossier.documents[0].state = "";
    };

    $scope.documentAdded = function (resp, document) {

        $scope.$apply(function () {
            initErrorsStates();
            $.extend(document, {
                canDelete: !resp.isLocked,
                downloadUrl: resp.downloadUrl,
                id: resp.success,
                isLocked: resp.isLocked,
                isProtected: resp.isProtected,
                visuelPdfUrl: null,
                state: ""
            });

            $scope.loadingDocuments--;
        });
    };

    $scope.uploadFinished = function (resp, index) {
        $scope.$apply(function () {
            //dossierService.getDossier();
        });
    };

    var replaceName = "";

    $scope.beginReplace = function (files) {
        $scope.$apply(function () {
            initErrorsStates();
            $scope.dossier.documents[0].state = "replace";
            replaceName = files[0].name;
            $scope.loadingDocuments++;
        });
        return 0;
    };

    $scope.endReplace = function (data, index) {
        $scope.$apply(function () {
            initErrorsStates();
            $scope.dossier.documents[0].name = replaceName;
            $scope.loadingDocuments--;
            $scope.dossier.documents[0].state = "";
            $scope.dossier.documents[0].visuelPdf = false;
            $scope.dossier.documents[0].canDelete = !data.isLocked;
            $scope.dossier.documents[0].isLocked = data.isLocked;
            $scope.dossier.documents[0].isProtected = data.isProtected;

            //FIXME : has never been defined
            //$scope.dossier.documents[0].name = files[0].name;
        });
    };

    $scope.metaChanged = function () {
        $scope.metaHasChange = true;
    };

    $scope.errorSavingProperties = false;

    $scope.upgrade = function (success) {
        $scope.errorSavingProperties = false;
        $scope.upgrading = true;
        $scope.metaHasChange = false;
        buildListDocuments();
        $scope.dossier.acteursVariables = [];
        for (var acteur in $scope.acteursVariables) {
            if ($scope.acteursVariables[acteur] != null) {
                $scope.dossier.acteursVariables.push($scope.acteursVariables[acteur]);
            }
        }
        $scope.dossier.$update({
            bureauCourant: navigationService.bureauCourant.id
        }, function () {

            $scope.dossier.$getCircuit().then(function () {
                $scope.upgrading = false;
                if (typeof success === 'function') {
                    success();
                }
            }, function () {
                $scope.upgrading = false;
                $scope.errorSavingProperties = true;
            });

        }, function (resp) {
            $scope.requestError = true;
            $scope.requestErrorMessage = $scope.getErrorMessage(resp);
            $scope.upgrading = false;
            $scope.errorSavingProperties = true;
        });
    };

    $scope.save = function (success) {
        var func = typeof success === "function" ? success : function () {
            $scope.redirect = true;
            $timeout(function () {
                navigationService.dossierToEdit = $scope.dossier.id;
                $location.path("/apercu");
            }, 2000);
        };
        $scope.upgrade(func);
    };

    var buildListDocuments = function () {
        if ($scope.documentsPrincipaux && $scope.documentsPrincipaux.length > 0 || $scope.documentsAnnexes && $scope.documentsAnnexes.length > 0) {
            //Rebuild 'documents' of dossier
            $scope.dossier.documents.length = 0;
            $scope.dossier.documents = $scope.documentsPrincipaux.concat($scope.documentsAnnexes);
        }
        $scope.documentsPrincipaux = [];
        $scope.documentsAnnexes = [];
        if ($scope.dossier.documents) {
            for (var i = 0; i < $scope.dossier.documents.length; i++) {
                if ($scope.dossier.documents[i].isMainDocument && ($scope.circuit.isMultiDocument || !$scope.documentsPrincipaux.length)) {
                    $scope.documentsPrincipaux.push($scope.dossier.documents[i]);
                } else {
                    $scope.documentsAnnexes.push($scope.dossier.documents[i]);
                }
            }
        }
    };

    $scope.getSortableOptions = function (classname) {
        if ($scope.circuit.isMultiDocument) {
            return {
                connectWith: classname,
                update: function (e, ui) {

                    if (ui.item.sortable.moved) {
                        ui.item.sortable.moved.isMainDocument = (classname !== ".mainDocList");
                    }

                    // If a swipe adds more main documents than allowed,
                    // We move the last main document into annexes.

                    if ($scope.documentsPrincipaux.length > $scope.mainDocsMax) {
                        $scope.documentsAnnexes.unshift($scope.documentsPrincipaux[$scope.documentsPrincipaux.length - 1]);
                        $scope.documentsAnnexes[0].isMainDocument = false;
                        $scope.documentsPrincipaux.splice($scope.documentsPrincipaux.length - 1, 1);
                    }
                }
            }
        } else {
            return {
                connectWith: '',
                update: function (e, ui) {

                }
            }
        }
    };

    $scope.wrongPDF = function () {
        $scope.$apply(function () {
            initErrorsStates();
            $scope.pdfError = true;
        });
    };

    $scope.wrongType = function (ext, isValid, isAuthorized) {
        $scope.$apply(function () {
            initErrorsStates();
            if (!isValid) {
                $scope.typeError = true;
                $scope.formatError = false;
            } else if (!isAuthorized) {
                $scope.typeError = false;
                $scope.formatError = true;
            }
        });
    };

    $scope.checkIfExist = function (name) {
        for (var i = 0; i < $scope.documentsPrincipaux.length; i++) {
            if ($scope.documentsPrincipaux[i].name === name) {
                return true;
            }
        }
        for (var j = 0; j < $scope.documentsAnnexes.length; j++) {
            if ($scope.documentsAnnexes[j].name === name) {
                return true;
            }
        }
        return false;
    };

    $scope.existFile = function (name) {
        $scope.$apply(function () {
            initErrorsStates();
            $scope.existLog = true;
            $scope.message = "Le document " + name + " existe déjà.";
        });
    };

    $scope.focusTitle = function () {
        if ($scope.dossier.title === "Nouveau dossier") {
            $scope.dossier.title = undefined;
        }
    };

    $scope.blurTitle = function () {
        if ($scope.dossier.title == undefined) {
            $scope.dossier.title = "Nouveau dossier";
        }
    };

    /**
     * Gestion des fenetres modales
     */
    var getDossierModal = function () {
        return [$scope.dossier];
    };

    $scope.saveAndEmit = function () {
        $scope.upgrade(function () {
            modals.launch("VALIDATION", getDossierModal, function () {
                $location.path("/dashboard");
            });
        });
    };

    $scope.saveAndSecretariat = function () {
        $scope.upgrade(function () {
            modals.launch("SECRETARIAT", getDossierModal, function () {
                $location.path("/dashboard");
            });
        });
    };

    /**
     * Get the appropriate error message translation (from error code, or HTTP status).
     *
     * @param resultData
     */
    $scope.getErrorMessage = function (resultData) {
        var resultMessage;

        if (resultData.status == 400) {
            var message = ((!!resultData.responseJSON) ? resultData.responseJSON.message : resultData.data.message);

            if (!isNaN(message)) {
                resultMessage = $filter('translate')('ErrorCodes.' + message);
            } else {
                // This shouldn't happen,
                // every error messages needs to be numbered by the server.
                console.warn("Missing translation : " + message);
                resultMessage = message;
            }
        } else {
            resultMessage = $filter('translate')('ErrorCodes.' + resultData.status);
        }

        return resultMessage
    };

    // <editor-fold desc="nouveau.html">

    $scope.isMainDocumentListFull = function () {
        return $scope.documentsPrincipaux.length >= $scope.mainDocsMax;
    };

    $scope.getSignatureFormat = function () {
        return $scope.circuit.sigFormat;
    };

    $scope.isMainDocument = function () {
        return ($scope.circuit.isMultiDocument || (!$scope.dossier.documents) || (!$scope.dossier.documents[0]) || ($scope.dossier.documents[0].id == null)) && !$scope.isMainDocumentListFull();
    };

    $scope.getProtocol = function () {
        return $scope.circuit.protocol;
    };

    $scope.isPreviousVariable = function (index) {
        if (index > 0 && $scope.circuit.etapes[index - 1].transition === 'VARIABLE' && $scope.circuit.etapes[index].transition === 'CHEF_DE') {
            return true;
        }
        if (index > 0 && $scope.circuit.etapes[index - 1].transition === 'CHEF_DE' && $scope.circuit.etapes[index].transition === 'CHEF_DE') {
            return $scope.isPreviousVariable(index - 1);
        }
        return false;
    };

    // </editor-fold desc="nouveau.html">

    $scope.cancel = function () {
        modals.launch("SUPPRESSION", getDossierModal, function () {
            $location.path("/dashboard");
        });
    };

    $scope.$on('notificationReceived', function (event, obj) {
        //Handle documents notifs
        var changed = false;
        if (obj.action === "TRANSFORM") {
            var docChanged;
            for (var i = 0; i < $scope.dossier.documents.length; i++) {
                if ($scope.dossier.documents[i].id === obj.id) {
                    docChanged = $scope.dossier.documents[i];
                    changed = true;
                }
            }
            switch (obj.state) {
                case "NEW":
                    docChanged.isLocked = true;
                    docChanged.canDelete = false;
                    break;
                case "END":
                    docChanged.visuelPdf = true;
                default:
                    docChanged.isLocked = false;
                    docChanged.canDelete = true;
                    break;
            }
            if (changed) {
                buildListDocuments();
            }
        }
    });

}
;
//Controller for options page
function OptionsController($scope, $modal, $sce, $rootScope, preferences, configuration, viewService, Bureaux, Users, prefs, $translate) {
    $rootScope.prefs = prefs;
    var basePrefs = angular.copy($rootScope.prefs);
    $scope.columns = {};
    viewService.getDashboardColumns($rootScope.prefs.enabledColumns, function(data) {
        $scope.columns = data;
    });
    viewService.getArchiveColumns($rootScope.prefs.enabledColumnsArchives, function(data) {
        $scope.archiveColumns = data;
    });
    $scope.signNode = configuration.signNode;

    //Password
    $scope.newpass = {};
    $scope.changePassword = function() {
        $scope.respPass = preferences.changePassword($scope.newpass.old, $scope.newpass.newOne);
    };

    //Theme
    $scope.themes = configuration.themes;
    $scope.changeTheme = function(theme) {
        $rootScope.themeSelected = theme;
        preferences.changeProperty(preferences.paths.THEME,  theme);
    };

    //Dashboard
    // UGLY FIX TO ASYNC PREFS SAVING...
    $scope.saveDashboardPrefs = function() {
        //On ne sauvegarde que ce qui a été changé
        if($rootScope.prefs.filterDefault && basePrefs.filterDefault !== $rootScope.prefs.filterDefault) {
            preferences.changeProperty(preferences.paths.FILTERDEFAULT, $rootScope.prefs.filterDefault, savedisplayDelegation);
        } else if(!$rootScope.prefs.filterDefault) {
            preferences.removeProperty(preferences.paths.FILTERDEFAULT.path, savedisplayDelegation);
        } else {
            savedisplayDelegation();
        }

    };
    var savedisplayDelegation = function() {
        if(basePrefs.displayDelegation !== $rootScope.prefs.displayDelegation) {
            preferences.changeProperty(preferences.paths.DISDELEG, $rootScope.prefs.displayDelegation, savePagesize);
        } else {
            savePagesize();
        }
    };
    var savePagesize = function() {
        if(basePrefs.pagesize !== $rootScope.prefs.pagesize) {
            preferences.changeProperty(preferences.paths.PAGESIZE, $rootScope.prefs.pagesize, saveAsc);
        } else {
            saveAsc();
        }
    };
    var saveAsc = function() {
        if(basePrefs.asc !== $rootScope.prefs.asc) {
            preferences.changeProperty(preferences.paths.ASC, $rootScope.prefs.asc, savePropSort);
        } else {
            savePropSort();
        }
    };
    var savePropSort = function() {
        if(basePrefs.propSort !== $rootScope.prefs.propSort) {
            preferences.changeProperty(preferences.paths.PROPSORT, $rootScope.prefs.propSort, saveColumns);
        } else {
            saveColumns();
        }
    };
    var saveColumns = function() {
        preferences.changeProperty(preferences.paths.COLDASH, viewService.toSaveColumns($scope.columns.enabled));
        //preferences.changeProperty(preferences.paths.COLORATION, JSON.stringify(angular.copy($scope.colorations)));
        basePrefs = angular.copy($rootScope.prefs);
    };

    //Colorations
    $scope.colorations = JSON.parse($scope.prefs.coloration);
    $scope.deleteColoration = function(index) {
        $scope.colorations.splice(index, 1);
    };
    /**
     * Gestion des fenetres modales
     */
    var launchModal = function(ctrl, modalFile, success, enabledColumns) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop : 'static',
            resolve: {
                enabledColumns : function() {
                    return enabledColumns;
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

    $scope.addColoration = function() {
        launchModal(ColorationController, 'partials/modals/colorationModal.html',function(data) {
            //Colorations
            $scope.colorations.push(data);
        }, $scope.columns.enabled);
    };

    $scope.saveLanguage = function() {
        $translate.use($rootScope.prefs.language);
        preferences.changeProperty(preferences.paths.LANG, $rootScope.prefs.language);
    };

    //Archive
    $scope.saveArchivePrefs = function() {
        preferences.changeProperty(preferences.paths.PAGESIZEARCH, $rootScope.prefs.pagesizeArchives);
        preferences.changeProperty(preferences.paths.COLARCH, viewService.toSaveColumns($scope.archiveColumns.enabled));
    };
    //Notifications
    $scope.notifications = {
        mode: "always",
        mail: undefined,
        cron: {},
        changed: false,
        saved: false,
        error: undefined,
        init: function() {
            this.cron = viewService.extractCron($rootScope.prefs.notifications.digest.cron);
            this.mail = $rootScope.prefs.notifications.mail;
            if ($rootScope.prefs.notifications.enabled) {
                if ($rootScope.prefs.notifications.dailydigest.enabled) {
                    this.mode = viewService.getCronMode($rootScope.prefs.notifications.digest.cron);
                }
                else {
                    this.mode = "always";
                }
            }
            else {
                this.mode = "never";
            }
        },
        cronDidChange: function() {
            this.changed = true;
        },
        saveCronPrefs: function() {
            var that = this;
            this.error = undefined;
            Users.saveNotificationsPreferences(
                {id: configuration.id},
                {
                    mode: that.mode,
                    mail: that.mail,
                    frequency:that.cron[that.mode]
                })
                .$promise.then(function () {
                    $rootScope.prefs.notifications.mail = that.mail;
                    switch(that.mode) {
                        case "never":
                            $rootScope.prefs.notifications.enabled = false;
                            break;
                        case "always":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = false;
                            break;
                        case "hourly":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 0/" + that.cron[that.mode] + " * * ?";
                            break;
                        case "daily":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 " + that.cron[that.mode] + " * * ?";
                            break;
                        case "weekly":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 8 ? * " + that.cron[that.mode];
                            break;
                    }
                    that.changed = false;
                    that.saved = true;
                },
                function (error) {
                    that.error = error;
                    that.changed = false;
                    that.saved = false;
                }
            );
        }
    };

    $scope.notifications.init();

    //Signature
    $scope.changeSignatureUrl = $sce.trustAsResourceUrl($scope.context + "/changeSignature");
    $scope.typeError = false;
    $scope.signatureSaved = function(resp) {
        $scope.$apply(function() {
            configuration.signNode = resp.node;
            $scope.signNode = resp.node;
            $scope.typeError = false;
            $scope.timeimg = new Date().getTime();
        });
    };
    $scope.wrongType = function() {
        $scope.$apply(function() {
            $scope.typeError = true;
        });
    };

    //Order bureaux
    $scope.bureaux = Bureaux.query(function() {
        $rootScope.orderedBureaux = [];
        if($scope.prefs['bureauxOrder'] !== undefined) {
            var array = JSON.parse($scope.prefs['bureauxOrder']);
            var added = [];
            //Ajout des bureaux ordonnés
            for(var i = 0; i < array.length; i++) {
                for(var j = 0; j < $scope.bureaux.length; j++) {
                    if($scope.bureaux[j].id === array[i]) {
                        $rootScope.orderedBureaux.push($scope.bureaux[j]);
                        added[j] = true;
                    }
                }
            }
            //Ajout des bureaux non ajoutés
            for(var k = 0; k < $scope.bureaux.length; k++) {
                if(!added[k]) {
                    $rootScope.orderedBureaux.push($scope.bureaux[k]);
                }
            }
        } else {
            $rootScope.orderedBureaux = $scope.bureaux;
        }
    });
    $scope.saveOrderPrefs = function() {
        var array = [];
        for(var i = 0; i < $rootScope.orderedBureaux.length; i++) {
            array.push($rootScope.orderedBureaux[i].id);
        }
        preferences.changeProperty(preferences.paths.BUREAUXORDER, JSON.stringify(array));
    };

    $scope.sort = [];

    $scope.$watch("columns.enabled", function() {
        $scope.sort.length = 0;
        if (!$scope.isEmptyOrNull($scope.columns.enabled)) {
            for (var i = 0; i < $scope.columns.enabled.length; i++) {
                var val = $scope.columns.enabled[i].value;
                if (val !== "actionDemandee" && val !== "bureauName" && val !== "banetteName") {
                    $scope.sort.push($scope.columns.enabled[i]);
                }
            }
        }
    });
}
OptionsController.$inject = ['$scope', '$modal', '$sce', '$rootScope', 'preferences', 'configuration', 'viewService', 'Bureaux', 'Users', 'prefs', '$translate']; // For JS compilers

var ColorationController = function($scope, preferences, $modalInstance, enabledColumns) {
    $scope.tmp = {};
    $scope.properties = enabledColumns;
    var initTmp = function() {
        $scope.tmp = {
            value : "",
            comparator : "="
        }
    };
    initTmp();

    $scope.coloration = {
        test : []
    };

    $scope.removeCondition = function(index) {
        $scope.coloration.test.splice(index, 1);
    };

    $scope.addToTest = function() {
        $scope.coloration.test.push(angular.copy($scope.tmp));
        initTmp();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.coloration);
    };
};;
function PolicyController($scope) {};
//Controller for bureau page
function StatsController($scope, Audits, Bureaux, $filter, Types) {

    $scope.types = Types.query();
    console.log($scope.types);

    $scope.data = [];
    $scope.moyennes = [];
    $scope.ecartTypes = [];
    $scope.cumul = 1;
    $scope.datalength = 0;
    $scope.gettingStats = false;

    var fromTime = new Date();
    fromTime.setDate(1);

    $scope.listHandler = {
        bureaux: [],
        searchResultSubList: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function () {
            this.search("");
        },
        search: function (toSearch) {
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, {name: toSearch});
            this.selectedBureau = this.bureaux.length > 0 ? this.bureaux[0] : undefined;
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function (toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function () {
            this.searchResultSubList = this.bureaux.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
        },
        selectElement: function (b) {
            this.selectedBureau = b;
            this.getNewList();
        }
    };

    Bureaux.query(function (listBureaux) {
        $scope.bureaux = listBureaux;
        $scope.listHandler.init();
    });

    $scope.opt = {
        verbose: true,
        options: {},
        fromTime: fromTime.getTime(),
        toTime: new Date().getTime()
    };

    var optionToParam = function (bureau) {
        var ret = angular.copy($scope.opt);
        var option = "";
        //if($scope.opt.options.parapheur) {
        //    option += "parapheur;" + $scope.opt.options.parapheur + "/";
        //}

        if (bureau)
            option += "parapheur;" + bureau.id + "/";

        if ($scope.opt.options.type) {
            option += "typeMetier;" + $scope.opt.options.type + "/";
        }
        if ($scope.opt.options.sousType) {
            option += "soustypeMetier;" + $scope.opt.options.sousType + "/";
        }
        ret.options = option;
        ret.cumul = $scope.cumul;
        return ret;
    };

    $scope.toHandle = 0;
    $scope.hasStats = false;

    function getTime(timeInSeconds) {
        var result = "";
        var rest = timeInSeconds;
        if (Math.floor(rest / 86400) > 0) {
            result += Math.floor(rest / 86400) + " jours";
            rest = rest % 86400;
            if (Math.floor(rest / 3600) > 0) {
                result += " et ";
                result += Math.floor(rest / 3600) + " heures";
                return result;
            }
        }
        if (Math.floor(rest / 3600) > 0) {
            result += Math.floor(rest / 3600) + " heures";
            rest = rest % 3600;
            if (Math.floor(rest / 60) > 0) {
                result += " et ";
                result += Math.floor(rest / 60) + " minutes";
                return result;
            }
        }
        if (Math.floor(rest / 60) > 0) {
            result += Math.floor(rest / 60) + " minutes";
            rest = rest % 60;
        }
        if (rest > 0) {
            if (result !== "") {
                result += " et ";
            }
            result += (rest) + " secondes";
        }

        return rest === 0 && result === "" ? "Aucun traitement" : result;
    }

    function getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return new Date(y, 0, d);
    }

    var handleData = function (label, data, cumul) {
        var dataset = {
            type: "spline",
            axisYType: "secondary",
            name: label,
            showInLegend: true,
            toolTipContent: "<span style='\"'color: {color};'\"'>{x}</span> {label}",
            dataPoints: []
        };

        $scope.datalength = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            var date;
            if (cumul == 4) {
                date = new Date(data.data[i].key + "-01-01");
            } else if (cumul == 3) {
                date = new Date(data.data[i].key + "-01");
            } else if (cumul == 2) {
                var k = data.data[i].key;
                date = getDateOfWeek(k.split("-")[1], k.split("-")[0]);
            } else {
                date = new Date(data.data[i].key);
            }
            dataset.dataPoints[i] = {
                x: date,
                y: +data.data[i].value,
                label: getTime(+data.data[i].value)
            }
        }

        if ($scope.bureaux.cumul) {

            // We try to concatenate data to already set same label

            var alreadyExistingData = false;

            for (i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].name == dataset.name) {

                    for (var j = 0; j < $scope.data[i].dataPoints.length; j++)
                        $scope.data[i].dataPoints[j].y += dataset.dataPoints[j].y;

                    alreadyExistingData = true;
                }
            }

            // If we didn't found any existing data, we just add the new one
            if (!alreadyExistingData)
                $scope.data.push(dataset);

        } else {
            $scope.data.push(dataset);
        }

        $scope.toHandle--;
        $scope.gettingStats = false;
    };

    $scope.updateChartData = function () {

        $scope.currentBureauName = $scope.listHandler.selectedBureau.name;
        $scope.data = [];
        $scope.moyennes = [];
        $scope.ecartTypes = [];
        $scope.gettingStats = true;
        $scope.savedCumul = $scope.cumul;

        updateChartData($scope.listHandler.selectedBureau);

        $scope.hasStats = true;
    };

    var updateChartData = function (bureau) {
        Audits.tempsTraitement(optionToParam(bureau), function (result) {
            var label = $filter('translate')('stats.handle_time');
            handleData(label, result, $scope.savedCumul);
        });
    };
}
StatsController.$inject = ['$scope', 'Audits', 'Bureaux', '$filter', 'Types']; // For JS compilers;
//Controller for bureau page
function AvanceAdminController($scope, Connecteurs, Horodate, Attestation, Modeles, Metadonnees, Calques, SubCalques, modals, cache, $filter, Cachets, $http, configuration, PastellMailsec, PastellConnector) {

    var testConfig = function (data, obj) {
        if (obj.testConfig) {
            obj.testConfig = false;
            var toTest = angular.copy(obj.config);
            angular.extend(toTest, {
                cert: data.encodedFile,
                currentCertName: obj.config.name,
                tdt: obj.tdt
            });
            Connecteurs.testConfig(toTest, function (response) {
                angular.extend(obj.config, response);
                obj.changed = false;
                obj.hasTestConfig = true;
                obj.config.isPwdGoodForPkcs = obj.config.isPwdGoodForPkcs.substring(0, 2);
            });
        }
    };

    var connecteurObj = {
        //Flag : Is this object initialized
        isInit: false,
        //Flag : Do I have to test configuration ?
        testConfig: false,
        //Flag : Do I have tested the configuration ?
        hasTestConfig: false,
        //Flag : Do I have saved the configuration ?
        hasSaveConfig: false,
        //Flag : Do I have to save configuration ?
        saveConfig: false,
        //Flag : Form has changed
        changed: false,
        //Flag : A file has been added
        isFileAdded: false,
        //Flag : Error detected with the file
        typeError: false,
        //Filename
        filename: undefined,
        //Configuration resource
        config: {},
        //Configuration temp
        oldConfig: {},
        /**
         * Initialisation de l'objet connecteur
         */
        init: function () {
            this.testConfig = false;
            this.saveConfig = false;
            this.hasTestConfig = false;
            this.hasSaveConfig = false;
            this.changed = false;
            this.isFileAdded = false;
            this.filename = undefined;
            if (!this.isInit) {
                this.get();
            } else {
                angular.extend(this.config, this.oldConfig);
            }
        },
        /**
         * Récupération de la configuration actuelle
         */
        get: function () {
            var that = this;
            this.config = Connecteurs.get({
                type: this.type,
                tdt: this.tdt
            }, function () {
                that.isInit = true;
                angular.extend(that.oldConfig, that.config);
            });
        },
        /**
         * Sauvegarde de la configuration
         * @param data La configuration à sauvegarder
         */
        set: function (data) {
            this.hasTestConfig = false;
            var that = this;
            if (this.saveConfig) {
                this.saveConfig = false;
                if (this.config.listeLogins && this.config.listeLogins.length < 2) {
                    this.config.userlogin = "";
                    this.config.userpassword = "";
                }
                angular.extend(this.config, {
                    cert: data.encodedFile,
                    name: this.filename,
                    tdt: this.tdt,
                    type: this.type
                });
                angular.extend(this.oldConfig, this.config);
                Connecteurs.set(this.config, function () {
                    that.changed = false;
                    that.hasSaveConfig = true;
                });
            }
        },
        /**
         * Lancement d'un test de configuration
         * @param data La configuration à tester
         */
        test: function (data) {
            this.hasSaveConfig = false;
            testConfig(data, this);
        },
        /**
         * Les informations de la configuration ont changés
         */
        infoChanged: function () {
            this.changed = true;
            this.hasSaveConfig = false;
            this.hasTestConfig = false;
        },
        /**
         * Handler : Mauvais type de fichier
         */
        wrongType: function () {
            var that = this;
            $scope.$apply(function () {
                that.typeError = true;
            })
        },
        /**
         * Lancement d'un test de connexion
         */
        enableModeTest: function () {
            this.testConfig = true;
            if (!this.isFileAdded) {
                this.test({});
            }
        },
        /**
         * Lancement de la sauvegarde de la configuration
         */
        enableModeSave: function () {
            this.saveConfig = true;
            if (!this.isFileAdded) {
                this.set({});
            }
        },
        /**
         * Handler : Le fichier a été encodé (en Base64)
         * @param data Le fichier encodé en Base64
         */
        fileEncoded: function (data) {
            var that = this;
            $scope.$apply(function () {
                that.test(data);
                that.set(data);
            });
        },
        /**
         * Handler : Un certificat a été ajouté
         * @param files Le certificat ajouté (sous forme de liste)
         */
        certAdded: function (files) {
            var that = this;
            $scope.$apply(function () {
                that.filename = files[files.length - 1].name;
                that.changed = true;
                that.isFileAdded = true;
                that.typeError = false;
            });
        }
    };

    /**
     * S²LOW ACTES
     * Objet de gestion de la configuration S²LOW ACTES
     *
     * Etendu de l'objet connecteurObj
     * @see connecteurObj
     */
    $scope.slowActes = angular.copy(connecteurObj);
    angular.extend($scope.slowActes, {
        tdt: "s2low",
        type: "actes",
        updateClassifications: function () {
            var that = this;
            this.updating = true;
            that.updated = false;
            this.classifications = Connecteurs.classifications(function () {
                that.updating = false;
                that.updated = true;
            });
        }
    });
    /**
     * S²LOW ACTES END ----------------------------
     */

    /**
     * S²LOW HELIOS
     * Objet de gestion de la configuration S²LOW HELIOS
     *
     * Etendu de l'objet connecteurObj
     * @see connecteurObj
     */
    $scope.slowHelios = angular.copy(connecteurObj);
    angular.extend($scope.slowHelios, {
        tdt: "s2low",
        type: "helios"
    });
    /**
     * S²LOW HELIOS END ----------------------------
     */

    /**
     * S²LOW MAILSEC
     * Objet de gestion de la configuration S²LOW MAILSEC
     *
     * Etendu de l'objet connecteurObj
     * @see connecteurObj
     */
    $scope.slowMailsec = angular.copy(connecteurObj);
    angular.extend($scope.slowMailsec, {
        tdt: "s2low",
        type: "mailsec"
    });
    /**
     * S²LOW MAILSEC END ----------------------------
     */

    /**
     * FAST HELIOS
     * Objet de gestion de la configuration FAST HELIOS
     *
     * Etendu de l'objet connecteurObj
     * @see connecteurObj
     */
    $scope.fastHelios = angular.copy(connecteurObj);
    angular.extend($scope.fastHelios, {
        tdt: "fast",
        type: "helios"
    });
    /**
     * FAST HELIOS END ----------------------------
     */

    /**
     * SRCI HELIOS
     * Objet de gestion de la configuration SRCI HELIOS
     *
     * Etendu de l'objet connecteurObj
     * @see connecteurObj
     */
    $scope.srciHelios = angular.copy(connecteurObj);
    angular.extend($scope.srciHelios, {
        tdt: "srci",
        type: "helios"
    });
    /**
     * SRCI HELIOS END ----------------------------
     */

    /**
     * Service Attestation
     * Objet de gestion de la configuration du service d'attestation
     */
    $scope.attestation = {
        //L'objet est-il initialisé ?
        isInit: false,
        //Configuration actuelle
        config: {},
        //Configuration récupérée (de base)
        oldConfig: {},
        // Configuration sauvegardée
        isSaved: false,
        /**
         * Fonction d'initialisation
         */
        init: function () {
            var that = this;
            if (!this.isInit) {
                this.config = Attestation.get(function () {
                    that.isInit = true;
                    angular.extend(that.oldConfig, that.config);
                });
            } else {
                angular.extend(this.config, this.oldConfig);
            }
            this.isSaved = false;
        },
        /**
         * Sauvegarde de la configuration actuelle
         */
        set: function () {
            var that = this;
            angular.extend(this.oldConfig, this.config);
            Attestation.set(this.config, function () {
                that.isSaved = true;
            });
        }
    };
    /**
     * Service Horodatage END ----------------------------
     */

    /**
     * Service Horodatage
     * Objet de gestion de la configuration du service d'horodatage
     */
    $scope.horodate = {
        //L'objet est-il initialisé ?
        isInit: false,
        //Configuration actuelle
        config: {},
        //Configuration récupérée (de base)
        oldConfig: {},
        /**
         * Fonction d'initialisation
         */
        init: function () {
            var that = this;
            if (!this.isInit) {
                this.config = Horodate.get(function () {
                    that.isInit = true;
                    angular.extend(that.oldConfig, that.config);
                });
            } else {
                angular.extend(this.config, this.oldConfig);
            }
        },
        /**
         * Sauvegarde de la confiduration actuelle
         */
        set: function () {
            angular.extend(this.oldConfig, this.config);
            Horodate.set(this.config);
        }
    };
    /**
     * Service Horodatage END ----------------------------
     */

    /**
     * Service Mail
     * Objet de gestion de la configuration du service de mail
     */
    $scope.mail = {
        type: "mail",
        isInit: false,
        config: {},
        oldConfig: {},
        init: function () {
            var that = this;
            if (!this.isInit) {
                this.config = Connecteurs.get({type: this.type}, function () {
                    that.isInit = true;
                    angular.extend(that.oldConfig, that.config);
                });
            } else {
                angular.extend(this.config, this.oldConfig);
            }
        },
        set: function () {
            angular.extend(this.oldConfig, this.config);
            var toSave = angular.copy(this.config);
            angular.extend(toSave, {
                type: this.type
            });
            Connecteurs.set(toSave);
        }
    };
    /**
     * Service Mail END ----------------------------
     */

    /**
     * Connecteur Archiland
     * Objet de gestion de la configuration du Connecteur Archiland
     */
    $scope.archiland = {
        type: "archiland",
        isInit: false,
        config: {},
        oldConfig: {},
        init: function () {
            var that = this;
            if (!this.isInit) {
                this.config = Connecteurs.get({type: this.type}, function () {
                    that.isInit = true;
                    var services = "";
                    for (var i = 0; i < that.config.services.length; i++) {
                        services += that.config.services[i] + "\n";
                    }
                    that.config.services = services;
                    angular.extend(that.oldConfig, that.config);
                });
            } else {
                angular.extend(this.config, this.oldConfig);
            }
        },
        set: function () {
            angular.extend(this.oldConfig, this.config);
            var toSave = angular.copy(this.config);
            angular.extend(toSave, {
                type: this.type
            });
            Connecteurs.set(toSave);
        }
    };
    /**
     * Connecteur Archiland END ----------------------------
     */

    /**
     * Gestion des modèles
     * Objet de gestion de la configuration des modèles
     */
    $scope.modeles = {
        //0 : none
        //1 : unit
        //2 : all
        hasReload: 0,
        reloadName: "",
        isInit: false,
        hasSaved: false,
        list: [],
        current: {},
        init: function () {
            var that = this;
            this.hasReload = 0;
            this.hasSaved = false;
            this.current = {};
            if (!this.isInit) {
                this.list = Modeles.list(function () {
                    that.isInit = true;
                });
            }
        },
        get: function (model) {
            var that = this;
            this.hasSaved = false;
            model.$get(function () {
                that.current = angular.copy(model);
            });
        },
        set: function () {
            var that = this;
            this.hasReload = 0;
            this.current.$set(function () {
                that.hasSaved = true;
            });
        },
        reload: function (model) {
            var that = this;
            if (!!model) {
                model.$reload(function () {
                    that.hasReload = 1;
                    that.reloadName = model.name;
                    if (model.id === that.current.id) {
                        that.get(model);
                    }
                });
            } else {
                Modeles.reload(function () {
                    that.hasReload = 2;
                    that.hasSaved = false;
                });
            }
        },
        getHeight: function () {
            return Math.max($(window).height() - 112, 400);
        }
    };
    /**
     * Gestion des modèles END ----------------------------
     */

    /**
     * Gestion des metadonnées
     * Objet de gestion de la configuration des metadonnées
     */
    $scope.meta = {
        hasReload: false,
        isInit: false,
        hasSaved: false,
        errorMessage:null,
        list: [],
        current: {},
        nature: [],
        init: function () {
            var that = this;
            this.hasReload = false;
            this.hasSaved = false;
            this.errorMessage = null;
            this.current = {};
            this.nature = [
                {key: 'Admin.Avance.Metadata.type_select', value: ""},
                {key: 'Admin.Avance.Metadata.text', value: "STRING"},
                {key: 'Admin.Avance.Metadata.date', value: "DATE"},
                {key: 'Admin.Avance.Metadata.integer', value: "INTEGER"},
                {key: 'Admin.Avance.Metadata.double', value: "DOUBLE"},
                {key: 'Admin.Avance.Metadata.boolean', value: "BOOLEAN"},
                {key: 'Admin.Avance.Metadata.url', value: "URL"}
            ];
            if (!this.isInit) {
                cache.metadonnees.list(true).then(function (list) {
                    that.isInit = true;
                    that.list = list;
                });
            }
        },
        select: function (m) {
            this.hasSaved = false;
            this.errorMessage = null;
            this.current = angular.copy(m);
            this.current.oldValues = this.current.values === undefined ? [] : this.current.values;
            this.current.oldname = this.current.name;
        },
        reload: function () {
            var that = this;
            Metadonnees.reload(function () {
                that.isInit = false;
                cache.metadonnees.forceReload();
                that.init();
            });
        },
        remove: function (m) {
            var that = this;
            modals.launch("SimpleConfirmation", {
                title: $filter('translate')('Admin.Avance.Metadata.mod_del_title') + " " + m.name,
                message: $filter('translate')('Admin.Avance.Metadata.mod_del_confirm'),
                ctrl: BaseController
            }, function () {
                for (var i = 0; i < that.list.length; i++) {
                    if (that.list[i].id === m.id) {
                        that.list.splice(i, 1);
                        break;
                    }
                }
                m.$remove();
                that.init();
            });
        },
        create: function () {
            this.hasSaved = false;
            this.errorMessage = null;
            this.current = new Metadonnees({
                isNew: true,
                oldValues: [],
                values: [],
                hasValues: false,
                deletable: true,
                isAlphaOrdered: true
            });
        },
        switchValues: function (ev) {
            this.current.values = ev.target.checked ? this.current.oldValues : undefined;
        },
        addValue: function () {
            this.current.values.push({
                value: "",
                deletable: true
            })
        },
        deleteValue: function (index) {
            this.current.values.splice(index, 1);
        },
        save: function () {
            var that = this;

            if (this.current.isAlphaOrdered) {
                this.current.values = $filter("orderBy")(this.current.values, 'value');
            }
            if (this.current.isNew) {
                this.current.isNew = false;

                this.current.$save(function () {
                    that.errorMessage = null;
                    that.hasSaved = true;
                    cache.metadonnees.forceReload();
                }, function (error) {
                    that.errorMessage = that.generateErrorMessage(error);
                });

                this.list.push(angular.copy(this.current));
            } else {
                this.current.$update(function () {
                    that.errorMessage = null;
                    that.hasSaved = true;
                    cache.metadonnees.forceReload();
                }, function (error) {
                    that.errorMessage = that.generateErrorMessage(error);
                });

                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].id === this.current.id) {
                        this.list[i] = angular.copy(this.current);
                    }
                }
            }
        },
        idExists: function() {
            for (var i = 0; i < this.list.length; i++) {
                if (this.list[i].id.toLowerCase() === this.current.id.toLowerCase()) {
                    this.errorMessage = $filter('translate')('Admin.Avance.Metadata.same_name_error');
                    return true;
                }
            }
            this.errorMessage = undefined;
            return false;
        },
        generateErrorMessage: function(error) {

            var res = $filter('translate')('Admin.Avance.Metadata.save_error');

            if (error.data.message) {
                res += " : " + JSON.stringify(error.data.message);
            }

            return res;
        }
    };
    /**
     * Gestion des metadonnées END ----------------------------
     */

    /**
     * Gestion des calques
     * Objet de gestion de la configuration des calques
     */
    $scope.calques = {
        //L'objet est-il initialisé ?
        isInit: false,
        //Liste des calques
        list: [],
        //Calque courrant
        current: {},
        //Element de calque courrant
        currentSub: {},
        //Nom de fichier en court d'upload
        filename: "",
        //Un fichier a-t-il été ajouté ?
        isFileAdded: false,
        //Liste des options de métadata
        selectOptions: {},
        //Edition en cours de commentaire
        editComment: false,
        /**
         * Fonction d'initialisation
         */
        init: function () {
            var that = this;
            this.current = {};
            this.currentSub = {};
            if (!this.isInit) {
                cache.calques.list().then(function (list) {
                    that.list = list;
                    that.isInit = true;
                });
            }
            if (this.metadonnees === undefined) {
                this.metadonnees = Metadonnees.list({asAdmin: true}, function () {
                    that.buildSelectList();
                });
            }
        },
        /**
         * Création d'un calque
         */
        create: function () {
            var that = this;
            modals.launch("SimpleInput", {
                title: $filter('translate')('Admin.Avance.Calque.mod_create_title'),
                message: $filter('translate')('Admin.Avance.Calque.mod_create_msg'),
                ctrl: InputController
            }, function (ret) {
                var calque = new Calques();
                angular.extend(calque, {
                    name: ret.value,
                    signature: [],
                    image: [],
                    commentaire: [],
                    metadata: []
                });
                calque.$save(function () {
                    that.list.push(calque);
                    that.current = angular.copy(calque);
                });
            });
        },
        /**
         * Sélection d'un calque
         * @param calque Calque sélectionné
         */
        select: function (calque) {
            if (calque.id !== this.current.id) {
                this.current = calque;
                this.currentSub = {};
                this.current.signature = SubCalques.list({type: "signature", idCalque: this.current.id});
                this.current.image = SubCalques.list({type: "image", idCalque: this.current.id});
                this.current.commentaire = SubCalques.list({type: "commentaire", idCalque: this.current.id});
                this.current.metadata = SubCalques.list({type: "metadata", idCalque: this.current.id});
            }
        },
        buildSelectList: function () {
            var that = this;
            var options = {};
            for (var i = 0; i < this.metadonnees.length; i++) {
                options['cu:' + that.metadonnees[i].id] = that.metadonnees[i].name;
            }
            options["cm:title"] = $filter('translate')('Admin.Avance.Calque.meta_title');
            options["ph:typeMetier"] = $filter('translate')('Admin.Avance.Calque.meta_type');
            options["ph:soustypeMetier"] = $filter('translate')('Admin.Avance.Calque.meta_sub');
            options["ph:dateValidation"] = $filter('translate')('Admin.Avance.Calque.meta_tdt');
            options["SIGNATURE|ph:signataire"] = $filter('translate')('Admin.Avance.Calque.meta_name_sig');
            options["SIGNATURE|ph:dateValidation"] = $filter('translate')('Admin.Avance.Calque.meta_date_sig');
            options["VISA|ph:signataire"] = $filter('translate')('Admin.Avance.Calque.meta_name_visa');
            options["VISA|ph:dateValidation"] = $filter('translate')('Admin.Avance.Calque.meta_date_visa');
            options["VISA|OR;ph:delegue;ph:passe-par|cm:title"] = $filter('translate')('Admin.Avance.Calque.meta_bureau_visa');
            options["VISA|ph:validator"] = $filter('translate')('Admin.Avance.Calque.meta_role_visa');
            options["SHA256|ph:signature-electronique"] = $filter('translate')('Admin.Avance.Calque.meta_sig_hash');
            options["SIGNATURE|OR;ph:delegue;ph:passe-par|cm:title"] = $filter('translate')('Admin.Avance.Calque.meta_bureau');
            options["SIGNATURE|ph:validator"] = $filter('translate')('Admin.Avance.Calque.meta_role');
            options["DELEGATION|SIGNATURE|IFF;ph:delegue;ph:passe-par|cm:title"] = $filter('translate')('Admin.Avance.Calque.meta_deleg');

            this.selectOptions = options;
        },
        /**
         * Création d'un élément de calque
         * @param type Type de l'élément
         */
        newSub: function (type) {
            this.currentSub = new SubCalques();
            this.currentSub.idCalque = this.current.id;
            this.currentSub.type = type;
            if (type === "metadata" && this.metadonnees === undefined) {
                this.metadonnees = Metadonnees.list({asAdmin: true}, function (result) {
                    console.log(result);
                    that.buildSelectList();
                });
            }
            if (type === "signature") {
                this.currentSub.rang = "0";
            }
            this.currentSub.postSignature = false;
        },
        /**
         * Fonction de remplacement des éléments non user-friendly des entrées de metadonnées
         * @param input Entrée à filtrer
         * @returns {*} L'entrée filtrée
         */
        metaReplace: function (input) {
            return input.replace("cu:", "").replace("{http://www.adullact.org/parapheur/metadata/1.0}", "");
        },
        /**
         * Suppression d'un élément d'un calque déjà enregistré
         * @param sub L'élément à supprimer
         * @param type Le type de l'élément à supprimer
         */
        deleteSub: function (sub, type) {
            var that = this;
            var title = $filter('translate')('Admin.Avance.Calque.mod_elem_' + type);
            modals.launch("SimpleConfirmation", {
                title: $filter('translate')('Admin.Avance.Calque.mod_delel_title') + " " + title,
                message: $filter('translate')('Admin.Avance.Calque.mod_delel_confirm'),
                ctrl: BaseController
            }, function () {
                for (var i = 0; i < that.current[type].length; i++) {
                    if (that.current[type][i].id === sub.id) {
                        that.current[type].splice(i, 1);
                        break;
                    }
                }
                sub.$remove();
            });
        },
        /**
         * Sauvegarde d'un élément de calque
         * @param type Le type de l'élément à sauvegarder
         */
        saveSub: function (type) {
            var that = this;
            this.currentSub.$save(function () {
                that.current[type].push(that.currentSub);
                that.currentSub = {};
            });
        },
        /**
         * Handler : Le fichier a été sélectionné
         * @param files Le fichier sélectionné (sous forme de liste)
         */
        fileAdded: function (files) {
            var that = this;
            $scope.$apply(function () {
                that.currentSub.nomImage = files[files.length - 1].name;
                that.isFileAdded = true;
            });
        },
        /**
         * Handler : Le fichier a été récupéré (encodé en Base64)
         * @param data Le fichier image encodé en Base64
         */
        fileEncoded: function (data) {
            var that = this;
            $scope.$apply(function () {
                that.currentSub.fichierImage = data.encodedFile;
                that.saveSub("image");
            });
        },
        /**
         * Handler : Le type de fichier n'est pas valide
         * @param ext Extension du fichier
         */
        wrongType: function (ext) {
            //TODO : Do something
        },
        /**
         * Suppression d'un calque
         * @param c Le calque à supprimer
         */
        remove: function (c) {
            var that = this;
            modals.launch("SimpleConfirmation", {
                title: $filter('translate')('Admin.Avance.Calque.mod_del_title') + " " + c.name,
                message: $filter('translate')('Admin.Avance.Calque.mod_del_confirm'),
                ctrl: BaseController
            }, function () {
                for (var i = 0; i < that.list.length; i++) {
                    if (that.list[i].id === c.id) {
                        that.list.splice(i, 1);
                        break;
                    }
                }
                c.$remove();
                that.init();
            });
        }
    };
    /**
     * Gestion des calques END ----------------------------
     */


    /**
     * Gestion des certificats cachet serveur
     * Objet de gestion de la configuration des certificats
     */
    $scope.cachet = {
        // Liste des certificats
        list: [],
        // Mail de warning pour certificat expiré
        mailForWarn: null,
        // Status de la sauvegarde du mailForWarn
        mailForWarnStatus: 0,
        // Certificat actuellement sélectionné
        current: null,
        // Certificat en cache
        editingCert: null,
        // CTRL initié ou non
        isInit: false,
        // Fichier ajouté
        isFileAdded: false,
        // Extension invalide
        wrongExt: false,
        // Le timer pour les infos de password
        typingTimer: undefined,
        // Verification code
        errorCode : undefined,
        // Timestamp pour expiration
        timestamp : Date.now(),
        init: function() {
            var that = this;
            this.current = null;
            this.errorCode = undefined;
            this.wrongExt = false;
            if (!this.isInit) {
                Cachets.getMailforwarn(function(data) {
                    that.mailForWarn = data.mailForWarn;
                });
                that.list = Cachets.list(function() {
                    that.isInit = true;
                });
            }
        },
        saveMailForWarn: function() {
            var that = this;
            this.mailForWarnStatus = 1;
            Cachets.setMailforwarn({mailForWarn: this.mailForWarn}, function(data) {
                that.mailForWarnStatus = 2;
            });
        },
        create: function() {
            this.current = new Cachets();
            this.current.isNew = true;
            this.current.title = "Nouveau certificat";
            this.current.editing = true;
            this.errorCode = undefined;
        },
        fileAdded: function(files) {
            console.log(files);
            var that = this;
            $scope.$apply(function () {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        $scope.$apply(function() {
                            that.current.certificate = evt.target.result.replace(/data:.*;base64,/, "");
                            that.stopTyping();
                        });
                    }
                };
                reader.readAsDataURL(files[0]);

                that.current.originalName = files[files.length - 1].name;
                that.isFileAdded = true;
                that.wrongExt = false;
            });
        },
        wrongType: function() {
            var that = this;
            $scope.$apply(function () {
                that.wrongExt = true;
            });
        },
        stopTyping: function() {
            this.current.description = undefined;
            if(this.current.certificate && this.current.password) {
                var that = this;
                that.errorCode = undefined;
                clearTimeout(that.typingTimer);
                that.typingTimer = setTimeout(that.loadInfos, 500);
            }
        },
        loadInfos: function() {
            var that = $scope.cachet;
            that.current.loadChange = true;
            if(that.current.password && that.current.certificate) {
                $http({
                    method: 'POST',
                    url: configuration.context + '/certInfo',
                    data: {
                        password: that.current.password,
                        certificate: that.current.certificate
                    }
                }).
                then(function (data) {
                    that.current.description = data.data;
                    that.current.loadChange = false;
                }).
                catch(function(error) {
                    that.errorCode = error.status;
                    that.current.loadChange = false;
                });
            }
        },
        save: function() {
            var that = this;
            this.current.$save().then(function() {
                if(that.current.isNew) {
                    // Suppression du password et du certificat de la mémoire
                    delete that.current.password;
                    delete that.current.certificate;
                    delete that.current.imageName;

                    that.current.isNew = false;
                    that.list.push(that.current);
                    that.current = null;
                    that.errorCode = undefined;
                } else {
                    that.current.editing = false;
                    // Replace master object
                    angular.copy(that.current, that.editingCert);
                }
            }).catch(function(code) {
                that.errorCode = code.status;
            });

        },
        remove: function(cert) {
            var that = this;
            modals.launch("SimpleConfirmation", {
                title: $filter('translate')('Admin.Avance.Cachet.mod_del_title') + " " + cert.title,
                message: $filter('translate')('Admin.Avance.Cachet.mod_del_confirm'),
                ctrl: BaseController
            }, function () {
                for (var i = 0; i < that.list.length; i++) {
                    if (that.list[i].id === cert.id) {
                        that.list.splice(i, 1);
                        break;
                    }
                }
                cert.$remove();
                that.init();
            });
        },
        select: function(cert) {
            this.editingCert = cert;
            this.current = angular.copy(cert);
            this.current.editing = false;
        },
        modify: function() {
            this.oldcert = angular.copy(this.current);
            this.current.editing = true;
        },
        cancel: function() {
            angular.copy(this.oldcert, this.current);
        },
        fileNameChanged: function(elm) {
            var that = this;
            $scope.$apply(function() {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    if (evt.target.readyState === FileReader.DONE) { // DONE == 2
                        $scope.$apply(function() {
                            that.current.image = evt.target.result.split(',')[1];
                        });
                    }
                };
                reader.readAsDataURL(elm.files[0]);

                that.current.imageName = elm.files[0].name;
            });
        }
    };


    /**
     * Gestion des certificats cachet serveur
     * Objet de gestion de la configuration des certificats
     */
    $scope.pastellMailsec = {
        // Liste des connecteurs
        list: [],
        // Connecteur actuellement sélectionné
        current: null,
        // CTRL initié ou non
        isInit: false,
        // Le timer pour les infos de password
        typingTimer: undefined,
        // Verification code
        errorCode: undefined,
        // Loader de connexion
        plugloading: false,
        // Liste des entités Pastell actuelles
        entities: [],
        // Listes des types Pastell actuels
        types: [],
        selectedId: undefined,
        init: function() {
            var that = this;
            this.current = null;
            this.errorCode = undefined;
            if (!this.isInit) {
                this.list = PastellConnector.list(function() {
                    that.isInit = true;
                });
            }
        },
        plug: function() {
            var that = this;
            that.errorCode = undefined;
            this.plugloading = true;
            PastellMailsec.listEntities(this.current, function(result) {
                that.entities = result;
                that.current.connected = true;
                that.plugloading = false;
            }, function(error) {
                that.errorCode = error.status;
                that.plugloading = false;
            })
        },
        unplug: function() {
            this.entities = [];
            delete this.current.entity;
            this.current.connected = false;
        },
        entitychanged: function() {
            // Not used right now... We can't have permission list
            /*
            var that = this;
            PastellMailsec.listTypes(this.current, function(result) {
                console.log(result);
                that.types = result;
            });
            */
        },
        create: function() {
            this.current = new PastellMailsec();
            this.current.isNew = true;
            this.current.title = "Nouveau connecteur";
            this.current.editing = true;
            this.current.connected = false;
            // Static definition of mailsec flux type on Pastell
            this.current.type = "mailsec";
            this.errorCode = undefined;
            this.selectedId = undefined;
            this.selected = undefined;
        },
        save: function() {
            var that = this;
            if(this.selectedId !== undefined) {
                this.current.id = this.selectedId;
            }
            var found = this.list.find(function(el) {
                return (el.title === that.current.title) && (+el.serverId !== +that.current.id);
            });

            if(!found) {
                // Save in pastell connector
                this.current.$save().then(function() {
                    // Suppression du password et du certificat de la mémoire
                    delete that.current.password;

                    if(that.current.isNew) {
                        // Create connector in parapheur core
                        var connector = new PastellConnector();
                        that.current.serverId = that.current.id;
                        connector.serverId = that.current.id;
                        connector.title = that.current.title;

                        connector.$save().then(function() {
                            if(that.current.isNew) {
                                that.list.push(connector);
                            }

                            that.current.isNew = false;
                            that.current = null;
                        });
                    } else {
                        that.selected.title = that.current.title;
                        that.selected.$save();

                        that.current.isNew = false;
                        that.current = null;
                    }

                    that.errorCode = undefined;
                    that.selected = undefined;

                }).catch(function(code) {
                    that.errorCode = code.status;
                });
            } else {
                this.exists = true;
            }
        },
        remove: function(cert) {
            var that = this;
            modals.launch("SimpleConfirmation", {
                title: $filter('translate')('Admin.Avance.PastellMailsec.mod_del_title') + " " + cert.title,
                message: $filter('translate')('Admin.Avance.PastellMailsec.mod_del_confirm'),
                ctrl: BaseController
            }, function () {
                for (var i = 0; i < that.list.length; i++) {
                    if (that.list[i].id === cert.id) {
                        that.list.splice(i, 1);
                        break;
                    }
                }
                PastellMailsec.remove({id:cert.serverId});
                cert.$remove();
                that.init();
            });
        },
        select: function(connector) {
            var that = this;
            this.selected = connector;
            PastellMailsec.get({id:connector.serverId}, function(result) {
                that.current = result;
                that.current.title = connector.title;

                PastellMailsec.listEntities(that.current, function(result) {
                    that.entities = result;
                    that.current.connected = true;
                    that.plugloading = false;
                }, function(error) {
                    that.errorCode = error.status;
                    that.plugloading = false;
                });

                that.selectedId = that.current.id;
                delete that.current.id;
            });
        },
        modify: function() {
            this.oldcert = angular.copy(this.current);
            delete this.current.originalName;
            this.current.editing = true;
        },
        cancel: function() {
            angular.copy(this.oldcert, this.current);
        }
    }
}
AvanceAdminController.$inject = ['$scope', 'Connecteurs', 'Horodate', 'Attestation', 'Modeles', 'Metadonnees', 'Calques', 'SubCalques', 'modals', 'cache', '$filter','Cachets', '$http', 'configuration', 'PastellMailsec', 'PastellConnector']; // For JS compilers
;
//Variables statiques, type de modale
var EDIT = 0;
var NEW = 1;

//Controller for bureau page
function BureauxAdminController($scope, Bureaux, Delegations, utils, $modal, modals, $filter, cache) {

    var list = [];

    //Objet de gestion de la page d'admin des bureaux
    $scope.bureaux = {
        //Bureau séléctionné
        selected: {},
        //Bureau en cours d'edition
        edited: {},
        //Objet de gestion de la délégation
        delegation: {
            //Delegation séléctionnée
            selected: {}
        },
        //Users trouvés par la recherche
        foundUsers: [],
        //Bureaux ordonnés
        ordered: [],
        //Bureaux ordonnés pour delegation possible
        editedOrdered: [],
        //Liste des metadonnées
        metadatas: [],
        //Liste des bureaux
        list: [],
        //Champ de recherche de bureaux
        search: "",
        //Recherche effectuée
        isSearching: false,
        /**
         * Initialisation du controlleur
         */
        init: function () {
            var that = this;
            this.getList();
            //this.metadatas = Metadonnees.list({asAdmin: true});
            cache.metadonnees.list(true).then(function (list) {
                that.metadatas = list;
            });
        },
        /**
         * Récupération de la liste des bureaux, puis tri alphabétique et gestion
         */
        getList: function () {
            var self = this;
            self.isSearching = true;
            //Affichage de la liste des bureaux
            cache.bureaux.list().then(function (bureaux) {
                list = bureaux;
                self.handleList(bureaux);
                self.isSearching = false;
            });
        },
        /**
         * Tri alphabétique et gestion de liste de bureaux
         */
        handleList: function (bureaux) {
            var self = this;

            var getParentProfondeur = function (value) {
                // Trouver le parent, chercher son nom
                var bureauParent = bureaux.filter(function(elm) {
                    return elm.id === value.hierarchie;
                });
                if(bureauParent.length !== 0) {
                    return getParentProfondeur(bureauParent[0]) + 1;
                } else {
                    return 0;
                }
            };

            //On applatit les bureaux... Et déselection... Et met à jour la profondeur
            angular.forEach(bureaux, function (value) {
                delete value.child;
                value.selected = undefined;
                if(!value.hierarchie) {
                    value.profondeur = 0;
                } else {
                    value.profondeur = getParentProfondeur(value);

                }
            });
            self.list = $filter('orderBy')(bureaux, 'title', false);
            self.ordered = utils.reorderBureaux(self.list);
        },
        /**
         * Recherche de bureaux avec recherche utilisateur pour table
         * @param obj Bureau à filtrer
         * @returns Boolean true si le bureau correspond à la recherche, false sinon
         */
        queryForTable: function (obj) {
            //on doit y accéder depuis le scope car la fonction est copiée (et non pas appelée), donc le this ne fonctionne plus
            return $scope.bureaux.bureauFilter(obj.branch, $scope.bureaux.search);
        },
        /**
         * Recherche de bureaux avec recherche utilisateur
         * @param obj Bureau à filtrer
         * @param str Recherche
         * @returns Boolean true si le bureau correspond à la recherche, false sinon
         */
        bureauFilter: function(obj, str) {
            if (str != null) {
                var s = str.toLowerCase();
                var hasPropWithSearch = false;
                var hasSecWithSearch = false;
                for (var i = 0; i < obj.proprietaires.length; i++) {
                    var prop = obj.proprietaires[i];
                    hasPropWithSearch = hasPropWithSearch ||
                        ~prop.username.toLowerCase().indexOf(s) ||
                        (prop.firstName && ~prop.firstName.toLowerCase().indexOf(s)) ||
                        (prop.lastName && ~prop.lastName.toLowerCase().indexOf(s));
                }
                for(var j = 0; j < obj.secretaires.length; j++) {
                    var sec = obj.secretaires[j];
                    hasSecWithSearch = hasSecWithSearch ||
                        ~sec.username.toLowerCase().indexOf(s) ||
                        (sec.firstName && ~sec.firstName.toLowerCase().indexOf(s)) ||
                        (sec.lastName && ~sec.lastName.toLowerCase().indexOf(s));
                }
                return ~obj["name"].toLowerCase().indexOf(s) ||
                    ~obj["title"].toLowerCase().indexOf(s) ||
                    ~obj["description"].toLowerCase().indexOf(s) ||
                    hasSecWithSearch || hasPropWithSearch;
            }
            return true;
        },
        /**
         * Permet de rechercher le bureau d'id donné dans la liste simple des bureaux
         * @param id L'id du bureau à rechercher
         */
        findWithId: function(id) {
            for(var i =0; i < this.list.length; i++) {
                if(this.list[i].id === id) {
                    return this.list[i];
                }
            }
        },
        /**
         * Étendre l'arbre des bureaux
         */
        expandAll: function() {
            $scope.$broadcast("expandAll");
        },
        /**
         * Réduire l'arbre des bureaux
         */
        reduceAll: function() {
            $scope.$broadcast("reduceAll");
        },
        /**
         * Sélection d'un bureau
         * @param bureau Le bureau à sélectionner
         */
        select: function(bureau) {
            this.selected = bureau;
        },
        /**
         * Lancement d'une modale, pour la création ou l'édition d'un bureau
         * @param title Titre de la modale
         * @param type Type de modale (Création ou édition)
         * @param success Handler en cas de retour positif de la modale
         */
        launchModal: function(title, type, success) {
            var self = this;
            var modalInstance = $modal.open({
                templateUrl: 'partials/modals/bureauxModal.html',
                controller: EditBureauCtrl,
                resolve: {
                    type: function() {
                        return type;
                    },
                    titleModal: function () {
                        return title;
                    },
                    // Moche, mais pas le choix... !
                    selfobj: function() {
                        return self;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                if(typeof success === "function") {
                    success(result);
                }
            }, function () {
                self.selected.selected = false;
                self.selected = undefined;
            });
        },
        /**
         * Edition d'un bureau
         */
        edit: function() {
            this.launchModal("Admin.Bureaux.BuMod_Edit", EDIT);
        },
        /**
         * Suppression d'un bureau
         * NON IMPLEMENTÉ - NE PAS UTILISER
         */
        remove: function() {
            var self = this;
            modals.launch("SimpleConfirmation", {
                title: "Suppression du bureau " + self.selected.title,
                message: "Etes-vous sûr de vouloir supprimer le bureau " + self.selected.title + " ? (Attention, ce bureau ne sera pas supprimé mais rendu invisible)",
                ctrl: BaseController
            }, function() {
                Bureaux.remove({id:self.selected.id}, function() {
                    self.getList();
                });
                self.selected = {};
            });
        },
        /**
         * Création d'un bureau
         */
        create: function() {
            //Deselect current bureau
            if(this.selected) this.selected.selected = false;
            //New bureau
            this.selected = new Bureaux();
            //Init arrays
            this.selected['delegations-possibles'] = [];
            this.selected['metadatas-visibility'] = [];
            this.selected['proprietaires'] = [];
            this.selected['secretaires'] = [];
            this.selected.description = "";
            this.selected.profondeur = 0;

            this.launchModal("Admin.Bureaux.BuMod_Create", NEW);
        },
        /**
         * Mise à jour d'un bureau suite au retour de la fenêtre modale
         * @param editedBureau Le bureau à sauvegarder
         * @param selectedDelegation La délégation à sauvegarder
         * @param success function lancée en cas de succès de l'opération
         */
        update: function(editedBureau, selectedDelegation, success) {
            var self = this;
            //Id du bureau courant
            var id = this.selected.id;
            //Si l'id est défini, mise à jour
            if(id) {
                var updated = utils.diff(this.selected, editedBureau);
                var updateBureau = function () {
                    if(updated) {
                        //Suppression de la propriété 'child'
                        delete updated.child;
                        //Mise à jour sur le serveur du bureau courant, avec sauvegarde des changements seulement
                        Bureaux.update({id:self.selected.id}, updated, function() {
                            success();
                        });
                    } else {
                        success();
                    }
                };
                //Mise à jour sur le serveur de la delegation courante - si not loop
                if (selectedDelegation.willItLoop) {
                    updateBureau();
                } else {
                    Delegations.update({id: editedBureau.id}, selectedDelegation, function () {
                        updateBureau();
                    });
                    //Récupération du nom du bureau de la délégation
                    var bureauCible = self.findWithId(selectedDelegation.idCible);
                    selectedDelegation.titreCible = bureauCible ? bureauCible.name : undefined;
                    //mise à jour de la délégation en local
                    editedBureau.delegation = selectedDelegation;
                }
                //Mise à jour en local du bureau courant
                angular.extend(this.selected, editedBureau);
                self.handleList(list);

            } else { //Sinon, création
                //Création de la resource
                editedBureau = new Bureaux(editedBureau);

                editedBureau.$save(function() {
                    //Mise à jour sur le serveur de la delegation courante
                    Delegations.update({id:editedBureau.id}, selectedDelegation, function() {
                        success();
                    });
                    //Récupération du nom du bureau de la délégation
                    var bureauCible = self.findWithId(selectedDelegation.idCible);
                    selectedDelegation.titreCible = bureauCible ? bureauCible.name : undefined;
                    //mise à jour de la délégation en local
                    editedBureau.delegation = selectedDelegation;
                    //Mise à jour en local du bureau courant
                    angular.extend(self.selected, editedBureau);
                    list.push(editedBureau);
                    self.handleList(list);
                });
            }
        }
    };

    //Lancement de l'initialisation du controlleur
    $scope.bureaux.init();

}
BureauxAdminController.$inject = ['$scope', 'Bureaux', 'Delegations', 'utils', '$modal', 'modals', '$filter', 'cache']; // For JS compilers

var EditBureauCtrl = function($scope, $filter, $modalInstance, Delegations, cache, type, titleModal, selfobj) {
    $scope.titleModal = titleModal;
    $scope.bureaux = selfobj.list;
    $scope.selectedBureau = selfobj.selected;
    $scope.orderedBureaux = selfobj.ordered;
    $scope.metadatas = selfobj.metadatas;

    /**
     * Recherche de bureaux avec recherche utilisateur pour filtre
     * @param str Recherche
     * @returns Function Permettant l'utilisation avec le mot clé :filter dans le template
     */
    $scope.queryForFilter = function(str) {
        return function(obj) {
            return selfobj.bureauFilter(obj, str);
        }
    };
    $scope.searchObj = {};
    $scope.hasSearchUser = false;

    //Bureaux ordonnés pour delegation possible
    $scope.editedOrderedBureaux = [];
    //Bureau en cours d'edition
    $scope.editedBureau = {};

    //Init new delegation
    $scope.selectedDelegation = {};
    if(type === EDIT) {
        $scope.selectedDelegation = new Delegations($scope.selectedBureau.delegation);
        if(!$scope.selectedDelegation["date-debut-delegation"]) {
            $scope.selectedDelegation["date-debut-delegation"] = Date.now();
        }
        $scope.delegationEnabled = angular.copy(!!$scope.selectedDelegation.idCible);
        $scope.delegationActivated = !!$scope.selectedDelegation.idCible;

        if($scope.delegationEnabled) {
            $scope.selectedBureauForDelegation = {
                id: $scope.selectedDelegation.idCible,
                title: $scope.selectedDelegation.titreCible
            };
        }

        $scope.selectedDelegation['deleguer-presents'] = true;
    }

    //type de modale
    $scope.type = type;

    //copy selectedBureau without binding
    angular.copy($scope.selectedBureau, $scope.editedBureau, false);
    //Copy orderedBureaux for delegation possible
    angular.copy($scope.orderedBureaux, $scope.editedOrderedBureaux, false);

    $scope.bureauxExceptCurrent = angular.copy(selfobj.list);
    var i = $scope.bureauxExceptCurrent.length;
    if($scope.selectedBureau.id) {
        while(i--) {
            if($scope.bureauxExceptCurrent[i].id === $scope.selectedBureau.id) {
                $scope.bureauxExceptCurrent.splice(i, 1);
            }
        }
    }

    $scope.listHandler = {
        bureaux: [],
        subList : [],
        subListDelegationPossible: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, {name:toSearch});
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.subListDelegationPossible = $filter('notSameId')(this.bureaux.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize), $scope.editedBureau.id);
            this.subList = $filter('notChild')(this.subListDelegationPossible, $scope.editedBureau.id);
            //this.subListDelegationPossible = $filter('notSameId')(this.subListDelegationPossible,  $scope.editedBureau['delegations-possibles']);
        },
        selectSuperieur: function(b) {
            if(b) {
                $scope.editedBureau.hierarchie = b.id;
            } else {
                $scope.editedBureau.hierarchie = null;
            }
            $scope.updateProfondeur();
            this.getNewList();
        },
        selectDelegationPossible: function(b) {
            $scope.editedBureau['delegations-possibles'].push(b.id);
            this.getNewList();
        },
        unselectDelegationPossible: function(id) {
            var indexInArray = $scope.editedBureau['delegations-possibles'].indexOf(id);
            if(~indexInArray) {
                $scope.editedBureau['delegations-possibles'].splice(indexInArray, 1);
            }
            this.getNewList();
        },
        selectAllResults: function() {
            var filteredBureaux = $filter('notSameId')($filter('notSameId')(this.bureaux, $scope.editedBureau['delegations-possibles']),$scope.editedBureau.id);
            for(var i = 0; i < filteredBureaux.length; i++) {
                $scope.editedBureau['delegations-possibles'].push(filteredBureaux[i].id);
            }
            this.getNewList();
        },
        unselectAll: function() {
            $scope.editedBureau['delegations-possibles'] = [];
            this.getNewList();
        }
    };
    //Get associes ! ... Only if we have an id though
    if($scope.editedBureau.id) {
        $scope.editedBureau.$associesAsAdmin().then(function(data) {
            $scope.editedBureau["delegations-possibles"] = data["delegations-possibles"];
            $scope.listHandler.init();
        });
    } else {
        $scope.listHandler.init();
    }


    var users = [];

    $scope.listUsersHandler = {
        users: [],
        subList : [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.users = $filter('orderBy')($filter('filter')(users, toSearch), 'lastName');
            this.total = this.users.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.subList = this.users.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize);
        }
    };

    cache.users.list().then(function(list) {
        users = list;
        $scope.listUsersHandler.init();
    });

    $scope.userSelected = function(item) {
        var toReturn = false;
        angular.forEach($scope.editedBureau.proprietaires, function(value, key) {
            if(value.username === item.username) {
                toReturn = true;
            }
        });
        angular.forEach($scope.editedBureau.secretaires, function(value, key) {
            if(value.username === item.username) {
                toReturn = true;
            }
        });
        return toReturn;
    };

    //Sélection de la checkbox des délégations possibles
    $scope.checkDelegationPossible = function(checked, id) {
        var indexInArray = $scope.editedBureau['delegations-possibles'].indexOf(id);
        if(checked && indexInArray == -1) {
            $scope.editedBureau['delegations-possibles'].push(id);
        } else if(!checked && indexInArray != -1) {
            $scope.editedBureau['delegations-possibles'].splice(indexInArray, 1);
        }
    };

    //Sélection de la checkbox des délégations possibles
    $scope.removeFromProperty = function(array, id) {
        var indexInArray = array.indexOf(id);
        if(~indexInArray) {
            array.splice(indexInArray, 1);
        }
    };

    $scope.selectAllDelagationsPossibles = function(value, filter) {
        var listIds = [];
        var objects = $filter('filter')($scope.bureaux, filter);
        if(filter) {
            listIds = $scope.editedBureau['delegations-possibles'];
            for(var i = 0; i < objects.length; i++) {
                var index = listIds.indexOf(objects[i].id);
                if(~index) {
                    if(!value) listIds.splice(index, 1);
                } else {
                    if(value && $scope.editedBureau.id !== objects[i].id) listIds[listIds.length] = objects[i].id;
                }
            }
        } else if(value) {
            //Get list ids bureaux
            for(var j = 0; j < objects.length; j++) {
                if($scope.editedBureau.id !== objects[j].id) {
                    listIds[listIds.length] = objects[j].id;
                }
            }
        }
        $scope.editedBureau['delegations-possibles'] = listIds;
    };

    $scope.checkMetadataVisibility = function(event, id) {
        var checked = event.currentTarget.checked;
        var indexInArray = $scope.editedBureau['metadatas-visibility'].indexOf(id);
        if(checked && indexInArray == -1) {
            $scope.editedBureau['metadatas-visibility'].push(id);
        } else if(!checked && indexInArray != -1) {
            $scope.editedBureau['metadatas-visibility'].splice(indexInArray, 1);
        }
    };

    $scope.selectAllMetadatas = function() {
        $scope.editedBureau['metadatas-visibility'] = [];
        for(var i = 0; i < $scope.metadatas.length; i++) {
            $scope.editedBureau['metadatas-visibility'].push($scope.metadatas[i].id);
        }

    };

    $scope.unselectAllMetadatas = function() {
        $scope.editedBureau['metadatas-visibility'] = [];
    };

    $scope.changeHabilitations = function() {
        if($scope.editedBureau.hab_enabled) {
            $scope.editedBureau.hab_enchainement = true;
            $scope.editedBureau.hab_archivage = false;
            $scope.editedBureau.hab_traiter = true;
            $scope.editedBureau.hab_transmettre = true;
            $scope.editedBureau.hab_secretariat = $scope.editedBureau.secretaires.length > 0;
        } else {
            $scope.editedBureau.hab_archivage = undefined;
            $scope.editedBureau.hab_traiter = undefined;
            $scope.editedBureau.hab_transmettre = undefined;
            $scope.editedBureau.hab_enchainement = undefined;
            $scope.editedBureau.hab_secretariat = undefined;
        }
    };

    //Mise à jour de la profondeur, fonction appellé à chaque changement de supérieur hierarchique
    $scope.updateProfondeur = function() {
        $scope.editedBureau.hierarchie === null ?
            $scope.editedBureau.profondeur = 0 :
            $scope.editedBureau.profondeur = $filter('filter')($scope.bureaux, {id:$scope.editedBureau.hierarchie})[0].profondeur +1;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.isSaving = false;
    $scope.ok = function () {
        $scope.isSaving = true;
        selfobj.update($scope.editedBureau, $scope.selectedDelegation, function(){
            $scope.isSaving = false;
            $modalInstance.close({
                editedBureau : $scope.editedBureau,
                selectedDelegation : $scope.selectedDelegation
            });
        });
    };

    $scope.checkDelegation = function(item) {
        if(!!item) {
            $scope.selectedDelegation.idCible = item.id;
        }
        if($scope.selectedDelegation['date-fin-delegation']) {
            //On Décale la date de fin à 23h59... Pour prendre en compte la fin de journée sans devoir sélectionner le jour suivant
            var fin =  new Date($scope.selectedDelegation['date-fin-delegation']);
            $scope.selectedDelegation['date-fin-delegation'] = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate(), 23, 59, 0, 0).getTime();
        }
        if($scope.selectedDelegation.idCible
            && ($scope.selectedDelegation['date-fin-delegation']
            || $scope.selectedDelegation['date-debut-delegation'])) {
            $scope.selectedDelegation.$willItLoop();
        }
    };
};
;
//Controller for bureau page
function CircuitsAdminController($scope, Circuits, modals, $filter, cache) {
    //Affichage de la liste des bureaux
    $scope.maxSize = 25;
    $scope.selectedCircuit = {};
    $scope.selectedEtape = {};

    $scope.saved = false;

    //recherche sur les bureaux
    $scope.filterBureau = "";

    $scope.page = 0;
    $scope.total = 0;

    var selectName, selectId, currentSearch;

    var pagedCircuits = [];

    $scope.searchCircuit = function(search) {
        pagedCircuits = [];
        $scope.page = 0;
        currentSearch = search;
        Circuits.list({search:"*"+(currentSearch||"")+"*", maxSize:$scope.maxSize, page:$scope.page}, function(result) {
            $scope.total = result.length ? result[0].total : 0;
            pagedCircuits[$scope.page] = result;
            $scope.circuits = result;
        });
    };

    $scope.searchCircuit("");

    $scope.pagine = function(toAddToPage) {
        $scope.page += toAddToPage;
        var page = $scope.page;
        if(pagedCircuits[$scope.page]) {
            $scope.circuits = pagedCircuits[$scope.page];
        } else {
           Circuits.list({search:"*"+(currentSearch||"")+"*", maxSize:$scope.maxSize, page:$scope.page}, function(result){
                pagedCircuits[page] = result;
                $scope.circuits = result;
           });
        }
    };

    var reloadCurrentPage = function() {
        pagedCircuits = [];
        Circuits.list({search:"*"+(currentSearch||"")+"*", maxSize:$scope.maxSize, page:$scope.page}, function(result){
            if(result.length === 0 && $scope.page != 0) {
                $scope.page--;
                reloadCurrentPage();
            } else {
                $scope.total = result.length ? result[0].total : 0;
                pagedCircuits[$scope.page] = result;
            }
            $scope.circuits = result;
        });
    };

    $scope.hasMetadataMandatory = function(circuit) {
        var hasMetadataMandatory = false;
        for(var i = 0; i < circuit.etapes.length; i++) {
            if(circuit.etapes[i].listeMetadatas.length > 0) {
                hasMetadataMandatory = true;
                break;
            }
        }
        return hasMetadataMandatory;
    };

    $scope.newCircuit = function(circuit) {
        $scope.saved = false;
        $scope.selectedEtape = {};
        delete $scope.selectedEtape.index;
        $scope.selectedCircuit = {
            aclGroupes : [],
            aclParapheurs : [],
            editable : true,
            isUsed : false,
            etapes : [{actionDemandee:"ARCHIVAGE", listeNotification:[], transition:"EMETTEUR"}],
            isPublic : false,
            name : ""
        };
        if(circuit) {
            angular.extend($scope.selectedCircuit, angular.copy(circuit));
            $scope.selectedCircuit.id = undefined;
            $scope.selectedCircuit.name = circuit.name + " - copie";
            $scope.selectedCircuit.isCopy = true;
            $scope.selectedCircuit.isUsed = false;
        }
        $scope.selectedCircuit.editable = true;
        $scope.baseName = $scope.selectedCircuit.name;
    };

    $scope.deleteCircuit = function(circuit) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Circuits.Wo_Delete') + " " + circuit.name,
            message: $filter('translate')('Admin.Circuits.Wo_Confirm') + " " + circuit.name + " ?",
            ctrl: BaseController
        }, function() {
            circuit.$delete(function() {
                reloadCurrentPage();
            });
            for(var i = 0; i < $scope.circuits.length; i++) {
                if($scope.circuits[i].id === circuit.id) {
                    $scope.circuits.splice(i, 1);
                    break;
                }
            }
            $scope.selectedCircuit = {};
        });
    };

    $scope.selectCircuit = function(circuit) {
        $scope.filterBureau = "";
        $scope.saved = false;
        $scope.baseName = circuit.name;
        $scope.selectedEtape = {};
        delete $scope.selectedEtape.index;
        selectName = circuit.name;
        selectId = circuit.id;
        $scope.selectedCircuit = angular.copy(circuit);
        //En cas de vieux circuit sans étape d'archivage finale
        if($scope.selectedCircuit.etapes[$scope.selectedCircuit.etapes.length-1].actionDemandee !== 'ARCHIVAGE') {
            $scope.selectedCircuit.etapes.push({actionDemandee:"ARCHIVAGE", listeNotification:[], transition:"EMETTEUR"});
        }
    };

    $scope.selectEtape = function(etape, index) {
        $scope.filterBureau = "";
        $scope.saved = false;
        $scope.selectedEtape = etape;
        $scope.selectedEtape.index = index;
        $scope.selectedTransition = etape.parapheur ? etape.parapheur : etape.transition;
    };

    $scope.deleteEtape = function(index) {
        $scope.saved = false;
        if(index) {
            $scope.selectedCircuit.etapes.splice(index,1);
        } else {
            $scope.selectedCircuit.etapes.splice($scope.selectedEtape.index,1);
        }
        $scope.selectedEtape = {};
    };

    $scope.sortableOpts = {
        placeholder:'ui-state-highlight',
        update: function(event, ui) {
            if($scope.selectedEtape.index == ui.item.sortable.index) {
                $scope.selectedEtape.index = ui.item.sortable.dropindex;
            }
        }
    };

    $scope.addEtape = function(index) {
        $scope.saved = false;
        $scope.selectedEtape = {transition:"EMETTEUR", index:index, actionDemandee:"VISA", listeNotification:[], listeMetadatas:[]};
        $scope.selectedCircuit.etapes.splice(index,0,$scope.selectedEtape);
    };

    $scope.changeTransitionEtape = function() {
        if($scope.selectedTransition !== "EMETTEUR" && $scope.selectedTransition !== "CHEF_DE") {
            $scope.selectedEtape.transition = "PARAPHEUR";
            $scope.selectedEtape.parapheur = $scope.selectedTransition;
            var found = false,
                i = 0;
            while(!found && i < $scope.listHandler.list.length) {
                if($scope.listHandler.list[i].id === $scope.selectedEtape.parapheur) {
                    $scope.selectedEtape.parapheurName = $scope.listHandler.list[i].title;
                    found = true;
                }
                i++;
            }
        } else {
            $scope.selectedEtape.transition = $scope.selectedTransition;
            delete $scope.selectedEtape.parapheur;
            delete $scope.selectedEtape.parapheurName;
        }
    };

    $scope.saveCircuit = function() {
        $scope.alreadyExist = false;
        $scope.selectedCircuit = new Circuits($scope.selectedCircuit);
        if($scope.selectedCircuit.id) {
            $scope.selectedCircuit.$update(function() {
                for(var i = 0; i < $scope.circuits.length; i++) {
                    if($scope.circuits[i].name === $scope.selectedCircuit.name && selectName !== $scope.selectedCircuit.name) {
                        $scope.circuits.splice(i, 1);
                    }
                    if($scope.circuits[i].id === selectId) {
                        $scope.circuits[i] = angular.copy($scope.selectedCircuit);
                    }
                    $scope.saved = true;
                    $scope.baseName = $scope.selectedCircuit.name;
                }
                reloadCurrentPage();
            });
        } else {
            // Check if exist :
            Circuits.list({search: $scope.selectedCircuit.name, maxSize: 10, page: 0}, function (result) {
                var exist = false;
                for(var i = 0; i < result.length; i++) {
                    if(result[i].name.toLowerCase() === $scope.selectedCircuit.name.toLowerCase()) {
                        exist = true;
                        break;
                    }
                }
                if(!exist) {
                    $scope.selectedCircuit.$save(function() {
                        var found = false;
                        for(var i = 0; i < $scope.circuits.length; i++) {
                            if($scope.circuits[i].name === $scope.selectedCircuit.name) {
                                $scope.circuits[i] = angular.copy($scope.selectedCircuit);
                                found = true;
                                break;
                            }
                        }
                        if(!found) {
                            $scope.circuits.push(angular.copy($scope.selectedCircuit));
                        }
                        selectName = $scope.selectedCircuit.name;
                        selectId = $scope.selectedCircuit.id;
                        $scope.saved = true;
                        $scope.baseName = $scope.selectedCircuit.name;
                        reloadCurrentPage();
                    });
                } else {
                    $scope.alreadyExist = true;
                }
            });

        }
    };

    $scope.listMetaHandler = {
        list: [],
        init: function() {
            var that = this;

            cache.metadonnees.list(true).then(function(metaList) {
                that.list = $filter('orderBy')(metaList, 'name', false);
            });
        },
        getNameWithId: function(id) {
            return this.list.find(function (element) {
                return element.id === id;
            })
        }
    };

    $scope.listHandler = {
        list: [],
        bureaux: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            var that = this;
            cache.bureaux.list().then(function(bureaux) {
                that.list = $filter('orderBy')(bureaux, 'title', false);
                that.search("");
            });
        },
        search: function(toSearch) {
            this.page = 0;
            this.bureaux = $filter('filter')(this.list, toSearch);
            this.total = this.bureaux.length;
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
        },
        selectEtape: function(b) {
            if(b.id) {
                $scope.selectedEtape.transition = "PARAPHEUR";
                $scope.selectedEtape.parapheur = b.id;
                $scope.selectedEtape.parapheurName = b.title;
            } else {
                $scope.selectedEtape.transition = b;
                delete $scope.selectedEtape.parapheur;
                delete $scope.selectedEtape.parapheurName;
            }
        }
    };

    $scope.listHandler.init();
    $scope.listMetaHandler.init();

}
CircuitsAdminController.$inject = ['$scope', 'Circuits', 'modals', '$filter', 'cache']; // For JS compilers;
//Controller for bureau page
function DossiersAdminController($scope, $filter, modals, Dossiers, ngTableParams, usSpinnerService, cache) {
    cache.bureaux.list().then(function(bureaux) {
        $scope.bureaux = bureaux;
    });
    cache.types.list().then(function(list) {
        $scope.types = list;
    });
    $scope.dossiersShowed = {};
    $scope.opt = {
        bureau: undefined,
        type: "",
        sousType: "",
        title: "",
        showOnlyCurrent: false,
        showOnlyLate: false
    };
    $scope.noneOpt = angular.copy($scope.opt);

    $scope.hasFoundFolder = true;

    $scope.buttonsDisabled = false;
    $scope.hasSearch = false;

    $scope.getDossiers = function(opt) {
        $scope.buttonsDisabled = true;
        $scope.hasFoundFolder = true;
        $scope.hasSearch = true;

        var localOpt = angular.copy(opt);
        if(localOpt && localOpt.bureau) {
            localOpt.bureau = localOpt.bureau.id;
        }

        usSpinnerService.spin("spinnerDossiers");

        $scope.dossiers = Dossiers.listAsAdmin(localOpt, function() {

            usSpinnerService.stop("spinnerDossiers");

            buildTable();

            $scope.hasFoundFolder = $scope.dossiers.length > 0;

            $scope.buttonsDisabled = false;
        })
    };

    var buildTable = function() {
        if(!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.dossiers, params.orderBy()) :
                        $scope.dossiers;
                    params.total($scope.dossiers.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.reload();
        }
    };

    $scope.viewJournal = function(dossier) {
        modals.launch("JOURNAL", function() {
            return [dossier];
        });
    };

    $scope.viewProperties = function(dossier) {
        modals.launch("PROPERTIES", function() {
            return [dossier];
        });
    };

    $scope.confirmDelete = function(dossier) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Dossiers.Mod_Del') + " " + dossier.title,
            message: $filter('translate')('Admin.Dossiers.Mod_Del_Mess') + " " + dossier.title + " ?",
            ctrl: BaseController
        }, function() {
            var id = dossier.id;
            dossier.$destroy();
            for(var i = 0; i < $scope.dossiers.length; i++) {
                var d = $scope.dossiers[i];
                if(d.id === id) {
                    $scope.dossiers.splice(i, 1);
                }
            }
            buildTable();
        });
    };

    $scope.unlock = function(dossier) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Dossiers.Mod_Unlock') + " " + dossier.title,
            message: $filter('translate')('Admin.Dossiers.Mod_Unlock_Mess') + " " + dossier.title + " ?",
            ctrl: BaseController
        }, function() {
            var id = dossier.id;
            dossier.$unlock();
            for(var i = 0; i < $scope.dossiers.length; i++) {
                var d = $scope.dossiers[i];
                if(d.id === id) {
                    $scope.dossiers[i].locked = false;
                }
            }
            buildTable();
        });
    };

    $scope.confirmTransfert = function(dossier) {
        modals.launch("MOVE", function() { return [dossier];});
    };

    $scope.getStateName = function(banette) {
        var r = "";
        switch(banette) {
            case "Dossiers en fin de circuit": r = $filter('translate')('Admin.Dossiers.State_App'); break;
            case "Dossiers à relire - annoter": r = $filter('translate')('Admin.Dossiers.State_Sec'); break;
            case "Dossiers à traiter": r = $filter('translate')('Admin.Dossiers.State_Cur'); break;
            case "Dossiers à transmettre": r = $filter('translate')('Admin.Dossiers.State_Prep'); break;
            case "Dossiers retournés": r = $filter('translate')('Admin.Dossiers.State_Rej'); break;
        }
        return r;
    };

    $scope.isEnCours = function(banette) {
        return banette !== "Dossiers en fin de circuit" && banette !== "Dossiers retournés";
    };

    $scope.isUnlockable = function(dossier) {
        var timeout = +$scope.properties["parapheur.ihm.admin.dossier.locked.notify"] || 600;
        /** @namespace dossier.modified */
        return Math.floor((+new Date - dossier.modified) / 1000) > timeout && dossier.locked;
    }
}
DossiersAdminController.$inject = ['$scope', '$filter', 'modals', 'Dossiers', 'ngTableParams', 'usSpinnerService', 'cache']; // For JS compilers

var MoveDossierController = function($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};

;
//Controller for bureau page
function GroupesAdminController($scope, Groupes, utils, modals, usSpinnerService, cache, $filter) {

    $scope.unorderedGroupes = [];
    $scope.saved = false;
    $scope.hasSearchUser = false;
    $scope.groupes = [];
    var baseUsers = [];
    var usersToAdd = [];
    var usersToDelete = [];

    var initGroupes = function() {
        cache.groupes.list().then(function(list) {
            $scope.unorderedGroupes = list;
            angular.forEach($scope.unorderedGroupes, function(value) {
                delete value.child;
                value.selected = undefined;
            });
            $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));
        });
    };

    var groupsShowed = [];

    $scope.$watch("search", function () {
        groupsShowed = [];
    }, true);

    $scope.queryGroups = function(obj) {
        if($scope.search != null) {
            if(~obj.branch["shortName"].toLowerCase().indexOf($scope.search.toLowerCase())) {
                groupsShowed.push(obj.branch["shortName"].toLowerCase());
                return true;
            } else if(obj.branch["parent"] && ~groupsShowed.indexOf(obj.branch["parent"].toLowerCase())) {
                groupsShowed.push(obj.branch["shortName"].toLowerCase());
                return true;
            }
            return false;
        }
        return true;
    };

    initGroupes();

    $scope.selectGroup = function(group) {
        $scope.hasSearchUser = false;
        $scope.saved = false;
        $scope.selectedGroup = new Groupes(angular.copy(group));
        $scope.selectedGroup.$getMembers(function(data) {
            baseUsers = [];
            angular.forEach(data.users, function(value, key) {
                baseUsers.push(value.shortName);
            });
        });
        usersToAdd = [];
        usersToDelete = [];
        $scope.listUsersHandler.getNewList();
    };


    //Suppression du bureau sélectionné
    $scope.deleteGroup = function(group) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Groupes.ModGr_Title') + " " + group.shortName,
            message: $filter('translate')('Admin.Groupes.ModGr_Msg') + " " + group.shortName + " ?\n\n" + $filter('translate')('Admin.Groupes.Gr_Del_Info') + ".",
            ctrl: BaseController
        }, function() {
            $scope.selectedGroup = undefined;
            group.$delete(function() {
                for(var i = 0; i < $scope.unorderedGroupes.length; i++) {
                    if($scope.unorderedGroupes[i].id === group.id) {
                        $scope.unorderedGroupes.splice(i, 1);
                        $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));

                    }
                }
            });
        });
    };

    $scope.userAlreadyInGroup = function(item) {
        var toReturn = true;
        if(!$scope.selectedGroup) return true;
        angular.forEach($scope.selectedGroup.users, function(value, key) {
            if(value.shortName === item.username) {
                toReturn = false;
            }
        });
        return toReturn;
    };

    $scope.addUserToGroup = function(user) {
        if(!~baseUsers.indexOf(user.username)) {
            usersToAdd.push(user.username);
        }
        if(~usersToDelete.indexOf(user.username)) {
            usersToDelete.splice(usersToDelete.indexOf(user.username), 1);
        }
        $scope.selectedGroup.users.push({
            shortName: user.username,
            fullName: user.firstName + " " + user.lastName
        });
        $scope.listUsersHandler.getNewList();
    };

    $scope.removeUserFromGroup = function(index) {
        var user = $scope.selectedGroup.users[index];
        if(!($scope.selectedGroup.shortName === 'ALFRESCO_ADMINISTRATORS' && user.shortName.split('@')[0] ==='admin')) {
            if(~baseUsers.indexOf(user.shortName)) {
                usersToDelete.push(user.shortName);
            }
            if(~usersToAdd.indexOf(user.shortName)) {
                usersToAdd.splice(usersToAdd.indexOf(user.shortName), 1);
            }
            $scope.selectedGroup.users.splice(index, 1);
        }
        $scope.listUsersHandler.getNewList();
    };

    var toUpdate;

    var checkSaved = function(updated) {
        toUpdate += updated ? -1 : 0;
        if(toUpdate === 0) {
            $scope.saved = true;
            $scope.saving = false;
            usSpinnerService.stop("spinnerGroups");
        }
    };

    var updateMembers = function() {
        toUpdate = usersToAdd.length + usersToDelete.length;
        checkSaved(false);
        //Mise à jour des membres
        for(var i = 0; i < usersToAdd.length; i++) {
            $scope.selectedGroup.userToChange = usersToAdd[i];
            $scope.selectedGroup.$addUser(function() {
                checkSaved(true);
            });
        }
        for(var j = 0; j < usersToDelete.length; j++) {
            $scope.selectedGroup.userToChange = usersToDelete[j];
            $scope.selectedGroup.$removeUser(function() {
                checkSaved(true);
            });
        }
        $scope.selectedGroup.userToChange = undefined;
    };

    $scope.saveGroup = function() {
        $scope.saving = true;
        $scope.saved = false;
        usSpinnerService.spin("spinnerGroups");
        if($scope.selectedGroup.isNew) {
            //Création du groupe
            $scope.selectedGroup = new Groupes($scope.selectedGroup);
            $scope.selectedGroup.$save(function() {
                updateMembers();
                $scope.selectedGroup.isNew = false;
                $scope.unorderedGroupes.push($scope.selectedGroup);
                $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));
            });
        } else {
            updateMembers();
        }

    };

    $scope.createGroup = function() {
        $scope.hasSearchUser = false;
        $scope.saved = false;

        baseUsers = [];

        usersToAdd = [];
        usersToDelete = [];

        $scope.saved = false;
        $scope.selectedGroup = {
            shortName: "",
            isNew: true,
            users: []
        };
    };

    var users = [];

    $scope.listUsersHandler = {
        users: [],
        subList : [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.users =  $filter('orderBy')($filter('filter')(users, toSearch), 'lastName');
            this.total = this.users.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.subList = this.users.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize);
        }
    };

    cache.users.list().then(function(list) {
        users = list;
        $scope.listUsersHandler.init();
    });
}
GroupesAdminController.$inject = ['$scope', 'Groupes', 'utils', 'modals', 'usSpinnerService', 'cache', '$filter']; // For JS compilers;
//Controller for informations page
function InformationsAdminController($scope, $rootScope, $interval, $location, $http, $filter, configuration, Office, Tenants, Attestation, Xemelios, $modal) {

    $scope.Math = window.Math;
    $scope.infos = {};
    $scope.reload = {};
    $scope.isTenant = (configuration.tenant !== "") && (($rootScope.isMTEnabled != undefined) && ($rootScope.isMTEnabled == true));

    var initReload = function () {
        $scope.reload = {
            all: false,
            properties: false,
            errorProperties: false,
            xemelios: false,
            office: false,
            errorOffice: false
        };
    };

    var loadInfos = function (success) {
        $http({method: 'GET', url: configuration.context + '/informations'}).
        then(function (data) {
            $scope.infos = data.data;
            buildMemChart(data.data);
            buildDiskChart(data.data);
            checkXemeliosStatus(success);
            $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/utilisateurs/connected'}).
            then(function (data) {
                $scope.infos.users = data.data;
            });
            Office.get(function (result) {
                $scope.infos.office = result;
            });
        });
        Attestation.get(function (result) {
            result.port = +result.port;
            $http({
                method: 'POST',
                url: configuration.context + "/attestStatus",
                data: result
            }).then(function (response) {
                $scope.infos.isASEnabled = response.data.isASEnabled;
            });
        });
    };

    $scope.memChartData = [];
    $scope.diskChartData = [];

    var buildMemChart = function (data) {
        $scope.memChartData.length = 0;
        $scope.memChartData.push({
            y: Math.round(data.freeMem / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Free'),
            percent: Math.round(data.freeMem * 100 / data.maxMem)
        });
        $scope.memChartData.push({
            y: Math.round((data.maxMem - data.freeMem) / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Occ'),
            percent: 100 - Math.round(data.freeMem * 100 / data.maxMem)
        });
    };

    var buildDiskChart = function (data) {
        $scope.diskChartData.length = 0;
        $scope.diskChartData.push({
            y: Math.round(data.usableSpace / 1024 / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Free'),
            percent: Math.round(data.usableSpace * 100 / data.totalSpace)
        });
        $scope.diskChartData.push({
            y: Math.round((data.totalSpace - data.usableSpace) / 1024 / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Occ'),
            percent: 100 - Math.round(data.usableSpace * 100 / data.totalSpace)
        });
    };

    var xemeliosPid = "";
    var checkXemeliosStatus = function (success) {
        Xemelios.get(function (response) {
            angular.extend($scope.infos, response);
            $scope.reload.xemelios = false;
            if (typeof success === 'function') {
                success();
            }
        });
    };

    $scope.reloadProperties = function (success) {
        initReload();
        $http({method: 'GET', url: configuration.context + '/reloadProperties'}).
        then(function (data) {
            $scope.updateProperties(data.data);
            $scope.infos.isPropertiesFound = data.data.found;
            if ($scope.infos.isPropertiesFound) {
                $scope.reload.properties = true;
            } else {
                $scope.reload.errorProperties = true;
            }
            if (typeof success === 'function') {
                success();
            }
        });
    };

    $scope.reloadInfos = function () {
        initReload();
        loadInfos(function () {
            var oldFound = $scope.infos.isPropertiesFound;
            $scope.reloadProperties(function () {
                $scope.reload.all = true;
                $scope.reload.properties = oldFound ? false : $scope.infos.isPropertiesFound;
                $scope.reload.errorProperties = oldFound ? !$scope.infos.isPropertiesFound : false;
            });
        });
    };

    $scope.restartOffice = function () {
        initReload();
        Office.restart(function (data) {
            if (data) {
                $scope.reload.office = true;
            } else {
                $scope.reload.errorOffice = true;
            }
        });
    };

    $scope.restartXemelios = function () {
        $scope.reload.xemelios = true;
        // Reload, and wait for new PID

        Xemelios.status(function (pid) {
            xemeliosPid = pid.status;
            Xemelios.restart(function () {
                var promiseInterval;

                var stopCheck = function () {
                    if (angular.isDefined(promiseInterval)) {
                        $interval.cancel(promiseInterval);
                        promiseInterval = undefined;
                    }
                };

                // Wait for 2 same pid... Because reasons
                var newPid;
                // We reload xemelios... Every 2 seconds, check for new PID !
                promiseInterval = $interval(function () {
                    Xemelios.status(function (response) {
                        if (response.status && response.status !== xemeliosPid) {
                            if (newPid === response.status) {
                                xemeliosPid = newPid;
                                checkXemeliosStatus();
                                stopCheck();
                            } else {
                                newPid = response.status;
                            }
                        }
                    });
                }, 2000);
            });
        });
    };

    $scope.launchHealthStatus = function () {
        $modal.open({
            templateUrl: 'partials/modals/healthModal.html',
            controller: HealthController
        });
    };

    if (!configuration.isAdmin) {
        if (configuration.isAdminCircuits() && !configuration.isAdminFonctionnel()) {
            $location.path("/admin/circuits");
        } else if (configuration.isAdminFonctionnel()) {
            $location.path("/admin/bureaux");
        } else {
            $location.path("/bureaux");
        }
    } else {
        if ($rootScope.isMTEnabled == undefined) {
            Tenants.isEnabled(function (data) {
                // En rootScope, il faut garder l'information pour les autres pages !
                $rootScope.isMTEnabled = data.mtEnabled;
                $scope.isTenant = ($rootScope.isMTEnabled == true) && (configuration.tenant !== "");
            });
        }

        initReload();
        loadInfos();
    }
}
InformationsAdminController.$inject = ['$scope', '$rootScope', '$interval', '$location', '$http', '$filter', 'configuration', 'Office', 'Tenants', 'Attestation', 'Xemelios', '$modal']; // For JS compilers

var HealthController = function ($scope, $modalInstance, $http, configuration, $rootScope) {

    $scope.isTenant = ($rootScope.isMTEnabled == true) && (configuration.tenant !== "");

    var getHealth = function () {
        // For Xemelios, check service AND pid
        $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/exploit/health'}).
        then(function (data) {
            $scope.health = data.data;
        });
    };

    getHealth();

    $scope.reload = {
        launchCount: false
    };

    $scope.messages = {
        regenerate: {
            success : false,
            error : false
        }
    };

    $scope.regenerateCount = function() {
        $scope.reload.launchCount = true;
        $scope.messages.success = false;
        $scope.messages.error = false;
        $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/corbeilles/regenerateCount'}).
        success(function () {
            $scope.reload.launchCount = false;
            $scope.messages.success = true;
        }).error(function(error) {
            console.warn(error);
            $scope.reload.launchCount = false;
            $scope.messages.error = true;
        });
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};;
//Controller for NodeBrowser page
function NodeBrowserAdminController($scope, $http, configuration) {

    $scope.datatree ={};
    $scope.rootPath = ["/company/home"];

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/?children=true&libraryRoot=alfresco://company/home&max=500'
        }
    ).success(function(data) {
        $scope.datatree = data;
        $scope.getNodeProperties(data.parent.nodeRef);
    });

    $scope.getNodeProperties = function(nodeRef) {
        nodeRef = nodeRef.replace("workspace://SpacesStore", "");
        $http(
            {method: 'GET',
                url: configuration.context + '/proxy/alfresco/api/node/workspace/SpacesStore/'+ nodeRef
            }
        ).success(function(datadeux) {
                var xmlDoc;
                if (window.DOMParser)
                {
                    var parser=new DOMParser();
                    xmlDoc=parser.parseFromString(datadeux,"text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async=false;
                    xmlDoc.loadXML(datadeux);
                }
                $scope.objectProps = {};
                for (var node in xmlDoc.getElementsByTagName("properties")) {
                    var propsNodes = xmlDoc.getElementsByTagName("properties")[node].childNodes;
                    for (var n in propsNodes) {
                        if(propsNodes[n].childNodes &&
                            propsNodes[n].childNodes.length) {
                            if(propsNodes[n].childNodes[0].childNodes[0]) {
                                $scope.objectProps[propsNodes[n].getAttribute("displayName")] =
                                    propsNodes[n].childNodes[0].childNodes[0].nodeValue;
                            }
                        }
                    }
                }
            });
    };

    $scope.goToPath = function() {
        var path = $scope.rootPath.join('/');
        $http(
            {method: 'GET',
                url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco'+ path +'?children=true&libraryRoot=alfresco://company/home&max=500'
            }
        ).success(function(data) {
            $scope.datatree = data;
            $scope.getNodeProperties(data.parent.nodeRef);
        });
    };

    $scope.selectNode = function(name) {
        $scope.rootPath.push(name);
        $scope.goToPath();
    };

    $scope.goToPathIndex = function(index) {
        $scope.rootPath.splice(index+1,  $scope.rootPath.length);
        $scope.goToPath();
    }
}
NodeBrowserAdminController.$inject = ['$scope', '$http', 'configuration']; // For JS compilers;
//Controller for bureau page
function ScriptAdminController($scope, $http, configuration) {
    $scope.readOnly = true;
    $scope.runas = "admin";
    $scope.script = "";
    $scope.template = "${mjson}";
    $scope.renderedTemplate = "";
    $scope.printOutput = [];

    $scope.tenantList = [];
    $scope.selectedTenant = null;

    $scope.scriptError = false;

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/?children=false&libraryRoot=alfresco://company/home&max=500'
        }
    ).success(function(data) {
        $scope.spaceNodeRef = data.parent.nodeRef;
    });

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/de/fme/jsconsole/spacesroot'
        }
    ).success(function(data) {
            $scope.tenantList = data;
        });

    $scope.sendScript = function() {
        $scope.scriptError = false;
        $scope.renderedTemplate = "";
        $http.post(configuration.context + '/proxy/alfresco/de/fme/jsconsole/execute', {
            "context": {},
            "script": $scope.script,
            "template": $scope.template,
            "transaction" : !$scope.readOnly,
            "urlargs": "",
            "spaceNodeRef": $scope.selectedTenant ? $scope.selectedTenant.node : $scope.spaceNodeRef,
            "documentNodeRef": "",
            "runas" : $scope.runas + ($scope.selectedTenant ? "@"+$scope.selectedTenant.name : "")
        }).success(function(data) {
            $scope.renderedTemplate = data.renderedTemplate;
            $scope.printOutput = data.printOutput;
        }).error(function(data) {
            $scope.renderedTemplate = data.renderedTemplate;
            $scope.printOutput = data.printOutput;
            $scope.scriptError = true;
        });
    }

}
ScriptAdminController.$inject = ['$scope', '$http', 'configuration']; // For JS compilers;
//Controller for bureau page
function StatsAdminController($scope, Audits, cache, $filter, ngTableParams, $sce) {

    cache.types.list().then(function(list) {
        $scope.types = list;
    });

    $scope.action = {
        dossiersCrees: true,
        dossiersEmis: false,
        dossiersEmisRefuses: false,
        dossiersInstruits: false,
        dossiersRefuses: false,
        dossiersTraites: false,
        tempsTraitement: false
    };
    $scope.data = [];
    $scope.moyennes = [];
    $scope.ecartTypes = [];
    $scope.cumul = 1;
    $scope.datalength = 0;
    $scope.gettingStats = false;

    var fromTime = new Date();
    fromTime.setDate(1);

    $scope.listHandler = {
        bureaux: [],
        subList : [],
        searchResultSubList: [],
        selectedSubList : [],
        selectedBureaux: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, {name:toSearch});
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.searchResultSubList = $filter('notSameId')(this.bureaux.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize),  this.selectedBureaux);
        },
        selectElement: function(b) {
            this.selectedSubList.push(b);
            this.selectedBureaux.push(b.id);
            this.getNewList();
        },
        deselectElement: function(id) {
            var indexInArray = this.selectedBureaux.indexOf(id);
            if(~indexInArray) {
                this.selectedBureaux.splice(indexInArray, 1);
            }
            this.selectedSubList = $.grep(this.selectedSubList, function(a) {
                return a.id != id;
            });
            this.getNewList();
        }
    };

    cache.bureaux.list().then(function(bureaux) {
         $scope.bureaux = bureaux;
         $scope.listHandler.init();
    });

    $scope.opt = {
        verbose : true,
        options : {},
        fromTime : fromTime.getTime(),
        toTime : new Date().getTime()
    };

    var optionToParam = function(bureau) {
        var ret = angular.copy($scope.opt);
        var option = "";
        //if($scope.opt.options.parapheur) {
        //    option += "parapheur;" + $scope.opt.options.parapheur + "/";
        //}

        if (bureau)
            option += "parapheur;" + bureau.id + "/";

        if ($scope.opt.options.type) {
            option += "typeMetier;" + $scope.opt.options.type + "/";
        }
        if ($scope.opt.options.sousType) {
            option += "soustypeMetier;" + $scope.opt.options.sousType + "/";
        }
        ret.options = option;
        ret.cumul = $scope.cumul;
        return ret;
    };

    $scope.toHandle = 0;
    $scope.hasStats = false;

    function getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return new Date(y, 0, d);
    }

    var handleTimeDate = function (label, data, cumul) {
        var dataset = {
            type: "spline",
            axisYType: "secondary",
            name: label,
            showInLegend: true,
            toolTipContent: "<span style='\"'color: {color};'\"'>{x}</span> {label}",
            dataPoints: []
        };

        $scope.datalength = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            var date;
            if (cumul == 4) {
                date = new Date(data.data[i].key + "-01-01");
            } else if (cumul == 3) {
                date = new Date(data.data[i].key + "-01");
            } else if (cumul == 2) {
                var k = data.data[i].key;
                date = getDateOfWeek(k.split("-")[1], k.split("-")[0]);
            } else {
                date = new Date(data.data[i].key);
            }
            dataset.dataPoints[i] = {
                x: date,
                y: +data.data[i].value,
                label: getTime(+data.data[i].value)
            }
        }

        if ($scope.bureaux.cumul) {

            // We try to concatenate data to already set same label

            var alreadyExistingData = false;

            for (i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].name == dataset.name) {

                    for (var j = 0; j < $scope.data[i].dataPoints.length; j++)
                        $scope.data[i].dataPoints[j].y += dataset.dataPoints[j].y;

                    alreadyExistingData = true;
                }
            }

            // If we didn't found any existing data, we just add the new one
            if (!alreadyExistingData)
                $scope.data.push(dataset);

        } else {
            $scope.data.push(dataset);
        }

        $scope.toHandle--;
        $scope.gettingStats = false;
    };

    var handleData = function(label, data, cumul) {
        $scope.moyenne = data.moyenne;
        $scope.ecartType = data.ecartType;

        var dataset = {
            type : "line",
            name : label,
            showInLegend : true,
            dataPoints : []
        };

        $scope.datalength = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            var date;
            if (cumul == 4) {
                date = new Date(data.data[i].key + "-01-01");
            } else if (cumul == 3) {
                date = new Date(data.data[i].key + "-01");
            } else if (cumul == 2) {
                var k = data.data[i].key;
                date = getDateOfWeek(k.split("-")[1], k.split("-")[0]);
            } else {
                date = new Date(data.data[i].key);
            }
            dataset.dataPoints[i] = {
                x : date,
                y : +data.data[i].value
            }
        }

        if ($scope.bureaux.cumul) {

            // We try to concatenate data to already set same label

            var alreadyExistingData = false;

            for (i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].name == dataset.name) {

                    for (var j = 0; j < $scope.data[i].dataPoints.length; j++)
                        $scope.data[i].dataPoints[j].y += dataset.dataPoints[j].y;

                    alreadyExistingData = true;
                }
            }

            // If we didn't found any existing data, we just add the new one
            if (!alreadyExistingData)
                $scope.data.push(dataset);

        } else {
            $scope.data.push(dataset);
        }

        $scope.moyennes.push(data.moyenne || "");
        $scope.ecartTypes.push(data.ecartType || "");
        $scope.toHandle--;
        $scope.gettingStats = false;
    };

    var hasGenerateRejectTable = false;

    $scope.updateChartData = function() {

        $scope.searchReject = false;
        $scope.$broadcast("reinitTab");
        $scope.data = [];
        $scope.moyennes = [];
        $scope.ecartTypes = [];
        $scope.gettingStats = true;
        $scope.savedCumul = $scope.cumul;

        if ($scope.listHandler.selectedSubList.length > 0) {
            for (var i = 0; i < $scope.listHandler.selectedSubList.length; i++)
                updateChartData($scope.listHandler.selectedSubList[i]);
        } else {
            updateChartData(null);
        }

        $scope.hasStats = true;
        hasGenerateRejectTable = false;
    };

    function getTime(timeInSeconds) {
        var result = "";
        var rest = timeInSeconds;
        if (Math.floor(rest / 86400) > 0) {
            result += Math.floor(rest / 86400) + " jours, ";
            rest = rest % 86400;
        }
        if (Math.floor(rest / 3600) > 0) {
            result += Math.floor(rest / 3600) + " heures, ";
            rest = rest % 3600;
        }
        if (Math.floor(rest / 60) > 0) {
            result += Math.floor(rest / 60) + " minutes";
            rest = rest % 60;
        }

        if (rest > 0) {
            if (result !== "") {
                result += " et "
            }
            result += (rest) + " secondes";
        }

        return rest === 0 ? "Aucun traitement" : result;
    }

    var buildTable = function () {
        if (!$scope.tableParams) {
            for (var i = 0; i < $scope.rejetDetail.length; i++) {
                $scope.rejetDetail[i].cause = $sce.trustAsHtml($scope.rejetDetail[i].cause.replace(/\n/g, '<br/>'));
            }
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.rejetDetail, params.orderBy()) :
                        $scope.rejetDetail;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
        $scope.flags.isSearching = false;
    };

    $scope.generateRejectTable = function () {
        if (!hasGenerateRejectTable) {
            if ($scope.listHandler.selectedSubList.length > 0) {
                for (var i = 0; i < $scope.listHandler.selectedSubList.length; i++)
                    generateRejectTable($scope.listHandler.selectedSubList[i]);
            } else {
                generateRejectTable(null);
            }
            hasGenerateRejectTable = true;
        }
    };

    var generateRejectTable = function (bureau) {
        Audits.causesRejet(optionToParam(bureau), function (result) {
            $scope.searchReject = result.length > 0;
            $scope.rejetDetail = result;
            buildTable();
        });
    };

    var updateChartData = function(bureau) {
        var bureauLabel = "";
        if (bureau != null)
            bureauLabel = " (" + bureau.name + ")";

        if ($scope.action.dossiersCrees) {
            $scope.toHandle++;
            Audits.crees(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Created') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersEmis) {
            $scope.toHandle++;
            Audits.emis(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Emited') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersEmisRefuses) {
            $scope.toHandle++;
            Audits.emisRefuses(optionToParam(bureau), function (result) {
                var label = $filter('translate')('Admin.Stats.EmitedRejected') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersInstruits) {
            $scope.toHandle++;
            Audits.instruits(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Instructed') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersRefuses) {
            $scope.toHandle++;
            Audits.refuses(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Rejected') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
                $scope.generateRejectTable();
            });
        }
        if ($scope.action.dossiersTraites) {
            $scope.toHandle++;
            Audits.traites(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Handled') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }

        if ($scope.action.tempsTraitement) {
            $scope.toHandle++;
            Audits.tempsTraitement(optionToParam(bureau), function (result) {
                var label = $filter('translate')('Admin.Stats.Time') + " (en secondes) " + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleTimeDate(label, result, $scope.savedCumul);
            });
        }
    };

    //$scope.logDataPoints = function(datapoints) {
    //    var result = "[";
    //
    //    for(var i = 0; i < datapoints.length; i++) {
    //        result += datapoints[i].x + "." + datapoints[i].y;
    //
    //        if(i != datapoints.length)
    //            result += " - ";
    //    }
    //
    //    result += "] (" + datapoints.length + ")";
    //    console.log("                 >" + result);
    //};

    $scope.exportToCSV = function() {
        var toExport = [];
        for (var i = 0; i < $scope.data.length; i++) {
            var name = $scope.data[i].name;
            for (var j = 0; j < $scope.data[i].dataPoints.length; j++) {

                var point = $scope.data[i].dataPoints[j];
                if (!toExport[j]) {
                    var d = new Date(point.x);
                    toExport[j] = {
                        date : d.getFullYear() + "-" + (+d.getMonth() + 1) + "-" + d.getDate()
                    };
                }
                toExport[j][name] = point.y;
            }
        }
        var csvContent = "";
        var hasAddHeader = false;
        for (var k = 0; k < toExport.length; k++) {
            if (!hasAddHeader) {
                var isFirst = true;
                for (var el in toExport[k]) {
                    if (!isFirst) {
                        csvContent += ";";
                    }
                    isFirst = false;
                    csvContent += el;
                }
                csvContent += "\n";
                hasAddHeader = true;
            }
            var isFirstElement = true;
            for (var elem in toExport[k]) {
                if (!isFirstElement) {
                    csvContent += ";";
                }
                isFirstElement = false;
                //noinspection JSUnfilteredForInLoop
                csvContent += toExport[k][elem];
            }
            csvContent += "\n";
        }
        if ($scope.moyennes.length > 0 && $scope.ecartTypes.length > 0) {
            csvContent += "\n";
            csvContent += "moyenne;";
            for (var m = 0; m < $scope.moyennes.length; m++) {
                csvContent += $scope.moyennes[m] + ";";
            }
            csvContent += "\n";
            csvContent += "ecart Type;";
            for (var e = 0; e < $scope.ecartTypes.length; e++) {
                csvContent += $scope.ecartTypes[e] + ";";
            }
        }
        var blob = new Blob( ["\ufeff", csvContent ], { type: "text/csv" } );
        if ( window.navigator.msSaveOrOpenBlob && window.Blob ) {
            navigator.msSaveOrOpenBlob( blob, "statistiques.csv" );
        } else {
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'statistiques.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

}
StatsAdminController.$inject = ['$scope', 'Audits', 'cache', '$filter', 'ngTableParams', '$sce']; // For JS compilers;
//Controller for Tenant page
function TenantAdminController($scope, $log, Tenants, modals) {
    /**
     * Gestion de password
     */
    $scope.password= {
        newOne:"",
        confirm:""
    };

    /**
     * Objet de gestion du controlleur
     */
    $scope.tenant = {
        // Le mode MT est-il activé ?
        isEnabled: false,
        // Est-on en train de récupérer des informations d'un tenant ?
        isGettingInfos: undefined,
        // Essaye-t-on de sélectionner un tenant désactivé ?
        cantSelect: false,
        // Tenant en cours de création
        isCreating: false,
        // Liste des tenants
        list: [],
        // Tenant sélectionné
        selected: undefined,
        // Tenant modifié
        edited: undefined,
        // Champ de recherche
        search:"",
        /**
         * Fonction d'initialisation
         * Si le mode MT est activé, on récupère la liste des tenants
         */
        init: function() {
            var that = this;
            Tenants.isEnabled(function(result) {
                /** @namespace result.mtEnabled */
                that.isEnabled = result.mtEnabled;
                if(that.isEnabled) {
                    that.getList();
                }
            }, function(error) {
                // Erreur lors de la récupération de l'information
                $log.error(error);
            });
        },
        /**
         * Récupération de la liste des tenants
         */
        getList: function() {
            this.list = Tenants.list();
        },
        /**
         * Sélection d'un tenant
         * @param coll Tenant à sélectionner
         */
        select: function(coll) {
            if(!this.isCreating) {
                // Sélection seulement si le tenant est activé et pas en cours de modification
                if(coll.enabled && !coll.modify) {
                    var that = this;
                    this.cantSelect = false;
                    this.selected = coll;
                    // Si la description n'est pas dans les informations connues, cela veut dire que l'on ne connait pas tout du tenant !
                    if(this.selected.description === undefined) {
                        this.selected.$get(function() {
                            that.edited = angular.copy(coll);
                        }, function() {
                            that.edited = angular.copy(coll);
                            $log.error("Impossible de récupérer les informations du tenant");
                        });
                    } else {
                        this.edited = angular.copy(coll);
                    }
                } else {
                    // Si on ne peut pas sélectionner le tenant, on déselectionne ce qu'on avait, et on
                    this.selected = undefined;
                    this.edited = undefined;
                    this.cantSelect = true;
                }
            }
        },
        /**
         * Création d'un nouveau tenant
         */
        create: function() {
            if(this.isEnabled) {
                this.selected = new Tenants({
                    title:"",
                    tenantDomain:"",
                    siren:"",
                    city:"",
                    country:"",
                    postalCode:"",
                    enabled:true,
                    isNew: true
                });
                this.edited = angular.copy(this.selected);
            }
        },
        /**
         * Récupération des informations supplémentaires d'un tenant
         */
        infos: function() {
            var that = this;
            this.isGettingInfos = this.selected.tenantDomain;
            // On garde le tenant sélectionné, car en cas de sélection d'un autre tenant "selected" serait changé
            var tmp = this.selected;
            this.selected.$details(function() {
                that.isGettingInfos = undefined;
                tmp.hasDetails = true;
            }, function() {
                that.isGettingInfos = undefined;
                $log.error("Impossible de récupérer les détails du tenant");
            });
        },
        /**
         * Sauvegarde des modifications apportées sur un tenant
         */
        save: function() {
            var that = this;
            // Si c'est un nouveau tenant, on prend en compte le password et on l'ajoute à la liste
            if(this.selected.isNew) {
                //Create
                // Lowercase, on enlève les majuscules
                this.edited.tenantDomain = this.edited.tenantDomain.toLowerCase();
                if(this.exist(this.edited.tenantDomain)) {
                    this.selected.exist = true;
                } else {
                    this.isCreating = true;
                    this.selected.exist = false;
                    angular.extend(this.selected, this.edited);
                    this.selected.modify = true;
                    this.selected.password = $scope.password.confirm;
                    this.selected.$save(function() {
                        that.isCreating = false;
                        that.selected.isNew = false;
                        that.selected.modify = false;
                        that.list.push(that.selected);
                    });
                }
            // Si c'est une mise à jour, on répercute les changements sur le tenant sélectionné
            } else {
                //Update
                angular.extend(this.selected, this.edited);
                this.selected.modify = true;
                this.selected.$update(function() {
                    that.selected.modify = false;
                });
            }
        },
        exist: function(tenantDomain) {
            for(var i = 0; i < this.list.length; i++) {
                if(this.list[i].tenantDomain === tenantDomain) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Changement de l'état d'une collectivité
         * @param coll Collectivité à modifier
         */
        switchState: function(coll) {
            if(!this.isCreating) {
                this.selected = undefined;
                this.edited = undefined;
                coll.modify = true;
                coll.enabled = !coll.enabled;
                coll.$enable(function() {
                    coll.modify = false;
                });
            }
        },
        /**
         * Rechargement des modèles de mail
         */
        reloadMail: function(coll) {
            if(!this.isCreating) {
                coll.reloadMail = true;
                coll.$reloadMail(function() {
                    coll.reloadMail = false;
                });
            }
        },
        /**
         * Changement du mot de passe administrateur d'un tenant
         */
        changeAdminPassword: function() {
            var that = this;
            // Lancement d'une fenêtre modale permettant la mise à jour du password
            modals.launch("base", {
                title: "Modifier le mot de passe",
                message: "Vous pouvez redéfinir le mot de passe de l'administrateur de la collectivité " + that.selected.title,
                ctrl: AskPasswordController,
                template: 'partials/modals/askPasswordModal.html'
            }, function(result) {
                that.selected.password = result;
                that.selected.modify = true;
                that.selected.$changePassword(function() {
                    that.selected.modify = false;
                });
            });
        },
        /**
         * Changement des propriétés PES du tenant
         */
        changePESProperties: function() {
            var that = this;
            // Lancement d'une fenêtre modale permettant la mise à jour du password
            modals.launch("base", {
                title: "Modifier les paramètres PES",
                message: "Vous pouvez redéfinir les paramètres PES de la collectivité " + that.selected.title,
                ctrl: SetPESProperties,
                template: 'partials/modals/pesPropertiesTenant.html',
                object: that.selected
            }, function(result) {
                angular.extend(that.selected, result);
                that.selected.$updatePesProperties();
            });

        }
    };

    // Initialisation de l'objet tenant
    $scope.tenant.init();
}
TenantAdminController.$inject = ['$scope', '$log', 'Tenants', 'modals']; // For JS compilers

//Controller for Tenant page
function SetPESProperties($scope, $modalInstance,  title, message, object) {
    $scope.title = title;
    $scope.message = message;

    $scope.properties = {};

    if(!object.policyIdentifierID) {
        object.$getPesProperties(function() {
            $scope.properties = angular.copy(object);
        });
    } else {
        $scope.properties = angular.copy(object);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.properties);
    };
};
//Controller for bureau page
function TypologieAdminController($scope, $cacheFactory, Types, SousTypes, Circuits, modals, $filter, cache, usSpinnerService, Cachets, PastellConnector, Dossiers) {

    var reinitTab = function () {
        $scope.$broadcast("reinitTab");
    };

    $scope.tdtNomOptions = [
        {value: "S²LOW", key: "S²LOW"},
        {value: "SRCI", key: "SRCI"},
        {value: "FAST", key: "FAST"}
    ];
    $scope.tdtProtocoleOptions = [
        {value: "ACTES", key: "ACTES"},
        {value: "HELIOS", key: "HELIOS"}
    ];
    $scope.boolvalues = [
        {key: 'Oui', value: 'true'},
        {key: 'Non', value: 'false'}
    ];

    $scope.cachetCerts = Cachets.list();
    $scope.pastellMailsec = PastellConnector.list();
    $scope.isMetaInited = false;

    //For subtype administration
    var types = [];
    var bureaux = [];
    var metadonnees = [];
    var groupes = [];
    var calques = [];

    //Dans le cas d'une propagation d'événements
    var cancelSelectType = false;

    //Handler général du controlleur
    $scope.handler = {
        /**
         * Fonction d'initialisation du controlleur
         */
        init: function () {
            //Initialisation de la liste des types
            var that = this;
            cache.types.list().then(function (typelist) {
                types = typelist;
                //Déselection du précédent type/sous-type sélectionné
                for (var i = 0; i < types.length; i++) {
                    // Tri des sous-types
                    types[i].sousTypes = $filter('orderBy')(types[i].sousTypes, 'id');

                    types[i].selected = false;
                    for (var j = 0; j < types[i].sousTypes.length; j++) {
                        types[i].sousTypes[j].selected = false;
                    }
                }
                that.types.search("");
            });
            //Initialisation de la liste des bureaux
            cache.bureaux.list().then(function (bureauxList) {
                bureaux = bureauxList;
                that.bureaux.search("");
            });
            //Initialisation de la liste des métadonnées
            cache.metadonnees.list(true).then(function (metaList) {
                metadonnees = metaList;
                $scope.isMetaInited = true;
            });

            //Initialisation de la liste des groupes
            cache.groupes.list().then(function (groupsList) {
                groupes = groupsList;
                that.groupes.search("");
            });

            //Initialisation de la liste des claques
            cache.calques.list().then(function (calquesList) {
                calques = calquesList;
                that.calques.search("");
            });
        },
        //Handler pour les types
        types: {
            //Type sélectionné
            selected: {},
            //Type en cours d'édition
            edited: {},
            //Sous-type sélectionné
            selectedSubtype: undefined,
            //Sous-type en cours d'édition
            editedSubtype: undefined,
            //Message d'erreur lié aux types
            errorType: undefined,
            //Message d'erreur lié aux sous-types
            errorSubtype: undefined,
            //Liste des types
            list: [],
            //Liste réduite des types
            subList: [],
            //Page actuelle pour l'affichage
            page: 0,
            //Nombre d'éléments par page (fixe pour le moment)
            maxSize: 10,
            //Nombre total d'éléments
            total: 0,
            //Champ de recherche
            searchValue: "",
            //Sauvegarde en cours type et sous-type
            saving: false,

            /**
             * Vérification de présence d'action de cachet serveur
             */
            hasCachet: function () {
                var hasCachetInCircuit = !this.editedSubtype.circuit;
                if ($scope.handler.circuits.selected && $scope.handler.circuits.selected.etapes) {
                    for (var i = 0; i < $scope.handler.circuits.selected.etapes.length; i++) {
                        if ($scope.handler.circuits.selected.etapes[i].actionDemandee === "CACHET") {
                            hasCachetInCircuit = true;
                            break;
                        }
                    }
                }
                return hasCachetInCircuit;
            },

            /**
             * Vérification de présence d'action de mailsec Pastell
             */
            hasPastellMailsec: function () {
                var hasMailsecPastellInCircuit = !this.editedSubtype.circuit;
                if ($scope.handler.circuits.selected && $scope.handler.circuits.selected.etapes) {
                    for (var i = 0; i < $scope.handler.circuits.selected.etapes.length; i++) {
                        if ($scope.handler.circuits.selected.etapes[i].actionDemandee === "MAILSECPASTELL") {
                            hasMailsecPastellInCircuit = true;
                            break;
                        }
                    }
                }
                return hasMailsecPastellInCircuit;
            },

            /**
             * Vérification de présence de certificat sélectionné
             */
            hasCachetSelected: function () {
                var hasCircuitSelected = !!this.editedSubtype.circuit;
                var hasCachetResult = this.hasCachet();
                var hasCachetInSelect = !!this.editedSubtype.cachetCertificate;

                return hasCircuitSelected && hasCachetResult ? hasCachetInSelect && this.canCachet() : true;
                //return (hasCachetResult || hasCachetInSelect) && !hasCachetInSelect;
            },

            /**
             *
             */
            canCachet: function () {
                var sigFormat = this.getSignatureFormat();
                return sigFormat === 'PAdES/basic' || sigFormat === 'PAdES/basicCertifie';
            },

            /**
             * Création d'un type sur l'interface
             */
            create: function () {
                this.selected ? this.selected.selected = false : null;
                this.selectedSubtype ? this.selectedSubtype.selected = false : null;
                var type = {
                    isNew: true,
                    tdtOverride: "false",
                    sousTypes: [],
                    tdtNom: "pas de TdT",
                    tdtProtocole: "aucun"
                };
                this.selected = type;
                this.edited = new Types(type);
                this.selectedSubtype = undefined;
            },

            /**
             * Création d'un sous-type pour un type donné
             */
            createSub: function (type) {

                reinitTab();
                cancelSelectType = true;
                this.selected ? this.selected.selected = false : null;
                this.selectedSubtype ? this.selectedSubtype.selected = false : null;
                var sousType = {
                    isNew: true,
                    parent: type.id,
                    parapheurs: [],
                    parapheursFilters: [],
                    groupsFilters: [],
                    groups: [],
                    calques: [],
                    calquesAnnexes: [],
                    metadatas: [],
                    visibility: "public",
                    visibilityFilter: "public",
                    digitalSignatureMandatory: "true"
                };
                this.selectedSubtype = sousType;
                this.editedSubtype = new SousTypes(sousType);
                this.selected = undefined;
                type.selected = false;
                //initResources();
            },

            /**
             * Sauvegarde d'un type
             */
            save: function () {
                this.errorType = undefined;

                // Checks if a type with the same name already exists

                if (this.isTypeAlreadyExists(this.edited.id)) {
                    this.errorType = $filter('translate')('Admin.Typologie.Error_type_name_already_exists');
                    return;
                }

                // Send request

                var that = this;
                this.saving = true;

                //We have to check for double spaces !
                this.edited.id = this.edited.id.replace(/  +/g, ' ');

                this.edited.$save(function () {
                    that.saving = false;
                    that.edited.isNew = false;
                    that.edited.selected = false;
                    that.selected = that.edited;
                    types[types.length] = that.edited;
                    that.selected = undefined;
                    that.updateSublist();
                }, function (error) {
                    that.saving = false;
                    that.errorType = error.data.message;
                })
            },

            /**
             * Sauvegarde d'un sous-type
             */
            saveSub: function () {

                // Checks if a SubType with the same name already exists

                if (this.isSubTypeTypeAlreadyExists(this.editedSubtype.parent, this.editedSubtype.id)) {
                    this.errorSubtype = $filter('translate')('Admin.Typologie.Error_type_name_already_exists');
                    return;
                }

                // Sending request

                var that = this;
                this.errorSubtype = undefined;
                this.saving = true;
                this.editedSubtype.id = this.editedSubtype.id.replace(/  +/g, ' ');
                this.editedSubtype.$save(function () {
                    that.saving = false;
                    that.editedSubtype.isNew = false;
                    that.selectedSubtype = that.editedSubtype;
                    for (var i = 0; i < types.length; i++) {
                        if (types[i].id === that.editedSubtype.parent) {
                            types[i].sousTypes[types[i].sousTypes.length] = that.editedSubtype;
                        }
                    }
                    that.updateSublist();
                    that.selectedSubtype = undefined;
                }, function (error) {
                    that.saving = false;
                    that.errorSubtype = error.data.message;
                });
            },

            /**
             * Mise à jour d'un type
             */
            update: function () {

                this.errorType = undefined;
                this.edited.oldId = this.selected.id;
                this.edited.id = this.edited.id.replace(/  +/g, ' ');

                // If the name has changed, we don't want an existing new one

                if (this.edited.oldId !== this.edited.id) {
                    if (this.isTypeAlreadyExists(this.edited.id)) {
                        this.errorType = $filter('translate')('Admin.Typologie.Error_type_name_already_exists');
                        return;
                    }
                }

                // Save with Resource object due to possibility to change ID

                var that = this;
                this.saving = true;
                this.edited.$update(function (data) {
                    that.saving = false;
                    var oldId = that.selected.id;
                    angular.forEach(types, function (value, key) {
                        if (value.id === oldId) {
                            if (oldId != data.id) {
                                for (var i = 0; i < data.sousTypes.length; i++) {
                                    data.sousTypes[i].parent = data.id;
                                }
                            }
                            types[key] = data;
                        }
                    });
                    that.updateSublist();
                    data.selected = false;
                    that.selected = undefined;
                }, function (error) {
                    that.saving = false;
                    that.errorType = error.data.message;
                });
            },

            /**
             * Mise à jour d'un sous-type
             */
            updateSub: function () {

                this.errorSubtype = undefined;
                this.editedSubtype.oldId = this.selectedSubtype.id;
                this.editedSubtype.id = this.editedSubtype.id.replace(/  +/g, ' ');
                // If the name has changed, we don't want an existing new one.

                if (this.editedSubtype.oldId !== this.editedSubtype.id) {
                    if (this.isSubTypeTypeAlreadyExists(this.editedSubtype.parent, this.editedSubtype.id)) {
                        this.errorSubtype = $filter('translate')('Admin.Typologie.Error_subtype_name_already_exists');
                        return;
                    }
                }

                // Sending request

                if (!this.editedSubtype.circuit) {
                    this.editedSubtype.circuit = "";
                }

                var that = this;
                that.saving = true;
                this.editedSubtype.$update(function () {
                    that.saving = false;
                    that.selectedSubtype.id = that.editedSubtype.id;
                    that.selectedSubtype.selected = false;
                    that.updateSublist();
                    that.selectedSubtype = undefined;
                }, function (error) {
                    that.saving = false;
                    //Error Handle
                    that.errorSubtype = error.data.message;
                });
            },

            /**
             * Sélection d'un type
             * @param type Type à sélectionner
             */
            select: function (type) {

                this.errorSubtype = undefined;
                this.errorType = undefined;

                if (!type.isDeleted && !cancelSelectType) {
                    if (type.parent !== undefined) {
                        reinitTab();
                        this.selected = undefined;
                        this.edited = undefined;
                        this.selectedSubtype = type;
                        this.editedSubtype = SousTypes.get(type, function () {
                            //initResources();
                            $scope.handler.bureaux.getNewList();
                            $scope.handler.circuits.init();
                        });
                    } else {
                        this.selected = type;
                        this.edited = new Types(type);
                        this.selectedSubtype = undefined;
                    }
                }

                cancelSelectType = false;
            },

            /**
             * Suppression d'un type ou d'un sous-type
             */
            remove: function (type) {
                var that = this;

                modals.launch("base", {
                    title: $filter('translate')(type.parent ? 'Admin.Typologie.Ty_Sub_Mod_Delete' :'Admin.Typologie.Ty_Mod_Delete') + " " + type.id,
                    message: $filter('translate')('Admin.Typologie.Ty_Mod_Confirm'),
                    template: 'partials/modals/simpleConfirmationModal.html',
                    ctrl: RemoveTypeController,
                    object: type
                }, function () {
                    type.isDeleted = true;
                    if (type.parent !== undefined) {
                        that.selectedSubtype = undefined;
                        that.editedSubtype = undefined;
                        type = new SousTypes(type);
                    }
                    that.selected = undefined;
                    that.edited = undefined;
                    type.$delete();
                    //delete type in view;
                    var hasParent = type.parent !== undefined;
                    for (var i = 0; i < types.length; i++) {
                        if (hasParent) {
                            if (type.parent === types[i].id) {
                                for (var j = 0; j < types[i].sousTypes.length; j++) {
                                    if (type.id === types[i].sousTypes[j].id) {
                                        types[i].sousTypes.splice(j, 1);
                                    }
                                }
                            }
                        } else {
                            if (type.id === types[i].id) {
                                types.splice(i, 1);
                            }
                        }
                    }
                    that.updateSublist();
                });
            },

            /**
             * Lancement de la modale pour TDT
             */
            launchOverride: function () {
                modals.launch("OverrideS2low", this.edited);
            },

            /**
             * Doit-on afficher le bouton d'override ?
             */
            showOverrideButton: function () {
                return this.edited.sigFormat && ((this.edited.sigFormat === "XAdES/enveloped" && this.edited.tdtNom !== "SRCI" && this.edited.tdtNom !== "FAST")
                    || ~this.edited.sigFormat.indexOf("PAdES")
                    || (this.edited.tdtNom === "S²LOW" && this.edited.tdtProtocole !== "aucun"))
                    || ~this.edited.sigFormat.indexOf("AUTO");
            },

            /**
             * Doit-on afficher les radio de surcharge ?
             */
            showOverrideRadio: function () {
                return this.edited.tdtNom === "S²LOW" && this.edited.tdtProtocole !== "aucun";
            },

            /**
             * Nom du bouton d'override
             */
            getOverrideButtonName: function () {
                if (~this.edited.sigFormat.indexOf("AUTO")) {
                    return $filter('translate')('Admin.Typologie.Ty_Profil');
                } else if (~this.edited.sigFormat.indexOf("PAdES") && !(this.edited.tdtProtocole === "ACTES" && this.edited.tdtNom === "S²LOW")) {
                    return $filter('translate')('Admin.Typologie.Ty_Profil') + " PAdES";
                } else if (this.edited.sigFormat === "XAdES/enveloped" && !(this.edited.tdtProtocole === "HELIOS" && this.edited.tdtNom === "S²LOW")) {
                    return $filter('translate')('Admin.Typologie.Ty_Profil') + " XAdES";
                } else {
                    return $filter('translate')('Admin.Typologie.Ty_Connector') + " S²LOW";
                }
            },

            getOverrideButtonIcon: function () {
                if (~this.edited.sigFormat.indexOf("PAdES") && !(this.edited.tdtProtocole === "ACTES" && this.edited.tdtNom === "S²LOW")) {
                    return "ls-signature";
                } else if (this.edited.sigFormat === "XAdES/enveloped" && !(this.edited.tdtProtocole === "HELIOS" && this.edited.tdtNom === "S²LOW")) {
                    return "ls-signature";
                } else {
                    return "fa-plug";
                }
            },

            /**
             * Changement du protocole TDT sur le type actuel
             */
            changeProtocol: function () {
                $scope.dashChanged = true;
                this.edited.sigFormat = this.edited.tdtProtocole === "ACTES" ? "PKCS#7/single" : "XAdES/enveloped";
            },

            /**
             * Récupération du protocole du type parent du sous-type sélectionné
             * @returns le protocole
             */
            getProtocol: function () {
                var tdtProtocole;
                for (var i = 0; i < types.length; i++) {
                    if (types[i].id === this.selectedSubtype.parent) {
                        tdtProtocole = types[i].tdtProtocole;
                        break;
                    }
                }
                return tdtProtocole;
            },

            /**
             * Récupération du protocole du type parent du sous-type sélectionné
             * @returns le protocole
             */
            getSignatureFormat: function () {
                var sigFormat;
                for (var i = 0; i < types.length; i++) {
                    if (types[i].id === this.selectedSubtype.parent) {
                        sigFormat = types[i].sigFormat;
                        break;
                    }
                }
                return sigFormat;
            },

            /**
             * Ajout d'une métadonnée sur le sous-type sélectionné
             * @param meta Métadonnée à ajouter
             */
            addMetadata: function (meta, fromCircuit) {
                this.editedSubtype.metadatas[this.editedSubtype.metadatas.length] = {
                    id: meta.id,
                    editable: "false",
                    mandatory: "false",
                    'default': "",
                    fromCircuit: fromCircuit
                }
            },

            /**
             * Ajout d'un calque sur le sous-type sélectionné
             * @param calque Calque à ajouter
             */
            addCalque: function (calque) {
                this.editedSubtype.calques[this.editedSubtype.calques.length] = {
                    id: calque.id,
                    numDocument: "0"
                };
            },

            /**
             * Ajout d'un calque pour annexes sur le sous-type sélectionné
             * @param calque Calque à ajouter
             */
            addCalqueAnnexe: function (calque) {
                this.editedSubtype.calquesAnnexes[this.editedSubtype.calquesAnnexes.length] = calque.id;
            },

            /**
             * Recherche d'un type par nom
             */
            search: function () {
                this.page = 0;
                this.updateSublist();
            },

            /**
             * Mise à jour de la sous-liste (permettant la recherche)
             */
            updateSublist: function () {
                //Filtrage sur la recherche
                this.subList = $filter('filter')(types, this.searchValue);
                //Calcul sur le total
                this.total = this.subList.length;
                //Pagination
                this.subList = this.subList.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
            },

            /**
             * Gestion de la pagination de la liste des types
             * @param toAddToPage Page suivante (+1) ou précédente (-1)
             */
            pagine: function (toAddToPage) {
                this.page += toAddToPage;
                this.updateSublist();
            },

            /**
             * Returns if given name is already in the local list.
             * @param typeName
             */
            isTypeAlreadyExists: function (typeName) {

                if (!this.subList) {
                    return false;
                }

                var alreadyExists = false;

                for (var i = 0; i < this.subList.length; i++) {
                    if (this.subList[i].id.toUpperCase() === typeName.toUpperCase()) {
                        alreadyExists = true;
                        break;
                    }
                }

                return alreadyExists;
            },

            /**
             * Returns if given name is already in the local type's subtype list.
             * @param typeName
             * @param subTypeName
             */
            isSubTypeTypeAlreadyExists: function (typeName, subTypeName) {

                if (!this.subList) {
                    return false;
                }

                var alreadyExists = false;

                for (var i = 0; i < this.subList.length; i++) {
                    if (this.subList[i].id.toUpperCase() === typeName.toUpperCase()) {

                        for (var j = 0; j < this.subList[i].sousTypes.length; j++) {
                            if (this.subList[i].sousTypes[j].id.toUpperCase() === subTypeName.toUpperCase()) {
                                alreadyExists = true;
                            }
                        }

                        break;
                    }
                }

                return alreadyExists;
            }
        },
        //Handler pour les bureaux
        bureaux: {
            //Liste des bureaux
            list: function () {
                return bureaux;
            },
            //Liste réduite des bureaux
            subList: [],
            //Liste réduite pour permissions de création
            subListForCreation: [],
            //Liste réduite pour permissions de filtrage
            subListForFilter: [],
            //Page actuelle pour l'affichage
            page: 0,
            //Nombre d'éléments par page (fixe pour le moment)
            maxSize: 10,
            //Nombre total d'éléments
            total: 0,
            //Valeur de recherche de bureaux
            searchValue: "",
            /**
             * Recherche de bureau par nom
             */
            search: function () {
                this.page = 0;
                this.updateSublist();
            },
            /**
             * Mise à jour de la sous-liste (permettant la recherche)
             */
            updateSublist: function () {
                //Filtrage sur la recherche
                this.subList = $filter('customfilter')(bureaux, this.searchValue);
                //Calcul sur le total
                this.total = this.subList.length;
                //Pagination
                this.subList = this.subList.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
                this.getNewList();
            },
            /**
             * Gestion de la pagination de la liste des bureaux
             * @param toAddToPage Page suivante (+1) ou précédente (-1)
             */
            pagine: function (toAddToPage) {
                this.page += toAddToPage;
                this.updateSublist();
            },
            selectForCreation: function (b) {
                $scope.handler.types.editedSubtype.parapheurs.push(b.id);
                this.getNewList();
            },
            unselectForCreation: function (id) {
                var indexInArray = $scope.handler.types.editedSubtype.parapheurs.indexOf(id);
                if (~indexInArray) {
                    $scope.handler.types.editedSubtype.parapheurs.splice(indexInArray, 1);
                }
                this.getNewList();
            },
            selectForFilter: function (b) {
                $scope.handler.types.editedSubtype.parapheursFilters.push(b.id);
                this.getNewList();
            },
            unselectForFilter: function (id) {
                var indexInArray = $scope.handler.types.editedSubtype.parapheursFilters.indexOf(id);
                if (~indexInArray) {
                    $scope.handler.types.editedSubtype.parapheursFilters.splice(indexInArray, 1);
                }
                this.getNewList();
            },
            getNewList: function () {
                this.subListForCreation = $filter('notSameId')(this.subList, $scope.handler.types.editedSubtype ? $scope.handler.types.editedSubtype.parapheurs : []);
                this.subListForFilter = $filter('notSameId')(this.subList, $scope.handler.types.editedSubtype ? $scope.handler.types.editedSubtype.parapheursFilters : []);
            }
        },
        //Handler pour les groupes
        groupes: {
            //Liste des groupes
            list: function () {
                return groupes;
            },
            //Liste réduite des groupes
            subList: [],
            //Liste réduite pour permissions de création
            subListForCreation: [],
            //Liste réduite pour permissions de filtrage
            subListForFilter: [],
            //Page actuelle pour l'affichage
            page: 0,
            //Nombre d'éléments par page (fixe pour le moment)
            maxSize: 10,
            //Nombre total d'éléments
            total: 0,
            //Valeur de recherche de groupes
            searchValue: "",
            /**
             * Recherche de groupe par nom
             */
            search: function () {
                this.page = 0;
                this.updateSublist();
            },
            /**
             * Mise à jour de la sous-liste (permettant la recherche)
             */
            updateSublist: function () {
                //Filtrage sur la recherche
                this.subList = $filter('customfilter')(groupes, this.searchValue);
                //Calcul sur le total
                this.total = this.subList.length;
                //Pagination
                this.subList = this.subList.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
                this.getNewList();
            },
            /**
             * Gestion de la pagination de la liste des groupes
             * @param toAddToPage Page suivante (+1) ou précédente (-1)
             */
            pagine: function (toAddToPage) {
                this.page += toAddToPage;
                this.updateSublist();
            },
            selectForCreation: function (b) {
                $scope.handler.types.editedSubtype.groups.push(b.id);
                this.getNewList();
            },
            unselectForCreation: function (id) {
                var indexInArray = $scope.handler.types.editedSubtype.groups.indexOf(id);
                if (~indexInArray) {
                    $scope.handler.types.editedSubtype.groups.splice(indexInArray, 1);
                }
                this.getNewList();
            },
            selectForFilter: function (b) {
                $scope.handler.types.editedSubtype.groupsFilters.push(b.id);
                this.getNewList();
            },
            unselectForFilter: function (id) {
                var indexInArray = $scope.handler.types.editedSubtype.groupsFilters.indexOf(id);
                if (~indexInArray) {
                    $scope.handler.types.editedSubtype.groupsFilters.splice(indexInArray, 1);
                }
                this.getNewList();
            },
            getNewList: function () {
                this.subListForCreation = $filter('notSameId')(this.subList, $scope.handler.types.editedSubtype ? $scope.handler.types.editedSubtype.groups : []);
                this.subListForFilter = $filter('notSameId')(this.subList, $scope.handler.types.editedSubtype ? $scope.handler.types.editedSubtype.groupsFilters : []);
            }
        },
        //Handler pour les circuits
        circuits: {
            list: [],
            pagedList: [],
            page: 0,
            total: 0,
            maxSize: 10,
            currentSearch: "",
            selected: {},
            hasVariableStep: false,
            init: function () {
                var that = this;
                Circuits.list({
                    search: $scope.handler.types.editedSubtype.circuit,
                    maxSize: 10,
                    page: 0
                }, function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].name === $scope.handler.types.editedSubtype.circuit) {
                            that.isCircuitVariable(result[i]);
                            that.selected = result[i];
                            that.select(that.selected);
                            break;
                        }
                    }
                });
                if (!this.pagedList.length) {
                    this.search();
                }
            },
            search: function (toSearch) {
                var that = this;
                this.pagedList = [];
                this.currentSearch = toSearch;
                this.page = 0;
                Circuits.list({
                    search: "*" + (toSearch || "") + "*",
                    maxSize: this.maxSize,
                    page: this.page
                }, function (result) {
                    that.total = result.length ? result[0].total : 0;
                    that.pagedList[that.page] = result;
                    that.list = result;
                });
            },
            pagine: function (toAddToPage) {
                var that = this;
                this.page += toAddToPage;
                var page = this.page;
                if (this.pagedList[this.page]) {
                    this.list = this.pagedList[this.page];
                } else {
                    Circuits.list({
                        search: "*" + (this.currentSearch || "") + "*",
                        maxSize: this.maxSize,
                        page: this.page
                    }, function (result) {
                        that.pagedList[page] = result;
                        that.list = result;
                    });
                }
            },
            select: function (circuit) {
                // Untag all metadata from provided with circuit
                $scope.handler.types.editedSubtype.metadatas.map(function (element) {
                    element.fromCircuit = false;
                });
                this.isCircuitVariable(circuit);
                $scope.handler.types.editedSubtype.circuit = circuit ? circuit.name : "";
                this.selected = circuit;
                // On ajoute les métadonnées obligatoires de circuit
                var metaToAdd = this.getListMetaFromCircuit(circuit);
                $scope.handler.metadonnees.list().map(function (meta) {
                    if (metaToAdd.indexOf(meta.id) !== -1) {
                        var metaSelected = $scope.handler.types.editedSubtype.metadatas.find(function (element) {
                            return element.id === meta.id;
                        });
                        if (metaSelected) {
                            metaSelected.fromCircuit = true;
                            metaSelected.mandatory = "false";
                            metaSelected.editable = "false";
                            metaSelected.default = "";
                        } else {
                            $scope.handler.types.addMetadata(meta, true);
                        }
                    }
                });
            },
            getListMetaFromCircuit: function (circuit) {
                var listeMeta = [];
                if (circuit) {
                    circuit.etapes.map(function (value) {
                        if (value.listeMetadatas) {
                            listeMeta = listeMeta.concat(value.listeMetadatas.filter(function (item) {
                                return listeMeta.indexOf(item) < 0;
                            }));
                        }
                    });
                }
                return listeMeta;
            },
            isCircuitVariable: function (circuit) {
                this.hasVariableStep = false;
                if (circuit) {
                    for (var i = 0; i < circuit.etapes.length; i++) {
                        if (circuit.etapes[i].transition === "VARIABLE") {
                            this.hasVariableStep = true;
                        }
                    }
                }
            }
        },
        //Handler pour les métadonnées
        metadonnees: {
            //Liste des metadonnees
            list: function () {
                return metadonnees;
            },
            //Liste réduite des metadonnees
            subList: [],
            //Page actuelle pour l'affichage
            page: 0,
            //Nombre d'éléments par page (fixe pour le moment)
            maxSize: 10,
            //Nombre total d'éléments
            total: 0,
            //Valeur de recherche de metadonnees
            searchValue: "",
            /**
             * Recherche de metadonnees
             */
            search: function () {
                this.page = 0;
                this.updateSublist();
            },
            /**
             * Mise à jour de la sous-liste (permettant la recherche)
             */
            updateSublist: function () {
                //Filtrage sur la recherche
                this.subList = $filter('filter')(metadonnees, {id: this.searchValue});
                //Calcul sur le total
                this.total = this.subList.length;
                //Pagination
                this.subList = this.subList.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
            },
            /**
             * Gestion de la pagination de la liste des groupes
             * @param toAddToPage Page suivante (+1) ou précédente (-1)
             */
            pagine: function (toAddToPage) {
                this.page += toAddToPage;
                this.updateSublist();
            }
        },
        //Handler pour les calques
        calques: {
            //Liste des calques
            list: function () {
                return calques;
            },
            //Liste réduite des calques
            subList: [],
            //Page actuelle pour l'affichage
            page: 0,
            //Nombre d'éléments par page (fixe pour le moment)
            maxSize: 10,
            //Nombre total d'éléments
            total: 0,
            //Valeur de recherche de calques
            searchValue: "",
            /**
             * Recherche de calques
             */
            search: function () {
                this.page = 0;
                this.updateSublist();
            },
            /**
             * Mise à jour de la sous-liste (permettant la recherche)
             */
            updateSublist: function () {
                //Filtrage sur la recherche
                this.subList = $filter('filter')(calques, {id: this.searchValue});
                //Calcul sur le total
                this.total = this.subList.length;
                //Pagination
                this.subList = this.subList.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
            },
            /**
             * Gestion de la pagination de la liste des groupes
             * @param toAddToPage Page suivante (+1) ou précédente (-1)
             */
            pagine: function (toAddToPage) {
                this.page += toAddToPage;
                this.updateSublist();
            }
        }
    };

    $scope.handler.init();

    var checkAll = function (value, property, filter, toFilter) {
        var listIds = [];
        var objects = $filter('filter')(toFilter, filter);
        if (filter) {
            listIds = $scope.editedSousType[property];
            for (var i = 0; i < objects.length; i++) {
                var index = listIds.indexOf(objects[i].id);
                if (~index) {
                    if (!value) listIds.splice(index, 1);
                } else {
                    if (value) listIds[listIds.length] = objects[i].id;
                }
            }
        } else if (value) {
            //Get list ids bureaux
            for (var j = 0; j < objects.length; j++) {
                listIds[listIds.length] = objects[j].id;
            }
        }
        $scope.editedSousType[property] = listIds;
    };

    $scope.checkAllBureaux = function (value, property, filter) {
        checkAll(value, property, filter, $scope.bureaux);
    };

    $scope.checkAllGroups = function (value, property, filter) {
        checkAll(value, property, filter, $scope.groupes);
    };

    $scope.removeFromProperty = function (property, id) {
        var index = property.indexOf(id);
        if (~index) {
            property.splice(index, 1);
        }
    };

    //Sélection de la checkbox des permissions de bureau
    $scope.checkPermissionBureau = function (checked, id) {
        var indexInArray = $scope.editedSousType.parapheurs.indexOf(id);
        if (checked && indexInArray == -1) {
            $scope.editedSousType.parapheurs.push(id);
        } else if (!checked && indexInArray != -1) {
            $scope.editedSousType.parapheurs.splice(indexInArray, 1);
        }
    };

    //Sélection de la checkbox des permissions de bureau
    $scope.checkPermissionBureauFiltre = function (checked, id) {
        var indexInArray = $scope.editedSousType.parapheursFilters.indexOf(id);
        if (checked && indexInArray == -1) {
            $scope.editedSousType.parapheursFilters.push(id);
        } else if (!checked && indexInArray != -1) {
            $scope.editedSousType.parapheursFilters.splice(indexInArray, 1);
        }
    };

    //Sélection de la checkbox des permissions de groupe
    $scope.checkPermissionGroupe = function (checked, id) {
        var indexInArray = $scope.editedSousType.groups.indexOf(id);
        if (checked && indexInArray == -1) {
            $scope.editedSousType.groups.push(id);
        } else if (!checked && indexInArray != -1) {
            $scope.editedSousType.groups.splice(indexInArray, 1);
        }
    };

    //Sélection de la checkbox des permissions de groupe
    $scope.checkPermissionGroupeFiltre = function (checked, id) {
        var indexInArray = $scope.editedSousType.groupsFilters.indexOf(id);
        if (checked && indexInArray == -1) {
            $scope.editedSousType.groupsFilters.push(id);
        } else if (!checked && indexInArray != -1) {
            $scope.editedSousType.groupsFilters.splice(indexInArray, 1);
        }
    };

    $scope.getProtocole = function (typeId) {
        var tdtProtocole;
        for (var i = 0; i < $scope.listHandler.types.length; i++) {
            if ($scope.listHandler.types[i].id === typeId) {
                tdtProtocole = $scope.listHandler.types[i].tdtProtocole;
                break;
            }
        }
        return tdtProtocole;
    };

    $scope.isAcceptingAttest = function () {

        var parentProtocol;
        var parentFormat;

        for (var i = 0; i < types.length; i++) {
            if (types[i].id === $scope.handler.types.selectedSubtype.parent) {
                parentProtocol = types[i].tdtProtocole;
                parentFormat = types[i].sigFormat;
                break;
            }
        }

        return parentFormat && ((parentFormat.indexOf("PAdES") > -1) || (parentFormat.indexOf("PKCS#7/single") > -1));
    };

    $scope.isAcceptingMultidoc = function () {

        var parentProtocol;
        var parentFormat;

        for (var i = 0; i < types.length; i++) {
            if (types[i].id === $scope.handler.types.selectedSubtype.parent) {
                parentProtocol = types[i].tdtProtocole;
                parentFormat = types[i].sigFormat;
                break;
            }
        }

        var parentProtocolCompatible = (!parentProtocol) || (parentProtocol === "aucun");
        var parentFormatCompatible = parentFormat && ((parentFormat.indexOf("PAdES") > -1) || (parentFormat.indexOf("PKCS#7/single") > -1));

        return parentProtocolCompatible && parentFormatCompatible;
    };

    //Suppression de tout le cache $http à l'arrivée sur cette page
    $cacheFactory.get('$http').removeAll();
}

TypologieAdminController.$inject = ['$scope', '$cacheFactory', 'Types', 'SousTypes', 'Circuits', 'modals', '$filter', 'cache', 'usSpinnerService', 'Cachets', 'PastellConnector', 'Dossiers']; // For JS compilers

var OverrideS2lowController = function ($scope, $modalInstance, titleModal, type, $sce, Connecteurs) {

    $scope.titleModal = titleModal;

    $scope.testConfig = false;
    $scope.saveConfig = false;
    $scope.ready = false;
    $scope.changed = false;
    var isFileAdded = false;
    $scope.filename = undefined;

    var testS2lowConfig = function (data) {
        if ($scope.testConfig) {
            $scope.testConfig = false;
            var toTest = angular.copy($scope.selectedType.overridedTdt);
            angular.extend(toTest, {
                cert: data.encodedFile,
                currentCertName: $scope.selectedType.overridedTdt.name || "",
                tdt: 's2low'
            });
            Connecteurs.testConfig(toTest, function (response) {
                angular.extend($scope.selectedType.overridedTdt, response);
                $scope.changed = false;
                $scope.hasTest = true;
                $scope.selectedType.overridedTdt.isPwdGoodForPkcs = $scope.selectedType.overridedTdt.isPwdGoodForPkcs.substring(0, 2);
            });
        }
    };

    var saveS2lowConfig = function (data) {
        if ($scope.saveConfig) {

            $scope.saveConfig = false;
            var toSave = angular.copy($scope.selectedType.overridedTdt);

            angular.extend(toSave, {
                cert: data.encodedFile,
                name: $scope.filename
            });
            if ($scope.selectedType.tdtProtocole === 'ACTES') {
                $scope.selectedType.$overrideActes(toSave);
                if (~$scope.selectedType.sigFormat.indexOf("PAdES")) {
                    $scope.selectedType.$overridePades(toSave);
                }
            } else if ($scope.selectedType.tdtProtocole === 'HELIOS') {
                $scope.selectedType.$overrideHelios(toSave);
            } else if ($scope.selectedType.tdtProtocole === 'aucun' && !~$scope.selectedType.sigFormat.indexOf("PAdES")) {
                $scope.selectedType.$overrideSig(toSave);
            }
            if (($scope.selectedType.tdtProtocole === 'aucun' && ~$scope.selectedType.sigFormat.indexOf("PAdES"))
                || ~$scope.selectedType.sigFormat.indexOf("AUTO")) {
                $scope.selectedType.$overridePades(toSave);
            }
            $modalInstance.close();
        }
    };

    var canHandlePosition = false;

    if (type.tdtProtocole === 'ACTES') {
        type.$getOverrideActes(function () {
            var otdt = angular.copy(type.overridedTdt);
            if (~type.sigFormat.indexOf("PAdES")) {
                type.$getOverridePades(function () {
                    $scope.ready = true;
                    $scope.selectedType = angular.copy(type);
                    angular.extend($scope.selectedType.overridedTdt, otdt);
                    canHandlePosition = true;
                });
            } else {
                $scope.ready = true;
                $scope.selectedType = angular.copy(type);
            }
        });
    } else if (type.tdtProtocole === 'HELIOS') {
        type.$getOverrideHelios(function () {
            $scope.ready = true;
            $scope.selectedType = angular.copy(type);
        });
    } else if (type.tdtProtocole === 'aucun' && !~type.sigFormat.indexOf("PAdES")) {
        type.$getOverrideSig(function () {
            if(~type.sigFormat.indexOf("AUTO")) {
                var overridedTdt = type.overridedTdt;
                type.$getOverridePades(function () {
                    $scope.ready = true;
                    type.tdtOverride = "true";
                    $.extend(type.overridedTdt, overridedTdt)
                    $scope.selectedType = angular.copy(type);
                    canHandlePosition = true;
                });
            } else {
                $scope.ready = true;
                $scope.selectedType = angular.copy(type);
            }
        });
    } else if (type.tdtProtocole === 'aucun' && ~type.sigFormat.indexOf("PAdES")) {
        type.$getOverridePades(function () {
            $scope.ready = true;
            type.tdtOverride = "true";
            $scope.selectedType = angular.copy(type);
            canHandlePosition = true;
        });
    }

    $scope.handlePosition = function () {
        if (canHandlePosition) {
            return {
                'background-color': 'white',
                'width': $scope.selectedType.overridedTdt.stampWidth / 2.83,
                'height': $scope.selectedType.overridedTdt.stampHeight / 2.83,
                'top': (840 - +$scope.selectedType.overridedTdt.stampCoordY - +$scope.selectedType.overridedTdt.stampHeight) / 2.83 + 'px',
                'left': $scope.selectedType.overridedTdt.stampCoordX / 2.83 + 'px'
            }
        }
        return {};
    };

    $scope.movePosition = function (event) {
        $scope.selectedType.overridedTdt.stampCoordY = "" + Math.floor(840 - $scope.selectedType.overridedTdt.stampHeight / 2 - (event.offsetY * 2.83));
        $scope.selectedType.overridedTdt.stampCoordX = "" + Math.floor(event.offsetX * 2.83 - $scope.selectedType.overridedTdt.stampWidth / 2);
    };

    $scope.infoChanged = function () {
        $scope.changed = true;
    };

    $scope.wrongType = function () {
        $scope.$apply(function () {
            $scope.typeError = true;
        });
    };

    $scope.enableModeTest = function () {
        $scope.testConfig = true;
        if (!isFileAdded) {
            testS2lowConfig({});
        }
    };

    $scope.enableModeSave = function () {
        $scope.saveConfig = true;
        if (!isFileAdded) {
            saveS2lowConfig({});
        }
    };

    $scope.fileEncoded = function (data) {
        $scope.$apply(function () {
            testS2lowConfig(data);
            saveS2lowConfig(data);
        });
    };

    $scope.certAdded = function (files) {
        $scope.$apply(function () {
            $scope.filename = files[files.length - 1].name;
            isFileAdded = true;
        });
    };

    $scope.ok = function () {
        $modalInstance.close();
    };

};

var RemoveTypeController = function ($scope, $modalInstance, title, message, object, Dossiers, $sce) {
    $scope.title = title;
    $scope.message = message;

    //
    var typeName = object.parent ? object.parent : object.id;
    var subTypeName = object.parent ? object.id : "";
    var dossiers = Dossiers.listAsAdmin({
        bureau: undefined,
        type: typeName,
        sousType: subTypeName,
        title: "",
        showOnlyCurrent: false,
        showOnlyLate: false
    }, function() {
        if(dossiers.length > 0) {
            $scope.error = $sce.trustAsHtml("Attention, il existe actuellement " + dossiers.length + " dossiers utilisant cette typologie.<br/>" +
                "Ces dossiers seront bloqués dans leur état actuel si la typologie est supprimée.");
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};;
//Controller for users page
function UtilisateursAdminController($scope, $rootScope, Users, utils, $modal, ngTableParams, $filter, modals, configuration, Tenants, cache, $location) {

    //Utilisateur séléctionné
    $scope.users = [];
    $scope.newUser = {};
    $scope.search = "";
    $scope.newPass = {newOne: "", confirm: ""}; // for form validation (directive 'confirm-with')
    $scope.flags = {
        hasSearch: false,
        isSearching: false
    };

    if (!configuration.isAdmin) {
        $location.path("/bureaux");
    }

    var isTenantEnabled;
    if ($rootScope.isMTEnabled == undefined) {
        Tenants.isEnabled(function (result) {
            $rootScope.isMTEnabled = result.mtEnabled;
            isTenantEnabled = result.mtEnabled;
        });
    } else {
        isTenantEnabled = $rootScope.isMTEnabled;
    }
    $scope.multiTenantEnableError = false;

    var buildTable = function () {
        if (!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($filter('filter')($scope.users, $scope.search), params.orderBy()) :
                        $filter('filter')($scope.users, $scope.search);
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
        $scope.flags.isSearching = false;
    };

    //Lancement de la création d'un utilisateur
    $scope.createUser = function () {
        //New user
        $scope.newPass = {newOne: "", confirm: ""};
        $scope.newUser = new Users();
    };

    $scope.cancelCreate = function () {
        $scope.newUser = {};
    };

    // Sauvegarde d'un nouvel utilisateur
    var saveUser = function () {
        if (!$scope.newUser.email) {
            $scope.newUser.email = "";
        }

        // Gestion de la création d'utilisateur via tenant
        if (configuration.tenant) {
            $scope.newUser.username = $scope.newUser.username.split("@")[0];
        }

        $scope.newUser.$save(function () {
            if ($scope.newUser.id === "already exists") {
                $scope.exist = true
            } else {
                if (configuration.tenant) {
                    $scope.newUser.username = $scope.newUser.username + "@" + configuration.tenant;
                }
                $scope.users.push($scope.newUser);
                buildTable();
                $scope.newUser = {};
            }
        });
    };

    //Affichage de la fenetre modale
    $scope.editUser = function (user) {
        launchModal(user);
    };

    $scope.askForPassword = function () {
        if (isTenantEnabled && ~$scope.newUser.username.indexOf("@") && !configuration.tenant) {
            $scope.multiTenantEnableError = true
        } else {
            modals.launch("base", {
                title: 'Admin.Users.UserMod_New_Title',
                message: 'Admin.Users.UserMod_New_Msg',
                ctrl: AskPasswordController,
                template: 'partials/modals/askPasswordModal.html'
            }, function (result) {
                $scope.newUser.password = result;
                $scope.flags.hasSearch = true;
                saveUser();
            });
        }
    };

    //Suppression de l'utilisateur sélectionné
    $scope.deleteUser = function (user) {
        var message = "";
        if (user.isFromLdap) {
            message = $filter('translate')('Admin.Users.UserMod_Remove_LDAP');
        }
        if (user['isSecretaire'] || user['isProprietaire']) {
            message += $filter('translate')('Admin.Users.UserMod_Remove_Prop');
        }
        message += $filter('translate')('Admin.Users.UserMod_Remove_Confirm');
        launchConfirmModal('Admin.Users.UserMod_Remove',
            (user.firstName || '') + ' ' + (user.lastName || ''),
            message,
            user,
            DeleteUserController,
            'partials/modals/simpleConfirmationModal.html',
            function () {
                user.$delete(function () {
                    var indexInArray = $scope.users.indexOf(user);
                    if (indexInArray != -1) {
                        $scope.users.splice(indexInArray, 1);
                    }
                    buildTable();
                });
            });
    };

    $scope.updateListUsers = function () {
        $scope.flags.hasSearch = true;
        $scope.flags.isSearching = true;
        //Affichage de la liste des utilisateurs
        cache.users.list().then(function (list) {
            $scope.users = list;
            buildTable();
        });
    };

    $scope.updateListUsers();

    $scope.changeSearch = function () {
        buildTable();
    };

    var launchModal = function (user, type, success) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modals/utilisateursModal.html',
            controller: EditUserCtrl,
            resolve: {
                type: function () {
                    return type;
                },
                user: function () {
                    return user;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (typeof success === "function") {
                success(result);
            }
            updateUser(result.user, result.originalUser);
            var indexInArray = $scope.users.indexOf(user);
            if (indexInArray != -1) {
                angular.extend($scope.users[indexInArray], result.user);
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    var launchConfirmModal = function (title, complement, message, user, ctrl, modalFile, success) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop: 'static',
            resolve: {
                user: function () {
                    return user;
                },
                title: function () {
                    return title;
                },
                titleComplement: function () {
                    return complement;
                },
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (typeof success === "function") {
                success(result);
            }
        }, function () {
        });
    };

    //Mise à jour de l'utilisateur
    var updateUser = function (user, originalUser) {
        //Si le username est défini, mise à jour
        if (user.id) {
            var updated = utils.diff(originalUser, user);
            if (!$scope.isEmptyOrNull(updated)) {
                //Mise à jour sur le serveur de l'utilisateur courant, avec sauvegarde des changements seulement
                Users.update({id: user.id}, updated);
            }
        }
    };
}
UtilisateursAdminController.$inject = ['$scope', '$rootScope', 'Users', 'utils', '$modal', 'ngTableParams', '$filter', 'modals', 'configuration', 'Tenants', 'cache', '$location']; // For JS compilers

var EditUserCtrl = function ($scope, $filter, $modalInstance, $http, ngTableParams, Users, Bureaux, utils, configuration, type, user, cache, viewService) {

    var API_CHANGEPASS = configuration.ALFRESCO + "person/changepassword/" + user.username;

    $scope.type = type;
    $scope.bureauSuppressError = false;
    $scope.originalUser = {};
    $scope.newPass = {newOne: "", confirm: ""}; // for form validation (directive 'confirm-with')
    $scope.respPass = {};
    $scope.fileUploadFormat = "certificat-pub";

    //Get current user
    $scope.user = Users.get({id: user.id}, function (data) {
        $scope.originalUser = angular.copy(data);
        $scope.user.$getBureauxAdministres();
    });

    $scope.date = new Date().getTime();

    $scope.bureaux = [];

    $scope.listHandler = {
        bureaux: [],
        subListAdminFonctionnel: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function () {
            var that = this;
            cache.bureaux.list().then(function (bureaux) {
                $scope.bureaux = bureaux;
                that.search("");
            });
        },
        search: function (toSearch) {
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, toSearch);
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function (toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function () {
            this.subListAdminFonctionnel = this.bureaux.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
        },
        selectForAdminFonctionnel: function (b) {
            $scope.user.bureauxAdministres.push(b.id);
            this.getNewList();
        },
        unselectForAdminFonctionnel: function (id) {
            var indexInArray = $scope.user.bureauxAdministres.indexOf(id);
            if (~indexInArray) {
                $scope.user.bureauxAdministres.splice(indexInArray, 1);
            }
            this.getNewList();
        }
    };

    $scope.listHandler.init();

    // Récupération des bureaux dont l'utilisateur est propriétaire ou secrétaire
    $scope.getBureaux = function () {
        $scope.user.$getBureaux(function () {
            buildTable();
        });
    };

    var buildTable = function () {
        if (!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 100          // count per page
            }, {
                counts: [],
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.user.bureaux, params.orderBy()) :
                        $scope.user.bureaux;
                    params.total($scope.user.bureaux.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.reload();
        }
    };

    $scope.$watch(
        'user.admin',
        function (newValue) {
            if (newValue === "admin") {
                $scope.user.isAdmin = true;
                $scope.user.isAdminFonctionnel = false;
            } else if (newValue === "adminFonctionnel") {
                $scope.user.isAdmin = false;
                $scope.user.isAdminFonctionnel = true;
            } else {
                $scope.user.isAdmin = false;
                $scope.user.isAdminFonctionnel = false;
            }
            if ((newValue === 'adminFonctionnel') && (!$scope.allBureaux)) {
                //getBureauxAdministres();
            }
        },
        true);

    // Bureaux

    $scope.removeFromBureau = function (bureau) {
        $scope.bureauSuppressError = false;
        $scope.user.$deleteBureau({
                resourceId: bureau.id,
                isProprietaire: bureau.isProprietaire
            },
            function () {
                $scope.user.bureaux.splice($scope.user.bureaux.indexOf(bureau), 1);
                buildTable();
            },
            function () {
                $scope.bureauSuppressError = true;
            });
    };

    // Mot de passe
    $scope.changePassword = function () {
        $scope.respPass = {};
        $scope.wrongPwd = false;
        var pass = $scope.newPass.newOne.trim();
        if ((pass.length > 2) && ($scope.newPass.newOne === $scope.newPass.confirm)) {
            var params = {
                "userName": $scope.user.username,
                "newpw": $scope.newPass.newOne
            };
            if ($scope.originalUser.username === $scope.config.username) {
                params.oldpw = $scope.newPass.oldOne;
            }
            $http.post(API_CHANGEPASS, params).success(function (resp) {
                if (resp.status && resp.status.code === 401) {
                    $scope.wrongPwd = true;
                } else {
                    angular.copy(resp, $scope.respPass);
                }
            }).error(function () {
                angular.copy({error: true}, $scope.respPass);
            });
        }
    };

    //Notifications
    $scope.notifications = {
        mode: "always",
        mail: undefined,
        cron: {},
        changed: false,
        saved: false,
        error: undefined,
        defaultPref: {
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
        extendDeep: function extendDeep(dst) {
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
        init: function () {
            var that = this;
            //init prefs
            $http.get(configuration.ALFRESCO + "people/" + user.username + "/preferences?pf=org.adullact.iparapheur.notifications").success(function (resp) {
                try {
                    if (resp.org.adullact.iparapheur.notifications) {
                        that.extendDeep(that.defaultPref, resp.org.adullact.iparapheur.notifications);
                    }
                } catch (e) {
                    console.log(e);
                    //Preferences non initialisé, récupération de celles par défault
                } finally {
                    that.cron = viewService.extractCron(that.defaultPref.digest.cron);
                    that.mail = that.defaultPref.mail;
                    if (that.defaultPref.enabled) {
                        if (that.defaultPref.dailydigest.enabled) {
                            that.mode = viewService.getCronMode(that.defaultPref.digest.cron);
                        }
                        else {
                            that.mode = "always";
                        }
                    }
                    else {
                        that.mode = "never";
                    }
                }
            });
        },
        cronDidChange: function () {
            this.changed = true;
        },
        saveCronPrefs: function (success) {
            var that = this;
            this.error = undefined;
            Users.saveNotificationsPreferences(
                {id: user.id},
                {
                    mode: that.mode,
                    mail: that.mail,
                    frequency: that.cron[that.mode]
                })
                .$promise.then(function () {
                    that.changed = false;
                    that.saved = true;
                    success();
                },
                function (error) {
                    success();
                    that.error = error;
                    that.changed = false;
                    that.saved = false;
                }
            );
        }
    };

    $scope.notifications.init();

    $scope.typeError = false;

    // Scan de signature
    $scope.setSignature = function () {
        $scope.fileUploadFormat = "image";
    };

    $scope.deleteSignature = function () {
        if ($scope.user.signature !== undefined) {
            $scope.user.signature = "";
        }
        $scope.user.signatureData = undefined;
        $scope.signatureFormat = undefined;
    };

    // Certificat de connexion
    $scope.setCertificat = function () {
        $scope.fileUploadFormat = "certificat-pub";
    };

    $scope.deleteCertificat = function () {
        $scope.certificateUsedBy = undefined;
        $scope.typeError = false;
        if (!$scope.isEmptyOrNull($scope.user.certificat)) {
            $scope.user.certificat = {};
            $scope.user.hasCertificate = false;
        }
    };

    $scope.removeFromGroup = function (group) {
        $scope.user.$removeFromGroup({resourceId: group}, function () {
            $scope.user.groups.splice($scope.user.groups.indexOf(group), 1);
        });
    };

    $scope.fileUploaded = function (resp) {
        $scope.$apply(function () {
            if ($scope.fileUploadFormat === "image") {
                $scope.user.signatureData = resp.encodedFile;
            }
            else {
                var encodedFile = resp.encodedFile;
                Users.getCertificatDetails({id: $scope.user.id}, {certificat: encodedFile}, function (resp) {
                    if (!$scope.isEmptyOrNull(resp)) {
                        $scope.user.certificat = resp.certificat;
                        $scope.certificateUsedBy = resp.usedBy;
                    }
                    $scope.user.certificat.content = encodedFile;
                    $scope.user.hasCertificate = true;
                });
            }
        });
    };

    $scope.fileAdded = function (files) {
        if ($scope.fileUploadFormat === "image") {
            $scope.signatureFormat = $filter('fileext')(files[0].name).toLowerCase();
        }
        else {
            $scope.certificateUsedBy = undefined;
            $scope.typeError = false;
        }
    };

    $scope.wrongType = function () {
        $scope.$apply(function () {
            $scope.typeError = true;
        });
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if ($scope.user.admin === "adminFonctionnel" && $scope.user.bureauxAdministres.length === 0) {
            $scope.user.admin = "aucun";
        }
        $scope.notifications.saveCronPrefs(function () {
            $modalInstance.close({user: $scope.user, originalUser: $scope.originalUser});
        });
    };
};

var DeleteUserController = function ($scope, $modalInstance, title, titleComplement, message, user) {
    $scope.user = user;
    $scope.title = title;
    $scope.titleComplement = titleComplement;
    $scope.message = message;


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};