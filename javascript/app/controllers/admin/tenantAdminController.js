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
}