//Controller for bureau page
function GroupesAdminController($scope, Groupes, utils, modals, usSpinnerService, cache, $filter) {

    $scope.unorderedGroupes = [];
    $scope.saved = false;
    $scope.hasSearchUser = false;
    $scope.groupes = [];
    var baseUsers = [];
    var usersToAdd = [];
    var usersToDelete = [];

    var initGroupes = function() {
        cache.groupes.list().then(function(list) {
            $scope.unorderedGroupes = list;
            angular.forEach($scope.unorderedGroupes, function(value) {
                delete value.child;
                value.selected = undefined;
            });
            $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));
        });
    };

    var groupsShowed = [];

    $scope.$watch("search", function () {
        groupsShowed = [];
    }, true);

    $scope.queryGroups = function(obj) {
        if($scope.search != null) {
            if(~obj.branch["shortName"].toLowerCase().indexOf($scope.search.toLowerCase())) {
                groupsShowed.push(obj.branch["shortName"].toLowerCase());
                return true;
            } else if(obj.branch["parent"] && ~groupsShowed.indexOf(obj.branch["parent"].toLowerCase())) {
                groupsShowed.push(obj.branch["shortName"].toLowerCase());
                return true;
            }
            return false;
        }
        return true;
    };

    initGroupes();

    $scope.selectGroup = function(group) {
        $scope.hasSearchUser = false;
        $scope.saved = false;
        $scope.selectedGroup = new Groupes(angular.copy(group));
        $scope.selectedGroup.$getMembers(function(data) {
            baseUsers = [];
            angular.forEach(data.users, function(value, key) {
                baseUsers.push(value.shortName);
            });
        });
        usersToAdd = [];
        usersToDelete = [];
        $scope.listUsersHandler.getNewList();
    };


    //Suppression du bureau sélectionné
    $scope.deleteGroup = function(group) {
        modals.launch("SimpleConfirmation", {
            title: $filter('translate')('Admin.Groupes.ModGr_Title') + " " + group.shortName,
            message: $filter('translate')('Admin.Groupes.ModGr_Msg') + " " + group.shortName + " ?\n\n" + $filter('translate')('Admin.Groupes.Gr_Del_Info') + ".",
            ctrl: BaseController
        }, function() {
            $scope.selectedGroup = undefined;
            group.$delete(function() {
                for(var i = 0; i < $scope.unorderedGroupes.length; i++) {
                    if($scope.unorderedGroupes[i].id === group.id) {
                        $scope.unorderedGroupes.splice(i, 1);
                        $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));

                    }
                }
            });
        });
    };

    $scope.userAlreadyInGroup = function(item) {
        var toReturn = true;
        if(!$scope.selectedGroup) return true;
        angular.forEach($scope.selectedGroup.users, function(value, key) {
            if(value.shortName === item.username) {
                toReturn = false;
            }
        });
        return toReturn;
    };

    $scope.addUserToGroup = function(user) {
        if(!~baseUsers.indexOf(user.username)) {
            usersToAdd.push(user.username);
        }
        if(~usersToDelete.indexOf(user.username)) {
            usersToDelete.splice(usersToDelete.indexOf(user.username), 1);
        }
        $scope.selectedGroup.users.push({
            shortName: user.username,
            fullName: user.firstName + " " + user.lastName
        });
        $scope.listUsersHandler.getNewList();
    };

    $scope.removeUserFromGroup = function(index) {
        var user = $scope.selectedGroup.users[index];
        if(!($scope.selectedGroup.shortName === 'ALFRESCO_ADMINISTRATORS' && user.shortName.split('@')[0] ==='admin')) {
            if(~baseUsers.indexOf(user.shortName)) {
                usersToDelete.push(user.shortName);
            }
            if(~usersToAdd.indexOf(user.shortName)) {
                usersToAdd.splice(usersToAdd.indexOf(user.shortName), 1);
            }
            $scope.selectedGroup.users.splice(index, 1);
        }
        $scope.listUsersHandler.getNewList();
    };

    var toUpdate;

    var checkSaved = function(updated) {
        toUpdate += updated ? -1 : 0;
        if(toUpdate === 0) {
            $scope.saved = true;
            $scope.saving = false;
            usSpinnerService.stop("spinnerGroups");
        }
    };

    var updateMembers = function() {
        toUpdate = usersToAdd.length + usersToDelete.length;
        checkSaved(false);
        //Mise à jour des membres
        for(var i = 0; i < usersToAdd.length; i++) {
            $scope.selectedGroup.userToChange = usersToAdd[i];
            $scope.selectedGroup.$addUser(function() {
                checkSaved(true);
            });
        }
        for(var j = 0; j < usersToDelete.length; j++) {
            $scope.selectedGroup.userToChange = usersToDelete[j];
            $scope.selectedGroup.$removeUser(function() {
                checkSaved(true);
            });
        }
        $scope.selectedGroup.userToChange = undefined;
    };

    $scope.saveGroup = function() {
        $scope.saving = true;
        $scope.saved = false;
        usSpinnerService.spin("spinnerGroups");
        if($scope.selectedGroup.isNew) {
            //Création du groupe
            $scope.selectedGroup = new Groupes($scope.selectedGroup);
            $scope.selectedGroup.$save(function() {
                updateMembers();
                $scope.selectedGroup.isNew = false;
                $scope.unorderedGroupes.push($scope.selectedGroup);
                $scope.groupes = utils.reorderGroupes(angular.copy($scope.unorderedGroupes));
            });
        } else {
            updateMembers();
        }

    };

    $scope.createGroup = function() {
        $scope.hasSearchUser = false;
        $scope.saved = false;

        baseUsers = [];

        usersToAdd = [];
        usersToDelete = [];

        $scope.saved = false;
        $scope.selectedGroup = {
            shortName: "",
            isNew: true,
            users: []
        };
    };

    var users = [];

    $scope.listUsersHandler = {
        users: [],
        subList : [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.users =  $filter('orderBy')($filter('filter')(users, toSearch), 'lastName');
            this.total = this.users.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.subList = this.users.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize);
        }
    };

    cache.users.list().then(function(list) {
        users = list;
        $scope.listUsersHandler.init();
    });
}
GroupesAdminController.$inject = ['$scope', 'Groupes', 'utils', 'modals', 'usSpinnerService', 'cache', '$filter']; // For JS compilers