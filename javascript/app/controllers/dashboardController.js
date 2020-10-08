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
DashboardController.$inject = ['$rootScope', '$scope', 'Metadonnees', 'Types', 'Dossiers', 'Delegations', 'navigationService', 'viewService', 'preferences', '$location', 'modals', 'utils', 'configuration', 'corbeilleFromMail', '$timeout', '$filter', 'cache']; // For JS compilers