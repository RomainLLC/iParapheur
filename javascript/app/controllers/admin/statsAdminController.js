//Controller for bureau page
function StatsAdminController($scope, Audits, cache, $filter, ngTableParams, $sce) {

    cache.types.list().then(function(list) {
        $scope.types = list;
    });

    $scope.action = {
        dossiersCrees: true,
        dossiersEmis: false,
        dossiersEmisRefuses: false,
        dossiersInstruits: false,
        dossiersRefuses: false,
        dossiersTraites: false,
        tempsTraitement: false
    };
    $scope.data = [];
    $scope.moyennes = [];
    $scope.ecartTypes = [];
    $scope.cumul = 1;
    $scope.datalength = 0;
    $scope.gettingStats = false;

    var fromTime = new Date();
    fromTime.setDate(1);

    $scope.listHandler = {
        bureaux: [],
        subList : [],
        searchResultSubList: [],
        selectedSubList : [],
        selectedBureaux: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function() {
            this.search("");
        },
        search: function(toSearch) {
            this.subList = [];
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, {name:toSearch});
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function(toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function() {
            this.searchResultSubList = $filter('notSameId')(this.bureaux.slice(this.page*this.maxSize, (this.page*this.maxSize) + this.maxSize),  this.selectedBureaux);
        },
        selectElement: function(b) {
            this.selectedSubList.push(b);
            this.selectedBureaux.push(b.id);
            this.getNewList();
        },
        deselectElement: function(id) {
            var indexInArray = this.selectedBureaux.indexOf(id);
            if(~indexInArray) {
                this.selectedBureaux.splice(indexInArray, 1);
            }
            this.selectedSubList = $.grep(this.selectedSubList, function(a) {
                return a.id != id;
            });
            this.getNewList();
        }
    };

    cache.bureaux.list().then(function(bureaux) {
         $scope.bureaux = bureaux;
         $scope.listHandler.init();
    });

    $scope.opt = {
        verbose : true,
        options : {},
        fromTime : fromTime.getTime(),
        toTime : new Date().getTime()
    };

    var optionToParam = function(bureau) {
        var ret = angular.copy($scope.opt);
        var option = "";
        //if($scope.opt.options.parapheur) {
        //    option += "parapheur;" + $scope.opt.options.parapheur + "/";
        //}

        if (bureau)
            option += "parapheur;" + bureau.id + "/";

        if ($scope.opt.options.type) {
            option += "typeMetier;" + $scope.opt.options.type + "/";
        }
        if ($scope.opt.options.sousType) {
            option += "soustypeMetier;" + $scope.opt.options.sousType + "/";
        }
        ret.options = option;
        ret.cumul = $scope.cumul;
        return ret;
    };

    $scope.toHandle = 0;
    $scope.hasStats = false;

    function getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return new Date(y, 0, d);
    }

    var handleTimeDate = function (label, data, cumul) {
        var dataset = {
            type: "spline",
            axisYType: "secondary",
            name: label,
            showInLegend: true,
            toolTipContent: "<span style='\"'color: {color};'\"'>{x}</span> {label}",
            dataPoints: []
        };

        $scope.datalength = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            var date;
            if (cumul == 4) {
                date = new Date(data.data[i].key + "-01-01");
            } else if (cumul == 3) {
                date = new Date(data.data[i].key + "-01");
            } else if (cumul == 2) {
                var k = data.data[i].key;
                date = getDateOfWeek(k.split("-")[1], k.split("-")[0]);
            } else {
                date = new Date(data.data[i].key);
            }
            dataset.dataPoints[i] = {
                x: date,
                y: +data.data[i].value,
                label: getTime(+data.data[i].value)
            }
        }

        if ($scope.bureaux.cumul) {

            // We try to concatenate data to already set same label

            var alreadyExistingData = false;

            for (i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].name == dataset.name) {

                    for (var j = 0; j < $scope.data[i].dataPoints.length; j++)
                        $scope.data[i].dataPoints[j].y += dataset.dataPoints[j].y;

                    alreadyExistingData = true;
                }
            }

            // If we didn't found any existing data, we just add the new one
            if (!alreadyExistingData)
                $scope.data.push(dataset);

        } else {
            $scope.data.push(dataset);
        }

        $scope.toHandle--;
        $scope.gettingStats = false;
    };

    var handleData = function(label, data, cumul) {
        $scope.moyenne = data.moyenne;
        $scope.ecartType = data.ecartType;

        var dataset = {
            type : "line",
            name : label,
            showInLegend : true,
            dataPoints : []
        };

        $scope.datalength = data.data.length;
        for (var i = 0; i < data.data.length; i++) {
            var date;
            if (cumul == 4) {
                date = new Date(data.data[i].key + "-01-01");
            } else if (cumul == 3) {
                date = new Date(data.data[i].key + "-01");
            } else if (cumul == 2) {
                var k = data.data[i].key;
                date = getDateOfWeek(k.split("-")[1], k.split("-")[0]);
            } else {
                date = new Date(data.data[i].key);
            }
            dataset.dataPoints[i] = {
                x : date,
                y : +data.data[i].value
            }
        }

        if ($scope.bureaux.cumul) {

            // We try to concatenate data to already set same label

            var alreadyExistingData = false;

            for (i = 0; i < $scope.data.length; i++) {
                if ($scope.data[i].name == dataset.name) {

                    for (var j = 0; j < $scope.data[i].dataPoints.length; j++)
                        $scope.data[i].dataPoints[j].y += dataset.dataPoints[j].y;

                    alreadyExistingData = true;
                }
            }

            // If we didn't found any existing data, we just add the new one
            if (!alreadyExistingData)
                $scope.data.push(dataset);

        } else {
            $scope.data.push(dataset);
        }

        $scope.moyennes.push(data.moyenne || "");
        $scope.ecartTypes.push(data.ecartType || "");
        $scope.toHandle--;
        $scope.gettingStats = false;
    };

    var hasGenerateRejectTable = false;

    $scope.updateChartData = function() {

        $scope.searchReject = false;
        $scope.$broadcast("reinitTab");
        $scope.data = [];
        $scope.moyennes = [];
        $scope.ecartTypes = [];
        $scope.gettingStats = true;
        $scope.savedCumul = $scope.cumul;

        if ($scope.listHandler.selectedSubList.length > 0) {
            for (var i = 0; i < $scope.listHandler.selectedSubList.length; i++)
                updateChartData($scope.listHandler.selectedSubList[i]);
        } else {
            updateChartData(null);
        }

        $scope.hasStats = true;
        hasGenerateRejectTable = false;
    };

    function getTime(timeInSeconds) {
        var result = "";
        var rest = timeInSeconds;
        if (Math.floor(rest / 86400) > 0) {
            result += Math.floor(rest / 86400) + " jours, ";
            rest = rest % 86400;
        }
        if (Math.floor(rest / 3600) > 0) {
            result += Math.floor(rest / 3600) + " heures, ";
            rest = rest % 3600;
        }
        if (Math.floor(rest / 60) > 0) {
            result += Math.floor(rest / 60) + " minutes";
            rest = rest % 60;
        }

        if (rest > 0) {
            if (result !== "") {
                result += " et "
            }
            result += (rest) + " secondes";
        }

        return rest === 0 ? "Aucun traitement" : result;
    }

    var buildTable = function () {
        if (!$scope.tableParams) {
            for (var i = 0; i < $scope.rejetDetail.length; i++) {
                $scope.rejetDetail[i].cause = $sce.trustAsHtml($scope.rejetDetail[i].cause.replace(/\n/g, '<br/>'));
            }
            $scope.tableParams = new ngTableParams({
                page: 1,            // show first page
                count: 10           // count per page
            }, {
                total: 0, // length of data
                getData: function ($defer, params) {
                    // use build-in angular filter
                    var orderedData = params.sorting() ?
                        $filter('orderBy')($scope.rejetDetail, params.orderBy()) :
                        $scope.rejetDetail;
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        } else {
            $scope.tableParams.page(1);
            $scope.tableParams.reload();
        }
        $scope.flags.isSearching = false;
    };

    $scope.generateRejectTable = function () {
        if (!hasGenerateRejectTable) {
            if ($scope.listHandler.selectedSubList.length > 0) {
                for (var i = 0; i < $scope.listHandler.selectedSubList.length; i++)
                    generateRejectTable($scope.listHandler.selectedSubList[i]);
            } else {
                generateRejectTable(null);
            }
            hasGenerateRejectTable = true;
        }
    };

    var generateRejectTable = function (bureau) {
        Audits.causesRejet(optionToParam(bureau), function (result) {
            $scope.searchReject = result.length > 0;
            $scope.rejetDetail = result;
            buildTable();
        });
    };

    var updateChartData = function(bureau) {
        var bureauLabel = "";
        if (bureau != null)
            bureauLabel = " (" + bureau.name + ")";

        if ($scope.action.dossiersCrees) {
            $scope.toHandle++;
            Audits.crees(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Created') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersEmis) {
            $scope.toHandle++;
            Audits.emis(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Emited') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersEmisRefuses) {
            $scope.toHandle++;
            Audits.emisRefuses(optionToParam(bureau), function (result) {
                var label = $filter('translate')('Admin.Stats.EmitedRejected') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersInstruits) {
            $scope.toHandle++;
            Audits.instruits(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Instructed') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }
        if ($scope.action.dossiersRefuses) {
            $scope.toHandle++;
            Audits.refuses(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Rejected') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
                $scope.generateRejectTable();
            });
        }
        if ($scope.action.dossiersTraites) {
            $scope.toHandle++;
            Audits.traites(optionToParam(bureau), function(result) {
                var label = $filter('translate')('Admin.Stats.Handled') + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleData(label, result, $scope.savedCumul);
            });
        }

        if ($scope.action.tempsTraitement) {
            $scope.toHandle++;
            Audits.tempsTraitement(optionToParam(bureau), function (result) {
                var label = $filter('translate')('Admin.Stats.Time') + " (en secondes) " + (!$scope.bureaux.cumul ? bureauLabel : "");
                handleTimeDate(label, result, $scope.savedCumul);
            });
        }
    };

    //$scope.logDataPoints = function(datapoints) {
    //    var result = "[";
    //
    //    for(var i = 0; i < datapoints.length; i++) {
    //        result += datapoints[i].x + "." + datapoints[i].y;
    //
    //        if(i != datapoints.length)
    //            result += " - ";
    //    }
    //
    //    result += "] (" + datapoints.length + ")";
    //    console.log("                 >" + result);
    //};

    $scope.exportToCSV = function() {
        var toExport = [];
        for (var i = 0; i < $scope.data.length; i++) {
            var name = $scope.data[i].name;
            for (var j = 0; j < $scope.data[i].dataPoints.length; j++) {

                var point = $scope.data[i].dataPoints[j];
                if (!toExport[j]) {
                    var d = new Date(point.x);
                    toExport[j] = {
                        date : d.getFullYear() + "-" + (+d.getMonth() + 1) + "-" + d.getDate()
                    };
                }
                toExport[j][name] = point.y;
            }
        }
        var csvContent = "";
        var hasAddHeader = false;
        for (var k = 0; k < toExport.length; k++) {
            if (!hasAddHeader) {
                var isFirst = true;
                for (var el in toExport[k]) {
                    if (!isFirst) {
                        csvContent += ";";
                    }
                    isFirst = false;
                    csvContent += el;
                }
                csvContent += "\n";
                hasAddHeader = true;
            }
            var isFirstElement = true;
            for (var elem in toExport[k]) {
                if (!isFirstElement) {
                    csvContent += ";";
                }
                isFirstElement = false;
                //noinspection JSUnfilteredForInLoop
                csvContent += toExport[k][elem];
            }
            csvContent += "\n";
        }
        if ($scope.moyennes.length > 0 && $scope.ecartTypes.length > 0) {
            csvContent += "\n";
            csvContent += "moyenne;";
            for (var m = 0; m < $scope.moyennes.length; m++) {
                csvContent += $scope.moyennes[m] + ";";
            }
            csvContent += "\n";
            csvContent += "ecart Type;";
            for (var e = 0; e < $scope.ecartTypes.length; e++) {
                csvContent += $scope.ecartTypes[e] + ";";
            }
        }
        var blob = new Blob( ["\ufeff", csvContent ], { type: "text/csv" } );
        if ( window.navigator.msSaveOrOpenBlob && window.Blob ) {
            navigator.msSaveOrOpenBlob( blob, "statistiques.csv" );
        } else {
            var link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'statistiques.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

}
StatsAdminController.$inject = ['$scope', 'Audits', 'cache', '$filter', 'ngTableParams', '$sce']; // For JS compilers