//Controller for bureau page
function BureauController($scope, $rootScope, navigationService, prefs, bureaux) {
    "use strict";
    $scope.selectBureau = function (bureau) {
        $rootScope.currentBureau = bureau;
        navigationService.bureauCourant = bureau;
    };

    //Construction des bureaux ordonnés
    if (!$rootScope.orderedBureaux) {
        $rootScope.orderedBureaux = [];
        /** Trust me
         * @namespace prefs.bureauxOrder */
        if (prefs.bureauxOrder !== undefined) {
            var array = JSON.parse(prefs.bureauxOrder),
                added = [],
                i,
                j,
                k;
            //Ajout des bureaux ordonnés
            for (i = 0; i < array.length; i++) {
                for (j = 0; j < bureaux.length; j++) {
                    if (bureaux[j].id === array[i]) {
                        $rootScope.orderedBureaux.push(bureaux[j]);
                        added[j] = true;
                    }
                }
            }
            //Ajout des bureaux non ajoutés
            for (k = 0; k < bureaux.length; k++) {
                if (!added[k]) {
                    $rootScope.orderedBureaux.push(bureaux[k]);
                }
            }
        } else {
            $rootScope.orderedBureaux = bureaux;
        }
    }
}
BureauController.$inject = ['$scope', '$rootScope', 'navigationService', 'prefs', 'bureaux']; // For JS compilers