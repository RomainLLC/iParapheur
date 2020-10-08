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
