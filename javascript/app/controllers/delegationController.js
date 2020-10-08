var DelegationController = function($scope, $location, $timeout, Delegations, Bureaux, navigationService) {

    if($.isEmptyObject(navigationService.bureauCourant)) {
        $location.path("/bureaux");
        return;
    }

    var timestamp = new Date().getTime();

    $scope.bureau = new Bureaux(navigationService.bureauCourant);
    $scope.bureau.$associes(function(data) {
        $scope.bureau = data;
    });
    $scope.searchObj = {};
    $scope.saved = false;
    $scope.loaded = false;

    var handleDelegationView = function() {
        //Flag pour check de delegation activée - delegationEnabled statique
        $scope.delegationEnabled = angular.copy(!!$scope.selectedDelegation.idCible);
        $scope.delegationActivated = !!$scope.selectedDelegation.idCible;

        var debut = $scope.selectedDelegation['date-debut-delegation'] ? $scope.selectedDelegation['date-debut-delegation'] : 0;
        var fin = $scope.selectedDelegation['date-fin-delegation'] ? $scope.selectedDelegation['date-fin-delegation'] : Number.MAX_VALUE;

        if(debut < timestamp && fin > timestamp) {
            $scope.when = "present";
        } else if(fin < timestamp) {
            $scope.when = "past";
        } else {
            $scope.when = "future";
        }
    };

    //Get current delegation
    $scope.selectedDelegation = Delegations.get({id:$scope.bureau.id}, function() {
        handleDelegationView();
        if(!!$scope.selectedDelegation.idCible) {
            $scope.selectedBureauForDelegation = {
                id: $scope.selectedDelegation.idCible,
                title: $scope.selectedDelegation.titreCible
            };
        } else {
            $scope.selectedBureauForDelegation = undefined;
        }

        // If begin date is not defined, set it to 'now'
        if(!$scope.selectedDelegation['date-debut-delegation']) {
            $scope.selectedDelegation['date-debut-delegation'] = Date.now();
        }

        $scope.loaded = true;
    });

    //Sélection de la checkbox des délégations possibles
    $scope.checkDelegationPossible = function(checked, id) {
        var indexInArray = $scope.bureau['delegations-possibles'].indexOf(id);
        if(checked && indexInArray == -1) {
            $scope.bureau['delegations-possibles'].push(id);
        } else if(!checked && indexInArray != -1) {
            $scope.bureau['delegations-possibles'].splice(indexInArray, 1);
        }
    };

    $scope.checkDelegation = function(item) {
        if(!!item) {
            $scope.selectedDelegation.idCible = item.id;
        }
        if($scope.selectedDelegation.idCible && ($scope.selectedDelegation['date-debut-delegation'] || $scope.selectedDelegation['date-fin-delegation'])) {
            if($scope.selectedDelegation['date-fin-delegation']) {
                //On Décale la date de fin à 23h59... Pour prendre en compte la fin de journée sans devoir sélectionner le jour suivant
                var fin =  new Date($scope.selectedDelegation['date-fin-delegation']);
                $scope.selectedDelegation['date-fin-delegation'] = new Date(fin.getFullYear(), fin.getMonth(), fin.getDate(), 23, 59, 0, 0).getTime();
            }
            $scope.selectedDelegation.$willItLoop();
        }
    };

    $scope.save = function() {
        $scope.selectedDelegation;
        //Le décalage de la date de fin a été fait lors de la vérification de boucle
        //Mise à jour de la délégation
        Delegations.update({id:$scope.bureau.id}, $scope.selectedDelegation, function() {
            $scope.saved = true;
            $timeout(function() {
                $scope.saved = false;
            }, 5000);
            handleDelegationView();
        });
    }
};
DelegationController.$inject = ['$scope', '$location', '$timeout', 'Delegations', 'Bureaux', 'navigationService']; // For JS compilers
