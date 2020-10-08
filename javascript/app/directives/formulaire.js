//noinspection JSUnresolvedFunction
/**
 * User: lhameury
 * Date: 20/03/13
 * Time: 14:06
 */

var directives = angular.module('appParapheur.directives', ['userModule', 'baseModule']);
directives.directive('checkStrength', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            var strengthBase = !!attrs.checkStrength ? attrs.checkStrength : 'ln6';
            var minLength = parseInt(strengthBase.replace(/[^0-9\.]/g, ''), 10);

            ctrl.$parsers.unshift(function (p) {

                var _regex = /[$-/:-?{-~!"^_`\[\]]/g;

                if (strengthBase.indexOf('l') > -1) {
                    var _lowerLetters = /[a-z]+/.test(p);
                    ctrl.$setValidity('_lowerletters', _lowerLetters);
                }

                if (strengthBase.indexOf('u') > -1) {
                    var _upperLetters = /[A-Z]+/.test(p);
                    ctrl.$setValidity('_upperletters', _upperLetters);
                }

                if (strengthBase.indexOf('n') > -1) {
                    var _numbers = /[0-9]+/.test(p);
                    ctrl.$setValidity('_numbers', _numbers);
                }

                if (strengthBase.indexOf('s') > -1) {
                    var _symbols = _regex.test(p);
                    ctrl.$setValidity('_symbols', _symbols);
                }

                ctrl.$setValidity('_length', p.length >= minLength);

                return p;
            });
        }
    };
}).//Multiple files input
directive('uiMultiple', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var id = element[0].id;
            scope.$watch(attrs.uiMultiple, function (value) {
                if (value) {
                    $("#" + id).attr("multiple", "multiple");
                } else {
                    $("#" + id).removeAttr("multiple");
                }
            }, true);
        }
    }
}).//File input handler (fileupload plugin)
directive('fileupload', function ($filter) {
    return {
        scope: {
            fileAdded: '&',
            uploadSuccess: '&',
            uploadFinish: '&',
            uploadError: '&',
            wrongType: '&',
            signatureFormat: '&',
            protocol: '&',
            checkIfExist: '&',
            mainDocument: '&',
            existFile: '&'
        },
        link: function ($scope, element, attrs) {
            var oneFile = attrs.oneFile;
            var iframeTransport = isBrowserIE;
            var nbrFiles = 0;

            var fileAdd = function (event) {
                event.data.data.submit().success(function (resp) {
                    nbrFiles--;

                    if (typeof $scope.uploadSuccess === 'function') {
                        $scope.uploadSuccess({data: resp, index: event.data.index});
                    }
                    if (typeof $scope.uploadFinish === 'function' && nbrFiles === 0) {
                        $scope.uploadFinish({data: resp, index: event.data.index});
                    }
                }).error(function (resp) {
                    nbrFiles--;

                    if (typeof $scope.uploadError === 'function') {
                        $scope.uploadError({data: resp, index: event.data.index});
                    }
                    if (typeof $scope.uploadFinish === 'function' && nbrFiles === 0) {
                        $scope.uploadFinish({data: resp, index: event.data.index});
                    }
                });
            };

            $(element).fileupload({
                forceIframeTransport: iframeTransport,
                sequentialUploads: true,
                singleFileUploads: true,
                dropZone: $(attrs.dropzone),
                dataType: 'json',
                pasteZone: "",
                add: function (e, data) {

                    nbrFiles++;
                    var document = 0;
                    var ext = $filter("fileext")(data.files[0].name).toLowerCase();
                    if (typeof $scope.checkIfExist === 'function' && $scope.checkIfExist({name: data.files[0].name})) {
                        if (typeof $scope.existFile === 'function') {
                            $scope.existFile({name: data.files[0].name});
                        }
                    } else {

                        // Valid extensions (in general)

                        var types = attrs.fileupload.split("|");

                        var isForSig = false;
                        var validRegex = "(?:";
                        for (var i = 0; i < types.length; i++) {
                            if (i > 0) {
                                validRegex += "|";
                            }
                            if (types[i] === "image" || types[i] === "document") {
                                validRegex += "gif|jpg|jpeg|png";

                                if (types[i] === "document") {
                                    validRegex += "|";
                                }
                            }
                            if (types[i] === "document") {
                                validRegex += "pptx|pdf|doc|odt|htm|html|rtf|txt|xls|ods|ppt|odp|docx|xlsx|xml";
                            }
                            if (types[i] === "pdf") {
                                validRegex += "pdf";
                            }
                            if (types[i] === "certificat") {
                                validRegex += "p12";
                            }
                            if (types[i] === "certificat-pub") {
                                validRegex += "pem|cer|crt";
                            }
                            if (types[i] === "signature") {
                                validRegex += "xml|sig|p7s";
                                isForSig = true;
                            }
                            if (types[i] === "zip") {
                                validRegex += "zip";
                            }
                        }
                        validRegex += ")$";

                        var isValidExtension = new RegExp(validRegex, "i").test(ext);
                        var isAuthorizedExtension = true;
                        var protocol = $scope.protocol();
                        var signatureFormat = $scope.signatureFormat();

                        // Authorized extensions : XML restrictions

                        var isFormatCompatibleWithXml = (!signatureFormat) || (signatureFormat.toUpperCase().indexOf("PKCS#1") === 0) || (signatureFormat.toUpperCase().indexOf("XADES") === 0) || (signatureFormat.toUpperCase().indexOf("PKCS#7") === 0);
                        var isProtocolCompatibleWithXml = (!protocol) || (protocol.toUpperCase().indexOf("HELIOS") === 0) || (protocol.toUpperCase().indexOf("AUCUN") === 0);
                        var isMainDocument = $scope.mainDocument();
                        var isXmlAuthorized = (isMainDocument && isFormatCompatibleWithXml && isProtocolCompatibleWithXml);

                        if ((!isXmlAuthorized) && (ext.toUpperCase() === "XML") && !isForSig) {
                            isAuthorizedExtension = false;
                        }

                        // Authorized extensions : PAdES restrictions

                        var isPades = (!!signatureFormat) && (signatureFormat.toUpperCase().indexOf("PADES") === 0);
                        var isPdf = ext.toUpperCase() === "PDF";
                        //var isActes = (!!protocol) && (protocol.toUpperCase().indexOf("ACTES") === 0);

                        if (isPades && isMainDocument && !isPdf && protocol.toUpperCase().indexOf("ACTES") !== 0) {
                            isAuthorizedExtension = false;
                        }

                        //

                        if ((ext.length > 0) && isValidExtension && isAuthorizedExtension) {
                            $scope.$apply(function () {
                                $scope.files = data.files;
                            });
                            if (typeof $scope.fileAdded === 'function') {
                                document = $scope.fileAdded({files: data.files});
                            }
                            if ($(attrs.submitButton).length !== 0) {
                                if (oneFile) {
                                    $(attrs.submitButton).unbind('click', fileAdd);
                                }
                                $(attrs.submitButton).bind('click', {data: data, index: document}, fileAdd);
                            } else {
                                data.submit().success(function (resp) {
                                    nbrFiles--;
                                    if (typeof $scope.uploadSuccess === 'function') {
                                        $scope.uploadSuccess({data: resp, index: document});
                                    }
                                    if (typeof $scope.uploadFinish === 'function' && nbrFiles === 0) {
                                        $scope.uploadFinish({data: resp, index: document});
                                    }
                                }).error(function (resp) {
                                    nbrFiles--;

                                    if (typeof $scope.uploadError === 'function') {
                                        $scope.uploadError({data: resp, index: document});
                                    }
                                    if (typeof $scope.uploadFinish === 'function' && nbrFiles === 0) {
                                        $scope.uploadFinish({data: resp, index: document});
                                    }
                                });
                            }
                        } else {
                            //if (attrs.fileupload === "document" && ext === "xml") {
                            //    //TODO Chargement d'un second input file ?
                            //} else

                            if (typeof $scope.wrongType === 'function') {
                                $scope.wrongType({
                                    ext: ext,
                                    isValid: isValidExtension,
                                    isAuthorized: isAuthorizedExtension
                                });
                            }
                        }
                    }
                }
            });
        }
    }
}).//Integer validation
directive('integer', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (/^\-?\d*$/.test(viewValue)) {
                    if (!attrs.min) {
                        attrs.min = 0;
                    }
                    if (!attrs.max) {
                        attrs.max = Number.MAX_VALUE;
                    }
                    // it is valid
                    ctrl.$setValidity('integer', true);
                    if (parseInt(viewValue) > attrs.max || parseInt(viewValue) < attrs.min) {
                        ctrl.$setValidity('value', false);
                        return undefined;
                    } else {
                        ctrl.$setValidity('value', true);
                    }
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('integer', false);
                    return undefined;
                }
            });
        }
    };
}).//Valide le negatif du pattern
directive('phNegativePattern', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var reg = new RegExp(attrs["phNegativePattern"]);
                if (!reg.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('pattern', true);
                    return viewValue;
                } else {
                    // it is invalid, return undefined (no model update)
                    ctrl.$setValidity('pattern', false);
                    return undefined;
                }
            });
        }
    };
}).//Decimal validation
directive('decimal', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                viewValue = viewValue.replace(",", ".");
                if (/^(\d+\.?\d*|\.\d+)$/.test(viewValue)) {
                    // it is valid
                    ctrl.$setValidity('decimal', true);
                    return viewValue;
                } else {
                    if (viewValue) {
                        // it is invalid, return undefined (no model update)
                        ctrl.$setValidity('decimal', false);
                        return undefined;
                    }
                    return viewValue;
                }
            });
        }
    };
}).//Confirm input with another (two inputs identical, for password)
directive('confirmWith', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(attrs.confirmWith + ".newOne", function (value) {
                if (value === elm.val()) {
                    ctrl.$setValidity('confirm', true);
                } else {
                    ctrl.$setValidity('confirm', false);
                }
            });
            ctrl.$parsers.unshift(function (viewValue) {
                if (scope[attrs.confirmWith].newOne === elm.val()) {
                    ctrl.$setValidity('confirm', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('confirm', false);
                    return undefined;
                }
            });
        }
    };
}).//Different from the given variable
directive('diffCurrent', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(attrs.diffCurrent, function (value) {
                var v = attrs.attr ? value[attrs.attr] : value;
                if (v === elm.val()) {
                    ctrl.$setValidity('confirm', false);
                } else {
                    ctrl.$setValidity('confirm', true);
                }
            }, true);
            ctrl.$parsers.unshift(function (viewValue) {
                var v = attrs.attr ? scope[attrs.diffCurrent][attrs.attr] : scope[attrs.diffCurrent];
                if (v === viewValue) {
                    ctrl.$setValidity('confirm', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('confirm', true);
                    return viewValue;
                }
            });
        }
    };
}).//Different from the given array property
directive('diffArray', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            scope.$watch(attrs.diffArray, function (value) {
                var validity = true;
                for (var i = 0; i < value.length; i++) {
                    if (value[i][attrs.attr] === elm.val()) {
                        validity = false;
                        break;
                    }
                }
                ctrl.$setValidity('isdiff', validity);
            }, true);
            ctrl.$parsers.unshift(function (viewValue) {
                var value = scope[attrs.diffArray];
                var validity = true;
                var toRet = viewValue;
                for (var i = 0; i < value.length; i++) {
                    if (value[i][attrs.attr] === viewValue) {
                        validity = false;
                        toRet = undefined;
                        break;
                    }
                }
                ctrl.$setValidity('isdiff', validity);
                return toRet;
            });
        }
    };
}).//Different from the begining
directive('requiredWhenChanged', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            var changed = false;
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue !== "" || !changed) {
                    ctrl.$setValidity('required', true);
                    changed = true;
                    return viewValue;
                } else {
                    ctrl.$setValidity('required', false);
                    return undefined;
                }
            });
        }
    };
}).//Different from the begining
directive('requiredIfShow', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                if (viewValue !== "" || !$(elm).is(":visible")) {
                    ctrl.$setValidity('required', true);
                    return viewValue;
                } else {
                    ctrl.$setValidity('required', false);
                    return undefined;
                }
            });
        }
    };
}).//Datepicker handler
directive('ipDatepicker', function () {
    return {
        restrict: 'A',
        require: "ngModel",
        scope: {
            ipId: "="
        },
        link: function (scope, element, attrs, ctrl) {
            /**
             * attr :   returnFormat -> format de la date de retour
             *          viewFormat   -> format de la date sur la vue
             *          linked       -> id d'un autre
             */
            var returnFormat = attrs.returnFormat ? attrs.returnFormat : "yy-mm-dd";
            var viewFormat = attrs.viewFormat ? attrs.viewFormat : "dd/mm/yy";

            ctrl.$formatters.push(function (value) {
                if (value) {
                    var d = new Date(value);
                    if (isNaN(d.getTime())) {
                        d = $.datepicker.parseDate("@", value, $.datepicker.regional['']);
                    }
                    value = $.datepicker.formatDate(viewFormat, d);
                }
                return value;
            });
            //Pour affichage sous la forme dd/mm/yy sur la vue
            ctrl.$render = function () {
                if (ctrl.$viewValue) {
                    var d = new Date(ctrl.$viewValue);
                    if (isNaN(d.getTime())) {
                        d = $.datepicker.parseDate("D M dd 00:00:00 CEST yy", ctrl.$viewValue, $.datepicker.regional['']);
                    }
                    $(element).attr("value", $.datepicker.formatDate(viewFormat, d));
                    $(element).datepicker('setDate', $.datepicker.formatDate(viewFormat, d));
                } else {
                    $.datepicker._clearDate($(element));
                }
            };
            //Définition de l'id avant la création du datepicker pour éviter une erreur jQuery-ui
            if (scope.ipId) {
                $(element).attr("id", scope.ipId);
            }

            var onSelect = function (dateText) {
                if (dateText) {
                    //Pour récupération dans le model sous la forme yy-mm-dd
                    scope.$apply(function () {
                        if (returnFormat === "timestamp") {
                            // To get date + 2 minutes
                            var datetime = $(element).datepicker('getDate').valueOf() + 100000;
                            ctrl.$setViewValue(datetime);
                        } else {
                            ctrl.$setViewValue($.datepicker.formatDate(returnFormat, $(element).datepicker('getDate')));
                        }
                    });
                }
                //Link entre deux datepickers
                if (attrs.linked) {
                    if (attrs.from) {
                        $(element).datepicker("option", "maxDate", $(attrs.linked).datepicker('getDate'));
                        $(attrs.linked).datepicker("option", "minDate", dateText);
                    } else {
                        $(element).datepicker("option", "minDate", $(attrs.linked).datepicker('getDate'));
                        $(attrs.linked).datepicker("option", "maxDate", dateText);
                    }
                }
            };

            var opt = {
                onSelect: function (dateText) {
                    onSelect(dateText);
                }
            };

            if (attrs.minDate) {
                opt.minDate = attrs.minDate;
            }
            if (attrs.maxDate) {
                opt.maxDate = attrs.maxDate;
            }
            $(element).datepicker(opt);
            
            //Suppression du datepicker avant la suppression de l'élément
            element.on("$destroy", function () {
                $(element).datepicker("destroy");
            });
        }
    }
});