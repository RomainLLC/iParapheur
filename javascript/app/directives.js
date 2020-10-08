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
});;
/**
 * User: lhameury
 * Date: 20/03/13
 * Time: 14:06
 */

directives.directive('strengthResult', function () { //Directive d'affichage des bureaux
    return {
        terminal: false,
        templateUrl: "partials/passwordStrength.html",
        transclude: true,
        scope: {
            error: "="
        },
        link: function ($scope, element, attrs) {
            var strengthBase = !!attrs.strengthResult ? attrs.strengthResult : 'ln6';
            $scope.minLength = parseInt(strengthBase.replace(/[^0-9\.]/g, ''), 10);
        }
    };
}).directive('focusMe', function ($timeout) {
    return {
        scope: {trigger: '@focusMe'},
        link: function (scope, element) {
            scope.$watch('trigger', function (value) {
                if (value === "true") {
                    $timeout(function () {
                        element[0].focus();
                    });
                }
            });
        }
    };
}).directive('copySize', function ($timeout) {
    return {
        link: function ($scope, element, attrs) {

            var resize = function () {
                $(element).children("thead").css({visibility: "hidden"});
                $timeout(function () {
                    var obj = $("#" + attrs.copySize);
                    var off = obj.offset();
                    if (off != undefined) {
                        $(element).css({
                            top: off.top
                        });
                        $(element).width(obj.children("table").width());
                        $(element).children("thead").css({visibility: "visible"});
                        $(element).show();
                    }
                    
                });
            };

            $timeout(function () {
                resize();
            });

            $(window).resize(function () {
                resize();
            });

            $(window).on('animBegin', function () {
                $(element).hide();
            });
        }
    }
}).
    directive('libersign', function () {
        return {
            scope : {
                success : '&',
                cancel : '&',
                loaded: '&',
                signatures : '=',
                signatureInformations: '=',
                ready: '='
            },
            link : function($scope, element, attrs) {
                $scope.$watch('ready', function () {
                    if ($scope.ready) {
                        $(element).libersign({
                            signatureInformations: $scope.signatureInformations,
                            extensionUpdateUrl: '/libersign/',
                            installRedirect: '#/about'
                        }).on('libersign.cancel', function () {
                            $scope.cancel();
                        }).on('libersign.sign', function (event, sign) {
                            angular.extend($scope.signatures, sign);
                            $scope.success();
                        }).on('libersign.loaded', function () {
                            $scope.loaded();
                        });
                    }
                });
                element.on('$destroy', function () {
                    $(element).libersign('destroy');
                })
            }
        }
    }).
    directive('i18n', function (i18nService) {   //i18nService must be defined for initialisation
        return {
            restrict:'A',
            link: function(scope, element, attrs)
            {
                //kind : tooltip, attr, html
                //Plus : count, placement, attr
                //waiting for i18n to be initialized
                if (attrs.watchValue) {
                    scope.$watch(attrs.watchValue, function () {
                        i18nService.apply(element, attrs);
                    }, true);
                }
                i18nService.apply(element, attrs);
            }
        }
    }).
    directive('phLoad', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var fn = $parse(attrs.phLoad);
                elem.on('load', function (event) {
                    scope.$apply(function() {
                        fn(scope, { $event: event });
                    });
                });
            }
        };
    }]).
    directive("bnSlideShow", function() {
        // I allow an instance of the directive to be hooked
        // into the user-interaction model outside of the
        // AngularJS context.
        function link( $scope, element, attributes ) {
            // I am the TRUTHY expression to watch.
            /** @namespace attributes.bnSlideShow */
            var expression = attributes.bnSlideShow;
            // I am the optional slide duration.
            /** @namespace attributes.slideShowDuration */
            var duration = ( attributes.slideShowDuration || "fast" );
            // I check to see the default display of the
            // element based on the link-time value of the
            // model we are watching.
            if ( ! $scope.$eval( expression ) ) {
                element.hide();
            }
            // I watch the expression in $scope context to
            // see when it changes - and adjust the visibility
            // of the element accordingly.
            $scope.$watch(expression, function( newValue, oldValue ) {
                    // Ignore first-run values since we've
                    // already defaulted the element state.
                    if ( newValue === oldValue ) {
                        return;
                    }
                    // Show element.
                    if ( newValue ) {
                        element
                            .stop( true, true )
                            .slideDown( duration )
                        ;
                        // Hide element.
                    } else {
                        element
                            .stop( true, true )
                            .slideUp( duration, function() {
                                if(attributes["delete"]) {
                                    $(element).remove();
                                }
                            } )
                        ;
                    }
                }
            );
        }
        // Return the directive configuration.
        return({
            link: link,
            restrict: "A"
        });
    }
).
    directive('bsTab',function () {
    //Pour les tabs (page d'options)
        return {
            link: function (scope, element, attrs) {
                scope.$on("reinitTab", function() {
                    $($(element).parent().parent().children()[0]).find("a").tab('show');
                });
                $(element).click(function(e) {
                    e.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    })
    .directive("spinner", function () {
        return {
            link: function (scope, element, attrs) {
                var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
                var konami_index = 0;
                $(document).keydown(function(e){
                    if (e.keyCode === konami_keys[konami_index++]) {
                        if (konami_index === konami_keys.length) {
                            $("i").addClass("fa-spin");
                        }
                    } else {
                        konami_index = 0;
                    }
                });
            }
        };
    })
    .directive('ipSlide', function () {
        return {
            restrict:'A',
            link: function(scope, element, attrs)
            {
                //Dom manipulation into directives only
                $(element).on('click', function() {
                    var $elem = $(attrs.ipSlide);
                    if($elem.is(":visible")) {
                        $(window).trigger('animBegin');
                        $elem.slideUp({
                            complete: function () {
                                $(window).trigger('resize');
                            }
                        });

                    } else {
                        $(window).trigger('animBegin');
                        $elem.slideDown({
                            complete: function () {
                                $(window).trigger('resize');
                            }
                        });
                    }
                });

            }
        }
    }).
    directive('notify', function () {
        return {
            restrict:'A',
            scope : {
                text : "="
            },
            link : function(scope, element) {
                scope.$watch("text", function() {
                    if(scope.text) {
                        $(element).notify({
                            message : {
                                type : "bl",
                                text : scope.text
                            }
                        }).show();
                    }
                });
            }
        }
    }).
    directive('bureau', function(navigationService, configuration, $rootScope) { //Directive d'affichage des bureaux
        return {
            terminal : false,
            templateUrl : "partials/bureau.html",
            transclude: true,
            scope : {
                b : "=",
                onSelect: '&'
            },
            link : function($scope, element, attrs) {
                $scope.isThumbnail = attrs.isThumbnail === "true";
                $scope.context = configuration.context; //It's a different scope
                //TODO : Revoir ce controlleur
                var corbeilleDefined = !!navigationService.currentFilter.dossier;
                var goToDashboard = function() {
                    if(!corbeilleDefined) {
                        navigationService.hasToSetDefaultFilter = true;
                        if (!$scope.b.isSecretaire) {
                            navigationService.currentFilter.dossier = "a-traiter";
                        } else {
                            navigationService.currentFilter.dossier = "secretariat";
                        }
                    }
                    navigationService.dash.currentPage = 0;
                    navigationService.currentPage = 0;
                    navigationService.hasNext = false;
                    //navigationService.resetFilter();
                    if($scope.isThumbnail) {
                        $scope.onSelect({bureau:$scope.b});
                    }
                };

                $scope.goToDashboard = function() {
                    goToDashboard();
                };

                $scope.retard = function() {
                    if (!$scope.b.isSecretaire) {
                        navigationService.currentFilter.dossier = "en-retard";
                    } else {
                        navigationService.currentFilter.dossier = "a-imprimer";
                    }
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };

                $scope.delegue = function () {
                    navigationService.currentFilter.dossier = "dossiers-delegues";
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };

                $scope.traiter = function() {
                    if (!$scope.b.isSecretaire) {
                        navigationService.currentFilter.dossier = "a-traiter";
                    } else {
                        navigationService.currentFilter.dossier = "secretariat";
                    }
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };

                $scope.archive = function() {
                    navigationService.currentFilter.dossier = "a-archiver";
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };

                $scope.retournes = function() {
                    if (!$scope.b.isSecretaire) {
                        navigationService.currentFilter.dossier = "retournes";
                    } else {
                        navigationService.currentFilter.dossier = "a-imprimer";
                    }
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };

                $scope.preparation = function() {
                    navigationService.currentFilter.dossier = "en-preparation";
                    navigationService.hasToSetDefaultFilter = false;
                    $scope.$emit("getDossiers");
                    corbeilleDefined = true;
                };
            },
            controller: function($scope) {
                $scope.hasThemeIcon = false;
                $scope.iconBureauLoaded = function() {
                    $scope.$apply(function() {
                        $scope.hasThemeIcon = true;
                    })

                };
                if($rootScope.config) {
                    $scope.theme = $rootScope.config.theme;
                    $scope.tenant = $rootScope.config.tenant;
                }
            }
        };
    }).
    directive('ipInitial', function() {
        return {
            restrict : 'A',
            require: "ngModel",
            link: function(scope, element, attrs, ctrl) {
                ctrl.$render = function() {
                    if($(element).attr("type") === "checkbox") {
                        $(element).attr("checked", attrs.ipInitial);
                    } else {
                        $(element).val(attrs.ipInitial);
                    }
                };
            }
        }
    }).
    directive('bsModal', function($templateCache, $compile) { //Directive pour l'affichage d'une fenêtre modale
        return {
            terminal: true,
            link: function(scope, element, attrs) {
                var dialogElement,
                    dialogBodyElement,
                    dialogFooterElement,
                    dialogScope,
                    dialogBodyTemplate = element.contents();

                element.remove();
                // when attribute is changed when initial buttons is pressed
                scope.$watch(attrs.when, function(show) {
                    if (show) {
                        // create new scopes
                        // Ici, on utilise le même scope que le parent, pour un partage des variables
                        dialogScope = scope; // maybe even use $rootScope instead
                        angular.extend(dialogScope, {
                            title: attrs.title,
                            primaryLabel: attrs.primaryLabel || 'OK',
                            secondaryLabel: attrs.secondaryLabel || 'Annuler',
                            modalForm : attrs.modalForm || undefined,
                            primaryAction: function() {
                                scope.$eval(attrs.primaryAction);
                            },
                            secondaryAction: function() {
                                scope.$eval(attrs.secondaryAction);
                            }});
                        // buils dialog from template
                        dialogElement = $($(document.createElement('div')).html($templateCache.get('dialog-template')).children()[0]);
                        // add dialog to bottom of document
                        $('body').append(dialogElement);
                        // compile so angular elements work
                        $compile(dialogElement)(dialogScope);
                        // variable that points to dialogBody which is currently empty
                        dialogBodyElement = dialogElement.find('.modal-body');
                        dialogFooterElement = dialogElement.find('.modal-footer');
                        // add body from template, which is current element where are creating actual dialog
                        dialogBodyElement.append(dialogBodyTemplate);
                        // compile body we just added
                        $compile(dialogBodyElement)(dialogScope);
                        // show newly created dialog
                        dialogElement.modal('show');
                        // what is this?
                        dialogElement.on('hidden.bs.modal', function() {
                            //remove dirty
                            dialogElement.find("form").removeClass();
                            dialogElement.find("form").addClass("ng-pristine ng-valid ng-valid-required");
                            //remove dirty from input
                            dialogElement.find("input").removeClass("ng-dirty").addClass("ng-pristine");
                            //Hide modal
                            scope[attrs.when] = false; //hack, the model might be on a upper scope or might be a fn
                            dialogElement.remove();
                            dialogElement = null;
                        });
                        //watch on events
                        /** @namespace attrs.checkDisabled */
                        if(attrs.checkDisabled) {
                            /** @namespace attrs.primaryDisabled */
                            scope.$watch(attrs.primaryDisabled, function(val) {
                                if(!val) {
                                    dialogFooterElement.find('.btn-primary').attr("disabled", "");
                                    /** @namespace attrs.primaryWhenDisabled */
                                    dialogFooterElement.find('.btn-primary').html(attrs.primaryWhenDisabled);
                                } else {
                                    dialogFooterElement.find('.btn-primary').removeAttr("disabled");
                                    dialogFooterElement.find('.btn-primary').html(attrs.primaryLabel);
                                }
                            });
                        }
                    } else if(show === false) { //False needed for undefined values
                        dialogElement.modal('hide');
                    }
                });
            }
        };
    })
    .directive('bsPopover', [
    '$parse',
    '$compile',
    '$http',
    '$timeout',
    '$q',
    '$templateCache',
    function ($parse, $compile, $http, $timeout, $q, $templateCache) {
        $('body').on('keyup', function (ev) {
            if (ev.keyCode === 27) {
                $('.popover.in').each(function () {
                    $(this).popover('hide');
                });
            }
        });
        return {
            restrict: 'A',
            scope: true,
            link: function postLink(scope, element, attr, ctrl) {
                var getter = $parse(attr.bsPopover), setter = getter.assign, value = getter(scope), options = {};
                if (angular.isObject(value)) {
                    options = value;
                }
                $q.when(options.content || $templateCache.get(value) || $http.get(value, { cache: true })).then(function onSuccess(template) {
                    if (angular.isObject(template)) {
                        template = template.data;
                    }
                    if (!!attr.unique) {
                        element.on('show', function (ev) {
                            $('.popover.in').each(function () {
                                var $this = $(this), popover = $this.data('popover');
                                if (popover && !popover.$element.is(element)) {
                                    $this.popover('hide');
                                }
                            });
                        });
                    }
                    if (!!attr.hide) {
                        scope.$watch(attr.hide, function (newValue, oldValue) {
                            if (!!newValue) {
                                popover.hide();
                            } else if (newValue !== oldValue) {
                                popover.show();
                            }
                        });
                    }
                    if (!!attr.show) {
                        scope.$watch(attr.show, function (newValue, oldValue) {
                            if (!!newValue) {
                                $timeout(function () {
                                    popover.show();
                                });
                            } else if (newValue !== oldValue) {
                                popover.hide();
                            }
                        });
                    }
                    element.popover(angular.extend({}, options, {
                        content: template,
                        html: true
                    }));
                    var popover = element.data('bs.popover');
                    popover.hasContent = function () {
                        return this.getTitle() || template;
                    };
                    popover.getPosition = function () {
                        var r = $.fn.popover.Constructor.prototype.getPosition.apply(this, arguments);
                        $compile(this.$tip)(scope);
                        scope.$digest();
                        this.$tip.data('popover', this);
                        return r;
                    };
                    scope.$popover = function (name) {
                        popover(name);
                    };
                    angular.forEach([
                        'show',
                        'hide'
                    ], function (name) {
                        scope[name] = function () {
                            popover[name]();
                        };
                    });
                    scope.dismiss = scope.hide;
                    angular.forEach([
                        'show',
                        'shown',
                        'hide',
                        'hidden'
                    ], function (name) {
                        element.on(name, function (ev) {
                            scope.$emit('popover-' + name, ev);
                        });
                    });
                });
            }
        };
    }])
    .directive('draggable', ['$document' , function($document) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {

                var startY, initialMouseY, newIndex, oldIndex = attrs.index;

                elm.bind('mousedown', function($event) {
                    startY = parseInt(elm.attr('y'));
                    initialMouseY = $event.clientY;
                    oldIndex = attrs.index;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return false;
                });

                function mousemove($event) {
                    var dy = $event.clientY - initialMouseY;
                    var my = startY + dy;
                    newIndex = parseInt(attrs.index) + (Math.round(dy/153));
                    if(oldIndex != newIndex) {
                        var etapes = scope.$eval(attrs.etapes);
                        var old, newOne;
                        var i = 0;
                        while(i < etapes.length) {
                            if(etapes[i].index === newIndex) {
                                old = etapes[i];
                            }
                            if(etapes[i].index === oldIndex) {
                                newOne = etapes[i];
                            }
                            i++;
                        }
                        if(old) {
                            old.index = oldIndex;
                        }
                        if(newOne) {
                            newOne.index = newIndex;
                        }
                        oldIndex = newIndex;
                    }
                    elm.attr("y", my);
                    return false;
                }

                function mouseup() {
                    if(newIndex !== undefined && attrs.index != newIndex) {
                        scope[attrs.dragged](attrs.index, newIndex);
                    }
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }])
    .value('uiSortableConfig',{})
    .directive('uiSortable', [
        'uiSortableConfig', '$timeout', '$log',
        function(uiSortableConfig, $timeout, $log) {
            'use strict';

            return {
                require: '?ngModel',
                link: function(scope, element, attrs, ngModel) {
                    var savedNodes;

                    function combineCallbacks(first,second){
                        if(second && (typeof second === 'function')) {
                            return function(e, ui) {
                                first(e, ui);
                                second(e, ui);
                            };
                        }
                        return first;
                    }

                    var opts = {};

                    var callbacks = {
                        receive: null,
                        remove:null,
                        start:null,
                        stop:null,
                        update:null
                    };

                    angular.extend(opts, uiSortableConfig);

                    if (ngModel) {

                        // When we add or remove elements, we need the sortable to 'refresh'
                        // so it can find the new/removed elements.
                        scope.$watch(attrs.ngModel+'.length', function() {
                            // Timeout to let ng-repeat modify the DOM
                            $timeout(function() {
                                element.sortable('refresh');
                            });
                        });

                        callbacks.start = function(e, ui) {
                            // Save the starting position of dragged item
                            ui.item.sortable = {
                                index: ui.item.index(),
                                cancel: function () {
                                    ui.item.sortable._isCanceled = true;
                                },
                                isCanceled: function () {
                                    return ui.item.sortable._isCanceled;
                                },
                                _isCanceled: false
                            };
                        };

                        callbacks.activate = function(/*e, ui*/) {
                            // We need to make a copy of the current element's contents so
                            // we can restore it after sortable has messed it up.
                            // This is inside activate (instead of start) in order to save
                            // both lists when dragging between connected lists.
                            savedNodes = element.contents();

                            // If this list has a placeholder (the connected lists won't),
                            // don't inlcude it in saved nodes.
                            var placeholder = element.sortable('option','placeholder');

                            // placeholder.element will be a function if the placeholder, has
                            // been created (placeholder will be an object).  If it hasn't
                            // been created, either placeholder will be false if no
                            // placeholder class was given or placeholder.element will be
                            // undefined if a class was given (placeholder will be a string)
                            if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
                                var phElement = placeholder.element();
                                // workaround for jquery ui 1.9.x,
                                // not returning jquery collection
                                if (!phElement.jquery) {
                                    phElement = angular.element(phElement);
                                }

                                // exact match with the placeholder's class attribute to handle
                                // the case that multiple connected sortables exist and
                                // the placehoilder option equals the class of sortable items
                                var excludes = element.find('[class="' + phElement.attr('class') + '"]');

                                savedNodes = savedNodes.not(excludes);
                            }
                        };

                        callbacks.update = function(e, ui) {
                            // Save current drop position but only if this is not a second
                            // update that happens when moving between lists because then
                            // the value will be overwritten with the old value
                            if(!ui.item.sortable.received) {
                                ui.item.sortable.dropindex = ui.item.index();
                                ui.item.sortable.droptarget = ui.item.parent();

                                // Cancel the sort (let ng-repeat do the sort for us)
                                // Don't cancel if this is the received list because it has
                                // already been canceled in the other list, and trying to cancel
                                // here will mess up the DOM.
                                element.sortable('cancel');
                            }

                            // Put the nodes back exactly the way they started (this is very
                            // important because ng-repeat uses comment elements to delineate
                            // the start and stop of repeat sections and sortable doesn't
                            // respect their order (even if we cancel, the order of the
                            // comments are still messed up).
                            if (element.sortable('option','helper') === 'clone') {
                                // restore all the savedNodes except .ui-sortable-helper element
                                // (which is placed last). That way it will be garbage collected.
                                savedNodes = savedNodes.not(savedNodes.last());
                            }
                            savedNodes.appendTo(element);

                            // If received is true (an item was dropped in from another list)
                            // then we add the new item to this list otherwise wait until the
                            // stop event where we will know if it was a sort or item was
                            // moved here from another list
                            if(ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
                                scope.$apply(function () {
                                    ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0,
                                        ui.item.sortable.moved);
                                });
                            }
                        };

                        callbacks.stop = function(e, ui) {
                            // If the received flag hasn't be set on the item, this is a
                            // normal sort, if dropindex is set, the item was moved, so move
                            // the items in the list.
                            if(!ui.item.sortable.received &&
                                ('dropindex' in ui.item.sortable) &&
                                !ui.item.sortable.isCanceled()) {

                                scope.$apply(function () {
                                    ngModel.$modelValue.splice(
                                        ui.item.sortable.dropindex, 0,
                                        ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
                                });
                            } else {
                                // if the item was not moved, then restore the elements
                                // so that the ngRepeat's comment are correct.
                                if((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) && element.sortable('option','helper') !== 'clone') {
                                    savedNodes.appendTo(element);
                                }
                            }
                        };

                        callbacks.receive = function(e, ui) {
                            // An item was dropped here from another list, set a flag on the
                            // item.
                            ui.item.sortable.received = true;
                        };

                        callbacks.remove = function(e, ui) {
                            // Remove the item from this list's model and copy data into item,
                            // so the next list can retrive it
                            if (!ui.item.sortable.isCanceled()) {
                                scope.$apply(function () {
                                    ui.item.sortable.moved = ngModel.$modelValue.splice(
                                        ui.item.sortable.index, 1)[0];
                                });
                            }
                        };

                        scope.$watch(attrs.uiSortable, function(newVal /*, oldVal*/) {
                            angular.forEach(newVal, function(value, key) {
                                if(callbacks[key]) {
                                    if( key === 'stop' ){
                                        // call apply after stop
                                        value = combineCallbacks(
                                            value, function() { scope.$apply(); });
                                    }
                                    // wrap the callback
                                    value = combineCallbacks(callbacks[key], value);
                                }
                                element.sortable('option', key, value);
                            });
                        }, true);

                        angular.forEach(callbacks, function(value, key) {
                            opts[key] = combineCallbacks(value, opts[key]);
                        });

                    } else {
                        $log.info('ui.sortable: ngModel not provided!', element);
                    }

                    // Create sortable
                    element.sortable(opts);
                }
            };
        }
    ])
    .directive('scrollbar', [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                $(element).mCustomScrollbar({
                        advanced:{
                            updateOnContentResize:true
                        }
                    }
                );
            }
        };
    }])
    .directive('pieChart', [function() {
        return {
            restrict: 'A',
            scope: {
                pieTitle: "=",
                pieTooltip: "=",
                dataset: "="
            },
            link: function (scope, element, attr) {
                var id = $(element).attr("id");
                var chart;

                scope.$watch("dataset", function() {
                    chart = new CanvasJS.Chart(id, {
                        title:{
                            text: scope.pieTitle,
                            fontFamily: "arial black"
                        },
                        animationEnabled: false,
                        legend: {
                            verticalAlign: "bottom",
                            horizontalAlign: "center"
                        },
                        data: [
                            {
                                type: "pie",
                                indexLabelFontFamily: "Garamond",
                                indexLabelFontSize: 20,
                                indexLabelFontWeight: "bold",
                                startAngle:0,
                                indexLabelFontColor: "MistyRose",
                                indexLabelLineColor: "darkgrey",
                                indexLabelPlacement: "inside",
                                toolTipContent: scope.pieTooltip,
                                showInLegend: true,
                                indexLabel: "{percent}%",
                                dataPoints: scope.dataset
                            }
                        ]
                    });
                    chart.render();
                }, true);
            }
        };
    }])
    .directive('chart', [function () {
        return {
            restrict: 'A',
            scope: {
                datalength: "=",
                cumul: "=",
                dataset: "="
            },
            link: function (scope, element, attr) {
                var id = $(element).attr("id");
                var chart;

                scope.$watch("dataset", function() {
                    var axisConf;
                    if(+scope.cumul == 1) {
                        axisConf = {
                            valueFormatString: "DD/MM/YYYY",
                            interval: 1 + (scope.datalength / 6),
                            intervalType: "day"
                        }
                    } else if(+scope.cumul === 2) {
                        axisConf = {
                            valueFormatString: "DD/MM/YYYY",
                            intervalType: "day"
                        }
                    } else if (+scope.cumul === 3) {
                        axisConf = {
                            valueFormatString: "MMM YYYY",
                            interval: 1 + (scope.datalength / 6),
                            intervalType: "month"
                        }
                    } else {
                        axisConf = {
                            valueFormatString: "YYYY",
                            intervalType: "year"
                        }
                    }
                    chart = new CanvasJS.Chart(id, {
                        legend: {
                            cursor: "pointer",
                            itemclick: function(e) {
                                e.dataSeries.visible = !(typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible);
                                chart.render();
                            }
                        },
                        data: scope.dataset,
                        toolTip:{
                            shared: true
                        },
                        axisX: axisConf,
                        axisY: {
                            title: "Nombre de dossiers"
                        },
                        axisY2: {
                            title: "Temps de traitement (s)",
                            stripLines: [{
                                value: 60,
                                label: "1 minute"
                            }, {
                                value: 3600,
                                label: "1 heure"
                            }, {
                                value: 86400,
                                label: "1 jour"
                            }]
                        }
                    });
                    chart.render();
                }, true);
            }
        };
    }])
    .directive('scrollTo', [function() {
        return {
            restrict: 'A',
            scope: {
                scrollId : "@"
            },
            link: function (scope, element, attrs) {
                $(element).click(function() {
                    $(attrs.scrollTo).mCustomScrollbar("scrollTo", "."+attrs.scrollId);
                });
            }
        };
    }])
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .directive('abnTree', function($timeout, configuration) {
        return {
            restrict: 'E',
            templateUrl : "partials/abn_tree_template.html",
            scope: {
                treeData: '=',
                onSelect: '&',
                onClickCheck: '&',
                initialSelection: '=',
                search: '=',
                showCheck : "=",
                showDetail : "=",
                remove: "=",
                array: "=",
                checkRights: "=",
                identifier: "="
            },
            link: function(scope, element, attrs) {

                $timeout(function() {
                    $timeout(function() {
                        var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch;
                        if (attrs.iconExpand == null) {
                            attrs.iconExpand = 'fa-plus-square-o';
                        }
                        if (attrs.iconCollapse == null) {
                            attrs.iconCollapse = 'fa-minus-square-o';
                        }
                        if (attrs.iconLeaf == null) {
                            attrs.iconLeaf = 'fa-sign-blank';
                        }
                        if (attrs.expandLevel == null) {
                            attrs.expandLevel = '3';
                        }
                        expand_level = parseInt(attrs.expandLevel, 10);
                        scope.header = attrs.header;
                        if (!scope.treeData) {
                            alert('no treeData defined for the tree!');
                            return;
                        }
                        if (scope.treeData.length == null) {
                            if (treeData.name != null) {
                                scope.treeData = [treeData];
                            } else {
                                alert('treeData should be an array of root branches');
                            }
                        }
                        for_each_branch = function(f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function(branch, level) {
                                var child, _i, _len, _ref, _results;
                                f(branch, level);
                                if (branch.child != null) {
                                    _ref = branch.child;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                        for_each_branch(function(b) {
                            return b.expanded = (b.profondeur-1) < expand_level;
                        });
                        selected_branch = null;
                        select_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                branch.selected = true;
                                selected_branch = branch;
                                if (branch.onSelect != null) {
                                    return $timeout(function() {
                                        return branch.onSelect(branch);
                                    });
                                } else {
                                    if (scope.onSelect != null) {
                                        return $timeout(function() {
                                            return scope.onSelect({
                                                branch: branch
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        scope.isAdminFonctionnelOf = function(row) {
                            return configuration.isAdminFonctionnelOf(row.branch.id);
                        };
                        scope.user_clicks_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                return select_branch(branch);
                            }
                        };
                        scope.change_check_value = function(event, id) {
                            scope.onClickCheck({checked:event.currentTarget.checked, id:id});
                        };
                        scope.tree_rows = [];
                        on_treeData_change = function() {
                            scope.tree_rows = [];
                            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                            scope.tree_rows = [];
                            for_each_branch(function(branch) {
                                if (branch.child) {
                                    if (branch.child.length > 0) {
                                        /*return branch.child = branch.child.map(function(e) {
                                            if (typeof e === 'string') {
                                                return {
                                                    name: e,
                                                    child: []
                                                };
                                            } else {
                                                return e;
                                            }
                                        });*/
                                    }
                                } else {
                                    //return branch.child = [];
                                }
                            });
                            add_branch_to_list = function(level, branch, visible) {
                                var child, child_visible, tree_icon, _i, _len, _ref, _results;
                                if (branch.expanded == null) {
                                    //Par default, branche déployée
                                    branch.expanded = true;
                                }
                                if (!branch.child || branch.child.length === 0) {
                                    tree_icon = attrs.iconLeaf;
                                } else {
                                    if (branch.expanded) {
                                        tree_icon = attrs.iconCollapse;
                                    } else {
                                        tree_icon = attrs.iconExpand;
                                    }
                                }
                                scope.tree_rows.push({
                                    branch: branch,
                                    name: branch.name,
                                    tree_icon: tree_icon,
                                    visible: visible
                                });
                                if (branch.child != null) {
                                    _ref = branch.child;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        child_visible = visible && branch.expanded;
                                        _results.push(add_branch_to_list(level + 1, child, child_visible));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(add_branch_to_list(1, root_branch, true));
                            }
                            return _results;
                        };
                        if (attrs.initialSelection != null) {
                            for_each_branch(function(b) {
                                if (b.name === attrs.initialSelection) {
                                    return select_branch(b);
                                }
                            });
                        }
                        scope.$on("expandAll", function() {
                            var rows = scope.tree_rows;
                            for(var i = 0; i < rows.length; i++) {
                                rows[i].branch.expanded = true;
                            }
                        });
                        scope.$on("reduceAll", function() {
                            var rows = scope.tree_rows;
                            for(var i = 0; i < rows.length; i++) {
                                rows[i].branch.expanded = false;
                            }
                        });
                        return scope.$watch('treeData', on_treeData_change, true);
                    }, 0);
                }, 0);
            }
        };
    })
    .directive('abnTreeGroups', function($timeout, configuration) {
        return {
            restrict: 'E',
            templateUrl : "partials/abn_tree_template_groups.html",
            scope: {
                treeData: '=',
                onSelect: '&',
                onDelete: '&',
                onClickCheck: '&',
                initialSelection: '=',
                search: '=',
                showCheck : "=",
                showDetail : "=",
                remove: "=",
                array: "=",
                identifier: "="
            },
            link: function(scope, element, attrs) {

                $timeout(function() {
                    $timeout(function() {
                        var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch;
                        if (attrs.iconExpand == null) {
                            attrs.iconExpand = 'fa-plus-square-o';
                        }
                        if (attrs.iconCollapse == null) {
                            attrs.iconCollapse = 'fa-minus-square-o';
                        }
                        if (attrs.iconLeaf == null) {
                            attrs.iconLeaf = 'fa-sign-blank';
                        }
                        if (attrs.expandLevel == null) {
                            attrs.expandLevel = '3';
                        }
                        expand_level = parseInt(attrs.expandLevel, 10);
                        scope.header = attrs.header;
                        if (!scope.treeData) {
                            alert('no treeData defined for the tree!');
                            return;
                        }
                        if (scope.treeData.length == null) {
                            if (treeData.name != null) {
                                scope.treeData = [treeData];
                            } else {
                                alert('treeData should be an array of root branches');
                            }
                        }
                        for_each_branch = function(f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function(branch, level) {
                                var child, _i, _len, _ref, _results;
                                branch.profondeur = level;
                                f(branch);
                                if (branch.subGroups != null) {
                                    _ref = branch.subGroups;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                        for_each_branch(function(b) {
                            return b.expanded = (b.profondeur-1) < expand_level;
                        });
                        selected_branch = null;
                        select_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                branch.selected = true;
                                selected_branch = branch;
                                if (branch.onSelect != null) {
                                    return $timeout(function() {
                                        return branch.onSelect(branch);
                                    });
                                } else {
                                    if (scope.onSelect != null) {
                                        return $timeout(function() {
                                            return scope.onSelect({
                                                branch: branch
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        scope.user_clicks_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                return select_branch(branch);
                            }
                        };
                        scope.user_delete_branch = function(branch) {
                            if (scope.onDelete != null) {
                                return $timeout(function() {
                                    return scope.onDelete({
                                        branch: branch
                                    });
                                });
                            }
                        };
                        scope.change_check_value = function(event, id) {
                            scope.onClickCheck({checked:event.currentTarget.checked, id:id});
                        };
                        scope.tree_rows = [];
                        on_treeData_change = function() {
                            scope.show = false;
                            scope.tree_rows = [];
                            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                            scope.tree_rows = [];
                            for_each_branch(function(b) {
                                //b.expanded = (b.profondeur-1) < expand_level;
                            });
                            add_branch_to_list = function(level, branch, visible) {
                                var child, child_visible, tree_icon, _i, _len, _ref, _results;
                                if (branch.expanded == null) {
                                    //Déployé par defaut
                                    branch.expanded = true;
                                }
                                if (!branch.subGroups || branch.subGroups.length === 0) {
                                    tree_icon = attrs.iconLeaf;
                                } else {
                                    if (branch.expanded) {
                                        tree_icon = attrs.iconCollapse;
                                    } else {
                                        tree_icon = attrs.iconExpand;
                                    }
                                }
                                scope.tree_rows.push({
                                    branch: branch,
                                    name: branch.name,
                                    tree_icon: tree_icon,
                                    visible: visible
                                });
                                if (branch.subGroups != null) {
                                    _ref = branch.subGroups;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        child_visible = visible && branch.expanded;
                                        _results.push(add_branch_to_list(level + 1, child, child_visible));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(add_branch_to_list(1, root_branch, true));
                            }
                            scope.show = true;
                            return _results;
                        };
                        if (attrs.initialSelection != null) {
                            for_each_branch(function(b) {
                                if (b.name === attrs.initialSelection) {
                                    return select_branch(b);
                                }
                            });
                        }
                        return scope.$watch('treeData', on_treeData_change, true);
                    }, 0);
                }, 0);
            }
        };
    })
    .directive('abnTreeTypes', function($timeout, configuration) {
        return {
            restrict: 'E',
            templateUrl : "partials/abn_tree_template_types.html",
            scope: {
                treeData: '=',
                onSelect: '&',
                onDelete: '&',
                onCreate: '&',
                onClickCheck: '&',
                initialSelection: '=',
                search: '=',
                showCheck : "=",
                showDetail : "=",
                remove: "=",
                array: "="
            },
            link: function(scope, element, attrs) {

                $timeout(function() {
                    $timeout(function() {
                        var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch, iconText;
                        if (attrs.iconExpand == null) {
                            iconText = "Déplier";
                            attrs.iconExpand = 'fa-plus-square-o';
                        }
                        if (attrs.iconCollapse == null) {
                            iconText = "Replier";
                            attrs.iconCollapse = 'fa-minus-square-o';
                        }
                        if (attrs.iconLeaf == null) {
                            attrs.iconLeaf = 'fa-sign-blank';
                        }
                        if (attrs.expandLevel == null) {
                            attrs.expandLevel = '3';
                        }
                        expand_level = parseInt(attrs.expandLevel, 10);
                        scope.header = attrs.header;
                        if (!scope.treeData) {
                            alert('no treeData defined for the tree!');
                            return;
                        }
                        if (scope.treeData.length == null) {
                            if (treeData.name != null) {
                                scope.treeData = [treeData];
                            } else {
                                alert('treeData should be an array of root branches');
                            }
                        }
                        for_each_branch = function(f) {
                            var do_f, root_branch, _i, _len, _ref, _results;
                            do_f = function(branch, level) {
                                var child, _i, _len, _ref, _results;
                                branch.profondeur = level;
                                f(branch);
                                if (branch.sousTypes != null) {
                                    _ref = branch.sousTypes;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(do_f(child, level + 1));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(do_f(root_branch, 1));
                            }
                            return _results;
                        };
                        for_each_branch(function(b) {
                            return b.expanded = (b.profondeur-1) < expand_level;
                        });
                        selected_branch = null;
                        select_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                if (selected_branch != null) {
                                    selected_branch.selected = false;
                                }
                                branch.selected = true;
                                selected_branch = branch;
                                if (branch.onSelect != null) {
                                    return $timeout(function() {
                                        return branch.onSelect(branch);
                                    });
                                } else {
                                    if (scope.onSelect != null) {
                                        return $timeout(function() {
                                            return scope.onSelect({
                                                branch: branch
                                            });
                                        });
                                    }
                                }
                            }
                        };
                        scope.user_clicks_branch = function(branch) {
                            if (branch !== selected_branch || !branch.selected) {
                                return select_branch(branch);
                            }
                        };
                        scope.user_delete_branch = function(branch) {
                            if (scope.onDelete != null) {
                                return $timeout(function() {
                                    return scope.onDelete({
                                        branch: branch
                                    });
                                });
                            }
                        };

                        scope.user_create_branch = function(branch) {
                            if (scope.onCreate != null) {
                                return $timeout(function() {
                                    return scope.onCreate({
                                        branch: branch
                                    });
                                });
                            }
                        };
                        var trackId = 1;
                        scope.track = function(branch) {
                            if(!branch.trackId) {
                                branch.trackId = branch.id + " " + trackId++;
                            }
                            return branch.trackId;
                        };

                        scope.change_check_value = function(event, id) {
                            scope.onClickCheck({checked:event.currentTarget.checked, id:id});
                        };

                        scope.filterType = function (row) {
                            return !!row.branch.sousTypes
                                || row.branch.id.toLowerCase().indexOf(scope.search.toLowerCase()) != -1
                                || row.branch.desc.toLowerCase().indexOf(scope.search.toLowerCase()) != -1
                                || (row.branch.parent && row.branch.parent.toLowerCase().indexOf(scope.search.toLowerCase()) != -1);
                        };

                        scope.tree_rows = [];
                        on_treeData_change = function() {
                            scope.show = false;
                            scope.tree_rows = [];
                            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                            scope.tree_rows = [];
                            for_each_branch(function(b) {
                                //b.expanded = (b.profondeur-1) < expand_level;
                            });
                            add_branch_to_list = function(level, branch, visible) {
                                var child, child_visible, tree_icon, _i, _len, _ref, _results;
                                if (branch.expanded == null) {
                                    //branch.expanded = false;
                                }
                                if (!branch.sousTypes || branch.sousTypes.length === 0) {
                                    tree_icon = attrs.iconLeaf;
                                } else {
                                    if (branch.expanded) {
                                        tree_icon = attrs.iconCollapse;
                                    } else {
                                        tree_icon = attrs.iconExpand;
                                    }
                                }
                                scope.tree_rows.push({
                                    branch: branch,
                                    name: branch.name,
                                    tree_icon: tree_icon,
                                    visible: visible,
                                    icon_text : iconText
                                });
                                if (branch.sousTypes != null) {
                                    _ref = branch.sousTypes;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        child_visible = visible && branch.expanded;
                                        _results.push(add_branch_to_list(level + 1, child, child_visible));
                                    }
                                    return _results;
                                }
                            };
                            _ref = scope.treeData;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                root_branch = _ref[_i];
                                _results.push(add_branch_to_list(1, root_branch, true));
                            }
                            scope.show = true;
                            return _results;
                        };
                        if (attrs.initialSelection != null) {
                            for_each_branch(function(b) {
                                if (b.name === attrs.initialSelection) {
                                    return select_branch(b);
                                }
                            });
                        }
                        return scope.$watch('treeData', on_treeData_change, true);
                    }, 0);
                }, 0);
            }
        };
    })
    .directive('annotorious', function(configuration, usSpinnerService) {
        return {
            scope: {
                onCreated: "&",
                onUpdated: "&",
                onRemoved: "&",
                onLoad: "&",
                setPosition: "&",
                loadOn: "=",
                srcBase: "=",
                documentPageListen: "=",
                timestamp: "=",
                signatureMode: "=",
                forCachet: "=",
                versionNumber: "="
            },
            link: function (scope, element, attrs) {

                /**
                 * Suppression de l'ancienne référence à l'objet Annotorious
                 * IMPORTANT
                 * Sinon, on double les références vers les événements, et le plugin est ajouté 2 fois...
                 */
                window.anno=new Annotorious();

                var naturalWidth = 0;
                var naturalHeight = 0;

                var positionSignature = null;

                /**
                 * @private
                 */
                var _create = function(annotation) {
                    annotation.author = configuration.fullname;
                    annotation.date = new Date();
                    var geo = annotation.shapes[0].geometry;

                    annotation.isSignaturePosition = scope.signatureMode;
                    annotation.forCachet = scope.forCachet;
                    annotation.type = "rect";
                    annotation.rect = {
                        topLeft: {
                            x : geo.x * naturalWidth,
                            y: geo.y * naturalHeight
                        },
                        bottomRight: {
                            x: (geo.x + geo.width) * naturalWidth,
                            y: (geo.y + geo.height) * naturalHeight
                        }
                    };
                    annotation.page = scope.documentPageListen.page;
                    annotation.shapes[0].style = {
                        stroke:"rgba(0, 0, 0, 1)",
                        hi_stroke:"rgba(0, 0, 0, 1)",
                        Ce: 2, //outline_width
                        xe: 2, //hi_outline_width
                        Ee: 1, //stroke_width
                        ye: 1 //hi_stroke_width
                    };
                    if(scope.signatureMode) {
                        annotation.shapes[0].style.fill = "rgba(255, 0, 0, 0.1)";
                        annotation.shapes[0].style.hi_fill = "rgba(255, 0, 0, 0.15)";
                    } else {
                        annotation.shapes[0].style.fill = "rgba(0, 0, 255, 0.1)";
                        annotation.shapes[0].style.hi_fill = "rgba(0, 0, 255, 0.15)";
                    }
                    // Suppression puis ajout.... Pour gestion de la couleur !
                    anno.removeAnnotation(annotation);
                    anno.addAnnotation(annotation);
                    if(typeof scope.onCreated === "function" && !scope.signatureMode) {
                        scope.onCreated({annotation: annotation}).then(function(obj) {
                            annotation.id = obj.id;
                        });
                    }
                    if(typeof scope.setPosition === "function" && scope.signatureMode) {
                        scope.setPosition({anno: anno, annotation: annotation});
                    }
                };

                /**
                 * @private
                 */
                var _update = function(annotation) {
                    if(typeof scope.onUpdated === "function") {
                        scope.onUpdated({annotation: annotation});
                    }
                };

                /**
                 * @private
                 */
                var _delete = function(annotation) {
                    if(typeof scope.onRemoved === "function") {
                        scope.onRemoved({annotation: annotation});
                    }
                };

                anno.addHandler('onAnnotationCreated', function(annotation) {
                    _create(annotation);
                });

                anno.addHandler('onAnnotationUpdated', function(annotation) {
                    _update(annotation);
                });

                anno.addHandler('onAnnotationRemoved', function(annotation) {
                    _delete(annotation);
                });

                anno.addHandler('onEditorShown', function(event) {
                    if(scope.signatureMode) {
                        // On cache l'ajout de commentaire, parce que ça ne sert à rien !
                        $('.annotorious-editor-text').hide();
                        if(scope.forCachet) {
                            $('.cachetModeInformation').show();
                            $('.signatureModeInformation').hide();
                        }
                        else {
                            $('.cachetModeInformation').hide();
                            $('.signatureModeInformation').show();
                        }
                    } else {
                        $('.annotorious-editor-text').show();
                        $('.cachetModeInformation').hide();
                        $('.signatureModeInformation').hide();
                    }
                });

                anno.addHandler('onMouseOverAnnotation', function(event) {
                    if(event.K && event.K.isSignaturePosition) {
                        // On cache le commentaire, parce que ça ne sert à rien !
                        $('.commentaireField').parent().hide();
                        $('.annotorious-popup-text').hide();
                        $('.annotorious-popup-button-edit').hide();

                        if(scope.forCachet) {
                            $('.signaturePositionField').parent().hide();
                            $('.cachetPositionField').parent().show();
                        } else {
                            $('.signaturePositionField').parent().show();
                            $('.cachetPositionField').parent().hide();
                        }

                    } else if (event.K) {
                        $('.commentaireField').parent().show();
                        $('.signaturePositionField').parent().hide();
                        $('.cachetPositionField').parent().hide();
                        $('.annotorious-popup-text').show();
                        $('.annotorious-popup-button-edit').show();
                    }
                });

                /**
                 * Created by lhameury on 12/05/14.
                 * Plugin for annotorious library
                 */
                annotorious.plugin.Parapheur = function(opt_config_options) {};

                annotorious.plugin.Parapheur.prototype.onInitAnnotator = function(annotator) {
                    annotator.popup.addField(function(annotation) {
                        return '<em style="color: white;" class="commentaireField">Auteur: ' + annotation.author + '</em>';
                    });

                    annotator.popup.addField(function(annotation) {
                        return '<em style="color: lightgray; padding-left: 15px;" class="signaturePositionField">Position de signature</em>';
                    });
                    annotator.popup.addField(function(annotation) {
                        return '<em style="color: lightgray; padding-left: 15px;" class="cachetPositionField">Position de cachet serveur</em>';
                    });


                    annotator.popup.addField(function(annotation) {
                        return '<em style="color: white;" class="commentaireField">Création: ' + $.datepicker.formatDate("dd/mm/yy", annotation.date) + '</em>';
                    });
                    annotator.editor.addField(function() {
                        return '<em class="signatureModeInformation" style="color: lightgray; padding-left: 15px;">Position de signature</em>';
                    });
                    annotator.editor.addField(function() {
                        return '<em class="cachetModeInformation" style="color: lightgray; padding-left: 15px;">Position de cachet serveur</em>';
                    });
                };

                var isLoaded = false;

                anno.addPlugin("Parapheur", {});
                anno.setProperties({
                    stroke:"rgba(0, 255, 0, 0.1)",
                    fill:"rgba(0, 255, 0, 0.1)",
                    hi_fill:"rgba(0, 255, 0, 0.15)"
                });

                var loadImg = function() {
                    if(scope.srcBase) {

                        element.children().remove();
                        usSpinnerService.spin("spinnerLoading");

                        var img = new Image();
                        img.onload = function() {

                            naturalWidth = this.naturalWidth;
                            naturalHeight = this.naturalHeight;

                            //IE HAX ! Si "height" de l'image n'est pas défini dès le début en pourcentage, il n'est plus possible de le redéfinir par la suite...
                            $(img).css("height", "0%");

                            element.append(img);
                            angular.element(img).addClass("annotatable");
                            anno.reset();
                            positionSignature = null;

                            if(typeof scope.onLoad === "function") {
                                scope.onLoad({anno: anno, width: naturalWidth, height: naturalHeight});
                            }
                            scope.$emit("annotoriousLoaded");
                            usSpinnerService.stop("spinnerLoading")
                        };
                        img.onerror = function() {
                            element.append('<span class="text-danger"><i class="fa fa-times"></i> Erreur lors de la récupération de la page '+ (+scope.documentPageListen.page + 1) +' du document.</span>');
                            usSpinnerService.stop("spinnerLoading")
                        };

                        // The version tag is never used, but it avoid the navigator cache when we change the main document.
                        // Since the documentId isn't changed, we use it to artificially change the source URL.
                        img.src = scope.srcBase + (+scope.documentPageListen.page) + "?version=" + scope.versionNumber;
                    }
                };

                scope.$watch("loadOn", function() {
                    isLoaded = true;
                    loadImg();
                });

                scope.$watch("documentPageListen", function() {
                    if (isLoaded) {
                        loadImg();
                    }
                });

                scope.$watch("signatureMode", function() {
                    if (scope.signatureMode) {

                    } else {
                    }
                });

                var resize = function() {
                    if(isLoaded) {
                        anno.reset();
                        if(typeof scope.onLoad === "function") {
                            scope.onLoad({anno: anno, width: naturalWidth, height: naturalHeight});
                        }
                    }
                };

                window.onresize = function() {
                    resize();
                };

                scope.$on("resizeAnnotation", function() {
                    resize();
                })
            }
        };
    }).
    directive('isVisibleDash',function ($timeout) {
        //Pour les tabs (page d'options)
        return {
            scope: {
                listenOn: "=",
                isVisible: "="
            },
            link: function (scope, element, attrs) {
                scope.$watch("listenOn", function() {
                    //Wait for ng-repeat to render
                    $timeout(function() {
                        scope.isVisible = element.children("li").children("div:hidden").length !== element.children("li").children("div").length;
                    }, 300);
                }, true)
            }
        };
    }).
    directive('imageonload', function() {
        return {
            scope: {
                imageonload: "&"
            },
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    scope.imageonload();
                });
            }
        };
    }).
    directive('fixbottom', function(utils, $timeout) {
        return {
            restrict: 'C',
            link: function(scope, element, attrs) {
                $timeout(function() {
                    setHeight();
                });
                var setHeight = function() {
                    var size = utils.windowSize();
                    var position = $(element).offset();
                    if (position != undefined) {
                        var height = size.height - position.top;

                        var marginSize = +$(element).css("marginBottom").replace("px", "");

                        $(element).css("height", height - marginSize);
                    }
                };

                scope.$on("fixbottom", function() {
                    setHeight();
                });

                window.onresize = function() {
                    setHeight();
                };


            }
        }
    }).
    directive('dropzone', function() {
       return {
           restrict: 'A',
           link: function(scope, element, attrs) {
               $(window).draghover().on({
                   'draghoverend': function() {
                       var dropZone = $('.dropzone');
                       dropZone.removeClass('in hover show');
                   }
               });
               $(document).bind('dragover', function (e)
               {
                   var dropZone = $('.dropzone'),
                       foundDropzone;

                   $(dropZone).bind('drop', function(e) {
                       dropZone.removeClass('in hover show');
                   });

                   dropZone.addClass('show');

                   var found = false,
                       node = e.target;

                   do{

                       if ($(node).hasClass('dropzone'))
                       {
                           found = true;
                           foundDropzone = $(node);
                           break;
                       }

                       node = node.parentNode;

                   }while (node != null);

                   dropZone.removeClass('in hover');

                   if (found)
                   {
                       foundDropzone.addClass('in hover');
                   }
               });
           }
       }
    }).
    directive('headertop', function(utils) {
        return {
            restrict: 'C',
            link: function(scope, element, attrs) {
                var size = attrs.removeonsize;
                var hasInit = false;

                var setClasses = function() {
                    var ret = false;
                    if($(window).width() <= size && hasClass) {
                        $(element).css("top", "");
                        $(element).removeClass(attrs.classesList);
                    } else if($(window).width() > size && !hasClass) {
                        $(element).css("top", $("header").height());
                        $(element).addClass(attrs.classesList);
                        ret = true;
                    } else if(hasClass && !hasInit) {
                        hasInit = true;
                        ret = true;
                        $(element).css("top", $("header").height());
                    }
                    return ret;
                };

                var hasClass = true;
                hasClass = setClasses();

                var sem = false;

                window.onresize = function() {
                    if(!sem) {
                        sem = true;
                        hasClass = setClasses();
                        sem = false;
                    }
                };
            }
        }
    });
