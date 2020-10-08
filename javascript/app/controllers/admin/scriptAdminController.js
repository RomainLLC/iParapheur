//Controller for bureau page
function ScriptAdminController($scope, $http, configuration) {
    $scope.readOnly = true;
    $scope.runas = "admin";
    $scope.script = "";
    $scope.template = "${mjson}";
    $scope.renderedTemplate = "";
    $scope.printOutput = [];

    $scope.tenantList = [];
    $scope.selectedTenant = null;

    $scope.scriptError = false;

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/?children=false&libraryRoot=alfresco://company/home&max=500'
        }
    ).success(function(data) {
        $scope.spaceNodeRef = data.parent.nodeRef;
    });

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/de/fme/jsconsole/spacesroot'
        }
    ).success(function(data) {
            $scope.tenantList = data;
        });

    $scope.sendScript = function() {
        $scope.scriptError = false;
        $scope.renderedTemplate = "";
        $http.post(configuration.context + '/proxy/alfresco/de/fme/jsconsole/execute', {
            "context": {},
            "script": $scope.script,
            "template": $scope.template,
            "transaction" : !$scope.readOnly,
            "urlargs": "",
            "spaceNodeRef": $scope.selectedTenant ? $scope.selectedTenant.node : $scope.spaceNodeRef,
            "documentNodeRef": "",
            "runas" : $scope.runas + ($scope.selectedTenant ? "@"+$scope.selectedTenant.name : "")
        }).success(function(data) {
            $scope.renderedTemplate = data.renderedTemplate;
            $scope.printOutput = data.printOutput;
        }).error(function(data) {
            $scope.renderedTemplate = data.renderedTemplate;
            $scope.printOutput = data.printOutput;
            $scope.scriptError = true;
        });
    }

}
ScriptAdminController.$inject = ['$scope', '$http', 'configuration']; // For JS compilers