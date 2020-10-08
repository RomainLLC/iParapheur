/**
 * User: lhameury
 * Date: 27/03/13
 * Time: 11:11
 */

angular.module('filters', []).
filter('bash', function ($sce) {
    return function (text) {
        if (text) {
            text = text.replace(/\n/g, '<br/>').replace(/ /g, '&nbsp;');
            return $sce.trustAsHtml(text);
        }
        return "";

    }
}).
filter('orderObjectById', function () {
    return function (items, reverse) {
        var filtered = [];
        angular.forEach(items, function (val, id) {
            filtered.push({value: val, id: id});
        });
        filtered.sort(function (a, b) {
            return (a.value.toLowerCase() > b.value.toLowerCase() ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
}).
    //Transformation de texte en date
    filter('texttodate', function () {
        return function (input) {
            if(input) {
                return new Date(input);
            }
            return "";
        };
    }).
    filter('toUTC', function() {
        return function (input) {
            if(input) {
                var date = new Date(input);
                return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            }
            return "";
        };
    }).
    filter('endwith', function() {
        return function (input, suffix) {
            if(input) {
                return input.indexOf(suffix, input.length - suffix.length) !== -1;
            }
            return true;
        };
    }).
    filter('contains', function() {
        return function (input, separator) {
            if(input) {
                return ~input.indexOf(separator);
            }
            return true;
        };
    }).
    filter('encodeURIComponent', function() {
        return function(input) {
            return encodeURIComponent(input);
        }
    }).
    //Remplacement de charactères passé en paramètre
    filter('replaceChar', function() {
        return function (input, charFrom, charTo) {
            if(input) {
                return input.replace(charFrom, charTo);
            }
            return "";
        }
    }).
    //Capitalise texte
    filter('capitalize', function() {
        return function(input) {
            if(input) {
                return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
            }
            return "";
        }
    }).
    //Utilisation de l'i18n
    filter('i18n', function () {
        return function (input) {
            if(input) {
                return $.t(input);
            }
            return "";
        };
    }).
    //Séparation avec séparateur
    filter('split', function () {
        return function (input, separator) {
            if(input) {
                return input.split(separator);
            }
            return "";
        };
    }).
    //Récupération d'une extension de fichier
    filter('fileext', function () {
        return function (input) {
            var ext = /^.+\.([^.]+)$/.exec(input);
            return ext === null ? "" : ext[1].toLowerCase();
        }
    }).
    //Transforme un array en string avec séparateur
    filter('array2string', function () {
        return function (input, separator) {
            var ret = "";
            if(input && input.length > 0) {
                ret += input[0];
                for(var i = 1; i < input.length; i++) {
                    ret += separator + input[i];
                }
            }
            return ret;
        }
    }).
    //Transforme un objet en string avec séparateur
    filter('object2string', function () {
        return function (input, separator, property) {
            var ret = "";
            if(input) {
                var keys = Object.keys(input);
                if(keys.length > 0) {
                    ret += input[keys[0]][property];
                    for(var i = 1; i < keys.length; i++) {
                        ret += separator + input[keys[i]][property];
                    }
                }
            }
            return ret;
        }
    }).
    //Transforme un objet en string avec séparateur
    filter('mergeArrays', function () {
        return function (input, property) {
            var ret = [];
            if(input && input.length > 0) {
                ret = ret.concat(input[0][property]);
                for(var i = 1; i < input.length; i++) {
                    ret = ret.concat(input[i][property]);
                }
            }
            return ret.filter(function(elem, pos, self) {
                return self.indexOf(elem) == pos;
            });
        }
    }).
    //Intersection sur array dans objet
    filter('intersectionOnProperty', function () {
        return function (input, property) {
            var ret = [];
            if(input && input.length > 0) {
                ret = input[0][property];
                for(var i = 1; i < input.length; i++) {
                    var r = input[i][property];
                    ret = $.arrayIntersect(ret, r);
                }
            }
            return ret;
        }
    }).
    //Permet de filtrer sur une liste de bureaux afin d'enlever, dans le retour, le bureau passé en parametre
    filter('getNameWithId', function () {
        return function (input, list) {
            var found = false;
            var title = "";
            angular.forEach(list, function(value, key) {
                if(value.id == input) {
                    title = value.title;
                    found = true;
                }
            });
            if(!title) {
                title = "Emetteur...";
            }
            return title;

        }
    }).
    filter('contains', function() {
       return function(input, string) {
           var filters_str = string.split(' ');

           if(typeof input === "string") {
               return input.indexOf(string) !== -1;
           }
           return input.filter(function(element, index, array) {
               var contains_all = true;
               for(var i = 0; i < filters_str.length; i++) {
                   if(element.name.toLowerCase().indexOf(filters_str[i].toLowerCase()) === -1) {
                       contains_all = false;
                       break;
                   }
               }
               return contains_all;
           });
       }
    }).
    //Permet de trouver l'enfant d'id donné
    filter('findWithId', function () {
        return function (input, id) {
            var ret = {};
            angular.forEach(input, function(value, key) {
                if(value.id == id) {
                    ret = value;
                }
            });
            return ret;
        }
    }).
    //Permet de récupérer un titre à partir d'un ID
    filter('notSameId', function () {
        return function (input, id) {
            var toRet = [];
            angular.forEach(input, function(value, key) {
                if(Object.prototype.toString.call( id ) == "[object Array]") {
                    if(id.indexOf(value.id) === -1) {
                        toRet.push(value);
                    }
                } else {
                    if(value.id != id) {
                        toRet.push(value);
                    }
                }
            });
            return toRet;

        }
    }).
    //Permet de filtrer sur une liste de bureaux afin de ne laisser que les bureaux passés en paramètre
    filter('sameId', function () {
        return function (input, idArray) {
            var toRet = [];
            angular.forEach(input, function(value, key) {
                if(idArray) {
                    if(idArray.indexOf(value.id) !== -1) {
                        toRet.push(value);
                    }
                }
            });
            return toRet;

        }
    }).
    //Permet de filtrer sur une liste de bureaux afin de ne laisser que les bureaux passés en paramètre
    filter('notSameIdInArray', function () {
        return function (input, idArray) {
            var toRet = [];
            var i = 0;
            angular.forEach(input, function(value, key) {
                if(idArray) {
                    var contains = false;
                    angular.forEach(idArray, function(walue, jey) {
                        if(walue.id === value.id) {
                            contains = true;
                        }
                    });
                    if(!contains) {
                        toRet[i++] = value;
                    }
                }
            });
            return toRet;

        }
    }).
    //Permet de filtrer sur une liste de bureaux afin d'enlever, dans le retour, les enfants de ce bureau
    filter('notChild', function () {
        return function (input, id) {
            var toRet = [];
            var mapHierarchie = {};
            var checkParent = function(value) {
                if(value) {
                    if(value.hierarchie) {
                        if(value.hierarchie !== id) {
                            checkParent(mapHierarchie[value.hierarchie]);
                        } else {
                            return false;
                        }
                    }
                }
                return true;
            };
            angular.forEach(input, function(value, key) {
                mapHierarchie[value.id] = value;
            });
            angular.forEach(input, function(value, key) {
                if(checkParent(value)) {
                    toRet.push(value);
                }
            });
            return toRet;
        }
    }).
    // Filtre angular avec vérification pour ne pas prendre en compte les ID
    filter('customfilter', function () {
        function isArray(value) {
            return Object.prototype.toString.call(value) === '[object Array]';
        }

        return function(array, expression, comparator) {
            if (!isArray(array)) return array;

            var comparatorType = typeof(comparator),
                predicates = [];

            predicates.check = function(value) {
                for (var j = 0; j < predicates.length; j++) {
                    if(!predicates[j](value)) {
                        return false;
                    }
                }
                return true;
            };

            if (comparatorType !== 'function') {
                if (comparatorType === 'boolean' && comparator) {
                    comparator = function(obj, text) {
                        console.log(obj);
                        return angular.equals(obj, text);
                    };
                } else {
                    comparator = function(obj, text) {
                        if (obj && text && typeof obj === 'object' && typeof text === 'object') {
                            for (var objKey in obj) {
                                if (objKey.charAt(0) !== '$' && hasOwnProperty.call(obj, objKey) &&
                                    comparator(obj[objKey], text[objKey])) {
                                    return true;
                                }
                            }
                            return false;
                        }
                        text = (''+text).toLowerCase();
                        return (''+obj).toLowerCase().indexOf(text) > -1 && !(''+obj).match(/([A-Za-z0-9]{8}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}-[A-Za-z0-9]{12})/g);
                    };
                }
            }

            var search = function(obj, text){
                if (typeof text === 'string' && text.charAt(0) === '!') {
                    return !search(obj, text.substr(1));
                }
                switch (typeof obj) {
                    case 'boolean':
                    case 'number':
                    case 'string':
                        return comparator(obj, text);
                    case 'object':
                        switch (typeof text) {
                            case 'object':
                                return comparator(obj, text);
                            default:
                                for ( var objKey in obj) {
                                    if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
                                        return true;
                                    }
                                }
                                break;
                        }
                        return false;
                    case 'array':
                        for ( var i = 0; i < obj.length; i++) {
                            if (search(obj[i], text)) {
                                return true;
                            }
                        }
                        return false;
                    default:
                        return false;
                }
            };
            switch (typeof expression) {
                case 'boolean':
                case 'number':
                case 'string':
                    // Set up expression object and fall through
                    expression = {$:expression};
                // jshint -W086
                case 'object':
                    // jshint +W086
                    for (var key in expression) {
                        (function(path) {
                            if (typeof expression[path] === 'undefined') return;
                            predicates.push(function(value) {
                                return search(path == '$' ? value : (value && value[path]), expression[path]);
                            });
                        })(key);
                    }
                    break;
                case 'function':
                    predicates.push(expression);
                    break;
                default:
                    return array;
            }
            var filtered = [];
            for ( var j = 0; j < array.length; j++) {
                var value = array[j];
                if (predicates.check(value)) {
                    filtered.push(value);
                }
            }
            return filtered;
        };
    });