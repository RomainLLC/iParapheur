(function () {
var i18n = window.i18n = window.i18n || {},
    MessageFormat = {locale: {}};

MessageFormat.locale.en=function(n){return n===1?"one":"other"}

var
c=function(d){if(!d)throw new Error("MessageFormat: No data passed to function.")},
n=function(d,k,o){if(isNaN(d[k]))throw new Error("MessageFormat: `"+k+"` isnt a number.");return d[k]-(o||0)},
v=function(d,k){c(d);return d[k]},
p=function(d,k,o,l,p){c(d);return d[k] in p?p[d[k]]:(k=MessageFormat.locale[l](d[k]-o),k in p?p[k]:p.other)},
s=function(d,k,p){c(d);return d[k] in p?p[d[k]]:p.other};

i18n["\x0a                    Erreur : Le type de fichier séléctionné n\x27est pas géré par le i-Parapheur.\x0a                "] = function(d){return "0Erreur : Le type de fichier séléctionné n'est pas géré par le i-Parapheur."};

i18n["\x0a                    Erreur : Le visuel doit être un fichier PDF.\x0a                "] = function(d){return "0Erreur : Le visuel doit être un fichier PDF."};

i18n["\x0a            Chargement de l\x27aperçu du dossier...\x0a        "] = function(d){return "0Chargement de l'aperçu du dossier..."};

i18n["\x0a            Impossible de charger la visionneuse xemelios\x0a        "] = function(d){return "0Impossible de charger la visionneuse xemelios"};

i18n[" Obligatoire"] = function(d){return "0Obligatoire"};

i18n["Action en cours de traitement. Dossier suivant sélectionné."] = function(d){return "0Action en cours de traitement. Dossier suivant sélectionné."};

i18n["Actions"] = function(d){return "0Actions"};

i18n["Actualisation du dossier, merci de patienter..."] = function(d){return "0Actualisation du dossier, merci de patienter..."};

i18n["Agencement de l\x27écran sauvegardé."] = function(d){return "0Agencement de l'écran sauvegardé."};

i18n["Ajouter une signature au dossier"] = function(d){return "0Ajouter une signature au dossier"};

i18n["Annotation privée"] = function(d){return "0Annotation privée"};

i18n["Annotation publique"] = function(d){return "0Annotation publique"};

i18n["Annotations publiques"] = function(d){return "0Annotations publiques"};

i18n["Annoter"] = function(d){return "0Annoter"};

i18n["Annuler"] = function(d){return "0Annuler"};

i18n["Aucun document"] = function(d){return "0Aucun document"};

i18n["Aucun dossier trouvé"] = function(d){return "0Aucun dossier trouvé"};

i18n["Aucun visuel à afficher"] = function(d){return "0Aucun visuel à afficher"};

i18n["Chargement de la visionneuse xemelios en cours..."] = function(d){return "0Chargement de la visionneuse xemelios en cours..."};

i18n["Circuit de validation"] = function(d){return "0Circuit de validation"};

i18n["Classification"] = function(d){return "0Classification"};

i18n["Créations"] = function(d){return "0Créations"};

i18n["Cumul par"] = function(d){return "0Cumul par"};

i18n["Cumulatif"] = function(d){return "0Cumulatif"};

i18n["Date de la décision"] = function(d){return "0Date de la décision"};

i18n["Debut"] = function(d){return "0Debut"};

i18n["Demande d\x27avis complémentaire"] = function(d){return "0Demande d'avis complémentaire"};

i18n["Disabled"] = function(d){return "0Disabled"};

i18n["Dossier"] = function(d){return "0Dossier"};

i18n["Dossier déplacé, archivé ou supprimé."] = function(d){return "0Dossier déplacé, archivé ou supprimé."};

i18n["Dossiers Créés"] = function(d){return "0Dossiers Créés"};

i18n["Dossiers Emis"] = function(d){return "0Dossiers Emis"};

i18n["Dossiers Instruits"] = function(d){return "0Dossiers Instruits"};

i18n["Dossiers Refusés"] = function(d){return "0Dossiers Refusés"};

i18n["Dossiers Traités"] = function(d){return "0Dossiers Traités"};

i18n["Dossiers en délégation"] = function(d){return "0Dossiers en délégation"};

i18n["Emissions"] = function(d){return "0Emissions"};

i18n["En cours"] = function(d){return "0En cours"};

i18n["En fin de circuit"] = function(d){return "0En fin de circuit"};

i18n["En retard"] = function(d){return "0En retard"};

i18n["Enchaîner un circuit"] = function(d){return "0Enchaîner un circuit"};

i18n["Envoyer au secrétariat"] = function(d){return "0Envoyer au secrétariat"};

i18n["Envoyer par e-mail"] = function(d){return "0Envoyer par e-mail"};

i18n["Extension attendue : .p7s ou .sig"] = function(d){return "0Extension attendue : .p7s ou .sig"};

i18n["Faux"] = function(d){return "0Faux"};

i18n["Filtre par types"] = function(d){return "0Filtre par types"};

i18n["Filtres disponibles :"] = function(d){return "0Filtres disponibles :"};

i18n["Fin"] = function(d){return "0Fin"};

i18n["Générer"] = function(d){return "0Générer"};

i18n["Imprimer"] = function(d){return "0Imprimer"};

i18n["Instructions"] = function(d){return "0Instructions"};

i18n["Jour"] = function(d){return "0Jour"};

i18n["Journal d\x27événements"] = function(d){return "0Journal d'événements"};

i18n["Le fichier"] = function(d){return "0Le fichier"};

i18n["Liste personnalisée"] = function(d){return "0Liste personnalisée"};

i18n["Mise à jour visuel..."] = function(d){return "0Mise à jour visuel..."};

i18n["Mois"] = function(d){return "0Mois"};

i18n["Métadonnées sauvegardées"] = function(d){return "0Métadonnées sauvegardées"};

i18n["Nature"] = function(d){return "0Nature"};

i18n["Numéro de l\x27acte"] = function(d){return "0Numéro de l'acte"};

i18n["Objet"] = function(d){return "0Objet"};

i18n["Obligatoire"] = function(d){return "0Obligatoire"};

i18n["Page précédente"] = function(d){return "0Page précédente"};

i18n["Page suivante"] = function(d){return "0Page suivante"};

i18n["Pas de circuit défini pour ce dossier"] = function(d){return "0Pas de circuit défini pour ce dossier"};

i18n["Periode"] = function(d){return "0Periode"};

i18n["Personnalisé"] = function(d){return "0Personnalisé"};

i18n["Refus"] = function(d){return "0Refus"};

i18n["Remplacement..."] = function(d){return "0Remplacement..."};

i18n["Retournés"] = function(d){return "0Retournés"};

i18n["Récupérables"] = function(d){return "0Récupérables"};

i18n["Résultat"] = function(d){return "0Résultat"};

i18n["Sans filtre"] = function(d){return "0Sans filtre"};

i18n["Sauvegarde..."] = function(d){return "0Sauvegarde..."};

i18n["Sauvegarder les métadonnées"] = function(d){return "0Sauvegarder les métadonnées"};

i18n["Semaine"] = function(d){return "0Semaine"};

i18n["Signature sauvegardée"] = function(d){return "0Signature sauvegardée"};

i18n["Sous-Type"] = function(d){return "0Sous-Type"};

i18n["Sous-type"] = function(d){return "0Sous-type"};

i18n["Statistiques"] = function(d){return "0Statistiques"};

i18n["Statut TdT"] = function(d){return "0Statut TdT"};

i18n["Suppression..."] = function(d){return "0Suppression..."};

i18n["Traitements"] = function(d){return "0Traitements"};

i18n["Traités"] = function(d){return "0Traités"};

i18n["Transférer le dossier à signer"] = function(d){return "0Transférer le dossier à signer"};

i18n["Type"] = function(d){return "0Type"};

i18n["Types"] = function(d){return "0Types"};

i18n["Valider"] = function(d){return "0Valider"};

i18n["Visibilité"] = function(d){return "0Visibilité"};

i18n["Vrai"] = function(d){return "0Vrai"};

i18n["existe déjà !"] = function(d){return "0existe déjà !"};

i18n["lu"] = function(d){return "0lu"};

i18n["non lu"] = function(d){return "0non lu"};

i18n["À traiter"] = function(d){return "0À traiter"};

i18n["À transmettre"] = function(d){return "0À transmettre"};

i18n["À venir"] = function(d){return "0À venir"};

}());
