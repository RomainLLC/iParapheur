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
}