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
