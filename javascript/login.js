
$(document).ready(function () {
    i18nFromLogin();
    localStorage.removeItem("ip-preferences");
    localStorage.removeItem("ip-navigation");
    var successPage = (location.origin + location.pathname + location.hash + location.search).replace("login", "").replace("?error=true", "");
    var errorPage = successPage + "?error=true";

    var isInError = location.href.split('error=')[1] === "true";

    $("#successPage").val(successPage);
    $("#errorPage").val(errorPage);
    if(isInError) {
        $("#errorMsg").show();
    }

    function UrlExists(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }

    var logoFilename = location.origin + location.pathname + "/themes/logo-collectivite.jpg";
    if(UrlExists(logoFilename)) {
        $("#coll-logo").show();
    }

    $(".forget-password").on('click', function() {
        $("[id^=state-]").hide();
        $("#login-form").fadeOut(200, function() {
            $("#forgot-form").fadeIn(200);
        });

    });

    $(".btn-cancel").on('click', function() {
        $("[id^=state-]").hide();
        $("#forgot-form").fadeOut(200, function() {
            $("#login-form").fadeIn(200);
        });

    });

    $(".btn-reset").on('click', function() {
        $("[id^=state-]").hide();
        $.ajax({
            url: (location.origin + location.pathname + "proxy/alfresco-noauth/parapheur/utilisateurs/passwordresetrequest").replace("service/", ""),
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify($("#reset-password-form").serializeFormJSON()),
            statusCode: {
                503: function() {
                    $("#state-ban").show();
                },
                500: function() {
                    $("#state-error").show();
                }
            },
            success : function(result) {
                switch(result.result) {
                    case "0":
                        $("#state-ok").show();
                        break;
                    case "1":
                        $("#state-ko").show();
                        break;
                    case "2":
                        $("#state-ldap").show();
                        break;
                    default:
                }
            }
        })
    });

    $("#change-password-btn").on('click', function() {
        $("[id^=state-]").hide();

        var jsonData = $("#reset-password-form").serializeFormJSON();

        if(jsonData.password !== jsonData.passwordconfirm) {
            $("#state-confirm").show();
            return;
        }

        var result = zxcvbn(jsonData.password);
        if(result.score < 3) {
            $("#state-force").show();
            return;
        }

        jsonData.uuid = findGetParameter("uuid");
        var context = location.pathname.split("/")[location.pathname.split("/").length - 2];

        if(context.length !== 0) {
            context = "/" + context;
        }

        $.ajax({
            url: location.origin + context + "/proxy/alfresco-noauth/parapheur/utilisateurs/passwordreset",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(jsonData),
            success : function(result) {
                switch(result.result) {
                    case "0":
                        $("#state-ok").show();
                        setTimeout(function(){ window.location = location.origin; }, 2000);
                        break;
                    case "1":
                        $("#state-ko").show();
                        break;
                    case "2":
                        $("#state-ldap").show();
                        break;
                    default:
                }
            }, error: function() {
                $("#state-error").show();
            }
        })
    });


});

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);
