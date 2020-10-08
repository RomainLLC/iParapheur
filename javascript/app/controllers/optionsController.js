//Controller for options page
function OptionsController($scope, $modal, $sce, $rootScope, preferences, configuration, viewService, Bureaux, Users, prefs, $translate) {
    $rootScope.prefs = prefs;
    var basePrefs = angular.copy($rootScope.prefs);
    $scope.columns = {};
    viewService.getDashboardColumns($rootScope.prefs.enabledColumns, function(data) {
        $scope.columns = data;
    });
    viewService.getArchiveColumns($rootScope.prefs.enabledColumnsArchives, function(data) {
        $scope.archiveColumns = data;
    });
    $scope.signNode = configuration.signNode;

    //Password
    $scope.newpass = {};
    $scope.changePassword = function() {
        $scope.respPass = preferences.changePassword($scope.newpass.old, $scope.newpass.newOne);
    };

    //Theme
    $scope.themes = configuration.themes;
    $scope.changeTheme = function(theme) {
        $rootScope.themeSelected = theme;
        preferences.changeProperty(preferences.paths.THEME,  theme);
    };

    //Dashboard
    // UGLY FIX TO ASYNC PREFS SAVING...
    $scope.saveDashboardPrefs = function() {
        //On ne sauvegarde que ce qui a été changé
        if($rootScope.prefs.filterDefault && basePrefs.filterDefault !== $rootScope.prefs.filterDefault) {
            preferences.changeProperty(preferences.paths.FILTERDEFAULT, $rootScope.prefs.filterDefault, savedisplayDelegation);
        } else if(!$rootScope.prefs.filterDefault) {
            preferences.removeProperty(preferences.paths.FILTERDEFAULT.path, savedisplayDelegation);
        } else {
            savedisplayDelegation();
        }

    };
    var savedisplayDelegation = function() {
        if(basePrefs.displayDelegation !== $rootScope.prefs.displayDelegation) {
            preferences.changeProperty(preferences.paths.DISDELEG, $rootScope.prefs.displayDelegation, savePagesize);
        } else {
            savePagesize();
        }
    };
    var savePagesize = function() {
        if(basePrefs.pagesize !== $rootScope.prefs.pagesize) {
            preferences.changeProperty(preferences.paths.PAGESIZE, $rootScope.prefs.pagesize, saveAsc);
        } else {
            saveAsc();
        }
    };
    var saveAsc = function() {
        if(basePrefs.asc !== $rootScope.prefs.asc) {
            preferences.changeProperty(preferences.paths.ASC, $rootScope.prefs.asc, savePropSort);
        } else {
            savePropSort();
        }
    };
    var savePropSort = function() {
        if(basePrefs.propSort !== $rootScope.prefs.propSort) {
            preferences.changeProperty(preferences.paths.PROPSORT, $rootScope.prefs.propSort, saveColumns);
        } else {
            saveColumns();
        }
    };
    var saveColumns = function() {
        preferences.changeProperty(preferences.paths.COLDASH, viewService.toSaveColumns($scope.columns.enabled));
        //preferences.changeProperty(preferences.paths.COLORATION, JSON.stringify(angular.copy($scope.colorations)));
        basePrefs = angular.copy($rootScope.prefs);
    };

    //Colorations
    $scope.colorations = JSON.parse($scope.prefs.coloration);
    $scope.deleteColoration = function(index) {
        $scope.colorations.splice(index, 1);
    };
    /**
     * Gestion des fenetres modales
     */
    var launchModal = function(ctrl, modalFile, success, enabledColumns) {
        var modalInstance = $modal.open({
            templateUrl: modalFile,
            controller: ctrl,
            backdrop : 'static',
            resolve: {
                enabledColumns : function() {
                    return enabledColumns;
                }
            }
        });

        modalInstance.result.then(function (result) {
            if(typeof success === "function") {
                success(result);
            }
        }, function () {
        });
    };

    $scope.addColoration = function() {
        launchModal(ColorationController, 'partials/modals/colorationModal.html',function(data) {
            //Colorations
            $scope.colorations.push(data);
        }, $scope.columns.enabled);
    };

    $scope.saveLanguage = function() {
        $translate.use($rootScope.prefs.language);
        preferences.changeProperty(preferences.paths.LANG, $rootScope.prefs.language);
    };

    //Archive
    $scope.saveArchivePrefs = function() {
        preferences.changeProperty(preferences.paths.PAGESIZEARCH, $rootScope.prefs.pagesizeArchives);
        preferences.changeProperty(preferences.paths.COLARCH, viewService.toSaveColumns($scope.archiveColumns.enabled));
    };
    //Notifications
    $scope.notifications = {
        mode: "always",
        mail: undefined,
        cron: {},
        changed: false,
        saved: false,
        error: undefined,
        init: function() {
            this.cron = viewService.extractCron($rootScope.prefs.notifications.digest.cron);
            this.mail = $rootScope.prefs.notifications.mail;
            if ($rootScope.prefs.notifications.enabled) {
                if ($rootScope.prefs.notifications.dailydigest.enabled) {
                    this.mode = viewService.getCronMode($rootScope.prefs.notifications.digest.cron);
                }
                else {
                    this.mode = "always";
                }
            }
            else {
                this.mode = "never";
            }
        },
        cronDidChange: function() {
            this.changed = true;
        },
        saveCronPrefs: function() {
            var that = this;
            this.error = undefined;
            Users.saveNotificationsPreferences(
                {id: configuration.id},
                {
                    mode: that.mode,
                    mail: that.mail,
                    frequency:that.cron[that.mode]
                })
                .$promise.then(function () {
                    $rootScope.prefs.notifications.mail = that.mail;
                    switch(that.mode) {
                        case "never":
                            $rootScope.prefs.notifications.enabled = false;
                            break;
                        case "always":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = false;
                            break;
                        case "hourly":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 0/" + that.cron[that.mode] + " * * ?";
                            break;
                        case "daily":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 " + that.cron[that.mode] + " * * ?";
                            break;
                        case "weekly":
                            $rootScope.prefs.notifications.enabled = true;
                            $rootScope.prefs.notifications.dailydigest.enabled = true;
                            $rootScope.prefs.notifications.digest.cron = "0 0 8 ? * " + that.cron[that.mode];
                            break;
                    }
                    that.changed = false;
                    that.saved = true;
                },
                function (error) {
                    that.error = error;
                    that.changed = false;
                    that.saved = false;
                }
            );
        }
    };

    $scope.notifications.init();

    //Signature
    $scope.changeSignatureUrl = $sce.trustAsResourceUrl($scope.context + "/changeSignature");
    $scope.typeError = false;
    $scope.signatureSaved = function(resp) {
        $scope.$apply(function() {
            configuration.signNode = resp.node;
            $scope.signNode = resp.node;
            $scope.typeError = false;
            $scope.timeimg = new Date().getTime();
        });
    };
    $scope.wrongType = function() {
        $scope.$apply(function() {
            $scope.typeError = true;
        });
    };

    //Order bureaux
    $scope.bureaux = Bureaux.query(function() {
        $rootScope.orderedBureaux = [];
        if($scope.prefs['bureauxOrder'] !== undefined) {
            var array = JSON.parse($scope.prefs['bureauxOrder']);
            var added = [];
            //Ajout des bureaux ordonnés
            for(var i = 0; i < array.length; i++) {
                for(var j = 0; j < $scope.bureaux.length; j++) {
                    if($scope.bureaux[j].id === array[i]) {
                        $rootScope.orderedBureaux.push($scope.bureaux[j]);
                        added[j] = true;
                    }
                }
            }
            //Ajout des bureaux non ajoutés
            for(var k = 0; k < $scope.bureaux.length; k++) {
                if(!added[k]) {
                    $rootScope.orderedBureaux.push($scope.bureaux[k]);
                }
            }
        } else {
            $rootScope.orderedBureaux = $scope.bureaux;
        }
    });
    $scope.saveOrderPrefs = function() {
        var array = [];
        for(var i = 0; i < $rootScope.orderedBureaux.length; i++) {
            array.push($rootScope.orderedBureaux[i].id);
        }
        preferences.changeProperty(preferences.paths.BUREAUXORDER, JSON.stringify(array));
    };

    $scope.sort = [];

    $scope.$watch("columns.enabled", function() {
        $scope.sort.length = 0;
        if (!$scope.isEmptyOrNull($scope.columns.enabled)) {
            for (var i = 0; i < $scope.columns.enabled.length; i++) {
                var val = $scope.columns.enabled[i].value;
                if (val !== "actionDemandee" && val !== "bureauName" && val !== "banetteName") {
                    $scope.sort.push($scope.columns.enabled[i]);
                }
            }
        }
    });
}
OptionsController.$inject = ['$scope', '$modal', '$sce', '$rootScope', 'preferences', 'configuration', 'viewService', 'Bureaux', 'Users', 'prefs', '$translate']; // For JS compilers

var ColorationController = function($scope, preferences, $modalInstance, enabledColumns) {
    $scope.tmp = {};
    $scope.properties = enabledColumns;
    var initTmp = function() {
        $scope.tmp = {
            value : "",
            comparator : "="
        }
    };
    initTmp();

    $scope.coloration = {
        test : []
    };

    $scope.removeCondition = function(index) {
        $scope.coloration.test.splice(index, 1);
    };

    $scope.addToTest = function() {
        $scope.coloration.test.push(angular.copy($scope.tmp));
        initTmp();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close($scope.coloration);
    };
};