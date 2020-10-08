//Controller for navbar
function NavbarController($rootScope, $route, $location, configuration, navigationService, preferences, viewService, notifications, utils, $http, $timeout, $filter) {
    $rootScope.isLoggedIn = navigationService.isLoggedIn;
    //Définition configuration (pour affichage icones admins)
    $rootScope.config = configuration;
    //Définition fichier de propriétés
    $rootScope.properties = configuration.properties;
    $rootScope.updateProperties = function(p) {
        $rootScope.properties = p;
        configuration.properties = p;
    };
    //Bureau en cours
    $rootScope.currentBureau = navigationService.bureauCourant;
    //Context de l'application
    $rootScope.context = configuration.context;
    //Nom de la page actuelle, pour icone 'active'
    $rootScope.pagename = function() {
        return $location.path();
    };
    //initialisation helpers rootscope
    $rootScope.empty = function(value) {
        return $.isEmptyObject(value);
    };

    $rootScope.isEmptyOrNull = function(value) {
        return !value || $.isEmptyObject(value);
    };

    $rootScope.log = function(toLog) {
        console.log(toLog);
    };
    //Preferences
    $rootScope.prefs = preferences.initPreferences();
    //Flags for view
    $rootScope.flags = viewService.flags;
    $rootScope.cleanCurrentDossier = function() {
        navigationService.dossierToEdit = undefined;
    };
    $rootScope.redirectToNew = function() {
        $location.path("/nouveau");
    };
    $rootScope.extension = function(file) {
        var ext = /^.+\.([^.]+)$/.exec(file);
        return ext === null ? "" : ext[1];
    };
    $rootScope.inArray = function(element, array) {
        return $.inArray(element, array) !== -1;
    };
    $rootScope.logout = function() {
        $rootScope.isLoggedIn = false;
        navigationService.isLoggedIn = false;
        navigationService.hasToReset = true;
    };
    $rootScope.login = function() {
        $rootScope.isLoggedIn = true;
        navigationService.isLoggedIn = true;
        navigationService.hasToReset = false;
        $location.path("/bureaux");
    };

    $rootScope.showBrand = true;
    $rootScope.logoLoaded = function() {
        $rootScope.showBrand = false;
    };

    //Binding
    $rootScope.showedNotifs = false;
    $rootScope.events = {};

    var eventsBureau = {
        success : {
            "a-traiter" : [],
            "en-preparation" : [],
            traite : [],
            "retournes" : [],
            "a-archiver" : [],
            archive : []
        },
        error : []
    };

    $rootScope.unread = 0;

    notifications.emit('binding', {userName: configuration.username});
    notifications.on('message', function(data) {
        var obj = $.parseJSON(data);
        $rootScope.$broadcast('notificationReceived', obj);
    });

    var errortask;

    //Pour mise à jour
    $rootScope.$on('notificationReceived', function(event, obj) {

        if(Object.keys($rootScope.events).indexOf(obj.bureauId) === -1) {
            $rootScope.events[obj.bureauId] = {};
            angular.extend($rootScope.events[obj.bureauId], angular.copy(eventsBureau));
        }

        //handleMessage(obj);

        if($rootScope.orderedBureaux) {
            for (var i = 0; i < $rootScope.orderedBureaux.length; i++) {
                if(obj.bureauId === $rootScope.orderedBureaux[i].id && obj.state !== "ERROR") {
                    handleMessageBureau(obj, $rootScope.orderedBureaux[i]);
                }
            }
        } else {
            if(obj.bureauId === navigationService.bureauCourant.id && obj.state !== "ERROR") {
                handleMessageBureau(obj, navigationService.bureauCourant);
            }
        }
        if(obj.state === "ERROR") {
            if(obj.action !== "TRANSFORM" && obj.action !== "GET_ATTEST") {
                $timeout.cancel(errortask);
                $rootScope.errorNotification = angular.copy(obj);

                if (!isNaN($rootScope.errorNotification.message)) {
                    $rootScope.errorNotification.message = $filter('translate')('ErrorCodes.' + $rootScope.errorNotification.message);
                }

                errortask = $timeout(function() {
                    $rootScope.errorNotification = {};
                }, 5000);
            }
        }
    });

    $rootScope.showFiltersWindow = function() {
        $timeout(function() {
            $rootScope.$broadcast("fixbottom");
        }, 400);
    };

    $rootScope.stopErrorTask = function() {
        $timeout.cancel(errortask);
    };

    $rootScope.startErrorTask = function() {
        errortask = $timeout(function() {
            $rootScope.errorNotification = {};
        }, 5000);
    };

    $rootScope.errorNotification = {};

    var handleMessageBureau = function(obj, bureau) {
        //Handle bureau
        var toAdd = obj.state === "NEW" ? 1 : obj.state === "END" ? -1 : 0;
        for(var i = 0; i < obj.banettes.length; i++) {
            bureau[obj.banettes[i]] += toAdd;
        }

        //Comparaison au niveau de a clé, en cas de non égalité des objets
        if($rootScope.currentBureau !== bureau) {
            //handleMessage(obj, false);
        }
    };


    var handleCorbeilleMessage = function(obj, corbeille) {
        if(~obj.banettes.indexOf(corbeille)) {
            if(obj.state === "NEW") {
                if(obj.bureauId === $rootScope.currentBureau.id) {
                    $rootScope.currentBureau[corbeille]++;
                }
            } else if(obj.state === "END") {
                if(obj.bureauId === $rootScope.currentBureau.id) {
                    $rootScope.currentBureau[corbeille]--;
                }
            }
        }
    };

    var handleMessage = function(obj) {
        if(obj.state !== "ERROR") {
            //SUCCESS
            handleCorbeilleMessage(obj, 'en-preparation');
            handleCorbeilleMessage(obj, 'secretariat');
            handleCorbeilleMessage(obj, 'a-traiter');
            handleCorbeilleMessage(obj, 'a-archiver');
            handleCorbeilleMessage(obj, 'retournes');
        }
    };

    $rootScope.asyncSelected = {title:""};

    $rootScope.selectAsyncDossier = function(model) {
        if ($rootScope.pagename() === "/archives") {
            navigationService.currentFilterArchive = {title:model.title};
            $route.reload();
        }
        else {
            var newPath = "/apercu/" + model.id;
            if($location.path() === newPath) {
                $route.reload();
            } else {
                $location.path(newPath);
            }
        }

    };


    /**
     * Fonction principale de la page de dashboard
     * Récupération de dossiers
     */
    var hasRequested = false;
    var task;
    $rootScope.getDossiersNavbar = function(viewValue) {
        var launchRequest = function() {
            return $timeout(function() {
                var resource;
                if ($rootScope.pagename() === "/archives") {
                    resource = "archives";
                }
                else {
                    resource = "dossiers";
                }
                //Récupération des dossiers ou archives
                return $http({
                    url: configuration.context + '/proxy/alfresco/parapheur/' + resource,
                    method: 'GET',
                    params: {
                        pageSize : 5,
                        page : 0,
                        skipped : 0,
                        sort : "cm:title",
                        asc : true,
                        filter : utils.generateFilter({title: viewValue}),
                        metas : {metas : []}
                    }
                }).then(function(response) {
                    hasRequested = false;
                    return response.data;
                });
            }, 500);
        };

        if(!hasRequested) {
            hasRequested = true;
            task = launchRequest();
        } else {
            $timeout.cancel(task);
            task = launchRequest();
        }
        return task.then(function(data) {
            return data;
        });
    };

    $rootScope.$on("$locationChangeStart", function(event, next, current) {
        var currentLocation = current.substr(current.lastIndexOf('/') + 1);
        var nextLocation = next.substr(next.lastIndexOf('/') + 1);
        if ((currentLocation !== nextLocation) && ((currentLocation === "archives") || (nextLocation === "archives"))) {
            $rootScope.asyncSelected = {title:""};
        }
    });
}
NavbarController.$inject = ['$rootScope', '$route', '$location', 'configuration', 'navigationService', 'preferences', 'viewService', 'notifications', 'utils', '$http', '$timeout',  '$filter']; // For JS compilers

//Controller for navbar
function MainController($rootScope) {
    $rootScope.themeSelected = userTheme;
}
MainController.$inject = ['$rootScope']; // For JS compilers