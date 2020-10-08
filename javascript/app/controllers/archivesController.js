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
ArchivesController.$inject = ['$scope', 'Metadonnees', 'Types', 'Archives', 'navigationService', 'viewService', 'preferences', 'utils', 'modals', '$filter']; // For JS compilers