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
};