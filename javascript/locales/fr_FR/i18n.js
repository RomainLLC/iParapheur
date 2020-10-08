(function () {
var i18n = window.i18n = window.i18n || {},
    MessageFormat = {locale: {}};

MessageFormat.locale.fr=function(n){return n===0||n==1?"one":"other"}

var
c=function(d){if(!d)throw new Error("MessageFormat: No data passed to function.")},
n=function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: `"+k+"` isnt a number.");return d[k]-(o||0)},
v=function(d,k){c(d);return d[k]},
p=function(d,k,o,l,p){c(d);return d[k] in p?p[d[k]]:(k=MessageFormat.locale[l](d[k]-o),k in p?p[k]:p.other)},
s=function(d,k,p){c(d);return d[k] in p?p[d[k]]:p.other};

i18n["\x0a                    Erreur : Le type de fichier séléctionné n\x27est pas géré par le i-Parapheur.\x0a                "] = function(d){return "Erreur : Le type de fichier séléctionné n'est pas géré par le i-Parapheur."};

i18n["\x0a                    Erreur : Le visuel doit être un fichier PDF.\x0a                "] = function(d){return "Erreur : Le visuel doit être un fichier PDF."};

i18n["\x0a            Chargement de l\x27aperçu du dossier...\x0a        "] = function(d){return "Chargement de l'aperçu du dossier..."};

i18n["\x0a            Impossible de charger la visionneuse xemelios\x0a        "] = function(d){return "Impossible de charger la visionneuse xemelios"};

i18n[" Obligatoire"] = function(d){return "Obligatoire"};

}());
