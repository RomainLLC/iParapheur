/**
 * Created by lhameury on 05/02/15.
 */


var cacheModule = angular.module('cacheModule', []);

cacheModule.factory('cache', ["$q", "Bureaux", "Metadonnees", "Types", "Groupes", "Calques", "Users", function($q, Bureaux, Metadonnees, Types, Groupes, Calques, Users) {
    var bureauxList = [];
    var metaList = {
        true: [],
        false: []
    };
    var typesList = [];
    var groupesList = [];
    var calquesList = [];
    var usersList = [];

    return {
        bureaux: {
            list: function() {
                var deferred = $q.defer();
                if(bureauxList.length === 0) {
                    bureauxList = Bureaux.list(function() {
                        deferred.resolve(bureauxList);
                    });
                } else {
                    deferred.resolve(bureauxList);
                }
                return deferred.promise;
            }
        },
        metadonnees: {
            list: function(asAdmin) {
                var deferred = $q.defer();
                if(metaList[asAdmin].length === 0) {
                    metaList[asAdmin] = Metadonnees.list({asAdmin: asAdmin}, function() {
                        deferred.resolve(metaList[asAdmin]);
                    });
                } else {
                    deferred.resolve(metaList[asAdmin]);
                }
                return deferred.promise;
            },
            forceReload: function() {
                metaList = {
                    true: [],
                    false: []
                };
            }
        },
        calques: {
            list: function() {
                var deferred = $q.defer();
                if(calquesList.length === 0) {
                    calquesList = Calques.list(function() {
                        deferred.resolve(calquesList);
                    });
                } else {
                    deferred.resolve(calquesList);
                }
                return deferred.promise;
            }
        },
        types: {
            list: function() {
                var deferred = $q.defer();
                if(typesList.length === 0) {
                    typesList = Types.list(function() {
                        deferred.resolve(typesList);
                    });
                } else {
                    deferred.resolve(typesList);
                }
                return deferred.promise;
            }
        },
        groupes: {
            list: function() {
                var deferred = $q.defer();
                if(groupesList.length === 0) {
                    groupesList = Groupes.list(function() {
                        deferred.resolve(groupesList);
                    });
                } else {
                    deferred.resolve(groupesList);
                }
                return deferred.promise;
            }
        },
        users: {
            list: function() {
                var deferred = $q.defer();
                if(usersList.length === 0) {
                    usersList = Users.query({search:""}, function() {
                        deferred.resolve(usersList);
                    });
                } else {
                    deferred.resolve(usersList);
                }
                return deferred.promise;
            }
        }
    }
}]);