//Controller for bureau page
function DossiersAdminController($scope, $filter, modals, Dossiers, ngTableParams, usSpinnerService, cache) {
    cache.bureaux.list().then(function(bureaux) {
        $scope.bureaux = bureaux;
    });
    cache.types.list().then(function(list) {
        $scope.types = list;
    });
    $scope.dossiersShowed = {};
    $scope.opt = {
        bureau: undefined,
        type: "",
        sousType: "",
        title: "",
        showOnlyCurrent: false,
        showOnlyLate: false
    };
    $scope.noneOpt = angular.copy($scope.opt);

    $scope.hasFoundFolder = true;

    $scope.buttonsDisabled = false;
    $scope.hasSearch = false;

    $scope.getDossiers = function(opt) {
        $scope.buttonsDisabled = true;
        $scope.hasFoundFolder = true;
        $scope.hasSearch = true;

        var localOpt = angular.copy(opt);
        if(localOpt && localOpt.bureau) {
            localOpt.bureau = localOpt.bureau.id;
        }

        usSpinnerService.spin("spinnerDossiers");

        $scope.dossiers = Dossiers.listAsAdmin(localOpt, function() {

            usSpinnerService.stop("spinnerDossiers");

            buildTable();

            $scope.hasFoundFolder = $scope.dossiers.length > 0;

            $scope.buttonsDisabled = false;
        })
    };

    var buildTable = function() {
        if(!$scope.tableParams) {
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.dossiers, params.orderBy()) :
                        $scope.dossiers;
                    params.total($scope.dossiers.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.reload();
        }
    };

    $scope.viewJournal = function(dossier) {
        modals.launch("JOURNAL", function() {
            return [dossier];
        });
    };

    $scope.viewProperties = function(dossier) {
        modals.launch("PROPERTIES", function() {
            return [dossier];
        });
    };

    $scope.confirmDelete = function(dossier) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Dossiers.Mod_Del') + " " + dossier.title,
            message: $filter('translate')('Admin.Dossiers.Mod_Del_Mess') + " " + dossier.title + " ?",
            ctrl: BaseController
        }, function() {
            var id = dossier.id;
            dossier.$destroy();
            for(var i = 0; i < $scope.dossiers.length; i++) {
                var d = $scope.dossiers[i];
                if(d.id === id) {
                    $scope.dossiers.splice(i, 1);
                }
            }
            buildTable();
        });
    };

    $scope.unlock = function(dossier) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Dossiers.Mod_Unlock') + " " + dossier.title,
            message: $filter('translate')('Admin.Dossiers.Mod_Unlock_Mess') + " " + dossier.title + " ?",
            ctrl: BaseController
        }, function() {
            var id = dossier.id;
            dossier.$unlock();
            for(var i = 0; i < $scope.dossiers.length; i++) {
                var d = $scope.dossiers[i];
                if(d.id === id) {
                    $scope.dossiers[i].locked = false;
                }
            }
            buildTable();
        });
    };

    $scope.confirmTransfert = function(dossier) {
        modals.launch("MOVE", function() { return [dossier];});
    };

    $scope.getStateName = function(banette) {
        var r = "";
        switch(banette) {
            case "Dossiers en fin de circuit": r = $filter('translate')('Admin.Dossiers.State_App'); break;
            case "Dossiers à relire - annoter": r = $filter('translate')('Admin.Dossiers.State_Sec'); break;
            case "Dossiers à traiter": r = $filter('translate')('Admin.Dossiers.State_Cur'); break;
            case "Dossiers à transmettre": r = $filter('translate')('Admin.Dossiers.State_Prep'); break;
            case "Dossiers retournés": r = $filter('translate')('Admin.Dossiers.State_Rej'); break;
        }
        return r;
    };

    $scope.isEnCours = function(banette) {
        return banette !== "Dossiers en fin de circuit" && banette !== "Dossiers retournés";
    };

    $scope.isUnlockable = function(dossier) {
        var timeout = +$scope.properties["parapheur.ihm.admin.dossier.locked.notify"] || 600;
        /** @namespace dossier.modified */
        return Math.floor((+new Date - dossier.modified) / 1000) > timeout && dossier.locked;
    }
}
DossiersAdminController.$inject = ['$scope', '$filter', 'modals', 'Dossiers', 'ngTableParams', 'usSpinnerService', 'cache']; // For JS compilers

var MoveDossierController = function($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};

