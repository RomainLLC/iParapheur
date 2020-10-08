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
