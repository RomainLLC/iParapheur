//Controller for informations page
function InformationsAdminController($scope, $rootScope, $interval, $location, $http, $filter, configuration, Office, Tenants, Attestation, Xemelios, $modal) {

    $scope.Math = window.Math;
    $scope.infos = {};
    $scope.reload = {};
    $scope.isTenant = (configuration.tenant !== "") && (($rootScope.isMTEnabled != undefined) && ($rootScope.isMTEnabled == true));

    var initReload = function () {
        $scope.reload = {
            all: false,
            properties: false,
            errorProperties: false,
            xemelios: false,
            office: false,
            errorOffice: false
        };
    };

    var loadInfos = function (success) {
        $http({method: 'GET', url: configuration.context + '/informations'}).
        then(function (data) {
            $scope.infos = data.data;
            buildMemChart(data.data);
            buildDiskChart(data.data);
            checkXemeliosStatus(success);
            $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/utilisateurs/connected'}).
            then(function (data) {
                $scope.infos.users = data.data;
            });
            Office.get(function (result) {
                $scope.infos.office = result;
            });
        });
        Attestation.get(function (result) {
            result.port = +result.port;
            $http({
                method: 'POST',
                url: configuration.context + "/attestStatus",
                data: result
            }).then(function (response) {
                $scope.infos.isASEnabled = response.data.isASEnabled;
            });
        });
    };

    $scope.memChartData = [];
    $scope.diskChartData = [];

    var buildMemChart = function (data) {
        $scope.memChartData.length = 0;
        $scope.memChartData.push({
            y: Math.round(data.freeMem / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Free'),
            percent: Math.round(data.freeMem * 100 / data.maxMem)
        });
        $scope.memChartData.push({
            y: Math.round((data.maxMem - data.freeMem) / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Occ'),
            percent: 100 - Math.round(data.freeMem * 100 / data.maxMem)
        });
    };

    var buildDiskChart = function (data) {
        $scope.diskChartData.length = 0;
        $scope.diskChartData.push({
            y: Math.round(data.usableSpace / 1024 / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Free'),
            percent: Math.round(data.usableSpace * 100 / data.totalSpace)
        });
        $scope.diskChartData.push({
            y: Math.round((data.totalSpace - data.usableSpace) / 1024 / 1024 / 1024),
            name: $filter('translate')('Admin.Informations.Info_Occ'),
            percent: 100 - Math.round(data.usableSpace * 100 / data.totalSpace)
        });
    };

    var xemeliosPid = "";
    var checkXemeliosStatus = function (success) {
        Xemelios.get(function (response) {
            angular.extend($scope.infos, response);
            $scope.reload.xemelios = false;
            if (typeof success === 'function') {
                success();
            }
        });
    };

    $scope.reloadProperties = function (success) {
        initReload();
        $http({method: 'GET', url: configuration.context + '/reloadProperties'}).
        then(function (data) {
            $scope.updateProperties(data.data);
            $scope.infos.isPropertiesFound = data.data.found;
            if ($scope.infos.isPropertiesFound) {
                $scope.reload.properties = true;
            } else {
                $scope.reload.errorProperties = true;
            }
            if (typeof success === 'function') {
                success();
            }
        });
    };

    $scope.reloadInfos = function () {
        initReload();
        loadInfos(function () {
            var oldFound = $scope.infos.isPropertiesFound;
            $scope.reloadProperties(function () {
                $scope.reload.all = true;
                $scope.reload.properties = oldFound ? false : $scope.infos.isPropertiesFound;
                $scope.reload.errorProperties = oldFound ? !$scope.infos.isPropertiesFound : false;
            });
        });
    };

    $scope.restartOffice = function () {
        initReload();
        Office.restart(function (data) {
            if (data) {
                $scope.reload.office = true;
            } else {
                $scope.reload.errorOffice = true;
            }
        });
    };

    $scope.restartXemelios = function () {
        $scope.reload.xemelios = true;
        // Reload, and wait for new PID

        Xemelios.status(function (pid) {
            xemeliosPid = pid.status;
            Xemelios.restart(function () {
                var promiseInterval;

                var stopCheck = function () {
                    if (angular.isDefined(promiseInterval)) {
                        $interval.cancel(promiseInterval);
                        promiseInterval = undefined;
                    }
                };

                // Wait for 2 same pid... Because reasons
                var newPid;
                // We reload xemelios... Every 2 seconds, check for new PID !
                promiseInterval = $interval(function () {
                    Xemelios.status(function (response) {
                        if (response.status && response.status !== xemeliosPid) {
                            if (newPid === response.status) {
                                xemeliosPid = newPid;
                                checkXemeliosStatus();
                                stopCheck();
                            } else {
                                newPid = response.status;
                            }
                        }
                    });
                }, 2000);
            });
        });
    };

    $scope.launchHealthStatus = function () {
        $modal.open({
            templateUrl: 'partials/modals/healthModal.html',
            controller: HealthController
        });
    };

    if (!configuration.isAdmin) {
        if (configuration.isAdminCircuits() && !configuration.isAdminFonctionnel()) {
            $location.path("/admin/circuits");
        } else if (configuration.isAdminFonctionnel()) {
            $location.path("/admin/bureaux");
        } else {
            $location.path("/bureaux");
        }
    } else {
        if ($rootScope.isMTEnabled == undefined) {
            Tenants.isEnabled(function (data) {
                // En rootScope, il faut garder l'information pour les autres pages !
                $rootScope.isMTEnabled = data.mtEnabled;
                $scope.isTenant = ($rootScope.isMTEnabled == true) && (configuration.tenant !== "");
            });
        }

        initReload();
        loadInfos();
    }
}
InformationsAdminController.$inject = ['$scope', '$rootScope', '$interval', '$location', '$http', '$filter', 'configuration', 'Office', 'Tenants', 'Attestation', 'Xemelios', '$modal']; // For JS compilers

var HealthController = function ($scope, $modalInstance, $http, configuration, $rootScope) {

    $scope.isTenant = ($rootScope.isMTEnabled == true) && (configuration.tenant !== "");

    var getHealth = function () {
        // For Xemelios, check service AND pid
        $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/exploit/health'}).
        then(function (data) {
            $scope.health = data.data;
        });
    };

    getHealth();

    $scope.reload = {
        launchCount: false
    };

    $scope.messages = {
        regenerate: {
            success : false,
            error : false
        }
    };

    $scope.regenerateCount = function() {
        $scope.reload.launchCount = true;
        $scope.messages.success = false;
        $scope.messages.error = false;
        $http({method: 'GET', url: configuration.context + '/proxy/alfresco/parapheur/corbeilles/regenerateCount'}).
        success(function () {
            $scope.reload.launchCount = false;
            $scope.messages.success = true;
        }).error(function(error) {
            console.warn(error);
            $scope.reload.launchCount = false;
            $scope.messages.error = true;
        });
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};