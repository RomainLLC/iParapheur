//Controller for bureau page
function StatsController($scope, Audits, Bureaux, $filter, Types) {

    $scope.types = Types.query();
    console.log($scope.types);

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
        searchResultSubList: [],
        page: 0,
        maxSize: 10,
        total: 0,
        init: function () {
            this.search("");
        },
        search: function (toSearch) {
            this.page = 0;
            this.bureaux = $filter('filter')($scope.bureaux, {name: toSearch});
            this.selectedBureau = this.bureaux.length > 0 ? this.bureaux[0] : undefined;
            this.total = this.bureaux.length;
            this.getNewList();
        },
        pagine: function (toAddToPage) {
            this.page += toAddToPage;
            this.getNewList();
        },
        getNewList: function () {
            this.searchResultSubList = this.bureaux.slice(this.page * this.maxSize, (this.page * this.maxSize) + this.maxSize);
        },
        selectElement: function (b) {
            this.selectedBureau = b;
            this.getNewList();
        }
    };

    Bureaux.query(function (listBureaux) {
        $scope.bureaux = listBureaux;
        $scope.listHandler.init();
    });

    $scope.opt = {
        verbose: true,
        options: {},
        fromTime: fromTime.getTime(),
        toTime: new Date().getTime()
    };

    var optionToParam = function (bureau) {
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

    function getTime(timeInSeconds) {
        var result = "";
        var rest = timeInSeconds;
        if (Math.floor(rest / 86400) > 0) {
            result += Math.floor(rest / 86400) + " jours";
            rest = rest % 86400;
            if (Math.floor(rest / 3600) > 0) {
                result += " et ";
                result += Math.floor(rest / 3600) + " heures";
                return result;
            }
        }
        if (Math.floor(rest / 3600) > 0) {
            result += Math.floor(rest / 3600) + " heures";
            rest = rest % 3600;
            if (Math.floor(rest / 60) > 0) {
                result += " et ";
                result += Math.floor(rest / 60) + " minutes";
                return result;
            }
        }
        if (Math.floor(rest / 60) > 0) {
            result += Math.floor(rest / 60) + " minutes";
            rest = rest % 60;
        }
        if (rest > 0) {
            if (result !== "") {
                result += " et ";
            }
            result += (rest) + " secondes";
        }

        return rest === 0 && result === "" ? "Aucun traitement" : result;
    }

    function getDateOfWeek(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return new Date(y, 0, d);
    }

    var handleData = function (label, data, cumul) {
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

    $scope.updateChartData = function () {

        $scope.currentBureauName = $scope.listHandler.selectedBureau.name;
        $scope.data = [];
        $scope.moyennes = [];
        $scope.ecartTypes = [];
        $scope.gettingStats = true;
        $scope.savedCumul = $scope.cumul;

        updateChartData($scope.listHandler.selectedBureau);

        $scope.hasStats = true;
    };

    var updateChartData = function (bureau) {
        Audits.tempsTraitement(optionToParam(bureau), function (result) {
            var label = $filter('translate')('stats.handle_time');
            handleData(label, result, $scope.savedCumul);
        });
    };
}
StatsController.$inject = ['$scope', 'Audits', 'Bureaux', '$filter', 'Types']; // For JS compilers