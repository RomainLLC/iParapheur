/**
 * User: lhameury
 * Date: 28/03/13
 * Time: 17:13
 */

var utilsModule = angular.module('utilsModule', []);

utilsModule.factory('utils', [function() {
        return {
            diff : function(base, edited) {
                var type = typeof edited;
                if(type === "string" || type === "boolean") {
                    if(base !== edited) {
                        return edited;
                    }
                } else if (edited instanceof Array) {
                    if (!this.isArrayEqual(base, edited)) {
                        return edited;
                    }
                } else if (type === "object") {
                    if ($.isEmptyObject(base) || $.isEmptyObject(edited)) {
                        if (!($.isEmptyObject(base) && $.isEmptyObject(edited))) {
                            return edited;
                        }
                    }
                    else {
                        var newObj = {};
                        var keys = Object.keys(edited);
                        for(var i = 0; i < keys.length; i++) {
                            if(keys[i].substring(0,1) !== "$") {
                                var obj = this.diff(base[keys[i]], edited[keys[i]]);
                                obj = obj === null ? "" : obj;
                                if (obj !== undefined) {
                                    newObj[keys[i]] = obj;
                                }
                            }
                        }
                        return ($.isEmptyObject(newObj))? undefined : newObj;
                    }
                }
                return undefined;
            },
            isArrayEqual : function(arr1, arr2) {
                var equal = true;
                if((arr1 == null || arr2 == null)) {
                    if(arr1 !== arr2) {
                        return false;
                    }
                } else {
                    if(arr1.length !== arr2.length) {
                        equal = false;
                    } else {
                        if(arr1.length != 0) {
                            for(var i = 0; i < arr1.length; i++) {
                                if(this.diff(arr2[i], arr1[i]) !== undefined) {
                                    equal = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                return equal;
            },
            //Fonction permettant d'ordonner une liste de bureaux suivant leur supérieur hierarchique
            reorderBureaux : function(bureaux) {
                //Profondeur maximale
                var max = 0;
                var min = Number.MAX_VALUE;
                var assocsBureaux = {};
                //Algo compliqué - voir Jason
                for( var i=0; i < bureaux.length; i++ ) {
                    var profondeur = bureaux[i].profondeur;
                    if(!assocsBureaux[profondeur]) assocsBureaux[profondeur] = {};
                    if(profondeur > max) max = profondeur;
                    if(profondeur < min) min = profondeur;
                    assocsBureaux[profondeur][bureaux[i].id] = bureaux[i];
                }
                for(var j = max ; j > min; j--) {
                    angular.forEach(assocsBureaux[j], function(value) {
                        if(!assocsBureaux[j-1][value.hierarchie].child) assocsBureaux[j-1][value.hierarchie].child = [];
                        assocsBureaux[j-1][value.hierarchie].child.push(value);
                    });
                }
                var ordered = [];
                angular.forEach(assocsBureaux[min], function(value, key) {
                    ordered.push(value);
                });
                //Fin de l'algo compliqué
                return ordered;
            },
            reorderGroupes: function(nodes) {
                var map = {}, node, roots = [];
                for (var i = 0; i < nodes.length; i += 1) {
                    node = nodes[i];
                    node.subGroups = [];
                    map[node.shortName] = i; // use map to look-up the parents
                    if (node.parent != undefined && nodes[map[node.parent]] != undefined) {
                        nodes[map[node.parent]].subGroups.push(node);
                    } else {
                        roots.push(node);
                    }
                }
                return roots;
            },
            windowSize : function() {
                var myWidth = 0, myHeight = 0;
                if( typeof( window.innerWidth ) == 'number' ) {
                    //Non-IE
                    myWidth = window.innerWidth;
                    myHeight = window.innerHeight;
                } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
                    //IE 6+ in 'standards compliant mode'
                    myWidth = document.documentElement.clientWidth;
                    myHeight = document.documentElement.clientHeight;
                } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
                    //IE 4 compatible
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
                return {
                    width: myWidth,
                    height: myHeight
                };
            },
            generateFilter : function(filterObj) {
                var filter = {};
                filter.and = [];
                if(filterObj["dateFrom"] || filterObj["dateTo"]) {
                    var str = "[";
                    str += filterObj["dateFrom"] ? filterObj.dateFrom : "MIN";
                    str += filterObj["dateTo"] ? " TO " + filterObj.dateTo + "]" : " TO MAX]";

                    filter.and.push({
                        "cm:created" : str
                    });
                }
                if(filterObj["title"] !== undefined && filterObj["title"] !== "") {
                    filter.and.push({
                        "or": [
                            {
                                "cm:title" : "*" + filterObj.title + "*"
                            },
                            {
                                "cm:name" : "*" + filterObj.title + "*"
                            }
                        ]
                    });
                }
                if(filterObj["types"] !== undefined) {
                    filter.and.push({
                        "or": []
                    });
                    for(var i = 0; i < filterObj.types.length; i++) {
                        filter.and[filter.and.length - 1].or.push({
                            "ph:typeMetier": filterObj.types[i]
                        });
                    }
                }
                if(filterObj["subtypes"] !== undefined) {
                    filter.and.push({
                        "or": []
                    });
                    for(var j = 0; j < filterObj.subtypes.length; j++) {
                        filter.and[filter.and.length - 1].or.push({
                            "ph:soustypeMetier": filterObj.subtypes[j]
                        });
                    }
                }
                var buildMeta = {};
                if(filterObj["metadonnees"] !== undefined) {
                    for(var k = 0; k < filterObj.metadonnees.length; k++) {
                        if(buildMeta[filterObj.metadonnees[k].id] === undefined) {
                            buildMeta[filterObj.metadonnees[k].id] = [];
                        }
                        buildMeta[filterObj.metadonnees[k].id].push(filterObj.metadonnees[k]);
                    }

                    for(var key in buildMeta) {
                        var type = buildMeta[key][0].type;
                        filter.and.push({
                            "or": []
                        });
                        for(var l = 0; l < buildMeta[key].length; l++) {
                            var metadonnee = buildMeta[key][l];
                            var obj = {};
                            if(type === "STRING") {
                                obj[metadonnee.id] = "*" + metadonnee.text + "*";
                            } else if(type === "DATE") {
                                str = "[";
                                str += metadonnee["dateFrom"] !== undefined ? metadonnee.dateFrom : "MIN";
                                str += metadonnee["dateTo"] !== undefined ? " TO " + metadonnee.dateTo + "]" : " TO MAX]";

                                obj[metadonnee.id] = str;
                            } else {
                                obj[metadonnee.id] = metadonnee.text;
                            }
                            filter.and[filter.and.length - 1].or.push(obj);
                        }
                    }
                }
                return filter;
            }
        };
    }]);