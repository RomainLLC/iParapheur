//Controller for about page
function AboutController($scope, modals) {

    var javaVersion = PluginDetect.getVersion("Java");

    var isWindows = navigator.platform.indexOf('Win') > -1;
    var isLinux = navigator.platform.indexOf('Linux') > -1;

    var isEdge = window.navigator.userAgent.indexOf("Edge") > -1;
    var isIE = navigator.browserInfo()[0].toLowerCase().indexOf('explorer') > -1;

    var isChrome = navigator.browserInfo()[0].toLowerCase().indexOf('chrome') > -1 && !isEdge;
    var isFirefox = navigator.browserInfo()[0].toLowerCase().indexOf('firefox') > -1;

    $scope.navigator = isEdge ? ["Edge"] : navigator.browserInfo();
    
    $scope.client = {
        signature: {
            isCompatible: (isWindows && !isEdge) || (isLinux && isFirefox),
            canExtension: isWindows && !isEdge && !isIE && (isFirefox || isChrome),
            canJava: (isWindows && (isIE || isFirefox)) || (isLinux && isFirefox),
            isIE: isIE,

            extension: false,
            version: "",
            error: ""
        },
        java: {
            enabled: javaVersion !== null,
            version: javaVersion !== null ? javaVersion.replace(/,/g, '.') : ""
        }
    };

    window.addEventListener('libersignready', function () {
        testForLiberSign();
    });

    var testForLiberSign = function () {
        // Si l'objet LiberSign est défini, l'extension chrome est installée
        if (typeof LiberSign === "object") {
            $scope.client.signature.extension = true;
            LiberSign.getVersion().then(function (version) {
                $scope.$apply(function () {
                    $scope.client.signature.version = version;
                });
            }).catch(function (error) {
                console.log(error);
                $scope.$apply(function () {
                    $scope.client.signature.error = error.result;
                });
            });
        }
    };
    testForLiberSign();

    $scope.launchHelpModal = function () {
        modals.launch("base", {
            ctrl: HelpExtensionController,
            template: 'partials/modals/extensionHelpModal.html'
        });
    };
}
AboutController.$inject = ['$scope', 'modals']; //For JS compilers

var HelpExtensionController = function ($scope, $modalInstance, title, message) {
    $scope.title = title;
    $scope.message = message;

    $scope.navigator = navigator.browserInfo()[0];

    $scope.installFFExtension = function () {
        var params = {
            "LiberSign": {
                URL: $scope.properties['parapheur.extension.libersign.firefox.url'],
                toString: function () {
                    return this.URL;
                }
            }
        };
        InstallTrigger.install(params);
    };

    $scope.testExtension = function () {
        location.reload();
    };

    $scope.ok = function () {
        $modalInstance.close();
    };
};
