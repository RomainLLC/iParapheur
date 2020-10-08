//Controller for NodeBrowser page
function NodeBrowserAdminController($scope, $http, configuration) {

    $scope.datatree ={};
    $scope.rootPath = ["/company/home"];

    $http(
        {method: 'GET',
            url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/?children=true&libraryRoot=alfresco://company/home&max=500'
        }
    ).success(function(data) {
        $scope.datatree = data;
        $scope.getNodeProperties(data.parent.nodeRef);
    });

    $scope.getNodeProperties = function(nodeRef) {
        nodeRef = nodeRef.replace("workspace://SpacesStore", "");
        $http(
            {method: 'GET',
                url: configuration.context + '/proxy/alfresco/api/node/workspace/SpacesStore/'+ nodeRef
            }
        ).success(function(datadeux) {
                var xmlDoc;
                if (window.DOMParser)
                {
                    var parser=new DOMParser();
                    xmlDoc=parser.parseFromString(datadeux,"text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async=false;
                    xmlDoc.loadXML(datadeux);
                }
                $scope.objectProps = {};
                for (var node in xmlDoc.getElementsByTagName("properties")) {
                    var propsNodes = xmlDoc.getElementsByTagName("properties")[node].childNodes;
                    for (var n in propsNodes) {
                        if(propsNodes[n].childNodes &&
                            propsNodes[n].childNodes.length) {
                            if(propsNodes[n].childNodes[0].childNodes[0]) {
                                $scope.objectProps[propsNodes[n].getAttribute("displayName")] =
                                    propsNodes[n].childNodes[0].childNodes[0].nodeValue;
                            }
                        }
                    }
                }
            });
    };

    $scope.goToPath = function() {
        var path = $scope.rootPath.join('/');
        $http(
            {method: 'GET',
                url: configuration.context + '/proxy/alfresco/slingshot/doclib/treenode/node/alfresco'+ path +'?children=true&libraryRoot=alfresco://company/home&max=500'
            }
        ).success(function(data) {
            $scope.datatree = data;
            $scope.getNodeProperties(data.parent.nodeRef);
        });
    };

    $scope.selectNode = function(name) {
        $scope.rootPath.push(name);
        $scope.goToPath();
    };

    $scope.goToPathIndex = function(index) {
        $scope.rootPath.splice(index+1,  $scope.rootPath.length);
        $scope.goToPath();
    }
}
NodeBrowserAdminController.$inject = ['$scope', '$http', 'configuration']; // For JS compilers