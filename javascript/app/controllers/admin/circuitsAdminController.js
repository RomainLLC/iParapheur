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
CircuitsAdminController.$inject = ['$scope', 'Circuits', 'modals', '$filter', 'cache']; // For JS compilers