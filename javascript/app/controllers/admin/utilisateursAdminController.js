//Controller for users page
function UtilisateursAdminController($scope, $rootScope, Users, utils, $modal, ngTableParams, $filter, modals, configuration, Tenants, cache, $location) {

    //Utilisateur séléctionné
    $scope.users = [];
    $scope.newUser = {};
    $scope.search = "";
    $scope.newPass = {newOne: "", confirm: ""}; // for form validation (directive 'confirm-with')
    $scope.flags = {
        hasSearch: false,
        isSearching: false
    };

    if (!configuration.isAdmin) {
        $location.path("/bureaux");
    }

    var isTenantEnabled;
    if ($rootScope.isMTEnabled == undefined) {
        Tenants.isEnabled(function (result) {
            $rootScope.isMTEnabled = result.mtEnabled;
            isTenantEnabled = result.mtEnabled;
        });
    } else {
        isTenantEnabled = $rootScope.isMTEnabled;
    }
    $scope.multiTenantEnableError = false;

    var buildTable = function () {
        if (!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($filter('filter')($scope.users, $scope.search), params.orderBy()) :
                        $filter('filter')($scope.users, $scope.search);
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
        $scope.flags.isSearching = false;
    };

    //Lancement de la création d'un utilisateur
    $scope.createUser = function () {
        //New user
        $scope.newPass = {newOne: "", confirm: ""};
        $scope.newUser = new Users();
    };

    $scope.cancelCreate = function () {
        $scope.newUser = {};
    };

    // Sauvegarde d'un nouvel utilisateur
    var saveUser = function () {
        if (!$scope.newUser.email) {
            $scope.newUser.email = "";
        }

        // Gestion de la création d'utilisateur via tenant
        if (configuration.tenant) {
            $scope.newUser.username = $scope.newUser.username.split("@")[0];
        }

        $scope.newUser.$save(function () {
            if ($scope.newUser.id === "already exists") {
                $scope.exist = true
            } else {
                if (configuration.tenant) {
                    $scope.newUser.username = $scope.newUser.username + "@" + configuration.tenant;
                }
                $scope.users.push($scope.newUser);
                buildTable();
                $scope.newUser = {};
            }
        });
    };

    //Affichage de la fenetre modale
    $scope.editUser = function (user) {
        launchModal(user);
    };

    $scope.askForPassword = function () {
        if (isTenantEnabled && ~$scope.newUser.username.indexOf("@") && !configuration.tenant) {
            $scope.multiTenantEnableError = true
        } else {
            modals.launch("base", {
                title: 'Admin.Users.UserMod_New_Title',
                message: 'Admin.Users.UserMod_New_Msg',
                ctrl: AskPasswordController,
                template: 'partials/modals/askPasswordModal.html'
            }, function (result) {
                $scope.newUser.password = result;
                $scope.flags.hasSearch = true;
                saveUser();
            });
        }
    };

    //Suppression de l'utilisateur sélectionné
    $scope.deleteUser = function (user) {
        var message = "";
        if (user.isFromLdap) {
            message = $filter('translate')('Admin.Users.UserMod_Remove_LDAP');
        }
        if (user['isSecretaire'] || user['isProprietaire']) {
            message += $filter('translate')('Admin.Users.UserMod_Remove_Prop');
        }
        message += $filter('translate')('Admin.Users.UserMod_Remove_Confirm');
        launchConfirmModal('Admin.Users.UserMod_Remove',
            (user.firstName || '') + ' ' + (user.lastName || ''),
            message,
            user,
            DeleteUserController,
            'partials/modals/simpleConfirmationModal.html',
            function () {
                user.$delete(function () {
                    var indexInArray = $scope.users.indexOf(user);
                    if (indexInArray != -1) {
                        $scope.users.splice(indexInArray, 1);
                    }
                    buildTable();
                });
            });
    };

    $scope.updateListUsers = function () {
        $scope.flags.hasSearch = true;
        $scope.flags.isSearching = true;
        //Affichage de la liste des utilisateurs
        cache.users.list().then(function (list) {
            $scope.users = list;
            buildTable();
        });
    };

    $scope.updateListUsers();

    $scope.changeSearch = function () {
        buildTable();
    };

    var launchModal = function (user, type, success) {
        var modalInstance = $modal.open({
            templateUrl: 'partials/modals/utilisateursModal.html',
            controller: EditUserCtrl,
            resolve: {
                type: function () {
                    return type;
                },
                user: function () {
                    return user;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (typeof success === "function") {
                success(result);
            }
            updateUser(result.user, result.originalUser);
            var indexInArray = $scope.users.indexOf(user);
            if (indexInArray != -1) {
                angular.extend($scope.users[indexInArray], result.user);
            }
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

    var launchConfirmModal = function (title, complement, message, user, ctrl, modalFile, success) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop: 'static',
            resolve: {
                user: function () {
                    return user;
                },
                title: function () {
                    return title;
                },
                titleComplement: function () {
                    return complement;
                },
                message: function () {
                    return message;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if (typeof success === "function") {
                success(result);
            }
        }, function () {
        });
    };

    //Mise à jour de l'utilisateur
    var updateUser = function (user, originalUser) {
        //Si le username est défini, mise à jour
        if (user.id) {
            var updated = utils.diff(originalUser, user);
            if (!$scope.isEmptyOrNull(updated)) {
                //Mise à jour sur le serveur de l'utilisateur courant, avec sauvegarde des changements seulement
                Users.update({id: user.id}, updated);
            }
        }
    };
}
UtilisateursAdminController.$inject = ['$scope', '$rootScope', 'Users', 'utils', '$modal', 'ngTableParams', '$filter', 'modals', 'configuration', 'Tenants', 'cache', '$location']; // For JS compilers

var EditUserCtrl = function ($scope, $filter, $modalInstance, $http, ngTableParams, Users, Bureaux, utils, configuration, type, user, cache, viewService) {

    var API_CHANGEPASS = configuration.ALFRESCO + "person/changepassword/" + user.username;

    $scope.type = type;
    $scope.bureauSuppressError = false;
    $scope.originalUser = {};
    $scope.newPass = {newOne: "", confirm: ""}; // for form validation (directive 'confirm-with')
    $scope.respPass = {};
    $scope.fileUploadFormat = "certificat-pub";

    //Get current user
    $scope.user = Users.get({id: user.id}, function (data) {
        $scope.originalUser = angular.copy(data);
        $scope.user.$getBureauxAdministres();
    });

    $scope.date = new Date().getTime();

    $scope.bureaux = [];

    $scope.listHandler = {
        bureaux: [],
        subListAdminFonctionnel: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function () {
            var that = this;
            cache.bureaux.list().then(function (bureaux) {
                $scope.bureaux = bureaux;
                that.search("");
            });
        },
        search: function (toSearch) {
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, toSearch);
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function (toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function () {
            this.subListAdminFonctionnel = this.bureaux.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
        },
        selectForAdminFonctionnel: function (b) {
            $scope.user.bureauxAdministres.push(b.id);
            this.getNewList();
        },
        unselectForAdminFonctionnel: function (id) {
            var indexInArray = $scope.user.bureauxAdministres.indexOf(id);
            if (~indexInArray) {
                $scope.user.bureauxAdministres.splice(indexInArray, 1);
            }
            this.getNewList();
        }
    };

    $scope.listHandler.init();

    // Récupération des bureaux dont l'utilisateur est propriétaire ou secrétaire
    $scope.getBureaux = function () {
        $scope.user.$getBureaux(function () {
            buildTable();
        });
    };

    var buildTable = function () {
        if (!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 100          // count per page
            }, {
                counts: [],
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.user.bureaux, params.orderBy()) :
                        $scope.user.bureaux;
                    params.total($scope.user.bureaux.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.reload();
        }
    };

    $scope.$watch(
        'user.admin',
        function (newValue) {
            if (newValue === "admin") {
                $scope.user.isAdmin = true;
                $scope.user.isAdminFonctionnel = false;
            } else if (newValue === "adminFonctionnel") {
                $scope.user.isAdmin = false;
                $scope.user.isAdminFonctionnel = true;
            } else {
                $scope.user.isAdmin = false;
                $scope.user.isAdminFonctionnel = false;
            }
            if ((newValue === 'adminFonctionnel') && (!$scope.allBureaux)) {
                //getBureauxAdministres();
            }
        },
        true);

    // Bureaux

    $scope.removeFromBureau = function (bureau) {
        $scope.bureauSuppressError = false;
        $scope.user.$deleteBureau({
                resourceId: bureau.id,
                isProprietaire: bureau.isProprietaire
            },
            function () {
                $scope.user.bureaux.splice($scope.user.bureaux.indexOf(bureau), 1);
                buildTable();
            },
            function () {
                $scope.bureauSuppressError = true;
            });
    };

    // Mot de passe
    $scope.changePassword = function () {
        $scope.respPass = {};
        $scope.wrongPwd = false;
        var pass = $scope.newPass.newOne.trim();
        if ((pass.length > 2) && ($scope.newPass.newOne === $scope.newPass.confirm)) {
            var params = {
                "userName": $scope.user.username,
                "newpw": $scope.newPass.newOne
            };
            if ($scope.originalUser.username === $scope.config.username) {
                params.oldpw = $scope.newPass.oldOne;
            }
            $http.post(API_CHANGEPASS, params).success(function (resp) {
                if (resp.status && resp.status.code === 401) {
                    $scope.wrongPwd = true;
                } else {
                    angular.copy(resp, $scope.respPass);
                }
            }).error(function () {
                angular.copy({error: true}, $scope.respPass);
            });
        }
    };

    //Notifications
    $scope.notifications = {
        mode: "always",
        mail: undefined,
        cron: {},
        changed: false,
        saved: false,
        error: undefined,
        defaultPref: {
            enabled: true,
            dailydigest: {
                enabled: false
            },
            digest: {
                cron: "0 0/10 * * * ?"
            },
            mail: "",
            mode: "always"
        },
        extendDeep: function extendDeep(dst) {
            angular.forEach(arguments, function (obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function (value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            extendDeep(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        },
        init: function () {
            var that = this;
            //init prefs
            $http.get(configuration.ALFRESCO + "people/" + user.username + "/preferences?pf=org.adullact.iparapheur.notifications").success(function (resp) {
                try {
                    if (resp.org.adullact.iparapheur.notifications) {
                        that.extendDeep(that.defaultPref, resp.org.adullact.iparapheur.notifications);
                    }
                } catch (e) {
                    console.log(e);
                    //Preferences non initialisé, récupération de celles par défault
                } finally {
                    that.cron = viewService.extractCron(that.defaultPref.digest.cron);
                    that.mail = that.defaultPref.mail;
                    if (that.defaultPref.enabled) {
                        if (that.defaultPref.dailydigest.enabled) {
                            that.mode = viewService.getCronMode(that.defaultPref.digest.cron);
                        }
                        else {
                            that.mode = "always";
                        }
                    }
                    else {
                        that.mode = "never";
                    }
                }
            });
        },
        cronDidChange: function () {
            this.changed = true;
        },
        saveCronPrefs: function (success) {
            var that = this;
            this.error = undefined;
            Users.saveNotificationsPreferences(
                {id: user.id},
                {
                    mode: that.mode,
                    mail: that.mail,
                    frequency: that.cron[that.mode]
                })
                .$promise.then(function () {
                    that.changed = false;
                    that.saved = true;
                    success();
                },
                function (error) {
                    success();
                    that.error = error;
                    that.changed = false;
                    that.saved = false;
                }
            );
        }
    };

    $scope.notifications.init();

    $scope.typeError = false;

    // Scan de signature
    $scope.setSignature = function () {
        $scope.fileUploadFormat = "image";
    };

    $scope.deleteSignature = function () {
        if ($scope.user.signature !== undefined) {
            $scope.user.signature = "";
        }
        $scope.user.signatureData = undefined;
        $scope.signatureFormat = undefined;
    };

    // Certificat de connexion
    $scope.setCertificat = function () {
        $scope.fileUploadFormat = "certificat-pub";
    };

    $scope.deleteCertificat = function () {
        $scope.certificateUsedBy = undefined;
        $scope.typeError = false;
        if (!$scope.isEmptyOrNull($scope.user.certificat)) {
            $scope.user.certificat = {};
            $scope.user.hasCertificate = false;
        }
    };

    $scope.removeFromGroup = function (group) {
        $scope.user.$removeFromGroup({resourceId: group}, function () {
            $scope.user.groups.splice($scope.user.groups.indexOf(group), 1);
        });
    };

    $scope.fileUploaded = function (resp) {
        $scope.$apply(function () {
            if ($scope.fileUploadFormat === "image") {
                $scope.user.signatureData = resp.encodedFile;
            }
            else {
                var encodedFile = resp.encodedFile;
                Users.getCertificatDetails({id: $scope.user.id}, {certificat: encodedFile}, function (resp) {
                    if (!$scope.isEmptyOrNull(resp)) {
                        $scope.user.certificat = resp.certificat;
                        $scope.certificateUsedBy = resp.usedBy;
                    }
                    $scope.user.certificat.content = encodedFile;
                    $scope.user.hasCertificate = true;
                });
            }
        });
    };

    $scope.fileAdded = function (files) {
        if ($scope.fileUploadFormat === "image") {
            $scope.signatureFormat = $filter('fileext')(files[0].name).toLowerCase();
        }
        else {
            $scope.certificateUsedBy = undefined;
            $scope.typeError = false;
        }
    };

    $scope.wrongType = function () {
        $scope.$apply(function () {
            $scope.typeError = true;
        });
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        if ($scope.user.admin === "adminFonctionnel" && $scope.user.bureauxAdministres.length === 0) {
            $scope.user.admin = "aucun";
        }
        $scope.notifications.saveCronPrefs(function () {
            $modalInstance.close({user: $scope.user, originalUser: $scope.originalUser});
        });
    };
};

var DeleteUserController = function ($scope, $modalInstance, title, titleComplement, message, user) {
    $scope.user = user;
    $scope.title = title;
    $scope.titleComplement = titleComplement;
    $scope.message = message;


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};