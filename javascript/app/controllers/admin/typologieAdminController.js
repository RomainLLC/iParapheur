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
};