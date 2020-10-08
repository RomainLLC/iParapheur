/*global $, i18n, document, localStorage*/

//Validé JSLint

//i18n
//Temps de chargement d'un fichier de traduction actuel = > environ 20ms

$(document).ready(function () {
    // Correction
    var doI18n = function() {
        var lang = user.preferences.language;
        $.i18n.init({
            lng: lang,
            ns: { namespaces: ['ns.special'], defaultNs: 'ns.special'},
            resGetPath: urlContext+'/res/locales/__lng__/__ns__.json',
            useLocalStorage: false
        }, function () {
            //Internationnalisation lors de premier chargement du fichier
            $(document).i18n();
            //Trigger evenement indiquant la fin de la traduction de la page web
            $(document).trigger("i18nApplied");
        });
    }
    try {
        loadObjects(user);
        if(user.preferences.isDefault) {
            $(document).on("userPrefsInit", function() {
                doI18n();
            })
        } else {
            doI18n();
        }
    } catch (e) {
        //Sur la page de login
    }
});

function i18nFromLogin() {
    //Chargement de l'user et récupération du langage favoris'
    var lang = "fr";
    // Correction
    $.i18n.init({
        lng: lang,
        ns: { namespaces: ['ns.special'], defaultNs: 'ns.special'},
        resGetPath: urlContext+'/res/locales/__lng__/__ns__.json',
        useLocalStorage: false,
    }, function () {
        //Internationnalisation lors de premier chargement du fichier
        $("body").i18n();
        //Trigger evenement indiquant la fin de la traduction de la page web
        $(document).trigger("i18nApplied");
    });
}