/**
 * User: lhameury
 * Date: 20/03/13
 * Time: 14:06
 */

angular.module('appParapheur', ['templates-parapheur', 'angularSpinner', 'ui.ace', 'localize', 'ngTable', 'pascalprecht.translate', 'http-throttler', 'ui.bootstrap', 'LocalStorageModule', 'ngAnimate', 'ngRoute', 'appParapheur.directives', 'ngResource', 'userModule', 'configurationModule', 'viewModule', "socketIO", 'filters', 'utilsModule', 'cacheModule', 'ipModals']).config(function ($translateProvider) {
    $translateProvider.useLoaderCache(true);
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useStaticFilesLoader({
        files: [{
            prefix: urlContext + '/res/javascript/locales/',
            suffix: '.json'
        }]
    });
    $translateProvider.preferredLanguage('fr');
}).config(['$routeProvider', function ($routeProvider) {
    /**
     * Resolution des préférences utilisateur pour chaque route !
     */
    var originalWhen = $routeProvider.when;

    $routeProvider.when = function (path, route) {
        route.resolve || (route.resolve = {});
        angular.extend(route.resolve, {
            prefs: ['$q', 'preferences', function ($q, preferences) {
                var deferred = $q.defer();
                preferences.initPreferences(function (prefs) {
                    deferred.resolve(prefs);
                });
                return deferred.promise;
            }]
        });
        return originalWhen.call($routeProvider, path, route);
    };


    /**
     * Définition des routes
     */
    $routeProvider.when('/logout', {
        templateUrl: 'templates/logout.html',
        controller: LogoutController
    }).when('/bureaux', {
        templateUrl: 'templates/bureaux.html', controller: BureauController, resolve: {
            /**
             * Résolution des bureaux, sélection automatique en cas de bureau unique
             */
            bureaux: ['$q', '$location', '$rootScope', 'navigationService', 'Bureaux', function ($q, $location, $rootScope, navigationService, Bureaux) {
                var deferred = $q.defer();
                $(".pageContent").hide();
                $rootScope.loadingBureaux = true;
                var corbeilleDefined = !!navigationService.currentFilter.dossier;
                var handle = function (listBureaux) {
                    if (listBureaux.length === 1) {
                        if ($location.path() === "/bureaux") {
                            if(!corbeilleDefined) {
                                //Sélection automatique dans 2 secondes
                                if (!listBureaux[0].isSecretaire) {
                                    navigationService.currentFilter.dossier = "a-traiter";
                                } else {
                                    navigationService.currentFilter.dossier = "secretariat";
                                }
                            }
                            navigationService.currentPage = 0;
                            navigationService.hasNext = false;
                            $rootScope.currentBureau = listBureaux[0];
                            navigationService.bureauCourant = listBureaux[0];
                            $location.path("/dashboard");
                        }
                    } else {
                        deferred.resolve(listBureaux);
                    }
                };
                if (!$rootScope.orderedBureaux) {
                    Bureaux.query(function (listBureaux) {
                        handle(listBureaux);
                        $(".pageContent").show();
                        $rootScope.loadingBureaux = false;
                    });
                } else {
                    handle($rootScope.orderedBureaux);
                    $(".pageContent").show();
                    $rootScope.loadingBureaux = false;
                }

                return deferred.promise;
            }]
        }
    }).when('/dashboard/:id/:corbeille', {
        templateUrl: 'templates/dashboard.html', controller: DashboardController, resolve: {
            currentBureau: function ($q, $route, $rootScope, navigationService, Bureaux) {
                var deferred = $q.defer();
                Bureaux.query(function (result) {
                    var idToFind = $route.current.params.id;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id === idToFind) {
                            navigationService.bureauCourant = result[i];
                            $rootScope.currentBureau = result[i];
                            deferred.resolve();
                        }
                    }
                });
                return deferred.promise;
            },
            corbeilleFromMail: function ($route) {
                return $route.current.params.corbeille;
            }
        }
    }).when('/dashboard/:id', {
        templateUrl: 'templates/dashboard.html', controller: DashboardController, resolve: {
            currentBureau: function ($q, $route, $rootScope, navigationService, Bureaux) {
                var deferred = $q.defer();
                Bureaux.query(function (result) {
                    var idToFind = $route.current.params.id;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].id === idToFind) {
                            navigationService.bureauCourant = result[i];
                            $rootScope.currentBureau = result[i];
                            deferred.resolve();
                        }
                    }
                });
                return deferred.promise;
            },
            corbeilleFromMail: function () {
            }
        }
    }).when('/dashboard', {
        templateUrl: 'templates/dashboard.html', controller: DashboardController, resolve: {
            corbeilleFromMail: function () {
            }
        }
    }).when('/archives', {
        templateUrl: 'templates/archives.html',
        controller: ArchivesController
    }).when('/options', {templateUrl: 'templates/options.html', controller: OptionsController}).when('/stats', {
        templateUrl: 'templates/stats.html',
        controller: StatsController
    }).when('/policy', {templateUrl: 'templates/policy.html', controller: PolicyController
    }).when('/about', {templateUrl: 'templates/about.html', controller: AboutController}).when('/apercu/:id', {
        templateUrl: 'templates/apercu.html', controller: ApercuController, resolve: {
            bestBureau: function ($q, $route, $rootScope, navigationService, Dossiers) {
                var deferred = $q.defer();
                navigationService.dossierToEdit = $route.current.params.id;
                navigationService.bureauCourant = Dossiers.bestBureau({
                    id: navigationService.dossierToEdit
                }, function (resp) {
                    var isEmpty = true;
                    for (var i in resp) if (resp.hasOwnProperty(i) && i.indexOf("$")) isEmpty = false;
                    $rootScope.currentBureau = navigationService.bureauCourant;
                    deferred.resolve({error: isEmpty});
                });

                return deferred.promise;
            }
        }
    }).when('/apercu', {
        templateUrl: 'templates/apercu.html', controller: ApercuController, resolve: {
            bestBureau: function ($q) {
                var deferred = $q.defer();
                deferred.resolve({error: false});
                return deferred.promise;
            }
        }
    }).when('/nouveau', {
        templateUrl: 'templates/nouveau.html',
        controller: NouveauController
    }).when('/delegation', {
        templateUrl: 'templates/delegation.html',
        controller: DelegationController
    }).when('/admin', {redirectTo: '/admin/informations'}).when('/admin/informations', {
        templateUrl: 'templates/admin/informations.html',
        controller: InformationsAdminController
    }).when('/admin/utilisateurs', {
        templateUrl: 'templates/admin/utilisateurs.html',
        controller: UtilisateursAdminController
    }).when('/admin/groupes', {
        templateUrl: 'templates/admin/groupes.html',
        controller: GroupesAdminController
    }).when('/admin/bureaux', {
        templateUrl: 'templates/admin/bureaux.html',
        controller: BureauxAdminController
    }).when('/admin/circuits', {
        templateUrl: 'templates/admin/circuits.html',
        controller: CircuitsAdminController
    }).when('/admin/typologie', {
        templateUrl: 'templates/admin/typologie.html',
        controller: TypologieAdminController
    }).when('/admin/dossiers', {
        templateUrl: 'templates/admin/dossiers.html',
        controller: DossiersAdminController
    }).when('/admin/stats', {
        templateUrl: 'templates/admin/stats.html',
        controller: StatsAdminController
    }).when('/admin/avance', {
        templateUrl: 'templates/admin/avance.html',
        controller: AvanceAdminController
    }).when('/admin/script', {
        templateUrl: 'templates/admin/script.html',
        controller: ScriptAdminController
    }).when('/admin/tenants', {
        templateUrl: 'templates/admin/tenants.html',
        controller: TenantAdminController
    }).//when('/admin/workers', {templateUrl: 'templates/admin/workers.html',   controller: WorkersAdminController}).
    when('/admin/nodebrowser', {
        templateUrl: 'templates/admin/nodebrowser.html',
        controller: NodeBrowserAdminController
    }).otherwise({redirectTo: '/bureaux'});
}]).factory("authentication", [
    '$q', function ($q) {
        return {
            response: function (response) {
                if (response.status === 401) {
                    window.onbeforeunload = function () {
                    };
                    document.location.href = urlContext + '/dologin';
                }
                return response || $q.when(response);
            },
            responseError: function (rejection) {
                if (rejection.status === 401 && rejection.config.url.indexOf("pastell-connector") === -1) {
                    window.onbeforeunload = function () {
                    };
                    document.location.href = urlContext + '/dologin';
                }
                return $q.reject(rejection);
            }
        }
    }
]).factory("alertRequest", [
    '$q', function ($q) {
        var currentRequests = 0;
        var responseHandler = function (response) {
            currentRequests--;
            if (currentRequests === 0) {
                window.onbeforeunload = function () {
                };
            }
            return response || $q.when(response);
        };
        var responseHandlerError = function (rejection) {
            currentRequests--;
            if (currentRequests === 0) {
                window.onbeforeunload = function () {
                };
            }
            return $q.reject(rejection);
        };
        return {
            request: function (config) {
                if (currentRequests === 0) {
                    window.onbeforeunload = function (event) {
                        return "ATTENTION ! Une requête est en cours...";
                    };
                }
                currentRequests++;
                return config;
            },
            response: responseHandler,
            responseError: responseHandlerError
        }
    }
]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('authentication');
    $httpProvider.interceptors.push('alertRequest');
    //$httpProvider.interceptors.push('httpThrottler');
}]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
}]);

