angular.module('templates-parapheur', ['partials/abn_tree_template.html', 'partials/abn_tree_template_groups.html', 'partials/abn_tree_template_types.html', 'partials/adminNavbar.html', 'partials/bureau.html', 'partials/dashlets/actions.html', 'partials/dashlets/annotations.html', 'partials/dashlets/annoter.html', 'partials/dashlets/annotindex.html', 'partials/dashlets/circuit.html', 'partials/dashlets/details-dossier.html', 'partials/dashlets/liste-dossiers.html', 'partials/dashlets/nom-dossier.html', 'partials/dashlets/postit.html', 'partials/modal.html', 'partials/modals/actesModal.html', 'partials/modals/archiveModal.html', 'partials/modals/askPasswordModal.html', 'partials/modals/bureauxModal.html', 'partials/modals/chainModal.html', 'partials/modals/colorationModal.html', 'partials/modals/confirmForceModal.html', 'partials/modals/confirmationModal.html', 'partials/modals/extensionHelpModal.html', 'partials/modals/healthModal.html', 'partials/modals/inputModal.html', 'partials/modals/journalModal.html', 'partials/modals/mailModal.html', 'partials/modals/mailsecInfosModal.html', 'partials/modals/mailsecModal.html', 'partials/modals/mandatoryReadModal.html', 'partials/modals/moveModal.html', 'partials/modals/notificationModal.html', 'partials/modals/overrideS2low.html', 'partials/modals/pesPropertiesTenant.html', 'partials/modals/printModal.html', 'partials/modals/propertiesModal.html', 'partials/modals/readConfirmModal.html', 'partials/modals/rejectModal.html', 'partials/modals/signPapierConfirmationModal.html', 'partials/modals/signPapierModal.html', 'partials/modals/simpleConfirmationModal.html', 'partials/modals/tdtModal.html', 'partials/modals/utilisateursModal.html', 'partials/modals/validationModal.html', 'partials/passwordStrength.html', 'templates/about.html', 'templates/admin/avance.html', 'templates/admin/avance/archiland.html', 'templates/admin/avance/attestation.html', 'templates/admin/avance/cachet.html', 'templates/admin/avance/calque.html', 'templates/admin/avance/fasthelios.html', 'templates/admin/avance/horodatage.html', 'templates/admin/avance/mail.html', 'templates/admin/avance/metadonne.html', 'templates/admin/avance/model.html', 'templates/admin/avance/pastellmailsec.html', 'templates/admin/avance/slowactes.html', 'templates/admin/avance/slowhelios.html', 'templates/admin/avance/slowmailsec.html', 'templates/admin/avance/srcihelios.html', 'templates/admin/bureaux.html', 'templates/admin/circuits.html', 'templates/admin/dossiers.html', 'templates/admin/groupes.html', 'templates/admin/informations.html', 'templates/admin/nodebrowser.html', 'templates/admin/script.html', 'templates/admin/stats.html', 'templates/admin/tenants.html', 'templates/admin/typologie.html', 'templates/admin/utilisateurs.html', 'templates/admin/workers.html', 'templates/apercu.html', 'templates/archives.html', 'templates/bureaux.html', 'templates/dashboard.html', 'templates/delegation.html', 'templates/logout.html', 'templates/nouveau.html', 'templates/options.html', 'templates/options/archives.html', 'templates/options/dashboard.html', 'templates/options/informations.html', 'templates/options/langue.html', 'templates/options/notifications.html', 'templates/options/orderBureaux.html', 'templates/options/signature.html', 'templates/options/theme.html', 'templates/policy.html', 'templates/stats.html', 'templates/topbar.html']);

angular.module("partials/abn_tree_template.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/abn_tree_template.html",
    "<script type=\"text/ng-template\"  id=\"popover_renderer\">\n" +
    "    <div ng-show=\"row.branch.proprietaires.length > 0\" class=\"text-success\">\n" +
    "        {{'Admin.Bureaux.Bu_Prop' | translate}} :\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"user in row.branch.proprietaires\">{{user.firstName}} {{user.lastName}} ({{user.username}})</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <hr ng-show=\"row.branch.secretaires.length > 0 && row.branch.proprietaires.length > 0\"/>\n" +
    "    <div ng-show=\"row.branch.secretaires.length > 0\" class=\"text-warning\">\n" +
    "        {{'Admin.Bureaux.Bu_Sec' | translate}} :\n" +
    "        <ul>\n" +
    "            <li ng-repeat=\"user in row.branch.secretaires\">{{user.firstName}} {{user.lastName}} ({{user.username}})</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\"  id=\"popover_delegation\">\n" +
    "    <div class=\"text-muted\">\n" +
    "        <h4>{{'Admin.Bureaux.Bu_Deleg' | translate}} :</h4>\n" +
    "        <div>\n" +
    "            <span ng-if=\"row.branch.delegation['date-debut-delegation']\"><strong>{{'Admin.Bureaux.Bu_Begin' | translate}} :</strong> Le {{row.branch.delegation['date-debut-delegation'] | date:'fullDate'}}</span><br>\n" +
    "            <span ng-if=\"row.branch.delegation['date-fin-delegation']\"><strong>{{'Admin.Bureaux.Bu_Fin' | translate}} :</strong> Le {{row.branch.delegation['date-fin-delegation'] | date:'fullDate'}}</span><br>\n" +
    "            <span><strong>{{'Admin.Bureaux.Bu_Target' | translate}} :</strong> {{row.branch.delegation.titreCible}}</span><br>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>\n" +
    "\n" +
    "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">\n" +
    "    <li ng-show=\"header\" class=\"nav-header\">{{ header }}</li>\n" +
    "    <li ng-hide=\"checkRights && !isAdminFonctionnelOf(row)\" ng-repeat=\"row in tree_rows | filter:{visible:true} | filter:search track by row.branch.id\" ng-class=\"'level-' + (row.branch.profondeur +1) + (row.branch.selected ? ' active':'')\" class=\"abn-tree-row abn-tree-animate\">\n" +
    "\n" +
    "        <a ng-if=\"!showCheck\" ng-click=\"user_clicks_branch(row.branch)\">\n" +
    "            <i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon fa\"> </i>\n" +
    "            <span class=\"indented tree-label\">{{ row.branch.title }}</span>\n" +
    "            <div ng-if=\"row.branch.proprietaires.length > 0 || row.branch.secretaires.length > 0\" ng-show=\"showDetail\" class=\"fa fa-user pull-right\" popover-placement=\"right\"\n" +
    "               bs-popover=\"'popover_renderer'\" data-trigger=\"hover\">\n" +
    "            </div>\n" +
    "            <div ng-if=\"row.branch.delegation.idCible\" ng-show=\"showDetail\" ng-class=\"row.branch.selected ? '' : 'text-warning'\" class=\"fa fa-share icon2-tree\" popover-placement=\"right\"\n" +
    "                 bs-popover=\"'popover_delegation'\" data-trigger=\"hover\">\n" +
    "            </div>\n" +
    "        </a>\n" +
    "        <div ng-if=\"showCheck\">\n" +
    "            <input class=\"unvalidate\" ng-show=\"showCheck\" id=\"{{row.branch.id + identifier}}\" name=\"{{row.branch.id + identifier}}\" type=\"checkbox\" ng-click=\"change_check_value($event, row.branch.id)\" ng-checked=\"array.indexOf(row.branch.id) != -1\" ng-disabled=\"row.branch.id == remove\">\n" +
    "            <i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon fa\"> </i>\n" +
    "            <label for=\"{{row.branch.id + identifier}}\" style=\"font-weight: normal;\"  class=\"indented tree-label\">{{ row.branch.title }}</label>\n" +
    "            <div ng-show=\"showDetail\" class=\"fa fa-user pull-right\" popover-placement=\"right\"\n" +
    "                 bs-popover=\"'popover_renderer'\" data-trigger=\"hover\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("partials/abn_tree_template_groups.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/abn_tree_template_groups.html",
    "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">\n" +
    "    <li ng-show=\"header\" class=\"nav-header\">{{ header }}</li>\n" +
    "    <li ng-show=\"show\" ng-repeat=\"row in tree_rows | filter:{visible:true} | filter:search track by row.branch.id\" ng-class=\"'level-' + (row.branch.profondeur) + (row.branch.selected ? ' active':'')\" class=\"abn-tree-row abn-tree-animate\">\n" +
    "\n" +
    "        <a ng-if=\"!showCheck\" ng-click=\"user_clicks_branch(row.branch)\">\n" +
    "            <i ng-class=\"row.tree_icon\" ng-init=\"row.branch.expanded = true\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon fa\"> </i>\n" +
    "            <span class=\"indented tree-label\">{{row.branch.shortName}}</span>\n" +
    "            <i ng-if=\"row.branch.shortName !== 'ALFRESCO_ADMINISTRATORS' && row.branch.shortName !== 'GESTIONNAIRE_CIRCUITS_IPARAPHEUR'\" ng-click=\"user_delete_branch(row.branch)\" tooltip=\"Supprimer\" class=\"fa fa-trash-o\" style=\"color:red; float:right;\"></i>\n" +
    "        </a>\n" +
    "\n" +
    "        <div ng-if=\"showCheck\">\n" +
    "            <input class=\"unvalidate\" ng-show=\"showCheck\" type=\"checkbox\" name=\"{{row.branch.id + identifier}}\" id=\"{{row.branch.id + identifier}}\" ng-click=\"change_check_value($event, row.branch.id)\" ng-checked=\"array.indexOf(row.branch.id) != -1\" ng-disabled=\"row.branch.id == remove\">\n" +
    "            <i ng-class=\"row.tree_icon\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon fa\"> </i>\n" +
    "            <label for=\"{{row.branch.id + identifier}}\" style=\"font-weight: normal;\" class=\"indented tree-label\">{{ row.branch.shortName }}</label>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("partials/abn_tree_template_types.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/abn_tree_template_types.html",
    "<ul class=\"well nav nav-list nav-pills nav-stacked abn-tree fixbottom\">\n" +
    "    <li ng-show=\"header\" class=\"nav-header\">{{ header }}</li>\n" +
    "    <li ng-show=\"show\"\n" +
    "        ng-repeat=\"row in tree_rows | filter:{visible:true} | filter:filterType track by track(row.branch)\"\n" +
    "        ng-class=\"(row.branch.parent !== undefined ? 'subtype-row' : 'level-' + (row.branch.profondeur))  + (row.branch.selected ? ' active ':'')\"\n" +
    "        class=\"abn-tree-row abn-tree-animate\">\n" +
    "        <hr ng-if=\"row.branch.profondeur === 1 && $index > 0\">\n" +
    "        <a ng-click=\"user_clicks_branch(row.branch)\" ng-init=\"row.branch.expanded = true\">\n" +
    "            <i class=\"fa fa-plus-square-o indented tree-icon\" tooltip=\"Déplier\" ng-if=\"!row.branch.expanded && row.branch.profondeur === 1\" ng-click=\"row.branch.expanded = !row.branch.expanded\"></i>\n" +
    "            <i class=\"fa fa-minus-square-o indented tree-icon\" tooltip=\"Replier\" ng-if=\"row.branch.expanded && row.branch.profondeur === 1\" ng-click=\"row.branch.expanded = !row.branch.expanded\"></i>\n" +
    "            <!--i ng-class=\"row.tree_icon\" tooltip=\"{{row.icon_text}}\" ng-init=\"row.branch.expanded = true\" ng-click=\"row.branch.expanded = !row.branch.expanded\" class=\"indented tree-icon fa\"> </i-->\n" +
    "            <span class=\"indented tree-label\">{{row.branch.id}}</span>\n" +
    "            <span style=\"float:right;\">\n" +
    "                <span style=\"margin:8px;\" class=\"label label-success create-type\" ng-click=\"user_create_branch(row.branch)\" ng-if=\"row.branch.parent === undefined\"\">\n" +
    "                    <i  class=\"fa fa-plus-circle\"></i>\n" +
    "                    Ajouter un sous-type\n" +
    "                </span>\n" +
    "                <i ng-click=\"user_delete_branch(row.branch)\" ng-class=\"row.branch.selected ? 'text-inverse' : 'text-danger'\" tooltip-placement=\"bottom\" tooltip=\"{{'Delete' | translate}}\" class=\"fa fa-trash-o\"></i>\n" +
    "            </span>\n" +
    "\n" +
    "            <p ng-if=\"row.branch.parent === undefined\" ng-class=\"'level-' + (row.branch.profondeur)\">\n" +
    "                <span  class=\"indented\" ng-class=\"row.branch.selected ? '':'text-warning'\">{{row.branch.desc}}</span>\n" +
    "            </p>\n" +
    "        </a>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("partials/adminNavbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/adminNavbar.html",
    "<div ng-if=\"config.isAdmin || config.isAdminFonctionnel()\" class=\"adminMenu label-info\">\n" +
    "   <span><i class=\"fa fa-bars\"></i> Menu</span>\n" +
    "</div>\n" +
    "<h1 class=\"underscore\">\n" +
    "    <i class='fa fa-wrench'></i>\n" +
    "    {{'adminNavbar.Administration' | translate}}\n" +
    "</h1>\n" +
    "<div class=\"bs-sidebar affix\" role=\"complementary\">\n" +
    "    <ul class=\"nav bs-sidenav\">\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/informations'}\">\n" +
    "            <a href=\"#/admin/informations\"><i class=\"fa fa-tachometer\"></i> {{'adminNavbar.Server_information' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/utilisateurs'}\">\n" +
    "            <a href=\"#/admin/utilisateurs\"><i class=\"fa fa-user\"></i> {{'adminNavbar.Users' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/groupes'}\">\n" +
    "            <a href=\"#/admin/groupes\"><i class=\"fa fa-group\"></i> {{'adminNavbar.Groups' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin || config.isAdminFonctionnel()\" ng-class=\"{active:pagename() == '/admin/bureaux'}\">\n" +
    "            <a href=\"#/admin/bureaux\"><i class=\"fa fa-desktop\"></i> {{'adminNavbar.Desks' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin || config.isAdminCircuits()\" ng-class=\"{active:pagename() == '/admin/circuits'}\">\n" +
    "            <a href=\"#/admin/circuits\"><i class=\"fa fa-road\"></i> {{'adminNavbar.Circuits' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/typologie'}\">\n" +
    "            <a href=\"#/admin/typologie\"><i class=\"fa fa-book\"></i> {{'adminNavbar.Folders_typology' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin || config.isAdminFonctionnel()\" ng-class=\"{active:pagename() == '/admin/dossiers'}\">\n" +
    "            <a href=\"#/admin/dossiers\"><i class=\"fa fa-folder-open-o\"></i> {{'adminNavbar.Folders' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/stats'}\">\n" +
    "            <a href=\"#/admin/stats\"><i class=\"fa fa-bar-chart-o\"></i> {{'adminNavbar.Statistics' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin\" ng-class=\"{active:pagename() == '/admin/avance'}\">\n" +
    "            <a href=\"#/admin/avance\"><i class=\"fa fa-cog\"></i> {{'adminNavbar.Advanced' | translate}}</a>\n" +
    "        </li>\n" +
    "        <li ng-if=\"config.isAdmin && !config.tenant && isMTEnabled\" ng-class=\"{active:pagename() == '/admin/tenants'}\">\n" +
    "            <a href=\"#/admin/tenants\"><i class=\"fa fa-building\"></i> {{'adminNavbar.Collectivities' | translate}}</a>\n" +
    "        </li>\n" +
    "        <!--li ng-if=\"config.isAdmin && properties['parapheur.ihm.admin.mode.advanced'] === 'true'\" ng-class=\"{active:pagename() == '/admin/nodebrowser'}\">\n" +
    "            <a href=\"#/admin/nodebrowser\"><i class=\"fa fa-terminal\"></i> Node Browser</a>\n" +
    "        </li-->\n" +
    "        <li ng-if=\"config.isAdmin && properties['parapheur.ihm.admin.mode.advanced'] === 'true'\" ng-class=\"{active:pagename() == '/admin/script'}\">\n" +
    "            <a href=\"#/admin/script\"><i class=\"fa fa-terminal\"></i> {{'adminNavbar.Script_execution' | translate}}</a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("partials/bureau.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/bureau.html",
    "<!-- Affichage d'un bureau -->\n" +
    "<a ng-if=\"isThumbnail\" class=\"thumbnail bureau\" name='{{b.name}}' id=\"{{b.nodeRef}}\" ng-click=\"goToDashboard()\" href=\"#/dashboard\" >\n" +
    "    <div class=\"image-wrap\">\n" +
    "        <span ng-show=\"b['en-retard'] > 0\" ng-click=\"retard()\" i18n=\"app.bureau.fileLate\" placement=\"top\" kind=\"tooltip\" count=\"{{b['en-retard']}}\" class=\"label label-danger\" >{{b['en-retard']}}</span>\n" +
    "        <span class=\"label label-info\" ng-click=\"traiter()\" i18n=\"{{(b.isSecretaire ? 'Dossiers en secretariat' : 'Dossiers à traiter') + ' : __count__'}}\" placement=\"top\" kind=\"tooltip\" count=\"{{b['a-traiter'] !== undefined ? b['a-traiter'] : b['secretariat']}}\" > {{b.isSecretaire ? b['secretariat'] : b['a-traiter']}}</span>\n" +
    "        <span ng-show=\"b['en-preparation'] > 0\" ng-click=\"preparation()\" class=\"label label-warning\" placement=\"top\" i18n=\"app.bureau.fileToTransmit\" kind=\"tooltip\" count=\"{{b['en-preparation']}}\" >{{b['en-preparation']}}</span>\n" +
    "        <span ng-show=\"b['a-archiver'] > 0\" ng-click=\"archive()\" class=\"label label-success\" placement=\"top\" i18n=\"app.bureau.fileToArchive\" kind=\"tooltip\" count=\"{{b['a-archiver']}}\" >{{b['a-archiver']}}</span>\n" +
    "        <span ng-show=\"b.retournes > 0 || b['a-imprimer'] > 0\" ng-click=\"retournes()\" class=\"label label-inverse\" placement=\"top\" i18n=\"{{(b.isSecretaire ? 'Dossiers à imprimer' : 'Dossiers rejetés') + ' : __count__'}}\" kind=\"tooltip\" count=\"{{b['retournes'] !== undefined ? b['retournes'] : b['a-imprimer']}}\" >{{b.isSecretaire ? b['a-imprimer'] : b['retournes']}}</span>\n" +
    "        <span ng-show=\"b['dossiers-delegues'] > 0\" style=\"top:30px; background-color: #6f5499;\" ng-click=\"delegue()\"\n" +
    "              class=\"label label-info\"\n" +
    "              placement=\"top\" i18n=\"app.bureau.fileDeleg\" kind=\"tooltip\" count=\"{{b['dossiers-delegues']}}\">{{b['dossiers-delegues']}}</span>\n" +
    "        <img alt=\"{{b.name}}\" ng-cloak ng-show=\"!hasThemeIcon\" ng-src=\"{{context}}/res/images/bureau_v3.svg\">\n" +
    "        <img alt=\"{{b.name}}\" ng-cloak ng-show=\"hasThemeIcon\" imageonload=\"iconBureauLoaded()\" ng-src=\"{{context}}/themes/{{tenant ? tenant + '/' : ''}}{{theme}}.png\">\n" +
    "    </div>\n" +
    "    <div class=\"nom-bureau\">{{b.name}}</div>\n" +
    "</a>\n" +
    "<a ng-if=\"!isThumbnail\" ng-click=\"goToDashboard()\" href=\"#/dashboard\" ng-disabled=\"flags.backdrop\" id=\"currentBureauName\">{{b.shortName}}\n" +
    "    <div style=\"position:absolute;left:0; right:0;bottom:0;\">\n" +
    "        <div style=\"display:table; width:100%\">\n" +
    "            <div style=\"display:table-cell; width:20%;\">\n" +
    "                <span ng-show=\"b['en-retard'] > 0\" ng-click=\"retard()\" i18n=\"app.bureau.fileLate\" placement=\"bottom\"\n" +
    "                      kind=\"tooltip\" watch-value=\"b['en-retard']\" count=\"{{b['en-retard']}}\" class=\"label label-danger\">{{b['en-retard']}}</span>\n" +
    "            </div>\n" +
    "            <div style=\"display:table-cell; width:20%;\">\n" +
    "                <span ng-show=\"b['a-archiver'] > 0\" ng-click=\"archive()\" class=\"label label-success\" placement=\"bottom\"\n" +
    "                      i18n=\"app.bureau.fileToArchive\" kind=\"tooltip\" watch-value=\"b['a-archiver']\"\n" +
    "                      count=\"{{b['a-archiver']}}\">{{b['a-archiver']}}</span>\n" +
    "            </div>\n" +
    "            <div style=\"display:table-cell; width:20%;\">\n" +
    "                <span ng-show=\"b['retournes'] > 0 || b['a-imprimer'] > 0\" ng-click=\"retournes()\"\n" +
    "                      class=\"label label-inverse\" placement=\"bottom\"\n" +
    "                      i18n=\"{{(b.isSecretaire ? 'Dossiers à imprimer' : 'Dossiers rejetés') + ' : __count__'}}\"\n" +
    "                      kind=\"tooltip\" watch-value=\"b.retournes\"\n" +
    "                      count=\"{{b['retournes'] !== undefined ? b['retournes'] : b['a-imprimer']}}\">{{b.isSecretaire ? b['a-imprimer'] : b['retournes']}}</span>\n" +
    "            </div>\n" +
    "            <div style=\"display:table-cell; width:20%;\">\n" +
    "                <span ng-show=\"b['en-preparation'] > 0\" ng-click=\"preparation()\" class=\"label label-warning\"\n" +
    "                      placement=\"bottom\" i18n=\"app.bureau.fileToTransmit\" kind=\"tooltip\"\n" +
    "                      watch-value=\"b['en-preparation']\" count=\"{{b['en-preparation']}}\">{{b['en-preparation']}}</span>\n" +
    "            </div>\n" +
    "            <div style=\"display:table-cell; width:20%;\">\n" +
    "                <span ng-if=\"!b.isSecretaire\" class=\"label label-info\" ng-click=\"traiter()\" i18n=\"app.bureau.fileToDo\"\n" +
    "                      placement=\"bottom\" kind=\"tooltip\" watch-value=\"b['a-traiter']\" count=\"{{b['a-traiter']}}\">{{b['a-traiter']}}</span>\n" +
    "                <span ng-if=\"b.isSecretaire\" class=\"label label-info\" ng-click=\"traiter()\"\n" +
    "                      i18n=\"Dossiers en secretariat : __count__\" placement=\"bottom\" kind=\"tooltip\"\n" +
    "                      watch-value=\"b.secretariat\" count=\"{{b.secretariat}}\">{{b.secretariat}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</a>\n" +
    "\n" +
    "");
}]);

angular.module("partials/dashlets/actions.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/actions.html",
    "<div id=\"actions\" style=\"margin-top: 15px;\">\n" +
    "    <a ng-if=\"currentBureau.isSecretaire\" ng-show=\"inArray('SECRETARIAT', dossier.actions) && !dossier.locked\"\n" +
    "       id=\"action-button-secretary\" tooltip=\"{{'actions.returnFolder' | translate}}\"\n" +
    "       ng-click=\"launchModalWithRedirect('SECRETARIAT')\" class=\"actions fa fa-user fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"(dossier.actionDemandee === 'MAILSEC' || dossier.actionDemandee === 'MAILSECPASTELL') && dossier.isSent && !dossier.locked\"\n" +
    "       tooltip=\"{{'actions.showSecureMailInformations' | translate}}\" ng-click=\"launchModalWithRedirect('MAILSECINFOS')\"\n" +
    "       id=\"action-button-infosMailSec\" class=\"actions fa fa-info-circle fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('MAILSEC', dossier.actions) && !dossier.locked\" ng-click=\"launchModalWithRedirect('MAILSEC')\"\n" +
    "       tooltip=\"{{'actions.sendBySecureMail' | translate}}\" id=\"action-button-emailSec\"\n" +
    "       class=\"actions fa fa-envelope fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('CACHET', dossier.actions) && !dossier.locked\" ng-click=\"launchModalWithRedirect('CACHET')\"\n" +
    "       id=\"action-button-cachet\" tooltip=\"{{'actions.seal' | translate}}\"\n" +
    "       class=\"actions fa ls-stamp fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('REMORD', dossier.actions) && !((dossier.actionDemandee === 'MAILSEC' || dossier.actionDemandee === 'MAILSECPASTELL') && dossier.isSent) && !dossier.locked\"\n" +
    "       tooltip=\"{{'actions.applyRemorseRight' | translate}}\" id=\"action-button-remorse\"\n" +
    "       ng-click=\"launchModalWithRedirect('REMORD')\" class=\"actions fa fa-reply fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('REJET', dossier.actions) && dossier.actionDemandee === 'SIGNATURE' && dossier.readingMandatory && !dossier.hasRead && !dossier.locked\"\n" +
    "       ng-click=\"launchModal('READ')\" tooltip=\"{{'actions.readingRequired' | translate}}\" id=\"action-button-read\"\n" +
    "       class=\"actions fa fa-key fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('RAZ', dossier.actions) && !dossier.locked\" ng-click=\"launchModalWithRefresh('RAZ')\"\n" +
    "       id=\"action-button-raz\" tooltip=\"{{'actions.correctAndReissue' | translate}}\"\n" +
    "       class=\"actions fa fa-recycle fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('EDITION', dossier.actions) && !dossier.locked\" id=\"action-button-pencil\"\n" +
    "       class=\"actions fa fa-pencil fa-2x text-muted\" ng-click=\"editDossier()\" tooltip=\"{{'actions.edit' | translate}}\"\n" +
    "       href=\"#/nouveau\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"((inArray('VISA', dossier.actions) && dossier.actionDemandee === 'VISA') || (inArray('SIGNATURE', dossier.actions) && !dossier.isSignPapier && (!dossier.readingMandatory || (dossier.readingMandatory && dossier.hasRead)))) && !dossier.isSent && !dossier.locked\"\n" +
    "       tooltip=\"{{dossier.actionDemandee === 'VISA' ? 'Viser': 'Signer'}}\" ng-click=\"checkReadAndLaunchModalWithRedirect('VALIDATION')\"\n" +
    "       id=\"action-button-sign\" ng-class=\"dossier.actionDemandee === 'VISA' ? 'fa-check-square-o': 'ls-signature'\"\n" +
    "       class=\"actions fa fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('TDT_HELIOS', dossier.actions) && !dossier.locked\"\n" +
    "       ng-click=\"launchModalWithRedirect('TDT_HELIOS')\" tooltip=\"{{'actions.sendToHeliosTdt' | translate}}\"\n" +
    "       id=\"action-button-tdt-helios\" class=\"actions fa fa-cloud-upload fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('TDT_ACTES', dossier.actions) && !dossier.locked\"\n" +
    "       ng-click=\"launchModalWithRedirect('TDT_ACTES')\" tooltip=\"{{'actions.sendToActesTdt' | translate}}\"\n" +
    "       id=\"action-button-tdt-actes\" class=\"actions fa fa-cloud-upload fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('SIGNATURE', dossier.actions) && !dossier.circuit.isDigitalSignatureMandatory && !dossier.isSignPapier && !dossier.locked\"\n" +
    "       ng-click=\"launchModal('PAPIER')\" id=\"action-button-papier\" tooltip=\"{{'actions.paperSignature' | translate}}\"\n" +
    "       class=\"actions fa fa-file-text-o fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('SIGNATURE', dossier.actions) && dossier.isSignPapier && !dossier.locked\"\n" +
    "       ng-click=\"launchModalWithRedirect('PAPIERSIGN')\" id=\"action-button-papier-sign\"\n" +
    "       tooltip=\"{{'actions.paperSignature' | translate}}\" class=\"actions fa fa-file-text fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('REJET', dossier.actions)  && !((dossier.actionDemandee === 'MAILSEC' || dossier.actionDemandee === 'MAILSECPASTELL') && dossier.isSent) && !dossier.locked\"\n" +
    "       tooltip=\"{{'actions.reject' | translate}}\" ng-click=\"launchModalWithRedirect('REJET')\" id=\"action-button-reject\"\n" +
    "       class=\"actions fa fa-times fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('ARCHIVAGE', dossier.actions) && !dossier.locked\" id=\"action-button-archive\"\n" +
    "       tooltip=\"{{'actions.archive' | translate}}\" ng-click=\"launchModalWithRedirect('ARCHIVAGE')\"\n" +
    "       class=\"actions fa fa-inbox fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"inArray('SUPPRESSION', dossier.actions) && !dossier.locked\" id=\"action-button-delete\"\n" +
    "       tooltip=\"{{'actions.delete' | translate}}\" ng-click=\"launchModalWithRedirect('SUPPRESSION')\"\n" +
    "       class=\"actions fa fa-trash-o fa-2x text-muted\">\n" +
    "    </a>\n" +
    "    <a ng-show=\"oneOrMoreAttestError() && !dossier.locked\" id=\"action-button-refresh-attest\"\n" +
    "       tooltip=\"{{'actions.refresh-attest' | translate}}\" ng-click=\"launchAttest()\"\n" +
    "       class=\"actions fa fa-search fa-2x text-muted\">\n" +
    "    </a>\n" +
    "\n" +
    "    <div class=\"btn-group\" dropdown>\n" +
    "        <span class=\"btn btn-default dropdown-toggle\" id=\"dropdownActions\">\n" +
    "            <i class=\"fa fa-cogs\"></i>\n" +
    "            Actions\n" +
    "            <i class=\"fa fa-caret-down\"></i>\n" +
    "        </span>\n" +
    "        <ul class=\"dropdown-menu pull-right pointer\" role=\"menu\" aria-labelledby=\"dropdownActions\">\n" +
    "            <li ng-if=\"!currentBureau.isSecretaire\"\n" +
    "                ng-show=\"inArray('SECRETARIAT', dossier.actions) && !dossier.locked\">\n" +
    "                <a ng-click=\"launchModalWithRedirect('SECRETARIAT')\" id=\"action-button-secretary\">\n" +
    "                    <i class=\"fa fa-fw fa-user\"></i>\n" +
    "                    {{'actions.sendToSecretariat' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('EMAIL', dossier.actions)\">\n" +
    "                <a ng-click=\"launchModal('PRINT')\" id=\"action-button-print\" class=\"icon-print icon-large\">\n" +
    "                    <i class=\"fa fa-fw fa-print\"></i>\n" +
    "                    {{'actions.print' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('EMAIL', dossier.actions)\">\n" +
    "                <a ng-click=\"launchModal('EMAIL')\" id=\"action-button-email\">\n" +
    "                    <i class=\"fa fa-fw fa-paper-plane-o\"></i>\n" +
    "                    {{'actions.sendByMail' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('ENCHAINER_CIRCUIT', dossier.actions) && !dossier.locked\">\n" +
    "                <a ng-click=\"launchModalWithRefresh('CHAIN')\" id=\"action-button-chain\">\n" +
    "                    <i class=\"fa fa-fw fa-road\"></i>\n" +
    "                    {{'actions.chainCircuit' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('AVIS_COMPLEMENTAIRE', dossier.actions) && !dossier.locked\">\n" +
    "                <a id=\"action-button-notifs\" ng-click=\"launchModal('NOTIFICATIONS')\">\n" +
    "                    <i class=\"fa fa-fw fa-desktop\"></i>\n" +
    "                    {{'actions.notifyAndAddConsultationCredentials' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('TRANSFERT_ACTION', dossier.actions) && !dossier.locked && dossier.actionDemandee === 'SIGNATURE'\">\n" +
    "                <a ng-click=\"launchModalWithRedirect('TRANSFERT_SIGNATURE')\" id=\"action-button-changeSign\">\n" +
    "                    <i class=\"fa fa-fw fa-share\"></i>\n" +
    "                    {{'actions.transferFolderToSign' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('TRANSFERT_ACTION', dossier.actions) && !dossier.locked && dossier.actionDemandee === 'VISA'\">\n" +
    "                <a ng-click=\"launchModalWithRedirect('TRANSFERT_VISA')\" id=\"action-button-changeVisa\">\n" +
    "                    <i class=\"fa fa-fw fa-share\"></i>\n" +
    "                    {{'actions.transferFolderToValid' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('AVIS_COMPLEMENTAIRE', dossier.actions) && !dossier.locked\">\n" +
    "                <a ng-click=\"launchModalWithRedirect('AVIS_COMPLEMENTAIRE')\" id=\"action-button-avisComp\">\n" +
    "                    <i class=\"fa fa-fw fa-retweet\"></i>\n" +
    "                    {{'actions.askingForAdditionalOpinion' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('JOURNAL', dossier.actions)\">\n" +
    "                <a ng-click=\"launchModal('JOURNAL')\" id=\"action-button-journal\">\n" +
    "                    <i class=\"fa fa-fw fa-list-alt\"></i>\n" +
    "                    {{'actions.eventLog' | translate}}\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li ng-show=\"inArray('EDITION', dossier.actions) && !dossier.locked && (dossier.circuit.sigFormat.indexOf('PKCS#7') !== -1 || dossier.circuit.sigFormat.indexOf('XAdES/detached') !== -1)\"\n" +
    "                style=\"height:26px;\">\n" +
    "                <a style=\"height:100%;\">\n" +
    "                    <form novalidate name=\"addSig\"\n" +
    "                          class=\"form-horizontal\"\n" +
    "                          fileupload=\"signature\"\n" +
    "                          one-file=\"true\"\n" +
    "                          submit-button=\".launchUpload\"\n" +
    "                          wrong-type=\"apercu.signature.wrongTypeSig(ext)\"\n" +
    "                          fileinput=\"#addSignInput\"\n" +
    "                          file-added=\"apercu.signature.sigAdded(files)\"\n" +
    "                          upload-success=\"apercu.signature.sigUploaded(data, index)\"\n" +
    "                          action=\"{{context + '/base64encode'}}\"\n" +
    "                          method=\"POST\"\n" +
    "                          enctype=\"multipart/form-data\">\n" +
    "                        <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                        <div class=\"fileupload-buttonbar\">\n" +
    "                            <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                            <span class=\"fileinput-button force-display pointer\">\n" +
    "                                <i class=\"fa fa-fw fa-certificate\"></i>\n" +
    "                                {{'actions.addSignatureToFolder' | translate}}\n" +
    "                                <input id=\"addSignInput\" type=\"file\" name=\"file\" ng-click=\"$event.stopPropagation()\">\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"text text-danger\" ng-if=\"apercu.signature.sigWrongType\">\n" +
    "        <i class=\"fa fa-times\"></i> {{'actions.expectedExentions' | translate}} : .p7s / .sig\n" +
    "    </div>\n" +
    "    <div class=\"text text-success\" ng-if=\"apercu.signature.isSigUploaded\">\n" +
    "        <i class=\"fa fa-check\"></i> {{'actions.signatureSaved' | translate}}\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/annotations.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/annotations.html",
    "<div id=\"annotations\" class=\"well dashlet\" ng-show=\"hasAnnotPub\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'annotations.publicAnnotations' | translate}}</h3>\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "        <div ng-repeat=\"etape in dossier.circuit.etapes\" ng-if=\"!!etape.annotPub\">\n" +
    "            <span ng-bind-html=\"etape.annotPub\"></span>\n" +
    "            <blockquote style=\"padding: 0;\">\n" +
    "                <small ng-if=\"etape.dateValidation != null\">{{('annotations.-person-the-date-' | translate).replace(\"-date-\", (etape.dateValidation | date:('annotations.dateFormat' | translate))).replace(\"-person-\", etape.signataire)}}</small>\n" +
    "                <small ng-if=\"etape.dateValidation == null\">Par {{etape.signataire}}, étape courrante</small>\n" +
    "            </blockquote>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/annoter.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/annoter.html",
    "<div id=\"annoter\" class=\"well dashlet\" ng-show=\"dossier.actions.indexOf('REJET') !== -1\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'annoter.annotate' | translate}}</h3>\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\" >\n" +
    "        <textarea style=\"resize: vertical; margin-bottom:10px;\" ng-change=\"changedAnnotation(local.annot)\" ng-model=\"local.annot\" class=\"form-control\" rows=\"3\"></textarea>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/annotindex.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/annotindex.html",
    "<div id=\"annotationsIndex\" class=\"well dashlet\" ng-show=\"apercu.annotations.hasAnnotation\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'annotindex.graphicalAnnotations' | translate}}</h3>\n" +
    "\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "        <ul class=\"list-unstyled\">\n" +
    "            <li ng-repeat=\"(documentIndex, pages) in apercu.annotations.orderedList\"\n" +
    "                ng-show=\"apercu.annotations.docHasAnnot[documentIndex]\">\n" +
    "                <strong ng-show=\"isMultiDocument()\" class=\"text-info wrap\"\n" +
    "                        ng-init=\"apercu.annotations.docHasAnnot[documentIndex] = false\">{{getDocumentName(documentIndex)}}</strong>\n" +
    "                <ul class=\"list-unstyled\">\n" +
    "                    <li ng-repeat=\"(page, value) in apercu.annotations.orderedList[documentIndex]\"\n" +
    "                        ng-if=\"value.length > 0\">\n" +
    "                        <span class=\"text-info\">{{('annotindex.page-pagenumber-' | translate).replace(\"-pagenumber-\", (page *1 + 1))}}</span>\n" +
    "                        <hr style=\"margin:0;\">\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li ng-repeat=\"annot in value\" class=\"pointer\" ng-click=\"apercu.annotations.select(documentIndex, page, annot)\">\n" +
    "                                <span ng-if=\"!annot.text\" class=\"text-warning\">{{'annotindex.noComment' | translate}}</span>\n" +
    "                                <span ng-if=\"!!annot.text\" class=\"text-overflow\">{{annot.text}}</span>\n" +
    "                                <blockquote style=\"padding:0;\"\n" +
    "                                            ng-init=\"apercu.annotations.docHasAnnot[documentIndex] = true\">\n" +
    "                                    <small>{{('annotindex.by-person-the-date-' | translate).replace(\"-date-\", (annot.date | date:('annotindex.dateFormat' | translate))).replace(\"-person-\", annot.author)}}</small>\n" +
    "                                </blockquote>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/circuit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/circuit.html",
    "<script type=\"text/ng-template\"  id=\"popover_signature\">\n" +
    "    <a href=\"{{context}}/proxy/alfresco/parapheur/api/getProp?dossier=workspace://SpacesStore/{{etape.id}}&property=ph:signature-etape&filename={{dossier.documents[0].name + '-signature-iparapheur'}}\">{{'circuit.download' | translate}}</a>\n" +
    "    <p>\n" +
    "        <strong ng-if=\"etape.signatureInfo.signature_date\">{{'circuit.signatureDate' | translate}} :</strong>\n" +
    "        {{etape.signatureInfo.signature_date}}<br>\n" +
    "        <strong>{{'circuit.withCertificateOf' | translate}} :</strong> {{etape.signatureInfo.subject_name}}<br>\n" +
    "        <strong>{{'circuit.issuedBy' | translate}} :</strong> {{etape.signatureInfo.issuer_name}}<br>\n" +
    "        <strong>{{'circuit.certificateValidity' | translate}} :</strong> {{('circuit.from-start-to-end-' | translate).replace(\"-start-\", etape.signatureInfo.certificate_valid_from).replace(\"-end-\", etape.signatureInfo.certificate_valid_to)}}\n" +
    "    </p>\n" +
    "</script>\n" +
    "\n" +
    "<div id=\"circuit\" class=\"well dashlet\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'circuit.validationCircuit' | translate}}</h3>\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "        <span ng-if=\"flags.noCircuit\" class=\"text-danger\">\n" +
    "            <i class=\"fa fa-warning\"></i>{{'circuit.noCircuitDefinedForThisFolder' | translate}}\n" +
    "        </span>\n" +
    "        <ol>\n" +
    "            <li ng-repeat=\"etape in dossier.circuit.etapes\">\n" +
    "                <i class=\"fa fa-lg fa-fw\" ng-class=\"getIconClass(etape, dossier.circuit.etapes[$index+1])\" tooltip=\"{{getActionTooltip(etape)}}\"></i>\n" +
    "                <span style=\"position:absolute; left: 0; margin-left: 50px;\" ng-if=\"etape.isCurrent && !dossier.circuit.etapes[$index-1].rejected\">\n" +
    "                    <i tooltip=\"Étape en cours\" class=\"fa fa-lg fa-fw text-success fa-arrow-right\" ></i>\n" +
    "                </span>\n" +
    "\n" +
    "                <span class=\"label label-danger\" style=\"position:absolute; left: -5px; margin-left: 50px; margin-top: 18px;\" ng-if=\"etape.rejected && dossier.circuit.etapes[$index+1].isCurrent\">\n" +
    "                    Rejeté\n" +
    "                </span>\n" +
    "\n" +
    "                <span ng-class=\"etape.approved ? (etape.rejected && dossier.circuit.etapes[$index+1].isCurrent ? 'text-danger' : 'text-success') : (etape.isCurrent && !dossier.circuit.etapes[$index-1].rejected) ? 'bold' : ''\">\n" +
    "                    {{etape.parapheurName}}\n" +
    "                    <span ng-if=\"etape.delegueName\">\n" +
    "                        <i class=\"fa fa-arrow-right\"></i>\n" +
    "                        <span tooltip=\"Par délégation\">{{etape.delegueName}}</span>\n" +
    "                    </span>\n" +
    "\n" +
    "                </span>\n" +
    "                <i ng-if=\"etape.signatureEtape && (dossier.circuit.sigFormat.indexOf('PKCS#7') !== -1 || dossier.circuit.sigFormat.indexOf('PKCS#1') !== -1 || dossier.circuit.sigFormat === 'XAdES/detached')\"\n" +
    "                     class=\"pointer fa fa-lg fa-fw ls-signature-o\"  data-placement=\"left\"\n" +
    "                   bs-popover=\"'popover_signature'\" data-trigger=\"click\" title=\"{{'circuit.signature_information' | translate}}\"></i>\n" +
    "                <span tooltip=\"Télécharger le PES_Acquit\" ng-if=\"etape.approved && !etape.rejected && etape.actionDemandee === 'TDT' && dossier.protocole === 'HELIOS'\">\n" +
    "                    <a target=\"_blank\" href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3anackHeliosXml/workspace/SpacesStore/{{dossier.id}}/PES_Acquit.xml\"><i class=\"fa fa-arrow-circle-o-down fa-lg\"></i></a>\n" +
    "                </span>\n" +
    "                <blockquote class=\"quote-circuit\" ng-if=\"etape.approved\">\n" +
    "                    <small>{{('circuit.the-date-from-person-' | translate).replace(\"-date-\", (etape.dateValidation | date:('circuit.dateFormat' | translate))).replace(\"-person-\", etape.signataire)}}</small>\n" +
    "                </blockquote>\n" +
    "            </li>\n" +
    "        </ol>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/dashlets/details-dossier.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/details-dossier.html",
    "<div id=\"details-dossier\" class=\"well dashlet\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'details-dossier.folderDetails' | translate}}</h3>\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "        <ul>\n" +
    "            <li>{{'details-dossier.type' | translate}} : {{dossier.type}}<span ng-if=\"!dossier.type\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'details-dossier.undefined' | translate}}</span></li>\n" +
    "            <li>{{'details-dossier.subtype' | translate}} : {{dossier.sousType}}<span ng-if=\"!dossier.sousType\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'details-dossier.undefined' | translate}}</span></li>\n" +
    "            <li>{{'details-dossier.visibility' | translate}} : {{dossier.visibility === \"group\" ? \"groupe\" : dossier.visibility}}</li>\n" +
    "            <li><span ng-if=\"dossier.isRead\">{{'details-dossier.readFolder' | translate}}</span><span ng-if=\"!dossier.isRead\">{{'details-dossier.unreadFolder' | translate}}</span></li>\n" +
    "            <li ng-if=\"dossier.actionDemandee === 'TDT' && dossier.isSent\">{{'details-dossier.tdtStatus' | translate}} : {{dossier.status}} <i class=\"pointer fa fa-refresh\" ng-click=\"refreshStatus()\"></i></li>\n" +
    "            <li ng-repeat=\"(metaName, metaInfo) in dossier.metadatas\" ng-if=\"metaInfo.editable === 'false'\">\n" +
    "                {{metaInfo.realName}} :\n" +
    "                <span ng-switch on=\"metaInfo.type\">\n" +
    "                    <span ng-switch-when=\"DOUBLE\">\n" +
    "                        {{metaInfo.value | number:2}}\n" +
    "                    </span>\n" +
    "                    <span ng-switch-when=\"DATE\">\n" +
    "                         {{metaInfo.value | date:'dd/MM/yyyy'}}\n" +
    "                    </span>\n" +
    "                    <span ng-switch-when=\"BOOLEAN\">\n" +
    "                         {{metaInfo.value === 'true' ? 'Oui' : 'Non'}}\n" +
    "                    </span>\n" +
    "                    <span ng-switch-when=\"URL\">\n" +
    "                        <a target=\"_blank\" ng-href=\"{{metaInfo.value}}\">{{metaInfo.value}}</a>\n" +
    "                    </span>\n" +
    "                    <span ng-switch-default>\n" +
    "                         {{metaInfo.value}}\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <form name='metasForm' ng-init=\"setFormScope(this)\" ng-show=\"!empty(dossier.metadatas)\" class=\"container-fluid\" novalidate>\n" +
    "            <div ng-switch on=\"metaInfo.type\" ng-if=\"metaInfo.editable === 'true'\" class=\"control-group\" ng-repeat=\"(metaName, metaInfo) in dossier.metadatas\">\n" +
    "                <div class=\"form-group col-md-12\" ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"DATE\" ng-hide=\"metaInfo.values\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input ng-change=\"metaChanged()\" ng-cloak=\"\" ip-id=\"metaName\" return-format=\"timestamp\" readonly=\"true\" ip-datepicker type=\"text\" ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" ng-model=\"dossier.metadatas[metaName].value\" class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true' && !metaInfo.values\">\n" +
    "                        <span ng-click=\"dossier.metadatas[metaName].value = ''\" class=\"pointer input-group-addon\">X</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\"  ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"STRING\" ng-hide=\"metaInfo.values\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaName}}\" ng-model=\"dossier.metadatas[metaName].value\" ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\"\n" +
    "                     ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"URL\"\n" +
    "                     ng-hide=\"metaInfo.values\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaName}}\"\n" +
    "                           ng-model=\"dossier.metadatas[metaName].value\"\n" +
    "                           ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\"\n" +
    "                           ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\"  ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"INTEGER\" ng-hide=\"metaInfo.values\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <input type=\"text\" integer ng-change=\"metaChanged()\" id=\"{{metaName}}\" ng-model=\"dossier.metadatas[metaName].value\" ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\"  ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"DOUBLE\" ng-hide=\"metaInfo.values\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <input type=\"text\" decimal ng-change=\"metaChanged()\" id=\"{{metaName}}\" ng-model=\"dossier.metadatas[metaName].value\" ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\"  ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\" ng-switch-when=\"BOOLEAN\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <select id=\"{{metaName}}\"\n" +
    "                            ng-options=\"el.value as el.text for el in apercu.options.getOptionsFromMeta(metaInfo)\"\n" +
    "                            ng-change=\"metaChanged()\" ng-model=\"dossier.metadatas[metaName].value\"\n" +
    "                            ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\"\n" +
    "                            ng-required=\"metaInfo.mandatory === 'true'\">\n" +
    "\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-12\" ng-show=\"metaInfo.values\" ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\">\n" +
    "                    <label class=\"control-label\" for=\"{{metaName}}\">{{metaInfo.realName}}</label>\n" +
    "                    <span class=\"fa fa-warning label label-warning float-right\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'details-dossier.required' | translate}}</span>\n" +
    "                    <select id=\"{{metaName}}\"\n" +
    "                            ng-options=\"el.value as el.text for el in apercu.options.getOptionsFromMeta(metaInfo)\"\n" +
    "                            ng-change=\"metaChanged()\" ng-change=\"valuesMetaUndefined(metaName)\"\n" +
    "                            ng-model=\"dossier.metadatas[metaName].value\"\n" +
    "                            ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\" class=\"form-control\"\n" +
    "                            ng-required=\"metaInfo.mandatory === 'true'  && metaInfo.values\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <span ng-if=\"metaSaved\" class=\"text text-success\"><i class=\"fa fa-check\"></i> {{'details-dossier.savedMetadatas' | translate}}</span>\n" +
    "        <span ng-if=\"metaSavedError\" class=\"text text-danger\"><i class=\"fa fa-warning\"></i> {{metaSavedErrorMsg | translate}}</span>\n" +
    "        <span ng-if=\"metasForm.$invalid\" class=\"text text-danger\"><i class=\"fa fa-warning\"></i> Valeur de métadonnée invalide</span>\n" +
    "        <span style=\"width:100%; word-wrap: break-word;white-space: normal;\" ng-if=\"hasEditableMeta && !dossier.locked\" ng-click=\"saveMetadatas()\" type=\"button\" class=\"btn btn-default force-display\" ng-disabled=\"metasForm.$invalid\"><i class=\"fa fa-save\"></i> {{'details-dossier.saveMetadatas' | translate}}</span>\n" +
    "\n" +
    "        <form ng-if=\"!dossier.locked && dossier.documents.length > 0 && dossier.canAdd\"\n" +
    "              fileupload=\"document\"\n" +
    "              wrong-type=\"wrongType(ext, isValid, isAuthorized)\"\n" +
    "              fileinput=\"#docinput\"\n" +
    "              signature-format=\"getCurrentSignatureFormat()\"\n" +
    "              protocol=\"getCurrentProtocol()\"\n" +
    "              check-if-exist=\"isDocumentNameAlreadyExist(name)\"\n" +
    "              dropzone=\"body\"\n" +
    "              file-added=\"addDocument(files)\"\n" +
    "              upload-success=\"documentAdded(data, index)\"\n" +
    "              upload-finish=\"uploadFinished(data, index)\"\n" +
    "              upload-error=\"uploadError(data, index)\"\n" +
    "              action=\"{{addDocumentUrl}}\"\n" +
    "              method=\"POST\"\n" +
    "              enctype=\"multipart/form-data\">\n" +
    "            <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "            <div class=\"fileupload-buttonbar lg\">\n" +
    "                <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                    <span class=\"btn btn-default fileinput-button force-display col-md-12\">\n" +
    "                        <i class=\"icon-plus icon-white\"></i>\n" +
    "                        <span><i class=\"fa fa-paperclip\"></i> {{'details-dossier.addFile' | translate}}</span>\n" +
    "                        <input ui-multiple=\"dossier.documents.length > 0\" id=\"docinput\" type=\"file\" name=\"file\">\n" +
    "                    </span>\n" +
    "                <input type=\"hidden\" name=\"reloadMainDocument\" value=\"false\">\n" +
    "                <input type=\"hidden\" name=\"isMainDocument\" value=\"false\">\n" +
    "                <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div ng-show=\"typeError\" class=\"alert alert-danger\">\n" +
    "    {{'details-dossier.Error_The_file_type_isnt_handled_by_the_iParapheur' | translate}}\n" +
    "</div>\n" +
    "<div ng-show=\"formatError\" class=\"alert alert-danger\">\n" +
    "    {{'details-dossier.Error_The_file_type_does_not_match_the_selected_type' | translate}}\n" +
    "</div>\n" +
    "<div ng-show=\"!!uploadErrorMessage\" class=\"alert alert-danger\">\n" +
    "    {{uploadErrorMessage}}\n" +
    "</div>");
}]);

angular.module("partials/dashlets/liste-dossiers.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/liste-dossiers.html",
    "<div id=\"liste-dossiers\" class=\"well dashlet\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"pointer text-info\">{{'liste-dossier.customList' | translate}}</h3>\n" +
    "    <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "\n" +
    "        <fieldset id=\"select-filter\" class=\"filters\">\n" +
    "            <label class=\"\">{{'liste-dossier.availableFilters' | translate}}</label>\n" +
    "            <select ng-options=\"el.key as el.value group by el.group for el in apercu.options.filters()\" ng-if=\"nav\"\n" +
    "                    ng-model=\"currentFilterName\"\n" +
    "                    ng-init=\"currentFilterName = nav.selected ? nav.selected : dashFilter.dossier\"\n" +
    "                    ng-change=\"changeFilter(currentFilterName)\" class=\"form-control\">\n" +
    "            </select>\n" +
    "        </fieldset>\n" +
    "        <div class=\"navigation\">\n" +
    "            <span class=\"btn btn-default\" ng-click=\"changePage(false)\" ng-disabled=\"!nav.hasPrev\" tooltip=\"Page précédente\">\n" +
    "                <i class=\"fa fa-chevron-left\"></i>\n" +
    "            </span>\n" +
    "            <span class=\"btn btn-default\" ng-click=\"changePage(true)\" ng-disabled=\"!nav.hasNext\" tooltip=\"Page suivante\">\n" +
    "                <i class=\"fa fa-chevron-right\"></i>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "        <hr>\n" +
    "        <ul id=\"dossiers-list\" class=\"nav nav-pills nav-stacked list-circuits\">\n" +
    "            <li ng-repeat=\"dossierInfo in dossiers\" ng-class=\"dossier.id === dossierInfo.id ? 'active' : ''\">\n" +
    "                <a ng-class=\"dossierInfo.locked ? (dossier.id === dossierInfo.id ? 'active pending' : 'pending') : (dossier.id === dossierInfo.id ? 'active' : '')\" ng-click=\"selectNextDossier(dossierInfo)\">{{dossierInfo.title}}</a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <span class=\"text text-info\" ng-if=\"dossiers.length === 0\">\n" +
    "            <span style=\"height:20px; display:block;\" ng-if=\"gettingDossier\">\n" +
    "                <span style=\"position: absolute; width: 0px; z-index: 2000000000; left: 50%;\" us-spinner=\"{radius:6, width:4, length: 8}\" ></span>\n" +
    "            </span>\n" +
    "            <span ng-if=\"!gettingDossier\">\n" +
    "                <i class=\"fa fa-info-circle\"></i> {{'liste-dossier.noFolderFound' | translate}}\n" +
    "            </span>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/nom-dossier.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/nom-dossier.html",
    "<div id=\"nom-dossier\" class=\"well dashlet\">\n" +
    "    <h3 ng-click=\"element.show = !element.show\" class=\"wrap pointer text-info\">{{dossier.title}}</h3>\n" +
    "    <div bn-slide-show=\"element.show\" class=\"dashlet-content\">\n" +
    "        <span ng-if=\"dossier.documents.length === 0\" class=\"text-danger\">\n" +
    "            <i class=\"fa fa-warning\"></i>  {{'nom-dossier.noDocument' | translate}}\n" +
    "        </span>\n" +
    "        <ul class=\"list-unstyled list-documents\">\n" +
    "            <li class=\"pointer\" ng-init=\"dossier.documents[$index].state = ''\" bn-slide-show=\"true\"\n" +
    "                ng-repeat=\"document in dossier.documents\" ng-class=\"getDocumentListItemClass($index)\">\n" +
    "                <hr ng-if=\"isFirstAnnex($index)\">\n" +
    "                <div ng-style=\"dossier.isXemEnabled ? {display:'inline-block'} : {}\">\n" +
    "                    <a target=\"_blank\" class=\"xemelios\" ng-click=\"readDossier(0)\"\n" +
    "                       ng-if=\"$index === 0 && dossier.isXemEnabled && (document.name | fileext) === 'xml'\"\n" +
    "                       ng-href=\"{{context}}/proxy/alfresco/parapheur/dossiers/{{dossier.id}}/{{document.id}}/xemelios\">\n" +
    "                        <img ng-src=\"{{context}}/res/images/xemelios.png\">\n" +
    "                    </a>\n" +
    "\n" +
    "                    <form ng-if=\"document.canDelete && $index == 0\"\n" +
    "                          signature-format=\"getSignatureFormat()\"\n" +
    "                          protocol=\"getProtocol()\"\n" +
    "                          wrong-type=\"wrongType(ext, isValid, isAuthorized)\"\n" +
    "                          file-added=\"beginReplace(files)\"\n" +
    "                          upload-success=\"documentAdded(data, index)\"\n" +
    "                          fileupload=\"document\"\n" +
    "                          main-document=\"true\"\n" +
    "                          fileinput=\"#replaceMain\"\n" +
    "                          action=\"{{addDocumentUrl}}\" method=\"POST\" enctype=\"multipart/form-data\">\n" +
    "                        <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                        <div class=\"fileupload-buttonbar inline\">\n" +
    "                            <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                            <i class=\"fa fa-exchange fileinput-button force-display\" tooltip=\"Remplacer\">\n" +
    "                                <input id=\"replaceMain\" type=\"file\" name=\"file\">\n" +
    "                            </i>\n" +
    "                            <input type=\"hidden\" name=\"isMainDocument\" value=\"true\">\n" +
    "                            <input type=\"hidden\" name=\"reloadMainDocument\" value=\"true\">\n" +
    "                            <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                            <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "                <div ng-style=\"dossier.isXemEnabled ? {display:'inline-block'} : {}\">\n" +
    "                    <span>\n" +
    "                        <i ng-if=\"document.isLocked\" class=\"fa fa-info-circle text-info\"\n" +
    "                           tooltip=\"{{'nom-dossier.visual_generating' | translate}}\"></i>\n" +
    "                        <i ng-if=\"document.canDelete && $index > 0\"\n" +
    "                           ng-click=\"dossier.documents[$index].state = 'delete'; removeDocument($index)\"\n" +
    "                           class=\"fa fa-trash deleteDocument\"></i>\n" +
    "                        <a tooltip=\"{{'nom-dossier.download_pdf' | translate}}\"\n" +
    "                           ng-if=\"(!isPdf($index)) && (document.visuelPdf) && (!dossier.isXemEnabled)\"\n" +
    "                           ng-href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3avisuel-pdf/workspace/SpacesStore/{{document.id}}/{{document.name}}.pdf\"\n" +
    "                           download=\"{{document.name}}.pdf\">\n" +
    "                            <i class=\"fa fa-fw fa-lg fa-file-pdf-o\"></i>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <!-- Main PDF document -->\n" +
    "                        <span tooltip=\"{{'nom-dossier.attest_error' | translate}}\" style=\"font-size:1.5em;\"\n" +
    "                              ng-if=\"isCurrentMainDocument($index) && document.attestState == -1\"\n" +
    "                              class=\"fa fa-times-circle-o text-danger\"></span>\n" +
    "                        <span tooltip=\"{{'nom-dossier.attest_generating' | translate}}\" style=\"font-size:1.5em;\"\n" +
    "                              ng-if=\"isCurrentMainDocument($index) && document.attestState == 1\"\n" +
    "                              class=\"fa fa-clock-o text-warning\"></span>\n" +
    "                        <a tooltip=\"{{'nom-dossier.download_attest' | translate}}\"\n" +
    "                           ng-if=\"isCurrentMainDocument($index) && document.attestState == 2\"\n" +
    "                           ng-href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3aattest-content/workspace/SpacesStore/{{document.id}}/attest.pdf\"\n" +
    "                           download=\"{{document.name}}-attest.pdf\">\n" +
    "                            <span class=\"fa fa-check-circle-o text-success\" style=\"font-size:1.5em;\"></span>\n" +
    "                        </a>\n" +
    "                        <a tooltip=\"{{'nom-dossier.download_pdf' | translate}}\"\n" +
    "                           ng-if=\"isPdf($index) && isCurrentMainDocument($index)\"\n" +
    "                           ng-href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{document.id}}/content/{{document.name}}\"\n" +
    "                           download=\"{{document.name}}\">\n" +
    "                            <i class=\"fa fa-fw fa-lg fa-file-pdf-o\"></i>\n" +
    "                        </a>\n" +
    "                        <a ng-if=\"isPdf($index) && isCurrentMainDocument($index)\" style=\"word-wrap: break-word;\"\n" +
    "                           ng-click=\"selectDocument($index)\" tooltip=\"{{'nom-dossier.visualize' | translate}}\">\n" +
    "                            {{document.name}}</a>\n" +
    "\n" +
    "                        <!-- Main non-PDF document -->\n" +
    "                        <span ng-if=\"!isPdf($index) && isCurrentMainDocument($index)\">\n" +
    "                            <a tooltip=\"{{'nom-dossier.download' | translate}}\"\n" +
    "                               class=\"fa fa-lg fa-fw\"\n" +
    "                               ng-class=\"getFileExtIcon(document.name)\"\n" +
    "                               ng-href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{document.id}}/content/{{document.name}}\"\n" +
    "                               download=\"{{document.name}}\"></a>\n" +
    "                            <a tooltip=\"{{'nom-dossier.visualize' | translate}}\" class=\"wrap\"\n" +
    "                               ng-click=\"document.visuelPdf ? selectDocument($index) : showDossier($index)\">\n" +
    "                                {{document.name}}</a>\n" +
    "                        </span>\n" +
    "\n" +
    "\n" +
    "                        <!-- Annexes -->\n" +
    "                        <a tooltip=\"{{'nom-dossier.download' | translate}}\" ng-if=\"!isCurrentMainDocument($index)\"\n" +
    "                           class=\"wrap\"\n" +
    "                           ng-href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{document.id}}/content/{{document.name}}\"\n" +
    "                           download=\"{{document.name}}\">\n" +
    "                            <i class=\"fa fa-lg fa-fw\" ng-class=\"getFileExtIcon(document.name)\"></i>\n" +
    "                            {{document.name}}</a>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <form ng-if=\"$index === 0 && extension(document.name) === 'xml' && inArray('EDITION', dossier.actions)\"\n" +
    "                      fileupload=\"pdf\" wrong-type=\"wrongPDF(ext)\" fileinput=\"#visuinput\" file-added=\"updateVisu(files)\"\n" +
    "                      upload-success=\"updateVisuEnd(data, index)\" ng-action=\"{{addVisuelUrl}}\" method=\"POST\"\n" +
    "                      enctype=\"multipart/form-data\">\n" +
    "                    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                    <div class=\"fileupload-buttonbar\">\n" +
    "                        <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                        <span class=\"fileinput-button force-display pointer\">\n" +
    "                            <i class=\"fa fa-eye\"></i>\n" +
    "                            {{'nom-dossier.replaceVisual' | translate}}\n" +
    "                            <input id=\"visuinput\" type=\"file\" name=\"file\">\n" +
    "                        </span>\n" +
    "                        <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                        <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                        <input type=\"hidden\" name=\"document\" value=\"{{document.id}}\">\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "                <div bn-slide-show=\"dossier.documents[$index].state === 'delete'\"\n" +
    "                     class=\"progress progress-striped active\">\n" +
    "                    <div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                         aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                        {{'nom-dossier.deleting' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div bn-slide-show=\"dossier.documents[$index].state === 'saving'\"\n" +
    "                     class=\"progress progress-striped active\">\n" +
    "                    <div class=\"progress-bar progress-bar-info\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\"\n" +
    "                         aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                        {{'nom-dossier.saving' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div bn-slide-show=\"dossier.documents[$index].state === 'replace'\"\n" +
    "                     class=\"progress progress-striped active\">\n" +
    "                    <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                         aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                        {{'nom-dossier.replacing' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div bn-slide-show=\"dossier.documents[$index].state === 'visuel'\"\n" +
    "                     class=\"progress progress-striped active\">\n" +
    "                    <div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                         aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                        {{'nom-dossier.updatingVisual' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"alert alert-error\" ng-if=\"existLog\">\n" +
    "                    {{('nom-dossier.file-filename-AlreadyExists' | translate).replace(\"-filename-\", existDoc)}}\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-error\" ng-if=\"result\">\n" +
    "                    {{result.data.reponse | i18n}}\n" +
    "                </div>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/dashlets/postit.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/dashlets/postit.html",
    "<div id=\"postit\" class=\"postit\" ng-show=\"!!dossier.circuit.annotPriv\">\n" +
    "    <h3>{{'postit.privateAnnotation' | translate}}</h3>\n" +
    "    <div ng-bind-html=\"dossier.circuit.annotPriv\">\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/modal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modal.html",
    "<!-- angular dialog template -->\n" +
    "<script type=\"text/ng-template\" id=\"dialog-template\">\n" +
    "    <div class=\"modal fade\" data-backdrop=\"static\" data-keyboard=\"false\">\n" +
    "        <div class=\"modal-dialog\">\n" +
    "            <div class=\"modal-content\">\n" +
    "                <div class=\"modal-header\">\n" +
    "                    <button class=\"close\" data-dismiss=\"modal\"></button>\n" +
    "                    <h3>{{title}}</h3>\n" +
    "                </div>\n" +
    "                <div class=\"modal-body\">\n" +
    "                </div>\n" +
    "                <div class=\"modal-footer\">\n" +
    "                    <button class=\"btn\" data-dismiss=\"modal\" ng-click=\"secondaryAction()\">{{secondaryLabel}}</button>\n" +
    "                    <button id=\"modalConfirm\" class=\"btn btn-primary\" data-dismiss=\"modal\" ng-disabled=\"!modalForm.$valid\" ng-click=\"primaryAction()\">{{primaryLabel}}</button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</script>");
}]);

angular.module("partials/modals/actesModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/actesModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'actesModal.sending_tdt_actes' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <div class=\"form-group mandatory-group\">\n" +
    "                    <label class=\"control-label\" for=\"nature\">{{'actesModal.nature' | translate}}</label>\n" +
    "                    <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                    <select class=\"form-control unvalidate\" id=\"nature\" ng-model=\"action.nature\" ng-options=\"key as (key + ' ' + value) for (key, value) in actesInfo.nature\" required=\"required\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group mandatory-group\">\n" +
    "                    <label class=\"control-label\" for=\"classification\">{{'actesModal.classification' | translate}}</label>\n" +
    "                    <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                    <select class=\"form-control unvalidate\" id=\"classification\" ng-model=\"action.classification\" ng-options=\"classif.key as (classif.key + ' ' + classif.value) group by classif.group for classif in orderedClassification\" required=\"required\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"form-group mandatory-group\">\n" +
    "                    <label class=\"control-label\" for=\"numero\">{{'actesModal.acte_number' | translate}} <i class=\"pointer fa fa-info-circle\" tooltip=\"{{'actesModal.acte_number_tooltip' | translate}}\"></i></label>\n" +
    "                    <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                    <input class=\"form-control unvalidate\" id=\"numero\" ng-model=\"action.numero\" required=\"required\">\n" +
    "                </div>\n" +
    "                <div class=\"form-group mandatory-group\">\n" +
    "                    <label class=\"control-label\" for=\"date\">{{'actesModal.decision_date' | translate}}</label>\n" +
    "                    <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                    <input ip-datepicker return-format=\"timestamp\" readonly=\"true\" class=\"form-control unvalidate\" id=\"date\" name=\"confirm\" ng-model=\"action.dateActe\" required=\"required\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-7\">\n" +
    "                <label class=\"legendLabel col-xs-12\">\n" +
    "                    {{'actesModal.public_annotation' | translate}}\n" +
    "                    <hr>\n" +
    "                    <div>\n" +
    "                        <textarea class=\"form-control annotation\" ng-model=\"action.annotPub\"></textarea>\n" +
    "                        <i class=\"fa fa-3x fa-globe textarea-icon\"></i>\n" +
    "                    </div>\n" +
    "                </label>\n" +
    "                <label class=\"legendLabel col-xs-12\">\n" +
    "                    {{'actesModal.private_annotation' | translate}}\n" +
    "                    <hr>\n" +
    "                    <div>\n" +
    "                        <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPriv\"></textarea>\n" +
    "                        <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "                    </div>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <label class=\"legendLabel col-xs-12 mandatory-group\">\n" +
    "                    {{'actesModal.object' | translate}}\n" +
    "                    <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                    <hr>\n" +
    "                    <textarea style=\"width:100%;\" class=\"form-control unvalidate\" ng-model=\"action.objet\" required=\"required\"></textarea>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Cancel' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"spin || !modalForm.$valid\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-cloud-upload\"></i>\n" +
    "        {{'actions.sendToActesTdt' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/archiveModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/archiveModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'archiveModal.archiving' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    {{textModal}}\n" +
    "    <table class=\"table table-bordered table-archive\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>{{'archiveModal.folder_name' | translate}}</th>\n" +
    "                <th>{{'archiveModal.archive_name' | translate}}<br>{{'archiveModal.archive_name_default' | translate}}</th>\n" +
    "                <th><label for=\"selectAllPJ\"><input ng-model=\"masterCheckbox\" ng-click=\"setAllCheck(!masterCheckbox)\" id=\"selectAllPJ\" type=\"checkbox\" class=\"checkbox-inline unvalidate\"> {{'archiveModal.add_annexes' | translate}}</label></th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"dossier in dossiers\">\n" +
    "                <td><label for=\"name_{{$index}}\"><i class=\"fa fa-file\"></i>&nbsp;{{dossier.title}}</label></td>\n" +
    "                <td><input type=\"text\" ng-model=\"archivesNames[$index]\" class=\"form-control unvalidate\" id=\"name_{{$index}}\" placeholder=\"{{dossier.title}}.pdf\"></td>\n" +
    "                <td ng-if=\"dossiers.length === 1 && dossiers[0].annexes.length === 0\"><i class=\"fa fa-warning\"></i>&nbsp;Aucune annexe</td>\n" +
    "                <td ng-if=\"dossiers.length === 1 && dossiers[0].annexes.length > 0\">\n" +
    "                    <label for=\"annexe_{{$index}}\" ng-repeat=\"annexe in dossiers[0].annexes\">\n" +
    "                        <input ng-init=\"checkboxAnnexes[$index] = dossiers[0].includeAnnexes\" ng-model=\"checkboxAnnexes[$index]\" class=\"unvalidate\" type=\"checkbox\" id=\"annexe_{{$index}}\">\n" +
    "                        {{annexe.name}}\n" +
    "                    </label>\n" +
    "                </td>\n" +
    "                <td ng-if=\"dossiers.length > 1\">\n" +
    "                    <div class=\"checkbox\" style=\"text-align: center;\">\n" +
    "                        <input style=\"float:none;\" ng-init=\"checkboxAnnexes[$index] = dossiers[0].includeAnnexes\" class=\"unvalidate\" ng-model=\"checkboxAnnexes[$index]\" type=\"checkbox\">\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar class=\"progress-striped active progress-modal\" value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span style=\"color:black; white-space:nowrap;\">{{'archiveModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        Valider\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/askPasswordModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/askPasswordModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{title | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <p class=\"text-info\"><i class=\"fa fa-warning\"></i> {{message | translate}}</p>\n" +
    "\n" +
    "    <form novalidate name=\"userPassword\" class=\"form-horizontal\" ng-submit=\"ok()\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"password\">{{'Admin.Users.UserMod_New_Pass' | translate}}</label>\n" +
    "                <input check-strength=\"{{properties['parapheur.ihm.password.strength']}}\"\n" +
    "                       class=\"form-control validation-control\" type=\"password\" id=\"password\" name=\"password\"\n" +
    "                       ng-model=\"newPass.newOne\" required=\"required\">\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"confirm\">{{'Admin.Users.UserMod_Confirm_Pass' | translate}}</label>\n" +
    "                <input class=\"form-control validation-control\" type=\"password\" id=\"confirm\" name=\"confirm\"\n" +
    "                       ng-model=\"newPass.confirm\" confirm-with=\"newPass\" required=\"required\">\n" +
    "                <div class=\"input-help\">\n" +
    "                    <span class=\"error\" ng-show=\"userPassword.confirm.$error.confirm\">{{'Admin.Users.UserMod_Error_Confirm' | translate}}</span>\n" +
    "                    <span class=\"error\" ng-show=\"userPassword.confirm.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div strength-result=\"{{properties['parapheur.ihm.password.strength']}}\" error=\"userPassword.password.$error\"\n" +
    "             class=\"col-md-6\" ng-if=\"userPassword.password.$error._length != undefined\"></div>\n" +
    "        <!-- Pour l'envoi du formulaire avec touche entrée -->\n" +
    "        <input type=\"submit\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!userPassword.$valid\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-floppy-o\"></i>\n" +
    "        {{'Save' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/bureauxModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/bureauxModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{titleModal | translate}} {{selectedBureau.name}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "        <ul class=\"nav nav-tabs\">\n" +
    "            <li class=\"active\"><a href=\"#general\" bs-tab><i class=\"fa fa-desktop\"></i> {{'Admin.Bureaux.BuMod_General' | translate}}</a></li>\n" +
    "            <li><a href=\"#acteurs\" bs-tab><i class=\"fa fa-user\"></i> {{'Admin.Bureaux.BuMod_Actors' | translate}}</a></li>\n" +
    "            <li><a href=\"#habilitation\" bs-tab><i class=\"fa fa-ban\"></i> {{'Admin.Bureaux.BuMod_Habil' | translate}}</a></li>\n" +
    "            <li><a href=\"#metadata\" bs-tab><i class=\"fa fa-code\"></i> {{'Admin.Bureaux.BuMod_Meta' | translate}}</a></li>\n" +
    "            <li><a href=\"#restriction\" bs-tab><i class=\"fa fa-link\"></i> {{'Admin.Bureaux.BuMod_Assoc' | translate}}</a></li>\n" +
    "            <li><a href=\"#delegation\" bs-tab><i class=\"fa fa-share\"></i> {{'Admin.Bureaux.BuMod_Deleg' | translate}}</a></li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"span7 tab-content\">\n" +
    "            <div class='tab-pane active' id='general'>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <div class=\"form-group mandatory-group\">\n" +
    "                        <label for=\"name\">{{'Admin.Bureaux.Bu_Shortname' | translate}}</label>\n" +
    "                        <span class=\"label label-danger\"><i\n" +
    "                                class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                        <input class=\"form-control\" ph-negative-pattern='.*(?:\\.+|[&\"£*\\/<>?%|+;]+.*)$' type=\"text\"\n" +
    "                               id=\"name\" name=\"name\" placeholder=\"{{selectedBureau.name}}\" ng-model=\"editedBureau.name\"\n" +
    "                               diff-array=\"bureauxExceptCurrent\" attr=\"name\" required>\n" +
    "                        <div class=\"input-help\">\n" +
    "                            <h4 ng-show=\"modalForm.name.$error.isdiff\">{{'Admin.Bureaux.BuMod_Isdiff' | translate}}</h4>\n" +
    "                            <h4 ng-show=\"modalForm.name.$error.pattern\">{{'Admin.Bureaux.BuMod_Pattern' | translate}}</h4>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group mandatory-group\">\n" +
    "                        <label for=\"title\">{{'Admin.Bureaux.Bu_Name' | translate}}</label>\n" +
    "                        <span class=\"label label-danger\"><i\n" +
    "                                class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                        <input class=\"form-control\" type=\"text\" id=\"title\" name=\"title\"\n" +
    "                               placeholder=\"{{selectedBureau.title}}\" ng-model=\"editedBureau.title\" required>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label\" for=\"description\">{{'Admin.Bureaux.Bu_Desc' | translate}}</label>\n" +
    "                        <input class=\"form-control unvalidate\" type=\"text\" id=\"description\" name=\"description\"\n" +
    "                               placeholder=\"{{selectedBureau.description}}\" ng-model=\"editedBureau.description\">\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"avenir\">\n" +
    "                            <input type=\"checkbox\" class=\"unvalidate\" id=\"avenir\" name=\"avenir\" ng-model=\"editedBureau['show-a-venir']\">\n" +
    "                            {{'Admin.Bureaux.BuMod_Show_Next' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <div class=\"well\">\n" +
    "                        <h3>{{'Admin.Bureaux.BuMod_Sup' | translate}}</h3>\n" +
    "                        <p style=\"font-size: 16px;\"><b>{{'Admin.Bureaux.BuMod_Actual' | translate}} :</b>\n" +
    "                            <span ng-if=\"!!editedBureau.hierarchie\">\n" +
    "                                {{(bureaux | filter:{id:editedBureau.hierarchie})[0].name}} <i class=\"fa fa-times-circle text-danger pointer\" ng-click=\"listHandler.selectSuperieur(bureau)\"></i>\n" +
    "                            </span>\n" +
    "                            <span ng-if=\"!editedBureau.hierarchie\">\n" +
    "                                -- {{'None' | translate}} --\n" +
    "                            </span>\n" +
    "                        </p>\n" +
    "                        <div>\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                <input placeholder=\"Rechercher\" ng-model=\"searchBureauSuperieur\" ng-change=\"listHandler.search(searchBureauSuperieur)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div style=\"height:15px;\" ng-if=\"listHandler.total > 0 && listHandler.maxSize < listHandler.total\">\n" +
    "                                <span class=\"text-warning float-right\">\n" +
    "                                    {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} sur {{listHandler.total}}\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listHandler.page === 0\" ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\" ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span class=\"text-info\" ng-if=\"listHandler.subList.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Result_None' | translate}}</span>\n" +
    "                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                            <li ng-repeat=\"bureau in listHandler.subList\">\n" +
    "                                <a ng-click=\"listHandler.selectSuperieur(editedBureau.hierarchie === bureau.id ? null : bureau)\">\n" +
    "                                    <i ng-class=\"editedBureau.hierarchie === bureau.id ? 'fa fa-arrow-right text-success' : ''\"></i><i ng-if=\"editedBureau.hierarchie !== bureau.id\" style=\"width: 13px;display:inline-block;\"></i> {{bureau.name}}\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class='tab-pane' id='acteurs'>\n" +
    "                <h4>Attribuer des rôles à des utilisateurs</h4>\n" +
    "                <div class=\"col-md-12\" style=\"height:50px\">\n" +
    "                    <form>\n" +
    "                        <div class=\"col-md-5\">\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                <input placeholder=\"Rechercher un utilisateur\" ng-model=\"searchUser\" ng-change=\"listUsersHandler.search(searchUser)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4 margin-none\">\n" +
    "                    <div>\n" +
    "                        <div>\n" +
    "                            <legend style=\"margin-bottom:5px;\">\n" +
    "                                {{'Admin.Bureaux.BuMod_Result' | translate}}\n" +
    "                            </legend>\n" +
    "                            <div style=\"height:30px;\" ng-if=\"listUsersHandler.maxSize < listUsersHandler.total\">\n" +
    "                                <span class=\"text-warning float-right\">\n" +
    "                                    {{listUsersHandler.page*listUsersHandler.maxSize +1}}-{{(listUsersHandler.page+1)*listUsersHandler.maxSize < listUsersHandler.total ? (listUsersHandler.page+1)*listUsersHandler.maxSize : listUsersHandler.total}} sur {{listUsersHandler.total}}\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listUsersHandler.page === 0\" ng-click=\"listUsersHandler.pagine(-1)\"></span>\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listUsersHandler.page+1 >= (listUsersHandler.total/listUsersHandler.maxSize)\" ng-click=\"listUsersHandler.pagine(1)\"></span>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span class=\"text-info\" ng-if=\"listUsersHandler.total == 0 || (listUsersHandler.subList.length === 0 && editedBureau.proprietaires.length === 0 && editedBureau.secretaires.length === 0)\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Result_None' | translate}}</span>\n" +
    "                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\" style=\"margin-top:5px;\">\n" +
    "                            <li ng-repeat=\"user in listUsersHandler.subList\" ng-switch on=\"userSelected(user)\">\n" +
    "                                <a ng-switch-when=\"false\">\n" +
    "                                    <i tooltip-placement=\"right\" tooltip=\"Ajouter aux propriétaires\" class=\"fa fa-plus-circle pointer text-success\" ng-click=\"editedBureau.proprietaires.push(user)\"></i>\n" +
    "                                    <i tooltip-placement=\"right\" tooltip=\"Ajouter aux secrétaires\" class=\"fa fa-plus-circle pointer text-warning\" ng-click=\"editedBureau.secretaires.push(user)\"></i>\n" +
    "                                    {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                                </a>\n" +
    "                                <a class=disabled ng-switch-default>\n" +
    "                                    {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                                </a>\n" +
    "\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <legend class=\"text-success\">\n" +
    "                        {{'Admin.Bureaux.Bu_Prop' | translate}}\n" +
    "                    </legend>\n" +
    "\n" +
    "                    <span ng-if=\"editedBureau.proprietaires.length === 0\" class=\"text-success\">\n" +
    "                        <i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_None_Prop' | translate}}\n" +
    "                    </span>\n" +
    "                    <ul>\n" +
    "                        <li ng-repeat=\"user in editedBureau.proprietaires\" class=\"text-success hover-li pointer\" ng-click=\"editedBureau.proprietaires.splice($index, 1); listUsersHandler.getNewList();\">\n" +
    "                            <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                            {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <legend class=\"text-warning\">\n" +
    "                        {{'Admin.Bureaux.Bu_Sec' | translate}}\n" +
    "                    </legend>\n" +
    "                    <span ng-if=\"editedBureau.secretaires.length === 0\" class=\"text-warning\">\n" +
    "                        <i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_None_Sec' | translate}}\n" +
    "                    </span>\n" +
    "                    <ul>\n" +
    "                        <li ng-repeat=\"user in editedBureau.secretaires\" class=\"text-warning hover-li pointer\" ng-click=\"editedBureau.secretaires.splice($index, 1); listUsersHandler.getNewList();\">\n" +
    "                            <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                            {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class='tab-pane' id='habilitation'>\n" +
    "                <span class=\"text-info\" ng-if=\"!editedBureau.hab_enabled\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Habil_All' | translate}}</span>\n" +
    "                <div class=\"checkbox\">\n" +
    "                    <label for=\"hab_enabled\">\n" +
    "                        <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_enabled\" name=\"hab_enabled\" ng-model=\"editedBureau.hab_enabled\" ng-change=\"changeHabilitations()\"> {{'Admin.Bureaux.BuMod_Habil_Select' | translate}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div ng-show=\"editedBureau.hab_enabled\" class=\"col-md-offset-1\">\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"hab_transmettre\">\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_transmettre\" name=\"hab_transmettre\" ng-change=\"editedBureau.hab_traiter = editedBureau.hab_transmettre\" ng-model=\"editedBureau.hab_transmettre\"> {{'Admin.Bureaux.BuMod_Habil_Create' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"hab_traiter\">\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_traiter\" name=\"hab_traiter\" ng-model=\"editedBureau.hab_traiter\" ng-disabled=\"editedBureau.hab_transmettre\"> {{'Admin.Bureaux.BuMod_Habil_Handle' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"hab_archivage\">\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_archivage\" name=\"hab_archivage\" ng-model=\"editedBureau.hab_archivage\"> {{'Admin.Bureaux.BuMod_Habil_Archive' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"hab_enchainement\">\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_enchainement\" name=\"hab_enchainement\" ng-model=\"editedBureau.hab_enchainement\"> {{'Admin.Bureaux.BuMod_Habil_Chain' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"checkbox\">\n" +
    "                        <label for=\"hab_secretariat\">\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\" id=\"hab_secretariat\" name=\"hab_secretariat\" ng-model=\"editedBureau.hab_secretariat\"> {{'Admin.Bureaux.BuMod_Habil_Send' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class='tab-pane' id='metadata'>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <span class=\"text text-info\">\n" +
    "                        <i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Meta_Info' | translate}}\n" +
    "                    </span>\n" +
    "\n" +
    "                    <div class=\"well\">\n" +
    "\n" +
    "                        <label>\n" +
    "                            <input class=\"unvalidate\" type=\"checkbox\"  ng-click=\"\n" +
    "                                editedBureau['metadatas-visibility'].length === metadatas.length ?\n" +
    "                                    unselectAllMetadatas() :\n" +
    "                                    selectAllMetadatas()\" ng-checked=\"editedBureau['metadatas-visibility'].length === metadatas.length\"/>\n" +
    "                            Tout sélectionner / tout désélectionner\n" +
    "                        </label>\n" +
    "\n" +
    "                        <div class=\"nav nav-list nav-pills nav-stacked\">\n" +
    "                            <ul>\n" +
    "                                <li ng-repeat=\"metadata in metadatas\">\n" +
    "                                    <div class=\"checkbox\">\n" +
    "                                        <label for=\"{{metadata.id}}\">\n" +
    "                                            <input class=\"unvalidate\" type=\"checkbox\" id=\"{{metadata.id}}\" name=\"{{metadata.id}}\" ng-click=\"checkMetadataVisibility($event, metadata.id)\" ng-checked=\"editedBureau['metadatas-visibility'].indexOf(metadata.id) != -1\"> {{metadata.name}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class='tab-pane' id='restriction'>\n" +
    "                <span class=\"text-info\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Assoc_Info' | translate}}\n" +
    "                </span>\n" +
    "                <div class=\"well row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div>\n" +
    "                            <input placeholder=\"Recherche\" ng-model=\"searchBureauSuperieur\" ng-change=\"listHandler.search(searchBureauSuperieur)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                            <div class=\"row\" style=\"margin-bottom: 5px; margin-top:5px;\">\n" +
    "                                <span class=\"btn btn-success col-md-5 force-display\" ng-click=\"listHandler.selectAllResults()\">\n" +
    "                                    <i class=\"fa fa-plus-circle\"></i>\n" +
    "                                    {{'Admin.Bureaux.BuMod_Assoc_All' | translate}}\n" +
    "                                </span>\n" +
    "                                <span class=\"btn btn-danger col-md-5 col-md-offset-2 force-display\" ng-click=\"listHandler.unselectAll()\">\n" +
    "                                    <i class=\"fa fa-times-circle\"></i>\n" +
    "                                    {{'Admin.Bureaux.BuMod_Assoc_SelNone' | translate}}\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                            <div style=\"height:15px;\" ng-if=\"listHandler.maxSize < listHandler.total\">\n" +
    "                                <span class=\"text-warning float-right\">\n" +
    "                                    {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} {{'On' | translate}} {{listHandler.total}}\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listHandler.page === 0\" ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\" ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span class=\"text-info\" ng-if=\"listHandler.total == 0 || (listHandler.subListDelegationPossible.length === 0 && editedBureau['delegations-possibles'].length === 0)\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Result_None' | translate}}</span>\n" +
    "                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                            <li ng-repeat=\"bureau in listHandler.subListDelegationPossible\" ng-switch on=\"editedBureau['delegations-possibles'].indexOf(bureau.id)\">\n" +
    "                                <a ng-click=\"listHandler.selectDelegationPossible(bureau)\" ng-switch-when=\"-1\">\n" +
    "                                    <i tooltip-placement=\"right\" tooltip=\"Sélectionner le bureau\" class=\"fa fa-plus-circle text-success\"></i> {{bureau.name}}\n" +
    "                                </a>\n" +
    "                                <a class=\"disabled\" ng-switch-default>\n" +
    "                                    {{bureau.name}}\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Bureaux.BuMod_Assoc_Select' | translate}}</h3>\n" +
    "                        <span ng-if=\"editedBureau['delegations-possibles'].length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_Assoc_None' | translate}}</span>\n" +
    "                        <ul class=\"list-unstyled pointer\">\n" +
    "                            <li class=\"hover-li\" ng-click=\"listHandler.unselectDelegationPossible(bureau.id)\" ng-repeat=\"bureau in (bureaux | sameId:editedBureau['delegations-possibles'])\">\n" +
    "                                <i tooltip=\"Désélectionner le bureau\" class=\"text-danger fa fa-times-circle\"></i> {{bureau.name}}</li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class='tab-pane' id='delegation'>\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <legend>\n" +
    "                        {{'Admin.Bureaux.BuMod_Deleg_State' | translate}} :\n" +
    "                        <span class=\"label label-success\" ng-show=\"delegationEnabled\">{{'Admin.Bureaux.BuMod_Deleg_Enabled' | translate}}</span>\n" +
    "                        <span class=\"label label-danger\" ng-show=\"!delegationEnabled\">{{'Admin.Bureaux.BuMod_Deleg_Disabled' | translate}}</span>\n" +
    "                    </legend>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-8\">\n" +
    "                    <div>\n" +
    "                        <label style=\"margin-bottom: 0px;\" ng-class=\"delegationActivated ? 'text-danger' : 'text-success'\" for=\"activatedDelegation\">\n" +
    "                            <i ng-if=\"!delegationActivated\" class=\"fa fa-2x fa-toggle-off\"></i>\n" +
    "                            <i ng-if=\"delegationActivated\" class=\"fa fa-2x fa-toggle-on\"></i>\n" +
    "                            <span ng-if=\"!delegationActivated\">{{'Admin.Bureaux.BuMod_Deleg_Enable' | translate}}</span>\n" +
    "                            <span ng-if=\"delegationActivated\">Désactiver la délégation</span>\n" +
    "                            <input style=\"display: none;\" class=\"unvalidate\" id=\"activatedDelegation\" type=\"checkbox\" ng-click=\"selectedDelegation.idCible = undefined\" ng-model=\"delegationActivated\">\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"delegationActivated\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"parapheurCible\">{{'Admin.Bureaux.Bu_Target' | translate}}</label>\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <div class=\"right-inner-addon\">\n" +
    "                                    <i class=\"fa fa-question-circle\" tooltip-placement=\"bottom\" tooltip=\"Seuls les bureaux associés pourront être sélectionnés\"></i>\n" +
    "                                    <input id=\"parapheurCible\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"selectedBureauForDelegation\" placeholder=\"{{'Admin.Dossiers.Find_Desk' | translate}}\"\n" +
    "                                           typeahead=\"bureau as bureau.title for bureau in bureaux | sameId:editedBureau['delegations-possibles'] | filter:queryForFilter($viewValue) | limitTo:5\"\n" +
    "                                           typeahead-on-select=\"checkDelegation($item)\"\n" +
    "                                           name=\"parapheurCible\">\n" +
    "                                </div>\n" +
    "\n" +
    "                                <span class=\"input-group-addon\" style=\"opacity: 0.7;\" ng-class=\"!!selectedBureauForDelegation.id ? 'label-success' : 'label-warning'\">\n" +
    "                                {{!!selectedBureauForDelegation.id ? ('Admin.Dossiers.Find_Desk_Sel' | translate) : ('Admin.Dossiers.Find_Desk_None' | translate)}}\n" +
    "                            </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"delegationFrom\">{{'Admin.Bureaux.Bu_Begin' | translate}}</label>\n" +
    "                            <div class=\"input-group col-md-6\">\n" +
    "                                <input type=\"text\" id=\"delegationFrom\" ng-change=\"checkDelegation()\" min-date=\"0\" from=\"true\" name=\"delegationFrom\" linked=\"#delegationTo\" return-format=\"timestamp\" ng-model=\"selectedDelegation['date-debut-delegation']\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker ng-required=\"delegationActivated\"/>\n" +
    "                                <span ng-if=\"!!selectedDelegation['date-debut-delegation']\" ng-click=\"selectedDelegation['date-debut-delegation'] = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"delegationFrom\" ng-if=\"!selectedDelegation['date-debut-delegation']\" class=\"input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"modalForm.delegationFrom.$error.required\">{{'Admin.Bureaux.BuMod_Deleg_Required' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"delegationTo\">{{'Admin.Bureaux.Bu_Fin' | translate}}</label>\n" +
    "                            <div class=\"input-group col-md-6\">\n" +
    "                                <input type=\"text\" id=\"delegationTo\" ng-change=\"checkDelegation()\" min-date=\"0\" name=\"delegationTo\" linked=\"#delegationFrom\" return-format=\"timestamp\" ng-model=\"selectedDelegation['date-fin-delegation']\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker ng-required=\"!selectedDelegation['date-debut-delegation'] && delegationActivated\"/>\n" +
    "                                <span ng-if=\"!!selectedDelegation['date-fin-delegation']\" ng-click=\"selectedDelegation['date-fin-delegation'] = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"delegationTo\" ng-if=\"!selectedDelegation['date-fin-delegation']\" class=\"input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"modalForm.delegationTo.$error.required\">{{'Admin.Bureaux.BuMod_Deleg_Required' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <label for=\"dossiersActuels\">\n" +
    "                                <input type=\"checkbox\" class=\"unvalidate\" id=\"dossiersActuels\" ng-model=\"selectedDelegation['deleguer-presents']\">\n" +
    "                                {{'Admin.Bureaux.BuMod_Deleg_Current' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <span class=\"text-danger\" ng-if=\"selectedDelegation.willItLoop\"><i class=\"fa fa-warning\"></i> {{'Admin.Bureaux.BuMod_Deleg_Loop' | translate}}</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div style=\"position: absolute; z-index: 2000000000; left: 20px;\" ng-if=\"isSaving\">\n" +
    "        <span style=\"position: absolute; z-index: 2000000000; left: 10px;\" us-spinner=\"{radius:10, width:4, length: 8}\" ></span>\n" +
    "        <span class=\"text text-info\" style=\"margin-left:50px;\">\n" +
    "            {{'Admin.Bureaux.BuMod_Saving' | translate}}\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"!modalForm.$valid\">\n" +
    "        <i class=\"fa fa-floppy-o\"></i>\n" +
    "        {{'Save' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/chainModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/chainModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'chainModal.circuit_chaining' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <form novalidate name=\"chainCircuit\" class=\"form-horizontal\" ng-submit=\"ok()\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"form-group col-md-8\">\n" +
    "                    <label for=\"select-type\">{{'chainModal.type' | translate}}</label>\n" +
    "                    <select class=\"form-control\" id=\"select-type\" ng-disabled=\"flags.disabled\" ng-model=\"action.type\"\n" +
    "                            ng-change=\"action.sousType = ''\" ng-options=\"value.id as value.id for value in typo\"\n" +
    "                            required>\n" +
    "                        <option value=\"\">-- {{'chainModal.type_selection' | translate}} --</option>\n" +
    "                    </select>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4>Requis</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group col-md-8\">\n" +
    "                    <label for=\"select-sous-type\">{{'chainModal.subtype' | translate}}</label>\n" +
    "                    <select class=\"form-control\" id=\"select-sous-type\" ng-disabled=\"flags.disabled\"\n" +
    "                            ng-model=\"action.sousType\"\n" +
    "                            ng-options=\"value for value in (typo | findWithId:action.type).sousTypes\" required>\n" +
    "                        <option value=\"\">-- {{'chainModal.subtype_selection' | translate}} --</option>\n" +
    "                    </select>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4>{{'Mandatory' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <span style=\"margin-bottom:15px;\" class=\"col-md-8 text text-danger\" ng-if=\"!!circuit.sigFormat && circuit.sigFormat !== dossier.circuit.sigFormat\">\n" +
    "                    <i class=\"fa fa-warning\"></i>\n" +
    "                    Attention ! <br/>\n" +
    "                    Le format de signature du dossier est incompatible avec le format de signature de la typologie sélectionnée\n" +
    "                </span>\n" +
    "                <div class=\"form-group col-md-8\">\n" +
    "\n" +
    "                    <div>\n" +
    "                        <p class=\"label label-info label-block\" ng-show=\"circuit.hasSelectionScript\">\n" +
    "                            <span>\n" +
    "                                {{'chainModal.circuit_selection_script_detected' | translate}}\n" +
    "                                {{'chainModal.you_should_set_metadata_before_reloading_the_circuit' | translate}}\n" +
    "                            </span>\n" +
    "                        </p>\n" +
    "                        <div ng-show=\"circuit.hasSelectionScript\" class=\"btn btn-info col-md-12\"\n" +
    "                             style=\"margin-bottom:10px;\" ng-click=\"updateCircuit()\">\n" +
    "                            <i class=\"fa fa-refresh\"></i>\n" +
    "                            {{'chainModal.reload_circuit' | translate}}\n" +
    "                        </div>\n" +
    "                        <ol class=\"col-md-12\">\n" +
    "                            <li ng-repeat=\"etape in circuit.etapes\">\n" +
    "                                <i class=\"fa fa-fw fa-lg\" ng-class=\"getIconClass(etape.actionDemandee)\" tooltip=\"{{getActionTooltip(etape)}}\"></i>\n" +
    "                                    <span ng-if=\"etape.transition === 'VARIABLE'\" class=\"little-select\">\n" +
    "                                        <i class=\"fa fa-fw\"\n" +
    "                                           ng-class=\"action.acteursVariables[$index] ? 'text-success fa-check-square-o' : 'fa-question'\"></i>\n" +
    "                                        <select required class=\"unvalidate\"\n" +
    "                                                ng-options=\"acteur.id as acteur.name for acteur in currentBureau.associes\"\n" +
    "                                                ng-model=\"action.acteursVariables[$index]\">\n" +
    "                                            <option></option>\n" +
    "                                        </select>\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"etape.transition !== 'VARIABLE'\">\n" +
    "                                        {{etape.parapheurName}}\n" +
    "                                    </span>\n" +
    "                            </li>\n" +
    "\n" +
    "                        </ol>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"errorMessage\" class=\"alert alert-danger\">\n" +
    "                        {{errorMessage}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <legend ng-show=\"metaInfos.length > 0\" class=\"mini\">{{'app.nouveau.meta' | i18n}}</legend>\n" +
    "                <div>\n" +
    "                    <div ng-switch on=\"metaInfo.type\" class=\"control-group\"\n" +
    "                         ng-repeat=\"(metaName, metaInfo) in metaInfos\">\n" +
    "                        <div class=\"form-group col-md-8\"\n" +
    "                             ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                             ng-switch-when=\"DATE\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> Obligatoire</span>\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input name=\"{{'date' + $index}}\" ng-change=\"metaChanged()\" ng-cloak=\"\" ip-id=\"'date' + $index\"\n" +
    "                                       return-format=\"timestamp\" readonly=\"true\" ip-datepicker type=\"text\"\n" +
    "                                       ng-model=\"action.metadatas[metaInfo.id].value\" class=\"form-control\"\n" +
    "                                       ng-required=\"metaInfo.mandatory === 'true' && !metaInfo.values\"\n" +
    "                                       ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\">\n" +
    "                                <span ng-click=\"action.metadatas[metaInfo.id].value = ''\"\n" +
    "                                      class=\"pointer input-group-addon\">X</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-8\"\n" +
    "                             ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                             ng-switch-when=\"STRING\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> Obligatoire</span>\n" +
    "                            <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"action.metadatas[metaInfo.id].value\"\n" +
    "                                   ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-8\"\n" +
    "                             ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                             ng-switch-when=\"INTEGER\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> Obligatoire</span>\n" +
    "                            <input type=\"text\" integer ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"action.metadatas[metaInfo.id].value\"\n" +
    "                                   ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-8\"\n" +
    "                             ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                             ng-switch-when=\"DOUBLE\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> Obligatoire</span>\n" +
    "                            <input type=\"text\" decimal ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"action.metadatas[metaInfo.id].value\"\n" +
    "                                   ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-8\"\n" +
    "                             ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                             ng-switch-when=\"BOOLEAN\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\" ng-show=\"{{metaInfo.mandatory === 'true'}}\"> Obligatoire</span>\n" +
    "                            <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                    ng-model=\"action.metadatas[metaInfo.id].value\"\n" +
    "                                    ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                    class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true'\">\n" +
    "                                <option ng-hide=\"metaInfo.mandatory === 'true'\" value=\"\"></option>\n" +
    "                                <option value=\"true\">Oui</option>\n" +
    "                                <option value=\"false\">Non</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group col-md-8\" ng-show=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger float-right\"\n" +
    "                                  ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                    ng-change=\"valuesMetaUndefined(metaInfo.id)\"\n" +
    "                                    ng-model=\"action.metadatas[metaInfo.id].value\"\n" +
    "                                    ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                    class=\"form-control\"\n" +
    "                                    ng-required=\"metaInfo.mandatory === 'true'  && metaInfo.values\">\n" +
    "                                <option ng-hide=\"metaInfo.mandatory === 'true'\" value=\"\"></option>\n" +
    "                                <option ng-repeat=\"value in metaInfo.values\" ng-value=\"value\">{{value}}</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- Pour l'envoi du formulaire avec touche entrée -->\n" +
    "            <input type=\"submit\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div class=\"message-modal\">\n" +
    "        <span class=\"text-info\">\n" +
    "            <i class=\"fa fa-info-circle\"></i> {{'chainModal.once_chain_set_you_have_to_validate_the_folder_transfer_it' | translate}}\n" +
    "        </span>\n" +
    "    </div>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!chainCircuit.$valid\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-road\"></i>\n" +
    "        {{'chainModal.chain_circuit' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/colorationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/colorationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'colorationModal.color_creation_for_the_dashboard' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <label for=\"property\">{{'colorationModal.property' | translate}}</label>\n" +
    "            <select id=\"property\" class=\"form-control unvalidate\" ng-model=\"coloration.property\" required=\"required\" ng-options=\"prop as (prop.i18n | i18n) for prop in properties\">\n" +
    "            </select>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-5\" ng-if=\"coloration.property\">\n" +
    "                <label for=\"test\">Test</label>\n" +
    "                <input id=\"test\" class=\"form-control unvalidate\" ng-model=\"tmp.value\" type=\"text\">\n" +
    "            </div>\n" +
    "            <div class=\"col-md-5\">\n" +
    "                <label for=\"comparator\">{{'colorationModal.comparator' | translate}}</label>\n" +
    "                <select id=\"comparator\" class=\"form-control unvalidate\" ng-model=\"tmp.comparator\">\n" +
    "                    <option>=</option>\n" +
    "                    <option>!=</option>\n" +
    "                    <option ng-show=\"canCompare\">></option>\n" +
    "                    <option ng-show=\"canCompare\"><</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <input type=\"button\" class=\"btn btn-success\" ng-click=\"addToTest()\" value=\"+\" ng-disabled=\"!tmp.value\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <h4>{{'colorationModal.current_conditions' | translate}}</h4>\n" +
    "            <p ng-if=\"coloration.test.length === 0\">{{'None_fp' | translate}}</p>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"test in coloration.test\">\n" +
    "                    <span>{{test.comparator}}</span> {{test.value}} <span ng-click=\"removeCondition($index)\" class=\"fa fa-trash-o right\"></span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-6\">\n" +
    "\n" +
    "        <label for=\"colorBack\">{{'Preview' | translate}}</label>\n" +
    "        <p style=\"background-color: {{coloration.backgroundColor}}; color:{{coloration.textColor}};\">\n" +
    "            {{'colorationModal.text_sample' | translate}}\n" +
    "        </p>\n" +
    "\n" +
    "        <label for=\"colorText\">{{'colorationModal.text_color' | translate}}</label>\n" +
    "        <input id=\"colorText\" class=\"form-control unvalidate\" colorpicker=\"rgba\" ng-model=\"coloration.textColor\" type=\"text\">\n" +
    "\n" +
    "        <label for=\"colorBack\">{{'colorationModal.background_color' | translate}}</label>\n" +
    "        <input id=\"colorBack\" class=\"form-control unvalidate\" colorpicker=\"rgba\" ng-model=\"coloration.backgroundColor\" type=\"text\">\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">{{'Cancel' | translate}}</button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">{{'Save' | translate}}</button>\n" +
    "</div>");
}]);

angular.module("partials/modals/confirmForceModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/confirmForceModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'confirmForceModal.confirmation' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"text-danger col-xs-12\">\n" +
    "            <i class=\"fa fa-warning\"></i> {{'Warning' | translate}} : <br/> {{'confirmForceModal.confirmations_from' | translate}}\n" +
    "            <ul>\n" +
    "                <li ng-if=\"!info.confirmed\" ng-repeat=\"info in infos\">{{info.email}}</li>\n" +
    "            </ul>\n" +
    "            {{'confirmForceModal.hasnt_been_received' | translate}}\n" +
    "        </div>\n" +
    "        <label class=\"legendLabel col-xs-12\">\n" +
    "            {{'confirmForceModal.public_annotations_to_add' | translate}}\n" +
    "            <hr>\n" +
    "            <textarea class=\"form-control annotation\" ng-model=\"action.annotation\"></textarea>\n" +
    "        </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div class=\"spinner\">\n" +
    "        <span us-spinner spinner-key=\"spinner\"></span>\n" +
    "    </div>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/confirmationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/confirmationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'confirmationModal.confirmation' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    {{textModal}}\n" +
    "    <ul class=\"listeDossiers\">\n" +
    "        <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <label class=\"legendLabel col-xs-12\" ng-if=\"showAnnot\">\n" +
    "        Annotation\n" +
    "        <hr>\n" +
    "        <div>\n" +
    "            <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPub\"></textarea>\n" +
    "            <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar class=\"progress-striped active progress-modal\" value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span style=\"color:black; white-space:nowrap;\">{{'confirmationModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/extensionHelpModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/extensionHelpModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'extensionModal.title' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div>\n" +
    "        <h4>Etape 1 : Installation de l'extension {{navigator}}</h4>\n" +
    "        <hr/>\n" +
    "\n" +
    "        <p>\n" +
    "            La version 2 de LiberSign fonctionne avec une extension de navigateur.<br/>\n" +
    "            Cette extension est spécifique au navigateur {{navigator}}.<br/>\n" +
    "        </p>\n" +
    "\n" +
    "        <!-- Premier cas, FireFox -->\n" +
    "        <div ng-if=\"navigator === 'Firefox'\">\n" +
    "            <p>\n" +
    "                <span ng-click=\"installFFExtension()\"\n" +
    "                      class=\"btn btn-success pointer\"><i class=\"fa fa-download\"></i> Installer l'extension</span><br/>\n" +
    "            </p>\n" +
    "            <p>\n" +
    "                <span class=\"label label-warning\">Attention</span> Il est possible que vous obteniez le message\n" +
    "                ci-dessous lors de l'installation :<br/>\n" +
    "                <img class=\"table-bordered\"\n" +
    "                     src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYkAAABwCAYAAADrN4zYAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4AUGDQg01q6MYAAAIABJREFUeNrtnXuQHMWd579ZWY/unqcG9OAlgW9GcgjhsMKHbEbGB9YhNKNjLeMTh/Htgm+FpI3wIelsLnZt7hUhNmKRL5DYOy96+DD2wp0RBxPyMjM8fIcRkrAPsIOQhKQZrNdi8ZIsNI9+VGXm/ZFZ1dUz3TPd89SMfp9Qx2i6q7KyMqt/3/z9fpk5TCmlQBAEQRAD6OlLg5FIEARBEKWwqAkIgiAIEgmCIAiCRIIgCIIgkSAIgiBIJAiCIIjR8t6J03hs51PoT2ei9/rTGTy28ym8d+I0iQRBEMSlzD+8/CsoKOz8+2fRn86gP53Bzr9/FgoK//Dyr4Y8l6bAEgRBTHP6+9PY+bNni3629s9WI5lMkEhcqsQ7l03wlZWSkFJBKgWAgQGwLAuMWWDsYm40lW87xsDoMSKmg1CkM9jx05/DsnQASUqJtX/2r5AaQiAAwJ7ISuZyORw9ehQffPABzp49C9/3IYQAYwyu66Kurg6zZs1CU1MT6urqqFdHbJyVNs5SQippbB6DxRgsyzKGmo2boVZKQIgAQWBeQkEpgFkWOLfh2DZs2wbnVgkDrKCkhBASUgpIpY21ZXFTf6brP8ZtpqTUbSYEhJRQjIExCxbn4GGbmeOlOVaIAEJIfT50vSyLg3MOznVbW0y/X5Y4MZIkYhytg5TRwFFJWdY5E+ZJdHd3Y+/evcjlcsNXijEsXLgQzc3NkeqVi/zoQ2Re6kDm5U6IM+9Dnj0LALAuuwz8yquRuO12JJa3wpo5a5IGqargpzFRhUP+SryEeDkqHL1LCCGMgQ4QBBIAh+No42zb2uiFxrZIB2hjOKwhZoVioxSkFBBBDrlcFplMGv3pLHKBNvTMsuG6CSQ8D57nwnUc2DY39dDnK2Xq7vvwcznksln4EmCOC89xdP15TCygzw3vQ/805RWtfygI2sNRShpRFZBCIAh8BH6AIJdFTjFw1zP1tHWbAaaOAQLfR843dRQSUjFY3IbrefBcfX+OEcPiYpEXp1DYwXQZFmNgFoNV4HUplPq2hvqilMqLGQkOEQs3Pf6Tp4t+tv6+e5BKJSdXJI4fP46XXnqp4vOuu+46LF++vKxjg5PH0bPlr5HpfAEYTiEtC4kVK1Hz4Pdhz7tu3EMXQggIKSBFbGSvrWJeMNTwwjlIaOKhkUEC4cP3c0inswiEBBiHbXtIJl24rgPHzo+OBwlE/DWsQFgFRl4KH7lsBun+C+jpTSOdzSHrB7pLLA7bduF5KdRUp5BIePDcUCgAGOMbikO6rw+ZXIBAKS0wySQSrmsMLwdnzFzbAjOCZ5k6MWNko//HREgKYfrEeA7S/B4YYUr3I+0LSDBY3IGXSsFzdJtZDFBSIPBzyGYz6OvrRzbnIxASCgwW53AcD4mqKqQSCSTCtg6FLSaqkfcigkgYBSxY3IWX8LSoc31OJCjRa4BoRI+QMgJR2E+hBxl6RcSlxX/9b7ui///Fn38LAPB3P34qeu+731kzeSIhpcRTTz2F/v7+EZ2/bNkyNDY2DnlM+rln8On3vwdVhpdScPOeh7q//iGSX189bmGXwPeRy2aRzeXg+4EOY8SNcWTgY0LB4q4CCox2gaGICZEeieZDIEGQQzaTRibrIxAKYBZs24GbSCKV8OA6heEeFb9WPKQTC7GExymlMwwsNDphaAUKUuSQTfeh58IF9PT1I53JIRsEEKYO3HbguQkkUtWordFC4To2uAXAtFc2m0G6txd96QxyfgAhFWDZsB0PiaQH13gTPAydWTEjyCxT/5hRDA1tzAPwfR9BYMRbSoggQODnkMumkc7k4AthPAMHjptCKmXEyQKUDODnssj096K3P4usHxMJi8N2PHiJKlRXJZH0XLiO8d44HywSQkAIH9lsDkIqKOg2crwUqlIuHMcGNx6CFjPdx6FQ5D3TfB+xvH9qPtfiZTsukskkHOPhWORoXDJ0vXcce9pfxl+s+VOkktpr6E+n8Xe7foY/ab0NTf/kuskTiTNnzmDPnj0jPn/evHlYsWJFyc/7fvw4Lvz1fwFGehuWhdrv/2dU/Zu1Yy2PCHJZZNL96O3tQV9/xow4hU7kWmYkb77IMhD6K24xY9BM+AEAYxZs2zbhBAkRmDLi3oXxIJQCpAzg+1lkszkE0bEmH+A48BIJeK4DbjFAweQuVDTq5HxA7J+FQ1UTpkHoQXBw24Ztu0gkXNgWoEQOmf4efHqhB319aaQzWeT8AIEMjZUNx3HhJZJIVmlDmnAd2JxFxjfd14v+/gwy2Rz8wIgEs2DxMFxmPIlIDEy+glvgYd6Cm/o5HhKuDc4ZEHoA6XRUdiCEyUNoD8b3ffO+NvrMsmE7DlwviYTLtcGWAfxcWvep8ZS0+DPTVw5c10MiVYWk58LmHK4bC5MxExtW2pRL3zeilBdS100gVZVCwtXGXMpAh7X80ANSUZgyHGDk/UsGy1KQQsAXAioKgyWQqqlDfW0NqpIJuA4JBTE84564vnDhAkajQ+fOnSvtQfyibXQCoV0dXHj4P4HPnoPEyj8ZOy9CCAR+Fun+HvT0XECvGVX7gdBGLwwhGUGIexEDgzwsFsuOQhRqYPgh7k2Y8EmYgFW6DItz2LaNdLo/EgJWEKpAFJrIey+6iqwgHGUZo2zDth04rotc4CFhW4DMIZPJIJvJIms8qFzORyD1yNfi3BjhAIHQIbFUwoXDGZT0kU33I53W5+ai0b4RsLjnEiWxQ5EY4EEYAXMcBxnPg2tbgAiQy6SRzmSQy/m6fNNOOgQV6OsJARGJpr6mne5Hn8XBOaCCAH6gz9eiIowXoAWdc45sNotMJoM+J5+ot2NeTT7Ml++3eHI/9Dp9j8OChJ/VYusHgfEmCvsdRnCUcfWkElHoUQJgjMNJVKPWl2AmsW5xCy6n0BMxySJh2/a4nC8+OINPv/+90QlELFxz/q++i1k3fhHWrNljIRGQUsD3c8j096O/rw+9vX3oT2d0Eleo2PTKcKTOoliy/h8L/w2oamwWTmRcioiFkrHYdd74+5wXznAqIUhxgSh83xhgIxC2K/S1pIS0LVhKIBcbpYsgMIIltbGSUgtXGBoLAgQ5F47NIIOcPjeXiwRCj/TzXs5AIYgEIvzMhJs4t0wdbeRyObi2BRXkkMlkkTPl+0Gg6xcaUzOzSbetGZObdsuF+QQgn1wXAUSghTgMIzIwBJYVJd65EWb9U4tblMi2LFgWoIzB1w1tgXOBQEoIpRD4FiB8+H44UyzmSQwSChX1hQ6jmXZXCopxuDkJy3HhJauQSmpvUnKLVtQSkysStbW1ozp/xowZRd/veeRhqL7esRv59/bgwpaHUb/lsTERHT3Lx9ex60w/0v2hSEidxA0FIpqhExOL0HgPmDmkjYAqMGZh8rUgRxEXG2PY8p4IIC2JYinpYuIQlWUEgocehNIGzRLcTKsziXmpp7wOzqcATOVFTkgBFvgAJKTwkWXQOQMzbTZK9kcG1EwxlRgghhYsaWb0MBkZdSEscC5NQjqAb6EgH+EHWoSkkFFeQl8rJrrI54CYlJDG6wtH/iLm0SHyyBQgJYSCEUIOIQJwbkOI0JvI53E452Aq1n/M5BLCdSY+TLvKvNiG15WFAqFCD8J4R0EQIJBaxKXikJZjvKisFnEp4SqAFoIQkyoSM2fORG1tLS5cuDCi8+fPnz/Yi/jH00jveW7M65pu+9+o+Xd/CX7FlaP2JPRMI52UDIWiP+1rQ8TySVYLVvEvaZQwLkx0IuZJxENKUuVDWGxgAnfAjKXoggMT4AOvFYYvWH7mkGQKzKy7CMM/tklGu5aCCEzsPwjgCB2GkeZ+ZDRYNiEilhdUFdUnLkgAMzN4VCw8F86oikJM4X1FghhrUqVj81IoKBmG32Kzgoyo6HIVlLIKRAnA4GmroShZlhm5q1ioJ8wKhC0atrH5Gd1DOCuLw2bMiE1elAEFJQL4Mn/NkgOB8BwFMMmi3JVUIvKUmA2zpkOH+kSxgQVBTIZIAEBzczM6OjoqPq+xsRHz5s0b9H7mpfbhp7mOBCGQebEdVfetGWVBxhNQZoZT4COTycD3JRTj4LYJhcSmRRaM/KO8gBUlOiPvRAgEQT6ZLJWEGXrqc8NYfJjgjc0AimYqKeTj4FIiENLE3i0TCjEJVeFrM6cULG4DjMGxXZ0EdV24rouEl0AiUYWqVAKOzQAZIJexjStijD23EYhYcjycrhqbthoNxWV+llbeALOCHE4+7BUmqK1oRrFSKj/zyoShLBZ6MLE1FSZBHyaPw3NVmKBHLASYr535LD+zqEAcwvND0TA/pWLgtgvHdfTMLDufV7G5DdtGbN2GKsgPRTOVLP25JQdPg41NczMTGHzzzIQLA0NvREWznQjiohKJa6+9FjfddBMOHDhQ0TnLli0r+ln2tVfHra7Z1/7P6EUiHjtn2nBKIREIBct14XpJJBMeXEfP9R94rmWSpdHKXcuChQB+oEfovq8Tvr6fg5VjYD7MNFc9zdHzPCQ8L1qsxgeusDYzp5SUCILAhKsYuGPDdnQYRJmwhYpWPGtjr18OHMeF63lIJpKoqq5GKuHCNjOIXNcBtywtVhk3msYqlYq25Mgvfot7TXFPScVCOTEvKDovNsXVscGZhBRmRli4Qjuccor8Ir1ojYTQcf+BXgIGeBlhCDAe0lFFI4wD8wJ5sdMDAweOSWJzbhnxDsNONmwmEAhZOHMJLDb7KL6KPn+PA6WMMQUZ5JDN2OjtMfetJALJ8m0yaAU5QUyySADA5z//efT09ODgwYPDHjt37lzcfvvtJVdbi5MnBr132dPPwf1Sc0V1yh14HWe/9S8Lyz51cgzuloFzbawd24alFJQEbMeDm6xGzYw61FenkHBsMMhoCwoVhT/sKDHsOlxP34SCFFlkM3pWTS6X1esJ0v3oT6eRzgRgThLJZArV1VWorq5G0nPNAjAWG22rglXfSggIP4AAwDiH63na2ENBBFlks1pEmGWMC7fBLRvctuG6HrxEClUps9aBMQASge/CcRzYbj8yZjVy6K1oj0Ufp2Q4Ps8LGIOMRr0yFn6yTMI3v62A8ZocF64bLnIL4OeECZHpqaQ2t8Ag4PtBtN1GlJxGLAcUa5t4iI2F05RjuZ+CgQBjAzwJk5SPcgeIpu/qxXE62Q6lYtuUcNMfArmcH23zAeNlcW4Zz04gCPJhIsvisQWEZsFduIbD4WBSROJsKRue68HzEkiGC/UsixZlExePSADAF77whbJEYsmSJUNuxyE+/mjQe5UKBAC4N315cNkffjgm98q4DS+RRHVVErZrw3ZcIFGHGTOvxjVzLkNddRKubYEpCT/nawOEWKzfvMLtM/KhhHA7CJ3n6L3wKT49z+E4EsxOoLquAQ0NdaipSiHhOXA4L7nXUXxLCG1XGRzHhWUxncCVAjk/iD7nNo9mNlnMgu04sG29LiA+395x9DqBZFWN8VSM52ICHaFRDmdgIRZe0SESHWoSQubFIFoQp6KRdDQlNlwJrSRkIGPrQripV2xUb0bjyuQctKGFNvZSanGUWtDCkBRMjiIIAh0Rg4Jl8cjQSyljmwLmvSGlI0/R6u9wNhbiQhNfVBkPs6kC5xIATLJaFuRo8jPUwtXkesW7wxmE7yPwJSRseNxFsroWddW1qEnptSmcZjYRF5tIlB+tmR7DG8tOIFXTgNn1tejJOuDVM3HlNVfjigYdnuGWMUxKG6bQcOuV1YiEMhQJxlgU59b7I2XQV10Fz/HQmxVgThL1l89GQ30NqpMeHM7BY/szWZY1eM2K+T0+Sydc2R3/KWOhmbBerNTGdcwCdyxwAK7rFawKjh/OCvePGChhBdN3pxyDwlIDtmEBooEBi4l2JIKFmRCoWC6pIL9dsGrfLAp0HdiWMiLLYacEwD1U183AjIZ61FTpbUZsWiNBXGwi8Zvf/KashXVvvvkmli9fXtKb4LNmIzjx+8LQ0Zu/hvtPv1hZuOk3bwwue86cMVQJDq96BmZeuwjerBwsN4nqmlpUhSuAAYDrUINTsRvkIZnUuQ3PS6IvK8HcFGpqa1CV8OBYZQqw+Z0PcznO+YiboSD/UEHIbkqPFYrG+wtnSw3lLQ/1PVExaYnP4gq37tB5DxvccuB6KdQIwE4kkUpVoaYmpTcftG3yIojyHuWJ2Lvp5MmT+N3vfoczZ86Ufd7ll1+OxYsX4zOf+cwgA3Xuvm8i+9r/HZf6erd8FQ3/4+kxb4O8lxCGj8ZqxCoHTJ+09HYbxKWL0hMShFmdLZSCxXVo0OK2ydMQxDh5Er29vdi3bx/ef/99ZDKZcavYJ598gpdffjn6/aabbsLixYu1If/qbeMmEolly8e8TGs8d91kFu2/Qwx6JmzH1Xkwghit/apUIH7+85/jvffeG1eBKMaJEyfyhvyrtwHjYXg5h/fV5fRUEARBjEQkXn/9dWSz2Ump6AcffBBtN86vvgapu+4Z82uk7v7TaLW1HI/FegRBENNZJE6dOlV0M7mJeEkp8eabb0Z1qX7gu2BV1WPnoVfXoObfbop+D4Sgp4MgCBKJSg72fX9SK3vo0CH88Y9/1N7EnCsw40e7otlBo4LbmPGjXdEOsL7vw7FtejoIgiCRmEqVlVLiV796LZon7t18C2r/8j+M7m/5WhZq/+o/wvvyP4veymQy02atBkEQxCUjEgBw+vQpvPar16Lfq/58PWb8951gqVTFZbFUFWb86McFf5Xuj388j9QIyhqaDqwbsBPr0m3dQPc2LGVLsa270uLW6XKWbkP3tHkUdRut6yjnuDLarGPdxLTPSPuwrPvrwLrwHsb8OmVce9yvN0Z9Pdr+KattL4b2mAIiMVn5iPiLMYZf/+bXePfdI1G9Eiv+BWbtfRPV678D5nnDi4PnoXr9dzBr7/9DYnlL9H5vXx8U1KgWjpWmGVu78vexb0Mj0LgB+9Q+bGis8IvTugNr2xXUvg1onCYPYse6NqxSXVjYNhaGvQPrNi9E10S0T0EfjqMhGdGzQgaurHYbVdtOf6Zk4D2VTOK5557Dki8uwT9ftkxvcjajATX//iFU3Xc/Mi91IPNyJ4KTxyE/0Av4rDlXwL72M0jcdjsSy1thzZxVUObZs+eQy+VwxRVzpkALNGNh03R6DLvR9OB2NAJoeXDl6EWiuwkP7msBfecJ4hIMN4XU1FTjwIE38MzuZwv+oJE1azZS//o+NDz5vzDr1V9jzpFTmHPkFGa9+ms0/OR/IvWt+woEwvd9vP/+H9DT24tZs2ZOojut/79u3VIwtg4dkRschqjWoQMdWMdasQP7sbHJhKwGHReGbLqxbWnsmBLhl451sTBYqVjPoHrE6t6R/2xdB9C9bWlhSK3EsUvjw9ruF3Bvkym/aQu6YuKxbenA+zJ0lSprG5Y2NaGpoK6DRalouUXvc7jzwj4s7JuoLYcts/CYpduOxT5owfbIGyoSCtq2rkhbD6xj8XqV1e9lPgMFz2xJ76Xc+pdbhwHPQ0EbbhsibDZUH6L8PkMF5Q33PSeRGKeKWxbq62rR1XUMj/3t3+KVX/4S/f3pss9PZzJ4+ZVX8DePPIKf/uyneOPAfhw7dmwca2y+pMUe8NgxBxc+CaW2owUdWNf0DO4KQ1TtwOZtTdiu2rHWhK72bWjUD13TRixqN8d1bcXB1qXY1t2IDfvasWjjFi0urUB7kfBLy/YwBNaOtTs2FwlJFKtHd/6eNgNPKgXVvhY7WhnuxZPmuLXYv3FL7EsQO7ZrK7Dx3vyXpmj53di2tAnP3NUVhei2t6DodfPXGaqu8S91sXLLOLdjCzYuai9SH2PQY32jtreUWZ/C/nsSz2BHuc/T4VWD23pQHYvVq5x+L/8ZyD+zFX4fitV/yDoUe84racOhnqly7rVYtYZ6Jkrf+8jajERiREJRV1sLbnHs3fs6tvxwC574yU+w/8ABnD59GtlsNuq8IAiQTmdw/PgJPPHET/DII4/g9df3weY2qquq8Mknn+CXv/wlOjs7MT7bWRXmJIo/TM24a6Ux493HcDAuLK07sP9wV5Hn/hgOYi1WteTjqw+t3Q99aAu2twOtrBVoL/FAhklw1lr8izVkPZqx9UkjPC2rsDZe/5ZVWIuDONaNwcfG61iq/O4X8Mz+tXioaKB44HXNdcpps1LllnNu00I072gtb9Rbbpndx3CweSsebAm77yGsLfd5Ck+Kt0G5dRyu3yt4BqI+r/T7UKz+Q9ahxHNebhsO+Uyhsu/dSJ+JUbXZFBGJiyF5HX8BQHV1Fepqa2FZFo4fP4HOzhexc9eP8ejWbXj3yFF0v/d7HD9xEgfeeANP/vSnOH7iRCQwVVWpgvvq6urCb3/724uke9aiPX6/28d43NG9DUtbYa7Rha3NE1WPbhw7OF7lj6asYc5t3IB9SuFJ3DuENzjBfTiQcupYdr9P4n1Mle/diJ6JaZyTKHdqaHV1Na666irMnDlxMX7HsVFfV4eGGfWoqkrBdRxks1l0dHTg3Xffxdtvv403DhxAMplAw4x61NfVwXGK5+3feust/QdmJpPG+ViEHUO7urHj2mJx9c07whGXCTOpdqC1SPyz6zD2Ny9EUzTKGkU9ynCxn3mhu2BEt6pliPIbV+Ku5gqvW05dS5VbwX02btiHrq3NOHisewzqMx+L9m/EliiFsbnMcNMo6lhOv4/6GWjCwubQowXQ0Ta6+xrqOS+3Dct5pkb4vBe29xjf+1QSiTnD/K2F+vp6rFq1Ct/+9rdx55134u6778bXvvY1OI4zYTfEOUcqmURdXS0aZtTDdWycPHEcH334AWpqqpFKJoed4prJZPCHP/xhkrumBdu7tgIbm4ZJMOrjDraGid9ncFfXdrSgG9uWtuLg1gfRghY8uPUgWgcmrlsexFZs1Eneew9jUfNo6jG8i73o8L2mjhuxKAp/lSo/zKk0DZPHqbSupcot49yOfKK1aeOiImGLFqxaG08Ql1OfFmw3+RzGGO7FXWWGm4YLI8XrOKBeZfX7aJ+BRmx4KH9frA2ju6+Sz3klbVjOM1XhvRZt77G+98mlor8nceLECfziF78o+llDQwO+8Y1vIJFIDB64dHWhs7NzSjXMjTfeiC996UsgxoIOrGObsbCL5qITE0D3NixtOoyHpkhieFp5Etdeey0WLVo0KC8wY8YMfP3rXy8qEADQ1NSE+vr6iy6fMdQr3HGWIIgpNiTZsjEfTiNGTcWL6W699VZceeWV6O7uRl9fH+bMmYMbb7wRyWRyyPOuu+66aHO+qcBE/70MgiBG7Dpg29ImbIxyK2vRrjbQYsoxYtz/fGnI4cOH8corr0yZhlmwYAFuv/12ekIIgrikmbB1El4ZeypdTJQKnREEQZBIjAOTPqW0Qurq6ujpIAiCRGI0J+dyubKP7e3tnVKJ66uvvvoSfzRi+81MyDbVBEFcjFScuO7v78fevXvx+9//HrlcDpdddhluvfVWXHXVVUOed+bMmUm5wUWLFmHx4sXo7e3FK6+8gp6enmHPmTlzJi6//PKLwEhfJNNGGzdgn9owPe6FIIjx8ySy2SyeffZZHDlyJPIizp49i7a2Npw6dWpIYTlx4sSE39zcuXOxbNkyNDQ0YO7cuVi1atWwuRHGGG6++WZ6MgiCICoViXfeeafoNNYgCLBnz56SQrB3714IISb85m644YaC3xsaGnDHHXeUXAFuWRZuueUWXHPNNWNYC72VcMGizfi23UW3Py62vXM5W4kXu3yp7ZWHLq9wy+ryt3kevAV1JVtoT68tlgnikhOJ9957r+RnQgjs2bMHr732Gs6dOwcpJT799FO8+OKLOHLkyKTcXDFjf9VVV+Gee+7BwoULUVVVBQCoqanBggULcPfdd+Nzn/vcWMdq9BL9trxZ62jbgbUPbUBjye2Pi2/vPPxW4kNvQ124vXKx8srdsrr0Ns+Dt6Ae6Rbaxa87lbZYJojpQEU5ibNnzw65jbZSCm+//Tbefvvti+LmSoWW6uvrcdttt01cRVpWYW1rGzq2t6AFHWg7uBUPbke0/fFDBdsfb0RbF1B8JdDgrcR3NDFsDD9eu6rwxGHLH1Be81Y8Gd9ueePmEjc0cJvnzTjWDbQ0Gi+pdUf+uKLeTam6D8fU2mKZIC45kfB9f1wq4TgO5s6di9mzZyOZTCIIApw/fx4nT57E+fPnp0Ezt+DBrZtx77ZuNGEzDt715BitBl2L9otpVB3bglpvMHhvhXWnIBJBTOlw05hf3LKwZMkSrFmzBnfccQeWLFmCG264AYsXL8att96K++67D3feeScaGhqmfEM3rrwLeGYLtjwT2z10yG2+hyuwzG2oyy1/LLasLncL6pJ1r2SL5YH5C4Igpp1ItLa2orm5ecgZR3PnzsU3v/nNYafYTgGVwF3YgR2LVsVGz0Nvf1y47fRg76SsbahLll+kvNFuWV1yC+pyt9CeXlssE8R0oKK9mx599NExu/D8+fOxcuXKso+/cOECnnjiCUgpyz5n06ZN1MMEQRBT0ZNobKwsKl9bW4srrriCeowgCOJSEImR7OU0GWstCIIgSCQmgY8//rhiUTl37hz1GEEQxKUgEocPH0ZfX1/Zxx88eLCiDQUJgiCICRaJsdxlNZPJoKOjo6wQ0scff4zXX3+94msQBEEQU9STAIBTp07hxRdfHNKg9/T04PnnnycvgiAI4lITCQA4cuQI9u3bV/SzIAjw/PPPo7e3l3qKIAjiUhQJAHjrrbfQ398/6P2jR4/ik08+oV4iCIK4lEVCCFFUDD766CPqIYIgiEmkog3+HMcZt9xAIpEY9J7neSNOQA/3x4UIgiCIMfYk5s2bNy6VmD17NmbOnDno/c9+9rOwrJE5O3PnzqXeJQiCmEiR+PKXv1x0xD8a6urq0NraCsbYoM8aGhpwyy23FP1sOK+E/gQpQRDE6Klogz9Ab7T36quv4uTJkyMOPSUSCVzvT+gsAAAEEElEQVR++eWYP38+rr/+eriuO+TxH374Id555x2cPn0a58+fLxmCcl0X8+bNw1e+8hXU19dT7xIEQUy0SBAEQRCXDhY1AUEQBEEiQRAEQZBIEARBECQSBEEQBIkEQRAEQSJBEARBkEgQBEEQJBIEQRAEiQRBEAQx3bGpCQiCmGiefvppaoRJ5p577iGRIAji4mX16tWwLKviDTwvJZRSkFJi9+7dY9Je8fLKhcJNBEFMCkEQQEoJ2j5uaIMeBMGYtNfA8kgkCIIgiFFDIkEQxKSNlIny22ms2qvSckgkCIIgoZgi7TPa9hrJ+SQSBEEQBIkEQRDTk871HHx958RcrPsx3MxvxmPdJBIEQRAXP92P4eFD9+P+Qw9XYLg7sX6khr7xAewVe/FAI4kEQRDExa8R7buB1d/D91YDu9u7qUFIJAiCICKJQPtuYHVrIxpbVwO729Fd0lsIf+/Eer4SO7EfmxbEwlTdj+FmzsHNKx+90uetX38zOF+PzoJyu/HYzUXOKShrPTqLljM27Nq1K7p+sdeuXbtIJAiCuGTdCOzGarQ2AmhsxWrsxvDOxAo8Ll7A/WjGo0cFxOMrtAFfsAnXvyAghIA4+igOrYwLzH4cWvgEhHgcK+JFdf4Qm65/QZ8jBB5fYcRgwW6sPmrKegF4OCqoRDmjYM2aNdi+fXvRz7Zv3441a9aQSBAEcalqxG5gdSt0eqARrauBTT8cwRi9+xgO4X6sCi134wP4wf37cTgSiWasbi2ShGhciOadK3FzPLnRfQyHQi+Fc/CVO7E/KqhEOeMgFGMlECQSBEFMUTrxw037sX/Tgii0smDTfmBnGzonqgqND2CvEHgC3x4QorofLxjvQojQWxlf4kIxlgJBIkEQxBTViDbsbH4UR+PGWBzFo8070dapPYuFzTFvoLMNO0sa+/m4HuF50DOmdsY8i2G1Yi+OPtqMQ8e6o7IenoQ5sqFQjKVAkEgQBDFFNWInmqNQU2Su0bq6GTvbOgE04oEf3I+dK03Ypw24PzpuBVbdH09cr8DjRx/FofDYBbux+mgZeYPO9TEv5nr84IHGqCzEPJwJW8NhhGKsYYrWxRMEMcE8/fTTWLVqFWzbBuectgsvglIKQggEQYC2trZRt9fA8ujvSRAEccnCOS/5mRCCGqgCSCQIgph2kBCQSBAEMQ1QStFOsBW0zWjaa6TnkkgQBDEpSCmj2DrlJIobdSklpJRj0l4DyyORIAjioiYIAiilSCCGMexh6Gws2iteHokEQRAXvScRjmpJKIob9LFsr5GGqUgkCIKYFDo7O6kRpkB70ToJgiAIoiS04pogCIIgkSAIgiBIJAiCIAgSCYIgCIJEgiAIgiCRIAiCIEgkCIIgiCnEP77/Pv4/o/ytispguyAAAAAASUVORK5CYII=\"/>\n" +
    "                <br/>\n" +
    "                Dans ce cas, cliquez sur 'Autoriser', puis sur 'Installer'\n" +
    "            </p>\n" +
    "        </div>\n" +
    "        <!-- Deuxième cas, Chrome -->\n" +
    "        <div ng-if=\"navigator === 'Chrome'\">\n" +
    "            <a ng-href=\"{{properties['parapheur.extension.libersign.chrome.url']}}\" target=\"_blank\"\n" +
    "               class=\"btn btn-success\"><i class=\"fa fa-download\"></i> Installer l'extension</a>\n" +
    "        </div>\n" +
    "\n" +
    "        <hr/>\n" +
    "    </div>\n" +
    "\n" +
    "    <div>\n" +
    "        <h4>Etape 2 : Installation de l'application LiberSign</h4>\n" +
    "        <hr/>\n" +
    "        <p>\n" +
    "            Un logiciel compagnon est à télécharger puis installer.<br/>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            <a class=\"btn btn-info\" target=\"_blank\"\n" +
    "               ng-href=\"{{properties['parapheur.extension.libersign.native.url']}}\"><i class=\"fa fa-download\"></i> Télécharger le logiciel compagnon</a>\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            Une fois le logiciel compagnon installé, vous pouvez passer à l'étape 3 de l'installation.\n" +
    "        </p>\n" +
    "        <hr/>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "        <h4>Etape 3 : Vérification d'installation</h4>\n" +
    "        <hr/>\n" +
    "        <p>\n" +
    "            Une fois les deux étapes précédentes effectuées, vous devez tester la bonne installation de LiberSign.<br/>\n" +
    "            <span class=\"btn btn-primary\" ng-click=\"testExtension()\">\n" +
    "                <i class=\"fa fa-check\"></i>\n" +
    "                Tester LiberSign\n" +
    "            </span>\n" +
    "        </p>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-close\"></i>\n" +
    "        {{'Close' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/healthModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/healthModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'Admin.Informations.Info_Health' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "\n" +
    "    <div class=\"col-md-12\" ng-if=\"!health\">\n" +
    "        <div style=\"width: 100px; margin: 0 auto;\">\n" +
    "            <div style=\"width:100%;height:100px;\" class=\"css-loader\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"health\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-md-12\"  ng-if=\"!isTenant\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <p><strong>{{'Admin.Informations.Info_Mem' | translate}} :</strong><br/><span class=\"bash\"\n" +
    "                                                                                                  ng-bind-html=\"health.memory | bash\"></span>\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p><strong>{{'Admin.Informations.Info_HDD' | translate}} :</strong><br/><span class=\"bash\"\n" +
    "                                                                                                  ng-bind-html=\"health.disk | bash\"></span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h4 class=\"legend\">{{'Admin.Informations.Info_Launch_Date' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h4 class=\"legend\">{{'Admin.Informations.Info_Nodes_Count' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "\n" +
    "                    <p ng-if=\"health.nginx\"><strong>NginX :</strong><br/>\n" +
    "                        <span ng-if=\"+health.nginx >= 86400\" class=\"text-danger\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-warning\"></i>\n" +
    "                            Redémarrage requis\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                        <span ng-if=\"+health.nginx < 86400\" class=\"text-success\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-check\"></i>\n" +
    "                            OK\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"health.xemelios\"><strong>Xemelios :</strong><br/>\n" +
    "                        <span ng-if=\"+health.xemelios >= 86400\" class=\"text-danger\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-warning\"></i>\n" +
    "                            Redémarrage requis\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                        <span ng-if=\"+health.xemelios < 86400\" class=\"text-success\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-check\"></i>\n" +
    "                            OK\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p ng-if=\"health.office\"><strong>Office :</strong><br/>\n" +
    "                        <span ng-if=\"+health.office >= 86400\" class=\"text-danger\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Redémarrage requis\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"+health.office < 86400\" class=\"text-success\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-check\"></i>\n" +
    "                                OK\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                    </p>\n" +
    "                    <p><strong>Redis :</strong><br/>\n" +
    "                        <span ng-if=\"!health.redis\" class=\"text-danger\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Erreur\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"health.redis\" class=\"text-success\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-check\"></i>\n" +
    "                                OK\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                    </p>\n" +
    "                    <p><strong>Connecteur Pastell :</strong><br/>\n" +
    "                        <span ng-if=\"!health.pastellconnector\" class=\"text-danger\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Erreur\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"health.pastellconnector\" class=\"text-success\">\n" +
    "                            <b>\n" +
    "                                <i class=\"fa fa-check\"></i>\n" +
    "                                OK\n" +
    "                            </b>\n" +
    "                        </span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <p><strong>{{'Admin.Informations.Info_Folders' | translate}} :</strong><br/>\n" +
    "                        <b ng-if=\"+health.dossiers >= 1000\" class=\"text-danger\">\n" +
    "                            <i class=\"fa fa-warning\"  tooltip=\"{{'Admin.Informations.Purge_Advised' | translate}}\"></i>\n" +
    "                            {{health.dossiers}}\n" +
    "                        </b>\n" +
    "                        <span ng-if=\"+health.dossiers < 1000\">\n" +
    "                        {{health.dossiers}}\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p><strong>{{'Admin.Informations.Info_Archives' | translate}} :</strong><br/>\n" +
    "                        <b ng-if=\"+health.archives >= 1000\" class=\"text-danger\">\n" +
    "                            <i class=\"fa fa-warning\" ></i>\n" +
    "                            {{health.archives}}\n" +
    "                        </b>\n" +
    "                        <span ng-if=\"+health.archives < 1000\">\n" +
    "                        {{health.archives}}\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "\n" +
    "                    <p><strong>{{'Admin.Informations.Orphan_Nodes' | translate}} :</strong><br/>\n" +
    "                        <span ng-if=\"health.orphans == '0'\" class=\"text-success\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-check\"></i>\n" +
    "                            OK\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                        <span ng-if=\"health.orphans != '0'\" class=\"text-danger\">\n" +
    "                        <b>\n" +
    "                            <i class=\"fa fa-warning\"></i>\n" +
    "                            {{'Admin.Informations.Orphans_Found' | translate}}\n" +
    "                        </b>\n" +
    "                    </span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h4 class=\"legend\">{{'Admin.Informations.Info_Maintenance' | translate}}</h4>\n" +
    "                <a ng-click=\"regenerateCount()\" ng-disabled=\"reload.launchCount\" class=\"btn btn-default\">\n" +
    "                    <i  ng-class=\"{'fa-spin': reload.launchCount}\" class=\"fa fa-refresh\"></i>\n" +
    "                    {{'Admin.Informations.Regenerate_Count' | translate}}\n" +
    "                </a><br/>\n" +
    "                <span class=\"text-danger\" ng-if=\"messages.error\">\n" +
    "                    {{'Admin.Informations.Regenerate_Error' | translate}}\n" +
    "                </span>\n" +
    "                <span class=\"text-success\" ng-if=\"messages.success\">\n" +
    "                    {{'Admin.Informations.Regenerate_Success' | translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <h4 class=\"legend\">{{'Admin.Informations.Info_Certs' | translate}}</h4>\n" +
    "            <div class=\"row\">\n" +
    "                <a class=\"col-md-4 btn btn-success\" tooltip=\"{{'Admin.Informations.Cacert_Tooltip' | translate}}\" href=\"data:application/x-pem-file;base64,{{health.certs.cacert}}\" download=\"cacert.cer\">\n" +
    "                    <i class=\"fa fa-save\"></i>\n" +
    "                    Cacert\n" +
    "                </a>\n" +
    "                <a class=\"col-md-4 btn btn-info\" tooltip=\"{{'Admin.Informations.Trust_Tooltip' | translate}}\" href=\"data:application/x-pem-file;base64,{{health.certs.trust}}\" download=\"trust.cer\">\n" +
    "                    <i class=\"fa fa-save\"></i>\n" +
    "                    Trust\n" +
    "                </a>\n" +
    "                <a class=\"col-md-4 btn btn-warning\" tooltip=\"{{'Admin.Informations.Store_Tooltip' | translate}}\" href=\"data:application/octet-stream;base64,{{health.certs.truststore}}\" download=\"truststore.jks\">\n" +
    "                    <i class=\"fa fa-save\"></i>\n" +
    "                    TrustStore\n" +
    "                </a>\n" +
    "            </div>\n" +
    "            <div class=\"panel-group\" id=\"accordion\" role=\"tablist\">\n" +
    "                <div class=\"panel panel-default\" ng-repeat=\"cert in health.certs.chain\">\n" +
    "                    <div class=\"panel-heading\" role=\"tab\" id=\"head{{cert.CN}}\">\n" +
    "                        <h4 class=\"panel-title\">\n" +
    "                            {{cert.CN}}\n" +
    "                        </h4>\n" +
    "                    </div>\n" +
    "                    <div id=\"cert.CN\" class=\"panel-collapse collpase in\" role=\"tabpanel\">\n" +
    "                        <div class=\"panel-body\">\n" +
    "                            <ul>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_CN' | translate}} :</strong> {{cert.CN}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_O' | translate}} :</strong> {{cert.O}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_OU' | translate}} :</strong> {{cert.OU}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_L' | translate}} :</strong> {{cert.L}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_ST' | translate}} :</strong> {{cert.ST}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_C' | translate}} :</strong> {{cert.C}}</li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_EMAILADDRESS' | translate}} :</strong>\n" +
    "                                    {{cert.EMAILADDRESS}}\n" +
    "                                </li>\n" +
    "                                <li><strong>{{'Admin.Informations.Cert_Expire' | translate}} :</strong> {{cert.notAfter\n" +
    "                                    | date}}\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "        {{'Close' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/inputModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/inputModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{title | i18n}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <p class=\"text-info\"><i class=\"fa fa-warning\"></i> {{message  | i18n}}</p>\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <form name=\"simpleInput\" class=\"form-horizontal\" ng-submit=\"ok()\">\n" +
    "            <div class=\"form-group mandatory-group\">\n" +
    "                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                <input class=\"form-control validation-control\" type=\"text\" id=\"in\" name=\"in\" ng-model=\"ctrl.value\" required=\"required\">\n" +
    "            </div>\n" +
    "            <!-- Pour l'envoi du formulaire avec touche entrée -->\n" +
    "            <input type=\"submit\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <span class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </span>\n" +
    "    <span class=\"btn btn-primary\" ng-disabled=\"!simpleInput.$valid\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-floppy-o\"></i>\n" +
    "        {{'Save' | translate}}\n" +
    "    </span>\n" +
    "</div>");
}]);

angular.module("partials/modals/journalModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/journalModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'journalModal.event_log' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <table class=\"table table-bordered table-striped\" style=\"table-layout: fixed;\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>{{'journalModal.date' | translate}}</th>\n" +
    "                <th>{{'journalModal.name' | translate}}</th>\n" +
    "                <th>{{'journalModal.annotation_observation' | translate}}</th>\n" +
    "                <th>{{'journalModal.state' | translate}}</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"event in dossiers[0].events\">\n" +
    "                <td>{{event.date}}</td>\n" +
    "                <td>{{event.nom}}</td>\n" +
    "                <td style=\"word-wrap: break-word;\" ng-bind-html=\"event.annotation\"></td>\n" +
    "                <td>{{event.status}}</td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "        {{'Close' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/mailModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/mailModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'mailModal.sending_mail' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailModal.to' | translate}} : <input type=\"text\" class=\"form-control\" ng-pattern=\"/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25}(;[ ]{0,1}([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25})*$/\" ng-model=\"action.destinataires\">\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailModal.object' | translate}} : <input type=\"text\" class=\"form-control\" ng-model=\"action.objet\">\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailModal.message' | translate}} :\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control mailCore\" ng-model=\"action.message\"></textarea>\n" +
    "                    <i class=\"fa fa-4x fa-envelope-o textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <span class=\"legend\">{{'mailModal.folder_list' | translate}}<hr></span>\n" +
    "                <ul class=\"listeDossiers\">\n" +
    "                    <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee === \"ARCHIVAGE\" ? \"À EXTRAIRE\" : dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <label for=\"includeFirstPage\">\n" +
    "                    <input ng-model=\"action.includeFirstPage\" class=\"unvalidate\" type=\"checkbox\" id=\"includeFirstPage\">\n" +
    "                    {{'mailModal.send_signature_slip' | translate}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12\" ng-show=\"hasAnnexes\">\n" +
    "                <span class=\"legend\">{{'mailModal.annexes_to_add' | translate}}<hr></span>\n" +
    "                <label ng-show=\"dossiers.length > 1\">\n" +
    "                    <input type=\"checkbox\" class=\"checkbox-inline unvalidate\" ng-model=\"action.annexesIncluded\">\n" +
    "                    {{'mailModal.send_annexes' | translate}}\n" +
    "                </label>\n" +
    "                <ul ng-show=\"dossiers.length === 1\">\n" +
    "                    <li ng-repeat=\"annexe in action.attachments\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" name=\"selectedAnnexes[]\" class=\"checkbox-inline unvalidate\" ng-model=\"annexe.selected\">\n" +
    "                            {{annexe.name}}\n" +
    "                        </label>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-paper-plane-o\"></i>\n" +
    "        {{'Send' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/mailsecInfosModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/mailsecInfosModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'mailsecInfoModal.folder_state_on_the_secured_mail_platform' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div>\n" +
    "        <b>Statut : </b>\n" +
    "        <span id=\"statusInfos\">{{dossier.infosMailSec.statut}}</span>\n" +
    "        <span ng-if=\"error\" class=\"text text-danger\">\n" +
    "            <i class=\"fa fa-warning\"></i>\n" +
    "            Erreur lors de la récupération du statut.\n" +
    "            </br>\n" +
    "            Veuillez contacter votre administrateur.\n" +
    "        </span>\n" +
    "        <div style=\"float:right;\">\n" +
    "            <span us-spinner spinner-key=\"spinner\"></span>\n" +
    "            <button ng-click=\"update()\" ng-disabled=\"updating\" class=\"btn btn-info\"><i class=\"fa fa-undo\"></i><span> {{'mailsecInfoModal.refresh' | translate}}</span></button>\n" +
    "        </div>\n" +
    "        <br>\n" +
    "        <span ng-if=\"dossier.infosMailSec.documentId\">\n" +
    "            <b>{{'mailsecInfoModal.send_date' | translate}} : </b><span id=\"statusEnvoi\">{{dossier.infosMailSec.envoi | date:'dd/MM/yyyy HH:mm'}}</span>\n" +
    "        </span>\n" +
    "        <span ng-if=\"!dossier.infosMailSec.documentId\">\n" +
    "            <b>{{'mailsecInfoModal.send_date' | translate}} : </b><span id=\"statusEnvoi\">{{dossier.infosMailSec.envoi | toUTC | date:'dd/MM/yyyy HH:mm'}}</span>\n" +
    "        </span>\n" +
    "\n" +
    "        <br>\n" +
    "        <span ng-if=\"dossier.infosMailSec.documentId\" style=\"color: rgba(0,0,0,0.25); font-size: 0.7em;\">\n" +
    "            <b>Identifiant unique : </b><span>{{dossier.infosMailSec.documentId}}</span>\n" +
    "        </span>\n" +
    "\n" +
    "\n" +
    "    </div>\n" +
    "    <br>\n" +
    "    <div>\n" +
    "        <table class=\"table table-striped table-condensed table-bordered\" aria-live=\"polite\">\n" +
    "            <thead>\n" +
    "        <tr>\n" +
    "            <th id=\"column_confirmed\" >{{'mailsecInfoModal.state' | translate}}</th>\n" +
    "            <th id=\"column_mail\">{{'mailsecInfoModal.mail' | translate}}</th>\n" +
    "            <th id=\"column_date\">{{'mailsecInfoModal.modification_date' | translate}}</th>\n" +
    "        </tr>\n" +
    "            </thead>\n" +
    "            <tbody>\n" +
    "                <tr ng-repeat=\"info in dossier.infosMailSec.details\">\n" +
    "                    <td style=\"text-align: center;\">\n" +
    "                        <i ng-class=\"info.confirmed ? 'fa-check text-success' : 'fa-times text-danger'\" class=\"fa\" ></i>\n" +
    "                    </td>\n" +
    "                    <td>{{info.email}}</td>\n" +
    "                    <td>{{info.confirmationDate | date:'EEEE dd MMMM yyyy HH:mm:ss'}}</td>\n" +
    "                </tr>\n" +
    "            </tbody>\n" +
    "\n" +
    "        </table>\n" +
    "    </div>\n" +
    "    <br>\n" +
    "    <p class=\"text-info infoNextStep\" ng-if=\"dossier.infosMailSec.statut === 'confirmé'\">{{'mailsecInfoModal.go_to_next_step_confirmed' | translate}}</p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div style=\"float:left;\">\n" +
    "        <button ng-disabled=\"dossier.infosMailSec.statut == 'confirmé'\" class=\"btn btn-danger\" ng-click=\"remorse()\" ng-if=\"dossier.infosMailSec.documentId\"><i class=\"fa fa-times-circle-o\"></i> Interrompre la récupération de l'état</button>\n" +
    "        <button ng-disabled=\"dossier.infosMailSec.statut == 'confirmé'\" class=\"btn btn-danger\" ng-click=\"remorse()\" ng-if=\"!dossier.infosMailSec.documentId\"><i class=\"fa fa-share\"></i> {{'mailsecInfoModal.use_my_remorse_right' | translate}}</button>\n" +
    "        <button ng-disabled=\"dossier.infosMailSec.statut == 'confirmé'\" class=\"btn btn-success\" ng-click=\"force()\"><i class=\"fa fa-road\"></i> {{'mailsecInfoModal.ignore_unconfirmed_mails' | translate}}</button>\n" +
    "    </div>\n" +
    "\n" +
    "    <button class=\"btn btn-default\" ng-click=\"cancel()\"><i class=\"fa fa-times\"></i> {{'Close' | translate}}</button>\n" +
    "</div>");
}]);

angular.module("partials/modals/mailsecModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/mailsecModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'mailsecModal.send_by_secure_mail' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <label class=\"col-xs-12 mandatory-group\">\n" +
    "                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                {{'mailsecModal.to' | translate}} : <input type=\"text\" class=\"form-control\" ng-pattern=\"/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25}(;[ ]{0,1}([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25})*$/\" ng-model=\"action.destinataires\" required>\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailsecModal.cc' | translate}} : <input type=\"text\" class=\"form-control\" ng-pattern=\"/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25}(;[ ]{0,1}([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25})*$/\" ng-model=\"action.destinatairesCC\">\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailsecModal.cci' | translate}} : <input type=\"text\" class=\"form-control\" ng-pattern=\"/^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25}(;[ ]{0,1}([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5}){1,25})*$/\" ng-model=\"action.destinatairesCCI\">\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12 mandatory-group\">\n" +
    "                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                {{'mailsecModal.object' | translate}} : <input type=\"text\" class=\"form-control unvalidate\" ng-model=\"action.objet\" required>\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12 mandatory-group\">\n" +
    "                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                {{'mailsecModal.message' | translate}} :\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control mailCore unvalidate\" ng-model=\"action.message\" required></textarea>\n" +
    "                    <i class=\"fa fa-4x fa-envelope-o textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\" ng-if=\"dossiers[0].actionDemandee !== 'MAILSECPASTELL'\">\n" +
    "                {{'mailsecModal.password' | translate}} : <input type=\"text\" class=\"form-control unvalidate\" ng-model=\"action.password\">\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\" ng-if=\"dossiers[0].actionDemandee !== 'MAILSECPASTELL'\">\n" +
    "                {{'mailsecModal.sending_password_uncrypted' | translate}}\n" +
    "                <div class=\"checkbox-inline\">\n" +
    "                    <input class=\"unvalidate\" type=\"checkbox\" ng-model=\"action.showpass\">\n" +
    "                </div>\n" +
    "            </label>\n" +
    "            <label class=\"col-xs-12\">\n" +
    "                {{'mailsecModal.include_bord' | translate}}\n" +
    "                <div class=\"checkbox-inline\">\n" +
    "                    <input class=\"unvalidate\" type=\"checkbox\" ng-model=\"action.includeFirstPage\">\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <span class=\"legend\">{{'mailsecModal.folder_list' | translate}}<hr></span>\n" +
    "                <ul class=\"listeDossiers\">\n" +
    "                    <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-xs-12\" ng-show=\"hasAnnexes\">\n" +
    "                <span class=\"legend\">{{'mailsecModal.annexes_to_add' | translate}}<hr></span>\n" +
    "                <label ng-show=\"dossiers.length > 1\">\n" +
    "                    <input type=\"checkbox\" class=\"checkbox-inline unvalidate\" ng-model=\"action.annexesIncluded\">\n" +
    "                    Inclure les annexes\n" +
    "                </label>\n" +
    "                <ul ng-show=\"dossiers.length === 1\">\n" +
    "                    <li ng-repeat=\"annexe in action.attachments\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" name=\"selectedAnnexes[]\" class=\"checkbox-inline unvalidate\" ng-model=\"annexe.selected\">\n" +
    "                            {{annexe.name}}\n" +
    "                        </label>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"!modalForm.$valid\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Send' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/mandatoryReadModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/mandatoryReadModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'mandatoryReadModal.folder_reading_is_required' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <p>{{'mandatoryReadModal.this_folder_have_to_be_read_before_signing' | translate}} {{'mandatoryReadModal.the_download_link_is_available_below' | translate}}</p>\n" +
    "    <a ng-click=\"ok()\" target=\"_blank\" class=\"xemelios\" ng-if=\"dossier.isXemEnabled && (dossier.documents[0].name | fileext) === 'xml'\" href=\"{{context}}/proxy/alfresco/parapheur/dossiers/{{dossier.id}}/{{dossier.documents[0].id}}/xemelios\">\n" +
    "        <img ng-src=\"{{context}}/res/images/xemelios.png\">\n" +
    "        {{'mandatoryReadModal.xemelios_reader' | translate}}\n" +
    "    </a>\n" +
    "    <a ng-click=\"ok()\" ng-if=\"!dossier.isXemEnabled || (dossier.documents[0].name | fileext) !== 'xml'\" target=\"_blank\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{dossier.documents[0].id}}/content/{{dossier.documents[0].name}}\">\n" +
    "        <i class=\"fa fa-lg fa-fw\" ng-class=\"getFileExtIcon(dossier.documents[0].name)\"></i>{{'Download_action' | translate}}</a>\n" +
    "    </a>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/moveModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/moveModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'moveModal.move_folder' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <span class=\"text-danger\"><i class=\"fa fa-warning\"></i> {{'moveModal.moving_a_folder_imply_circuit_modification' | translate}}</span>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-8\">\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'moveModal.available_desks' | translate}}\n" +
    "                <hr>\n" +
    "                <div class=\"input-group\" ng-show=\"bureau.associes.length !== 0\">\n" +
    "                    <div class=\"right-inner-addon\">\n" +
    "                        <i class=\"fa fa-question-circle\" tooltip-trigger=\"click\" tooltip-placement=\"bottom\"\n" +
    "                           tooltip=\"{{'validationModal.type_your_search_tooltip' | translate}}\"></i>\n" +
    "                        <input id=\"bureau\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"action.bureau\"\n" +
    "                               placeholder=\"{{'validationModal.search_by_title_name_or_user' | translate}}\"\n" +
    "                               typeahead=\"bureau as bureau.title for bureau in bureaux | filter:$viewValue | limitTo:8\"\n" +
    "                               name=\"bureau\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <span class=\"input-group-addon\" style=\"opacity: 0.7;\"\n" +
    "                          ng-class=\"!!action.bureau.id ? 'label-success' : 'label-warning'\">\n" +
    "                        {{!!action.bureau.id ? ('validationModal.selected_folder' | translate) : ('validationModal.no_folder_selected' | translate)}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <div class=\"col-md-1\" style=\"margin-top:12px;\">\n" +
    "        <span us-spinner ng-if=\"showSpinner\"></span>\n" +
    "    </div>\n" +
    "    <button ng-disabled=\"showSpinner\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"!modalForm.$valid || showSpinner\" class=\"btn btn-primary\" ng-click=\"ok()\" >\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/notificationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/notificationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'notificationModal.notify_and_add_consultation_credentials' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <legend>{{'notificationModal.available_desks' | translate}}</legend>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                        <input type=\"text\" class=\"unvalidate form-control\" placeholder=\"Recherche de bureau disponible\"\n" +
    "                               ng-model=\"searchBureau\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul class=\"col-md-12 nav nav-pills nav-stacked list-data overflow\">\n" +
    "                    <li class=\"pointer\" ng-click=\"addToNotifications(b.id)\"\n" +
    "                        ng-repeat=\"b in (bureau.associes | filter:searchBureau | notSameIdInArray:dossier.notifications)\">\n" +
    "                        <a>\n" +
    "                            {{b.name}} <span style=\"float:right;\" class=\"label label-success\"><i\n" +
    "                                class=\"fa fa-plus-circle\"></i> {{'notificationModal.notify' | translate}}</span>\n" +
    "                            <br/>\n" +
    "                            <blockquote>\n" +
    "                                <small>{{b.proprietaires | array2string:', '}}</small>\n" +
    "                            </blockquote>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <span class=\"text-info\" ng-if=\"(bureau.associes | notSameIdInArray:dossier.notifications).length === 0\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i> {{'notificationModal.no_desk' | translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <legend>{{'notificationModal.desks_to_notify' | translate}}</legend>\n" +
    "                <ul class=\"nav nav-pills nav-stacked list-data overflow\">\n" +
    "                    <li ng-class=\"notif.mandatory ? '': 'pointer'\"\n" +
    "                        ng-click=\"!notif.mandatory ? removeFromNotifications(notif):'';\"\n" +
    "                        ng-if=\"(bureau.associes | findWithId:notif.id).id\"\n" +
    "                        ng-init=\"b = (bureau.associes | findWithId:notif.id)\"\n" +
    "                        ng-repeat=\"notif in (dossier.notifications)\">\n" +
    "                        <a ng-if=\"!notif.mandatory\">\n" +
    "                            {{b.name}} <span style=\"float:right;\" class=\"label label-danger\"><i\n" +
    "                                class=\"fa fa-times-circle\"></i> {{'notificationModal.remove' | translate}}</span>\n" +
    "                            <br/>\n" +
    "                            <blockquote>\n" +
    "                                <small>{{b.proprietaires | array2string:', '}}</small>\n" +
    "                            </blockquote>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <div style=\"padding:2px 15px !important;\" ng-if=\"notif.mandatory\">\n" +
    "                            {{b.name}}\n" +
    "                            <br/>\n" +
    "                            <blockquote>\n" +
    "                                <small>{{b.proprietaires | array2string:', '}}</small>\n" +
    "                            </blockquote>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <span class=\"text-info\" ng-if=\"dossier.notifications.length === 0\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i> {{'notificationModal.no_desk' | translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/overrideS2low.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/overrideS2low.html",
    "<div class=\"modal-header\" ng-if=\"ready\">\n" +
    "    <h3 ng-show=\"selectedType.sigFormat | contains:'PAdES'\">{{'overrideS2low.pades_signature_profile' | translate}}</h3>\n" +
    "    <h3 ng-show=\"(selectedType.tdtProtocole == 'aucun' || selectedType.tdtNom !=='S²LOW') && !(selectedType.sigFormat | contains:'PAdES')\">{{'overrideS2low.xades_signature_profile_override' | translate}}</h3>\n" +
    "    <h3 ng-hide=\"selectedType.tdtProtocole === 'aucun' || selectedType.tdtNom !=='S²LOW'\">{{titleModal}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\" ng-if=\"ready\">\n" +
    "<div ng-show=\"typeError && !files[0].name\" class=\"col-sm-8 alert alert-danger alert-top-modal\">{{'Error' | translate}} : {{'overrideS2low.the_selected_file_type_is_incorrect' | translate}} <br>{{'overrideS2low.your_file_should_be_png_jpg_or_gif' | translate}}</div>\n" +
    "    <form submit-button=\".launchUpload\" one-file=\"true\" fileupload=\"certificat\" file-added=\"certAdded(files)\" wrong-type=\"wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"fileEncoded(data, index)\" action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\" novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"row\" ng-show=\"(selectedType.tdtNom ==='S²LOW' && selectedType.tdtProtocole !== 'aucun') || selectedType.sigFormat | contains:'AUTO'\">\n" +
    "                <div class=\"form-group col-md-4\" ng-show=\"selectedType.tdtNom ==='S²LOW' && selectedType.tdtProtocole !== 'aucun'\">\n" +
    "                    <div>\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label for=\"connecteurActiv\">\n" +
    "                                <input class=\"unvalidate\" id=\"connecteurActiv\" ng-model=\"selectedType.overridedTdt.active\" type=\"radio\" value=\"true\" name=\"connecteurState\">{{'overrideS2low.activate_connector' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label for=\"connecteurDesactiv\">\n" +
    "                                <input class=\"unvalidate\" id=\"connecteurDesactiv\" ng-model=\"selectedType.overridedTdt.active\" type=\"radio\" value=\"false\" name=\"connecteurState\">{{'overrideS2low.deactivate_connector' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <ul ng-if=\"(selectedType.sigFormat | contains:'AUTO') || ((selectedType.tdtProtocole ==='HELIOS' || (selectedType.sigFormat | contains:'PAdES')) && selectedType.tdtNom ==='S²LOW')\" class=\"nav nav-tabs\">\n" +
    "                    <li ng-if=\"!(selectedType.sigFormat | contains:'AUTO')\" class=\"active\"><a href=\"#connecteur\" bs-tab><i class=\"fa fa-info-circle\"></i> {{'overrideS2low.s2low_server_connection' | translate}}</a></li>\n" +
    "                    <li ng-if=\"!(selectedType.sigFormat | contains:'PAdES') || (selectedType.sigFormat | contains:'AUTO')\"><a href=\"#signature\" bs-tab><i class=\"fa fa-road\"></i> {{'overrideS2low.xades_signature_profile' | translate}}</a></li>\n" +
    "                    <li ng-if=\"(selectedType.sigFormat | contains:'PAdES') || (selectedType.sigFormat | contains:'AUTO')\"><a href=\"#pades\" bs-tab><i class=\"fa fa-hand-o-up\"></i> {{'overrideS2low.pades_signature_profile' | translate}}</a></li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"tab-content\">\n" +
    "                <div class='tab-pane' ng-class=\"selectedType.tdtProtocole !=='aucun' && selectedType.tdtNom ==='S²LOW' ? 'active' : ''\" id='connecteur'>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"serveur\">{{'overrideS2low.server_name' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control unvalidate\" type=\"text\" id=\"serveur\" name=\"serveur\" ng-change=\"infoChanged()\" placeholder=\"{{selectedType.overridedTdt.server}}\" ng-model=\"selectedType.overridedTdt.server\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"port\">Port</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control unvalidate\" type=\"text\" id=\"port\" name=\"port\" ng-change=\"infoChanged()\" placeholder=\"{{selectedType.overridedTdt.port}}\" ng-model=\"selectedType.overridedTdt.port\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\" style=\"display:inline-block;\">\n" +
    "                            <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                            <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <span style=\"display:block !important;\" class=\"btn btn-default fileinput-button\">\n" +
    "                                            <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                            <span>{{'Browse' | translate}}</span>\n" +
    "                                            <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-12\" style=\"float:left;\">\n" +
    "                                        <span>{{'overrideS2low.selected_certificate' | translate}} : {{filename}}</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" style=\"display:inline-block;\">\n" +
    "                                    <div>\n" +
    "                                        <p>{{'overrideS2low.current_certificate' | translate}} : {{selectedType.overridedTdt.name}}<br>\n" +
    "                                            {{'overrideS2low.expiration_date' | translate}} : {{selectedType.overridedTdt.dateLimite}}</p>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"password\">{{'overrideS2low.certificate_password' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control unvalidate\" type=\"text\" id=\"password\" name=\"password\" ng-change=\"infoChanged()\" placeholder=\"{{selectedType.overridedTdt.password}}\" ng-model=\"selectedType.overridedTdt.password\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <div class=\"col-md-6 row\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <span>{{'overrideS2low.certificate_password' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"selectedType.overridedTdt.isPwdGoodForPkcs === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"selectedType.overridedTdt.isPwdGoodForPkcs !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <span ng-if=\"selectedType.overridedTdt.listeLogins.length > 0\">{{'overrideS2low.connection_with_user' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"selectedType.overridedTdt.validLoginAndCertCnx === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"selectedType.overridedTdt.validLoginAndCertCnx !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\" ng-if=\"selectedType.overridedTdt.listeLogins.length > 0\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <label class=\"control-label\" for=\"password\">{{'overrideS2low.user_account' | translate}}</label>\n" +
    "                                            <select ng-change=\"infoChanged()\" class=\"form-control\" ng-model=\"selectedType.overridedTdt.userlogin\" ng-options=\"user for user in selectedType.overridedTdt.listeLogins\">\n" +
    "                                            </select>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <label class=\"control-label\" for=\"password\">{{'overrideS2low.password' | translate}}</label>\n" +
    "                                            <input ng-change=\"infoChanged()\" type=\"text\" class=\"form-control\" ng-model=\"selectedType.overridedTdt.userpassword\">\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <span>{{'overrideS2low.connection_with_certificate' | translate}} :\n" +
    "                                    <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"selectedType.overridedTdt.validCertCnx === 'ok'\"></i>\n" +
    "                                    <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"selectedType.overridedTdt.validCertCnx !== 'ok'\"></i>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-if=\"selectedType.tdtProtocole ==='ACTES'\" class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"archivage\">{{'overrideS2low.base_url_for_archiving' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"archivage\" name=\"archivage\" placeholder=\"{{selectedType.overridedTdt.baseUrlArchivage}}\" ng-model=\"selectedType.overridedTdt.baseUrlArchivage\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-if=\"selectedType.tdtProtocole ==='HELIOS'  && selectedType.tdtNom ==='S²LOW'\" class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"collectivite\">{{'overrideS2low.collectivity_id' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"collectivite\" name=\"collectivite\" placeholder=\"{{selectedType.overridedTdt.collectivite}}\" ng-model=\"selectedType.overridedTdt.collectivite\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span ng-if=\"selectedType.overridedTdt.validCertCnx !== 'ok' || selectedType.overridedTdt.validLoginAndCertCnx !== 'ok' || changed\" class=\"text-danger\">{{'overrideS2low.the_connection_have_to_be_validated_to_save_configuration' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class='tab-pane' ng-class=\"(selectedType.tdtProtocole ==='aucun' || selectedType.tdtNom !=='S²LOW') && !(selectedType.sigFormat | contains:'PAdES') ? 'active' : ''\" id='signature'>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierID\">{{'overrideS2low.pes_policy_identifier_default' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierID\" name=\"pPolicyIdentifierID\" ng-model=\"selectedType.overridedTdt.pPolicyIdentifierID\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierDescription\">{{'overrideS2low.pes_policy_description_default' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierDescription\" name=\"pPolicyIdentifierDescription\" ng-model=\"selectedType.overridedTdt.pPolicyIdentifierDescription\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pPolicyDigest\">{{'overrideS2low.pes_digest_default' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pPolicyDigest\" name=\"pPolicyDigest\" ng-model=\"selectedType.overridedTdt.pPolicyDigest\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pSPURI\">{{'overrideS2low.pes_spuri_default' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pSPURI\" name=\"pSPURI\" ng-model=\"selectedType.overridedTdt.pSPURI\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"form-group\" ng-show=\"selectedType.tdtNom ==='FAST'\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pClaimedRole\">{{'overrideS2low.pes_claimed_role' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pClaimedRole\" name=\"pClaimedRole\" ng-model=\"selectedType.overridedTdt.pClaimedRole\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pPostalCode\">{{'overrideS2low.zip_code' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pPostalCode\" name=\"pPostalCode\" ng-model=\"selectedType.overridedTdt.pPostalCode\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pCity\">{{'overrideS2low.city' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pCity\" name=\"pPostalCode\" ng-model=\"selectedType.overridedTdt.pCity\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pCountryName\">{{'overrideS2low.country' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pCountryName\" name=\"pCountryName\" ng-model=\"selectedType.overridedTdt.pCountryName\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class='tab-pane' ng-class=\"(selectedType.sigFormat | contains:'PAdES') && ((selectedType.tdtProtocole === 'aucun') || (selectedType.tdtNom !== 'S²LOW') || (selectedType.tdtOverride === 'false')) ? 'active' : ''\" id='pades'>\n" +
    "                    <div class=\"col-md-12\">\n" +
    "\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label col-sm-3\" for=\"pCityPades\">{{'overrideS2low.city' | translate}}</label>\n" +
    "                            <div class=\"col-sm-9\">\n" +
    "                                <input class=\"form-control\" type=\"text\" id=\"pCityPades\" name=\"pCityPades\" ng-model=\"selectedType.overridedTdt.pCity\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"well row\">\n" +
    "                            <div class=\"col-md-8\">\n" +
    "                                <h3>{{'overrideS2low.signature_stamp' | translate}}</h3>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div>\n" +
    "                                        <div class=\"radio\">\n" +
    "                                            <label for=\"showStamp\">\n" +
    "                                                <input class=\"unvalidate\" id=\"showStamp\" ng-model=\"selectedType.overridedTdt.showStamp\" type=\"radio\" value=\"true\" name=\"showStamp\">{{'overrideS2low.show_the_signature_stamp' | translate}}\n" +
    "                                            </label>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"radio\">\n" +
    "                                            <label for=\"donotShowStamp\">\n" +
    "                                                <input class=\"unvalidate\" id=\"donotShowStamp\" ng-model=\"selectedType.overridedTdt.showStamp\" type=\"radio\" value=\"false\" name=\"donotShowStamp\">{{'overrideS2low.dont_show_the_signature_stamp' | translate}}\n" +
    "                                            </label>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"stampPage\">{{'overrideS2low.page' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"stampPage\" name=\"stampPage\" ng-model=\"selectedType.overridedTdt.stampPage\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"stampFontSize\">{{'overrideS2low.text_size' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"stampFontSize\" name=\"stampPage\" ng-model=\"selectedType.overridedTdt.stampFontSize\" required>\n" +
    "                                        <span class=\"text-info\">{{'overrideS2low.text_size_info' | translate}}</span>\n" +
    "                                    </div>\n" +
    "\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"coordX\">{{'overrideS2low.x_coordinate' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"coordX\" name=\"coordX\" ng-model=\"selectedType.overridedTdt.stampCoordX\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"coordY\">{{'overrideS2low.y_coordinate' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"coordY\" name=\"coordY\" ng-model=\"selectedType.overridedTdt.stampCoordY\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"stampWidth\">{{'overrideS2low.width' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"stampWidth\" name=\"stampWidth\" ng-model=\"selectedType.overridedTdt.stampWidth\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"stampHeight\">{{'overrideS2low.height' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"stampHeight\" name=\"stampHeight\" max=\"840\" ng-model=\"selectedType.overridedTdt.stampHeight\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-4\">\n" +
    "                                <h3>{{'overrideS2low.position' | translate}}</h3>\n" +
    "                                <div style=\"background-color: white; width:210px; height:297px; outline: 1px groove cornsilk; overflow: hidden;\">\n" +
    "                                    <div style=\"z-index:50; width:210px; height:297px; position: absolute;\" ng-click=\"movePosition($event)\">\n" +
    "\n" +
    "                                    </div>\n" +
    "                                    <div style=\"border: 1px groove #0055aa; position:relative; z-index:49; max-height: 297px; max-width:210px;\"\n" +
    "                                         ng-style=\"handlePosition()\">\n" +
    "\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-body\" ng-if=\"!ready\">\n" +
    "    <div style=\"height:500px;\">\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; top:50%; left:50%;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\" style=\"text-align: left;\" ng-if=\"ready\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <button type=\"button\" ng-if=\"selectedType.tdtProtocole !=='aucun' && selectedType.tdtNom ==='S²LOW'\" class=\"btn btn-default launchUpload\" ng-click=\"enableModeTest()\">\n" +
    "            <i class=\"fa fa-check\"></i>\n" +
    "            {{'overrideS2low.test_configuration' | translate}}\n" +
    "        </button>\n" +
    "        <div>\n" +
    "            <span ng-if=\"hasTest\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'overrideS2low.tests_updated' | translate}}</span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\" style=\"text-align: right;\">\n" +
    "        <button class=\"btn btn-warning\" ng-click=\"ok()\">\n" +
    "            <i class=\"fa fa-times-circle-o\"></i>\n" +
    "            {{'Back' | translate}}\n" +
    "        </button>\n" +
    "        <button type=\"button\" ng-disabled=\"(selectedType.overridedTdt.validCertCnx !== 'ok' || selectedType.overridedTdt.validLoginAndCertCnx !== 'ok' || changed) && selectedType.tdtProtocole !=='aucun' && selectedType.tdtNom !== 'pas de TdT'\" ng-click=\"enableModeSave()\" class=\"btn btn-primary launchUpload\">\n" +
    "            <i class=\"fa fa-floppy-o\"></i>\n" +
    "            {{'overrideS2low.save_configuration' | translate}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("partials/modals/pesPropertiesTenant.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/pesPropertiesTenant.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{title | i18n}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <p class=\"text-info\"><i class=\"fa fa-warning\"></i> {{message  | i18n}}</p>\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <form novalidate name=\"pesProperties\" class=\"form-horizontal\" ng-submit=\"ok()\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"id\">{{'pesPropertiesTenant.policy_identifier_id' | translate}}</label>\n" +
    "                <input class=\"form-control validation-control\" type=\"text\" id=\"id\" name=\"id\" ng-model=\"properties.policyIdentifierID\" required=\"required\">\n" +
    "                <div class=\"input-help\">\n" +
    "                    <span class=\"error\" ng-show=\"pesProperties.id.$error.required\">{{'Mandatory' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"desc\">{{'pesPropertiesTenant.policy_identifier_description' | translate}}</label>\n" +
    "                <input class=\"form-control validation-control\" type=\"text\" id=\"desc\" name=\"desc\" ng-model=\"properties.policyIdentifierDescription\" required=\"required\">\n" +
    "                <div class=\"input-help\">\n" +
    "                    <span class=\"error\" ng-show=\"pesProperties.desc.$error.required\">{{'Mandatory' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"digest\">{{'pesPropertiesTenant.policy_digest' | translate}}</label>\n" +
    "                <input class=\"form-control validation-control\" type=\"text\" id=\"digest\" name=\"digest\" ng-model=\"properties.policyDigest\" required=\"required\">\n" +
    "                <div class=\"input-help\">\n" +
    "                    <span class=\"error\" ng-show=\"pesProperties.digest.$error.required\">{{'Mandatory' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label for=\"uri\">{{'pesPropertiesTenant.sp_uri' | translate}}</label>\n" +
    "                <input class=\"form-control validation-control\" type=\"text\" id=\"uri\" name=\"uri\" ng-model=\"properties.spuri\" required=\"required\">\n" +
    "                <div class=\"input-help\">\n" +
    "                    <span class=\"error\" ng-show=\"pesProperties.uri.$error.required\">{{'Mandatory' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <!-- Pour l'envoi du formulaire avec touche entrée -->\n" +
    "            <input type=\"submit\" style=\"position: absolute; left: -9999px; width: 1px; height: 1px;\"/>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle\"></i>\n" +
    "        {{'Back' | translate}}</button>\n" +
    "    <button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"!pesProperties.$valid\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-floppy-o\"></i>\n" +
    "        {{'Save' | translate}}</button>\n" +
    "</div>");
}]);

angular.module("partials/modals/printModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/printModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'printModal.printing' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    {{textModal}}\n" +
    "    <div class=\"col-xs-12\">\n" +
    "        <span class=\"legend\">{{'printModal.concerned_folder' | translate}}<hr></span>\n" +
    "        <ul class=\"listeDossiers\">\n" +
    "            <li ng-repeat=\"dossier in dossiers\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12\">\n" +
    "        <label for=\"includeFirstPage\">\n" +
    "            <input ng-model=\"includeFirstPage\" class=\"unvalidate\" type=\"checkbox\" id=\"includeFirstPage\">\n" +
    "            {{'printModal.print_with_signature_slip' | translate}}\n" +
    "        </label>\n" +
    "    </div>\n" +
    "    <div class=\"col-xs-12\" ng-if=\"dossiers[0].annexes.length > 0\">\n" +
    "        <span class=\"legend\">{{'printModal.annexes' | translate}}<hr></span>\n" +
    "        <div ng-repeat=\"annexe in dossiers[0].annexes\">\n" +
    "            <label for=\"annexe_{{$index}}\">\n" +
    "                <input ng-init=\"checkboxAnnexes[$index] = dossiers[0].includeAnnexes\" ng-model=\"checkboxAnnexes[$index]\" class=\"unvalidate\" type=\"checkbox\" id=\"annexe_{{$index}}\">\n" +
    "                {{annexe.name}}\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <a class=\"btn btn-primary\" target=\"_blank\" href=\"{{context}}/proxy/alfresco/parapheur/dossiers/{{dossiers[0].id}}/print?includeFirstPage={{includeFirstPage}}&attachments={{annexesToInclude | encodeURIComponent}}\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-print\"></i>\n" +
    "        {{'Print' | translate}}\n" +
    "    </a>\n" +
    "</div>");
}]);

angular.module("partials/modals/propertiesModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/propertiesModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'propertiesModal.node_properties' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\" style=\" overflow-y: scroll; max-height: 400px; \">\n" +
    "    <table class=\"table table-bordered table-striped\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th>{{'propertiesModal.property' | translate}}</th>\n" +
    "                <th>{{'propertiesModal.value' | translate}}</th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"(prop, value) in nodes[0].properties\">\n" +
    "                <td>{{prop}}</td>\n" +
    "                <td>{{value}}</td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "        {{'Close' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/readConfirmModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/readConfirmModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{title | i18n}} {{titleComplement}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <div class=\"checkbox\">\n" +
    "        <label>\n" +
    "            <input ng-model=\"confirm\" type=\"checkbox\"> {{message}}\n" +
    "        </label>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-disabled=\"!confirm\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/rejectModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/rejectModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'rejectModal.reject' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                <span class=\"label label-danger\">{{'Mandatory' | translate}}</span> {{'rejectModal.public_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <textarea class=\"form-control annotation\" ng-model=\"action.annotPub\" required></textarea>\n" +
    "                <i class=\"fa fa-3x fa-globe textarea-icon\"></i>\n" +
    "            </label>\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'rejectModal.private_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPriv\"></textarea>\n" +
    "                <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <span class=\"legend\">{{'rejectModal.folder_list' | translate}}<hr></span>\n" +
    "                <ul class=\"listeDossiers\">\n" +
    "                    <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar class=\"progress-striped active progress-modal\" value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span style=\"color:black; white-space:nowrap;\">{{'rejectModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"!modalForm.$valid\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-times\"></i>\n" +
    "        {{'rejectModal.reject' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/signPapierConfirmationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/signPapierConfirmationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'signPapeConfirmationModal.paper_signature_confirmation' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <p>{{'signPapeConfirmationModal.do_you_really_want_change_signature_to_paper_signature' | translate}}</p>\n" +
    "    <p>{{'signPapeConfirmationModal.link_to_the_document_to_print' | translate}} :\n" +
    "        <a target=\"_blank\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{dossier.documents[0].id}}/content/{{dossier.documents[0].name}}\">\n" +
    "            <i class=\"fa fa-file\"></i>\n" +
    "            {{dossier.documents[0].name}}\n" +
    "        </a>\n" +
    "    </p>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/signPapierModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/signPapierModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'signPaperModal.signature_paper_confirmation' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'signPaperModal.public_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control annotation\" ng-model=\"action.annotPub\"></textarea>\n" +
    "                    <i class=\"fa fa-3x fa-globe textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'signPaperModal.private_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPriv\"></textarea>\n" +
    "                    <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <span class=\"legend\">{{'signPaperModal.folder_list' | translate}}<hr></span>\n" +
    "                <ul class=\"listeDossiers\">\n" +
    "                    <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar class=\"progress-striped active progress-modal\" value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span style=\"color:black; white-space:nowrap;\">{{'signPaperModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"!modalForm.$valid\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'signPaperModal.Transmit_after_printing_and_paper_signature' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/simpleConfirmationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/simpleConfirmationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{title | translate}} {{titleComplement}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    {{message  | translate}}\n" +
    "\n" +
    "    <span ng-if=\"error\" class=\"text text-danger\">\n" +
    "        <br/>\n" +
    "        <br/>\n" +
    "        <i class=\"fa fa-warning\"></i>\n" +
    "        <span ng-bind-html=\"error\"></span>\n" +
    "    </span>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "</div>");
}]);

angular.module("partials/modals/tdtModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/tdtModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'tdtModal.sending_helios_folders' | translate}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'tdtModal.public_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control annotation\" ng-change=\"giveCommentToApplet()\" ng-model=\"action.annotPub\"></textarea>\n" +
    "                    <i class=\"fa fa-3x fa-globe textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "            <label class=\"legendLabel col-xs-12\">\n" +
    "                {{'tdtModal.private_annotation' | translate}}\n" +
    "                <hr>\n" +
    "                <div>\n" +
    "                    <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPriv\"></textarea>\n" +
    "                    <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "                </div>\n" +
    "            </label>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"actesInfo\" class=\"col-md-6\">\n" +
    "            <div class=\"form-group col-md-12\">\n" +
    "                <label for=\"nature-acte\">{{'tdtModal.acte_subject' | translate}}</label>\n" +
    "                <select class=\"form-control\" id=\"nature-acte\" ng-model=\"actesInfo.nature\" ng-change=\"dossier.sousType = ''\" ng-options=\"nature.name as nature.name for nature in actesInfo.nature\" required>\n" +
    "                    <option value=\"\">-- {{'tdtModal.type_selection' | translate}} --</option>\n" +
    "                </select>\n" +
    "                <div class=\"input-help\">\n" +
    "                    <h4>{{'tdtModal.required_input_help' | translate}}</h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-md-12 mandatory-group\">\n" +
    "                <label for=\"numero-acte\">{{'tdtModal.acte_number' | translate}}</label>\n" +
    "                <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                <input type=\"text\" ng-model=\"action.numeroActe\" id=\"numero-acte\" class=\"form-control\" required/>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-md-12\">\n" +
    "                <label class=\"control-label\" for=\"date-decision\">{{'tdtModal.decision_date' | translate}}</label>\n" +
    "                <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                <inpu readonly=\"true\"t ip-datepicker return-format=\"timestamp\" type=\"text\" id=\"date-decision\" ng-model=\"action.dateDecision\" class=\"form-control unvalidate\" required>\n" +
    "                <span ng-click=\"action.dateDecision = undefined\" class=\"pointer input-group-addon\">X</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"dossiers\" class=\"col-md-6\">\n" +
    "            <div class=\"col-xs-12\">\n" +
    "                <span class=\"legend\">{{'tdtModal.folder_list' | translate}}<hr></span>\n" +
    "                <ul class=\"listeDossiers\">\n" +
    "                    <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar ng-if=\"dossiers\" class=\"progress-striped active\" value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span style=\"color:black; white-space:nowrap;\">{{'tdtModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button ng-disabled=\"spin\" class=\"btn btn-primary\" ng-click=\"ok()\">\n" +
    "        <i class=\"fa fa-check\"></i>\n" +
    "        {{'Confirm' | translate}}\n" +
    "    </button>\n" +
    "\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/utilisateursModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/utilisateursModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{'Admin.Users.UserMod_Title' | translate}} {{originalUser.firstName}} {{originalUser.lastName}}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "\n" +
    "\n" +
    "        <ul class=\"nav nav-tabs\">\n" +
    "            <li class=\"active\"><a href=\"#general\" bs-tab><i class=\"fa fa-user\"></i> {{'Admin.Users.UserMod_General' | translate}}</a></li>\n" +
    "            <li ng-if=\"!user.isFromLdap\"><a href=\"#motdepasse\" bs-tab><i class=\"fa fa-lock\"></i> {{'Admin.Users.UserMod_Password' | translate}}</a></li>\n" +
    "            <li><a href=\"#notifications\" bs-tab><i class=\"fa fa-envelope-o\"></i> {{'Admin.Users.UserMod_Notifs' | translate}}</a></li>\n" +
    "            <li><a href=\"#certificat\" bs-tab ng-click=\"setCertificat()\"><i class=\"fa fa-certificate\"></i> {{'Admin.Users.UserMod_Cert' | translate}}</a></li>\n" +
    "            <li><a href=\"#signature\" bs-tab ng-click=\"setSignature()\"><i class=\"fa fa-picture-o\"></i> {{'Admin.Users.UserMod_Sig' | translate}}</a></li>\n" +
    "            <li ng-if=\"originalUser.username.split('@')[0] !== 'admin'\"><a href=\"#droits\" bs-tab><i class=\"fa fa-ban\"></i> {{'Admin.Users.UserMod_Rights' | translate}}</a></li>\n" +
    "            <li><a href=\"#bureaux\" bs-tab ng-click=\"getBureaux()\"><i class=\"fa fa-desktop\"></i> {{'Admin.Users.UserMod_Bur' | translate}}</a></li>\n" +
    "            <li><a href=\"#groups\" bs-tab><i class=\"fa fa fa-group\"></i> {{'Admin.Users.UserMod_Gr' | translate}}</a></li>\n" +
    "        </ul>\n" +
    "\n" +
    "        <div class=\"tab-content\">\n" +
    "            <div class='tab-pane active' id='general'>\n" +
    "                <form name=\"general\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"username\">{{'Admin.Users.User_Name' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" ng-pattern='/^[^&\"£*/<>?%|+;]*$/' type=\"text\" id=\"username\" name=\"username\" placeholder=\"{{originalUser.username}}\" ng-model=\"user.username\" required disabled>\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"general.username.$error.pattern\">{{'Admin.Users.User_SpecialChar' | translate}}</h4>\n" +
    "                                <h4 ng-show=\"general.username.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"firstName\">{{'Admin.Users.User_Firstname' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" type=\"text\" id=\"firstName\" name=\"firstName\" placeholder=\"{{originalUser.firstName}}\" ng-model=\"user.firstName\" ng-required=\"!user.isFromLdap\" ng-disabled=\"user.isFromLdap\">\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"general.firstName.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"lastName\">{{'Admin.Users.User_Lastname' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" type=\"text\" id=\"lastName\" name=\"lastName\" placeholder=\"{{originalUser.lastName}}\" ng-model=\"user.lastName\" ng-required=\"!user.isFromLdap\" ng-disabled=\"user.isFromLdap\">\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"general.lastName.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"mailUser\">{{'Admin.Users.User_Mail' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" type=\"email\" id=\"mailUser\" name=\"mailUser\" placeholder=\"{{originalUser.email}}\" ng-model=\"user.email\" ng-disabled=\"user.isFromLdap\">\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <h4 ng-show=\"general.email.$error.email\">{{'Admin.Users.User_Mail_Error' | translate}}</h4>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"metas\">{{'Admin.Users.UserMod_Comp' | translate}} <i class=\"fa fa-info-circle\" tooltip=\"{{'Admin.Users.UserMod_CompInfo' | translate}}\"></i></label>\n" +
    "                            <input class=\"form-control validation-control\" type=\"text\" id=\"metas\" name=\"metas\" placeholder=\"{{originalUser.metadata}}\" ng-model=\"user.metadata\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "            <div class='tab-pane' id='motdepasse'>\n" +
    "                <form name=\"password\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div class=\"form-group\" ng-if=\"originalUser.username === config.username\">\n" +
    "                            <label for=\"old\">{{'Admin.Users.UserMod_Actual_Pass' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" ng-minlength=\"3\" ng-maxlength=\"32\" type=\"password\" id=\"old\" name=\"old\" ng-model=\"newPass.oldOne\">\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <span class=\"error\" ng-show=\"password.password.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"password\">{{'Admin.Users.UserMod_New_Pass' | translate}}</label>\n" +
    "                            <input check-strength=\"{{properties['parapheur.ihm.password.strength']}}\"\n" +
    "                                   class=\"form-control validation-control\" type=\"password\" id=\"password\" name=\"password\"\n" +
    "                                   ng-model=\"newPass.newOne\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label class=\"control-label\" for=\"confirm\">{{'Admin.Users.UserMod_Confirm_Pass' | translate}}</label>\n" +
    "                            <input class=\"form-control validation-control\" type=\"password\" id=\"confirm\" name=\"confirm\" ng-model=\"newPass.confirm\" confirm-with=\"newPass\">\n" +
    "                            <div class=\"input-help\">\n" +
    "                                <span class=\"error\" ng-show=\"password.confirm.$error.confirm\">{{'Admin.Users.UserMod_Error_Confirm' | translate}}</span>\n" +
    "                                <span class=\"error\" ng-show=\"password.confirm.$error.required\">{{'Admin.Users.UserMod_Required' | translate}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <span class=\"btn btn-success force-display\" ng-click=\"changePassword()\"\n" +
    "                              ng-disabled=\"!password.$valid || newPass.confirm === ''\">\n" +
    "                            <i class=\"fa fa-floppy-o\"></i>\n" +
    "                            {{'Admin.Users.UserMod_Save_Pass' | translate}}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div strength-result=\"{{properties['parapheur.ihm.password.strength']}}\"\n" +
    "                         error=\"password.password.$error\" class=\"col-md-6\"\n" +
    "                         ng-if=\"password.password.$error._length != undefined\">\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "                <div class=\"alert alert-success col-md-4\" ng-show=\"respPass.success\">{{'Admin.Users.UserMod_Saved_Pass' | translate}}</div>\n" +
    "                <div class=\"alert alert-danger col-md-4\" ng-show=\"respPass.error\">{{'Admin.Users.UserMod_Error_Pass' | translate}}</div>\n" +
    "                <div class=\"alert alert-danger col-md-4\" ng-if=\"wrongPwd\">{{'Admin.Users.UserMod_Invalid_Pass' | translate}}</div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class='tab-pane' id='notifications'>\n" +
    "                <form ng-class=\"{launched: !notifications.changed}\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"block\">\n" +
    "                                    {{'Notif_Mail' | translate}}\n" +
    "                                    <i class=\"fa fa-info-circle\"  tooltip-placement=\"bottom\" tooltip=\"{{'Notif_Helper' | translate}}\"></i>\n" +
    "                                    <input type=\"text\" class=\"form-control col-md-12\" ng-model=\"notifications.mail\" id=\"email\" name=\"email\" />\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <h3 class=\"small\"><strong>{{'Notif_Freq' | translate}}</strong></h3>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <div class=\"radio\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-radio\" id=\"radio-never\" value=\"never\" ng-model=\"notifications.mode\" />\n" +
    "                                            {{'Notif_None' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <div class=\"radio\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-radio\" id=\"radio-always\" value=\"always\" ng-model=\"notifications.mode\" />\n" +
    "                                            {{'Notif_Unit' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <div class=\"radio\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"hourly\" ng-model=\"notifications.mode\">\n" +
    "                                            {{'Notif_Every' | translate}}\n" +
    "                                        </label>\n" +
    "                                        <div style=\"width:auto; display:inline-block;\">\n" +
    "                                            <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.hourly\">\n" +
    "                                                <option value=\"1\">1</option>\n" +
    "                                                <option value=\"2\">2</option>\n" +
    "                                                <option value=\"3\">3</option>\n" +
    "                                                <option value=\"4\">4</option>\n" +
    "                                                <option value=\"6\">6</option>\n" +
    "                                                <option value=\"12\">12</option>\n" +
    "                                            </select>\n" +
    "                                        </div>\n" +
    "                                        {{'Notif_Hour' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <div class=\"radio\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"daily\" ng-model=\"notifications.mode\">\n" +
    "                                            {{'Notif_daily' | translate}}\n" +
    "                                        </label>\n" +
    "                                        <div style=\"width:auto; display:inline-block;\">\n" +
    "                                            <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.daily\">\n" +
    "                                                <option value=\"0\">0h</option>\n" +
    "                                                <option value=\"1\">1h</option>\n" +
    "                                                <option value=\"2\">2h</option>\n" +
    "                                                <option value=\"3\">3h</option>\n" +
    "                                                <option value=\"4\">4h</option>\n" +
    "                                                <option value=\"5\">5h</option>\n" +
    "                                                <option value=\"6\">6h</option>\n" +
    "                                                <option value=\"7\">7h</option>\n" +
    "                                                <option value=\"8\">8h</option>\n" +
    "                                                <option value=\"9\">9h</option>\n" +
    "                                                <option value=\"10\">10h</option>\n" +
    "                                                <option value=\"11\">11h</option>\n" +
    "                                                <option value=\"12\">12h</option>\n" +
    "                                                <option value=\"13\">13h</option>\n" +
    "                                                <option value=\"14\">14h</option>\n" +
    "                                                <option value=\"15\">15h</option>\n" +
    "                                                <option value=\"16\">16h</option>\n" +
    "                                                <option value=\"17\">17h</option>\n" +
    "                                                <option value=\"18\">18h</option>\n" +
    "                                                <option value=\"19\">19h</option>\n" +
    "                                                <option value=\"20\">20h</option>\n" +
    "                                                <option value=\"21\">21h</option>\n" +
    "                                                <option value=\"22\">22h</option>\n" +
    "                                                <option value=\"23\">23h</option>\n" +
    "                                            </select>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-12\">\n" +
    "                                    <div class=\"radio\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"weekly\" ng-model=\"notifications.mode\">\n" +
    "                                            {{'Notif_weekly' | translate}}\n" +
    "                                        </label>\n" +
    "                                        <div style=\"width:auto; display:inline-block;\">\n" +
    "                                            <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.weekly\">\n" +
    "                                                <option value=\"1\">{{'Mon' | translate}}</option>\n" +
    "                                                <option value=\"2\">{{'Tue' | translate}}</option>\n" +
    "                                                <option value=\"3\">{{'Wed' | translate}}</option>\n" +
    "                                                <option value=\"4\">{{'Thu' | translate}}</option>\n" +
    "                                                <option value=\"5\">{{'Fri' | translate}}</option>\n" +
    "                                                <option value=\"6\">{{'Sat' | translate}}</option>\n" +
    "                                                <option value=\"7\">{{'Sun' | translate}}</option>\n" +
    "                                            </select>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <div class='tab-pane' id='certificat'>\n" +
    "                <form novalidate name=\"modalForm\"\n" +
    "                      class=\"form-horizontal\"\n" +
    "                      fileupload=\"{{fileUploadFormat}}\"\n" +
    "                      one-file=\"true\"\n" +
    "                      submit-button=\".launchUpload\"\n" +
    "                      wrong-type=\"wrongType(ext)\"\n" +
    "                      fileinput=\"#fileinput\"\n" +
    "                      file-added=\"fileAdded(files)\"\n" +
    "                      upload-success=\"fileUploaded(data, index)\"\n" +
    "                      action=\"{{context + '/base64encode'}}\"\n" +
    "                      method=\"POST\"\n" +
    "                      enctype=\"multipart/form-data\">\n" +
    "                    <h2 class=\"underscore\">{{'Admin.Users.UserMod_Cert_Choose' | translate}}</h2>\n" +
    "\n" +
    "                    <span ng-show=\"isEmptyOrNull(user.certificat)\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Users.UserMod_Cert_None' | translate}}</span>\n" +
    "\n" +
    "\n" +
    "                    <div ng-show=\"!isEmptyOrNull(user.certificat)\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_Emit' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.issuer_name}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_ID' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.id}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_CN' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.subject_name}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_O' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.organization}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_Contact' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.email}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_Serial' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.title}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_Begin' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.certificate_valid_from}}</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <span class=\"col-md-4\"><strong>{{'Admin.Users.UserMod_Cert_End' | translate}}</strong></span>\n" +
    "                            <span class=\"col-md-8\">{{user.certificat.certificate_valid_to}}</span>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <a ng-if=\"!user.certificat.content\n" +
    "                        \" class=\"row btn btn-default\" ng-href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3acertificat/workspace/SpacesStore/{{user.id}}/{{user.certificat.subject_name}}.p12\">\n" +
    "                            <i class=\"fa fa-floppy-o\"></i>\n" +
    "                            {{'Admin.Users.UserMod_Cert_Download' | translate}}\n" +
    "                        </a>\n" +
    "                        <!--http://localhost/alfresco/d/d/workspace/SpacesStore/f1e32fd9-16ee-40d3-b872-781b439b7a87/f1e32fd9-16ee-40d3-b872-781b439b7a87?property=%7bhttp%3a%2f%2fwww.atolcd.com%2falfresco%2fmodel%2fparapheur%2f1.0%7dcertificat\n" +
    "                            -->\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                    <div class=\"row fileupload-buttonbar\">\n" +
    "                        <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                        <span class=\"btn btn-default fileinput-button force-display\">\n" +
    "                            <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                            <span>{{'Browse' | translate}}</span>\n" +
    "                            <input id=\"certificateFileinput\" type=\"file\" name=\"file\" />\n" +
    "                        </span>\n" +
    "                        <span class=\"btn btn-danger\" ng-click=\"deleteCertificat()\" ng-show=\"!isEmptyOrNull(user.certificat)\" >\n" +
    "                            <i class=\"fa fa-trash-o\"></i>\n" +
    "                            {{'Admin.Users.UserMod_Cert_Save' | translate}}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div ng-show=\"typeError\" class=\"row alert alert-danger\">{{'Admin.Users.UserMod_Cert_File' | translate}}</div>\n" +
    "                    <div ng-show=\"certificateUsedBy !== undefined\" class=\"row alert alert-warning\">{{certificateUsedBy}}&nbsp;{{'Admin.Users.UserMod_Cert_Used' | translate}}</div>\n" +
    "\n" +
    "\n" +
    "                </form>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <div class='tab-pane' id='signature'>\n" +
    "\n" +
    "                <form novalidate name=\"modalForm\"\n" +
    "                      class=\"form-horizontal\"\n" +
    "                      fileupload=\"{{fileUploadFormat}}\"\n" +
    "                      one-file=\"true\"\n" +
    "                      submit-button=\".launchUpload\"\n" +
    "                      wrong-type=\"wrongType(ext)\"\n" +
    "                      fileinput=\"#fileinput\"\n" +
    "                      file-added=\"fileAdded(files)\"\n" +
    "                      upload-success=\"fileUploaded(data, index)\"\n" +
    "                      action=\"{{context + '/base64encode'}}\"\n" +
    "                      method=\"POST\"\n" +
    "                      enctype=\"multipart/form-data\">\n" +
    "\n" +
    "                    <h2 class=\"underscore\">{{'Admin.Users.UserMod_Sig_Choose' | translate}}</h2>\n" +
    "                    <img ng-show=\"!isEmptyOrNull(user.signatureData)\" class=\"signatureImg\" ng-cloak ng-src=\"data:image/{{signatureFormat}};base64,{{user.signatureData}}\" />\n" +
    "                    <img ng-if=\"isEmptyOrNull(user.signatureData) && !isEmptyOrNull(user.signature)\" class=\"signatureImg\" ng-cloak ng-src=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{user.signature}}/content?v={{date}}\" />\n" +
    "                    <span ng-show=\"isEmptyOrNull(user.signatureData) && isEmptyOrNull(user.signature)\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Users.UserMod_Sig_NoScan' | translate}}</span>\n" +
    "\n" +
    "                    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                    <div class=\"fileupload-buttonbar\">\n" +
    "                        <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                        <span class=\"btn btn-default fileinput-button force-display\">\n" +
    "                            <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                            <span>{{'Browse' | translate}}</span>\n" +
    "                            <input id=\"fileinput\" type=\"file\" name=\"file\" />\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <span class=\"btn btn-danger\" ng-click=\"deleteSignature()\" ng-show=\"(user.signature !== undefined && user.signature !== '') || (user.signatureData !== undefined)\" >\n" +
    "                        <i class=\"fa fa-trash-o\"></i>\n" +
    "                        {{'Admin.Users.UserMod_Sig_Delete' | translate}}\n" +
    "                    </span>\n" +
    "                    <div ng-show=\"typeError\" class=\"alert alert-danger\">{{'Admin.Users.UserMod_Sig_Err2' | translate}}</div>\n" +
    "\n" +
    "                </form>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "            <div class='tab-pane' id='droits'>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"radio-inline\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" ng-model=\"user.admin\" value=\"admin\" class=\"unvalidate\"/>\n" +
    "                            {{'Admin.Users.UserMod_Rights_Admin' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"radio-inline\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" ng-model=\"user.admin\" value=\"adminFonctionnel\" class=\"unvalidate\"/>\n" +
    "                            {{'Admin.Users.UserMod_Rights_Fonc' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"radio-inline\">\n" +
    "                        <label>\n" +
    "                            <input type=\"radio\" ng-model=\"user.admin\" value=\"aucun\" class=\"unvalidate\"/>\n" +
    "                            {{'Admin.Users.UserMod_Rights_None' | translate}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div ng-show=\"user.admin=='adminFonctionnel'\" >\n" +
    "                        <span class=\"text-info\">\n" +
    "                            <i class=\"fa fa-info-circle\"></i>\n" +
    "                            Les droits d'administration fonctionnelle sont attribués par bureau\n" +
    "                        </span>\n" +
    "                        <div class=\"well row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div>\n" +
    "                                    <h3>\n" +
    "                                        Bureaux disponibles\n" +
    "                                    </h3>\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                        <input placeholder=\"{{'Search' | translate}}\" ng-model=\"searchBureauSuperieur\" ng-change=\"listHandler.search(searchBureauSuperieur)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                                    </div>\n" +
    "                                    <div style=\"height:15px;\" ng-if=\"listHandler.total > 0 && listHandler.maxSize < listHandler.total\">\n" +
    "                                        <span class=\"text-warning float-right\">\n" +
    "                                            {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} {{'On' | translate}} {{listHandler.total}}\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listHandler.page === 0\" ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\" ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <span class=\"text-info\" ng-if=\"listHandler.total === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Users.User_None' | translate}}</span>\n" +
    "                                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                                    <li ng-repeat=\"bureau in listHandler.subListAdminFonctionnel\" ng-switch on=\"user.bureauxAdministres.indexOf(bureau.id)\">\n" +
    "                                        <a ng-click=\"listHandler.selectForAdminFonctionnel(bureau)\" ng-switch-when=\"-1\">\n" +
    "                                            <i class=\"fa fa-plus-circle text-success\"></i> {{bureau.name}}\n" +
    "                                        </a>\n" +
    "                                        <a class=\"disabled\" ng-switch-default>\n" +
    "                                            {{bureau.name}}\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <h3>{{'Admin.Users.UserMod_Right_Selected' | translate}}</h3>\n" +
    "                                <span ng-if=\"user.bureauxAdministres.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> Aucun bureau</span>\n" +
    "                                <ul class=\"list-unstyled pointer\">\n" +
    "                                    <li class=\"hover-li\" ng-click=\"listHandler.unselectForAdminFonctionnel(bureau.id)\" ng-repeat=\"bureau in (bureaux | sameId:user.bureauxAdministres)\"><i class=\"text-danger fa fa-times-circle\"></i> {{bureau.name}}</li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"orderedBureaux.length === 0 && user.admin=='adminFonctionnel'\">\n" +
    "                        <p class=\"text-info\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.UserMod_Right_Selected_None' | translate}}</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class='tab-pane' id='bureaux'>\n" +
    "                <div class=\"row\">\n" +
    "                    <table ng-show=\"user.bureaux.length > 0\" ng-table=\"tableParams\" class=\"table table-striped\">\n" +
    "                        <tr ng-repeat=\"bureau in $data\">\n" +
    "                            <td data-title=\"'Admin.Users.UserMod_Bur_Title' | translate\" sortable=\"'title'\">\n" +
    "                                {{bureau.title}}\n" +
    "                            </td>\n" +
    "                            <td class=\"text-success\" data-title=\"'Admin.Users.UserMod_Bur_Prop' | translate\" sortable=\"'isProprietaire'\">\n" +
    "                                <span ng-if=\"bureau.isProprietaire\" class=\"text-success fa fa-check fa-2x\"></span>\n" +
    "                            </td>\n" +
    "                            <td class=\"text-info\" data-title=\"'Admin.Users.UserMod_Bur_Sec' | translate\" sortable=\"'isSecretaire'\">\n" +
    "                                <span ng-if=\"bureau.isSecretaire\" class=\"text-warning fa fa-check fa-2x\"></span>\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.UserMod_Bur_Actions' | translate\">\n" +
    "                                <button class=\"btn btn-danger helper-inline-block\" type=\"button\" ng-click=\"removeFromBureau(bureau)\">\n" +
    "                                    <i class=\"fa fa-unlink\"></i>\n" +
    "                                    {{'Admin.Users.UserMod_Bur_Remove' | translate}}\n" +
    "                                </button>\n" +
    "                                <div ng-show=\"bureauSuppressError\" class=\"alert alert-error\">{{'Admin.Users.UserMod_Bur_Error' | translate}}</div>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                    <div ng-if=\"!user.bureaux.length\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Users.UserMod_Bur_None' | translate}}</div>\n" +
    "                    <span ng-if=\"user.bureaux.length\" class=\"text-info\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.UserMod_Bur_Warning' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class='tab-pane' id='groups'>\n" +
    "                <div class=\"row\">\n" +
    "                    <p ng-if=\"user.groups.length > 0\" class=\"text-info\">\n" +
    "                        <i class=\"fa fa-info-circle\"></i> {{'Admin.Users.UserMod_Gr_Actual' | translate}} :\n" +
    "                    </p>\n" +
    "                    <ul>\n" +
    "                        <li ng-repeat=\"group in user.groups\">\n" +
    "                            <i ng-if=\"!(user.username.split('@')[0] === 'admin' && group === 'ALFRESCO_ADMINISTRATORS')\" ng-click=\"removeFromGroup(group)\" class=\"fa fa-unlink text-danger pointer\" tooltip-trigger=\"mouseenter\" tooltip=\"{{'Admin.Users.UserMod_Gr_Remove' | translate}}\"></i>\n" +
    "                            {{group}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div ng-if=\"!user.groups.length\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Users.UserMod_Gr_None' | translate}}</div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "        <i class=\"fa fa-times-circle-o\"></i>\n" +
    "        {{'Back' | translate}}\n" +
    "    </button>\n" +
    "    <button class=\"btn btn-primary\" ng-click=\"ok()\" ng-disabled=\"general.$invalid\">\n" +
    "        <i class=\"fa fa-floppy-o\"></i>\n" +
    "        {{'Save' | translate}}\n" +
    "    </button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/modals/validationModal.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/modals/validationModal.html",
    "<div class=\"modal-header\">\n" +
    "    <h3>{{titleModal }}</h3>\n" +
    "</div>\n" +
    "<div class=\"modal-body row\">\n" +
    "    <form novalidate name=\"modalForm\" class=\"row form-horizontal\">\n" +
    "        <div class=\"row\" ng-if=\"!!bureau.associes\">\n" +
    "            <label class=\"legendLabel\">\n" +
    "                {{'validationModal.destination' | translate}}\n" +
    "                <hr>\n" +
    "            </label>\n" +
    "            <div class=\"col-md-8\">\n" +
    "                <div class=\"input-group\" ng-show=\"bureau.associes.length !== 0\">\n" +
    "                    <div class=\"right-inner-addon\">\n" +
    "                        <i class=\"fa fa-question-circle\" tooltip-trigger=\"click\" tooltip-placement=\"bottom\"\n" +
    "                           tooltip=\"{{'validationModal.type_your_search_tooltip' | translate}}\"></i>\n" +
    "                        <input id=\"bureau\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"view.bureauCible\"\n" +
    "                               placeholder=\"{{'validationModal.search_by_title_name_or_user' | translate}}\"\n" +
    "                               typeahead=\"assoc as assoc.title for assoc in bureau.associes | filter:$viewValue | limitTo:8\"\n" +
    "                               name=\"bureau\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <span class=\"input-group-addon\" style=\"opacity: 0.7;\"\n" +
    "                          ng-class=\"!!view.bureauCible.id ? 'label-success' : 'label-warning'\">\n" +
    "                        {{!!view.bureauCible.id ? ('validationModal.selected_folder' | translate) : ('validationModal.no_folder_selected' | translate)}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div style=\"font-size:14px;\" ng-if=\"bureau.associes.length === 0\">\n" +
    "                    <span class=\"text-danger\"><i class=\"fa fa-warning\"></i> {{'validationModal.you_can_t_move_this_folder_in_any_desk' | translate}}</span>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <div class=\"checkbox\">\n" +
    "                    <label class=\"ng-binding\" for=\"notifme\">\n" +
    "                        <input class=\"unvalidate\" id=\"notifme\" ng-model=\"action.notifMe\"\n" +
    "                               name=\"notifme\" type=\"checkbox\">\n" +
    "                        {{'validationModal.please_notify_me_when_validated' | translate}}\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <label class=\"legendLabel col-xs-12\">\n" +
    "                    {{'validationModal.public_annotation' | translate}}\n" +
    "                    <hr>\n" +
    "                    <div>\n" +
    "                        <textarea class=\"form-control annotation\" ng-change=\"giveCommentToApplet()\"\n" +
    "                                  ng-model=\"action.annotPub\" ng-disabled=\"liberSignLoading\"></textarea>\n" +
    "                        <i class=\"fa fa-3x fa-globe textarea-icon\"></i>\n" +
    "                    </div>\n" +
    "\n" +
    "                </label>\n" +
    "                <label class=\"legendLabel col-xs-12\">\n" +
    "                    {{'validationModal.private_annotation' | translate}}\n" +
    "                    <hr>\n" +
    "                    <div>\n" +
    "                        <textarea class=\"form-control annotationprivee\" ng-model=\"action.annotPriv\"\n" +
    "                                  ng-disabled=\"liberSignLoading\">\n" +
    "                        </textarea>\n" +
    "                        <i class=\"fa fa-3x fa-user-secret textarea-icon\"></i>\n" +
    "                    </div>\n" +
    "\n" +
    "                </label>\n" +
    "\n" +
    "                <label class=\"legendLabel col-xs-12\" ng-if=\"metaToDefine.length > 0\">\n" +
    "                    Métadonnée(s) obligatoire sur l'étape\n" +
    "                    <hr>\n" +
    "                </label>\n" +
    "                <div ng-if=\"metaToDefine.length > 0\" class=\"col-md-9 col-md-offset-1\">\n" +
    "                    <div ng-switch on=\"metaInfo.type\" class=\"control-group\"\n" +
    "                         ng-repeat=\"(metaName, metaInfo) in metaInfos\">\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"DATE\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input id=\"{{'date' + $index}}\" name=\"{{'date' + $index}}\" ng-change=\"metaChanged()\" ng-cloak=\"\" ip-id=\"'date' + $index\"\n" +
    "                                       return-format=\"timestamp\" readonly=\"true\" ip-datepicker type=\"text\"\n" +
    "                                       ng-model=\"metaValues[metaInfo.id]\" class=\"form-control\"\n" +
    "                                       required=\"\">\n" +
    "                                <span ng-if=\"!!metaValues[metaInfo.id]\" ng-click=\"metaValues[metaInfo.id] = ''\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"{{'date' + $index}}\" ng-if=\"!metaValues[metaInfo.id]\" class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"STRING\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   required=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"URL\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   required=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"INTEGER\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Int'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                            <input type=\"text\" integer ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   required=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"DOUBLE\" ng-hide=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Double'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                            <input type=\"text\" decimal ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                   ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                   class=\"form-control\"\n" +
    "                                   required=\"\">\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\"\n" +
    "                             ng-switch-when=\"BOOLEAN\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                    ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                    class=\"form-control\" required=\"\">\n" +
    "                                <option value=\"true\">Oui</option>\n" +
    "                                <option value=\"false\">Non</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\" ng-show=\"metaInfo.values\">\n" +
    "                            <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.name}}</label>\n" +
    "                            <span class=\"fa fa-warning label label-danger float-right\"> {{'Mandatory' | translate}}</span>\n" +
    "                            <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                    ng-options=\"value.value as value.value for value in metaInfo.values\"\n" +
    "                                    ng-change=\"valuesMetaUndefined(metaInfo.id)\"\n" +
    "                                    ng-model=\"metaValues[metaInfo.id]\"\n" +
    "                                    class=\"form-control\"\n" +
    "                                    required=\"\">\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"col-xs-12\">\n" +
    "                    <span class=\"legend\">{{'validationModal.folder_list' | translate}}<hr></span>\n" +
    "                    <ul class=\"listeDossiers\">\n" +
    "                        <li ng-repeat=\"dossier in dossiers\" class=\"btn btn-default col-md-12 force-display\"><span\n" +
    "                                class=\"label label-info\">{{dossier.actionDemandee}}</span>{{dossier.title}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-xs-12\" ng-show=\"dossiers[0].steps.length > 1 && metaToDefine.length == 0\">\n" +
    "                    <span class=\"legend\">{{'validationModal.consecutive_steps' | translate}}<hr></span>\n" +
    "                    <label>\n" +
    "                        <input type=\"checkbox\" class=\"checkbox-inline\" ng-model=\"action.consecutiveSteps\">\n" +
    "                        {{'validationModal.validate_every_consecutive_step' | translate}}\n" +
    "                    </label>\n" +
    "                    <ul>\n" +
    "                        <li ng-repeat=\"step in dossiers[0].steps\">\n" +
    "                            <i class=\"fa fa-fw fa-lg fa-check-square-o\"></i>\n" +
    "                            {{step.titulaire}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"modal-footer\">\n" +
    "    <progressbar\n" +
    "            class=\"progress-striped active\"\n" +
    "            value=\"progress\" max=\"max\" type=\"info\">\n" +
    "        <span ng-show=\"!signLoaded && hasSignature\" style=\"color:black; white-space:nowrap;\">{{'validationModal.retrieving_signature_informations' | translate}} : {{progress}} / {{max}}</span>\n" +
    "        <span ng-show=\"signLoaded || !hasSignature\" style=\"color:black; white-space:nowrap;\">{{'validationModal.handled_folders' | translate}} : {{progress}} / {{max}}</span>\n" +
    "    </progressbar>\n" +
    "\n" +
    "    <span ng-show=\"errorMessage\" class=\"text-danger\"><i class=\"fa fa-warning\"></i> {{errorMessage}}</span>\n" +
    "\n" +
    "    <div ng-if=\"hasSignature && signLoaded\" libersign success=\"ok()\" cancel=\"cancel()\" signatures=\"signatures\"\n" +
    "         signature-informations=\"signObj\" ready=\"readyToSign\" loaded=\"loaded()\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div ng-if=\"!hasSignature\">\n" +
    "        <button ng-disabled=\"spin\" class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "            <i class=\"fa fa-times-circle-o\"></i>\n" +
    "            {{'Back' | translate}}\n" +
    "        </button>\n" +
    "        <button ng-disabled=\"spin || !modalForm.$valid\" class=\"btn btn-primary\"\n" +
    "                ng-click=\"ok()\">\n" +
    "            <i ng-class=\"primaryIcon ? primaryIcon : 'fa-check'\" class=\"fa\"></i>\n" +
    "            {{primaryLabel ? primaryLabel : ('Confirm' | translate)}}\n" +
    "        </button>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("partials/passwordStrength.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("partials/passwordStrength.html",
    "<p>Le nouveau mot de passe doit :</p>\n" +
    "<ul>\n" +
    "    <li ng-class=\"error._length ? 'text-danger' : 'text-success'\">\n" +
    "        <i class=\"fa\" ng-class=\"error._length ? 'fa-times' : 'fa-check'\"></i>\n" +
    "        Faire au moins {{minLength}} caractères\n" +
    "    </li>\n" +
    "</ul>\n" +
    "<p>Et contenir au moins :</p>\n" +
    "<ul>\n" +
    "    <li ng-if=\"error._lowerletters != undefined\" ng-class=\"error._lowerletters ? 'text-danger' : 'text-success'\">\n" +
    "        <i class=\"fa\" ng-class=\"error._lowerletters ? 'fa-times' : 'fa-check'\"></i>\n" +
    "        une lettre minuscule\n" +
    "    </li>\n" +
    "    <li ng-if=\"error._upperletters != undefined\" ng-class=\"error._upperletters ? 'text-danger' : 'text-success'\">\n" +
    "        <i class=\"fa\" ng-class=\"error._upperletters ? 'fa-times' : 'fa-check'\"></i>\n" +
    "        une lettre majuscule\n" +
    "    </li>\n" +
    "    <li ng-if=\"error._numbers != undefined\" ng-class=\"error._numbers ? 'text-danger' : 'text-success'\">\n" +
    "        <i class=\"fa\" ng-class=\"error._numbers ? 'fa-times' : 'fa-check'\"></i>\n" +
    "        un chiffre\n" +
    "    </li>\n" +
    "    <li ng-if=\"error._symbols != undefined\" ng-class=\"error._symbols ? 'text-danger' : 'text-success'\">\n" +
    "        <i class=\"fa\" ng-class=\"error._symbols ? 'fa-times' : 'fa-check'\"></i>\n" +
    "        un caractère spécial\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("templates/about.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/about.html",
    "<div class=\"container about\">\n" +
    "    <div class=\"page-header\">\n" +
    "        <h1>{{'About.About' | translate}}</h1>\n" +
    "        <a class=\"btn btn-default float-right manual-download\" target=\"_blank\"\n" +
    "           href=\"{{properties['parapheur.ihm.aide.utilisateur.url']}}\">\n" +
    "            <i class=\"fa fa-download fa-lg\"></i> {{properties['parapheur.ihm.aide.utilisateur.text']}}\n" +
    "        </a>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h4 class=\"page-header\">Informations du poste</h4>\n" +
    "                <p>\n" +
    "                    <strong>Navigateur: </strong>\n" +
    "                    <span ng-repeat=\"v in navigator\">{{v}} </span>\n" +
    "                </p>\n" +
    "\n" +
    "                <p>\n" +
    "                    <strong>Signature électronique : </strong>\n" +
    "\n" +
    "                    <span class=\"text-success\" ng-if=\"client.signature.isCompatible\"><i\n" +
    "                            class=\"fa fa-check\"></i> <strong>Compatible</strong><br/></span>\n" +
    "                    <span class=\"text-danger\" ng-if=\"!client.signature.isCompatible\"><i\n" +
    "                            class=\"fa fa-warning\"></i> <strong>Non compatible</strong><br/></span>\n" +
    "\n" +
    "                </p>\n" +
    "                <p>\n" +
    "                    <span ng-if=\"client.signature.extension\">\n" +
    "                        <strong>Extension : </strong>\n" +
    "                        <span ng-if=\"client.signature.version\" class=\"text-success fa fa-check\"><br/></span>\n" +
    "                        <span ng-if=\"client.signature.version\"\n" +
    "                              class=\"text-info\">Version {{client.signature.version}}</span>\n" +
    "                        <span ng-if=\"client.signature.error === 'no_implementation'\" class=\"text-warning\">\n" +
    "                            <i class=\"fa fa-warning\"></i> <strong>Application LiberSign non installée</strong><br/>\n" +
    "                        </span>\n" +
    "                    </span>\n" +
    "                    <span ng-if=\"client.signature.canExtension && !client.signature.extension\">\n" +
    "                        <strong>Extension : </strong>\n" +
    "                        <span class=\"text-warning\"><i class=\"fa fa-warning\"></i> <strong>Non installée</strong><br/></span>\n" +
    "                    </span>\n" +
    "                    <div ng-if=\"client.signature.canExtension\">\n" +
    "                <p class=\"text-info\"><i class=\"fa fa-info-circle\"></i> Afin de rendre votre navigateur compatible avec\n" +
    "                    la signature électronique, merci de suivre l'aide d'installation.</p>\n" +
    "                        <span class=\"btn btn-info\"\n" +
    "                              ng-click=\"launchHelpModal()\">\n" +
    "                            <i class=\"fa fa-question\"></i>\n" +
    "                            Aide d'installation\n" +
    "                        </span>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <span ng-if=\"client.signature.error && client.signature.error !== 'no_implementation'\" class=\"text-danger\"><br/><i class=\"fa fa-warning\"></i> Problème de communication avec LiberSign : {{client.signature.error}}</span>\n" +
    "                </p>\n" +
    "                <p ng-if=\"client.signature.canJava && !client.signature.extension\">\n" +
    "                    <strong>Java :</strong>\n" +
    "                    <span ng-if=\"client.java.enabled\" class=\"text-success fa fa-check\"><br/></span>\n" +
    "                    <span ng-if=\"!client.java.enabled\" class=\"text-danger\"><i class=\"fa fa-times\"></i> Non installé<br/></span>\n" +
    "                    <span ng-if=\"client.java.enabled\" class=\"text-info\">Version : {{client.java.version}}</span>\n" +
    "                </p>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h4 class=\"page-header\">{{'About.LicenceTitle' | translate}}</h4>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div>{{'About.Agplpart1.1' | translate}} <a target=\"_blank\"\n" +
    "                                                                href=\"//www.gnu.org/licenses/agpl-3.0.html\">{{'About.Agplpart1.link'\n" +
    "                        | translate}}</a> {{'About.Agplpart1.2' | translate}}\n" +
    "                    </div>\n" +
    "                    <br/>\n" +
    "                    <div>{{'About.Agplpart2.1' | translate}} <a target=\"_blank\"\n" +
    "                                                                href=\"//www.gnu.org/licenses/agpl-3.0.html\">{{'About.Agplpart2.link'\n" +
    "                        | translate}}</a> {{'About.Agplpart2.2' | translate}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <h4 class=\"page-header\">I-Parapheur Web - Version {{'About.Version' | translate}} - <a target=\"_blank\"\n" +
    "                                                                                                   href=\"//adullact.net/projects/iparapheur-web/\">Forge</a>\n" +
    "            </h4>\n" +
    "\n" +
    "            <p ng-bind-html=\"'About.Copyright' | translate\"></p>\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4600' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4500' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4400' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4300' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4200' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote4101' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote41' | translate\"></p>\n" +
    "                <p ng-bind-html=\"'About.ReleaseNote40' | translate\"></p>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>");
}]);

angular.module("templates/admin/avance.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-3 adminContent\">\n" +
    "        <div class=\"col-md-11 col-md-offset-1\">\n" +
    "            <h1 class=\"underscore\">{{'Admin.Avance.title' | translate}}</h1>\n" +
    "            <div class=\"bs-sidebar \" role=\"complementary\">\n" +
    "                <ul class=\"nav bs-sidenav\">\n" +
    "                    <li>\n" +
    "                        <span class=\"titleList\">{{'Admin.Avance.config_tdt' | translate}}</span>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.s2low.actes.show'] == 'true'\" href=\"#slowactes\" ng-click=\"slowActes.init()\" data-toggle=\"tab\">{{'Admin.Avance.actes' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.s2low.helios.show'] == 'true'\" href=\"#slowhelios\" ng-click=\"slowHelios.init()\" data-toggle=\"tab\">{{'Admin.Avance.helios' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.s2low.mailsec.show'] == 'true'\" href=\"#slowmailsec\" ng-click=\"slowMailsec.init()\" data-toggle=\"tab\">{{'Admin.Avance.mailsec' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.pastell.mailsec.show'] == 'true'\" href=\"#pastellmailsec\" ng-click=\"pastellMailsec.init()\" data-toggle=\"tab\">{{'Admin.Avance.mailsec_pastell' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.fast.show'] == 'true'\" href=\"#fasthelios\" ng-click=\"fastHelios.init()\" data-toggle=\"tab\">{{'Admin.Avance.fast' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.srci.show'] == 'true'\" href=\"#srcihelios\" ng-click=\"srciHelios.init()\" data-toggle=\"tab\">{{'Admin.Avance.srci' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span class=\"titleList\">{{'Admin.Avance.advanced_config' | translate}}</span>\n" +
    "                        <a bs-tab href=\"#model\" ng-click=\"modeles.init()\" data-toggle=\"tab\">{{'Admin.Avance.models' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab href=\"#metadonne\" ng-click=\"meta.init()\" data-toggle=\"tab\">{{'Admin.Avance.metadata' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab href=\"#calque\" ng-click=\"calques.init()\" data-toggle=\"tab\">{{'Admin.Avance.calque' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab href=\"#cachet\" ng-click=\"cachet.init()\" data-toggle=\"tab\">{{'Admin.Avance.cachet' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <span\n" +
    "                                ng-if=\"\n" +
    "                                properties['parapheur.ihm.attest.show'] == 'true' ||\n" +
    "                                properties['parapheur.admin.horodate.show'] == 'true' ||\n" +
    "                                properties['parapheur.admin.mailservice.show'] == 'true' ||\n" +
    "                                properties['parapheur.admin.archiland.show'] == 'true'\"\n" +
    "                                class=\"titleList\">{{'Admin.Avance.other_config' | translate}}</span>\n" +
    "                        <a ng-if=\"properties['parapheur.ihm.attest.show'] == 'true'\" bs-tab href=\"#attestation\" ng-click=\"attestation.init()\" data-toggle=\"tab\">{{'Admin.Avance.attestation' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.horodate.show'] == 'true'\" href=\"#horodatage\" ng-click=\"horodate.init()\" data-toggle=\"tab\">{{'Admin.Avance.horodate' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.mailservice.show'] == 'true'\" href=\"#mail\" ng-click=\"mail.init()\" data-toggle=\"tab\">{{'Admin.Avance.mail_service' | translate}}</a>\n" +
    "                    </li>\n" +
    "                    <li>\n" +
    "                        <a bs-tab ng-if=\"properties['parapheur.admin.archiland.show'] == 'true'\" href=\"#archiland\" ng-click=\"archiland.init()\" data-toggle=\"tab\">{{'Admin.Avance.archiland' | translate}}</a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"tab-content\">\n" +
    "        <div class=\"tab-pane\" id=\"slowactes\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/slowactes.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"slowhelios\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/slowhelios.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"slowmailsec\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/slowmailsec.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"fasthelios\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/fasthelios.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"srcihelios\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/srcihelios.html'\"></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"tab-pane\" id=\"model\">\n" +
    "            <div class=\"include-animate editor\" ng-include=\"'templates/admin/avance/model.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"attestation\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/attestation.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"horodatage\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/horodatage.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"mail\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/mail.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"archiland\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/archiland.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"metadonne\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/metadonne.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"calque\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/calque.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"cachet\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/cachet.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"pastellmailsec\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/admin/avance/pastellmailsec.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/archiland.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/archiland.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!archiland.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"archiland.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Archiland.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-md-4\">\n" +
    "                            <div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurActivArchi\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurActivArchi\" ng-model=\"archiland.config.enabled\" type=\"radio\" value=\"true\" name=\"connecteurStateArchi\">{{'Admin.Avance.Archiland.enable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurDesactivArchi\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurDesactivArchi\" ng-model=\"archiland.config.enabled\" type=\"radio\" value=\"false\" name=\"connecteurStateArchi\">{{'Admin.Avance.Archiland.disable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"idArchi\">{{'Admin.Avance.Archiland.id' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"idArchi\" name=\"idArchi\" ng-model=\"archiland.config.user\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"passwordArchi\">{{'Admin.Avance.Archiland.passwd' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"passwordArchi\" name=\"passwordArchi\" ng-model=\"archiland.config.password\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"serverArchi\">{{'Admin.Avance.Archiland.msg_server' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"serverArchi\" name=\"serverArchi\" ng-model=\"archiland.config.host\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"portArchi\">{{'Admin.Avance.Archiland.server_port' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"portArchi\" name=\"portArchi\" ng-model=\"archiland.config.port\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"sirenArchi\">{{'Admin.Avance.Archiland.siren' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"sirenArchi\" name=\"sirenArchi\" ng-model=\"archiland.config.collectivite\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"serviceArchi\">{{'Admin.Avance.Archiland.services' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <textarea class=\"form-control unvalidate\" id=\"serviceArchi\" name=\"serviceArchi\" ng-model=\"archiland.config.services\">\n" +
    "                            </textarea>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <input type=\"button\" ng-click=\"archiland.set()\" class=\"btn btn-success force-display\" value=\"{{'Admin.Avance.Archiland.save' | translate}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/attestation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/attestation.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!attestation.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"attestation.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Attestation.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-md-4\">\n" +
    "                            <div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurActivAttest\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurActivAttest\"\n" +
    "                                               ng-model=\"attestation.config.enabled\" type=\"radio\" value=\"true\"\n" +
    "                                               name=\"connecteurStateAttest\">{{'Admin.Avance.Archiland.enable' |\n" +
    "                                        translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurDesactivAttest\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurDesactivAttest\"\n" +
    "                                               ng-model=\"attestation.config.enabled\" type=\"radio\" value=\"false\"\n" +
    "                                               name=\"connecteurStateAttest\">{{'Admin.Avance.Archiland.disable' |\n" +
    "                                        translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"serverAttestation\">{{'Admin.Avance.Attestation.server_name' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"serverAttestation\" name=\"serverAttestation\" ng-model=\"attestation.config.host\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"portAttestation\">{{'Admin.Avance.Attestation.server_port' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"portAttestation\" name=\"portAttestation\" ng-model=\"attestation.config.port\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"userAttestation\">{{'Admin.Avance.Attestation.username' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"userAttestation\" name=\"userAttestation\" ng-model=\"attestation.config.username\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"passAttestation\">{{'Admin.Avance.Attestation.password' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"passAttestation\" name=\"passAttestation\" ng-model=\"attestation.config.password\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <input type=\"button\" ng-click=\"attestation.set()\" class=\"btn btn-success force-display\" value=\"{{'Admin.Avance.Attestation.save_config' | translate}}\">\n" +
    "                    <span ng-if=\"attestation.isSaved\" class=\"text text-success\"><i class=\"fa fa-check\"></i>{{'Admin.Avance.Attestation.saved' | translate}}</span>\n" +
    "                </div>\n" +
    "\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/cachet.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/cachet.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!cachet.isInit\">\n" +
    "        <span class=\"text text-info\">\n" +
    "            {{'Admin.Avance.getting_infos' | translate}}\n" +
    "        </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\"\n" +
    "              us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"cachet.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Cachet.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-4\">\n" +
    "                    <label for=\"mailForWarn\">{{'Mail(s) de notification' | translate}}</label>\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <input id=\"mailForWarn\" type=\"text\" class=\"form-control unvalidate\"\n" +
    "                               ng-model=\"cachet.mailForWarn\" ng-change=\"cachet.mailForWarnStatus = 0\" name=\"mailForWarn\">\n" +
    "                        <span class=\"input-group-btn\">\n" +
    "                            <span class=\"btn btn-default disabled\" ng-if=\"cachet.mailForWarnStatus == 1\">\n" +
    "                                En cours...\n" +
    "                            </span>\n" +
    "                            <span class=\"btn btn-success disabled\" ng-if=\"cachet.mailForWarnStatus == 2\">\n" +
    "                                Sauvegardé\n" +
    "                            </span>\n" +
    "                            <a ng-if=\"cachet.mailForWarnStatus == 0\" ng-click=\"cachet.saveMailForWarn()\" class=\"btn btn-primary\">\n" +
    "                                <i class=\"fa fa-save\"></i>\n" +
    "                                Enregistrer\n" +
    "                            </a>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "\n" +
    "                <hr/>\n" +
    "                <span ng-click=\"cachet.create()\" class=\"btn btn-success\"><i class=\"fa fa-plus-circle\"></i> {{'Admin.Avance.Cachet.create' | translate}}</span>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"cert in cachet.list\" ng-class=\"cachet.current.id == cert.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"cachet.select(cert)\">\n" +
    "                            {{cert.title}}\n" +
    "                            <br>\n" +
    "                            <span class=\"text right\"\n" +
    "                                  ng-class=\"cachet.current.id == cert.id ? 'text-inverse' : 'text-warning'\">\n" +
    "                                Expiration :\n" +
    "                                <span ng-class=\"cachet.current.id == cert.id ? 'text-inverse' : cert.description.notAfter < cachet.timestamp ? 'text-danger ' : 'text-success'\">\n" +
    "                                    {{cert.description.notAfter | date}}\n" +
    "                                </span>\n" +
    "                                <span ng-class=\"cachet.current.id == cert.id ? 'text-inverse' : 'text-danger'\" ng-if=\"cert.description.notAfter < cachet.timestamp\">\n" +
    "                                    <br/>\n" +
    "                                    <i class=\"fa fa-warning\"></i>\n" +
    "                                    EXPIRÉ\n" +
    "                                    <i class=\"fa fa-warning\"></i>\n" +
    "                                </span>\n" +
    "                            </span>\n" +
    "                            <i ng-click=\"cachet.remove(cert)\"\n" +
    "                               ng-class=\"cachet.current.id == cert.id ? 'text-inverse' : 'text-danger'\"\n" +
    "                               tooltip=\"Supprimer\"\n" +
    "                               class=\"fa fa-trash-o icon-right pointer\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <span ng-if=\"cachet.list.length == 0\" class=\"text text-info\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                    Aucun certificat présent\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <div class=\"col-md-12\" ng-if=\"cachet.current\">\n" +
    "                    <form one-file=\"true\" fileupload=\"certificat\"\n" +
    "                          file-added=\"cachet.fileAdded(files)\"\n" +
    "                          fileinput=\"#fileinput\"\n" +
    "                          novalidate=\"novalidate\" name=\"certificate\" class=\"form-horizontal\"\n" +
    "                          >\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <h4 ng-if=\"cachet.current.isNew\">Ajout d'un nouveau certificat</h4>\n" +
    "                            <h4 ng-if=\"!cachet.current.isNew\">Modification du certificat</h4>\n" +
    "\n" +
    "\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"titleCert\">{{'Name' | translate}}</label>\n" +
    "                                <span ng-if=\"cachet.current.isNew\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <span ng-if=\"cachet.current.isNew\" class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Min : 2</span>\n" +
    "                                <input id=\"titleCert\" type=\"text\" class=\"form-control unvalidate\" ng-minlength=\"2\"\n" +
    "                                       ng-model=\"cachet.current.title\" name=\"titleCert\"\n" +
    "                                       required ng-disabled=\"!cachet.current.isNew\">\n" +
    "                            </div>\n" +
    "                            <div class=\"mandatory-group form-group\">\n" +
    "                                <label for=\"certFile\" style=\"margin-right:0;\">{{'Certificat (format p12)' | translate}}</label>\n" +
    "                                <span ng-if=\"cachet.current.editing\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <div class=\"fileinput-button\" style=\"float: none;\">\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <span class=\"input-group-btn\">\n" +
    "                                            <span class=\"btn btn-default force-display\" ng-disabled=\"!cachet.current.editing\">\n" +
    "                                                <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                                {{'Browse' | translate}}\n" +
    "                                            </span>\n" +
    "                                        </span>\n" +
    "                                        <input type=\"text\" name=\"certFile\" id=\"certFile\" class=\"form-control\"\n" +
    "                                               ng-model=\"cachet.current.originalName\"\n" +
    "                                               placeholder=\"Sélectionner le certificat\" readonly\n" +
    "                                               ng-style=\"cachet.current.editing ? {'background-color': '#fff'} : {}\" >\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <input id=\"fileinput\" type=\"file\" name=\"file\" accept=\".p12\"\n" +
    "                                           title=\"&nbsp;\"\n" +
    "                                           required=\"required\"  ng-disabled=\"!cachet.current.editing\">\n" +
    "                                </div>\n" +
    "                                <span ng-if=\"cachet.wrongExt\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Type de fichier attentu: p12' | translate}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"passCert\">{{'Options.Password' | translate}}</label>\n" +
    "                                <span ng-if=\"cachet.current.editing\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <input id=\"passCert\" type=\"password\" class=\"form-control unvalidate\"\n" +
    "                                       ng-model=\"cachet.current.password\" name=\"passCert\"\n" +
    "                                       ng-change=\"cachet.stopTyping($event)\"\n" +
    "                                       required ng-disabled=\"!cachet.current.editing\" placeholder=\"{{cachet.current.isNew ? '' : '**********'}}\">\n" +
    "                            </div>\n" +
    "                            <div class=\"mandatory-group form-group\">\n" +
    "                                <label for=\"imageFile\">{{'Image' | translate}}</label>\n" +
    "                                <div class=\"fileinput-button\" style=\"float: none;\">\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <span class=\"input-group-btn\">\n" +
    "                                            <span class=\"btn btn-default force-display\" ng-disabled=\"!cachet.current.editing\">\n" +
    "                                                <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                                {{'Browse' | translate}}\n" +
    "                                            </span>\n" +
    "                                        </span>\n" +
    "                                        <input type=\"text\" name=\"imageFile\" id=\"imageFile\" class=\"form-control\"\n" +
    "                                               ng-model=\"cachet.current.imageName\" placeholder=\"Sélectionner l'image\"\n" +
    "                                               readonly ng-style=\"cachet.current.editing ? {'background-color': '#fff'} : {}\">\n" +
    "                                        <span class=\"input-group-btn\" title=\"Supprimer l'image actuelle\" style=\"z-index:1;\">\n" +
    "                                            <span  class=\"btn btn-danger force-display\" ng-disabled=\"!cachet.current.editing\"\n" +
    "                                                  ng-if=\"cachet.current.image && cachet.current.editing\"\n" +
    "                                                  ng-click=\"cachet.current.image = ''; cachet.current.imageName = '';\">\n" +
    "                                                <i class=\"fa fa-trash\"></i>\n" +
    "                                            </span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                    <input id=\"imageFileinput\" type=\"file\" name=\"file\" accept=\"image/*\"\n" +
    "                                           title=\"&nbsp;\"\n" +
    "                                           onchange=\"angular.element(this).scope().cachet.fileNameChanged(this)\"\n" +
    "                                           required=\"required\" ng-disabled=\"!cachet.current.editing\">\n" +
    "                                </div>\n" +
    "                                <span ng-if=\"cachet.wrongExt\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Type de fichier attentu: p12' | translate}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <button ng-if=\"cachet.current.editing && !cachet.current.isNew\" class=\"btn btn-warning force-display\"\n" +
    "                                        ng-click=\"cachet.cancel()\">\n" +
    "                                    <i class=\"fa fa-times-circle-o\"></i>\n" +
    "                                    {{'Back' | translate}}\n" +
    "                                </button>\n" +
    "                                <button ng-if=\"cachet.current.editing\" class=\"btn btn-primary force-display\" ng-disabled=\"!cachet.current.description\"\n" +
    "                                        ng-click=\"cachet.save()\">\n" +
    "                                    <i class=\"fa fa-save\"></i>\n" +
    "                                    Enregistrer\n" +
    "                                </button>\n" +
    "                                <button ng-if=\"!cachet.current.editing\" class=\"btn btn-info force-display\"\n" +
    "                                        ng-click=\"cachet.modify()\">\n" +
    "                                    <i class=\"fa fa-pencil\"></i>\n" +
    "                                    Modifier le certificat\n" +
    "                                </button>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h4>Informations supplémentaires</h4>\n" +
    "                        <div ng-if=\"cachet.current.loadChange\">\n" +
    "                            <span style=\"position: relative; width: 0px; z-index: 2000000000; right: -50%; top: 100px;\"\n" +
    "                                  us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"!cachet.current.loadChange && !cachet.errorCode\">\n" +
    "                            <div ng-if=\"cachet.current.description\">\n" +
    "                                <ul class=\"list-unstyled\">\n" +
    "                                    <li>\n" +
    "                                        <b>Alias : </b>{{cachet.current.description.alias}}\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <b>Date d'expiration : </b>{{cachet.current.description.notAfter | date}}\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <b>Autorité : </b>\n" +
    "                                        <ul>\n" +
    "                                            <li ng-repeat=\"info in cachet.current.description.issuerDN.split(',')\">\n" +
    "                                                {{info}}\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <b>Sujet : </b>\n" +
    "                                        <ul>\n" +
    "                                            <li ng-repeat=\"info in cachet.current.description.subjectDN.split(',')\">\n" +
    "                                                {{info}}\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"!cachet.current.description\" class=\"text text-info\">\n" +
    "                                <i class=\"fa fa-info-circle\"></i>\n" +
    "                                Merci de définir un certificat ainsi que son mot de passe.\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"cachet.errorCode\" ng-switch=\"cachet.errorCode\">\n" +
    "                            <div ng-switch-when=\"403\" class=\"text text-danger\">\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Le mot de passe du certificate est invalide !\n" +
    "                            </div>\n" +
    "                            <div ng-switch-when=\"400\" class=\"text text-danger\">\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Le format du certificat est invalide !\n" +
    "                            </div>\n" +
    "                            <div ng-switch-when=\"409\" class=\"text text-danger\">\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                Un certificat du même nom existe déjà !\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div style=\"position: relative;\">\n" +
    "                            <img ng-if=\"cachet.current.image\"\n" +
    "                                 style=\"width:100%; max-width:200px;\"\n" +
    "                                 ng-src=\"data:image/png;base64,{{cachet.current.image}}\"/>\n" +
    "                            <span ng-if=\"!cachet.current.image\" class=\"text text-info\">\n" +
    "                                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                                    Aucune image sélectionnée\n" +
    "                                </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/admin/avance/calque.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/calque.html",
    "<div>\n" +
    "    <script type=\"text/ng-template\" id=\"popover_commentaire\">\n" +
    "        <textarea class=\"form-control unvalidate\" ng-model=\"calques.currentSub.texte\"></textarea>\n" +
    "    </script>\n" +
    "\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!calques.isInit\">\n" +
    "                    <span class=\"text text-info\">\n" +
    "                        {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                    </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\"\n" +
    "              us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"calques.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <h3>{{'Admin.Avance.Calque.title' | translate}}</h3>\n" +
    "                <span ng-click=\"calques.create()\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i> {{'Admin.Avance.Calque.create' | translate}}</span>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"calque in calques.list | orderBy:'name':false\"\n" +
    "                        ng-class=\"calques.current.id == calque.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"calques.select(calque)\">\n" +
    "                            {{calque.name}}\n" +
    "                            <i ng-click=\"calques.remove(calque)\"\n" +
    "                               ng-class=\"calques.current.id == calque.id ? 'text-inverse' : 'text-danger'\"\n" +
    "                               tooltip=\"Supprimer\" class=\"fa fa-trash-o icon-right pointer\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <div class=\"row\" ng-if=\"!empty(calques.current)\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <h4>{{'Admin.Avance.Calque.edit' | translate}} {{calques.current.name}}</h4>\n" +
    "                                <a class=\"btn btn-success\"\n" +
    "                                   href=\"{{context + '/proxy/alfresco/parapheur/calques/' + calques.current.id + '/preview'}}\"\n" +
    "                                   target=\"_blank\"><i class=\"fa fa-eye\"></i> {{'Admin.Avance.Calque.preview' |\n" +
    "                                    translate}}</a>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <img style=\"float:right;\" ng-src=\"{{context + '/res/images/a4.jpg'}}\">\n" +
    "                                <div>\n" +
    "                                    <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i>\n" +
    "                                        {{'Admin.Avance.Calque.rank_info' | translate}}\n" +
    "                                    </div>\n" +
    "                                    <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i>\n" +
    "                                        {{'Admin.Avance.Calque.page_info' | translate}}\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <ul class=\"nav nav-tabs\">\n" +
    "                        <li class=\"active\"><a href=\"#signatures\" bs-tab><i class=\"fa ls-signature\"></i>\n" +
    "                            {{'Admin.Avance.Calque.signatures' | translate}} <span class=\"badge\">{{calques.current.signature.length}}</span></a>\n" +
    "                        </li>\n" +
    "                        <li><a href=\"#images\" bs-tab><i class=\"fa fa-picture-o\"></i> {{'Admin.Avance.Calque.images' |\n" +
    "                            translate}} <span class=\"badge\">{{calques.current.image.length}}</span></a></li>\n" +
    "                        <li><a href=\"#commentaires\" bs-tab><i class=\"fa fa-comments-o\"></i> {{'Admin.Avance.Calque.comments' |\n" +
    "                            translate}} <span class=\"badge\">{{calques.current.commentaire.length}}</span></a></li>\n" +
    "                        <li><a href=\"#metadatas\" bs-tab><i class=\"fa fa-code\"></i> {{'Admin.Avance.Calque.metadatas' |\n" +
    "                            translate}} <span class=\"badge\">{{calques.current.metadata.length}}</span></a></li>\n" +
    "                    </ul>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class='tab-pane' ng-class=\"'active'\" id='signatures'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <h5>{{'Admin.Avance.Calque.signatures' | translate}}</h5>\n" +
    "                                <span class=\"btn btn-success\"\n" +
    "                                      ng-click=\"calques.newSub('signature')\">\n" +
    "                                    <i class=\"fa fa-plus\"></i>\n" +
    "                                    Ajouter une signature\n" +
    "                                </span>\n" +
    "                                <form name=\"signature\">\n" +
    "                                    <span ng-if=\"!(calques.current.signature.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'signature'))\">{{'Admin.Avance.Calque.sig_none' | translate}}</span>\n" +
    "                                    <table ng-if=\"calques.current.signature.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'signature')\"\n" +
    "                                           class=\"table table-striped\">\n" +
    "                                        <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>{{'Admin.Avance.Calque.rank' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.x_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.y_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.page' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.after_sig' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.action' | translate}}</th>\n" +
    "                                        </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "                                        <tr ng-repeat=\"signature in calques.current.signature\">\n" +
    "                                            <td>{{signature.rang}}</td>\n" +
    "                                            <td>{{signature.coordonneeX}}</td>\n" +
    "                                            <td>{{signature.coordonneeY}}</td>\n" +
    "                                            <td>{{signature.page}}</td>\n" +
    "                                            <td><input type=\"checkbox\" disabled class=\"checkbox unvalidate\"\n" +
    "                                                       ng-model=\"signature.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                    <span ng-click=\"calques.deleteSub(signature, 'signature')\"\n" +
    "                                                          class=\"btn btn-danger force-display\" title=\"Supprimer\">\n" +
    "                                                        <i class=\"fa fa-trash-o\"></i>\n" +
    "                                                    </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        <tr ng-if=\"!empty(calques.currentSub) && calques.currentSub.type === 'signature'\">\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.rang\" required=\"required\"></td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeX\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeY\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.page\" required=\"required\"></td>\n" +
    "                                            <td><input type=\"checkbox\" class=\"unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                    <span ng-click=\"calques.saveSub('signature')\"\n" +
    "                                                          class=\"btn btn-info force-display\"\n" +
    "                                                          ng-disabled=\"!signature.$valid\" title=\"Enregistrer\">\n" +
    "                                                        <i class=\"fa fa-save\"></i>\n" +
    "                                                    </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                </form>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div class='tab-pane' id='images'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <h5>{{'Admin.Avance.Calque.images' | translate}}</h5>\n" +
    "                                <span class=\"btn btn-success\"\n" +
    "                                      ng-click=\"calques.newSub('image')\">\n" +
    "                                    <i class=\"fa fa-plus\"></i>\n" +
    "                                    Ajouter une image\n" +
    "                                </span>\n" +
    "                                <form submit-button=\".launchUploadImage\" one-file=\"true\" fileupload=\"image\"\n" +
    "                                      file-added=\"calques.fileAdded(files)\" wrong-type=\"calques.wrongType(ext)\"\n" +
    "                                      fileinput=\"#fileinputImg\" upload-success=\"calques.fileEncoded(data)\"\n" +
    "                                      action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\"\n" +
    "                                      novalidate=\"novalidate\" name=\"images\">\n" +
    "                                    <span ng-if=\"!(calques.current.image.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'image'))\">{{'Admin.Avance.Calque.img_none' | translate}}</span>\n" +
    "                                    <table ng-show=\"calques.current.image.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'image')\"\n" +
    "                                           class=\"table table-striped\">\n" +
    "                                        <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>{{'Admin.Avance.Calque.image' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.x_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.y_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.page' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.after_sig' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.action' | translate}}</th>\n" +
    "                                        </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "                                        <tr ng-repeat=\"image in calques.current.image\">\n" +
    "                                            <td>{{image.nomImage}}</td>\n" +
    "                                            <td>{{image.coordonneeX}}</td>\n" +
    "                                            <td>{{image.coordonneeY}}</td>\n" +
    "                                            <td>{{image.page}}</td>\n" +
    "                                            <td><input type=\"checkbox\" disabled class=\"checkbox unvalidate\"\n" +
    "                                                       ng-model=\"image.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span ng-click=\"calques.deleteSub(image, 'image')\"\n" +
    "                                                      class=\"btn btn-danger force-display\" title=\"Supprimer\">\n" +
    "                                                    <i class=\"fa fa-trash-o\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        <tr ng-show=\"!empty(calques.currentSub) && calques.currentSub.type === 'image'\">\n" +
    "                                            <td>\n" +
    "                                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                                <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                                    <div>\n" +
    "                                                        <div>\n" +
    "                                                            <span style=\"display:block !important;\"\n" +
    "                                                                  class=\"btn btn-default fileinput-button\">\n" +
    "                                                                <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                                                <span>{{'Browse' | translate}}</span>\n" +
    "                                                                <input id=\"fileinputImg\" type=\"file\" name=\"file\"\n" +
    "                                                                       required=\"required\">\n" +
    "                                                            </span>\n" +
    "                                                        </div>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                                <div>\n" +
    "                                                    {{calques.currentSub.nomImage}}\n" +
    "                                                </div>\n" +
    "\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeX\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeY\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.page\" required=\"required\"></td>\n" +
    "                                            <td><input type=\"checkbox\" class=\"unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span class=\"btn btn-info force-display launchUploadImage\"\n" +
    "                                                      ng-disabled=\"!images.$valid || !calques.currentSub.nomImage\" title=\"Enregistrer\">\n" +
    "                                                    <i class=\"fa fa-save\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                </form>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div class='tab-pane' id='commentaires'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <h5>{{'Admin.Avance.Calque.comments' | translate}}</h5>\n" +
    "                                <span class=\"btn btn-success\"\n" +
    "                                        ng-click=\"calques.newSub('commentaire')\">\n" +
    "                                    <i class=\"fa fa-plus\"></i>\n" +
    "                                    Ajouter un commentaire\n" +
    "                                </span>\n" +
    "                                <form name=\"commentaires\">\n" +
    "                                    <span ng-if=\"!(calques.current.commentaire.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'commentaire'))\">{{'Admin.Avance.Calque.comment_none' | translate}}</span>\n" +
    "                                    <table ng-if=\"calques.current.commentaire.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'commentaire')\"\n" +
    "                                           class=\"table table-striped\">\n" +
    "                                        <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>{{'Admin.Avance.Calque.txt' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.font_size' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.txt_color' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.x_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.y_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.page' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.after_sig' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.action' | translate}}</th>\n" +
    "                                        </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "                                        <tr ng-repeat=\"comm in calques.current.commentaire\">\n" +
    "                                            <td>{{comm.texte}}</td>\n" +
    "                                            <td>{{comm.taillePolice}}</td>\n" +
    "                                            <td>{{comm.couleurTexte}}</td>\n" +
    "                                            <td>{{comm.coordonneeX}}</td>\n" +
    "                                            <td>{{comm.coordonneeY}}</td>\n" +
    "                                            <td>{{comm.page}}</td>\n" +
    "                                            <td><input type=\"checkbox\" disabled class=\"checkbox unvalidate\"\n" +
    "                                                       ng-model=\"comm.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span ng-click=\"calques.deleteSub(comm, 'commentaire')\"\n" +
    "                                                      class=\"btn btn-danger force-display\" title=\"Supprimer\">\n" +
    "                                                    <i class=\"fa fa-trash-o\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        <tr ng-if=\"!empty(calques.currentSub) && calques.currentSub.type === 'commentaire'\">\n" +
    "                                            <td style=\"position: relative;\">\n" +
    "                                                <i ng-if=\"calques.editComment\"\n" +
    "                                                   class=\"fa fa-save text-primary pointer fa-2x\"\n" +
    "                                                   ng-click=\"calques.editComment = false\"\n" +
    "                                                   style=\"position:absolute; bottom:10px; right:25px;\"\n" +
    "                                                   tooltip=\" {{'Save' | translate}}\"></i>\n" +
    "                                                <textarea focus-me=\"{{calques.editComment}}\"\n" +
    "                                                          ng-show=\"calques.editComment\"\n" +
    "                                                          class=\"form-control unvalidate\"\n" +
    "                                                          ng-model=\"calques.currentSub.texte\"\n" +
    "                                                          style=\"min-height:150px;min-width:150px;\"></textarea>\n" +
    "                                                <span ng-if=\"!calques.editComment\"\n" +
    "                                                      tooltip=\" {{'Admin.Avance.Calque.define_comment' | translate}}\"\n" +
    "                                                      ng-click=\"calques.editComment = true\">\n" +
    "                                                    <span class=\"text-info pointer\">\n" +
    "                                                        <i class=\"fa fa-pencil\"></i>\n" +
    "                                                        <span ng-if=\"!calques.currentSub.texte\">{{'Admin.Avance.Calque.define_comment' | translate}}</span>\n" +
    "                                                    </span>\n" +
    "                                                    {{calques.currentSub.texte}}\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.taillePolice\" required></td>\n" +
    "                                            <td>\n" +
    "                                                <select class=\"form-control unvalidate\"\n" +
    "                                                        ng-model=\"calques.currentSub.couleurTexte\" required>\n" +
    "                                                    <option value=\"noir\">{{'Admin.Avance.Calque.black' | translate}}\n" +
    "                                                    </option>\n" +
    "                                                    <option value=\"rouge\">{{'Admin.Avance.Calque.red' | translate}}\n" +
    "                                                    </option>\n" +
    "                                                </select>\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeX\" required></td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeY\" required></td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.page\" required></td>\n" +
    "                                            <td><input type=\"checkbox\" class=\"unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span ng-click=\"calques.saveSub('commentaire')\"\n" +
    "                                                      class=\"btn btn-info force-display\"\n" +
    "                                                      ng-disabled=\"!commentaires.$valid\" title=\"Enregistrer\">\n" +
    "                                                    <i class=\"fa fa-save\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                </form>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                        <div class='tab-pane' id='metadatas'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <h5>{{'Admin.Avance.Calque.metadatas' | translate}}</h5>\n" +
    "                                <span class=\"btn btn-success\"\n" +
    "                                      ng-click=\"calques.newSub('metadata')\">\n" +
    "                                    <i class=\"fa fa-plus\"></i>\n" +
    "                                    Ajouter une metadonnée\n" +
    "                                </span>\n" +
    "                                <form name=\"metadonnees\">\n" +
    "                                    <span ng-if=\"!(calques.current.metadata.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'metadata'))\">{{'Admin.Avance.Calque.metadata_none' | translate}}</span>\n" +
    "                                    <table ng-if=\"calques.current.metadata.length > 0 || (!empty(calques.currentSub) && calques.currentSub.type === 'metadata')\"\n" +
    "                                           class=\"table table-striped\">\n" +
    "                                        <thead>\n" +
    "                                        <tr>\n" +
    "                                            <th>{{'Admin.Avance.Calque.metadata' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.font_size' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.x_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.y_coord' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.page' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.after_sig' | translate}}</th>\n" +
    "                                            <th>{{'Admin.Avance.Calque.action' | translate}}</th>\n" +
    "                                        </tr>\n" +
    "                                        </thead>\n" +
    "                                        <tbody>\n" +
    "                                        <tr ng-repeat=\"meta in calques.current.metadata\">\n" +
    "                                            <td>{{calques.selectOptions[meta.qnameMD]}}</td>\n" +
    "                                            <td>{{meta.taillePolice}}</td>\n" +
    "                                            <td>{{meta.coordonneeX}}</td>\n" +
    "                                            <td>{{meta.coordonneeY}}</td>\n" +
    "                                            <td>{{meta.page}}</td>\n" +
    "                                            <td><input type=\"checkbox\" disabled class=\"checkbox unvalidate\"\n" +
    "                                                       ng-model=\"meta.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span ng-click=\"calques.deleteSub(meta, 'metadata')\"\n" +
    "                                                      class=\"btn btn-danger force-display\" title=\"Supprimer\">\n" +
    "                                                    <i class=\"fa fa-trash-o\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        <tr ng-if=\"!empty(calques.currentSub) && calques.currentSub.type === 'metadata'\">\n" +
    "                                            <td>\n" +
    "                                                <select class=\"form-control unvalidate\"\n" +
    "                                                        ng-model=\"calques.currentSub.qnameMD\" required=\"required\"\n" +
    "                                                        ng-options=\"opt.id as opt.value for opt in calques.selectOptions | orderObjectById\">\n" +
    "\n" +
    "                                                </select>\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.taillePolice\" required=\"required\"\n" +
    "                                                       type=\"number\" min=\"1\" step=\"0.5\"></td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeX\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.coordonneeY\" required=\"required\">\n" +
    "                                            </td>\n" +
    "                                            <td><input class=\"form-control unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.page\" required=\"required\"></td>\n" +
    "                                            <td><input type=\"checkbox\" class=\"unvalidate\"\n" +
    "                                                       ng-model=\"calques.currentSub.postSignature\"></td>\n" +
    "                                            <td>\n" +
    "                                                <span ng-click=\"calques.saveSub('metadata')\"\n" +
    "                                                      class=\"btn btn-info force-display\"\n" +
    "                                                      ng-disabled=\"!metadonnees.$valid\" title=\"Enregistrer\">\n" +
    "                                                    <i class=\"fa fa-save\"></i>\n" +
    "                                                </span>\n" +
    "                                            </td>\n" +
    "                                        </tr>\n" +
    "                                        </tbody>\n" +
    "                                    </table>\n" +
    "                                </form>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("templates/admin/avance/fasthelios.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/fasthelios.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!fastHelios.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"fastHelios.isInit\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <h3>{{'Admin.Avance.Fast.title' | translate}}</h3>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <form submit-button=\".launchUploadFast\" one-file=\"true\" fileupload=\"certificat\" file-added=\"fastHelios.certAdded(files)\" wrong-type=\"fastHelios.wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"fastHelios.fileEncoded(data, index)\" action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\" novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-md-4\">\n" +
    "                        <div>\n" +
    "                            <div class=\"radio\">\n" +
    "                                <label for=\"connecteurActivFast\">\n" +
    "                                    <input class=\"unvalidate\" id=\"connecteurActivFast\" ng-model=\"fastHelios.config.active\" type=\"radio\" value=\"true\" name=\"connecteurStateFast\">{{'Admin.Avance.Fast.enable' | translate}}\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                            <div class=\"radio\">\n" +
    "                                <label for=\"connecteurDesactivFast\">\n" +
    "                                    <input class=\"unvalidate\" id=\"connecteurDesactivFast\" ng-model=\"fastHelios.config.active\" type=\"radio\" value=\"false\" name=\"connecteurStateFast\">{{'Admin.Avance.Fast.disable' | translate}}\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <ul class=\"nav nav-tabs\">\n" +
    "                    <li class=\"active\"><a href=\"#connecteurfast\" bs-tab><i class=\"fa fa-info-circle\"></i> {{'Admin.Avance.Fast.connect_to_server' | translate}}</a></li>\n" +
    "                    <li><a href=\"#signaturefast\" bs-tab><i class=\"fa fa-road\"></i> {{'Admin.Avance.Fast.xades_profile' | translate}}</a></li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <div class=\"tab-content\">\n" +
    "                    <div class='tab-pane' ng-class=\"'active'\" id='connecteurfast'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"serveurFast\">{{'Admin.Avance.Fast.server_name' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"serveurFast\" name=\"serveurFast\" ng-change=\"fastHelios.infoChanged()\" placeholder=\"{{fastHelios.config.server}}\" ng-model=\"fastHelios.config.server\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"portFast\">{{'Admin.Avance.Fast.server_port' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"portFast\" name=\"portFast\" ng-change=\"fastHelios.infoChanged()\" placeholder=\"{{fastHelios.config.port}}\" ng-model=\"fastHelios.config.port\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\" style=\"display:inline-block;\">\n" +
    "                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <span style=\"display:block !important;\" class=\"btn btn-info fileinput-button\">\n" +
    "                                                <i class=\"icon-pencil icon-white\"></i>\n" +
    "                                                <span>{{'Admin.Avance.Fast.certificate' | translate}}</span>\n" +
    "                                                <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "                                            </span>\n" +
    "                                            <span ng-if=\"fastHelios.typeError\" class=\"text-danger\"><i class=\"fa fa-times\"></i> {{'Admin.Avance.Fast.certificate_error' | translate}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-12\" style=\"float:left;\">\n" +
    "                                            <span>{{'Admin.Avance.Fast.certificate_sel' | translate}} : {{fastHelios.filename}}</span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\" style=\"display:inline-block;\">\n" +
    "                                        <div>\n" +
    "                                            <p>{{'Admin.Avance.Fast.certificate_actual' | translate}} : {{fastHelios.config.name}}<br>\n" +
    "                                                {{'Admin.Avance.Fast.certificate_expiration' | translate}} : {{fastHelios.config.dateLimite}}</p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"passwordFast\">{{'Admin.Avance.Fast.certificate_passwd' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"passwordFast\" name=\"passwordFast\" ng-change=\"fastHelios.infoChanged()\" placeholder=\"{{fastHelios.config.password}}\" ng-model=\"fastHelios.config.password\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-6 row\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <span>{{'Admin.Avance.Fast.certificate_passwd' | translate}} :\n" +
    "                                            <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"fastHelios.config.isPwdGoodForPkcs === 'ok'\"></i>\n" +
    "                                            <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"fastHelios.config.isPwdGoodForPkcs !== 'ok'\"></i>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"collectiviteFast\">{{'Admin.Avance.Fast.idCol' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"collectiviteFast\" name=\"collectiviteFast\" placeholder=\"{{fastHelios.config.collectivite}}\" ng-model=\"fastHelios.config.collectivite\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"cinematiqueFast\">{{'Admin.Avance.Fast.kinematic' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"cinematiqueFast\" name=\"cinematiqueFast\" placeholder=\"{{fastHelios.config.cinematique}}\" ng-model=\"fastHelios.config.cinematique\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"check_freqFast\">{{'Admin.Avance.Fast.verify_folders' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"check_freqFast\" name=\"check_freqFast\" placeholder=\"{{fastHelios.config.check_freq}}\" ng-model=\"fastHelios.config.check_freq\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"time_to_consider_file_not_pickableFast\">{{'Admin.Avance.Fast.error_folders' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"time_to_consider_file_not_pickableFast\" name=\"time_to_consider_file_not_pickableFast\" placeholder=\"{{fastHelios.config.time_to_consider_file_not_pickable}}\" ng-model=\"fastHelios.config.time_to_consider_file_not_pickable\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='tab-pane' id='signaturefast'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierIDFast\">{{'Admin.Avance.Fast.policy_identifier' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierIDFast\" name=\"pPolicyIdentifierIDFast\" ng-model=\"fastHelios.config.pPolicyIdentifierID\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierDescriptionFast\">{{'Admin.Avance.Fast.policy_identifier_description' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierDescriptionFast\" name=\"pPolicyIdentifierDescriptionFast\" ng-model=\"fastHelios.config.pPolicyIdentifierDescription\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pPolicyDigestFast\">{{'Admin.Avance.Fast.policy_digest' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pPolicyDigestFast\" name=\"pPolicyDigestFast\" ng-model=\"fastHelios.config.pPolicyDigest\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pSPURIFast\">{{'Admin.Avance.Fast.spuri' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pSPURIFast\" name=\"pSPURIFast\" ng-model=\"fastHelios.config.pSPURI\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pClaimedRoleFast\">{{'Admin.Avance.Fast.claimed_role' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pClaimedRoleFast\" name=\"pClaimedRoleFast\" ng-model=\"fastHelios.config.pClaimedRole\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <div class=\"form-group\">\n" +
    "                                        <label class=\"control-label col-sm-3\" for=\"pPostalCodeFast\">{{'Admin.Avance.Fast.postal_code' | translate}}</label>\n" +
    "                                        <div class=\"col-sm-9\">\n" +
    "                                            <input class=\"form-control\" type=\"text\" id=\"pPostalCodeFast\" name=\"pPostalCodeFast\" ng-model=\"fastHelios.config.pPostalCode\" required>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <div class=\"form-group\">\n" +
    "                                        <label class=\"control-label col-sm-3\" for=\"pCityFast\">{{'Admin.Avance.Fast.city' | translate}}</label>\n" +
    "                                        <div class=\"col-sm-9\">\n" +
    "                                            <input class=\"form-control\" type=\"text\" id=\"pCityFast\" name=\"pCityFast\" ng-model=\"fastHelios.config.pCity\" required>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pCountryNameFast\">{{'Admin.Avance.Fast.country' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pCountryNameFast\" name=\"pCountryNameFast\" ng-model=\"fastHelios.config.pCountryName\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <input type=\"button\" class=\"btn btn-default launchUploadFast force-display\" ng-click=\"fastHelios.enableModeTest()\" value=\"{{'Admin.Avance.Fast.test_config' | translate}}\">\n" +
    "                        <input type=\"button\" ng-click=\"fastHelios.enableModeSave()\" class=\"btn btn-success launchUploadFast force-display\" value=\"{{'Admin.Avance.Fast.save_config' | translate}}\">\n" +
    "                        <span  ng-if=\"fastHelios.hasTestConfig\">\n" +
    "                            <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Avance.Fast.test_updated' | translate}}</div>\n" +
    "                            <div ng-if=\"fastHelios.config.active === 'false'\" class=\"text-warning\"><i class=\"fa fa-warning\"></i> {{'Admin.Avance.Fast.warn_disabled' | translate}}</div>\n" +
    "                        </span>\n" +
    "                        <span class=\"text-success\" ng-if=\"fastHelios.hasSaveConfig\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Fast.saved' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/horodatage.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/horodatage.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!horodate.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"horodate.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Horodatage.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"nameHorodate\">{{'Admin.Avance.Horodatage.name' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <select class=\"form-control unvalidate\" id=\"nameHorodate\" name=\"nameHorodate\" ng-model=\"horodate.config.name\">\n" +
    "                                <option value=\"_off_\">{{'Admin.Avance.Horodatage.disabled' | translate}}</option>\n" +
    "                                <option value=\"adullact\">{{'Admin.Avance.Horodatage.adullact_service' | translate}}</option>\n" +
    "                                <option value=\"certeurope\">{{'Admin.Avance.Horodatage.certeurope_service' | translate}}</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"serverHorodate\">{{'Admin.Avance.Horodatage.server_name' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"serverHorodate\" name=\"serverHorodate\" ng-model=\"horodate.config.server\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"portHorodate\">{{'Admin.Avance.Horodatage.server_port' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"portHorodate\" name=\"portHorodate\" ng-model=\"horodate.config.port\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"algoHorodate\">{{'Admin.Avance.Horodatage.algo' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <select class=\"form-control unvalidate\" id=\"algoHorodate\" name=\"algoHorodate\" ng-model=\"horodate.config.algorithme\">\n" +
    "                                <option value=\"SHA1\">SHA1</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"identifiantHorodate\">{{'Admin.Avance.Horodatage.app_id' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"identifiantHorodate\" name=\"identifiantHorodate\" ng-model=\"horodate.config.idclient\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <input type=\"button\" ng-click=\"horodate.set()\" class=\"btn btn-success force-display\" value=\"{{'Admin.Avance.Horodatage.save_config' | translate}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/mail.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/mail.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!mail.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"mail.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Mail.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-md-4\">\n" +
    "                            <div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurActivMail\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurActivMail\" ng-model=\"mail.config.enabled\" type=\"radio\" value=\"true\" name=\"connecteurStateMail\">{{'Admin.Avance.Mail.enable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurDesactivMail\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurDesactivMail\" ng-model=\"mail.config.enabled\" type=\"radio\" value=\"false\" name=\"connecteurStateMail\">{{'Admin.Avance.Mail.disable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"idMail\">{{'Admin.Avance.Mail.id' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"idMail\" name=\"idMail\" ng-model=\"mail.config.username\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"passwordMail\">{{'Admin.Avance.Mail.passwd' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"passwordMail\" name=\"passwordMail\" ng-model=\"mail.config.password\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"serverMail\">{{'Admin.Avance.Mail.msg_server' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"serverMail\" name=\"serverMail\" ng-model=\"mail.config.server\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"portMail\">{{'Admin.Avance.Mail.server_port' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"portMail\" name=\"portMail\" ng-model=\"mail.config.port\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"folderMail\">{{'Admin.Avance.Mail.base_directory' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input type=\"text\" class=\"form-control unvalidate\" id=\"folderMail\" name=\"folderMail\" ng-model=\"mail.config.folder\">\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    \n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <input type=\"button\" ng-click=\"mail.set()\" class=\"btn btn-success force-display\" value=\"{{'Admin.Avance.Mail.save' | translate}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/metadonne.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/metadonne.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!meta.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"meta.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <h3>{{'Admin.Avance.Metadata.title' | translate}}</h3>\n" +
    "                <span ng-click=\"meta.create()\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i> {{'Admin.Avance.Metadata.create' | translate}}</span>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"m in meta.list | orderBy:'name':false\" ng-class=\"meta.current.id == m.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"meta.select(m)\">\n" +
    "                            {{m.name}}\n" +
    "                            <i ng-if=\"m.deletable\" ng-click=\"meta.remove(m)\" tooltip=\"Supprimer\" ng-class=\"meta.current.id == m.id ? 'text-inverse' : 'text-danger'\" class=\"fa fa-trash-o icon-right\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <div ng-if=\"!empty(meta.current)\" class=\"row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <h4 ng-if=\"meta.current.isNew\">{{'Admin.Avance.Metadata.creating' | translate}}</h4>\n" +
    "                        <h4 ng-if=\"!meta.current.isNew\">{{'Admin.Avance.Metadata.edit' | translate}} {{meta.current.name}}</h4>\n" +
    "                        <form class=\"form-horizontal\" name=\"metadata\">\n" +
    "                            <div class=\"col-md-12\">\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"name\">{{'Admin.Avance.Metadata.id' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input type=\"text\" class=\"form-control\" ng-pattern=\"/^[a-zA-Z]([\\w])*$/\"\n" +
    "                                               id=\"name\" name=\"name\" ng-model=\"meta.current.id\"\n" +
    "                                               ng-disabled=\"!meta.current.isNew\" placeholder=\"{{meta.current.id}}\" required=\"required\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"long\">{{'Admin.Avance.Metadata.name' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input type=\"text\" class=\"form-control unvalidate\" id=\"long\" name=\"long\" ng-model=\"meta.current.name\" required=\"required\">\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"nature\">{{'Admin.Avance.Metadata.type' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <select class=\"form-control\" ng-model=\"meta.current.type\" name=\"nature\"\n" +
    "                                                id=\"nature\" ng-disabled=\"!meta.current.isNew\" required=\"required\"\n" +
    "                                                ng-options=\"type.value as (type.key | translate) for type in meta.nature\">\n" +
    "                                        </select>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"checkbox\"\n" +
    "                                         ng-if=\"!!meta.current.type && meta.current.type !== 'BOOLEAN'\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"meta.current.hasValues\"\n" +
    "                                                   type=\"checkbox\"/> {{'Admin.Avance.Metadata.restrict_values' |\n" +
    "                                            translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\" ng-if=\"!!meta.current.type && meta.current.type !== 'BOOLEAN'\">\n" +
    "                                    <div class=\"checkbox\" ng-if=\"meta.current.hasValues\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"meta.current.isAlphaOrdered\"\n" +
    "                                                   type=\"checkbox\"/> {{'Admin.Avance.Metadata.alpha_ordered' |\n" +
    "                                            translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"col-md-12\"\n" +
    "                                     ng-if=\"meta.current.hasValues && !!meta.current.type && meta.current.type !== 'BOOLEAN'\">\n" +
    "                                    <h4>\n" +
    "                                        {{'Admin.Avance.Metadata.autorized_values' | translate}}\n" +
    "                                        <i class=\"fa fa-plus-circle text-success pointer\" tooltip=\"{{'Admin.Avance.Metadata.add_value' | translate}}\" ng-click=\"meta.addValue()\"></i>\n" +
    "                                    </h4>\n" +
    "                                    <div class=\"form-group\" ng-if=\"meta.current.hasValues\" ng-repeat=\"value in meta.current.values\">\n" +
    "                                        <div class=\"row\">\n" +
    "                                            <div class=\"col-sm-9\" ng-switch on=\"meta.current.type\">\n" +
    "                                                <div ng-switch-when=\"DATE\" class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                                    <input name=\"{{'date' + $index}}\" id=\"{{'date' + $index}}\" ng-cloak=\"\" ip-id=\"'date' + $index\" return-format=\"yy-mm-dd\" readonly=\"true\" ip-datepicker type=\"text\" ng-model=\"value.value\" class=\"form-control unvalidate\" ng-disabled=\"!value.deletable\">\n" +
    "                                                    <span ng-if=\"!!value.value\" ng-click=\"value.value = ''\" class=\"pointer input-group-addon\">\n" +
    "                                                        <i class=\"fa fa-times\"></i>\n" +
    "                                                    </span>\n" +
    "                                                    <label ng-if=\"!value.value\" for=\"{{'date' + $index}}\" class=\"pointer input-group-addon\">\n" +
    "                                                        <i class=\"fa fa-calendar\"></i>\n" +
    "                                                    </label>\n" +
    "                                                </div>\n" +
    "                                                <input ng-switch-when=\"STRING\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"value.value\" ng-disabled=\"!value.deletable\">\n" +
    "                                                <input ng-switch-when=\"URL\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"value.value\" ng-disabled=\"!value.deletable\">\n" +
    "                                                <input type=\"text\" ng-switch-when=\"INTEGER\" integer ng-model=\"value.value\" class=\"form-control\" ng-disabled=\"!value.deletable\">\n" +
    "                                                <input type=\"text\"  ng-switch-when=\"DOUBLE\" decimal ng-model=\"value.value\" class=\"form-control\" ng-disabled=\"!value.deletable\">\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-sm-3\">\n" +
    "                                                <span class=\"btn btn-danger force-display\" ng-if=\"value.deletable\"\n" +
    "                                                      ng-click=\"meta.deleteValue($index)\">\n" +
    "                                                    <i class=\"fa fa-trash\"></i>\n" +
    "                                                    {{'Delete' | translate}}</span>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <span ng-click=\"meta.save()\" class=\"btn btn-primary force-display\" ng-disabled=\"!metadata.$valid || (meta.current.isNew && meta.idExists())\">\n" +
    "                                    <i class=\"fa fa-save\"></i>\n" +
    "                                    {{'Admin.Avance.Metadata.save' | translate}}\n" +
    "                                </span>\n" +
    "                                <span class=\"text-success\" ng-if=\"meta.hasSaved\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Metadata.saved' | translate}}</span>\n" +
    "                                <span class=\"text-danger\" ng-if=\"meta.errorMessage\"><i class=\"fa fa-warning\"></i> {{meta.errorMessage}}</span>\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/model.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/model.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!modeles.isInit\">\n" +
    "                <span class=\"text text-info\">\n" +
    "                    {{'Admin.Avance.getting_infos' | translate}}\n" +
    "                </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"modeles.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <h3>{{'Admin.Avance.Model.title' | translate}} <i ng-click=\"modeles.reload()\" tooltip-placement=\"right\" tooltip=\"{{'Admin.Avance.Model.reload_all' | translate}}\" class=\"fa fa-undo pointer\"></i></h3>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"modele in modeles.list | filter:'bdx' | orderBy:'name':false\" ng-class=\"modeles.current.id == modele.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"modeles.get(modele)\">\n" +
    "                            {{modele.name}}\n" +
    "                            <i tooltip-placement=\"right\" tooltip=\"{{'Admin.Avance.Model.reload' | translate}}\" ng-click=\"modeles.reload(modele)\" ng-class=\"modeles.current.id == modele.id ? 'text-inverse' : 'text-warning'\" class=\"text-warning fa fa-undo icon-right pointer\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"modele in modeles.list | filter:'mail' | orderBy:'name':false\" ng-class=\"modeles.current.id == modele.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"modeles.get(modele)\">\n" +
    "                            {{modele.name}}\n" +
    "                            <i tooltip-placement=\"right\" tooltip=\"{{'Admin.Avance.Model.reload' | translate}}\" ng-click=\"modeles.reload(modele)\" ng-class=\"modeles.current.id == modele.id ? 'text-inverse' : 'text-warning'\" class=\"text-warning fa fa-undo icon-right pointer\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9 editor\">\n" +
    "                <div style=\"height: 52px;\">\n" +
    "                    <span class=\"text-info\" ng-if=\"modeles.hasReload === 2 && !modeles.hasSaved\">{{'Admin.Avance.Model.reload_all_done' | translate}}</span>\n" +
    "                    <span class=\"text-info\" ng-if=\"modeles.hasReload === 1 && !modeles.hasSaved\">{{('Admin.Avance.Model.reload_done' | translate).replace('__var__', modeles.reloadName)}}</span>\n" +
    "                    <span class=\"text-info\" ng-if=\"modeles.hasSaved\">{{'Admin.Avance.Model.saved' | translate}}</span>\n" +
    "                    <span ng-if=\"!!modeles.current.id\" style=\"margin-top: 10px;\" ng-click=\"modeles.set()\" class=\"btn btn-primary float-right\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Admin.Avance.Model.save' | translate}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!!modeles.current.id\">\n" +
    "                    <div ui-ace=\"{\n" +
    "                          useWrapMode : true,\n" +
    "                          showGutter: true,\n" +
    "                          theme:'twilight',\n" +
    "                          mode: 'ftl'\n" +
    "                    }\" class=\"editor\" ng-style=\"{height:modeles.getHeight()}\" ng-model=\"modeles.current.content\"></div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("templates/admin/avance/pastellmailsec.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/pastellmailsec.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!pastellMailsec.isInit\">\n" +
    "        <span class=\"text text-info\">\n" +
    "            {{'Admin.Avance.getting_infos' | translate}}\n" +
    "        </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\"\n" +
    "              us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"pastellMailsec.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.PastellMailsec.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <hr/>\n" +
    "                <span ng-click=\"pastellMailsec.create()\" class=\"btn btn-success\"><i class=\"fa fa-plus-circle\"></i> {{'Admin.Avance.PastellMailsec.create' | translate}}</span>\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"conn in pastellMailsec.list\"\n" +
    "                        ng-class=\"pastellMailsec.selected.id == conn.id ? 'active' : ''\">\n" +
    "                        <a ng-click=\"pastellMailsec.select(conn)\">\n" +
    "                            {{conn.title}}\n" +
    "                            <i ng-click=\"pastellMailsec.remove(conn)\"\n" +
    "                               ng-class=\"pastellMailsec.selected.id == conn.id ? 'text-inverse' : 'text-danger'\"\n" +
    "                               tooltip=\"Supprimer\"\n" +
    "                               class=\"fa fa-trash-o icon-right pointer\"></i>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "                <span ng-if=\"pastellMailsec.list.length == 0\" class=\"text text-info\">\n" +
    "                    <i class=\"fa fa-info-circle\"></i>\n" +
    "                    Aucun connecteur présent\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-9\">\n" +
    "                <div class=\"col-md-12\" ng-if=\"pastellMailsec.current\">\n" +
    "                    <form novalidate=\"novalidate\" name=\"pastellmailsec\" class=\"form-horizontal\">\n" +
    "                        <div class=\"col-md-6 col-md-offset-3\">\n" +
    "                            <h4 ng-if=\"pastellMailsec.current.isNew\">Nouveau connecteur</h4>\n" +
    "                            <h4 ng-if=\"!pastellMailsec.current.isNew\">Modification du connecteur</h4>\n" +
    "\n" +
    "\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"titleConnector\">{{'Name' | translate}}</label>\n" +
    "                                <span class=\"label label-warning\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> Unique</span>\n" +
    "                                <span class=\"label label-danger\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <span class=\"label label-info\"><i\n" +
    "                                        class=\"fa fa-info-circle\"></i> Min : 2</span>\n" +
    "                                <input id=\"titleConnector\" type=\"text\" class=\"form-control unvalidate\" ng-minlength=\"2\"\n" +
    "                                       required ng-change=\"pastellMailsec.exists = false\"\n" +
    "                                       ng-model=\"pastellMailsec.current.title\" name=\"titleCert\">\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"urlConnector\">{{'Url' | translate}}</label>\n" +
    "                                <span class=\"label label-danger\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <input id=\"urlConnector\" type=\"text\" class=\"form-control unvalidate\" ng-minlength=\"2\"\n" +
    "                                       ng-model=\"pastellMailsec.current.url\" name=\"urlConnector\" required\n" +
    "                                       ng-disabled=\"pastellMailsec.current.connected\">\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"usernameConnector\">Nom d'utilisateur</label>\n" +
    "                                <span class=\"label label-danger\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <input id=\"usernameConnector\" type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                       ng-minlength=\"2\"\n" +
    "                                       ng-model=\"pastellMailsec.current.login\" name=\"usernameConnector\" required\n" +
    "                                       ng-disabled=\"pastellMailsec.current.connected\">\n" +
    "                                <span class=\"text text-info\">\n" +
    "                                    <i class=\"fa fa-info-circle\">\n" +
    "                                    </i>\n" +
    "                                    L'utilisateur Pastell doit avoir les droits \"mailsec\" en édition et lecture\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"passCert\">{{'Options.Password' | translate}}</label>\n" +
    "                                <span class=\"label label-danger\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <input id=\"passCert\" type=\"password\" class=\"form-control unvalidate\"\n" +
    "                                       ng-model=\"pastellMailsec.current.password\" name=\"passCert\"\n" +
    "                                       required ng-disabled=\"pastellMailsec.current.connected\">\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <button ng-if=\"!pastellMailsec.current.connected\"\n" +
    "                                        class=\"btn btn-info force-display\"\n" +
    "                                        ng-click=\"pastellMailsec.plug()\" ng-disabled=\"pastellMailsec.plugloading\">\n" +
    "                                    <i class=\"fa fa-plug\"></i>\n" +
    "                                    Connecter\n" +
    "                                </button>\n" +
    "\n" +
    "                                <button ng-if=\"pastellMailsec.current.connected\" class=\"btn btn-warning force-display\"\n" +
    "                                        ng-click=\"pastellMailsec.unplug()\">\n" +
    "                                    <i class=\"fa fa-plug\"></i>\n" +
    "                                    Déconnecter\n" +
    "                                </button>\n" +
    "\n" +
    "                                <span ng-if=\"pastellMailsec.plugloading\">\n" +
    "                                    <i class=\"fa fa-spin fa-refresh\"></i>\n" +
    "                                </span>\n" +
    "                                <span class=\"text-success\" ng-if=\"pastellMailsec.current.connected\">\n" +
    "                                    <i class=\"fa fa-check\"></i> Connecté\n" +
    "                                </span>\n" +
    "                                <span class=\"text-danger\" ng-if=\"pastellMailsec.errorCode == 503\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                    Connecteur Pastell indisponible, veuillez contacter votre administrateur\n" +
    "                                </span>\n" +
    "                                <span class=\"text-danger\" ng-if=\"pastellMailsec.errorCode == 410\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                    Impossible d'atteindre le serveur Pastell\n" +
    "                                </span>\n" +
    "                                <span class=\"text-danger\" ng-if=\"pastellMailsec.errorCode == 401\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                    Utilisateur ou mot de passe invalide\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                            <hr/>\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"entity\">Entité :</label>\n" +
    "                                <span class=\"label label-danger\"><i\n" +
    "                                        class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                <select ng-options=\"ent.id as ent.denomination for ent in pastellMailsec.entities\"\n" +
    "                                        ng-change=\"pastellMailsec.entitychanged()\"\n" +
    "                                        id=\"entity\" class=\"form-control unvalidate\"\n" +
    "                                        ng-model=\"pastellMailsec.current.entity\" name=\"entity\" required\n" +
    "                                        ng-disabled=\"!pastellMailsec.current.connected\">\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            <div class=\"row\">\n" +
    "                                <button class=\"btn btn-primary force-display\"\n" +
    "                                        ng-click=\"pastellMailsec.save()\" ng-disabled=\"!pastellMailsec.current.entity\">\n" +
    "                                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                                    Enregistrer\n" +
    "                                </button>\n" +
    "                                <span ng-if=\"pastellMailsec.exists\" class=\"text text-danger\">\n" +
    "                                    <i class=\"fa fa-warning\"></i>\n" +
    "                                    Un connecteur nommé {{pastellMailsec.current.title}} existe déjà !\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </form>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/slowactes.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/slowactes.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!slowActes.isInit\">\n" +
    "            <span class=\"text text-info\">\n" +
    "                {{'Admin.Avance.getting_infos' | translate}}\n" +
    "            </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"slowActes.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Actes.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form submit-button=\".launchUpload\" one-file=\"true\" fileupload=\"certificat\" file-added=\"slowActes.certAdded(files)\" wrong-type=\"slowActes.wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"slowActes.fileEncoded(data)\" action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\" novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-md-4\">\n" +
    "                            <div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurActiv\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurActiv\" ng-model=\"slowActes.config.active\" type=\"radio\" value=\"true\" name=\"connecteurState\">{{'Admin.Avance.Actes.enable' | translate}} \n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurDesactiv\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurDesactiv\" ng-model=\"slowActes.config.active\" type=\"radio\" value=\"false\" name=\"connecteurState\">{{'Admin.Avance.Actes.disable' | translate}}   \n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"serveur\">{{'Admin.Avance.Actes.server_name' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"serveur\" name=\"serveur\" ng-change=\"slowActes.infoChanged()\" placeholder=\"{{slowActes.config.server}}\" ng-model=\"slowActes.config.server\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"port\">{{'Admin.Avance.Actes.server_port' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"port\" name=\"port\" ng-change=\"slowActes.infoChanged()\" placeholder=\"{{slowActes.config.port}}\" ng-model=\"slowActes.config.port\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\" style=\"display:inline-block;\">\n" +
    "                                <h4>Certificat de connexion</h4>\n" +
    "                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <span style=\"display:block !important;\" class=\"btn btn-default fileinput-button\">\n" +
    "                                                <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                                <span>{{'Browse' | translate}}</span>\n" +
    "                                                <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "                                            </span>\n" +
    "                                            <span ng-if=\"slowActes.typeError\" class=\"text-danger\"><i class=\"fa fa-times\"></i> {{'Admin.Avance.Actes.certificate_error' | translate}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-12\" style=\"float:left;\">\n" +
    "                                            <span>{{'Admin.Avance.Actes.certificate_sel' | translate}} : {{slowActes.filename}}</span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\" style=\"display:inline-block;\">\n" +
    "                                        <div>\n" +
    "                                            <p>{{'Admin.Avance.Actes.certificate_actual' | translate}} : {{slowActes.config.name}}<br>\n" +
    "                                                {{'Admin.Avance.Actes.certificate_expiration' | translate}} : {{slowActes.config.dateLimite}}</p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"password\">{{'Admin.Avance.Actes.certificate_passwd' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"password\" name=\"password\" ng-change=\"slowActes.infoChanged()\" placeholder=\"{{slowActes.config.password}}\" ng-model=\"slowActes.config.password\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-6 row\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <span ng-if=\"slowActes.config.isPwdGoodForPkcs !== 'ex'\">{{'Admin.Avance.Actes.certificate_passwd' | translate}} :\n" +
    "                                            <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowActes.config.isPwdGoodForPkcs === 'ok'\"></i>\n" +
    "                                            <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowActes.config.isPwdGoodForPkcs !== 'ok'\"></i>\n" +
    "                                        </span>\n" +
    "                                        <span ng-if=\"slowActes.config.isPwdGoodForPkcs === 'ex'\">\n" +
    "                                            <i class=\"fa fa-warning fa-2x text-warning\"></i> {{'Admin.Avance.Actes.certificate_expired' | translate}}     \n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                    <span ng-if=\"slowActes.config.listeLogins.length > 1\">{{'Admin.Avance.Actes.connection_with_user' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowActes.config.validLoginAndCertCnx === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowActes.config.validLoginAndCertCnx !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" ng-if=\"slowActes.config.listeLogins.length > 1\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-md-6\">\n" +
    "                                            <div class=\"form-group\">\n" +
    "                                                <label class=\"control-label\" for=\"user\">{{'Admin.Avance.Actes.user' | translate}}</label>\n" +
    "                                                <select ng-change=\"slowActes.infoChanged()\" id=\"user\" name=\"user\" class=\"form-control\" ng-model=\"slowActes.config.userlogin\" ng-options=\"user for user in slowActes.config.listeLogins\">\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\">\n" +
    "                                            <div class=\"form-group\">\n" +
    "                                                <label class=\"control-label\" for=\"passwordUser\">{{'Admin.Avance.Actes.passwd' | translate}}</label>\n" +
    "                                                <input ng-change=\"slowActes.infoChanged()\" id=\"passwordUser\" name=\"passwordUser\" type=\"text\" class=\"form-control\" ng-model=\"slowActes.config.userpassword\">\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <span>{{'Admin.Avance.Actes.certificate_connection' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowActes.config.validCertCnx === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowActes.config.validCertCnx !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"archivage\">{{'Admin.Avance.Actes.archive_base_url' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"archivage\" name=\"archivage\" placeholder=\"{{slowActes.config.baseUrlArchivage}}\" ng-model=\"slowActes.config.baseUrlArchivage\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span ng-if=\"slowActes.config.validCertCnx !== 'ok' || slowActes.config.validLoginAndCertCnx !== 'ok' || slowActes.changed\" class=\"text-danger\">{{'Admin.Avance.Actes.must_save' | translate}}</span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"col-md-7\">\n" +
    "                                <span class=\"btn btn-default launchUpload\" ng-click=\"slowActes.enableModeTest()\">\n" +
    "                                    <i class=\"fa fa-check\"></i>\n" +
    "                                    {{'Admin.Avance.Actes.test_config' | translate}}\n" +
    "                                </span>\n" +
    "                                <span ng-disabled=\"(slowActes.config.validCertCnx !== 'ok' || slowActes.config.validLoginAndCertCnx !== 'ok' || slowActes.changed)\" ng-click=\"slowActes.enableModeSave()\" class=\"btn btn-primary launchUpload\">\n" +
    "                                    <i class=\"fa fa-save\"></i>\n" +
    "                                    {{'Admin.Avance.Actes.save_config' | translate}}\n" +
    "                                </span>\n" +
    "                                <div ng-if=\"slowActes.hasTestConfig\">\n" +
    "                                    <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Avance.Actes.test_updated' | translate}}</div>\n" +
    "                                    <div ng-if=\"slowActes.config.active === 'false'\" class=\"text-warning\"><i class=\"fa fa-warning\"></i> {{'Admin.Avance.Actes.warn_disabled' | translate}}</div>\n" +
    "                                </div>\n" +
    "                                <span class=\"text-success\" ng-if=\"slowActes.hasSaveConfig\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Actes.saved' | translate}}</span>\n" +
    "                                <span class=\"text-success\" ng-if=\"slowActes.updated && slowActes.classifications.classificationResult === 'ok'\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Actes.classif_updated' | translate}}</span>\n" +
    "                                <span class=\"text-danger\" ng-if=\"slowActes.updated && slowActes.classifications.classificationResult !== 'ok'\"><i class=\"fa fa-times\"></i> {{'Admin.Avance.Actes.classif_not_updated' | translate}}</span>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-5\">\n" +
    "                                <span class=\"btn btn-info\" ng-click=\"slowActes.updateClassifications()\" ng-if=\"slowActes.config.validCertCnx === 'ok'\">\n" +
    "                                    <i class=\"fa fa-refresh\" ng-class=\"slowActes.updating ? 'fa-spin' : ''\" ng-if=\"!slowActes.updated\"></i>\n" +
    "                                    <i class=\"fa fa-check\" ng-if=\"slowActes.updated && slowActes.classifications.classificationResult === 'ok'\"></i>\n" +
    "                                    <i class=\"fa fa-times\" ng-if=\"slowActes.updated && slowActes.classifications.classificationResult !== 'ok'\"></i> {{'Admin.Avance.Actes.classif_update' | translate}}\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/slowhelios.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/slowhelios.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!slowHelios.isInit\">\n" +
    "            <span class=\"text text-info\">\n" +
    "                {{'Admin.Avance.getting_infos' | translate}}\n" +
    "            </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"slowHelios.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Helios.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form submit-button=\".launchUploadHelios\" one-file=\"true\" fileupload=\"certificat\" file-added=\"slowHelios.certAdded(files)\" wrong-type=\"slowHelios.wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"slowHelios.fileEncoded(data, index)\" action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\" novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-md-4\">\n" +
    "                            <div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurActivHelios\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurActivHelios\" ng-model=\"slowHelios.config.active\" type=\"radio\" value=\"true\" name=\"connecteurStateHelios\">{{'Admin.Avance.Helios.enable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"connecteurDesactivHelios\">\n" +
    "                                        <input class=\"unvalidate\" id=\"connecteurDesactivHelios\" ng-model=\"slowHelios.config.active\" type=\"radio\" value=\"false\" name=\"connecteurStateHelios\">{{'Admin.Avance.Helios.disable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <ul class=\"nav nav-tabs\">\n" +
    "                        <li class=\"active\"><a href=\"#connecteurHelios\" bs-tab><i class=\"fa fa-plug\"></i> {{'Admin.Avance.Helios.connect_to_server' | translate}}</a></li>\n" +
    "                        <li><a href=\"#signatureHelios\" bs-tab><i class=\"fa fa-gavel\"></i> {{'Admin.Avance.Helios.xades_profile' | translate}}</a></li>\n" +
    "                    </ul>\n" +
    "\n" +
    "                    <div class=\"tab-content\">\n" +
    "                        <div class='tab-pane' ng-class=\"'active'\" id='connecteurHelios'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "    \n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"serveurHelios\">{{'Admin.Avance.Helios.server_name' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control unvalidate\" type=\"text\" id=\"serveurHelios\" name=\"serveurHelios\" ng-change=\"slowHelios.infoChanged()\" placeholder=\"{{slowHelios.config.server}}\" ng-model=\"slowHelios.config.server\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "    \n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"portHelios\">{{'Admin.Avance.Helios.server_port' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control unvalidate\" type=\"text\" id=\"portHelios\" name=\"portHelios\" ng-change=\"slowHelios.infoChanged()\" placeholder=\"{{slowHelios.config.port}}\" ng-model=\"slowHelios.config.port\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "    \n" +
    "                                <div class=\"form-group\" style=\"display:inline-block;\">\n" +
    "                                    <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                    <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                        <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                        <div class=\"col-md-6\">\n" +
    "                                            <div class=\"col-md-12\">\n" +
    "                                                <span style=\"display:block !important;\" class=\"btn btn-default fileinput-button\">\n" +
    "                                                    <i class=\"fa fa-folder-open-o\"></i>\n" +
    "                                                    <span>{{'Browse' | translate}}</span>\n" +
    "                                                    <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "                                                </span>\n" +
    "                                                <span ng-if=\"slowHelios.typeError\" class=\"text-danger\"><i class=\"fa fa-times\"></i> {{'Admin.Avance.Helios.certificate_error' | translate}}</span>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-12\" style=\"float:left;\">\n" +
    "                                                <span>{{'Admin.Avance.Helios.certificate_sel' | translate}} : {{slowHelios.filename}}</span>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\" style=\"display:inline-block;\">\n" +
    "                                            <div>\n" +
    "                                                <p>{{'Admin.Avance.Helios.certificate_actual' | translate}} : {{slowHelios.config.name}}<br>\n" +
    "                                                    {{'Admin.Avance.Helios.certificate_expiration' | translate}} : {{slowHelios.config.dateLimite}}</p>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "    \n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"passwordHelios\">{{'Admin.Avance.Helios.certificate_passwd' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control unvalidate\" type=\"text\" id=\"passwordHelios\" name=\"passwordHelios\" ng-change=\"slowHelios.infoChanged()\" placeholder=\"{{slowHelios.config.password}}\" ng-model=\"slowHelios.config.password\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "    \n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <div class=\"col-md-6 row\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                        <span ng-if=\"slowHelios.config.isPwdGoodForPkcs !== 'ex'\">{{'Admin.Avance.Helios.certificate_passwd' | translate}} :\n" +
    "                                            <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowHelios.config.isPwdGoodForPkcs === 'ok'\"></i>\n" +
    "                                            <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowHelios.config.isPwdGoodForPkcs !== 'ok'\"></i>\n" +
    "                                        </span>\n" +
    "                                        <span ng-if=\"slowHelios.config.isPwdGoodForPkcs === 'ex'\">\n" +
    "                                            <i class=\"fa fa-warning fa-2x text-warning\"></i> {{'Admin.Avance.Helios.certificate_expired' | translate}}\n" +
    "                                        </span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                        <span ng-if=\"slowHelios.config.listeLogins.length > 1\">{{'Admin.Avance.Helios.connection_with_user' | translate}} :\n" +
    "                                            <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowHelios.config.validLoginAndCertCnx === 'ok'\"></i>\n" +
    "                                            <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowHelios.config.validLoginAndCertCnx !== 'ok'\"></i>\n" +
    "                                        </span>\n" +
    "                                        </div>\n" +
    "    \n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\" ng-if=\"slowHelios.config.listeLogins.length > 1\">\n" +
    "                                        <div class=\"row\">\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label class=\"control-label\" for=\"userHelios\">{{'Admin.Avance.Helios.user' | translate}}</label>\n" +
    "                                                    <select ng-change=\"slowHelios.infoChanged()\" id=\"userHelios\" name=\"userHelios\" class=\"form-control\" ng-model=\"slowHelios.config.userlogin\" ng-options=\"user for user in slowHelios.config.listeLogins\">\n" +
    "                                                    </select>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-6\">\n" +
    "                                                <div class=\"form-group\">\n" +
    "                                                    <label class=\"control-label\" for=\"passwordUserHelios\">{{'Admin.Avance.Helios.passwd' | translate}}</label>\n" +
    "                                                    <input ng-change=\"slowHelios.infoChanged()\" id=\"passwordUserHelios\" name=\"passwordUserHelios\" type=\"text\" class=\"form-control\" ng-model=\"slowHelios.config.userpassword\">\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <span>{{'Admin.Avance.Helios.certificate_connection' | translate}} :\n" +
    "                                            <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowHelios.config.validCertCnx === 'ok'\"></i>\n" +
    "                                            <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowHelios.config.validCertCnx !== 'ok'\"></i>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "    \n" +
    "                                <span ng-if=\"(slowHelios.config.validCertCnx !== 'ok' || slowHelios.config.validLoginAndCertCnx !== 'ok' || slowHelios.changed) && slowHelios.config.active === 'true'\" class=\"text-danger\">{{'Admin.Avance.Helios.must_save' | translate}}</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class='tab-pane' id='signatureHelios'>\n" +
    "                            <div class=\"col-md-12\">\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierID\">{{'Admin.Avance.Helios.policy_identifier' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierID\" name=\"pPolicyIdentifierID\" ng-model=\"slowHelios.config.pPolicyIdentifierID\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierDescription\">{{'Admin.Avance.Helios.policy_identifier_description' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierDescription\" name=\"pPolicyIdentifierDescription\" ng-model=\"slowHelios.config.pPolicyIdentifierDescription\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pPolicyDigest\">{{'Admin.Avance.Helios.policy_digest' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pPolicyDigest\" name=\"pPolicyDigest\" ng-model=\"slowHelios.config.pPolicyDigest\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pSPURI\">{{'Admin.Avance.Helios.spuri' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pSPURI\" name=\"pSPURI\" ng-model=\"slowHelios.config.pSPURI\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"form-group\" ng-show=\"false\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pClaimedRole\">{{'Admin.Avance.Helios.claimed_role' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pClaimedRole\" name=\"pClaimedRole\" ng-model=\"slowHelios.config.pClaimedRole\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <label class=\"control-label col-sm-3\" for=\"pPostalCode\">{{'Admin.Avance.Helios.postal_code' | translate}}</label>\n" +
    "                                            <div class=\"col-sm-9\">\n" +
    "                                                <input class=\"form-control\" type=\"text\" id=\"pPostalCode\" name=\"pPostalCode\" ng-model=\"slowHelios.config.pPostalCode\" required>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"form-group\">\n" +
    "                                            <label class=\"control-label col-sm-3\" for=\"pCity\">{{'Admin.Avance.Helios.city' | translate}}</label>\n" +
    "                                            <div class=\"col-sm-9\">\n" +
    "                                                <input class=\"form-control\" type=\"text\" id=\"pCity\" name=\"pPostalCode\" ng-model=\"slowHelios.config.pCity\" required>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label col-sm-3\" for=\"pCountryName\">{{'Admin.Avance.Helios.country' | translate}}</label>\n" +
    "                                    <div class=\"col-sm-9\">\n" +
    "                                        <input class=\"form-control\" type=\"text\" id=\"pCountryName\" name=\"pCountryName\" ng-model=\"slowHelios.config.pCountryName\" required>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <span class=\"btn btn-default launchUploadHelios force-display\" ng-click=\"slowHelios.enableModeTest()\">\n" +
    "                                <i class=\"fa fa-check\"></i>\n" +
    "                                {{'Admin.Avance.Helios.test_config' | translate}}\n" +
    "                            </span>\n" +
    "                            <span ng-disabled=\"(slowHelios.config.validCertCnx !== 'ok' || slowHelios.config.validLoginAndCertCnx !== 'ok' || slowHelios.changed) && slowHelios.config.active === 'true'\" ng-click=\"slowHelios.enableModeSave()\" class=\"btn btn-primary launchUploadHelios force-display\">\n" +
    "                                <i class=\"fa fa-save\"></i>\n" +
    "                                {{'Admin.Avance.Helios.save_config' | translate}}\n" +
    "                            </span>\n" +
    "                            <span  ng-if=\"slowHelios.hasTestConfig\">\n" +
    "                                <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Avance.Helios.test_updated' | translate}}</div>\n" +
    "                                <div ng-if=\"slowHelios.config.active === 'false'\" class=\"text-warning\"><i class=\"fa fa-warning\"></i> {{'Admin.Avance.Helios.warn_disabled' | translate}}</div>\n" +
    "                            </span>\n" +
    "                            <span class=\"text-success\" ng-if=\"slowHelios.hasSaveConfig\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Helios.saved' | translate}}</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/slowmailsec.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/slowmailsec.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!slowMailsec.isInit\">\n" +
    "            <span class=\"text text-info\">\n" +
    "                {{'Admin.Avance.getting_infos' | translate}}\n" +
    "            </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"slowMailsec.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.Mailsec.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form submit-button=\".launchUploadMailsec\" one-file=\"true\" fileupload=\"certificat\" file-added=\"slowMailsec.certAdded(files)\" wrong-type=\"slowMailsec.wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"slowMailsec.fileEncoded(data)\" action=\"{{context + '/base64encode'}}\" method=\"POST\" enctype=\"multipart/form-data\" novalidate name=\"modalForm\" class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-12\">\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"serveurMailsec\">{{'Admin.Avance.Mailsec.server_name' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"serveurMailsec\" name=\"serveurMailsec\" ng-change=\"slowMailsec.infoChanged()\" placeholder=\"{{slowMailsec.config.server}}\" ng-model=\"slowMailsec.config.server\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"portMailsec\">{{'Admin.Avance.Mailsec.server_port' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"portMailsec\" name=\"portMailsec\" ng-change=\"slowMailsec.infoChanged()\" placeholder=\"{{slowMailsec.config.port}}\" ng-model=\"slowMailsec.config.port\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\" style=\"display:inline-block;\">\n" +
    "                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                <div class=\"fileupload-buttonbar form-group\" style=\"margin-bottom:0;\">\n" +
    "                                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                    <div class=\"col-md-6\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <span style=\"display:block !important;\" class=\"btn btn-info fileinput-button\">\n" +
    "                                                <i class=\"icon-pencil icon-white\"></i>\n" +
    "                                                <span>{{'Admin.Avance.Mailsec.certificate' | translate}}</span>\n" +
    "                                                <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "                                            </span>\n" +
    "                                            <span ng-if=\"slowMailsec.typeError\" class=\"text-danger\"><i class=\"fa fa-times\"></i> {{'Admin.Avance.Mailsec.certificate_error' | translate}}</span>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-12\" style=\"float:left;\">\n" +
    "                                            <span>{{'Admin.Avance.Mailsec.certificate_sel' | translate}} : {{slowMailsec.filename}}</span>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-6\" style=\"display:inline-block;\">\n" +
    "                                        <div>\n" +
    "                                            <p>{{'Admin.Avance.Mailsec.certificate_actual' | translate}} : {{slowMailsec.config.name}}<br>\n" +
    "                                                {{'Admin.Avance.Mailsec.certificate_expiration' | translate}} : {{slowMailsec.config.dateLimite}}</p>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"passwordMailsec\">{{'Admin.Avance.Mailsec.certificate_passwd' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control unvalidate\" type=\"text\" id=\"passwordMailsec\" name=\"passwordMailsec\" ng-change=\"slowMailsec.infoChanged()\" placeholder=\"{{slowMailsec.config.password}}\" ng-model=\"slowMailsec.config.password\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <div class=\"col-md-6 row\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                    <span>{{'Admin.Avance.Mailsec.certificate_passwd' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowMailsec.config.isPwdGoodForPkcs === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowMailsec.config.isPwdGoodForPkcs !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                    <span ng-if=\"slowMailsec.config.listeLogins.length > 1\">{{'Admin.Avance.Mailsec.connection_with_user' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowMailsec.config.validLoginAndCertCnx === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowMailsec.config.validLoginAndCertCnx !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\" ng-if=\"slowMailsec.config.listeLogins.length > 1\">\n" +
    "                                    <div class=\"row\">\n" +
    "                                        <div class=\"col-md-6\">\n" +
    "                                            <div class=\"form-group\">\n" +
    "                                                <label class=\"control-label\" for=\"UserMailsec\">{{'Admin.Avance.Mailsec.user' | translate}}</label>\n" +
    "                                                <select ng-change=\"slowMailsec.infoChanged()\" id=\"UserMailsec\" name=\"UserMailsec\" class=\"form-control\" ng-model=\"slowMailsec.config.userlogin\" ng-options=\"user for user in slowMailsec.config.listeLogins\">\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-6\">\n" +
    "                                            <div class=\"form-group\">\n" +
    "                                                <label class=\"control-label\" for=\"passwordUserMailsec\">{{'Admin.Avance.Mailsec.passwd' | translate}}</label>\n" +
    "                                                <input ng-change=\"slowMailsec.infoChanged()\" id=\"passwordUserMailsec\" name=\"passwordUserMailsec\" type=\"text\" class=\"form-control\" ng-model=\"slowMailsec.config.userpassword\">\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <span>{{'Admin.Avance.Mailsec.certificate_connection' | translate}} :\n" +
    "                                        <i class=\"fa fa-check fa-2x\" style=\"color:green;\" ng-show=\"slowMailsec.config.validCertCnx === 'ok'\"></i>\n" +
    "                                        <i class=\"fa fa-times fa-2x\" style=\"color:red;\" ng-show=\"slowMailsec.config.validCertCnx !== 'ok'\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span ng-if=\"slowMailsec.config.validCertCnx !== 'ok' || slowMailsec.config.validLoginAndCertCnx !== 'ok' || slowMailsec.changed\" class=\"text-danger\">{{'Admin.Avance.Mailsec.must_save' | translate}}</span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <input type=\"button\" class=\"btn btn-default launchUploadMailsec\" ng-click=\"slowMailsec.enableModeTest()\" value=\"{{'Admin.Avance.Mailsec.test_config' | translate}}\">\n" +
    "                            <input type=\"button\" ng-disabled=\"(slowMailsec.config.validCertCnx !== 'ok' || slowMailsec.config.validLoginAndCertCnx !== 'ok' || slowMailsec.changed)\" ng-click=\"slowMailsec.enableModeSave()\" class=\"btn btn-success launchUploadMailsec\" value=\"{{'Admin.Avance.Mailsec.save_config' | translate}}\">\n" +
    "                            <span  ng-if=\"slowMailsec.hasTestConfig\">\n" +
    "                                <div class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Avance.Mailsec.test_updated' | translate}}</div>\n" +
    "                            </span>\n" +
    "                            <span class=\"text-success\" ng-if=\"slowMailsec.hasSaveConfig\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.Mailsec.saved' | translate}}</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/avance/srcihelios.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/avance/srcihelios.html",
    "<div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"!srciHelios.isInit\">\n" +
    "            <span class=\"text text-info\">\n" +
    "                {{'Admin.Avance.getting_infos' | translate}}\n" +
    "            </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 140px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-12\" ng-if=\"srciHelios.isInit\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3>{{'Admin.Avance.SRCI.title' | translate}}</h3>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <form class=\"form-horizontal\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"proxyAccount\">{{'Admin.Avance.SRCI.account' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"proxyAccount\" name=\"proxyAccount\" ng-model=\"srciHelios.config.proxy_account\" required>\n" +
    "                        </div>\n" +
    "                        <span class=\"text-info\">{{'Admin.Avance.SRCI.account_info' | translate}}</span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierIDSrci\">{{'Admin.Avance.SRCI.policy_identifier' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierIDSrci\" name=\"pPolicyIdentifierIDSrci\" ng-model=\"srciHelios.config.pPolicyIdentifierID\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pPolicyIdentifierDescriptionSrci\">{{'Admin.Avance.SRCI.policy_identifier_description' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pPolicyIdentifierDescriptionSrci\" name=\"pPolicyIdentifierDescriptionSrci\" ng-model=\"srciHelios.config.pPolicyIdentifierDescription\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pPolicyDigestSrci\">{{'Admin.Avance.SRCI.policy_digest' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pPolicyDigestSrci\" name=\"pPolicyDigestSrci\" ng-model=\"srciHelios.config.pPolicyDigest\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pSPURISrci\">{{'Admin.Avance.SRCI.spuri' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pSPURISrci\" name=\"pSPURISrci\" ng-model=\"srciHelios.config.pSPURI\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pClaimedRoleSrci\">{{'Admin.Avance.SRCI.claimed_role' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pClaimedRoleSrci\" name=\"pClaimedRoleSrci\" ng-model=\"srciHelios.config.pClaimedRole\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pPostalCodeSrci\">{{'Admin.Avance.SRCI.postal_code' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pPostalCodeSrci\" name=\"pPostalCodeSrci\" ng-model=\"srciHelios.config.pPostalCode\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label class=\"control-label col-sm-3\" for=\"pCitySrci\">{{'Admin.Avance.SRCI.city' | translate}}</label>\n" +
    "                                <div class=\"col-sm-9\">\n" +
    "                                    <input class=\"form-control\" type=\"text\" id=\"pCitySrci\" name=\"pCitySrci\" ng-model=\"srciHelios.config.pCity\" required>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                    <div class=\"form-group\">\n" +
    "                        <label class=\"control-label col-sm-3\" for=\"pCountryNameSrci\">{{'Admin.Avance.SRCI.country' | translate}}</label>\n" +
    "                        <div class=\"col-sm-9\">\n" +
    "                            <input class=\"form-control\" type=\"text\" id=\"pCountryNameSrci\" name=\"pCountryNameSrci\" ng-model=\"srciHelios.config.pCountryName\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <span class=\"text-info\">{{srciHelios.config.proxy_account_message}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <input type=\"button\" ng-click=\"srciHelios.enableModeSave()\" class=\"btn btn-success force-display\" value=\"{{'Admin.Avance.SRCI.save_config' | translate}}\">\n" +
    "                    <span class=\"text-success\" ng-if=\"srciHelios.hasSaveConfig\"><i class=\"fa fa-check\"></i> {{'Admin.Avance.SRCI.saved' | translate}}</span>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/bureaux.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/bureaux.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-6 adminContent\">\n" +
    "        <h2 style=\"display:inline-block;\">{{'Admin.Bureaux.Bu_Title' | translate}}</h2>\n" +
    "        <span style=\"margin-bottom:20px; margin-left:50px;\" ng-if=\"config.isAdmin\" class=\"btn btn-success\" ng-click=\"bureaux.create()\">\n" +
    "            <i class=\"fa fa-plus\"></i>\n" +
    "            {{'Admin.Bureaux.Bu_Create' | translate}}\n" +
    "        </span>\n" +
    "        <div>\n" +
    "            <div class=\"col-lg-7 col-md-12\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                    <input type=\"text\" class=\"unvalidate form-control\" placeholder=\"{{'Admin.Bureaux.Bu_Filter' | translate}}\" ng-model=\"bureaux.search\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.Bu_Filter_Info' | translate}}</div>\n" +
    "        </div>\n" +
    "        <!-- Tree -->\n" +
    "        <div class=\"well adminContent col-md-12\">\n" +
    "            <span>\n" +
    "                <i class=\"fa fa-expand pointer\" tooltip=\"{{'Admin.Bureaux.Bu_Show_All' | translate}}\" ng-click=\"bureaux.expandAll()\"></i>\n" +
    "            </span>\n" +
    "            <span>\n" +
    "                <i class=\"fa fa-compress pointer\" tooltip=\"{{'Admin.Bureaux.Bu_Hide_All' | translate}}\" ng-click=\"bureaux.reduceAll()\"></i>\n" +
    "            </span>\n" +
    "            <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"bureaux.isSearching\">\n" +
    "                <span style=\"position: relative; width: 0px; z-index: 2000000000;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "            </div>\n" +
    "            <abn-tree tree-data=\"bureaux.ordered\"\n" +
    "                      on-select=\"bureaux.select(branch)\"\n" +
    "                      search=\"bureaux.queryForTable\"\n" +
    "                      show-detail=\"true\"\n" +
    "                      check-rights=\"true\"></abn-tree>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6\">\n" +
    "        <div ng-if=\"!empty(bureaux.selected)\" class=\"adminContent well\">\n" +
    "            <legend>\n" +
    "                {{bureaux.selected.title}}\n" +
    "            </legend>\n" +
    "\n" +
    "            <p>{{'Admin.Bureaux.Bu_Shortname' | translate}} : {{bureaux.selected.name}}</p>\n" +
    "            <p>{{'Admin.Bureaux.Bu_Name' | translate}} : {{bureaux.selected.title}}</p>\n" +
    "            <p>{{'Admin.Bureaux.Bu_Desc' | translate}} : {{bureaux.selected.description}}</p>\n" +
    "            <p>{{'Admin.Bureaux.Bu_Prop' | translate}} : <span ng-repeat=\"user in bureaux.selected.proprietaires\"><span ng-if=\"$index > 0\">, </span>{{user.firstName}} {{user.lastName}}</span><span ng-if=\"bureaux.selected.proprietaires.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_None_Prop' | translate}}</span></p>\n" +
    "            <p>{{'Admin.Bureaux.Bu_Sec' | translate}} : <span ng-repeat=\"user in bureaux.selected.secretaires\"><span ng-if=\"$index > 0\">, </span>{{user.firstName}} {{user.lastName}}</span><span ng-if=\"bureaux.selected.secretaires.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.BuMod_None_Sec' | translate}}</span></p>\n" +
    "            <div>{{'Admin.Bureaux.Bu_Deleg' | translate}} : <span ng-if=\"!bureaux.selected.delegation.idCible\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Bureaux.Bu_No_Deleg' | translate}}</span>\n" +
    "                <ul style=\"margin-left:30px;\" ng-if=\"bureaux.selected.delegation.idCible\" class=\"list-unstyled\">\n" +
    "                    <li ng-if=\"bureaux.selected.delegation['date-debut-delegation'] !== undefined\"><strong>{{'Admin.Bureaux.Bu_Begin' | translate}} : </strong>Le {{bureaux.selected.delegation['date-debut-delegation'] | date:'fullDate'}}</li>\n" +
    "                    <li ng-if=\"bureaux.selected.delegation['date-fin-delegation'] !== undefined\"><strong>{{'Admin.Bureaux.Bu_Fin' | translate}} : </strong>Le {{bureaux.selected.delegation['date-fin-delegation'] | date:'fullDate'}}</li>\n" +
    "                    <li><strong>{{'Admin.Bureaux.Bu_Target' | translate}} : </strong>{{bureaux.selected.delegation.titreCible | date:'fullDate'}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "            <br/>\n" +
    "            <button class=\"btn btn-info\" ng-click=\"bureaux.edit()\">\n" +
    "                <i class=\"fa fa-pencil\"></i>\n" +
    "                {{'Admin.Bureaux.Edit' | translate}}\n" +
    "            </button>\n" +
    "\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "</div>");
}]);

angular.module("templates/admin/circuits.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/circuits.html",
    "<script type=\"text/ng-template\" id=\"popover_detail_circuit\">\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "        <li ng-repeat=\"etape in circuit.etapes\">\n" +
    "            <span ng-switch=\"etape.actionDemandee.toLowerCase()\">\n" +
    "                <i ng-switch-when=\"visa\" class=\"fa fa-check-square-o\"></i>\n" +
    "                <i ng-switch-when=\"signature\" class=\"fa ls-signature\"></i>\n" +
    "                <i ng-switch-when=\"mailsecpastell\" class=\"fa fa-envelope-o\"></i>\n" +
    "                <i ng-switch-when=\"mailsec\" class=\"fa fa-envelope\"></i>\n" +
    "                <i ng-switch-when=\"tdt\" class=\"fa fa-cloud-upload\"></i>\n" +
    "                <i ng-switch-when=\"cachet\" class=\"fa ls-stamp\"></i>\n" +
    "                <i ng-switch-when=\"archivage\" class=\"fa fa-flag-checkered\"></i>\n" +
    "            </span>\n" +
    "            <span ng-if=\"!etape.parapheur\">\n" +
    "                {{(etape.transition | translate) + \"...\"}}\n" +
    "            </span>\n" +
    "            <span ng-if=\"!!etape.parapheur\">\n" +
    "                {{etape.parapheurName}}\n" +
    "            </span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"popover_used_by\">\n" +
    "    <div class=\"text text-success wrap\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Circuits.Wo_Used_Info' | translate}} :<ul style=\"padding-left:15px; \"><li ng-repeat=\"(key, value) in selectedCircuit.usedBy\">{{key}}<ul style=\"padding-left:10px;\"><li ng-repeat=\"subtype in value\">{{subtype}}</li></ul></li></ul></div>\n" +
    "</script>\n" +
    "\n" +
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div>\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-3 adminContent\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h2 class=\"helper-inline-block\">{{'Admin.Circuits.Wo_Title' | translate}}</h2>\n" +
    "                <span style=\"float: right; margin-bottom:10px;\" class=\"btn btn-success\" ng-click=\"newCircuit()\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                    {{'Admin.Circuits.Wo_Create' | translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"well col-md-12\">\n" +
    "                <form role=\"form\" name='searchCircuitForm' novalidate>\n" +
    "                    <div>\n" +
    "                        <div class=\"input-group\">\n" +
    "                            <input placeholder=\"{{'Search' | translate}}\" ng-model=\"search\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                            <span class=\"input-group-btn\">\n" +
    "                                <button class=\"btn btn-success force-display\" ng-click=\"searchCircuit(search)\" type=\"submit\">\n" +
    "                                    <i class=\"fa fa-search\"></i>\n" +
    "                                    {{'Search' | translate}}\n" +
    "                                </button>\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                        <div style=\"height:18px;\" ng-if=\"circuits[0].total != circuits.length && total > 0\">\n" +
    "                            <span class=\"text-warning float-right\">\n" +
    "                                {{page*maxSize +1}}-{{(page+1)*maxSize < total ? (page+1)*maxSize : total}} {{'On' | translate}} {{total}}\n" +
    "                                <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"page === 0\" ng-click=\"pagine(-1)\"></span>\n" +
    "                                <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"page+1 >= (total/maxSize)\" ng-click=\"pagine(1)\"></span>\n" +
    "                            </span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                    <li ng-repeat=\"circuit in circuits | filter:{name:filter} | orderBy:'name'\" ng-class=\"selectedCircuit.name == circuit.name ? 'active' : ''\" data-placement=\"bottom\"\n" +
    "                        bs-popover=\"'popover_detail_circuit'\" data-trigger=\"hover\">\n" +
    "                        <a style=\"padding-left:34px !important;\" ng-click=\"circuit.editable ? selectCircuit(circuit) : undefined\">\n" +
    "                            <span style=\"left:15px; top:2px; position:absolute;\">\n" +
    "                                <i class=\"fa fa-code\" ng-if=\"hasMetadataMandatory(circuit)\" tooltip=\"Métadonnées obligatoires définies\"></i>\n" +
    "                            </span>\n" +
    "                            <span style=\"display:inline-block; padding-right:50px;\">{{circuit.name}}</span>\n" +
    "\n" +
    "                            <span style=\"right:15px; top:2px; position:absolute;\">\n" +
    "                                <i ng-if=\"circuit.isUsed\" tooltip=\"{{'Admin.Circuits.Wo_Used' | translate}}\" class=\"fa fa-info-circle pull-right\" ng-class=\"selectedCircuit.name == circuit.name ? 'text-inverse' : 'text-success'\"></i>\n" +
    "                                <i tooltip=\"Supprimer\" ng-if=\"circuit.editable && !circuit.isUsed\" ng-click=\"deleteCircuit(circuit); $event.stopPropagation();\" ng-class=\"selectedCircuit.name == circuit.name ? 'text-inverse' : 'text-danger'\" class=\"fa-trash-o fa pull-right\"></i>\n" +
    "                                <i tooltip=\"{{'Admin.Circuits.Wo_Copy' | translate}}\" ng-click=\"newCircuit(circuit); $event.stopPropagation();\" class=\"fa-copy fa pull-right text-inverse\"></i>\n" +
    "                            </span>\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "        <div ng-show=\"!empty(selectedCircuit)\" class=\"col-md-9 adminContent\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-12\">\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <form name=\"creationCircuit\">\n" +
    "\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input ng-disabled=\"selectedCircuit.isUsed\" ng-pattern=\"/^[0-9a-zA-ZÀ-ÿ \\-_.]+[0-9a-zA-ZÀ-ÿ]$/\"\n" +
    "                                       name=\"nomCircuit\" id=\"nomCircuit\" ng-model=\"selectedCircuit.name\"\n" +
    "                                       ng-change=\"saved = false;\" type=\"text\" class=\"form-control\"\n" +
    "                                       placeholder=\"{{'Admin.Circuits.Wo_New' | translate}}\" ng-required=\"true\">\n" +
    "                                    <span class=\"input-group-btn\">\n" +
    "                                        <span ng-click=\"saveCircuit()\" class=\"btn btn-primary\">\n" +
    "                                            <i class=\"fa fa-floppy-o\"></i>\n" +
    "                                            {{'Save' | translate}}\n" +
    "                                        </span>\n" +
    "                                        <span class=\"btn btn-primary\" disabled>\n" +
    "                                            <i class=\"fa fa-floppy-o\"></i>\n" +
    "                                            {{'Save' | translate}}\n" +
    "                                        </span>\n" +
    "                                        <span bs-popover=\"'popover_used_by'\" data-placement=\"bottom\" data-trigger=\"hover\" ng-if=\"selectedCircuit.isUsed\" class=\"btn btn-success\">\n" +
    "                                            <i class=\"fa fa-info-circle\"></i>\n" +
    "                                        </span>\n" +
    "                                    </span>\n" +
    "                            </div><!-- /input-group -->\n" +
    "\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <span class=\"text-success\" ng-if=\"saved\"><i class=\"fa fa-check\"></i> {{'Admin.Circuits.Wo_Saved' | translate}}</span>\n" +
    "                        <span class=\"text-info\" ng-if=\"selectedCircuit.isCopy\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Circuits.Wo_Copied' | translate}}</span>\n" +
    "                        <span class=\"text-warning\" ng-if=\"((circuits | filter:{name:selectedCircuit.name}:true).length > 0 && selectedCircuit.name && selectedCircuit.name !== baseName && !saved) || alreadyExist\"><i class=\"fa fa-warning\"></i> {{'Admin.Circuits.Wo_Exist' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div><!-- /.col-lg-6 -->\n" +
    "            </div><!-- /.row -->\n" +
    "\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <div style=\"margin-top: 20px; margin-left: 20px; overflow-y: auto; margin-bottom:10px;\" class=\"fixbottom\">\n" +
    "                    <div class=\"bubble step0\">\n" +
    "                        <span class=\"action\">\n" +
    "                            <i class=\"fa fa-check-square-o\"></i>\n" +
    "                        </span>\n" +
    "                        <p>\n" +
    "                            {{'Admin.Circuits.Wo_Creation' | translate}}  {{'EMETTEUR' | translate}}...\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                    <div ng-mouseover=\"overclass = 'showEtape'\" ng-mouseleave=\"overclass = ''\" ng-click=\"addEtape(0)\" class=\"add-step\" style=\"display: inline-block;\">\n" +
    "                        <div class=\"vertical-line\">\n" +
    "\n" +
    "                            <p ng-class=\"overclass\">\n" +
    "                                <i class=\"fa fa-plus-circle\"></i> {{'Admin.Circuits.Wo_Step' | translate}}\n" +
    "                            </p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <ul class=\"circuit-graph\" ui-sortable=\"sortableOpts\" ng-model=\"selectedCircuit.etapes\">\n" +
    "                        <li ng-class=\"'step' + ($index+1)\" ng-if=\"!$last\" ng-repeat=\"etape in selectedCircuit.etapes\">\n" +
    "                            <div>\n" +
    "                                <div class=\"{{'bubble ' + etape.actionDemandee + ' ' + (selectedEtape.index == $index ? 'active' : '')}}\" ng-mousedown=\"selectEtape(etape, $index)\">\n" +
    "                                    <span style=\"position:absolute; left: 5%;\">\n" +
    "                                        <i class=\"fa fa-code\" ng-if=\"etape.listeMetadatas.length > 0\" tooltip=\"Métadonnées obligatoires définies\" tooltip-placement=\"right\"></i>\n" +
    "                                    </span>\n" +
    "                                    <span class=\"action\" ng-switch=\"etape.actionDemandee.toLowerCase()\">\n" +
    "                                        <i ng-switch-when=\"visa\" class=\"fa fa-check-square-o\"></i>\n" +
    "                                        <i ng-switch-when=\"signature\" class=\"fa ls-signature\"></i>\n" +
    "                                        <i ng-switch-when=\"mailsecpastell\" class=\"fa fa-envelope-o\"></i>\n" +
    "                                        <i ng-switch-when=\"mailsec\" class=\"fa fa-envelope\"></i>\n" +
    "                                        <i ng-switch-when=\"tdt\" class=\"fa fa-cloud-upload\"></i>\n" +
    "                                        <i ng-switch-when=\"cachet\" class=\"fa ls-stamp\"></i>\n" +
    "                                        <i ng-switch-when=\"archivage\" class=\"fa fa-flag-checkered\"></i>\n" +
    "                                    </span>\n" +
    "                                    <p>\n" +
    "                                        {{(etape.transition == 'PARAPHEUR') ? etape.parapheurName : (etape.transition | translate) + \"...\"}}\n" +
    "                                    </p>\n" +
    "                                    <span tooltip=\"{{'Admin.Circuits.Wo_RemoveStep' | translate}}\" ng-click=\"deleteEtape($index)\" class=\"deleteEtapeBtn text-danger fa fa-trash-o\"></span>\n" +
    "                                </div>\n" +
    "                                <div ng-init=\"overclass=''\" ng-mouseover=\"overclass = 'showEtape'\" ng-mouseleave=\"overclass = ''\" ng-click=\"addEtape($index+1)\" class=\"add-step\">\n" +
    "                                    <div class=\"vertical-line\">\n" +
    "                                        <p ng-class=\"overclass\">\n" +
    "                                            <i class=\"fa fa-plus-circle\"></i> {{'Admin.Circuits.Wo_Step' | translate}}\n" +
    "                                        </p>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                    <div class=\"bubble\" ng-class=\"selectedCircuit.etapes[selectedCircuit.etapes.length-1].actionDemandee + (selectedEtape.index == selectedCircuit.etapes.length-1 ? ' active' : '') + (' step' + selectedCircuit.etapes.length)\" ng-click=\"selectEtape(selectedCircuit.etapes[selectedCircuit.etapes.length-1], selectedCircuit.etapes.length-1)\">\n" +
    "\n" +
    "                        <span class=\"action\" ng-switch=\"selectedCircuit.etapes[selectedCircuit.etapes.length-1].actionDemandee.toLowerCase()\">\n" +
    "                            <i ng-switch-when=\"visa\" class=\"fa fa-check-square-o\"></i>\n" +
    "                            <i ng-switch-when=\"signature\" class=\"fa ls-signature\"></i>\n" +
    "                            <i ng-switch-when=\"mailsecpastell\" class=\"fa fa-envelope-o\"></i>\n" +
    "                            <i ng-switch-when=\"mailsec\" class=\"fa fa-envelope\"></i>\n" +
    "                            <i ng-switch-when=\"tdt\" class=\"fa fa-cloud-upload\"></i>\n" +
    "                            <i ng-switch-when=\"cachet\" class=\"fa ls-stamp\"></i>\n" +
    "                            <i ng-switch-when=\"archivage\" class=\"fa fa-flag-checkered\"></i>\n" +
    "                        </span>\n" +
    "\n" +
    "                        <p>\n" +
    "                            {{(selectedCircuit.etapes[selectedCircuit.etapes.length-1].transition == 'PARAPHEUR') ? selectedCircuit.etapes[selectedCircuit.etapes.length-1].parapheurName : (selectedCircuit.etapes[selectedCircuit.etapes.length-1].transition | translate) + \"...\"}}\n" +
    "                        </p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div ng-show=\"!empty(selectedEtape)\" class=\"col-md-9\" style=\"margin-top:20px;\">\n" +
    "                <div class=\"well\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div ng-if=\"selectedEtape.actionDemandee != 'ARCHIVAGE'\" class=\"col-md-4\">\n" +
    "                            <h3 class=\"control-label\">{{'Admin.Circuits.Wo_Action' | translate}}</h3>\n" +
    "                            <div>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'SIGNATURE'\" ng-class=\"selectedEtape.actionDemandee == 'SIGNATURE' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x ls-signature\"></i>\n" +
    "                                    Signature\n" +
    "                                </span>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'VISA'\" ng-class=\"selectedEtape.actionDemandee == 'VISA' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x fa-check-square-o\"></i>\n" +
    "                                    Visa\n" +
    "                                </span>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'MAILSEC'\" ng-class=\"selectedEtape.actionDemandee == 'MAILSEC' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x fa-envelope\"></i>\n" +
    "                                    Mail sécurisé S²LOW\n" +
    "                                </span>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'MAILSECPASTELL'\" ng-class=\"selectedEtape.actionDemandee == 'MAILSECPASTELL' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x fa-envelope-o\"></i>\n" +
    "                                    Mail sécurisé PASTELL\n" +
    "                                </span>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'TDT'\" ng-class=\"selectedEtape.actionDemandee == 'TDT' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x fa-cloud-upload\"></i>\n" +
    "                                    Télé-transmission\n" +
    "                                </span>\n" +
    "                                <span class=\"step-select\" ng-click=\"selectedEtape.actionDemandee = 'CACHET'\" ng-class=\"selectedEtape.actionDemandee == 'CACHET' ? 'active' : ''\">\n" +
    "                                    <i class=\"fa fa-2x ls-stamp\"></i>\n" +
    "                                    Cachet serveur\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-8\">\n" +
    "                            <h3 class=\"control-label\">{{'Admin.Circuits.Wo_Desk' | translate}}</h3>\n" +
    "                            <div>\n" +
    "                                <p style=\"font-size: 14px;\"><b>{{'Admin.Circuits.Wo_Actual' | translate}} :</b>\n" +
    "                                    <span>\n" +
    "                                        {{selectedEtape.transition == 'PARAPHEUR' ? selectedEtape.parapheurName : ((selectedEtape.transition | translate) + \"...\")}}\n" +
    "                                    </span>\n" +
    "                                </p>\n" +
    "                                <div>\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                        <input placeholder=\"{{'Search' | translate}}\" ng-model=\"searchEtapeBureau\" ng-change=\"listHandler.search(searchEtapeBureau)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div style=\"height:15px;\" ng-if=\"listHandler.total > 0 && listHandler.total > listHandler.maxSize\">\n" +
    "                                        <span class=\"text-warning float-right\">\n" +
    "                                            {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} {{'On' | translate}} {{listHandler.total}}\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listHandler.page === 0\" ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\" ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                                    <li>\n" +
    "                                        <a ng-click=\"listHandler.selectEtape('EMETTEUR')\">\n" +
    "                                            <i ng-class=\"selectedEtape.transition === 'EMETTEUR' ? 'fa fa-arrow-right text-success' : ''\"></i><i ng-if=\"selectedEtape.transition !== 'EMETTEUR'\" style=\"width: 13px;display:inline-block;\"></i> {{'EMETTEUR' | translate}}...\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <a ng-click=\"listHandler.selectEtape('CHEF_DE')\">\n" +
    "                                            <i ng-class=\"selectedEtape.transition === 'CHEF_DE' ? 'fa fa-arrow-right text-success' : ''\"></i><i ng-if=\"selectedEtape.transition !== 'CHEF_DE'\" style=\"width: 13px;display:inline-block;\"></i> {{'CHEF_DE' | translate}}...\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li>\n" +
    "                                        <a ng-click=\"listHandler.selectEtape('VARIABLE')\">\n" +
    "                                            <i ng-class=\"selectedEtape.transition === 'VARIABLE' ? 'fa fa-arrow-right text-success' : ''\"></i><i\n" +
    "                                                ng-if=\"selectedEtape.transition !== 'VARIABLE'\"\n" +
    "                                                style=\"width: 13px;display:inline-block;\"></i> {{'VARIABLE' |\n" +
    "                                            translate}}...\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                    <li ng-repeat=\"bureau in listHandler.bureaux.slice(listHandler.page*listHandler.maxSize, (listHandler.page*listHandler.maxSize) + listHandler.maxSize)\">\n" +
    "                                        <a ng-click=\"listHandler.selectEtape(bureau)\">\n" +
    "                                            <i ng-class=\"selectedEtape.parapheur === bureau.id ? 'fa fa-arrow-right text-success' : ''\"></i><i ng-if=\"selectedEtape.parapheur !== bureau.id\" style=\"width: 13px;display:inline-block;\"></i> {{bureau.title}}\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <h3 class=\"control-label\">{{'Admin.Circuits.Wo_Notifs' | translate}}</h3>\n" +
    "                            <span class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Circuits.Wo_Search_Info' | translate}}</span>\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                <input type=\"text\" class=\"form-control unvalidate\" placeholder=\"{{'Search' | translate}}\" ng-model=\"filterBureau\">\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\" >\n" +
    "                                <label class=\"control-label\">{{'Admin.Circuits.Wo_Desks' | translate}} :</label>\n" +
    "                                <ul class=\"list-unstyled\">\n" +
    "                                    <li class=\"hover-li pointer\" ng-click=\"selectedEtape.listeNotification.push('_emetteur_')\" ng-show=\"selectedEtape.listeNotification.indexOf('_emetteur_') == -1\">\n" +
    "                                        <i class=\"fa fa-plus-circle text-success\" ></i>\n" +
    "                                        {{'EMETTEUR' | translate}}...\n" +
    "                                    </li>\n" +
    "                                    <li class=\"hover-li pointer\" ng-click=\"selectedEtape.listeNotification.push(bureau.id)\" ng-repeat=\"bureau in listHandler.list | filter:filterBureau | notSameId:selectedEtape.listeNotification\" ng-show=\"$index <= 9\">\n" +
    "                                        <i class=\"fa fa-plus-circle text-success\"></i>\n" +
    "                                        {{bureau.title}}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                                <p class=\"label label-info\" ng-if=\"(listHandler.list | filter:filterBureau | notSameId:selectedEtape.listeNotification).length > 10\">Tous les bureaux ne sont pas affichés, merci d'affiner votre recherche</p>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <label class=\"control-label\">{{'Admin.Circuits.Wo_Notified' | translate}} :</label>\n" +
    "                                <div class=\"text-info\" ng-if=\"selectedEtape.listeNotification.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Circuits.Wo_Notified_None' | translate}}</div>\n" +
    "                                <ul class=\"list-unstyled\">\n" +
    "                                    <li class=\"hover-li pointer\" ng-repeat=\"notifie in selectedEtape.listeNotification\" ng-click=\"selectedEtape.listeNotification.splice(selectedEtape.listeNotification.indexOf(notifie), 1)\">\n" +
    "                                        <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                                        {{notifie | getNameWithId:listHandler.list}}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-6\">\n" +
    "                            <h3 class=\"control-label\">Métadonnées obligatoires</h3>\n" +
    "                            <span class=\"text-info col-md-12\">\n" +
    "                                <i class=\"fa fa-info-circle\"></i>\n" +
    "                                Ces métadonnées seront à renseigner lors de la validation de cette étape\n" +
    "                            </span>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <label class=\"control-label\">Disponibles :</label>\n" +
    "                                <ul class=\"list-unstyled\">\n" +
    "                                    <li class=\"hover-li pointer\" ng-click=\"selectedEtape.listeMetadatas.push(meta.id)\" ng-repeat=\"meta in listMetaHandler.list | notSameId:selectedEtape.listeMetadatas\">\n" +
    "                                        <i class=\"fa fa-plus-circle text-success\"></i>\n" +
    "                                        {{meta.name}}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <label class=\"control-label\">Obligatoires :</label>\n" +
    "                                <ul class=\"list-unstyled\">\n" +
    "                                    <li class=\"hover-li pointer\" ng-repeat=\"meta in selectedEtape.listeMetadatas\" ng-click=\"selectedEtape.listeMetadatas.splice(selectedEtape.listeMetadatas.indexOf(meta), 1)\">\n" +
    "                                        <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                                        {{listMetaHandler.getNameWithId(meta).name}}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <button ng-click=\"deleteEtape()\" ng-if=\"selectedEtape.actionDemandee != 'ARCHIVAGE'\" class=\"btn-block btn btn-danger\">\n" +
    "                        <i class=\"fa fa-trash-o\"></i>\n" +
    "                        {{'Admin.Circuits.Wo_RemoveStep' | translate}}\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/dossiers.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/dossiers.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-12 adminContent\">\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-2\">\n" +
    "                <h2>{{'Admin.Dossiers.Title' | translate}}</h2>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-10\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"row\">\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"type\">{{'Admin.Dossiers.Filter_Type' | translate}}</label>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <select ng-options=\"type.id as type.id for type in types\" id=\"type\"  class=\"form-control unvalidate\" ng-model=\"opt.type\" ng-change=\"opt.sousType = ''\" name=\"type\">\n" +
    "                                        <option value=\"\">-- {{'None' | translate}} --</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"subtype\">{{'Admin.Dossiers.Filter_Sub' | translate}}</label>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <select ng-options=\"subtype.id as subtype.id for subtype in (types | findWithId:opt.type).sousTypes \" id=\"subtype\" class=\"form-control unvalidate\" ng-model=\"opt.sousType\" name=\"subtype\">\n" +
    "                                        <option value=\"\">-- {{'None' | translate}} --</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label\" style=\"width:100%;\" for=\"beforeEmit\">\n" +
    "                                        {{'Admin.Dossiers.Emit_date' | translate}}\n" +
    "                                        <i class=\"fa fa-question-circle\"\n" +
    "                                           tooltip=\"{{'Admin.Dossiers.Emit_date_help' | translate}}\"></i>\n" +
    "\n" +
    "                                    </label>\n" +
    "                                    <div class=\"input-group validation-control\" style=\"width: auto !important;\">\n" +
    "                                        <input type=\"text\" id=\"beforeEmit\" max-date=\"today\" name=\"beforeEmit\"\n" +
    "                                               return-format=\"timestamp\" ng-model=\"opt.beforeEmit\"\n" +
    "                                               class=\"form-control unvalidate\" ip-datepicker readonly='true'/>\n" +
    "                                        <span ng-if=\"!!opt.beforeEmit\" ng-click=\"opt.beforeEmit = undefined\"\n" +
    "                                              class=\"pointer input-group-addon\">\n" +
    "                                                    <i class=\"fa fa-times\"></i>\n" +
    "                                                </span>\n" +
    "                                        <label for=\"beforeEmit\" ng-if=\"!opt.beforeEmit\" class=\"input-group-addon\">\n" +
    "                                            <i class=\"fa fa-calendar\"></i>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <div class=\"checkbox\">\n" +
    "                                    <label class=\"ng-binding\" for=\"endedDossiers\">Afficher seulement les dossiers en\n" +
    "                                        cours\n" +
    "                                        <input class=\"unvalidate\" id=\"endedDossiers\" ng-model=\"opt.showOnlyCurrent\"\n" +
    "                                               name=\"endedDossiers\" type=\"checkbox\">\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"checkbox\">\n" +
    "                                    <label class=\"ng-binding\" for=\"lateDossiers\">Afficher seulement les dossiers en\n" +
    "                                        retard\n" +
    "                                        <input class=\"unvalidate\" id=\"lateDossiers\" ng-model=\"opt.showOnlyLate\"\n" +
    "                                               name=\"lateDossiers\" type=\"checkbox\">\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                        <div class=\"row\">\n" +
    "                            <div ng-if=\"!config.isAdminFonctionnel()\" class=\"col-md-3\">\n" +
    "                                <label for=\"bureau\">\n" +
    "                                    {{'Admin.Dossiers.Filter_Desk' | translate}}\n" +
    "                                </label>\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"right-inner-addon\">\n" +
    "                                        <input id=\"bureau\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"opt.bureau\" placeholder=\"{{'Admin.Dossiers.Find_Desk' | translate}}\"\n" +
    "                                               typeahead=\"bureau as bureau.title for bureau in bureaux | filter:$viewValue | limitTo:8\"\n" +
    "                                               name=\"bureau\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <span style=\"white-space: normal;cursor: pointer;\" class=\"input-group-addon\"\n" +
    "                                          tooltip-trigger=\"click\" tooltip-placement=\"bottom\"\n" +
    "                                          tooltip=\"{{'Admin.Dossiers.Find_Desk_Info' | translate}}\">\n" +
    "                                        <i ng-class=\"!!opt.bureau.id ? 'text-success fa-check' : 'text-warning fa-question-circle'\"\n" +
    "                                           class=\"fa fa-question-circle\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"config.isAdminFonctionnel()\" class=\"col-md-3\">\n" +
    "                                <label for=\"bureauFonctionnel\">{{'Admin.Dossiers.Filter_Desk' | translate}}</label>\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <div class=\"right-inner-addon\">\n" +
    "                                        <input id=\"bureauFonctionnel\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"opt.bureau\" placeholder=\"{{'Admin.Dossiers.Find_Desk' | translate}}\"\n" +
    "                                               typeahead=\"bureau as bureau.name for bureau in bureaux | sameId:config.adminFonctionnel() | filter:$viewValue | limitTo:8\"\n" +
    "                                               name=\"bureauFonctionnel\">\n" +
    "                                    </div>\n" +
    "                                     <span style=\"white-space: normal;cursor: pointer;\" class=\"input-group-addon\"\n" +
    "                                           tooltip-trigger=\"click\" tooltip-placement=\"bottom\"\n" +
    "                                           tooltip=\"{{'Admin.Dossiers.Find_Desk_Info' | translate}}\">\n" +
    "                                        <i ng-class=\"!!opt.bureau.id ? 'text-success fa-check' : 'text-warning fa-question-circle'\"\n" +
    "                                           class=\"fa fa-question-circle\"></i>\n" +
    "                                    </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <label for=\"recherche\">{{'Admin.Dossiers.Filter_Title' | translate}}</label>\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <input id=\"recherche\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"opt.title\" placeholder=\"{{'Search' | translate}}\" name=\"recherche\">\n" +
    "                                </div>\n" +
    "\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <div class=\"form-group\">\n" +
    "                                    <label class=\"control-label\" style=\"width:100%;\" for=\"staticSince\">\n" +
    "                                        {{'Admin.Dossiers.Static_since' | translate}}\n" +
    "                                        <i class=\"fa fa-question-circle\"\n" +
    "                                           tooltip=\"{{'Admin.Dossiers.Static_since_help' | translate}}\"></i>\n" +
    "\n" +
    "\n" +
    "                                    </label>\n" +
    "                                    <div class=\"input-group validation-control\" style=\"width: auto !important;\">\n" +
    "                                        <input type=\"text\" id=\"staticSince\" max-date=\"today\" name=\"staticSince\"\n" +
    "                                               return-format=\"timestamp\" ng-model=\"opt.staticSince\"\n" +
    "                                               class=\"form-control unvalidate\" ip-datepicker readonly='true'\n" +
    "                                               max-date=\"today\"/>\n" +
    "                                        <span ng-if=\"!!opt.staticSince\" ng-click=\"opt.staticSince = undefined\"\n" +
    "                                              class=\"pointer input-group-addon\">\n" +
    "                                                    <i class=\"fa fa-times\"></i>\n" +
    "                                                </span>\n" +
    "                                        <label for=\"staticSince\" ng-if=\"!opt.staticSince\" class=\"input-group-addon\">\n" +
    "                                            <i class=\"fa fa-calendar\"></i>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-3\">\n" +
    "                                <div class=\"row\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <span ng-click=\"getDossiers(opt)\" class=\"btn btn-success col-xs-12\" ng-disabled=\"buttonsDisabled\">\n" +
    "                                            <i class=\"fa fa-search\"></i>\n" +
    "                                            {{'Find' | translate}}\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        <span ng-click=\"opt = copy(noneOpt); hasSearch = false;\" class=\"btn btn-info col-xs-12\"\n" +
    "                                              ng-disabled=\"buttonsDisabled\">\n" +
    "                                            <i class=\"fa fa-undo\"></i>\n" +
    "                                            {{'Reset' | translate}}\n" +
    "                                        </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"hasSearch\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <table ng-table=\"tableParams\" class=\"table table-striped\" ng-show=\"!buttonsDisabled && hasFoundFolder\">\n" +
    "                    <tr ng-repeat=\"dossier in $data\" ng-init=\"completelyLocked = isUnlockable(dossier)\" ng-class=\"completelyLocked ? 'text-danger' : ''\">\n" +
    "                        <td data-title=\"'Title' | translate\" sortable=\"'title'\">\n" +
    "                            <i ng-if=\"dossier.locked && !completelyLocked\" class=\"text-info fa fa-clock-o fa-2x\" tooltip-placement=\"right\" tooltip=\"{{'Admin.Dossiers.Currently' | translate}}\"></i>\n" +
    "                            <i ng-if=\"completelyLocked\" class=\"text-danger fa fa-warning fa-2x\" tooltip-placement=\"right\" tooltip=\"{{('Admin.Dossiers.Locked' | translate).replace('__var__', properties['parapheur.ihm.admin.dossier.locked.notify'] || 600)}}\"></i>\n" +
    "                            {{dossier.title}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.Current_Desk' | translate\" sortable=\"'parent'\">\n" +
    "                            {{(bureaux | findWithId:dossier.parent).title}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.Emit_Date' | translate\" sortable=\"'dateEmission'\">\n" +
    "                            {{dossier.dateEmission | texttodate | date:'dd/MM/yyyy à HH:mm'}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.Modif_Date' | translate\" sortable=\"'modified'\">\n" +
    "                            {{dossier.modified | texttodate | date:'dd/MM/yyyy à HH:mm'}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.Type' | translate\" sortable=\"'type'\">\n" +
    "                            {{dossier.type}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.Sub' | translate\" sortable=\"'sousType'\">\n" +
    "                            {{dossier.sousType}}\n" +
    "                        </td>\n" +
    "                        <td data-title=\"'Admin.Dossiers.State' | translate\" sortable=\"'banetteName'\">\n" +
    "                            {{getStateName(dossier.banetteName)}}\n" +
    "                        </td>\n" +
    "                        <td style=\"text-align: center;\" data-title=\"'Admin.Dossiers.Actions' | translate\">\n" +
    "                            <span ng-click=\"unlock(dossier)\" ng-if=\"completelyLocked\" class=\"btn btn-warning\" title=\"{{'Admin.Dossiers.Unlock' | translate}}\">\n" +
    "                                <i class=\"fa fa-unlock\"></i>\n" +
    "                            </span>\n" +
    "                            <span ng-click=\"confirmTransfert(dossier)\" ng-if=\"isEnCours(dossier.banetteName) && !dossier.locked\" class=\"btn btn-info\" title=\"{{'Admin.Dossiers.Transfert' | translate}}\">\n" +
    "                                <i class=\"fa fa-share\"></i>\n" +
    "                            </span>\n" +
    "                            <span ng-click=\"confirmDelete(dossier)\" ng-if=\"!dossier.locked\" class=\"btn btn-danger\" title=\"{{'Delete' | translate}}\">\n" +
    "                                <i class=\"fa fa-trash-o\"></i>\n" +
    "                            </span>\n" +
    "                            <span ng-click=\"viewJournal(dossier)\" class=\"btn btn-default\" title=\"{{'Admin.Dossiers.Events' | translate}}\">\n" +
    "                                <i class=\"fa fa-list-alt\"></i>\n" +
    "                            </span>\n" +
    "                            <span ng-if=\"properties['parapheur.ihm.admin.mode.advanced'] === 'true' && config.isAdmin\" ng-click=\"viewProperties(dossier)\" class=\"btn btn-success\" title=\"{{'Admin.Dossiers.Advanced' | translate}}\">\n" +
    "                                <i class=\"fa fa-info\"></i>\n" +
    "                            </span>\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "\n" +
    "                <div class=\"col-md-offset-5\" ng-if=\"!hasFoundFolder\">\n" +
    "                    <span class=\"text text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Dossiers.No_Folders' | translate}}</span>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div style=\"margin-top:30px;\" class=\"col-md-12\">\n" +
    "                        <span us-spinner spinner-key=\"spinnerDossiers\"></span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/groupes.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/groupes.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-6 adminContent\">\n" +
    "        <h2 style=\"display:inline-block;\">{{'Admin.Groupes.Gr_Title' | translate}}</h2>\n" +
    "        <span  style=\"margin-bottom:20px; margin-left:50px;\"  class=\"btn btn-success\" ng-click=\"createGroup()\">\n" +
    "            <i class=\"fa fa-plus\"></i>\n" +
    "            {{'Admin.Groupes.Gr_New' | translate}}\n" +
    "        </span>\n" +
    "        <div>\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                    <input type=\"text\" class=\"unvalidate form-control\" placeholder=\"{{'Admin.Groupes.Gr_Filter' | translate}}\" ng-model=\"search\">\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-12 text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Groupes.Gr_Filter_Info' | translate}}</div>\n" +
    "        </div>\n" +
    "        <div class=\"well adminContent col-md-12\">\n" +
    "            <abn-tree-groups tree-data=\"groupes\"\n" +
    "                             on-select=\"selectGroup(branch);\"\n" +
    "                             on-delete=\"deleteGroup(branch)\"\n" +
    "                             search=\"queryGroups\"></abn-tree-groups>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-6 adminContent\">\n" +
    "        <div ng-if=\"!empty(selectedGroup)\" class=\"adminContent col-md-12 well\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "\n" +
    "                <form name=\"editGroup\" novalidate>\n" +
    "                    <legend ng-if=\"!selectedGroup.isNew\">\n" +
    "                        {{selectedGroup.shortName}}\n" +
    "                    </legend>\n" +
    "                    <legend ng-if=\"selectedGroup.isNew\">\n" +
    "                        {{'Admin.Groupes.Gr_Create' | translate}}\n" +
    "                    </legend>\n" +
    "\n" +
    "                    <label ng-if=\"selectedGroup.isNew\" class=\"col-md-12\">\n" +
    "                        {{'Admin.Groupes.Gr_Name' | translate}} :\n" +
    "                        <input class=\"form-control\" name=\"nomGroup\" ng-minlength=\"1\" type=\"text\" ng-model=\"selectedGroup.shortName\" ng-pattern='/^[^&:\"£*/<>?%|+;]*$/' required diff-array=\"unorderedGroupes\" placeholder=\"{{'Admin.Groupes.Gr_New_Name' | translate}}\" attr=\"shortName\">\n" +
    "                        <span class=\"text-danger\" ng-show=\"editGroup.nomGroup.$error.pattern\"><i class=\"fa fa-warning\"></i> {{'Admin.Groupes.Gr_SpeChar' | translate}}</span>\n" +
    "                    </label>\n" +
    "                    <div ng-if=\"selectedGroup.isNew\">\n" +
    "                        <label class=\"col-md-12\">\n" +
    "                            {{'Admin.Groupes.Gr_Parent' | translate}} :\n" +
    "                            <select class=\"form-control unvalidate\" ng-model=\"selectedGroup.parent\">\n" +
    "                                <option value=\"\">-- {{'None' | translate}} --</option>\n" +
    "                                <option ng-value=\"group.shortName\" ng-repeat=\"group in unorderedGroupes\">\n" +
    "                                    {{group.shortName}}\n" +
    "                                </option>\n" +
    "                            </select>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </form>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <label>{{'Admin.Groupes.Gr_Add_Member' | translate}} :</label>\n" +
    "                        <div>\n" +
    "                            <div>\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                    <input placeholder=\"{{'Search' | translate}}\" ng-model=\"searchUser\" ng-change=\"listUsersHandler.search(searchUser)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div style=\"height:30px;\" ng-if=\"listUsersHandler.maxSize < listUsersHandler.total\">\n" +
    "                                <span class=\"text-warning float-right\">\n" +
    "                                    {{listUsersHandler.page*listUsersHandler.maxSize +1}}-{{(listUsersHandler.page+1)*listUsersHandler.maxSize < listUsersHandler.total ? (listUsersHandler.page+1)*listUsersHandler.maxSize : listUsersHandler.total}} {{'On' | translate}} {{listUsersHandler.total}}\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listUsersHandler.page === 0\" ng-click=\"listUsersHandler.pagine(-1)\"></span>\n" +
    "                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listUsersHandler.page+1 >= (listUsersHandler.total/listUsersHandler.maxSize)\" ng-click=\"listUsersHandler.pagine(1)\"></span>\n" +
    "                                </span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span class=\"text-info\" ng-if=\"listUsersHandler.total == 0 || (listUsersHandler.subList.length === 0 && $scope.selectedGroup.users.length === 0)\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Groupes.Gr_None_Result' | translate}}</span>\n" +
    "                            <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\" style=\"margin-top:5px;margin-bottom: 20px;\">\n" +
    "                                <li ng-repeat=\"user in listUsersHandler.subList\" ng-switch on=\"userAlreadyInGroup(user)\">\n" +
    "                                    <a ng-click=\"addUserToGroup(user)\" ng-switch-when=\"true\">\n" +
    "                                        <i class=\"fa fa-plus-circle text-success\"></i> {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                                    </a>\n" +
    "                                    <a class=\"disabled\" ng-switch-default>\n" +
    "                                        {{user.firstName}} {{user.lastName}} ({{user.username}})\n" +
    "                                    </a>\n" +
    "                                </li>\n" +
    "                            </ul>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <label>{{'Admin.Groupes.Gr_Members' | translate}} :</label>\n" +
    "                        <ul class=\"list-unstyled\">\n" +
    "                            <li ng-class=\"(selectedGroup.shortName === 'ALFRESCO_ADMINISTRATORS' && user.shortName.split('@')[0] ==='admin') ? '' : 'hover-li pointer'\" ng-repeat=\"user in selectedGroup.users\" ng-click=\"removeUserFromGroup($index)\"><i ng-hide=\"selectedGroup.shortName === 'ALFRESCO_ADMINISTRATORS' && user.shortName.split('@')[0] ==='admin'\" class=\"fa fa-times-circle text-danger\"></i> {{user.fullName}} ({{user.shortName}})</li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <span ng-if=\"!selectedGroup.isNew\" class=\"btn btn-primary\" ng-click=\"saveGroup()\" ng-disabled=\"saving\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        <span>{{'Save' | translate}}</span>\n" +
    "                    </span>\n" +
    "                    <span ng-if=\"selectedGroup.isNew\" ng-disabled=\"!editGroup.$valid\" class=\"btn btn-primary\" ng-click=\"saveGroup()\" ng-disabled=\"saving\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        <span>{{'Save' | translate}}</span>\n" +
    "                    </span>\n" +
    "                    <span us-spinner spinner-key=\"spinnerGroups\"></span>\n" +
    "                    <span ng-show=\"saved\" class=\"alert alert-success\">{{'Admin.Groupes.Gr_Saved' | translate}}</span>\n" +
    "                    <span ng-if=\"selectedGroup.isNew && selectedGroup.shortName !== '' && editGroup.nomGroup.$error.isdiff\" class=\"block alert alert-danger\">{{'Admin.Groupes.Gr_Exist' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/informations.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/informations.html",
    "<script type=\"text/ng-template\"  id=\"popover_users\">\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "        <li ng-repeat=\"user in infos.users\">{{user}}</li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div ng-cloak class=\"col-md-11 col-md-offset-1\">\n" +
    "        <h2>{{'Admin.Informations.Info_Title' | translate}}</h2>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-3\">\n" +
    "                <div>\n" +
    "                    <span class=\"btn btn-info\" ng-if=\"!isTenant\" ng-click=\"reloadInfos()\"><i class=\"fa fa-refresh\"></i> {{'Admin.Informations.Info_Reload' | translate}}</span>\n" +
    "                    <span class=\"btn btn-success\" ng-click=\"launchHealthStatus()\"><i\n" +
    "                            class=\"fa fa-medkit\"></i> {{'Admin.Informations.Info_Health' | translate}}</span>\n" +
    "\n" +
    "                    <div ng-show=\"reload.all\" class=\"text-info\">{{'Admin.Informations.Info_Reloaded' | translate}} <i\n" +
    "                            class=\"fa fa-check\"></i></div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!isTenant\">\n" +
    "                    <p><br><strong>{{'Admin.Informations.Users_Connected' | translate}} :</strong>\n" +
    "                        {{infos.users.length}}\n" +
    "                        <i ng-if=\"infos.users.length <= +properties['parapheur.ihm.admin.users.connected.threshold']\" title=\"Utilisateurs connectés\" class=\"fa fa-question-circle pointer\" bs-popover=\"'popover_users'\" data-trigger=\"hover\"></i>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <h3>{{'Admin.Informations.Info_Check' | translate}}</h3>\n" +
    "\n" +
    "                    <div>\n" +
    "                        <i tooltip=\"{{'Admin.Informations.Info_Relaunch' | translate}}\"\n" +
    "                           ng-if=\"infos.office.available && !isTenant\" ng-click=\"restartOffice()\"\n" +
    "                           class=\"fa fa-refresh pointer\"></i>\n" +
    "                        <strong>{{infos.office.available && infos.office.ooName ? infos.office.ooName + \" \" +\n" +
    "                            infos.office.ooSetupVersion : \"OpenOffice\"}} : </strong>\n" +
    "                        <i class=\"fa-2x\"\n" +
    "                           ng-class=\"infos.office.available ? 'text-success fa fa-check' : 'text-danger fa fa-times'\"></i>\n" +
    "                        <span class=\"text-success\" ng-if=\"reload.office\">\n" +
    "                            {{'Admin.Informations.Info_Office_Success' | translate}}\n" +
    "                        </span>\n" +
    "                        <span class=\"text-danger\" ng-if=\"reload.errorOffice\">\n" +
    "                            {{'Admin.Informations.Info_Office_Error' | translate}}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div>\n" +
    "                        <i tooltip=\"{{'Admin.Informations.Info_Relaunch' | translate}}\"\n" +
    "                           ng-if=\"!isTenant && !reload.xemelios\" ng-click=\"restartXemelios()\"\n" +
    "                           class=\"fa fa-refresh pointer\"></i>\n" +
    "                        <strong>Xemelios : </strong>\n" +
    "                        <i ng-if=\"!reload.xemelios\" class=\"fa-2x\"\n" +
    "                           ng-class=\"infos.isXemEnabled ? 'text-success fa fa-check' : 'text-danger fa fa-times'\"></i>\n" +
    "\n" +
    "                        <div class=\"inline\" ng-class=\"reload.xemelios ? 'css-loader' : ''\"></div>\n" +
    "                        <span ng-if=\"reload.xemelios\" class=\"text text-info\">{{'Admin.Informations.Info_Wait' | translate}}</span>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"!infos.isGSEnabled\"><strong>GhostScript : </strong><i class=\"fa-2x\"\n" +
    "                                                                                      ng-class=\"infos.isGSEnabled ? 'text-success fa fa-check' : 'text-danger fa fa-times'\"></i>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"!isTenant\">\n" +
    "                        <i tooltip=\"{{'Admin.Informations.Info_Reload' | translate}}\" ng-click=\"reloadProperties()\" ng-if=\"!isTenant\" class=\"fa fa-refresh pointer\"></i>\n" +
    "                        <strong>{{'Admin.Informations.Info_Prop' | translate}} : </strong>\n" +
    "                        <i class=\"fa-2x\" ng-class=\"infos.isPropertiesFound ? 'text-success fa fa-check' : 'text-danger fa fa-times'\"></i>\n" +
    "                        <span class=\"text-success\" ng-if=\"reload.properties\">\n" +
    "                            {{'Admin.Informations.Info_Prop_Reload' | translate}}\n" +
    "                        </span>\n" +
    "                        <span class=\"text-danger\" ng-if=\"reload.errorProperties\">\n" +
    "                            {{'Admin.Informations.Info_Prop_Error' | translate}} <i class=\"fa fa-warning\"></i>\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"infos.isASEnabled\"><strong>LiberValid : </strong><i class=\"fa-2x\"\n" +
    "                                                                                    ng-class=\"infos.isASEnabled ? 'text-success fa fa-check' : 'text-danger fa fa-times'\"></i>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div ng-if=\"!isTenant\">\n" +
    "                    <h3>{{'Admin.Informations.Info_CPU' | translate}}</h3>\n" +
    "                    <p><strong>{{'Admin.Informations.Info_Core' | translate}} :</strong> {{infos.cores}}</p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\" ng-if=\"!isTenant\">\n" +
    "                <div id=\"memChart\" style=\"height: 300px;\" pie-chart pie-title=\"'Admin.Informations.Info_Mem' | translate\" pie-tooltip=\"'{name}: {y} Mo'\" dataset=\"memChartData\"></div>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\" ng-if=\"!isTenant\">\n" +
    "                <div id=\"diskChart\" style=\"height: 300px;\" pie-chart pie-title=\"'Admin.Informations.Info_HDD' | translate\" pie-tooltip=\"'{name}: {y} Go'\" dataset=\"diskChartData\"></div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/nodebrowser.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/nodebrowser.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div>\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-3 adminContent\">\n" +
    "            <h2>Node browser</h2>\n" +
    "            <ul>\n" +
    "                <li ng-click=\"goToPathIndex($index)\" ng-repeat=\"path in rootPath\">\n" +
    "                    {{path}}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-9 adminContent\">\n" +
    "            <h2>Propriétés</h2>\n" +
    "            <ul>\n" +
    "                <li ng-repeat=\"(key, value) in objectProps\">\n" +
    "                    {{key}} : {{value}}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <h2>Navigation</h2>\n" +
    "            <ul>\n" +
    "                <li ng-click=\"selectNode(item.name)\" ng-repeat=\"item in datatree.items\">\n" +
    "                    {{item.name}}\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/admin/script.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/script.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"row adminContent\">\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <h2>{{'Admin.Avance.Script.Script_execution' | translate}}</h2>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-offset-1 col-md-6 text-info\">\n" +
    "            <i class=\"fa fa-info-circle\"></i>\n" +
    "            {{'Admin.Avance.Script.Execute_as_admin' | translate}}\n" +
    "            <input type=\"text\" ng-model=\"runas\" class=\"unvalidate form-control inline\" style=\"width:auto;\">\n" +
    "            {{'Admin.Avance.Script.of_tenant' | translate}}\n" +
    "            <select ng-model=\"selectedTenant\" ng-options=\"tenant.name for tenant in tenantList | orderBy:'name'\"\n" +
    "                    class=\"unvalidate form-control inline\" style=\"width:auto;\">\n" +
    "                <option value=\"\">-- ROOT --</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-md-12\">\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <h3>Script</h3>\n" +
    "                <div ui-ace=\"{\n" +
    "                      useWrapMode : true,\n" +
    "                      showGutter: true,\n" +
    "                      theme:'twilight',\n" +
    "                      mode: 'javascript'\n" +
    "                }\" ng-model=\"script\" style=\"height:400px;\"></div>\n" +
    "                <span ng-click=\"sendScript()\" class=\"btn btn-success\"> {{'Admin.Avance.Script.Execute_script' | translate}}</span>\n" +
    "                <span ng-if=\"scriptError\" class=\"text-danger\"><i class=\"fa fa-warning\"></i> {{'Admin.Avance.Script.Error_on_script_execution' | translate}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <h3>Modèle</h3>\n" +
    "                <div ui-ace=\"{\n" +
    "                      useWrapMode : true,\n" +
    "                      showGutter: true,\n" +
    "                      theme:'twilight',\n" +
    "                      mode: 'ftl'\n" +
    "                }\" ng-model=\"template\" style=\"height:400px;\"></div>\n" +
    "\n" +
    "                <label class=\"checkbox\">\n" +
    "                    <input class=\"unvalidate\" type=\"checkbox\" ng-model=\"readOnly\"/>\n" +
    "                    {{'Admin.Avance.Script.Read_only' | translate}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-4\">\n" +
    "                <h3>Résultat</h3>\n" +
    "                <div ng-if=\"renderedTemplate\">\n" +
    "                    <h4 ng-if=\"!scriptError\">{{'Admin.Avance.Script.Model' | translate}}</h4>\n" +
    "                    <h4 ng-if=\"scriptError\">{{'Admin.Avance.Script.Error_message' | translate}}</h4>\n" +
    "                    {{renderedTemplate}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"printOutput.length > 0\">\n" +
    "                    <h4>Logs</h4>\n" +
    "                    <ul class=\"list-unstyled\">\n" +
    "                        <li ng-repeat=\"log in printOutput\">{{log}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/stats.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/stats.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-11 col-md-offset-1\">\n" +
    "            <form name=\"statistiques\" novalidate=\"novalidate\">\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <h2 class=\"col-md-6\">{{'Admin.Stats.Title' | translate}}</h2>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "                <h3>{{'Admin.Stats.Period' | translate}}</h3>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div style=\"width: 100%;\" class=\"form-group\">\n" +
    "                            <label for=\"debut\">{{'Admin.Stats.Begin' | translate}}\n" +
    "\n" +
    "                            </label>\n" +
    "                            <span class=\"float-right label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                            <div class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                <input id=\"debut\" name=\"debut\" placeholder=\"{{'Admin.Stats.Begin' | translate}}\" ng-cloak=\"\" from=\"true\" linked=\"#fin\" ip-id=\"debut\" return-format=\"@\" readonly=\"true\" ip-datepicker type=\"text\" ng-model=\"opt.fromTime\" class=\"form-control unvalidate\" required>\n" +
    "                                <span ng-if=\"!!opt.fromTime\" ng-click=\"opt.fromTime = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"debut\" ng-if=\"!opt.fromTime\" class=\"input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"fin\">{{'Admin.Stats.End' | translate}}\n" +
    "\n" +
    "                            </label>\n" +
    "                            <span class=\"float-right label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                            <div class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                <input id=\"fin\" name=\"fin\" placeholder=\"{{'Admin.Stats.End' | translate}}\" ng-cloak=\"\" linked=\"#debut\" ip-id=\"fin\" return-format=\"@\" readonly=\"true\" ip-datepicker type=\"text\" ng-model=\"opt.toTime\" class=\"form-control unvalidate\" required>\n" +
    "                                <span ng-if=\"!!opt.toTime\" ng-click=\"opt.toTime = undefined\" class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"fin\" ng-if=\"!opt.toTime\" class=\"input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"cumul\">{{'Admin.Stats.Cumulation' | translate}}</label>\n" +
    "                    <select class=\"form-control unvalidate\" id=\"cumul\" name=\"cumul\" ng-model=\"cumul\">\n" +
    "                        <option value=\"1\">{{'Admin.Stats.Day' | translate}}</option>\n" +
    "                        <option value=\"2\">{{'Admin.Stats.Week' | translate}}</option>\n" +
    "                        <option value=\"3\">{{'Admin.Stats.Month' | translate}}</option>\n" +
    "                        <option value=\"4\">{{'Admin.Stats.Year' | translate}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"well dashlet\">\n" +
    "                    <div class=\"row pos-rel margin-none\">\n" +
    "                        <h3 ng-click=\"element.show = !element.show\" class=\"pointer\">{{'Admin.Stats.Filter_Desks' | translate}}</h3>\n" +
    "                        <div class=\"checkbox inline-right-checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"top\" tooltip=\"{{'Admin.Stats.Accumulative_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"bureaux.cumul\" type=\"checkbox\">\n" +
    "                                {{'Admin.Stats.Accumulative' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"dashlet-content\" bn-slide-show=\"element.show\">\n" +
    "\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <div>\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                        <input placeholder=\"{{'Search' | translate}}\" ng-model=\"searchBureau\" ng-change=\"listHandler.search(searchBureau)\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div style=\"height:15px;\" ng-if=\"listHandler.maxSize < listHandler.total\">\n" +
    "                                    <span class=\"text-warning float-right\">\n" +
    "                                        {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} {{'On' | translate}} {{listHandler.total}}\n" +
    "                                        <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"listHandler.page === 0\" ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                        <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\" ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                    </span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "\n" +
    "                                <span class=\"text-info\" ng-if=\"listHandler.searchResultSubList.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Stats.No_Result' | translate}}</span>\n" +
    "\n" +
    "                                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                                    <li ng-repeat=\"bureau in listHandler.searchResultSubList\">\n" +
    "                                        <a ng-click=\"listHandler.selectElement(bureau)\">\n" +
    "                                            <i class=\"fa fa-plus-circle text-success\"></i> {{bureau.name}}\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <span ng-if=\"listHandler.selectedSubList.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Stats.All_Selected' | translate}}</span>\n" +
    "                                <ul class=\"list-unstyled pointer\">\n" +
    "                                    <li class=\"hover-li\" ng-click=\"listHandler.deselectElement(bureau.id)\" ng-repeat=\"bureau in listHandler.selectedSubList\">\n" +
    "                                        <i class=\"text-danger fa fa-times-circle\"></i> {{bureau.name}}\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Stats.Filter_Types' | translate}}</h3>\n" +
    "\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"type\">{{'Admin.Stats.Types' | translate}}</label>\n" +
    "                                <select id=\"type\" ng-model=\"opt.options.type\" name=\"type\" class=\"form-control unvalidate\" ng-options=\"type.id as type.id for type in types\">\n" +
    "                                    <option value=\"\">{{'None' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"subType\">{{'Admin.Stats.Sub' | translate}}</label>\n" +
    "                                <select id=\"subType\" ng-model=\"opt.options.sousType\" name=\"subType\" class=\"form-control unvalidate\" ng-options=\"sousType.id as sousType.id for sousType in (types | findWithId:opt.options.type).sousTypes\">\n" +
    "                                    <option value=\"\">{{'None' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Stats.Actions' | translate}}</h3>\n" +
    "\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\" tooltip=\"{{'Admin.Stats.Create_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersCrees\" type=\"checkbox\"> {{'Admin.Stats.Create' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\" tooltip=\"{{'Admin.Stats.Emit_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersEmis\" type=\"checkbox\"> {{'Admin.Stats.Emit' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"\n" +
    "                               tooltip=\"{{'Admin.Stats.EmitReject_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersEmisRefuses\" type=\"checkbox\">\n" +
    "                                {{'Admin.Stats.EmitReject' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\" tooltip=\"{{'Admin.Stats.Instruct_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersInstruits\" type=\"checkbox\"> {{'Admin.Stats.Instruct' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\" tooltip=\"{{'Admin.Stats.Reject_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersRefuses\" type=\"checkbox\"> {{'Admin.Stats.Reject' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\" tooltip=\"{{'Admin.Stats.Handle_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"action.dossiersTraites\" type=\"checkbox\"> {{'Admin.Stats.Handle' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div class=\"checkbox\">\n" +
    "                            <i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\" tooltip-placement=\"left\"\n" +
    "                               tooltip=\"{{'Admin.Stats.Time_Info' | translate}}\"></i>\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"\" ng-model=\"action.tempsTraitement\"\n" +
    "                                       type=\"checkbox\"> {{'Admin.Stats.Time' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\" style=\"margin-top: 10px; margin-bottom:30px;\">\n" +
    "                        <span style=\"margin-bottom:10px;\" class=\"btn btn-success force-display\" ng-disabled=\"!statistiques.$valid\" ng-click=\"updateChartData()\">\n" +
    "                            <i class=\"fa fa-eye\"></i>\n" +
    "                            {{'Admin.Stats.Generate' | translate}}\n" +
    "                        </span>\n" +
    "                    <span class=\"btn btn-info force-display\" ng-disabled=\"toHandle !== 0 || !hasStats\" ng-click=\"exportToCSV()\">\n" +
    "                            <i class=\"fa fa-download\"></i>\n" +
    "                            {{'Admin.Stats.Export' | translate}}\n" +
    "                        </span>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\">\n" +
    "        <div>\n" +
    "            <h2 style=\"display:inline-block\">{{'Admin.Stats.Result' | translate}}</h2>\n" +
    "\n" +
    "            <div class=\"text-info\" ng-if=\"moyenne\" style=\"float:right;margin-top:20px;\">\n" +
    "                <span class=\"fa fa-info-circle\"></span>\n" +
    "\n" +
    "                <p class=\"inline\">{{'Admin.Stats.Average' | translate}} : {{moyenne}}<br>\n" +
    "                    {{'Admin.Stats.E_Type' | translate}} : {{ecartType}}</p>\n" +
    "            </div>\n" +
    "\n" +
    "            <ul class=\"nav nav-tabs\" ng-if=\"searchReject && toHandle == 0\">\n" +
    "                <li class=\"active\"><a href=\"#courbe\" bs-tab><i class=\"fa fa-bar-chart-o\"></i> {{'Admin.Stats.Courbe' |\n" +
    "                    translate}}</a></li>\n" +
    "                <li><a ng-click=\"generateRejectTable()\" href=\"#rejets\" bs-tab><i class=\"fa fa-times-circle\"></i>\n" +
    "                    {{'Admin.Stats.Cause' | translate}}</a></li>\n" +
    "            </ul>\n" +
    "\n" +
    "            <div class=\"tab-content\">\n" +
    "                <div class='tab-pane active' id='courbe'>\n" +
    "                    <div ng-if=\"datalength > 0\" chart id=\"chartstat\" dataset=\"data\" cumul=\"savedCumul\"\n" +
    "                         datalength=\"datalength\"></div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class='tab-pane' id='rejets'>\n" +
    "                    <div>\n" +
    "                        <table class=\"table table-striped\" ng-table=\"tableParams\">\n" +
    "                            <tr ng-repeat=\"dossier in $data\">\n" +
    "                                <td data-title=\"'Admin.Stats.Title_Reject' | translate\" sortable=\"'title'\">\n" +
    "                                    {{dossier.title}}\n" +
    "                                </td>\n" +
    "                                <td data-title=\"'Admin.Stats.Emetteur_Reject' | translate\" sortable=\"'emetteur'\">\n" +
    "                                    {{(bureaux | findWithId:dossier.emetteur).title}}\n" +
    "                                </td>\n" +
    "                                <td data-title=\"'Admin.Stats.Reject_By' | translate\" sortable=\"'parapheur'\">\n" +
    "                                    {{(bureaux | findWithId:dossier.parapheur).title}}\n" +
    "                                </td>\n" +
    "                                <td data-title=\"'Admin.Stats.Date_Reject' | translate\" sortable=\"'date'\">\n" +
    "                                    {{dossier.date | texttodate | date:'dd/MM/yyyy à HH:mm'}}\n" +
    "                                </td>\n" +
    "                                <td data-title=\"'Admin.Stats.Cause_Reject' | translate\" ng-bind-html=\"dossier.cause\">\n" +
    "                                </td>\n" +
    "                            </tr>\n" +
    "                        </table>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"gettingStats\">\n" +
    "                    <span class=\"text text-info\">\n" +
    "                        {{'Admin.Stats.Getting_Info' | translate}}\n" +
    "                    </span>\n" +
    "            <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 120px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/tenants.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/tenants.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div>\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-3 adminContent\">\n" +
    "            <h2>Gestion des collectivités</h2>\n" +
    "            <div ng-if=\"!tenant.isEnabled\">\n" +
    "                <span class=\"text-info\"><i class=\"fa fa-info-circle\"></i> Le mode multi-collectivité est désactivé.</span>\n" +
    "            </div>\n" +
    "            <div class=\"form-horizontal row\" ng-if=\"tenant.isEnabled\">\n" +
    "                <div class=\"col-md-12\" style=\"margin-bottom:10px;\">\n" +
    "                    <div class=\"input-group\">\n" +
    "                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                        <input type=\"text\" placeholder=\"{{'Search' | translate}}\" ng-model=\"tenant.search\" class=\"unvalidate form-control\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-12 text-info\"><i class=\"fa fa-info-circle\"></i> Recherche sensible aux accents</div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <button value=\"\" class=\"btn btn-success\" ng-click=\"tenant.create()\" ng-disabled=\"tenant.isCreating\">\n" +
    "                        <i class=\"fa fa-plus-circle\"></i>\n" +
    "                        Ajouter une collectivité\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "            </div>\n" +
    "            <ul class=\"list-unstyled well nav nav-pills nav-stacked adminContent list-data\" ng-if=\"tenant.isEnabled\">\n" +
    "                <li ng-repeat=\"collectivite in tenant.list | filter:{tenantDomain:tenant.search} | orderBy:'tenantDomain'\" ng-class=\"tenant.selected.tenantDomain == collectivite.tenantDomain ? 'active' : ''\">\n" +
    "                    <a ng-click=\"tenant.select(collectivite)\">\n" +
    "                        <span class=\"label label-success\" ng-if=\"collectivite.enabled\">Activée</span>\n" +
    "                        <span class=\"label label-danger\" ng-if=\"!collectivite.enabled\">Désactivée</span>\n" +
    "                        <span style=\"display:inline-block; padding-right:50px;\">{{collectivite.tenantDomain}}</span>\n" +
    "                        <span style=\"right:50px; top:1px; position:absolute;\">\n" +
    "                            <span class=\"label label-warning pointer fa fa-refresh\" tooltip=\"Recharger les modèles de mail\" ng-click=\"$event.stopPropagation(); tenant.reloadMail(collectivite); \" ng-if=\"collectivite.enabled && !collectivite.modify && !collectivite.reloadMail && !tenant.isCreating\"> </span>\n" +
    "\n" +
    "                        </span>\n" +
    "                        <span style=\"right:15px; top:1px; position:absolute;\">\n" +
    "                            <span class=\"label label-success pointer fa fa-toggle-off\" tooltip=\"Activer\" ng-click=\"tenant.switchState(collectivite); $event.stopPropagation();\" ng-if=\"!collectivite.enabled && !collectivite.modify && !collectivite.reloadMail && !tenant.isCreating\"> </span>\n" +
    "                            <span class=\"label label-danger pointer fa fa-toggle-on\" tooltip=\"Désactiver\" ng-click=\"tenant.switchState(collectivite); $event.stopPropagation();\" ng-if=\"collectivite.enabled && !collectivite.modify && !collectivite.reloadMail && !tenant.isCreating\"> </span>\n" +
    "                            <span class=\"label label-info\" ng-if=\"collectivite.modify\">Modification...</span>\n" +
    "                            <span class=\"label label-info\" ng-if=\"collectivite.reloadMail\">Rechargement...</span>\n" +
    "                        </span>\n" +
    "                    </a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-9 adminContent text-warning\" ng-if=\"tenant.cantSelect\">\n" +
    "            <i class=\"fa fa-warning\"></i> Il faut que la collectivité soit activée pour pouvoir la sélectionner\n" +
    "        </div>\n" +
    "        <div ng-if=\"tenant.selected !== undefined\" class=\"col-md-9 adminContent\">\n" +
    "            <h2 ng-if=\"!tenant.selected.isNew\">Modifier la collectivité {{tenant.selected.tenantDomain}}\n" +
    "                <i ng-if=\"tenant.selected.enabled\" class=\"fa fa-toggle-on text-success\"  tooltip=\"Cette collectivité est activée.\"></i>\n" +
    "                <i ng-if=\"!tenant.selected.enabled\" class=\"fa fa-toggle-off text-danger\"  tooltip=\"Cette collectivité est désactivée.\"></i>\n" +
    "            </h2>\n" +
    "            <h2 ng-if=\"tenant.selected.isNew\">Ajout d'une collectivité</h2>\n" +
    "            <form role=\"form\" name='tenantForm' novalidate>\n" +
    "                <div class=\"well\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div ng-if=\"tenant.selected.isNew\">\n" +
    "                            <span class=\"text-info\"><i class=\"fa fa-info-circle\"></i> Ce formulaire va créer un \"espace client\" (ci-appelé \"tenant\") vide, activé par défaut.\n" +
    "Si appelé \"domaine\", il aura un compte administrateur nommé admin@domaine protégé par le mot de passe saisi dans ce formulaire.\n" +
    "NB: le nom de tenant ne doit pas comporter de majuscule, de caractère avec accent, ni espace ou caractère exotique ni de ponctuation.\n" +
    "Bonne pratique: Privilégier des noms simples de type domaine internet (exemple: collectivite.org)</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <div ng-if=\"tenant.selected.isNew\" class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"domainTenant\">Tenant (syntaxe de type FQDN, en minuscules)</label>\n" +
    "                                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> Obligatoire</span>\n" +
    "                                <input id=\"domainTenant\" ng-pattern=\"/^(?=^.{4,253}$)(^((?!-)[a-z0-9-]{0,62}[a-z0-9]\\.)?[a-z0-9-]{2,63}$)/i\" type=\"text\" class=\"form-control\" ng-model=\"tenant.edited.tenantDomain\" name=\"domainTenant\" required>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"tenant.selected.isNew\" class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"passwordTenant\">Mot de passe administrateur (compte admin@...)</label>\n" +
    "                                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> Obligatoire</span>\n" +
    "                                <input id=\"passwordTenant\" type=\"password\" class=\"form-control\" ng-model=\"password.newOne\" name=\"passwordTenant\" required>\n" +
    "                            </div>\n" +
    "                            <div ng-if=\"tenant.selected.isNew\" class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"confirmTenant\">Mot de passe (seconde saisie de confirmation)</label>\n" +
    "                                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> Obligatoire</span>\n" +
    "                                <input id=\"confirmTenant\" type=\"password\" class=\"form-control\" ng-model=\"password.confirm\" confirm-with=\"password\" name=\"confirmTenant\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"titleTenant\">Titre de l'organisation</label>\n" +
    "                                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> Obligatoire</span>\n" +
    "                                <input id=\"titleTenant\" type=\"text\" class=\"form-control\" ng-model=\"tenant.edited.title\" name=\"titleTenant\" required>\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group mandatory-group\">\n" +
    "                                <label for=\"descTenant\">Description</label>\n" +
    "                                <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> Obligatoire</span>\n" +
    "                                <input id=\"descTenant\" type=\"text\" class=\"form-control\" ng-model=\"tenant.edited.description\" name=\"descTenant\" required>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-4\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"sirenTenant\">SIREN</label>\n" +
    "                                <input id=\"sirenTenant\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"tenant.edited.siren\" name=\"sirenTenant\">\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"villeTenant\">Ville</label>\n" +
    "                                <input id=\"villeTenant\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"tenant.edited.city\" name=\"villeTenant\">\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"postTenant\">Code Postal</label>\n" +
    "                                <input id=\"postTenant\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"tenant.edited.postalCode\" name=\"postTenant\">\n" +
    "                            </div>\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"paysTenant\">Pays</label>\n" +
    "                                <input id=\"paysTenant\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"tenant.edited.country\" name=\"paysTenant\">\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div ng-if=\"!tenant.selected.isNew && tenant.selected.enabled\" class=\"col-md-4\">\n" +
    "                            <button ng-if=\"tenant.selected.enabled && !tenant.selected.hasDetails && !tenant.isGettingInfos\" value=\"\" class=\"btn btn-success force-display\" ng-click=\"tenant.infos()\"><i class=\"fa fa-bar-chart-o\"></i> Récupérer les statistiques de la collectivité</button>\n" +
    "                            <span ng-if=\"tenant.isGettingInfos\" class=\"text text-info\">Récupération des informations de la collectivité <b>{{tenant.isGettingInfos}}</b> en cours, merci de patienter...</span>\n" +
    "                            <div ng-if=\"tenant.selected.hasDetails\">\n" +
    "                                <h3>Détails de la collectivité</h3>\n" +
    "                                <ul>\n" +
    "                                    <li>Nombre d'utilisateurs : {{tenant.selected.people.length}}</li>\n" +
    "                                    <li>Nombre de bureaux : {{tenant.selected.bureaux.length}}</li>\n" +
    "                                    <li>Nombre de dossier : {{tenant.selected.dossiers.length}}</li>\n" +
    "                                    <li>Nombre de dossier à archiver : {{tenant.selected.dossiersAArchiver.length}} ({{tenant.selected.dossiersAArchiverDiskUsage}} octets)</li>\n" +
    "                                    <li>Utilisation disque : {{tenant.selected.diskUsage}} octets</li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <span ng-if=\"tenant.selected.modify && tenant.selected.isNew\"  style=\"position: relative; width: 0px; z-index: 2000000000; left: 25px; top: 13px;\" us-spinner=\"{radius:10, width:4, length: 8}\" ></span>\n" +
    "                            <button ng-click=\"tenant.save()\" ng-if=\"!(tenant.selected.modify && tenant.selected.isNew)\" ng-disabled=\"tenant.selected.modify || !tenantForm.$valid\" class=\"force-display btn btn-primary\"><i class=\"fa-floppy-o fa\"></i> Enregistrer</button>\n" +
    "                            <span ng-if=\"tenant.selected.modify && tenant.selected.isNew\" style=\"margin-left: 60px;\" class=\"text text-info\"><i class=\"fa fa-info-circle\"></i> Ajout de la collectivité en cours... ( ~1 minute )</span>\n" +
    "                            <button ng-if=\"!tenant.selected.isNew\" ng-click=\"tenant.changeAdminPassword()\" class=\"force-display btn btn-info\">\n" +
    "                                <i class=\"fa fa-lock\"></i>\n" +
    "                                Modifier le mot de passe administrateur</button>\n" +
    "                            <button ng-if=\"!tenant.selected.isNew\" ng-click=\"tenant.changePESProperties()\" class=\"force-display btn btn-warning\">\n" +
    "                                <i class=\"fa fa-pencil\"></i>\n" +
    "                                Modifier les propriétés PES</button>\n" +
    "                            <span ng-if=\"tenant.selected.modify && !tenant.selected.isNew\" class=\"text text-info\"><i class=\"fa fa-info-circle\"></i> Modification de la collectivité en cours...</span>\n" +
    "                            <span ng-if=\"tenant.selected.exist\" class=\"text text-danger\"><i class=\"fa fa-warning\"></i> Ce tenant existe déjà !</span>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/admin/typologie.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/typologie.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div class=\"col-md-4 adminContent\">\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-6\">\n" +
    "                <h2>{{'Admin.Typologie.Ty_Title' | translate}}</h2>\n" +
    "            </div>\n" +
    "            <div class=\"col-md-6\" style=\"margin-top:25px; text-align: right;\">\n" +
    "                <span ng-click=\"handler.types.create()\" class=\"btn btn-success\"><i class=\"fa fa-plus\"></i> {{'Admin.Typologie.Ty_Create' | translate}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"well\" style=\"margin-bottom: 0; padding-bottom: 0;\">\n" +
    "\n" +
    "            <div class=\"input-group\">\n" +
    "                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                <input placeholder=\"{{'Search' | translate}}\" ng-model=\"handler.types.searchValue\" ng-change=\"handler.types.search()\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div style=\"height:45px;\" ng-if=\"handler.types.maxSize < handler.types.total\">\n" +
    "                <span class=\"text-warning float-right\">\n" +
    "                    {{handler.types.page*handler.types.maxSize +1}}-{{(handler.types.page+1)*handler.types.maxSize < handler.types.total ? (handler.types.page+1)*handler.types.maxSize : handler.types.total}} {{'On' | translate}} {{handler.types.total}}\n" +
    "                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.types.page === 0\" ng-click=\"handler.types.pagine(-1)\"></span>\n" +
    "                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.types.page+1 >= (handler.types.total/handler.types.maxSize)\" ng-click=\"handler.types.pagine(1)\"></span>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "\n" +
    "            <abn-tree-types ng-cloak tree-data=\"handler.types.subList\"\n" +
    "                            on-select=\"handler.types.select(branch)\"\n" +
    "                            on-delete=\"handler.types.remove(branch)\"\n" +
    "                            on-create=\"handler.types.createSub(branch)\"\n" +
    "                            search=\"handler.types.searchValue\"\n" +
    "                            selection=\"simulateSelectType\"></abn-tree-types>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!empty(handler.types.selected)\" ng-cloak class=\"col-md-8\">\n" +
    "        <!-- detail type + sous-type -->\n" +
    "        <h2 ng-if=\"!handler.types.selected.isNew\">{{'Admin.Typologie.Ty_Edit' | translate}} {{handler.types.selected.id}}</h2>\n" +
    "        <h2 ng-if=\"handler.types.selected.isNew\">{{'Admin.Typologie.Ty_Create_Title' | translate}}</h2>\n" +
    "        <form role=\"form\" name='typeForm' novalidate>\n" +
    "            <div class=\"well\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Typologie.Ty_General' | translate}}</h3>\n" +
    "                        <div class=\"form-group mandatory-group\">\n" +
    "                            <label for=\"idType\">{{'Name' | translate}}</label>\n" +
    "                            <span ng-if=\"typeForm.idType.$error.pattern\" class=\"label label-danger\"><i\n" +
    "                                    class=\"fa fa-exclamation-circle\"></i> Interdits : ' \" &amp; > <</span>\n" +
    "                            <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                            <span class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Max : 28</span>\n" +
    "                            <span class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Min : 3</span>\n" +
    "                            <input id=\"idType\" type=\"text\" class=\"form-control\" ng-change=\"dashChanged=true\"\n" +
    "                                   ng-minlength=\"3\" ng-maxlength=\"28\" ng-model=\"handler.types.edited.id\" name=\"idType\"\n" +
    "                                   ng-pattern=\"/^[^\\'&quot;&amp;><]*$/\" required>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group mandatory-group\">\n" +
    "                            <label for=\"desc\">{{'Admin.Typologie.Ty_Desc' | translate}}</label>\n" +
    "                            <span ng-if=\"typeForm.desc.$error.pattern\" class=\"label label-danger\"><i\n" +
    "                                    class=\"fa fa-exclamation-circle\"></i> Interdits : ' \" &amp; > <</span>\n" +
    "                            <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                            <span class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Min : 3</span>\n" +
    "                            <input id=\"desc\" type=\"text\" class=\"form-control\" ng-change=\"dashChanged=true\"\n" +
    "                                   ng-minlength=\"3\" ng-model=\"handler.types.edited.desc\" name=\"desc\"\n" +
    "                                   ng-pattern=\"/^[^\\'&quot;&amp;><]*$/\" required>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Typologie.Ty_Tdt' | translate}}</h3>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"tdtNom\">{{'Name' | translate}}</label>\n" +
    "                            <select id=\"tdtNom\" class=\"form-control unvalidate\" ng-change=\"dashChanged=true\" ng-model=\"handler.types.edited.tdtNom\" name=\"tdtNom\" required>\n" +
    "                                <option value=\"pas de TdT\">{{'pas de TdT' | translate}}</option>\n" +
    "                                <option ng-value=\"el.value\" ng-repeat=\"el in tdtNomOptions\">{{el.key}}</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"tdtProtocole\">{{'Admin.Typologie.Ty_Protocol' | translate}}</label>\n" +
    "                            <select ng-change=\"handler.types.changeProtocol()\" id=\"tdtProtocole\"\n" +
    "                                    class=\"form-control unvalidate\"\n" +
    "                                    ng-model=\"handler.types.edited.tdtProtocole\" name=\"tdtProtocole\" required>\n" +
    "                                <option ng-value=\"el.value\" ng-repeat=\"el in tdtProtocoleOptions\">{{el.key}}</option>\n" +
    "                                <option value=\"aucun\">{{'None' | translate}}</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Typologie.Ty_Format' | translate}}</h3>\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"sig_format\">{{'Admin.Typologie.Ty_Format' | translate}}</label>\n" +
    "                            <select ng-if=\"handler.types.edited.tdtProtocole != 'ACTES'\" id=\"sig_format\"\n" +
    "                                    class=\"form-control unvalidate\" ng-change=\"dashChanged=true\"\n" +
    "                                    ng-model=\"handler.types.edited.sigFormat\" name=\"sig_format\" required\n" +
    "                                    ng-disabled=\"handler.types.edited.tdtProtocole != 'aucun'\">\n" +
    "                                <option value=\"AUTO\">-- Sélection automatique --</option>\n" +
    "                                <option ng-if=\"properties['parapheur.admin.signature.pkcs1.show'] == 'true'\" value=\"PKCS#1/sha256\">PKCS#1 (compatible EBICS-TS)</option>\n" +
    "                                <option value=\"PKCS#7/single\">PKCS#7 simple (compatible ACTES)</option>\n" +
    "                                <option ng-if=\"properties['parapheur.admin.signature.pkcs7aio.show'] == 'true'\" value=\"PKCS#7/multiple\">PKCS#7 all-in-one</option>\n" +
    "                                <!--  option value=\"CAdES/basic\">CAdES profil de base</option -->\n" +
    "                                <option value=\"PAdES/basic\">PAdES profil ISO32000-1 (signature de PDF)</option>\n" +
    "                                <option value=\"PAdES/basicCertifie\">PAdES profil ISO32000-1 (verrouille le PDF après signature)</option>\n" +
    "                                <option value=\"XAdES/enveloped\">XAdES enveloppée (PESv2 HELIOS)</option>\n" +
    "                                <option ng-if=\"properties['parapheur.admin.signature.xadesdia.show'] == 'true'\" value=\"XAdES/DIA\">XAdES pour DIA</option>\n" +
    "                                <option ng-if=\"properties['parapheur.admin.signature.xadesdet.show'] == 'true'\" value=\"XAdES/detached\">XAdES détachée</option>\n" +
    "                                <option ng-if=\"properties['parapheur.admin.signature.xadesecd.show'] == 'true'\" value=\"XAdES132/detached\">XAdES 1.3.2 détachée (compatible ANTS-ECD)</option>\n" +
    "                                <!-- option value=\"XAdES-T/enveloped\">XAdES-T enveloppée</option  -->\n" +
    "                            </select>\n" +
    "\n" +
    "                            <select ng-if=\"handler.types.edited.tdtProtocole == 'ACTES'\" id=\"sig_format\"\n" +
    "                                    class=\"form-control unvalidate\" ng-change=\"dashChanged=true\"\n" +
    "                                    ng-model=\"handler.types.edited.sigFormat\" name=\"sig_format\" required>\n" +
    "                                <option value=\"PKCS#7/single\">PKCS#7 simple (compatible ACTES)</option>\n" +
    "                                <option value=\"PAdES/basic\">PAdES profil ISO32000-1 (signature de PDF)</option>\n" +
    "                                <option value=\"PAdES/basicCertifie\">PAdES profil ISO32000-1 (verrouille le PDF après signature)</option>\n" +
    "                            </select>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col-md-6\" ng-if=\"handler.types.showOverrideButton()\">\n" +
    "                        <h3>{{'Admin.Typologie.Ty_Override' | translate}}</h3>\n" +
    "                        <div ng-if=\"!handler.types.edited.isNew\">\n" +
    "                            <div ng-if=\"handler.types.showOverrideRadio()\">\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"overTrue\">\n" +
    "                                        <input class=\"unvalidate\" id=\"overTrue\" ng-model=\"handler.types.edited.tdtOverride\" type=\"radio\" value=\"true\" name=\"overrideTdt\" required>{{'Admin.Typologie.Ty_Enable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"radio\">\n" +
    "                                    <label for=\"overFalse\">\n" +
    "                                        <input class=\"unvalidate\" id=\"overFalse\" ng-model=\"handler.types.edited.tdtOverride\" type=\"radio\" value=\"false\" name=\"overrideTdt\" required>{{'Admin.Typologie.Ty_Disable' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <button ng-click=\"handler.types.launchOverride()\" class=\"btn btn-info col-md-12 force-display\">\n" +
    "                                <i class=\"fa\" ng-class=\"handler.types.getOverrideButtonIcon()\"></i>\n" +
    "                                {{handler.types.getOverrideButtonName()}}\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div ng-if=\"handler.types.edited.isNew\">\n" +
    "                            <p class=\"text-danger\"> {{'Admin.Typologie.Ty_Not_Created' | translate}}</p>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <button ng-if=\"!handler.types.edited.isNew\" ng-click=\"handler.types.update()\" type=\"submit\" class=\"btn btn-primary\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <button ng-if=\"handler.types.edited.isNew\" ng-click=\"handler.types.save()\" type=\"submit\" class=\"btn btn-primary\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <button type=\"submit\" class=\"btn btn-primary\" disabled>\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <span ng-if=\"handler.types.errorType != undefined\" class=\"text-danger\">\n" +
    "                        <i class=\"fa fa-warning\"></i>\n" +
    "                        {{handler.types.errorType}}\n" +
    "                    </span>\n" +
    "                    <span style=\"position: relative; margin-left: 30px;\"  ng-if=\"handler.types.saving\">\n" +
    "                        <span us-spinner=\"{radius:10, width:4, length: 8}\"></span>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div ng-if=\"!empty(handler.types.selectedSubtype)\" ng-cloak class=\"col-md-8\">\n" +
    "        <!-- detail sous-type -->\n" +
    "        <h2 ng-if=\"!!handler.types.selectedSubtype.id\">{{'Admin.Typologie.Ty_Sub_Title' | translate}} {{handler.types.selectedSubtype.id}}</h2>\n" +
    "        <h2 ng-if=\"!handler.types.selectedSubtype.id\">{{'Admin.Typologie.Ty_Sub_Create_Title' | translate}}</h2>\n" +
    "        <form role=\"form\" name='sousTypeForm' novalidate>\n" +
    "            <div class=\"well\">\n" +
    "                <ul class=\"nav nav-tabs\">\n" +
    "                    <li class=\"active\"><a href=\"#general\" bs-tab><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_General' | translate}}</a></li>\n" +
    "                    <li><a href=\"#permissions\" bs-tab><i class=\"fa fa-ban\"></i> {{'Admin.Typologie.Ty_Sub_PermCreate' | translate}}</a></li>\n" +
    "                    <li><a href=\"#permissionsFilters\" bs-tab><i class=\"fa fa-eye\"></i> {{'Admin.Typologie.Ty_Sub_PermSee' | translate}}</a></li>\n" +
    "                    <li><a href=\"#circuit\" bs-tab><i class=\"fa fa-road\"></i> {{'Admin.Typologie.Ty_Sub_Wo' | translate}}</a></li>\n" +
    "                    <li><a href=\"#metadonnees\" bs-tab><i class=\"fa fa-code\"></i> {{'Admin.Typologie.Ty_Sub_Meta' | translate}}</a></li>\n" +
    "                    <li><a href=\"#calques\" bs-tab><i class=\"fa fa-clone\"></i> {{'Admin.Typologie.Ty_Sub_Cal' | translate}}</a></li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <div class=\"tab-content\">\n" +
    "                    <div class='tab-pane active' id='general'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <h3>{{'Admin.Typologie.Ty_Sub_Sub' | translate}} \"{{handler.types.selectedSubtype.parent}}\"</h3>\n" +
    "                                    <div class=\"form-group mandatory-group\">\n" +
    "                                        <label for=\"idSousType\">{{'Name' | translate}}</label>\n" +
    "                                        <span ng-if=\"sousTypeForm.idSousType.$error.pattern\" class=\"label label-danger\"><i\n" +
    "                                                class=\"fa fa-exclamation-circle\"></i> Interdits : ' \" &amp; > <</span>\n" +
    "                                        <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                        <span class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Min : 2</span>\n" +
    "                                        <input id=\"idSousType\" type=\"text\" class=\"form-control\" ng-minlength=\"2\"\n" +
    "                                               ng-model=\"handler.types.editedSubtype.id\" name=\"idSousType\"\n" +
    "                                               ng-pattern=\"/^[^\\'&quot;&amp;><]*$/\" required>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"form-group mandatory-group\">\n" +
    "                                        <label for=\"descSousType\">{{'Description' | translate}}</label>\n" +
    "                                        <span ng-if=\"sousTypeForm.descSousType.$error.pattern\"\n" +
    "                                              class=\"label label-danger\"><i class=\"fa fa-exclamation-circle\"></i> Interdits : ' \" &amp; > <</span>\n" +
    "                                        <span class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                        <span class=\"label label-info\"><i class=\"fa fa-info-circle\"></i> Min : 2</span>\n" +
    "                                        <input id=\"descSousType\" type=\"text\" class=\"form-control\" ng-minlength=\"2\"\n" +
    "                                               ng-model=\"handler.types.editedSubtype.desc\" name=\"descSousType\"\n" +
    "                                               ng-pattern=\"/^[^\\'&quot;&amp;><]*$/\" required>\n" +
    "                                    </div>\n" +
    "                                    <h3>{{'Admin.Typologie.Ty_Sub_Opt' | translate}}</h3>\n" +
    "                                    <div class=\"checkbox\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.digitalSignatureMandatory\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_SigMand' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"checkbox\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.readingMandatory\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_ReadMand' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"checkbox\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.includeAttachments\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_PJ' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"checkbox\" ng-if=\"isAcceptingMultidoc()\">\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.multiDocument\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_µdoc' | translate}} <i class=\"fa fa-question-circle\" tooltip=\"{{'Admin.Typologie.Ty_Sub_µdoc_info' | translate}}\"></i>\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                    <div class=\"checkbox\" ng-if=\"isAcceptingAttest() && properties['parapheur.ihm.attest.show'] == 'true'\" >\n" +
    "                                        <label>\n" +
    "                                            <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.hasToAttest\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_Attest' | translate}}\n" +
    "                                        </label>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='tab-pane' id='permissions'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <h3>{{'Admin.Typologie.Ty_Sub_PermCreate' | translate}}</h3>\n" +
    "                                <div class=\"checkbox\">\n" +
    "                                    <label>\n" +
    "                                        <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.visibility\" type=\"checkbox\" ng-false-value=\"private\" ng-true-value=\"public\"> {{'Admin.Typologie.Ty_Sub_Public' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-12 no-padding\">\n" +
    "                                    <div class=\"row\" ng-if=\"handler.types.editedSubtype.visibility !== 'public'\">\n" +
    "                                        <div class=\"form-group col-md-4 no-padding\">\n" +
    "                                            <div class=\"col-md-12\">\n" +
    "                                                <h4>{{'Admin.Typologie.Ty_Sub_Desks' | translate}}</h4>\n" +
    "                                                <div>\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                                        <input placeholder=\"{{'Search' | translate}}\" ng-model=\"handler.bureaux.searchValue\" ng-change=\"handler.bureaux.search()\" class=\"form-control unvalidate\" type=\"text\" ng-enter=\"handler.bureaux.search()\">\n" +
    "                                                    </div>\n" +
    "\n" +
    "                                                    <div style=\"height:15px;\" ng-if=\"handler.bureaux.maxSize < handler.bureaux.total\">\n" +
    "                                                <span class=\"text-warning float-right\">\n" +
    "                                                    {{handler.bureaux.page*handler.bureaux.maxSize +1}}-{{(handler.bureaux.page+1)*handler.bureaux.maxSize < handler.bureaux.total ? (handler.bureaux.page+1)*handler.bureaux.maxSize : handler.bureaux.total}} {{'On' | translate}} {{handler.bureaux.total}}\n" +
    "                                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.bureaux.page === 0\" ng-click=\"handler.bureaux.pagine(-1)\"></span>\n" +
    "                                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.bureaux.page+1 >= (handler.bureaux.total/handler.bureaux.maxSize)\" ng-click=\"handler.bureaux.pagine(1)\"></span>\n" +
    "                                                </span>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <span class=\"text-info\" ng-if=\"handler.bureaux.total === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_No_Result' | translate}}</span>\n" +
    "                                            <span class=\"text-info\" ng-if=\"handler.bureaux.subListForCreation.length === 0 && handler.bureaux.total > 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Desks_Sel_All' | translate}}</span>\n" +
    "                                            <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas col-md-12 no-margin\">\n" +
    "                                                <li ng-repeat=\"bureau in handler.bureaux.subList\" ng-switch on=\"handler.types.editedSubtype.parapheurs.indexOf(bureau.id)\">\n" +
    "                                                    <a ng-click=\"handler.bureaux.selectForCreation(bureau)\" ng-switch-when=\"-1\">\n" +
    "                                                        <i class=\"fa fa-plus-circle text-success\"></i> {{bureau.name}}\n" +
    "                                                    </a>\n" +
    "                                                    <a class=\"disabled\" ng-switch-default>\n" +
    "                                                        {{bureau.name}}\n" +
    "                                                    </a>\n" +
    "                                                </li>\n" +
    "                                            </ul>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <div class=\"form-group col-md-4 no-padding\">\n" +
    "                                            <div class=\"col-md-12\">\n" +
    "                                                <h4>{{'Admin.Typologie.Ty_Sub_Gr' | translate}}</h4>\n" +
    "                                                <div>\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                                        <input placeholder=\"{{'Search' | translate}}\" ng-model=\"handler.groupes.searchValue\" ng-change=\"handler.groupes.search()\" class=\"form-control unvalidate\" type=\"text\" ng-enter=\"handler.groupes.search()\">\n" +
    "                                                    </div>\n" +
    "\n" +
    "                                                    <div style=\"height:15px;\" ng-if=\"handler.groupes.maxSize < handler.groupes.total\">\n" +
    "                                                    <span class=\"text-warning float-right\">\n" +
    "                                                        {{handler.groupes.page*handler.groupes.maxSize +1}}-{{(handler.groupes.page+1)*handler.groupes.maxSize < handler.groupes.total ? (handler.groupes.page+1)*handler.groupes.maxSize : handler.groupes.total}} sur {{handler.groupes.total}}\n" +
    "                                                        <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.groupes.page === 0\" ng-click=\"handler.groupes.pagine(-1)\"></span>\n" +
    "                                                        <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.groupes.page+1 >= (handler.groupes.total/handler.groupes.maxSize)\" ng-click=\"handler.groupes.pagine(1)\"></span>\n" +
    "                                                    </span>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "\n" +
    "                                            <span class=\"text-info\" ng-if=\"handler.groupes.total === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_No_Result' | translate}}</span>\n" +
    "                                            <span class=\"text-info\" ng-if=\"handler.groupes.subListForCreation.length === 0 && handler.groupes.total > 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Gr_Sel_All' | translate}}</span>\n" +
    "                                            <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas col-md-12 no-margin\">\n" +
    "                                                <li ng-repeat=\"group in handler.groupes.subList\" ng-switch on=\"handler.types.editedSubtype.groups.indexOf(group.id)\">\n" +
    "                                                    <a ng-click=\"handler.groupes.selectForCreation(group)\" ng-switch-when=\"-1\">\n" +
    "                                                        <i class=\"fa fa-plus-circle text-success\"></i> {{group.shortName}}\n" +
    "                                                    </a>\n" +
    "                                                    <a class=\"disabled\" ng-switch-default>\n" +
    "                                                        {{group.shortName}}\n" +
    "                                                    </a>\n" +
    "                                                </li>\n" +
    "                                            </ul>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <div class=\"col-md-4\">\n" +
    "                                            <h3>{{'Admin.Typologie.Ty_Sub_Desks_Sel' | translate}}</h3>\n" +
    "                                            <span ng-if=\"handler.types.editedSubtype.parapheurs.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Desks_None' | translate}}</span>\n" +
    "                                            <ul class=\"list-unstyled pointer\">\n" +
    "                                                <li class=\"hover-li\" ng-click=\"handler.bureaux.unselectForCreation(bureau.id)\" ng-repeat=\"bureau in (handler.bureaux.list() | sameId:handler.types.editedSubtype.parapheurs)\"><i class=\"text-danger fa fa-times-circle\"></i> {{bureau.name}}</li>\n" +
    "                                            </ul>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <div class=\"col-md-4\">\n" +
    "                                            <h3>{{'Admin.Typologie.Ty_Sub_Gr_Sel' | translate}}</h3>\n" +
    "                                            <span ng-if=\"handler.types.editedSubtype.groups.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Gr_None' | translate}}</span>\n" +
    "                                            <ul class=\"list-unstyled pointer\">\n" +
    "                                                <li class=\"hover-li\" ng-click=\"handler.groupes.unselectForCreation(group.id)\" ng-repeat=\"group in (handler.groupes.list() | sameId:handler.types.editedSubtype.groups)\"><i class=\"text-danger fa fa-times-circle\"></i> {{group.shortName}}</li>\n" +
    "                                            </ul>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='tab-pane' id='permissionsFilters'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <h3>{{'Admin.Typologie.Ty_Sub_PermSee' | translate}}</h3>\n" +
    "                                <div class=\"checkbox\">\n" +
    "                                    <label>\n" +
    "                                        <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.visibilityFilter\" type=\"checkbox\" ng-false-value=\"private\" ng-true-value=\"public\"> {{'Admin.Typologie.Ty_Sub_Public' | translate}}\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-12 no-padding\">\n" +
    "\n" +
    "                                    <div ng-if=\"handler.types.editedSubtype.visibilityFilter !== 'public'\" class=\"form-group col-md-4 no-padding\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <h4>{{'Admin.Typologie.Ty_Sub_Desks' | translate}}</h4>\n" +
    "                                            <div>\n" +
    "                                                <div class=\"input-group\">\n" +
    "                                                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                                    <input placeholder=\"{{'Search' | translate}}\" ng-model=\"handler.bureaux.searchValue\" ng-change=\"handler.bureaux.search()\" class=\"form-control unvalidate\" type=\"text\" ng-enter=\"handler.bureaux.search()\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div style=\"height:15px;\" ng-if=\"handler.bureaux.maxSize < handler.bureaux.total\">\n" +
    "                                                <span class=\"text-warning float-right\">\n" +
    "                                                    {{handler.bureaux.page*handler.bureaux.maxSize +1}}-{{(handler.bureaux.page+1)*handler.bureaux.maxSize < handler.bureaux.total ? (handler.bureaux.page+1)*handler.bureaux.maxSize : handler.bureaux.total}} sur {{handler.bureaux.total}}\n" +
    "                                                    <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.bureaux.page === 0\" ng-click=\"handler.bureaux.pagine(-1)\"></span>\n" +
    "                                                    <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.bureaux.page+1 >= (handler.bureaux.total/handler.bureaux.maxSize)\" ng-click=\"handler.bureaux.pagine(1)\"></span>\n" +
    "                                                </span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <span class=\"text-info\" ng-if=\"handler.bureaux.total === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_No_Result' | translate}}</span>\n" +
    "                                        <span class=\"text-info\" ng-if=\"handler.bureaux.subListForFilter.length === 0 && handler.bureaux.total > 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Desks_Sel_All' | translate}}</span>\n" +
    "                                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas col-md-12 no-margin\">\n" +
    "                                            <li ng-repeat=\"bureau in handler.bureaux.subList\" ng-switch on=\"handler.types.editedSubtype.parapheursFilters.indexOf(bureau.id)\">\n" +
    "                                                <a ng-click=\"handler.bureaux.selectForFilter(bureau)\" ng-switch-when=\"-1\">\n" +
    "                                                    <i class=\"fa fa-plus-circle text-success\"></i> {{bureau.name}}\n" +
    "                                                </a>\n" +
    "                                                <a class=\"disabled\" ng-switch-default>\n" +
    "                                                    {{bureau.name}}\n" +
    "                                                </a>\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                    <div ng-if=\"handler.types.editedSubtype.visibilityFilter !== 'public'\" class=\"form-group col-md-4 no-padding\">\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <h4>{{'Admin.Typologie.Ty_Sub_Gr' | translate}}</h4>\n" +
    "                                            <div>\n" +
    "                                                <div class=\"input-group\">\n" +
    "                                                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                                    <input placeholder=\"{{'Search' | translate}}\" ng-model=\"handler.groupes.searchValue\" ng-change=\"handler.groupes.search()\" class=\"form-control unvalidate\" type=\"text\" ng-enter=\"handler.groupes.search()\">\n" +
    "                                                </div>\n" +
    "\n" +
    "                                                <div style=\"height:15px;\" ng-if=\"handler.groupes.maxSize < handler.groupes.total\">\n" +
    "                                                    <span class=\"text-warning float-right\">\n" +
    "                                                        {{handler.groupes.page*handler.groupes.maxSize +1}}-{{(handler.groupes.page+1)*handler.groupes.maxSize < handler.groupes.total ? (handler.groupes.page+1)*handler.groupes.maxSize : handler.groupes.total}} sur {{handler.groupes.total}}\n" +
    "                                                        <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.groupes.page === 0\" ng-click=\"handler.groupes.pagine(-1)\"></span>\n" +
    "                                                        <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.groupes.page+1 >= (handler.groupes.total/handler.groupes.maxSize)\" ng-click=\"handler.groupes.pagine(1)\"></span>\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <span class=\"text-info\" ng-if=\"handler.groupes.total === 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_No_Result' | translate}}</span>\n" +
    "                                        <span class=\"text-info\" ng-if=\"handler.groupes.subListForFilter.length === 0 && handler.groupes.total > 0\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Gr_Sel_All' | translate}}</span>\n" +
    "                                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas col-md-12 no-margin\">\n" +
    "                                            <li ng-repeat=\"group in handler.groupes.subList\" ng-switch on=\"handler.types.editedSubtype.groupsFilters.indexOf(group.id)\">\n" +
    "                                                <a ng-click=\"handler.groupes.selectForFilter(group)\" ng-switch-when=\"-1\">\n" +
    "                                                    <i class=\"fa fa-plus-circle text-success\"></i> {{group.shortName}}\n" +
    "                                                </a>\n" +
    "                                                <a class=\"disabled\" ng-switch-default>\n" +
    "                                                    {{group.shortName}}\n" +
    "                                                </a>\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "\n" +
    "                                    <div ng-if=\"handler.types.editedSubtype.visibilityFilter !== 'public'\" class=\"col-md-4\">\n" +
    "                                        <h3>{{'Admin.Typologie.Ty_Sub_Desks_Sel' | translate}}</h3>\n" +
    "                                        <span ng-if=\"handler.types.editedSubtype.parapheursFilters.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Desks_None' | translate}}</span>\n" +
    "                                        <ul class=\"list-unstyled pointer\">\n" +
    "                                            <li class=\"hover-li\" ng-click=\"handler.bureaux.unselectForFilter(bureau.id)\" ng-repeat=\"bureau in (handler.bureaux.list() | sameId:handler.types.editedSubtype.parapheursFilters)\"><i class=\"text-danger fa fa-times-circle\"></i> {{bureau.name}}</li>\n" +
    "                                        </ul>\n" +
    "                                        <h3>{{'Admin.Typologie.Ty_Sub_Gr_Sel' | translate}}</h3>\n" +
    "                                        <span ng-if=\"handler.types.editedSubtype.groupsFilters.length === 0\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Gr_None' | translate}}</span>\n" +
    "                                        <ul class=\"list-unstyled pointer\">\n" +
    "                                            <li class=\"hover-li\" ng-click=\"handler.groupes.unselectForFilter(group.id)\" ng-repeat=\"group in (handler.groupes.list() | sameId:handler.types.editedSubtype.groupsFilters)\"><i class=\"text-danger fa fa-times-circle\"></i> {{group.shortName}}</li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='tab-pane' id='circuit'>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"row\">\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <div class=\"form-group\">\n" +
    "                                        <label for=\"searchCircuit\" class=\"control-label legendLabel\">{{'Admin.Typologie.Ty_Sub_Wo_Sel' | translate}}</label>\n" +
    "\n" +
    "                                        <div class=\"row\">\n" +
    "                                            <div class=\"col-md-12\">\n" +
    "                                                <div>\n" +
    "                                                    <div class=\"input-group\">\n" +
    "                                                        <input placeholder=\"{{'Search' | translate}}\" name=\"searchCircuit\" id=\"searchCircuit\" ng-model=\"searchCircuit\" class=\"form-control unvalidate\" type=\"text\">\n" +
    "                                                        <span class=\"input-group-btn\">\n" +
    "                                                            <button class=\"btn btn-success force-display\" ng-click=\"handler.circuits.search(searchCircuit)\" type=\"submit\">\n" +
    "                                                                <i class=\"fa fa-search\"></i>\n" +
    "                                                                {{'Find' | translate}}\n" +
    "                                                            </button>\n" +
    "                                                        </span>\n" +
    "                                                    </div>\n" +
    "                                                    <div style=\"height:35px;\" ng-if=\"handler.circuits.total != handler.circuits.list.length\">\n" +
    "                                                        <span class=\"text-warning float-right\">\n" +
    "                                                            {{handler.circuits.page*handler.circuits.maxSize +1}}-{{(handler.circuits.page+1)*handler.circuits.maxSize < handler.circuits.total ? (handler.circuits.page+1)*handler.circuits.maxSize : handler.circuits.total}} sur {{handler.circuits.total}}\n" +
    "                                                            <span class=\"btn btn-default fa fa-chevron-left force-display\" ng-disabled=\"handler.circuits.page === 0\" ng-click=\"handler.circuits.pagine(-1)\"></span>\n" +
    "                                                            <span class=\"btn btn-default fa fa-chevron-right force-display\" ng-disabled=\"handler.circuits.page+1 >= (handler.circuits.total/handler.circuits.maxSize)\" ng-click=\"handler.circuits.pagine(1)\"></span>\n" +
    "                                                        </span>\n" +
    "                                                    </div>\n" +
    "                                                    <span ng-if=\"handler.circuits.pagedList.length > 0 && handler.circuits.pagedList[0].length === 0\" class=\"text-info\">\n" +
    "                                                        <i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_No_Result' | translate}}\n" +
    "                                                    </span>\n" +
    "                                                </div>\n" +
    "                                                <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\" style=\"margin-top: 0px\">\n" +
    "                                                    <li ng-repeat=\"circuit in handler.circuits.list\">\n" +
    "                                                        <a ng-click=\"circuit.name === handler.types.editedSubtype.circuit ? handler.circuits.select() : handler.circuits.select(circuit)\">\n" +
    "                                                            <i ng-if=\"circuit.name === handler.types.editedSubtype.circuit\" class=\"fa fa-dot-circle-o text-success\"></i><i ng-if=\"circuit.name !== handler.types.editedSubtype.circuit\" style=\"width: 13px;display:inline-block;\"></i> {{circuit.name}}\n" +
    "                                                        </a>\n" +
    "                                                    </li>\n" +
    "                                                </ul>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                        <div class=\"col-md-12\" ng-if=\"handler.types.hasCachet() && handler.types.canCachet()\">\n" +
    "                                            <hr/>\n" +
    "                                            <div class=\"form-group mandatory-group\">\n" +
    "                                                <label for=\"cachetCert\">Certificat de cachet serveur</label>\n" +
    "                                                <span ng-if=\"!!handler.types.editedSubtype.circuit\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                                <select id=\"cachetCert\" class=\"form-control\"\n" +
    "                                                        ng-model=\"handler.types.editedSubtype.cachetCertificate\" name=\"cachetCert\"\n" +
    "                                                        ng-options=\"cert.id as cert.title for cert in cachetCerts\"\n" +
    "                                                        ng-required=\"!!handler.types.editedSubtype.circuit\">\n" +
    "                                                    <option></option>\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                            <div class=\"col-md-12 checkbox\">\n" +
    "                                                <label>\n" +
    "                                                    <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.isCachetAuto\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\">\n" +
    "                                                    Étape de cachet serveur automatique\n" +
    "                                                </label>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                        <div class=\"col-md-12\" ng-if=\"handler.types.hasPastellMailsec()\">\n" +
    "                                            <hr/>\n" +
    "                                            <div class=\"form-group mandatory-group\">\n" +
    "                                                <label for=\"mailsecPastell\">Connecteur Mail-sécurisé Pastell</label>\n" +
    "                                                <span ng-if=\"!!handler.types.editedSubtype.circuit\" class=\"label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "                                                <select id=\"mailsecPastell\" class=\"form-control\"\n" +
    "                                                        ng-model=\"handler.types.editedSubtype.pastellMailsec\" name=\"mailsecPastell\"\n" +
    "                                                        ng-options=\"conn.id as conn.title for conn in pastellMailsec\"\n" +
    "                                                        ng-required=\"!!handler.types.editedSubtype.circuit\">\n" +
    "                                                    <option></option>\n" +
    "                                                </select>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <div class=\"col-md-12\">\n" +
    "                                        {{'Admin.Typologie.Ty_Sub_Wo_Selected' | translate}} :\n" +
    "                                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                            <li ng-if=\"!!handler.types.editedSubtype.circuit\">\n" +
    "                                                <a ng-click=\"handler.circuits.select()\">\n" +
    "                                                    <i class=\"fa fa-times-circle text-danger\"></i> {{handler.types.editedSubtype.circuit}}\n" +
    "                                                </a>\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                        <div ng-if=\"!handler.types.editedSubtype.circuit\" class=\"text-info\">\n" +
    "                                            <i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Wo_None' | translate}}\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div ng-if=\"!handler.types.editedSubtype.circuit\" class=\"col-md-12\">\n" +
    "                                        <span class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Admin.Typologie.Ty_Sub_Wo_None_Info' | translate}}</span>\n" +
    "                                        <div class=\"col-md-12\">\n" +
    "                                            <div ui-ace=\"{\n" +
    "                                                  useWrapMode : true,\n" +
    "                                                  showGutter: true,\n" +
    "                                                  theme:'twilight',\n" +
    "                                                  mode: 'groovy'\n" +
    "                                            }\" ng-model=\"handler.types.editedSubtype.script\" style=\"height:400px;\"></div>\n" +
    "                                        </div>\n" +
    "                                    </div>\n" +
    "                                    <div ng-if=\"handler.types.editedSubtype.circuit\" class=\"col-md-12\">\n" +
    "                                        <h3>{{'Admin.Typologie.Ty_Sub_Wo_Step' | translate}}</h3>\n" +
    "                                        <ul class=\"list-unstyled\">\n" +
    "                                            <li ng-repeat=\"etape in handler.circuits.selected.etapes\">\n" +
    "                                                <span class=\"action\" ng-switch=\"etape.actionDemandee.toLowerCase()\">\n" +
    "                                                    <i tooltip=\"Visa\" ng-switch-when=\"visa\" class=\"fa fa-check-square-o\"></i>\n" +
    "                                                    <i tooltip=\"Signature\" ng-switch-when=\"signature\" class=\"fa ls-signature\"></i>\n" +
    "                                                    <i tooltip=\"Mail sécurisé Pastell\" ng-switch-when=\"mailsecpastell\" class=\"fa fa-envelope-o\"></i>\n" +
    "                                                    <i tooltip=\"Mail sécurisé S²LOW\" ng-switch-when=\"mailsec\" class=\"fa fa-envelope\"></i>\n" +
    "                                                    <i tooltip=\"Télé-transmission\" ng-switch-when=\"tdt\" class=\"fa fa-cloud-upload\"></i>\n" +
    "                                                    <i tooltip=\"Cachet serveur\" ng-switch-when=\"cachet\" class=\"fa ls-stamp\"></i>\n" +
    "                                                    <i tooltip=\"Fin de circuit\" ng-switch-when=\"archivage\" class=\"fa fa-flag-checkered\"></i>\n" +
    "                                                </span>\n" +
    "                                                <span ng-if=\"!etape.parapheur\">\n" +
    "                                                    {{(etape.transition | translate) + \"...\"}}\n" +
    "                                                </span>\n" +
    "                                                <span ng-if=\"!!etape.parapheur\">\n" +
    "                                                    {{etape.parapheurName}}\n" +
    "                                                </span>\n" +
    "                                            </li>\n" +
    "                                        </ul>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <div class=\"col-md-12 checkbox\" ng-if=\"handler.types.getProtocol() === 'HELIOS'\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-model=\"handler.types.editedSubtype.isTdtAuto\" ng-true-value=\"true\" ng-false-value=\"false\" type=\"checkbox\">\n" +
    "                                Étape d'envoi au TdT automatique\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class='tab-pane' id='metadonnees'>\n" +
    "                        <div class=\"col-md-12 no-padding\" ng-if=\"!isMetaInited\">\n" +
    "                            <span class=\"text text-info\">Chargement des metadonnées en cours ...</span>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12 no-padding\" ng-if=\"isMetaInited\">\n" +
    "                            <div class=\"col-md-12\">\n" +
    "                                <h3>{{'Admin.Typologie.Ty_Sub_Meta' | translate}}</h3>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Meta_Avail' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"(handler.metadonnees.list() | notSameIdInArray:handler.types.editedSubtype.metadatas).length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None_f' | translate}}</span>\n" +
    "                                    <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                        <li ng-repeat=\"meta in (handler.metadonnees.list() | notSameIdInArray:handler.types.editedSubtype.metadatas)\">\n" +
    "                                            <a ng-click=\"handler.types.addMetadata(meta)\">\n" +
    "                                                <i class=\"fa fa-plus-circle text-success\"></i>\n" +
    "                                                {{meta.name}}\n" +
    "                                            </a>\n" +
    "\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Meta_Actual' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"handler.types.editedSubtype.metadatas.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None_f' | translate}}</span>\n" +
    "                                    <div ng-repeat=\"currentMeta in handler.types.editedSubtype.metadatas\">\n" +
    "                                        <div style=\"margin-top:16px;\"\n" +
    "                                             ng-init=\"meta = (handler.metadonnees.list() | findWithId:currentMeta.id)\"\n" +
    "                                             ng-show=\"meta.name\">\n" +
    "                                            <span ng-if=\"!meta.name\"\n" +
    "                                                  ng-init=\"handler.types.editedSubtype.metadatas.splice($index, 1);\"></span>\n" +
    "                                            <div class=\"row\">\n" +
    "                                                <p><i tooltip=\"{{'Delete' | translate}}\"\n" +
    "                                                      class=\"fa fa-times-circle text-danger pointer\"\n" +
    "                                                      ng-click=\"handler.types.editedSubtype.metadatas.splice($index, 1);\"\n" +
    "                                                      ng-if=\"!currentMeta.fromCircuit\"></i>\n" +
    "                                                    <b>{{meta.name}}</b></p>\n" +
    "                                            </div>\n" +
    "                                            <span class=\"text-info\" ng-if=\"currentMeta.fromCircuit\">\n" +
    "                                                <i class=\"fa fa-info-circle\"></i>\n" +
    "                                                Métadonnée relative au circuit\n" +
    "                                            </span>\n" +
    "                                            <div class=\"row\" ng-if=\"!currentMeta.fromCircuit\">\n" +
    "                                                <div class=\"col-md-12\" ng-switch on=\"meta.type\">\n" +
    "                                                    <div class=\"row\">\n" +
    "                                                        <div class=\"form-group\" ng-switch-when=\"DATE\"\n" +
    "                                                             ng-hide=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <div class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                                                <input placeholder=\"{{'Admin.Typologie.Ty_Sub_Meta_Default' | translate}}\"\n" +
    "                                                                       ng-cloak=\"\" ip-id=\"currentMeta.id\"\n" +
    "                                                                       return-format=\"yy-mm-dd\" readonly=\"true\"\n" +
    "                                                                       ip-datepicker type=\"text\"\n" +
    "                                                                       ng-model=\"currentMeta.default\"\n" +
    "                                                                       class=\"form-control unvalidate\">\n" +
    "                                                                <span ng-click=\"currentMeta.default = ''\"\n" +
    "                                                                      class=\"pointer input-group-addon\">X</span>\n" +
    "                                                            </div>\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group\" ng-switch-when=\"STRING\"\n" +
    "                                                             ng-hide=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <input type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                                                   id=\"{{currentMeta.id}}\"\n" +
    "                                                                   ng-model=\"currentMeta.default\"\n" +
    "                                                                   placeholder=\"{{'Admin.Typologie.Ty_Sub_Meta_Default' | translate}}\">\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group\" ng-switch-when=\"URL\"\n" +
    "                                                             ng-hide=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <input type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                                                   id=\"{{currentMeta.id}}\"\n" +
    "                                                                   ng-model=\"currentMeta.default\"\n" +
    "                                                                   placeholder=\"{{'Admin.Typologie.Ty_Sub_Meta_Default' | translate}}\">\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group mandatory-group-abs\"\n" +
    "                                                             ng-switch-when=\"INTEGER\"\n" +
    "                                                             ng-hide=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Int'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                                                            <input type=\"text\" integer id=\"{{currentMeta.id}}\"\n" +
    "                                                                   ng-model=\"currentMeta.default\" class=\"form-control\"\n" +
    "                                                                   placeholder=\"{{'Admin.Typologie.Ty_Sub_Meta_Default' | translate}}\">\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group mandatory-group-abs\"\n" +
    "                                                             ng-switch-when=\"DOUBLE\"\n" +
    "                                                             ng-hide=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Double'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                                                            <input type=\"text\" decimal id=\"{{currentMeta.id}}\"\n" +
    "                                                                   ng-model=\"currentMeta.default\" class=\"form-control\"\n" +
    "                                                                   placeholder=\"{{'Admin.Typologie.Ty_Sub_Meta_Default' | translate}}\">\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group\" style=\"padding: 0;\"\n" +
    "                                                             ng-switch-when=\"BOOLEAN\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <select id=\"{{currentMeta.id}}\"\n" +
    "                                                                    ng-model=\"currentMeta.default\"\n" +
    "                                                                    class=\"form-control unvalidate\"\n" +
    "                                                                    ng-options=\"item.value as item.key for item in boolvalues\">\n" +
    "                                                                <option value=\"\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                    | translate}}\n" +
    "                                                                </option>\n" +
    "                                                            </select>\n" +
    "                                                        </div>\n" +
    "                                                        <div class=\"form-group\" style=\"padding: 0;\"\n" +
    "                                                             ng-show=\"meta.hasValues\">\n" +
    "                                                            <label class=\"sr-only\" for=\"{{currentMeta.id}}\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                | translate}}</label>\n" +
    "                                                            <select id=\"{{currentMeta.id}}\"\n" +
    "                                                                    ng-model=\"currentMeta.default\"\n" +
    "                                                                    class=\"form-control unvalidate\"\n" +
    "                                                                    ng-options=\"value.value as value.value for value in meta.values\">\n" +
    "                                                                <option value=\"\">{{'Admin.Typologie.Ty_Sub_Meta_Default'\n" +
    "                                                                    | translate}}\n" +
    "                                                                </option>\n" +
    "                                                            </select>\n" +
    "                                                        </div>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                                <div class=\"form-inline\">\n" +
    "                                                    <div class=\"checkbox\">\n" +
    "                                                        <label>\n" +
    "                                                            <input class=\"unvalidate\" ng-model=\"currentMeta.mandatory\"\n" +
    "                                                                   ng-true-value=\"true\" ng-false-value=\"false\"\n" +
    "                                                                   type=\"checkbox\"> {{'Mandatory' | translate}}\n" +
    "                                                        </label>\n" +
    "                                                    </div>\n" +
    "                                                    <div class=\"checkbox\">\n" +
    "                                                        <label>\n" +
    "                                                            <input class=\"unvalidate\" ng-model=\"currentMeta.editable\"\n" +
    "                                                                   ng-true-value=\"true\" ng-false-value=\"false\"\n" +
    "                                                                   type=\"checkbox\"> {{'Admin.Typologie.Ty_Sub_Meta_Edit'\n" +
    "                                                            | translate}}\n" +
    "                                                        </label>\n" +
    "                                                    </div>\n" +
    "                                                </div>\n" +
    "                                            </div>\n" +
    "                                        </div>\n" +
    "\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class='tab-pane' id='calques' style=\"overflow:visible;\">\n" +
    "                        <div class=\"col-md-12 no-padding\">\n" +
    "                            <div class=\"col-md-6\">\n" +
    "\n" +
    "                                <script type=\"text/ng-template\" id=\"popover_info_multidoc_calque\">\n" +
    "                                    <span class=\"text-info\" role=\"menu\" aria-labelledby=\"dropdownMenuDocs\">\n" +
    "                                            <i class=\"fa fa-info-circle\"></i>\n" +
    "                                            {{'Admin.Typologie.muDocs_Info1' | translate}}<br>\n" +
    "                                            {{'Admin.Typologie.muDocs_Info2' | translate}}<br>\n" +
    "                                            {{'Admin.Typologie.muDocs_Info3' | translate}} <br>' 1-3,5 ' <br>{{'Admin.Typologie.muDocs_Info4' | translate}}\n" +
    "                                        <br> {{'Admin.Typologie.muDocs_Info5' | translate}}\n" +
    "                                        </span>\n" +
    "                                </script>\n" +
    "                                <h3>{{'Admin.Typologie.Ty_Sub_Cal' | translate}}\n" +
    "                                    <button style=\"float:right;\" ng-if=\"handler.types.editedSubtype.multiDocument\" class=\"btn btn-default fa fa-info-circle\" id=\"dropdownMenuDocs\" type=\"button\" bs-popover=\"'popover_info_multidoc_calque'\" data-trigger=\"click\">\n" +
    "                                    </button>\n" +
    "                                </h3>\n" +
    "\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Meta_Avail' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"(handler.calques.list() | notSameIdInArray:handler.types.editedSubtype.calques).length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None' | translate}}</span>\n" +
    "                                    <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                        <li ng-repeat=\"calque in (handler.calques.list() | notSameIdInArray:handler.types.editedSubtype.calques)\">\n" +
    "                                            <a ng-click=\"handler.types.addCalque(calque)\">\n" +
    "                                                <i class=\"fa fa-plus-circle text-success\"></i>\n" +
    "                                                {{calque.name}}\n" +
    "                                            </a>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Cal_Actual' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"handler.types.editedSubtype.calques.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None' | translate}}</span>\n" +
    "                                    <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                        <li ng-repeat=\"currentCalque in handler.types.editedSubtype.calques\">\n" +
    "                                            <a ng-init=\"calque = (handler.calques.list() | findWithId:currentCalque.id)\" ng-click=\"handler.types.editedSubtype.calques.splice($index, 1);\">\n" +
    "                                                <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                                                {{calque.name}}\n" +
    "                                            </a>\n" +
    "                                            <input class=\"form-control\" ng-if=\"handler.types.editedSubtype.multiDocument\" ng-model=\"currentCalque.numDocument\" type=\"text\" ng-pattern=\"/^(?:\\d+(?:\\-\\d+){0,1}\\,)*(?:\\d+(?:\\-\\d*){0,1})$/\" required>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                            <div class=\"col-md-6\">\n" +
    "                                <h3>{{'Admin.Typologie.Ty_Sub_Cal_Ann' | translate}}</h3>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Meta_Avail' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"(handler.calques.list() | notSameId:handler.types.editedSubtype.calquesAnnexes).length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None' | translate}}</span>\n" +
    "                                    <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                        <li ng-repeat=\"calque in (handler.calques.list() | notSameId:handler.types.editedSubtype.calquesAnnexes)\">\n" +
    "                                            <a ng-click=\"handler.types.addCalqueAnnexe(calque)\">\n" +
    "                                                <i class=\"fa fa-plus-circle text-success\"></i>\n" +
    "                                                {{calque.name}}\n" +
    "                                            </a>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                                <div class=\"col-md-6\">\n" +
    "                                    <p><b>{{'Admin.Typologie.Ty_Sub_Cal_Actual' | translate}}</b></p>\n" +
    "                                    <span class=\"text-info\" ng-if=\"handler.types.editedSubtype.calquesAnnexes.length === 0\"><i class=\"fa fa-info-circle\"></i> {{'None' | translate}}</span>\n" +
    "                                    <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-datas\">\n" +
    "                                        <li ng-repeat=\"currentCalque in handler.types.editedSubtype.calquesAnnexes\">\n" +
    "                                            <a ng-init=\"calque = (handler.calques.list() | findWithId:currentCalque)\" ng-click=\"handler.types.editedSubtype.calquesAnnexes.splice($index, 1);\">\n" +
    "                                                <i class=\"fa fa-times-circle text-danger\"></i>\n" +
    "                                                {{calque.name}}\n" +
    "                                            </a>\n" +
    "                                        </li>\n" +
    "                                    </ul>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div>\n" +
    "                    <button ng-if=\"!handler.types.editedSubtype.isNew\" ng-click=\"handler.types.updateSub()\" type=\"submit\" class=\"btn btn-primary force-display\" ng-disabled=\"!sousTypeForm.$valid || !handler.types.hasCachetSelected()\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <button ng-if=\"handler.types.editedSubtype.isNew\" ng-click=\"handler.types.saveSub()\" type=\"submit\" class=\"btn btn-primary force-display\" ng-disabled=\"!sousTypeForm.$valid || !handler.types.hasCachetSelected()\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <span ng-if=\"handler.types.errorSubtype != undefined\" class=\"text-danger\">\n" +
    "                        <i class=\"fa fa-warning\"></i>\n" +
    "                        {{handler.types.errorSubtype}}\n" +
    "                    </span>\n" +
    "                    <span ng-if=\"handler.types.hasCachet() && !handler.types.canCachet() && !!handler.types.editedSubtype.circuit\" class=\"text-danger\">\n" +
    "                        <i class=\"fa fa-warning\"></i>\n" +
    "                        Erreur ! Le cachet serveur n'est disponible que pour de la signature PAdES !\n" +
    "                    </span>\n" +
    "                    <span style=\"position: relative; margin-left: 30px;\"  ng-if=\"handler.types.saving\">\n" +
    "                        <span us-spinner=\"{radius:10, width:4, length: 8}\"></span>\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/admin/utilisateurs.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/utilisateurs.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "\n" +
    "    <div class=\"col-md-12 adminContent\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-9\">\n" +
    "                        <h2 style=\"display:inline-block;\">{{'Admin.Users.User_Title' | translate}}</h2>\n" +
    "                        <span style=\"margin-bottom:20px; margin-left:50px;\" class=\"btn btn-success\" ng-click=\"createUser()\"><i class=\"fa fa-plus-circle\"></i> {{'Admin.Users.User_Create' | translate}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <form name=\"find\">\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                <input type=\"text\" class=\"unvalidate form-control\" ng-change=\"changeSearch()\" placeholder=\"{{'Admin.Users.User_Search' | translate}}\" ng-model=\"search\">\n" +
    "                            </div>\n" +
    "                        </form>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"flags.isSearching\">\n" +
    "                    <span class=\"text text-info\">\n" +
    "                        {{'Admin.Users.User_Searching' | translate}}\n" +
    "                    </span>\n" +
    "                    <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 90px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "                </div>\n" +
    "                <form name=\"userCreation\">\n" +
    "                    <table ng-show=\"(flags.hasSearch && users.length > 0 && !flags.isSearching) || !empty(newUser)\" ng-table=\"tableParams\" class=\"table table-striped\">\n" +
    "\n" +
    "                        <tr ng-if=\"!empty(newUser)\">\n" +
    "                            <td data-title=\"'Admin.Users.User_Lastname' | translate\" sortable=\"'lastName'\">\n" +
    "                                <input name=\"lastName\" placeholder=\"{{'Admin.Users.User_Lastname' | translate}}\" type=\"text\" class=\"form-control\" ng-model=\"newUser.lastName\" required=\"required\">\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Firstname' | translate\" sortable=\"'firstName'\">\n" +
    "                                <input name=\"firstName\" placeholder=\"{{'Admin.Users.User_Firstname' | translate}}\" type=\"text\" class=\"form-control\" ng-model=\"newUser.firstName\" required=\"required\">\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Name' | translate\" sortable=\"'username'\">\n" +
    "                                <input name=\"username\" placeholder=\"{{'Admin.Users.User_Name' | translate}}\" ng-pattern='/^[^&:\"£*/<>?%|+;]*$/' type=\"text\" class=\"form-control\" ng-model=\"newUser.username\" required=\"required\">\n" +
    "                                <span class=\"text-danger\" ng-show=\"exist\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.User_Exist' | translate}}</span>\n" +
    "                                <span class=\"text-danger\" ng-show=\"multiTenantEnableError\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.User_MultiT' | translate}}</span>\n" +
    "                                <span class=\"text-danger\" ng-show=\"userCreation.username.$error.pattern\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.User_SpecialChar' | translate}}</span>\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Mail' | translate\" sortable=\"'email'\">\n" +
    "                                <input name=\"email\" placeholder=\"Courriel\" type=\"email\" class=\"form-control unvalidate\" ng-model=\"newUser.email\">\n" +
    "                                <span class=\"text-danger\" ng-show=\"userCreation.email.$error.email\"><i class=\"fa fa-warning\"></i> {{'Admin.Users.User_Mail_Error' | translate}}</span>\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Info' | translate\"></td>\n" +
    "                            <td style=\"text-align: center;\" data-title=\"'Admin.Users.User_Actions' | translate\">\n" +
    "                                <span tooltip=\"Annuler\" ng-click=\"cancelCreate()\" class=\"btn btn-warning force-display\">\n" +
    "                                    <i class=\"fa fa-times-circle\"></i>\n" +
    "                                </span>\n" +
    "                                <button tooltip=\"Enregistrer\" type=\"submit\" ng-click=\"askForPassword()\" class=\"btn btn-primary force-display\" ng-disabled=\"!userCreation.$valid\">\n" +
    "                                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                                </button>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "\n" +
    "                        <tr ng-repeat=\"user in $data\">\n" +
    "                            <td data-title=\"'Admin.Users.User_Lastname' | translate\" sortable=\"'lastName'\">\n" +
    "                                {{user.lastName}}\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Firstname' | translate\" sortable=\"'firstName'\">\n" +
    "                                {{user.firstName}}\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Name' | translate\" sortable=\"'username'\">\n" +
    "                                {{user.username}}\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Mail' | translate\" sortable=\"'email'\">\n" +
    "                                {{user.email}}\n" +
    "                            </td>\n" +
    "                            <td data-title=\"'Admin.Users.User_Info' | translate\">\n" +
    "                                <i class=\"fa fa-certificate fa-2x text-success\" ng-if=\"user.hasCertificate\" tooltip=\"{{'Admin.Users.User_HasCert' | translate}}\"></i>\n" +
    "                                <i class=\"fa fa-user fa-2x text-success\" ng-if=\"user.isAdmin\" tooltip=\"{{'Admin.Users.User_IsAdmin' | translate}}\"></i>\n" +
    "                                <i class=\"fa fa-desktop fa-2x text-success\" style=\"vertical-align: inherit;\" ng-if=\"user.isAdminFonctionnel\" tooltip=\"{{'Admin.Users.User_IsFonc' | translate}}\"></i>\n" +
    "                                <i class=\"fa fa-share-alt-square fa-2x text-success\" ng-if=\"user.isFromLdap\" tooltip=\"{{'Admin.Users.User_LDAP' | translate}}\"></i>\n" +
    "                            </td>\n" +
    "                            <td style=\"text-align: center;\" data-title=\"'Admin.Users.User_Actions' | translate\">\n" +
    "                            <span ng-click=\"editUser(user)\" tooltip=\"Modifier l'utilisateur\" class=\"btn btn-info force-display\">\n" +
    "                                <i class=\"fa fa-pencil\"></i>\n" +
    "                            </span>\n" +
    "                            <span tooltip=\"Supprimer l'utilisateur\" ng-if=\"user.username !== 'admin' && !(user.username.split('@')[0] === 'admin' && !tenantName)\"\n" +
    "                                  tooltip=\"\" ng-click=\"deleteUser(user)\" class=\"btn btn-danger force-display\">\n" +
    "                                <i class=\"fa fa-trash-o\"></i>\n" +
    "                            </span>\n" +
    "                            </td>\n" +
    "                        </tr>\n" +
    "                    </table>\n" +
    "                </form>\n" +
    "                <div class=\"col-md-12\" ng-if=\"!flags.isSearching\">\n" +
    "                    <p>\n" +
    "                        <span ng-show=\"(!users || users.length === 0) && flags.hasSearch\" class=\"text-info\">{{'Admin.Users.User_None' | translate}}</span>\n" +
    "                        <span ng-show=\"!flags.hasSearch\" class=\"text-info\">{{'Admin.Users.User_HasToSearch' | translate}}</span>\n" +
    "                    </p>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/admin/workers.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/admin/workers.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"menuAdmin col-md-3 label label-info headertop\" removeonsize=\"992\" classes-list=\"label label-info\" ng-include src=\"'partials/adminNavbar.html'\"></div>\n" +
    "    <div>\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-3 adminContent\">\n" +
    "            <h2>Gestion des workers</h2>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-9 adminContent\">\n" +
    "            Content\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/apercu.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/apercu.html",
    "<div>\n" +
    "\n" +
    "    <ul is-visible-dash ng-show=\"!apercu.annotations.fullscreen\" listen-on=\"dashletsPosition.left\" is-visible=\"apercu.annotations.hasDashlets.left\" ui-sortable=\"{connectWith:'.list-dash-right'}\" ng-model=\"dashletsPosition.left\" class=\"list-dash-left\">\n" +
    "        <li ng-repeat=\"element in dashletsPosition.left\" ng-include=\"'partials/dashlets/'+element.name+'.html'\">\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div ng-cloak ng-show=\"loaded\" class=\"annotatableContainer\" ng-style=\"apercu.annotations.fullscreen ? {width:'100%', paddingLeft:'20px', paddingRight:'20px', left:'0'} : (apercu.annotations.hasDashlets.left ? apercu.annotations.hasDashlets.right ? {width:'60%', height:'60%', left:'20%'} : {width:'80%', height:'80%', right:'0', paddingRight:'20px'} : {width:'80%', height:'80%', left:'0', paddingLeft:'20px'})\">\n" +
    "        <div class=\"helper-inline-block\" ng-if=\"dossier.isXemEnabled && !apercu.flags.noVisuel\" style=\"position:absolute; padding-left:50px;padding-top:15px;\">\n" +
    "            <i class=\"fa fa-file-pdf-o fa-2x block\" ng-if=\"apercu.iframe.visuType === 'xemelios'\" ng-class=\"apercu.iframe.current < 0 ? 'text-danger' : 'pointer'\" ng-click=\"apercu.iframe.switchVisu()\" tooltip=\"{{'apercu.Show_with_PDF_reader' | translate}}\" tooltip-placement=\"right\"></i>\n" +
    "            <i class=\"fa fa-file-excel-o fa-2x block pointer\" ng-if=\"apercu.iframe.visuType === 'visuelpdf'\" ng-click=\"apercu.iframe.switchVisu()\" tooltip=\"{{'apercu.Show_with_Xemelios_viewer' | translate}}\" tooltip-placement=\"right\"></i>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"helper-inline-block\" style=\"position:absolute;\">\n" +
    "            <i class=\"fa fa-save fa-2x block pointer\" ng-click=\"saveDashletsPosition()\" tooltip-placement=\"right\" tooltip=\"{{'apercu.Save_screen_layout' | translate}}\"></i>\n" +
    "            <i ng-if=\"!apercu.flags.noVisuel || dossier.isXemEnabled\" class=\"fa fa-expand fa-2x block pointer\" ng-class=\"apercu.annotations.fullscreen ? 'fa-compress' : 'fa-expand'\" ng-click=\"apercu.annotations.switchFullscreen()\" tooltip-placement=\"right\" tooltip=\"{{apercu.annotations.fullscreen ? ('apercu.Exit_fullscreen_mode' | translate) : ('apercu.View_folder_in_fullscreen_mode' | translate)}}\"></i>\n" +
    "            <div class=\"signaturePosition\" ng-if=\"apercu.annotations.canPositionSignature()\">\n" +
    "                <i class=\"fa fa-hand-o-up fa-2x pointer\" ng-class=\"apercu.annotations.signatureMode ? 'text-danger' : ''\" ng-click=\"apercu.annotations.signatureMode = !apercu.annotations.signatureMode\" tooltip-placement=\"right\" tooltip=\"{{forCachet ? 'apercu.position_cachet': 'apercu.position_signature' | translate}}\"></i>\n" +
    "                <div ng-if=\"apercu.annotations.signatureMode\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{forCachet ? 'apercu.position_cachet_mode_active' : 'apercu.position_mode_active' | translate}}</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div ng-hide=\"apercu.flags.noVisuel || (dossier.isXemEnabled && apercu.iframe.visuType === 'xemelios')\" pagination timestamp=\"timestamp\" ng-change=\"apercu.annotations.pageChanged()\" previous-text=\"Précédent\" next-text=\"Suivant\" first-text=\"Première Page\" last-text=\"Dernière Page\" total-items=\"apercu.annotations.pageCount\" items-per-page=\"1\" ng-model=\"apercu.annotations.viewPage\" max-size=\"apercu.annotations.maxSize\" class=\"pagination-sm\" boundary-links=\"true\" rotate=\"false\"></div>\n" +
    "\n" +
    "        <span class=\"text-info nextDossierInfo\" ng-if=\"nextDossierSelected\"><i class=\"fa fa-info-circle\"></i> {{'apercu.Action_pending_Next_folder_selected' | translate}}</span>\n" +
    "\n" +
    "        <span class=\"text-info nextDossierInfo\" ng-if=\"dashletsSaved\"><i class=\"fa fa-info-circle\"></i> {{'apercu.Screen_layout_saved' | translate}}</span>\n" +
    "\n" +
    "        <span class=\"text-info nextDossierInfo\" ng-if=\"refreshDossier\"><i class=\"fa fa-info-circle\"></i> {{'apercu.Folder_refreshing_Please_wait' | translate}}</span>\n" +
    "\n" +
    "        <span class=\"text-danger nextDossierInfo\" ng-if=\"hasNoVisualToDisplay()\"><i class=\"fa fa-times\"></i> {{'apercu.No_visual_to_display' | translate}}</span>\n" +
    "\n" +
    "        <span class=\"text-info nextDossierInfo\" ng-if=\"isGenerating()\"><i class=\"fa fa-info-circle\"></i> {{'apercu.Visual_generating' | translate}}</span>\n" +
    "\n" +
    "        <div ng-if=\"(!(apercu.flags.noVisuel || (dossier.isXemEnabled && apercu.iframe.visuType === 'xemelios'))) || apercu.flags.annotShownOnce\"\n" +
    "             ng-init=\"apercu.flags.annotShownOnce = true;\"\n" +
    "             ng-show=\"!(apercu.flags.noVisuel || (dossier.isXemEnabled && apercu.iframe.visuType === 'xemelios'))\"\n" +
    "             annotorious\n" +
    "             load-on=\"apercu.annotations.canLoad\"\n" +
    "             document-page-listen=\"apercu.annotations.documentPage\"\n" +
    "             src-base=\"apercu.annotations.src\"\n" +
    "             on-created=\"apercu.annotations.create(annotation)\"\n" +
    "             set-position=\"apercu.annotations.setPosition(anno, annotation)\"\n" +
    "             on-updated=\"apercu.annotations.update(annotation)\"\n" +
    "             on-removed=\"apercu.annotations.remove(annotation)\"\n" +
    "             on-load=\"apercu.annotations.load(anno, width, height)\"\n" +
    "             signature-mode=\"apercu.annotations.signatureMode\"\n" +
    "             for-cachet=\"forCachet\"\n" +
    "             version-number=\"getCurrentDocumentVersionNumber()\">\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-show=\"(dossier.isXemEnabled && apercu.iframe.visuType === 'xemelios')\" class=\"pagination\">\n" +
    "            <span class=\"btn btn-default\" ng-click=\"apercu.iframe.previousPage()\" ng-disabled=\"apercu.iframe.current <= 0\">{{'apercu.Previous_page' | translate}}</span>\n" +
    "            <span class=\"btn btn-default\" ng-click=\"apercu.iframe.nextPage()\" ng-disabled=\"!(apercu.iframe.current < apercu.iframe.max)\">{{'apercu.Next_page' | translate}}</span>\n" +
    "            <div ng-if=\"apercu.iframe.current < 0\" class=\"text-info\" style=\"position:absolute; right:0; bottom:0;\">{{'apercu.Loading_Xemelios_viewer___' | translate}}</div>\n" +
    "        </div>\n" +
    "\n" +
    "        <iframe ng-cloak class=\"fixbottom\" id=\"visionneuse\" style=\"width: 100%; margin-bottom:20px;\" onLoad=\"onIframeLoad()\" ng-if=\"dossier.isXemEnabled && apercu.iframe.visuType === 'xemelios'\" ng-src=\"{{context + '/proxy/alfresco/parapheur/dossiers/' + dossier.id + '/' + dossier.documents[0].id + '/xemelios'}}\" localize>\n" +
    "            {{'apercu.Cant_load_the_Xemelios_viewer' | translate}}\n" +
    "        </iframe>\n" +
    "\n" +
    "        <span us-spinner style=\"position:absolute; top:100px; right:50%;\" spinner-key=\"spinnerLoading\"></span>\n" +
    "\n" +
    "        <div style=\"position:absolute; top:5px; right:20px;\" ng-if=\"apercu.annotations.fullscreen\" ng-include=\"'partials/dashlets/actions.html'\">\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-show=\"!loaded && !bestBureauError\">\n" +
    "        <span class=\"text text-info\" localize>\n" +
    "            {{'apercu.Loading_folder_preview___' | translate}}\n" +
    "        </span>\n" +
    "        <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 120px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "    </div>\n" +
    "    <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-show=\"bestBureauError\">\n" +
    "        <span class=\"text text-warning\">\n" +
    "            <i class=\"fa fa-warning\"></i>\n" +
    "            {{'apercu.Moved_archived_or_deleted_folder' | translate}}\n" +
    "        </span>\n" +
    "    </div>\n" +
    "\n" +
    "    <ul is-visible-dash ng-show=\"!apercu.annotations.fullscreen\" listen-on=\"dashletsPosition.right\" is-visible=\"apercu.annotations.hasDashlets.right\" ui-sortable=\"{connectWith:'.list-dash-left'}\" ng-model=\"dashletsPosition.right\" class=\"list-dash-right\">\n" +
    "        <li ng-repeat=\"element in dashletsPosition.right\" ng-include=\"'partials/dashlets/'+element.name+'.html'\">\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>");
}]);

angular.module("templates/archives.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/archives.html",
    "<!-- Modal de suppression de filtre -->\n" +
    "<div bs-modal when=\"filterToDelete\"\n" +
    "     title=\"{{'archive.deleting_filter_' | translate}} {{filterToDelete}}\"\n" +
    "     primary-label=\"{{'Delete' | translate}}\"\n" +
    "     primary-action=\"deleteFilter()\">\n" +
    "    <p>{{'archives.are_you_sure_you_want_to_delete_the_filter_' | translate}} <strong>{{filterToDelete}}</strong> ?</p>\n" +
    "</div>\n" +
    "\n" +
    "<!-- Modal d'ajout de filtre -->\n" +
    "<div bs-modal when=\"filterToSave\"\n" +
    "     title=\"{{'archive.saving_filter' | translate}}\"\n" +
    "     primary-label=\"{{'Save' | translate}}\"\n" +
    "     primary-action=\"saveFilter()\">\n" +
    "    <label>\n" +
    "        {{'archives.choose_a_name_for_your_filter' | translate}} :\n" +
    "        <input type=\"text\" ng-model=\"newFilterName\">\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"dashboard-page\">\n" +
    "<div id=\"dashboard-filters\" class=\"well\">\n" +
    "    <form action=\"#\" method=\"post\">\n" +
    "        <tabset>\n" +
    "            <tab heading=\"{{'Basic' | translate}}\">\n" +
    "                <div class=\"row col-md-12\" style=\"margin-top:10px;\">\n" +
    "                    <!-- TYPE -->\n" +
    "                    <fieldset class=\"col-md-4\">\n" +
    "                        <label class=\"checkbox\">\n" +
    "                            <input class=\"unvalidate\" ng-checked=\"dashboard.showed.types.length\" ng-change=\"dashboard.showed.types = []; dashboard.showed.subtypes = []\" type=\"checkbox\" ng-model=\"selectType\"/>\n" +
    "                            Type\n" +
    "                        </label>\n" +
    "                        <select multiple class=\"form-control unvalidate\" ng-change=\"selectType = true\" ng-selected=\"selectType\" ng-model=\"dashboard.showed.types\" ng-options=\"type.id as type.id for type in typo\"></select>\n" +
    "                    </fieldset>\n" +
    "                    <!-- SOUS-TYPE -->\n" +
    "                    <fieldset class=\"col-md-4\">\n" +
    "                        <label class=\"checkbox\">\n" +
    "                            <input class=\"unvalidate\"  ng-checked=\"dashboard.showed.subtypes.length\" ng-change=\"dashboard.showed.subtypes = []\" type=\"checkbox\" ng-model=\"selectSubtype\"/>\n" +
    "                            {{'SubType' | translate}}\n" +
    "                        </label>\n" +
    "                        <select multiple  class=\"form-control unvalidate\" ng-change=\"selectSubtype = true\" ng-model=\"dashboard.showed.subtypes\" ng-options=\"ssType as ssType for ssType in (typo | sameId:dashboard.showed.types | mergeArrays:'sousTypes')\"></select>\n" +
    "                    </fieldset>\n" +
    "\n" +
    "                    <!-- DATE -->\n" +
    "                    <fieldset class=\"col-md-2\">\n" +
    "                        <div class=\"control-group\">\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input  class=\"unvalidate\" ng-checked=\"dashboard.showed.dateFrom || dashboard.showed.dateTo\" ng-change=\"dashboard.showed.dateFrom='';dashboard.showed.dateTo=''\" ng-model=\"selectDate\" type=\"checkbox\"/>\n" +
    "                                {{'archives.creation_date' | translate}}\n" +
    "                            </label>\n" +
    "\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input  ng-change=\"selectDate = true\" type=\"text\" id=\"from\" from=\"true\" linked=\"#to\" ng-model=\"dashboard.showed.dateFrom\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.from\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                                <span ng-if=\"!!dashboard.showed.dateFrom\" ng-click=\"dashboard.showed.dateFrom = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                        <i class=\"fa fa-times\"></i>\n" +
    "                                    </span>\n" +
    "                                <label style=\"display: table-cell;\" ng-if=\"!dashboard.showed.dateFrom\" class=\"input-group-addon btn\" for=\"from\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input  ng-change=\"selectDate = true\" type=\"text\" id=\"to\" linked=\"#from\" ng-model=\"dashboard.showed.dateTo\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.to\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                                <span ng-if=\"!!dashboard.showed.dateTo\" ng-click=\"dashboard.showed.dateTo = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                        <i class=\"fa fa-times\"></i>\n" +
    "                                    </span>\n" +
    "                                <label style=\"display: table-cell;\" ng-if=\"!dashboard.showed.dateTo\" class=\"input-group-addon btn\" for=\"to\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </fieldset>\n" +
    "\n" +
    "                    <div class=\"col-md-2\">\n" +
    "\n" +
    "                        <!-- CONTENT -->\n" +
    "                        <div>\n" +
    "                            <label for=\"searchValue\">\n" +
    "                                {{'Title' | translate}}\n" +
    "                            </label>\n" +
    "                            <input type=\"text\" ng-model=\"dashboard.showed.title\" id=\"searchValue\" name=\"searchValue\" class=\"form-control unvalidate\"/>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "\n" +
    "                </div>\n" +
    "            </tab>\n" +
    "            <tab heading=\"{{'Advanced' | translate}} {{metaFilter.length > 0 ? '- Actuellement : ' + (metaFilter | object2string:', ':'name') : ''}}\">\n" +
    "                <div class=\"row col-md-12 ng-scope\" style=\"margin-top:10px;\">\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <label>\n" +
    "                            {{'archives.available_filters' | translate}}\n" +
    "                            <select size=\"5\"\n" +
    "                                    ng-options=\"el.value as el.key group by el.group for el in optionsFiltersAvailable\"\n" +
    "                                    class=\"form-control unvalidate\"\n" +
    "                                    ng-change=\"createAdvancedFilter(selectedMetadonneeIndex.index)\"\n" +
    "                                    ng-model=\"selectedMetadonneeIndex.index\">\n" +
    "                            </select>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <div ng-show=\"!empty(metaTmpFilter)\">\n" +
    "                            <label>\n" +
    "                                {{!empty(metaTmpFilter) ? metaTmpFilter.name + ' - Condition' : ''}}\n" +
    "                                <select class=\"form-control unvalidate\" ng-change=\"editAdvancedFilter()\" ng-show=\"metaTmpFilter.values !== undefined\" ng-model=\"metaTmpFilter.text\" ng-options=\"val for val in metaTmpFilter.values\">\n" +
    "                                </select>\n" +
    "                                <input ng-cloak ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"metaTmpFilter.text\" ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'STRING'\">\n" +
    "                                <input ng-cloak ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" integer type=\"text\" class=\"form-control unvalidate\" ng-model=\"metaTmpFilter.text\" ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'INTEGER'\">\n" +
    "                                <input ng-cloak ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" decimal type=\"text\" class=\"form-control unvalidate\" ng-model=\"metaTmpFilter.text\" ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'DOUBLE'\">\n" +
    "                                <input ng-cloak ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" type=\"checkbox\" class=\"unvalidate\" ng-model=\"metaTmpFilter.text\" ng-true-value=\"'true'\" ng-false-value=\"'false'\" ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'BOOLEAN'\">\n" +
    "                                <input ng-cloak ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'DATE'\" type=\"text\" id=\"fromMeta\" from=\"true\" linked=\"#toMeta\" ng-model=\"metaTmpFilter.dateFrom\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.from\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                            </label>\n" +
    "                            <label>\n" +
    "                                <input ng-keydown=\"keyDownAdvancedFilter($event)\" ng-change=\"editAdvancedFilter()\" ng-show=\"metaTmpFilter.type === 'DATE'\" type=\"text\" id=\"toMeta\" linked=\"#fromMeta\" ng-model=\"metaTmpFilter.dateTo\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.to\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                            </label>\n" +
    "                            <div>\n" +
    "                                <span class=\"btn btn-info\" ng-click=\"saveAdvancedFilter()\">OK</span>\n" +
    "                                <span ng-show=\"selectedMetadonneeIndex.bis !== ''\" class=\"btn btn-warning\" ng-click=\"deleteAdvancedFilter()\">Supprimer</span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-4\">\n" +
    "                        <label>\n" +
    "                            {{'archives.current_advanced_filder' | translate}}\n" +
    "                            <select size=\"5\" ng-keydown=\"keyDownAdvancedActiveFilter($event)\" class=\"form-control unvalidate\" ng-change=\"selectAdvancedFilter(selectedMetadonneeIndex.bis)\" ng-model=\"selectedMetadonneeIndex.bis\">\n" +
    "                                <option value=\"\">-- {{'archives.select_a_filter_to_edit' | translate}} --</option>\n" +
    "                                <option ng-repeat=\"item in metaFilter\" ng-value=\"$index\"><i class=\"fa fa-trash\"></i>{{item.name}} = {{item.text}}{{item.dateFrom ? item.dateFrom : ''}}{{item.dateTo ? ' -> ' + item.dateTo : ''}}</option>\n" +
    "                            </select>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </tab>\n" +
    "        </tabset>\n" +
    "\n" +
    "        <hr>\n" +
    "\n" +
    "        <!-- DO FILTER -->\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"col-md-offset-4 col-md-3\">\n" +
    "                    <span ng-if=\"!dashboard.navigation.selected == unsavedFilterName\"\n" +
    "                          class=\"btn btn-default\"\n" +
    "                          ng-click=\"dashboard.save()\">\n" +
    "                        <i class=\"fa fa-save\"></i> {{'archives.save_current_filter' | translate}}\n" +
    "                    </span>\n" +
    "                    <span ng-if=\"(!!dashboard.navigation.selected) && (dashboard.navigation.selected !== unsavedFilterName) && (dashboard.navigation.selected !== noFilterName)\"\n" +
    "                          class=\"btn btn-danger\"\n" +
    "                          ng-click=\"dashboard.remove()\">\n" +
    "                        <i class=\"fa fa-trash-o\"></i> {{'archives.delete_selected_filter' | translate}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-offset-2 col-md-3\">\n" +
    "                    <fieldset>\n" +
    "                        <span ng-click=\"dashboard.resetFilter()\" class=\"btn btn-default\">\n" +
    "                            <i class=\"fa fa-undo\"></i>\n" +
    "                            Réinitialiser\n" +
    "                        </span>\n" +
    "                        <span ng-click=\"dashboard.doFilter()\" class=\"btn btn-success\">\n" +
    "                            <i class=\"fa fa-filter\"></i>\n" +
    "                            {{'archives.apply_filter' | translate}}\n" +
    "                        </span>\n" +
    "                    </fieldset>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "\n" +
    "\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"alert alert-info row\">\n" +
    "\n" +
    "    <div class=\"filtreActif col-xs-10\">\n" +
    "            <span>\n" +
    "                <i class=\"icon-filter\"></i>\n" +
    "                <strong id=\"titleInfoFiltre\">{{'archives.active_filter' | translate}} :</strong>\n" +
    "            </span>\n" +
    "            <span ng-hide=\"currentFilter.types || currentFilter.subtypes || currentFilter.dateFrom || currentFilter.dateTo || currentFilter.title || currentFilter.metadonnees.length > 0\">\n" +
    "                <strong>{{'archives.None' | translate}}</strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.types\" id=\"filtreType\">\n" +
    "                <p>{{'archives.type' | translate}} </p>\n" +
    "                <strong>\n" +
    "                    <p ng-repeat=\"type in currentFilter.types\">&nbsp;{{type}},</p>\n" +
    "                </strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.subtypes\" id=\"filtreSousType\">\n" +
    "                <p>{{'archives.subtype' | translate}}</p>\n" +
    "                <strong>\n" +
    "                    <p ng-repeat=\"subtype in currentFilter.subtypes\">&nbsp;{{subtype}},</p>\n" +
    "                </strong>\n" +
    "            </span>\n" +
    "            <span id=\"filtreDate\">\n" +
    "                <span ng-show=\"currentFilter.dateFrom\" id=\"filtreFrom\">\n" +
    "                    <p> {{'archives.from' | translate}} </p>\n" +
    "                    <strong>{{currentFilter.dateFrom | texttodate | date:'fullDate'}}</strong>\n" +
    "                </span>\n" +
    "                <span ng-show=\"currentFilter.dateTo\" id=\"filtreTo\">\n" +
    "                    <p> {{'archives.until' | translate}} </p>\n" +
    "                    <strong>{{currentFilter.dateTo | texttodate | date:'fullDate'}}</strong>\n" +
    "                </span>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.title\" id=\"filtreRecherche\">\n" +
    "                <span class=\"icon-angle-right\"></span>\n" +
    "                 {{'archives.searching' | translate}}\n" +
    "                <strong>\"{{currentFilter.title}}\"</strong>\n" +
    "                 {{'archives.in' | translate}}\n" +
    "                <strong>{{'Title' | translate}}</strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.metadonnees.length > 0\" id=\"filtreMetadonnees\">\n" +
    "                {{'archives.with' | translate}}\n" +
    "                <span ng-repeat=\"meta in currentFilter.metadonnees\">\n" +
    "                    <strong ng-show=\"{{meta.type === 'STRING'}}\" >{{meta.name}} = \"{{meta.text}}\",</strong>\n" +
    "                    <strong ng-show=\"{{meta.type === 'BOOLEAN'}}\" >{{meta.name}} = {{(meta.text === \"'true'\" ? 'archives.true' : 'archives.false') | translate}},</strong>\n" +
    "                    <span ng-show=\"{{meta.type ==='DATE'}}\">\n" +
    "                        <strong>{{meta.name}}</strong>\n" +
    "                        <span ng-show=\"meta.dateFrom\">\n" +
    "                            <p> {{'archives.from' | translate}} </p>\n" +
    "                            <strong>{{meta.dateFrom | texttodate | date:'fullDate'}}</strong>\n" +
    "                        </span>\n" +
    "                        <span ng-show=\"meta.dateTo\">\n" +
    "                            <p> {{'archives.until' | translate}} </p>\n" +
    "                            <strong>{{meta.dateTo | texttodate | date:'fullDate'}}</strong>\n" +
    "                        </span>\n" +
    "                        ,\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "            </span>\n" +
    "    </div>\n" +
    "\n" +
    "    <!-- FILTERS HANDLER -->\n" +
    "    <div class=\"col-xs-2\">\n" +
    "        <select ng-model=\"dashboard.navigation.selected\"\n" +
    "                ng-options=\"name as translateFilter(name) for (name, filter) in dashboard.list\"\n" +
    "                ng-change=\"dashboard.change()\"\n" +
    "                class=\"form-control unvalidate\">\n" +
    "            <option value=\"\">{{noFilterName | translate}}</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<table class=\"table table-condensed table-bordered dashboard-table\">\n" +
    "    <thead>\n" +
    "    <tr>\n" +
    "        <th ng-repeat=\"data in dashboard.columns.enabled\" ng-class=\"data.key ? 'sort-th pointer' : ''\" ng-click=\"sortTable(data.key)\">\n" +
    "            <i ng-if=\"nav.currentChamp === data.key\" class=\"fa\" ng-class=\"nav.ascBase ? data.value === 'created' ? 'fa-sort-numeric-asc' : 'fa-sort-alpha-asc' : data.value === 'created' ? 'fa-sort-numeric-desc' : 'fa-sort-alpha-desc'\"></i> {{data.i18n | translate}}\n" +
    "        </th>\n" +
    "    </tr>\n" +
    "    </thead>\n" +
    "    <tbody>\n" +
    "    <tr ng-repeat=\"dossier in dossiers\" ng-style=\"{{checkColoration(dossier)}}\">\n" +
    "        <td ng-repeat=\"data in dashboard.columns.enabled\" ng-switch on=\"data.value\">\n" +
    "            <p ng-switch-when=\"type\">\n" +
    "                {{dossier['type']}} / {{dossier['sousType']}}\n" +
    "            </p>\n" +
    "\n" +
    "            <p ng-switch-when=\"created\">\n" +
    "                {{dossier[data.value] | texttodate | date:'dd/MM/yyyy'}}\n" +
    "            </p>\n" +
    "            <p ng-switch-when=\"telechargements\" class=\"downloadCol\" style=\"display:block;text-align: center;font-size:18px;\">\n" +
    "                <a ng-if=\"dossier.sig === 'true'\"\n" +
    "                   href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3asig/workspace/SpacesStore/{{dossier.id}}/{{removeSlash(dossier.title)}}_sig.zip\">\n" +
    "                    <i tooltip=\"Signatures\" class=\"fa ls-signature\"></i>\n" +
    "                </a>\n" +
    "                <a ng-if=\"dossier.original === 'true'\" target=\"_blank\" href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3aoriginal/workspace/SpacesStore/{{dossier.id}}/{{removeSlash(dossier.originalName)}}\">\n" +
    "                    <i tooltip=\"Document Original\" class=\"fa fa-download\"></i>\n" +
    "                </a>\n" +
    "                <a ng-if=\"dossier.attest\" target=\"_blank\" ng-init=\"attestName = 'attest-' + dossier.originalName\" href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3aattest-content/workspace/SpacesStore/{{dossier.id}}/{{attestName}}\">\n" +
    "                    <i tooltip=\"Attestation de signature\" class=\"fa fa-check-circle-o\"></i>\n" +
    "                </a>\n" +
    "            </p>\n" +
    "            <p ng-switch-when=\"title\">\n" +
    "\n" +
    "                <a target=\"_blank\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{dossier.id}}/content/{{getFullTitle(dossier.title)}}\">\n" +
    "                    {{dossier[data.value]}}\n" +
    "                </a>\n" +
    "                <a target=\"_blank\" class=\"xemelios\" ng-if=\"dossier.isXemEnabled && dossier.original === 'true'\" href=\"{{context}}/proxy/alfresco/parapheur/archives/{{dossier.id}}/xemelios\">\n" +
    "                    <img ng-src=\"{{context}}/res/images/xemelios.png\">\n" +
    "                </a>\n" +
    "            </p>\n" +
    "            <a ng-switch-when=\"title\" tooltip=\"Supprimer\" ng-if=\"config.isAdmin\" class=\"btn btn-danger float-right\" ng-click=\"deleteArchive(dossier)\">\n" +
    "                <i class=\"fa fa-trash-o\"></i>\n" +
    "            </a>\n" +
    "            <a ng-switch-when=\"title\" tooltip=\"Renommer\" ng-if=\"config.isAdmin\" class=\"btn btn-info float-right\" ng-click=\"renameArchive(dossier)\">\n" +
    "                <i class=\"fa fa-ellipsis-h\"></i>\n" +
    "            </a>\n" +
    "\n" +
    "            <p ng-switch-default>\n" +
    "                {{dossier[data.value]}}\n" +
    "            </p>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    </tbody>\n" +
    "</table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"paginate\">\n" +
    "    <div ng-click=\"changePage(false)\" ng-class=\"{true:'enable', false:'disable'}[nav.hasPrev]\" class=\"page {{hasPrev}}\"><p class=\"inline\" i18n=\"app.general.page.previous\"></p><i class=\"icon-circle-arrow-left\"></i></div>\n" +
    "    <p style=\"display:inline-block;\">{{'archives.current_page' | translate}} : {{nav.currentPage+1}}</p>\n" +
    "    <div ng-click=\"changePage(true)\" ng-class=\"{true:'enable', false:'disable'}[nav.hasNext]\" class=\"page\"><i class=\"icon-circle-arrow-right\"></i><p class=\"inline\" i18n=\"app.general.page.next\"></p></div>\n" +
    "</div>\n" +
    "\n" +
    "<!-- Panneau d'alertes, d'informations et d'erreurs -->\n" +
    "<div notify text=\"alert\" class=\"notifications bottom-right\">\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("templates/bureaux.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/bureaux.html",
    "<div style=\"position:relative;\">\n" +
    "    <ul class=\"liste-bureaux\">\n" +
    "        <li class=\"bureaux-animate\" ng-repeat=\"bureau in orderedBureaux\">\n" +
    "            <div bureau on-select=\"selectBureau(bureau)\" is-thumbnail=\"true\" b=\"bureau\"></div>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <div style=\"position:absolute; top:-30px; right:30px\">\n" +
    "        <span class=\"text-info\" ng-if=\"orderedBureaux.length === 1\">\n" +
    "            <i class=\"fa fa-info-circle\"> {{'bureau.you_only_have_one_desk_automatic_selection_' | translate}}</i>\n" +
    "        </span>\n" +
    "\n" +
    "        <span class=\"text-info\" ng-if=\"orderedBureaux.length === 0\">\n" +
    "            <i class=\"fa fa-info-circle\"> {{'bureau.no_desk' | translate}}</i>\n" +
    "        </span>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("templates/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/dashboard.html",
    "<!-- Modal de suppression de filtre -->\n" +
    "<div bs-modal when=\"filterToDelete\"\n" +
    "     title=\"{{'dashboard.Deleting_filter' | translate}} : {{filterToDelete}}\"\n" +
    "     primary-label=\"{{'Delete' | translate}}\"\n" +
    "     primary-action=\"deleteFilter()\">\n" +
    "    <p>{{'dashboard.Are_you_sure_you_want_to_delete_the_filter' | translate}} : <strong>{{filterToDelete}}</strong> ?</p>\n" +
    "</div>\n" +
    "\n" +
    "<!-- Modal d'ajout de filtre -->\n" +
    "<div bs-modal when=\"filterToSave\"\n" +
    "     title=\"{{'dashboard.Saving_current_filter' | translate}}\"\n" +
    "     primary-label=\"{{'Save' | translate}}\"\n" +
    "     primary-action=\"saveFilter()\">\n" +
    "    <label>\n" +
    "        {{'dashboard.Choose_a_filter_name' | translate}} :\n" +
    "        <input type=\"text\" ng-model=\"newFilterName\">\n" +
    "    </label>\n" +
    "</div>\n" +
    "\n" +
    "<script type=\"text/ng-template\" id=\"popover_list_documents\">\n" +
    "    {{'dashboard.Main_documents' | translate}} :\n" +
    "    <ul class=\"list-unstyled\">\n" +
    "        <li ng-repeat=\"doc in dossier.documentsPrincipaux\">\n" +
    "            <a target=\"_blank\" class=\"wrap\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{doc.id}}/content/{{doc.name}}\">\n" +
    "                <i class=\"fa\" ng-class=\"getFileExtIcon(doc.name)\"></i>\n" +
    "                {{doc.name}}\n" +
    "            </a>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</script>\n" +
    "\n" +
    "<div class=\"dashboard-page\">\n" +
    "    <div id=\"dashboard-filters\" class=\"well\">\n" +
    "        <form action=\"#\" method=\"post\">\n" +
    "\n" +
    "            <tabset>\n" +
    "                <tab heading=\"{{'dashboard.Base' | translate}}\">\n" +
    "                    <div class=\"row col-md-12\" style=\"margin-top:10px;\">\n" +
    "                        <!-- TYPE -->\n" +
    "                        <fieldset class=\"col-md-4\">\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input class=\"unvalidate\" ng-disabled=\"dashboard.searchContent == 'true'\" ng-checked=\"dashboard.showed.types.length\" ng-change=\"dashboard.showed.types = []; dashboard.showed.subtypes = []\" type=\"checkbox\" ng-model=\"selectType\"/>\n" +
    "                                {{'dashboard.Type' | translate}}\n" +
    "                            </label>\n" +
    "                            <select multiple class=\"form-control unvalidate\" ng-disabled=\"dashboard.searchContent == 'true'\" ng-change=\"selectType = true\" ng-selected=\"selectType\" ng-model=\"dashboard.showed.types\" ng-options=\"type.id as type.id for type in typo\"></select>\n" +
    "                        </fieldset>\n" +
    "                        <!-- SOUS-TYPE -->\n" +
    "                        <fieldset class=\"col-md-4\">\n" +
    "                            <label class=\"checkbox\">\n" +
    "                                <input class=\"unvalidate\" ng-disabled=\"dashboard.searchContent == 'true'\" ng-checked=\"dashboard.showed.subtypes.length\" ng-change=\"dashboard.showed.subtypes = []\" type=\"checkbox\" ng-model=\"selectSubtype\"/>\n" +
    "                                {{'dashboard.SubType' | translate}}\n" +
    "                            </label>\n" +
    "                            <select multiple ng-disabled=\"dashboard.searchContent == 'true'\" class=\"form-control unvalidate\" ng-change=\"selectSubtype = true\" ng-model=\"dashboard.showed.subtypes\" ng-options=\"ssType as ssType for ssType in (typo | sameId:dashboard.showed.types | mergeArrays:'sousTypes')\"></select>\n" +
    "                        </fieldset>\n" +
    "\n" +
    "                        <!-- DATE -->\n" +
    "                        <fieldset class=\"col-md-2\">\n" +
    "                            <div class=\"control-group\">\n" +
    "                                <label class=\"checkbox\">\n" +
    "                                    <input ng-disabled=\"dashboard.searchContent == 'true'\" class=\"unvalidate\" ng-checked=\"dashboard.showed.dateFrom || dashboard.showed.dateTo\" ng-change=\"dashboard.showed.dateFrom='';dashboard.showed.dateTo=''\" ng-model=\"selectDate\" type=\"checkbox\"/>\n" +
    "                                    {{'dashboard.Creation_date' | translate}}\n" +
    "                                </label>\n" +
    "\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <input ng-disabled=\"dashboard.searchContent == 'true'\" ng-change=\"selectDate = true\" type=\"text\" id=\"from\" from=\"true\" linked=\"#to\" ng-model=\"dashboard.showed.dateFrom\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.from\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                                    <span ng-if=\"!!dashboard.showed.dateFrom\" ng-click=\"dashboard.showed.dateFrom = undefined\"\n" +
    "                                          class=\"pointer input-group-addon\">\n" +
    "                                        <i class=\"fa fa-times\"></i>\n" +
    "                                    </span>\n" +
    "                                    <label style=\"display: table-cell;\" ng-if=\"!dashboard.showed.dateFrom\" class=\"input-group-addon btn\" for=\"from\">\n" +
    "                                        <i class=\"fa fa-calendar\"></i>\n" +
    "                                    </label>\n" +
    "\n" +
    "                                </div>\n" +
    "\n" +
    "                                <div class=\"input-group\">\n" +
    "                                    <input ng-disabled=\"dashboard.searchContent == 'true'\" ng-change=\"selectDate = true\" type=\"text\" id=\"to\" linked=\"#from\" ng-model=\"dashboard.showed.dateTo\" class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.to\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                                    <span ng-if=\"!!dashboard.showed.dateTo\" ng-click=\"dashboard.showed.dateTo = undefined\"\n" +
    "                                          class=\"pointer input-group-addon\">\n" +
    "                                        <i class=\"fa fa-times\"></i>\n" +
    "                                    </span>\n" +
    "                                    <label style=\"display: table-cell;\" ng-if=\"!dashboard.showed.dateTo\" class=\"input-group-addon btn\" for=\"to\">\n" +
    "                                        <i class=\"fa fa-calendar\"></i>\n" +
    "                                    </label>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </fieldset>\n" +
    "\n" +
    "                        <div class=\"col-md-2\">\n" +
    "                            <!-- CORBEILLE -->\n" +
    "                            <fieldset class=\"control-group\">\n" +
    "                                <label i18n=\"app.dashboard.filters.files.title\"></label>\n" +
    "                                <select ng-disabled=\"dashboard.searchContent == 'true'\" ng-options=\"corbeille.key as corbeille.value for corbeille in corbeillesListFilter\" ng-model=\"dashboard.showed.dossier\" class=\"form-control unvalidate\">\n" +
    "                                </select>\n" +
    "                            </fieldset>\n" +
    "\n" +
    "                            <!-- CONTENT -->\n" +
    "                            <div>\n" +
    "                                <label for=\"searchValue\">\n" +
    "                                    {{'dashboard.Search' | translate}} :\n" +
    "                                </label>\n" +
    "\n" +
    "                                <label class=\"radio-inline\">\n" +
    "                                    <input class=\"unvalidate\" type=\"radio\" name=\"radio-content\" ng-checked=\"dashboard.showed.dossier === 'content'\" ng-model=\"dashboard.searchContent\" id=\"content-filter\" value=\"true\">\n" +
    "                                    {{'dashboard.Full_text' | translate}}\n" +
    "                                </label>\n" +
    "                                <label class=\"radio-inline\">\n" +
    "                                    <input class=\"unvalidate\" type=\"radio\" name=\"radio-content\" ng-change=\"dashboard.showed.dossier='a-traiter'\" ng-checked=\"dashboard.showed.dossier !== 'content'\" ng-model=\"dashboard.searchContent\" id=\"title-radio\" value=\"false\">\n" +
    "                                    {{'Title' | translate}}\n" +
    "                                </label>\n" +
    "\n" +
    "                                <input type=\"text\" ng-model=\"dashboard.showed.title\" id=\"searchValue\" name=\"searchValue\" class=\"form-control unvalidate\"/>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "\n" +
    "                    </div>\n" +
    "                </tab>\n" +
    "                <tab heading=\"{{'dashboard.Advanced' | translate}} {{metaFilter.length > 0 ? ('- ' + ('Currently' | translate) + ' : ') + (metaFilter | object2string:', ':'name') : ''}}\">\n" +
    "                    <div style=\"margin-top:10px; display: flex;\">\n" +
    "                        <div style=\"flex: 0 0 33%;\">\n" +
    "                            <label style=\"width: 95%;\">\n" +
    "                                {{'dashboard.Available_filters' | translate}}\n" +
    "                                <select size=\"5\" class=\"form-control unvalidate\" ng-change=\"createAdvancedFilter(selectedMetadonneeIndex.index)\" ng-model=\"selectedMetadonneeIndex.index\">\n" +
    "                                    <option value=\"\">-- {{'dashboard.Select_to_create_a_filter' | translate}} --</option>\n" +
    "                                    <optgroup label=\"{{'dashboard.Metadata' | translate}}\">\n" +
    "                                        <option ng-repeat=\"item in metadonnees\" ng-value=\"$index\">{{item.name}}</option>\n" +
    "                                    </optgroup>\n" +
    "                                </select>\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                        <div style=\"flex: 0 0 33%;\">\n" +
    "                            <div ng-hide=\"empty(metaTmpFilter) || metaTmpFilter.name === undefined\">\n" +
    "                                <label>\n" +
    "                                    {{metaTmpFilter.name + ' - Condition'}}\n" +
    "                                    <select class=\"form-control unvalidate\" ng-show=\"metaTmpFilter.values !== undefined\"\n" +
    "                                            ng-model=\"metaTmpFilter.text\"\n" +
    "                                            ng-options=\"val for val in metaTmpFilter.values\">\n" +
    "                                    </select>\n" +
    "                                    <input ng-cloak type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                           ng-model=\"metaTmpFilter.text\"\n" +
    "                                           ng-show=\"metaTmpFilter.values === undefined && (metaTmpFilter.type === 'STRING' || metaTmpFilter.type === 'URL')\">\n" +
    "                                    <input ng-cloak integer type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                           ng-model=\"metaTmpFilter.text\"\n" +
    "                                           ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'INTEGER'\">\n" +
    "                                    <input ng-cloak decimal type=\"text\" class=\"form-control unvalidate\"\n" +
    "                                           ng-model=\"metaTmpFilter.text\"\n" +
    "                                           ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'DOUBLE'\">\n" +
    "                                    <input ng-cloak type=\"checkbox\" class=\"unvalidate\" ng-model=\"metaTmpFilter.text\"\n" +
    "                                           ng-true-value=\"true\" ng-false-value=\"false\"\n" +
    "                                           ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'BOOLEAN'\">\n" +
    "                                    <input ng-cloak\n" +
    "                                           ng-show=\"metaTmpFilter.values === undefined && metaTmpFilter.type === 'DATE'\"\n" +
    "                                           type=\"text\" id=\"fromMeta\" from=\"true\" linked=\"#toMeta\"\n" +
    "                                           ng-model=\"metaTmpFilter.dateFrom\" class=\"form-control unvalidate\"\n" +
    "                                           readonly=\"true\" ip-datepicker i18n=\"app.dashboard.filters.from\" kind=\"attr\"\n" +
    "                                           attr=\"placeholder\"/>\n" +
    "                                </label>\n" +
    "                                <label>\n" +
    "                                    <input ng-show=\"metaTmpFilter.type === 'DATE'\" type=\"text\" id=\"toMeta\"\n" +
    "                                           linked=\"#fromMeta\" ng-model=\"metaTmpFilter.dateTo\"\n" +
    "                                           class=\"form-control unvalidate\" readonly=\"true\" ip-datepicker\n" +
    "                                           i18n=\"app.dashboard.filters.to\" kind=\"attr\" attr=\"placeholder\"/>\n" +
    "                                </label>\n" +
    "\n" +
    "                                <div>\n" +
    "                                    <span class=\"btn btn-info\" ng-click=\"saveAdvancedFilter()\">OK</span>\n" +
    "                                    <span ng-show=\"selectedMetadonneeIndex.bis !== ''\" class=\"btn btn-warning\" ng-click=\"deleteAdvancedFilter()\">{{'Delete' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div style=\"flex: 0 0 33%;\">\n" +
    "                            <label style=\"width:95%;\">\n" +
    "                                {{'dashboard.Current_advanced_filters' | translate}}\n" +
    "                                <select size=\"5\" ng-keydown=\"keyDownAdvancedActiveFilter($event)\" class=\"form-control unvalidate\" ng-change=\"selectAdvancedFilter(selectedMetadonneeIndex.bis)\" ng-model=\"selectedMetadonneeIndex.bis\">\n" +
    "                                    <option value=\"\">-- Édition de filtre --</option>\n" +
    "                                    <option ng-repeat=\"item in metaFilter\" ng-value=\"$index\">{{item.name}} =\n" +
    "                                        {{item.text === '\\'true\\'' ? 'Oui' : (item.text === '\\'false\\'' || item.text ===\n" +
    "                                        'false') ? 'Non' : item.text}}{{item.dateFrom ? item.dateFrom :\n" +
    "                                        ''}}{{item.dateTo ? ' -> ' + item.dateTo : ''}}\n" +
    "                                    </option>\n" +
    "                                </select>\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </tab>\n" +
    "            </tabset>\n" +
    "\n" +
    "            <hr>\n" +
    "\n" +
    "            <!-- DO FILTER -->\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <div class=\"col-md-offset-4 col-md-3\">\n" +
    "                        <span ng-if=\"dashboard.navigation.selected === unsavedFilterName\"\n" +
    "                              class=\"btn btn-default\"\n" +
    "                              ng-click=\"dashboard.save() && (dashboard.navigation.selected !== '')\">\n" +
    "                            <i class=\"fa fa-save\"></i> {{'dashboard.Save_current_filter' | translate}}\n" +
    "                        </span>\n" +
    "                        <span ng-if=\"(!!dashboard.navigation.selected) && (dashboard.navigation.selected !== unsavedFilterName) && (dashboard.navigation.selected !== defaultFilterName)\"\n" +
    "                              class=\"btn btn-danger\"\n" +
    "                              ng-click=\"dashboard.remove()\">\n" +
    "                            <i class=\"fa fa-trash-o\"></i> {{'dashboard.Delete_selected_filter' | translate}}\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-offset-2 col-md-3\">\n" +
    "                        <fieldset>\n" +
    "                            <button ng-click=\"dashboard.resetFilter()\" class=\"btn btn-default\" type=\"reset\">\n" +
    "                                <i class=\"fa fa-undo\"></i>\n" +
    "                                {{'Reset' | translate}}\n" +
    "                            </button>\n" +
    "                            <button ng-click=\"dashboard.doFilter()\" class=\"btn btn-success\" type=\"button\">\n" +
    "                                <i class=\"fa fa-filter\"></i>\n" +
    "                                {{\"Filter\" | translate}}\n" +
    "                            </button>\n" +
    "                        </fieldset>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"alert alert-info row\" style=\"margin-bottom:5px;\">\n" +
    "\n" +
    "        <div class=\"filtreActif col-xs-10\">\n" +
    "            <span>\n" +
    "                <i class=\"fa fa-filter\"></i>\n" +
    "                <strong id=\"titleInfoFiltre\">{{'dashboard.Active_filter' | translate}} :</strong>\n" +
    "            </span>\n" +
    "            <span id=\"filtreDossiers\">\n" +
    "                <strong ng-show=\"currentFilter.dossier && currentFilter.dossier !== 'content'\"\n" +
    "                        i18n=\"{{corbeilleList[currentFilter.dossier]}}\" watch-value=\"currentFilter\"></strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.types.length > 0\" id=\"filtreType\">\n" +
    "                <p> {{'dashboard.of_type' | translate}} </p>\n" +
    "                <strong>\n" +
    "                    <p ng-repeat=\"type in currentFilter.types\">&nbsp;{{type}},</p>\n" +
    "                </strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.subtypes.length > 0\" id=\"filtreSousType\">\n" +
    "                <p>{{'dashboard.of_subtype' | translate}}</p>\n" +
    "                <strong>\n" +
    "                    <p ng-repeat=\"subtype in currentFilter.subtypes\">&nbsp;{{subtype}},</p>\n" +
    "                </strong>\n" +
    "            </span>\n" +
    "            <span id=\"filtreDate\">\n" +
    "                <span ng-show=\"currentFilter.dateFrom\" id=\"filtreFrom\">\n" +
    "                    <p> {{'dashboard.from' | translate}} </p>\n" +
    "                    <strong>{{currentFilter.dateFrom | texttodate | date:'fullDate'}}</strong>\n" +
    "                </span>\n" +
    "                <span ng-show=\"currentFilter.dateTo\" id=\"filtreTo\">\n" +
    "                    <p> {{'dashboard.until' | translate}} </p>\n" +
    "                    <strong>{{currentFilter.dateTo | texttodate | date:'fullDate'}}</strong>\n" +
    "                </span>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.title\" id=\"filtreRecherche\">\n" +
    "                <span class=\"icon-angle-right\"></span>\n" +
    "                 {{'dashboard.Search' | translate}}\n" +
    "                <strong>\"{{currentFilter.title}}\"</strong>\n" +
    "                 {{'dashboard.in' | translate}}\n" +
    "                <strong ng-show=\"currentFilter.dossier == 'content'\">{{'dashboard.Content' | translate}}</strong>\n" +
    "                <strong ng-hide=\"currentFilter.dossier == 'content'\">{{'Title' | translate}}</strong>\n" +
    "            </span>\n" +
    "            <span ng-show=\"currentFilter.metadonnees.length > 0\" id=\"filtreMetadonnees\">\n" +
    "                {{'dashboard.with' | translate}}\n" +
    "                <span ng-repeat=\"meta in currentFilter.metadonnees\">\n" +
    "                    <strong ng-show=\"{{meta.type === 'STRING'}}\">{{meta.name}} = \"{{meta.text}}\",</strong>\n" +
    "                    <strong ng-show=\"{{meta.type === 'BOOLEAN'}}\" >{{meta.name}} = {{(meta.text === \"'true'\" ? 'dashboard.true' : 'dashboard.false') | translate}},</strong>\n" +
    "                    <span ng-show=\"{{meta.type ==='DATE'}}\">\n" +
    "                        <strong>{{meta.name}}</strong>\n" +
    "                        <span ng-show=\"meta.dateFrom\">\n" +
    "                            <p> {{'dashboard.from' | translate}} </p>\n" +
    "                            <strong>{{meta.dateFrom | texttodate | date:'fullDate'}}</strong>\n" +
    "                        </span>\n" +
    "                        <span ng-show=\"meta.dateTo\">\n" +
    "                            <p> {{'dashboard.until' | translate}} </p>\n" +
    "                            <strong>{{meta.dateTo | texttodate | date:'fullDate'}}</strong>\n" +
    "                        </span>\n" +
    "                        ,\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- FILTERS HANDLER -->\n" +
    "        <div class=\"col-xs-2\">\n" +
    "            <select ng-model=\"dashboard.navigation.selected\"\n" +
    "                    ng-options=\"name as translateFilter(name) for (name, filter) in dashboard.list\"\n" +
    "                    ng-change=\"dashboard.change()\"\n" +
    "                    class=\"form-control unvalidate\">\n" +
    "                <option value=\"\">{{defaultFilterName | translate}}</option>\n" +
    "            </select>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div style=\"display:flex; height: 47px; flex-wrap: wrap; align-items: center;\">\n" +
    "        <div style=\"flex: 0 0 33%;\">\n" +
    "            <div id=\"actions\" class=\"left-buttons action-buttons\">\n" +
    "                <a class=\"fa fa-2x text-muted\" ng-class=\"isOnlySignature() ? 'ls-signature' : isOnlyCachet() ? 'ls-stamp' : isOnlyVisa() ? 'fa-check-square-o': 'fa-check'\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('VALIDATION') !== -1)\" ng-click=\"checkReadAndLaunchModal('VALIDATION')\" tooltip=\"{{isOnlySignature() ? 'Signer' : isOnlyCachet() ? 'Cacheter' :  isOnlyVisa() ? 'Viser' : 'Valider'}}\" tooltip-placement=\"bottom\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-check text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('TDT_HELIOS') !== -1)\" ng-click=\"launchModal('TDT_HELIOS')\" i18n=\"app.general.actions.tdt\" kind=\"tooltip\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-reply text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('REMORD') !== -1)\" ng-click=\"launchModal('REMORD')\" tooltip=\"Exercer mon droit de remords\" tooltip-placement=\"right\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-times text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('REJET') !== -1)\" ng-click=\"launchModal('REJET')\" tooltip=\"Rejeter\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-inbox text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('ARCHIVAGE') !== -1)\" ng-click=\"launchModal('ARCHIVAGE')\" tooltip=\"{{'actions.archive' | translate}}\" tooltip-placement=\"right\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-share text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('TRANSFERT_ACTION') !== -1)\" ng-click=\"launchModal('TRANSFERT')\" i18n=\"Transférer les dossiers\" kind=\"tooltip\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-paper-plane-o text-muted\" ng-show=\"(dossiersToDo | intersectionOnProperty:'actions').indexOf('EMAIL') !== -1\" ng-click=\"launchModal('EMAIL')\" i18n=\"app.general.actions.email\" kind=\"tooltip\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-trash-o text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('SUPPRESSION') !== -1)\" ng-click=\"launchModal('SUPPRESSION')\" i18n=\"app.general.actions.delete\" kind=\"tooltip\">\n" +
    "                </a>\n" +
    "                <a class=\"fa fa-2x fa-user text-muted\" ng-show=\"(!isDossierLockedInSelection()) && ((dossiersToDo | intersectionOnProperty:'actions').indexOf('SECRETARIAT') !== -1)\" ng-click=\"launchModal('SECRETARIAT')\" i18n=\"{{currentBureau.isSecretaire ? 'Renvoyer le dossier' : 'app.general.actions.sendToSecretariat'}}\" kind=\"tooltip\">\n" +
    "                </a>\n" +
    "            </div>\n" +
    "\n" +
    "\n" +
    "            <div class=\"text-info\" style=\"padding-left:30px;\">\n" +
    "                <span ng-if=\"dossiersToDo.length > 0\"><i class=\"fa fa-info-circle\"></i> {{('dashboard._number_folder_s_selected' | translate).replace(\"-number-\", dossiersToDo.length)}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div ng-if=\"delegation.hasToShow && delegation.showed && (delegation.titulaires.length > 0 || delegation.current['date-debut-delegation'] < delegation.timestamp || delegation.current['date-fin-delegation'] > delegation.timestamp)\"\n" +
    "             class=\"alert alert-info\" style=\"flex: 0 0 33%;\">\n" +
    "            <script type=\"text/ng-template\" id=\"popover_titulaires\">\n" +
    "                <ul class=\"list-unstyled text-info\">\n" +
    "                    <li ng-repeat=\"titulaire in delegation.titulaires\">{{titulaire}}</li>\n" +
    "                </ul>\n" +
    "            </script>\n" +
    "            <span>\n" +
    "                <strong ng-if=\"delegation.titulaires.length === 0\">\n" +
    "                    Délégations :\n" +
    "                </strong>\n" +
    "                <span ng-if=\"delegation.titulaires.length > 0\">\n" +
    "                    <strong class=\"pointer\" ng-click=\"delegation.showDossiers()\">\n" +
    "                        <i class=\"fa fa-share\"></i> ({{delegation.dossiers}}) {{'dashboard.delegated_folders' | translate}}\n" +
    "                    </strong>\n" +
    "                    <span>\n" +
    "                        <span tooltip=\"Titulaire\" ng-if=\"delegation.titulaires.length === 1\">{{delegation.titulaires[0]}} <i class=\"fa fa-arrow-right\"></i></span>\n" +
    "                        <span ng-if=\"delegation.titulaires.length > 1\">\n" +
    "                            <span class=\"btn btn-default\" data-placement=\"bottom\" bs-popover=\"'popover_titulaires'\" data-trigger=\"hover\">Titulaires</span>&nbsp;<i class=\"fa fa-arrow-right\"></i>\n" +
    "\n" +
    "                        </span>\n" +
    "                    </span>\n" +
    "                </span>\n" +
    "\n" +
    "                <span tooltip=\"Mon Bureau\">{{currentBureau.name}}</span>\n" +
    "                <span tooltip=\"Suppléant\"\n" +
    "                      ng-if=\"delegation.current['date-debut-delegation'] < delegation.timestamp || delegation.current['date-fin-delegation'] > delegation.timestamp\">\n" +
    "                    <i class=\"fa fa-arrow-right\"></i>\n" +
    "                    {{delegation.current.titreCible}}\n" +
    "                </span>\n" +
    "            </span>\n" +
    "        </div>\n" +
    "\n" +
    "\n" +
    "        <div class=\"paginate\" style=\"margin-left: auto;\">\n" +
    "            <p style=\"display:inline-block;\">{{'dashboard.Current_page' | translate}} : {{nav.currentPage+1}}</p>\n" +
    "\n" +
    "            <div ng-if=\"nav.hasPrev || nav.hasNext\" title=\"Précédent\" ng-click=\"changePage(false)\" ng-class=\"{true:'', false:'disabled'}[nav.hasPrev]\" class=\"btn btn-default\">\n" +
    "                <i class=\"fa-chevron-left fa\"></i></div>\n" +
    "            <div ng-if=\"nav.hasPrev || nav.hasNext\" title=\"Suivant\" ng-click=\"changePage(true)\" ng-class=\"{true:'', false:'disabled'}[nav.hasNext]\" class=\"btn btn-default\">\n" +
    "                <i class=\"fa-chevron-right fa\"></i></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "\n" +
    "    <div ng-if=\"!loaded\">\n" +
    "        <div style=\"position:relative;\" class=\"nextDossierInfo\">\n" +
    "            <span class=\"text text-info\">\n" +
    "                <i class=\"fa fa-info-circle\"></i> {{'dashboard.Retrieving_folders___' | translate}}\n" +
    "            </span>\n" +
    "            <span style=\"position: relative; width: 0; z-index: 2000000000; right: 120px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div ng-if=\"loaded && dossiers.length > 0\">\n" +
    "        <div class=\"fixbottom\" id=\"table-container\" style=\" overflow-y: auto; margin-bottom:10px;\">\n" +
    "            <table class=\"table table-condensed table-bordered\" id=\"data-table\">\n" +
    "                <thead>\n" +
    "                <tr>\n" +
    "                    <th>\n" +
    "                        <label>\n" +
    "                            <input class=\"unvalidate\" ng-click=\"setAllCheck(!masterCheckbox); updateActions()\" ng-model=\"masterCheckbox\" type=\"checkbox\">\n" +
    "                        </label>\n" +
    "                    </th>\n" +
    "                    <th ng-repeat=\"data in dashboard.columns.enabled\" ng-class=\"data.key ? 'pointer' : ''\" ng-click=\"sortTable(data)\">\n" +
    "                        <div>\n" +
    "                            <i ng-if=\"nav.currentChamp === data.key\" class=\"fa\" ng-class=\"nav.ascBase ? 'fa-sort-alpha-asc' : 'fa-sort-alpha-desc'\"></i>\n" +
    "                            {{data.i18n | translate}}\n" +
    "                        </div>\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"dossier in dossiers\" ng-class=\"checkboxDossier[$index] ? 'selected-row' : ''\">\n" +
    "                    <td>\n" +
    "                        <label>\n" +
    "                            <input class=\"unvalidate\" ng-model=\"checkboxDossier[$index]\" type=\"checkbox\">\n" +
    "                        </label>\n" +
    "                    </td>\n" +
    "                    <td ng-repeat=\"data in dashboard.columns.enabled\" ng-switch on=\"data.value\">\n" +
    "                        <a href=\"#/apercu\" ng-click=\"selectDossier(dossier)\" ng-switch-when=\"title\">\n" +
    "                            {{dossier[data.value]}}\n" +
    "                            <a class=\"navbar-link\" ng-switch-when=\"title\"\n" +
    "                               ng-show=\"(dossier.banetteName === 'Dossiers à transmettre' || 'Dossiers à relire - annoter') && dossier.actions.indexOf('EDITION') !== -1\"\n" +
    "                               ng-click=\"selectDossier(dossier)\" href=\"#/nouveau\">\n" +
    "                                <i class=\"fa fa-pencil\" tooltip=\"Modifier\"></i>\n" +
    "                            </a>\n" +
    "                            <span class=\"label label-danger float-right\" ng-switch-when=\"title\"\n" +
    "                                  ng-if=\"dossier.dateLimite && dossier.dateLimite < delegation.timestamp\">{{'dashboard.Late' | translate}}</span>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <p ng-switch-when=\"type\">\n" +
    "                            {{dossier['type']}} / {{dossier['sousType']}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"actionDemandee\" class=\"center block\" style=\"min-width:60px;\">\n" +
    "                            <span>\n" +
    "                                <i class=\"fa\" tooltip=\"{{getReadMandatoryTooltip(dossier)}}\"\n" +
    "                                   ng-class=\"dossier.hasRead ? 'fa-eye text-success' : dossier.readingMandatory && dossier.actionDemandee === 'SIGNATURE' ? 'fa-warning text-danger' : 'fa-eye-slash text-yellow'\"></i>\n" +
    "                            </span>\n" +
    "                            <i ng-if=\"!dossier.locked\" class=\"fa fa-lg\" ng-class=\"getIconClass(dossier, data)\" tooltip=\"{{getActionTooltip(dossier, data)}}\"></i>\n" +
    "\n" +
    "                            <i ng-if=\"dossier.locked\" i18n=\"Traitement en cours\" kind=\"tooltip\" placement=\"top\"\n" +
    "                               class=\"fa fa-spinner center fa-spin\"></i>\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"dateEmission\">\n" +
    "                            {{dossier[data.value] | texttodate | date:'dd/MM/yyyy'}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"dateLimite\">\n" +
    "                            {{dossier[data.value] | texttodate | date:'dd/MM/yyyy'}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <div ng-switch-when=\"visual\">\n" +
    "                            <a target=\"_blank\" class=\"xemelios\" ng-click=\"readDossier(dossier)\"\n" +
    "                               ng-if=\"(dossier.documentsPrincipaux[0].name | fileext) === 'xml' && dossier.isXemEnabled && dossier.protocol === 'HELIOS'\"\n" +
    "                               href=\"{{context}}/proxy/alfresco/parapheur/dossiers/{{dossier.id}}/{{dossier.documentsPrincipaux[0].id}}/xemelios\">\n" +
    "                                <img ng-src=\"{{context}}/res/images/xemelios.png\">\n" +
    "                            </a>\n" +
    "                            <a ng-show=\"(dossier.documentsPrincipaux[0].name | fileext) !== 'xml' || !dossier.isXemEnabled || dossier.protocol !== 'HELIOS'\"\n" +
    "                               target=\"_blank\" class=\"wrap\"\n" +
    "                               ng-click=\"readDossier(dossier)\"\n" +
    "                               href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{dossier.documentsPrincipaux[0].id}}/content/{{dossier.documentsPrincipaux[0].name}}\">\n" +
    "                                <i class=\"fa\" ng-class=\"getFileExtIcon(dossier.documentsPrincipaux[0].name)\"></i>\n" +
    "                                {{dossier.documentsPrincipaux[0].name}}\n" +
    "                            </a>\n" +
    "                            <div ng-if=\"dossier.documentsPrincipaux.length > 1\" class=\"dropdown multiDoc\">\n" +
    "                                <button class=\"btn btn-default fa fa-list-ul dropdown-toggle\" id=\"dropdownMenuDocs\"\n" +
    "                                        type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n" +
    "                                </button>\n" +
    "                                <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenuDocs\">\n" +
    "                                    <li role=\"presentation\" class=\"dropdown-header\">{{'dashboard.Main_documents' |\n" +
    "                                        translate}}\n" +
    "                                    </li>\n" +
    "                                    <li ng-repeat=\"doc in dossier.documentsPrincipaux\">\n" +
    "                                        <a target=\"_blank\" class=\"wrap\"\n" +
    "                                           href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{doc.id}}/content/{{doc.name}}\">\n" +
    "                                            <i class=\"fa\" ng-class=\"getFileExtIcon(doc.name)\"></i>\n" +
    "                                            {{doc.name}}\n" +
    "                                        </a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span ng-if=\"!dossier.documentsPrincipaux\" class=\"text-info\"><i\n" +
    "                                    class=\"fa fa-info-circle\"></i> {{'dashboard.No_document' | translate}}</span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <p ng-switch-default>\n" +
    "                            <span ng-if=\"data.type === 'DOUBLE'\">{{dossier[data.value] | number:2}}</span>\n" +
    "                            <span ng-if=\"data.type !== 'DOUBLE'\">{{dossier[data.value]}}</span>\n" +
    "                        </p>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "            <table copy-size=\"table-container\" style=\"position: fixed; pointer-events:none; top:146px; \"\n" +
    "                   class=\"table table-condensed table-bordered\">\n" +
    "                <thead style=\"visibility: hidden; pointer-events: auto; background-color: white; color: #333333;\">\n" +
    "                <tr>\n" +
    "                    <th>\n" +
    "                        <label>\n" +
    "                            <input class=\"unvalidate\" ng-click=\"setAllCheck(!masterCheckbox); updateActions()\" ng-model=\"masterCheckbox\" type=\"checkbox\">\n" +
    "                        </label>\n" +
    "                    </th>\n" +
    "                    <th ng-repeat=\"data in dashboard.columns.enabled\" ng-class=\"data.key ? 'pointer' : ''\"\n" +
    "                        ng-click=\"sortTable(data)\">\n" +
    "                        <div>\n" +
    "                            <i ng-if=\"nav.currentChamp === data.key || nav.currentChamp === data.value\" class=\"fa\" ng-class=\"nav.ascBase ? 'fa-sort-alpha-asc' : 'fa-sort-alpha-desc'\"></i>\n" +
    "                            {{data.i18n | translate}}\n" +
    "                        </div>\n" +
    "                    </th>\n" +
    "                </tr>\n" +
    "\n" +
    "                </thead>\n" +
    "                <tbody class=\"no-border\" style=\"visibility: hidden;\">\n" +
    "                <tr ng-repeat=\"dossier in dossiers\" ng-class=\"checkboxDossier[$index] ? 'selected-row' : ''\">\n" +
    "                    <td>\n" +
    "                        <label>\n" +
    "                            <input class=\"unvalidate\" ng-model=\"checkboxDossier[$index]\" type=\"checkbox\">\n" +
    "                        </label>\n" +
    "                    </td>\n" +
    "                    <td ng-repeat=\"data in dashboard.columns.enabled\" ng-switch on=\"data.value\">\n" +
    "                        <a href=\"#/apercu\" ng-click=\"selectDossier(dossier)\" ng-switch-when=\"title\">\n" +
    "                            {{dossier[data.value]}}\n" +
    "                            <a class=\"navbar-link\" ng-switch-when=\"title\" ng-show=\"(dossier.banetteName === 'Dossiers à transmettre' || 'Dossiers à relire - annoter') && dossier.actions.indexOf('EDITION') !== -1\" ng-click=\"selectDossier(dossier)\" href=\"#/nouveau\">\n" +
    "                                <i class=\"fa fa-pencil\"></i>\n" +
    "                            </a>\n" +
    "                            <span class=\"label label-danger float-right\" ng-switch-when=\"title\" ng-if=\"dossier.dateLimite && dossier.dateLimite < delegation.timestamp\">{{'dashboard.Late' | translate}}</span>\n" +
    "                        </a>\n" +
    "\n" +
    "                        <p ng-switch-when=\"type\">\n" +
    "                            {{dossier['type']}} / {{dossier['sousType']}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"actionDemandee\" class=\"center block\" style=\"min-width:60px;\">\n" +
    "                            <span>\n" +
    "                                <i class=\"fa\" tooltip=\"{{getReadMandatoryTooltip(dossier)}}\"\n" +
    "                                   ng-class=\"dossier.hasRead ? 'fa-eye text-success' : dossier.readingMandatory && dossier.actionDemandee === 'SIGNATURE' ? 'fa-warning text-danger' : 'fa-eye-slash text-yellow'\"></i>\n" +
    "                            </span>\n" +
    "                            <i ng-if=\"!dossier.locked\" class=\"fa fa-lg\" ng-class=\"getIconClass(dossier, data)\" tooltip=\"{{getActionTooltip(dossier, data)}}\"></i>\n" +
    "                            <i ng-if=\"dossier.locked\" i18n=\"Traitement en cours\" kind=\"tooltip\" placement=\"top\" class=\"fa fa-spinner center fa-spin\"></i>\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"dateEmission\">\n" +
    "                            {{dossier[data.value] | texttodate | date:'dd/MM/yyyy'}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <p ng-switch-when=\"dateLimite\">\n" +
    "                            {{dossier[data.value] | texttodate | date:'dd/MM/yyyy'}}\n" +
    "                        </p>\n" +
    "\n" +
    "                        <div ng-switch-when=\"visual\">\n" +
    "                            <a target=\"_blank\" class=\"xemelios\" ng-click=\"readDossier(dossier)\" ng-if=\"(dossier.documentsPrincipaux[0].name | fileext) === 'xml' && dossier.isXemEnabled && dossier.protocol === 'HELIOS'\" href=\"{{context}}/proxy/alfresco/parapheur/dossiers/{{dossier.id}}/{{dossier.documentsPrincipaux[0].id}}/xemelios\">\n" +
    "                                <img ng-src=\"{{context}}/res/images/xemelios.png\">\n" +
    "                            </a>\n" +
    "                            <a ng-if=\"(dossier.documentsPrincipaux[0].name | fileext) !== 'xml' || !dossier.isXemEnabled || dossier.protocol !== 'HELIOS'\" target=\"_blank\" class=\"wrap\" ng-click=\"readDossier(dossier)\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{dossier.documentsPrincipaux[0].id}}/content/{{dossier.documentsPrincipaux[0].name}}\">\n" +
    "                                <i class=\"fa\" ng-class=\"getFileExtIcon(dossier.documentsPrincipaux[0].name)\" ></i>\n" +
    "                                {{dossier.documentsPrincipaux[0].name}}\n" +
    "                            </a>\n" +
    "                            <div ng-if=\"dossier.documentsPrincipaux.length > 1\" class=\"dropdown multiDoc\">\n" +
    "                                <button class=\"btn btn-default fa fa-list-ul dropdown-toggle\" id=\"dropdownMenuDocs\" type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n" +
    "                                </button>\n" +
    "                                <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dropdownMenuDocs\">\n" +
    "                                    <li role=\"presentation\" class=\"dropdown-header\">{{'dashboard.Main_documents' | translate}}</li>\n" +
    "                                    <li ng-repeat=\"doc in dossier.documentsPrincipaux\">\n" +
    "                                        <a target=\"_blank\" class=\"wrap\" href=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{doc.id}}/content/{{doc.name}}\">\n" +
    "                                            <i class=\"fa\" ng-class=\"getFileExtIcon(doc.name)\"></i>\n" +
    "                                            {{doc.name}}</a>\n" +
    "                                    </li>\n" +
    "                                </ul>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <span ng-if=\"!dossier.documentsPrincipaux\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'dashboard.No_document' | translate}}</span>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <p ng-switch-default>\n" +
    "                            <span ng-if=\"data.type === 'DOUBLE'\">{{dossier[data.value] | number:2}}</span>\n" +
    "                            <span ng-if=\"data.type !== 'DOUBLE'\">{{dossier[data.value]}}</span>\n" +
    "                        </p>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <span class=\"text text-info center block\" ng-if=\"dossiers.length === 0 && loaded && !error\">\n" +
    "        <i class=\"fa fa-info-circle\"></i> {{'dashboard.No_folder_found' | translate}}\n" +
    "    </span>\n" +
    "    <span class=\"text text-danger center block\" ng-if=\"error\">\n" +
    "        <i class=\"fa fa-warning\"></i> {{errorMessage}}\n" +
    "    </span>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "");
}]);

angular.module("templates/delegation.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/delegation.html",
    "<div class=\"container delegationPage\">\n" +
    "    <div ng-if=\"!loaded\">\n" +
    "        <div style=\"top:100px;\" class=\"nextDossierInfo\">\n" +
    "        <span class=\"text text-info\">\n" +
    "            <i class=\"fa fa-info-circle\"></i> {{'delegation.Retrieving_current_delegation' | translate}}\n" +
    "        </span>\n" +
    "            <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 120px; top: 100px;\" us-spinner=\"{radius:20, width:8, length: 16}\" ></span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"page-header\" ng-if=\"loaded\">\n" +
    "        <h1>{{'delegation.Delegation' | translate}}</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-3\">\n" +
    "        <legend>Etat actuel :\n" +
    "            <span ng-if=\"delegationEnabled\">\n" +
    "                <span class=\"label label-success\" ng-if=\"when === 'present'\">{{'Activated' | translate}}</span>\n" +
    "                <span class=\"label label-warning\" ng-if=\"when === 'past'\">{{'delegation.Past' | translate}}</span>\n" +
    "                <span class=\"label label-info\" ng-if=\"when === 'future'\">{{'delegation.Upcoming' | translate}}</span>\n" +
    "            </span>\n" +
    "            <span class=\"label label-danger\" ng-show=\"!delegationEnabled\">{{'Desactivated' | translate}}</span>\n" +
    "        </legend>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"col-md-9\" ng-if=\"loaded\">\n" +
    "        <div>\n" +
    "            <label style=\"\" ng-class=\"delegationActivated ? 'text-danger' : 'text-success'\" for=\"activatedDelegation\">\n" +
    "                <i ng-if=\"!delegationActivated\" class=\"fa fa-2x fa-toggle-off\"></i>\n" +
    "                <i ng-if=\"delegationActivated\" class=\"fa fa-2x fa-toggle-on\"></i>\n" +
    "                <span ng-if=\"!delegationActivated\">{{'Admin.Bureaux.BuMod_Deleg_Enable' | translate}}</span>\n" +
    "                <span ng-if=\"delegationActivated\">Désactiver la délégation</span>\n" +
    "                <input style=\"display: none;\" class=\"unvalidate\" id=\"activatedDelegation\" type=\"checkbox\" ng-click=\"selectedDelegation.idCible = undefined\" ng-model=\"delegationActivated\">\n" +
    "            </label>\n" +
    "        </div>\n" +
    "        <form name=\"delegation\" ng-show=\"delegationActivated\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label\" for=\"parapheurCible\">{{'delegation.Target_desk' | translate}}</label>\n" +
    "                <div class=\"input-group\">\n" +
    "                    <div class=\"right-inner-addon\">\n" +
    "                        <i class=\"fa fa-question-circle\" tooltip-trigger=\"click\" tooltip-placement=\"bottom\" tooltip=\"{{'Admin.Dossiers.Find_Desk_Info' | translate}}\"></i>\n" +
    "                        <input id=\"parapheurCible\" type=\"text\" class=\"form-control unvalidate\" ng-model=\"selectedBureauForDelegation\" placeholder=\"{{'Admin.Dossiers.Find_Desk' | translate}}\"\n" +
    "                               typeahead=\"b as b.title for b in bureau.associes | filter:$viewValue | limitTo:5\"\n" +
    "                               typeahead-on-select=\"checkDelegation($item)\"\n" +
    "                               name=\"parapheurCible\" required>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <span class=\"input-group-addon\" style=\"opacity:0.7;\" ng-class=\"!!selectedBureauForDelegation.id ? 'label-success' : 'label-warning'\">\n" +
    "                        {{!!selectedBureauForDelegation.id ? ('Admin.Dossiers.Find_Desk_Sel' | translate) : ('Admin.Dossiers.Find_Desk_None' | translate)}}\n" +
    "                    </span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" >\n" +
    "                <label class=\"control-label\" for=\"delegationFrom\">{{'delegation.Start_date' | translate}}</label>\n" +
    "                    <div class=\"input-group col-md-6\">\n" +
    "                        <input type=\"text\" id=\"delegationFrom\" ng-change=\"checkDelegation()\" min-date=\"0\" from=\"true\" name=\"delegationFrom\" linked=\"#delegationTo\" return-format=\"timestamp\" ng-model=\"selectedDelegation['date-debut-delegation']\" class=\"form-control unvalidate\" ip-datepicker ng-required=\"delegationActivated\" readonly='true'/>\n" +
    "                        <span ng-if=\"!!selectedDelegation['date-debut-delegation']\" ng-click=\"selectedDelegation['date-debut-delegation'] = undefined\"\n" +
    "                              class=\"pointer input-group-addon\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </span>\n" +
    "                        <label for=\"delegationFrom\" ng-if=\"!selectedDelegation['date-debut-delegation']\" class=\"input-group-addon\">\n" +
    "                            <i class=\"fa fa-calendar\"></i>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4 ng-show=\"delegation.delegationFrom.$error.required\">{{'delegation.At_least_one_date_is_required' | translate}}</h4>\n" +
    "                    </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\" >\n" +
    "                <label class=\"control-label\" for=\"delegationTo\">{{'delegation.End_date' | translate}}</label>\n" +
    "                <div class=\"controls\">\n" +
    "                    <div class=\"input-group validation-control\">\n" +
    "                        <input type=\"text\" id=\"delegationTo\" ng-change=\"checkDelegation()\" min-date=\"0\" name=\"delegationTo\" linked=\"#delegationFrom\" return-format=\"timestamp\" ng-model=\"selectedDelegation['date-fin-delegation']\" class=\"form-control unvalidate\" ip-datepicker ng-required=\"!selectedDelegation['date-debut-delegation'] && delegationActivated\" readonly='true'/>\n" +
    "                        <span ng-if=\"!!selectedDelegation['date-fin-delegation']\" ng-click=\"selectedDelegation['date-fin-delegation'] = undefined\"\n" +
    "                              class=\"pointer input-group-addon\">\n" +
    "                            <i class=\"fa fa-times\"></i>\n" +
    "                        </span>\n" +
    "                        <label for=\"delegationTo\" ng-if=\"!selectedDelegation['date-fin-delegation']\" class=\"input-group-addon\">\n" +
    "                            <i class=\"fa fa-calendar\"></i>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4 ng-show=\"delegation.delegationTo.$error.required\">{{'delegation.At_least_one_date_is_required' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"checkbox\" ng-show=\"delegationActivated\">\n" +
    "                <label for=\"dossiersActuels\">\n" +
    "                    <input type=\"checkbox\" class=\"unvalidate\" id=\"dossiersActuels\" ng-model=\"selectedDelegation['deleguer-presents']\">\n" +
    "                    {{'delegation.Current_folders' | translate}}\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <span class=\"text-danger\" ng-if=\"selectedDelegation.willItLoop\"><i class=\"fa fa-warning\"></i> {{'delegation.Warning_delegation_cycle' | translate}}</span>\n" +
    "        <span class=\"btn btn-info\" ng-click=\"save()\" ng-disabled=\"selectedDelegation.willItLoop || !delegation.$valid\">\n" +
    "            <i class=\"fa fa-floppy-o\"></i>\n" +
    "            {{'Save' | translate}}\n" +
    "        </span>\n" +
    "        <span class=\"text text-success\" ng-if=\"saved\">\n" +
    "            <i class=\"fa fa-check\"></i> {{'delegation.Delegation_saved' | translate}}\n" +
    "        </span>\n" +
    "    </div>\n" +
    "\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/logout.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/logout.html",
    "<div class=\"container\">\n" +
    "    <h1>{{'logout.Logout' | translate}}</h1>\n" +
    "    <div><p>{{'logout.You_are_disconnected_from_iParapheur' | translate}}</p><p>{{'logout.To_ensure_this_disconnection_you_need_to_close_your_browser' | translate}}</p></div>\n" +
    "\n" +
    "    <div class=\"btn btn-success\" ng-click=\"login()\">{{'logout.Reconnect' | translate}}</div>\n" +
    "</div>");
}]);

angular.module("templates/nouveau.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/nouveau.html",
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"row-fluid\">\n" +
    "        <div class=\"col-md-8\">\n" +
    "            <form name='nouveau' novalidate>\n" +
    "                <legend>{{'app.nouveau.infos.title' |i18n}}</legend>\n" +
    "                <div class=\"col-md-6 spanright\">\n" +
    "                    <div class=\"form-group col-md-8 mandatory-group\">\n" +
    "                        <label for=\"titre\">\n" +
    "                            {{'app.nouveau.infos.filename' | i18n}}\n" +
    "                        </label>\n" +
    "                        <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                        <input type=\"text\" ng-focus=\"focusTitle()\" ng-blur=\"blurTitle()\" ng-model=\"dossier.title\"\n" +
    "                               id=\"titre\" name=\"titre\" class=\"form-control\" required/>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-md-8\">\n" +
    "                        <label for=\"visibility\">\n" +
    "                            {{'app.nouveau.infos.visibility.title' | i18n}}\n" +
    "                        </label>\n" +
    "                        <select class=\"unvalidate form-control\" id=\"visibility\" ng-model=\"dossier.visibility\"\n" +
    "                                ng-options=\"visible.value as visible.text for visible in visibilityChoices\">\n" +
    "                            <option value=\"public\">{{'app.nouveau.infos.visibility.public' | i18n}}</option>\n" +
    "                            <option value=\"confidentiel\">{{'app.nouveau.infos.visibility.confidential' | i18n}}</option>\n" +
    "                            <option value=\"group\">{{'app.nouveau.infos.visibility.group' | i18n}}</option>\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <!-- Config dossier & metadonnees -->\n" +
    "\n" +
    "                    <div class=\"form-group col-md-8\">\n" +
    "                        <label style=\"width: 100%;\" class=\"control-label\" for=\"date-limite\">{{'app.nouveau.infos.limitdate' | i18n}}\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <input readonly=\"true\" ip-datepicker return-format=\"timestamp\" type=\"text\" id=\"date-limite\"\n" +
    "                                       ng-model=\"dossier.dateLimite\" class=\"form-control unvalidate\">\n" +
    "                                <span ng-if=\"!dossier.dateLimite\" class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </span>\n" +
    "                                <span ng-if=\"!!dossier.dateLimite\" ng-click=\"dossier.dateLimite = undefined\" class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                            </div>\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div ng-if=\"circuit.sigFormat == 'XAdES/enveloped'\" class=\"form-group col-md-8 mandatory-group\">\n" +
    "                        <label for=\"xpath\"><i class=\"fa fa-question-circle\" tooltip-trigger=\"mouseenter\"\n" +
    "                                              tooltip-placement=\"right\"\n" +
    "                                              tooltip=\"{{'nouveau.Xpath_Help' | translate}}\"></i>\n" +
    "                            {{'app.nouveau.infos.xpathSig' | i18n}}</label>\n" +
    "                        <span class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                        <input class=\"form-control\" placeholder=\".\" ng-model=\"dossier['xPathSignature']\" id=\"xpath\"\n" +
    "                               type=\"text\" required>\n" +
    "                    </div>\n" +
    "                    <div ng-if=\"!circuit.isDigitalSignatureMandatory\" class=\"form-group col-md-8\">\n" +
    "                        <div class=\"controls\">\n" +
    "                            <label class=\"control-label checkbox\" for=\"signature-papier-ck\">\n" +
    "                                <input ng-model=\"dossier.isSignPapier\" id=\"signature-papier-ck\" type=\"checkbox\"\n" +
    "                                       class=\"unvalidate\">\n" +
    "                                <span>{{'app.nouveau.infos.papersignature' | i18n}}</span>\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-8\">\n" +
    "                        <br>\n" +
    "                        <legend ng-show=\"metaInfos.length > 0\" class=\"mini\">{{'app.nouveau.meta' | i18n}}</legend>\n" +
    "                        <div>\n" +
    "                            <div ng-switch on=\"metaInfo.type\" class=\"control-group\"\n" +
    "                                 ng-repeat=\"(metaName, metaInfo) in metaInfos\">\n" +
    "                                <div class=\"form-group\"\n" +
    "                                     ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                                     ng-switch-when=\"DATE\" ng-hide=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger\"\n" +
    "                                          ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                                    <div class=\"input-group\">\n" +
    "                                        <input ng-change=\"metaChanged()\" ng-cloak=\"\" ip-id=\"metaInfo.id\"\n" +
    "                                               return-format=\"timestamp\" readonly=\"true\" ip-datepicker type=\"text\"\n" +
    "                                               ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                               ng-model=\"dossier.metadatas[metaInfo.id].value\" class=\"form-control\"\n" +
    "                                               ng-required=\"metaInfo.mandatory === 'true' && !metaInfo.values\">\n" +
    "                                        <span ng-click=\"dossier.metadatas[metaInfo.id].value = ''\"\n" +
    "                                              class=\"pointer input-group-addon\">X</span>\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\"\n" +
    "                                     ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                                     ng-switch-when=\"STRING\" ng-hide=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger\"\n" +
    "                                          ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                           ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                           ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                           class=\"form-control\"\n" +
    "                                           ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\"\n" +
    "                                     ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                                     ng-switch-when=\"URL\" ng-hide=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger\"\n" +
    "                                          ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <input ng-cloak type=\"text\" ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                           ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                           ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                           class=\"form-control\"\n" +
    "                                           ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group mandatory-group\"\n" +
    "                                     ng-switch-when=\"INTEGER\" ng-hide=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger\"\n" +
    "                                          ng-if=\"metaInfo.mandatory === 'true'\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Int'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                                    <input type=\"text\" integer ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                           ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                           class=\"form-control\"\n" +
    "                                           ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group mandatory-group\"\n" +
    "                                     ng-switch-when=\"DOUBLE\" ng-hide=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span ng-if=\"metaInfo.mandatory === 'true'\"\n" +
    "                                          class=\"fa fa-warning label label-danger\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <span class=\"label label-info\">\n" +
    "                                                                <i class=\"fa-info-circle fa\"></i>\n" +
    "                                                                {{'Admin.Typologie.Ty_Sub_Meta_Double'\n" +
    "                                                                | translate}}\n" +
    "                                                            </span>\n" +
    "                                    <input type=\"text\" decimal ng-change=\"metaChanged()\" id=\"{{metaInfo.id}}\"\n" +
    "                                           ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                           class=\"form-control\"\n" +
    "                                           ng-required=\"metaInfo.mandatory === 'true'  && !metaInfo.values\">\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\"\n" +
    "                                     ng-class=\"{true:'mandatory-group', false:''}[metaInfo.mandatory === 'true']\"\n" +
    "                                     ng-switch-when=\"BOOLEAN\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger\"\n" +
    "                                          ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                            ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                            ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                            class=\"form-control\" ng-required=\"metaInfo.mandatory === 'true'\">\n" +
    "                                        <option ng-hide=\"metaInfo.mandatory === 'true'\" value=\"\"></option>\n" +
    "                                        <option value=\"true\">Oui</option>\n" +
    "                                        <option value=\"false\">Non</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                                <div class=\"form-group\" ng-show=\"metaInfo.values\">\n" +
    "                                    <label class=\"control-label\" for=\"{{metaInfo.id}}\">{{metaInfo.realName}}</label>\n" +
    "                                    <span class=\"fa fa-warning label label-danger float-right\"\n" +
    "                                          ng-show=\"{{metaInfo.mandatory === 'true'}}\"> {{'Mandatory' | translate}}</span>\n" +
    "                                    <select id=\"{{metaInfo.id}}\" ng-change=\"metaChanged()\"\n" +
    "                                            ng-change=\"valuesMetaUndefined(metaInfo.id)\"\n" +
    "                                            ng-model=\"dossier.metadatas[metaInfo.id].value\"\n" +
    "                                            ng-class=\"{true:'', false:'unvalidate'}[metaInfo.mandatory === 'true']\"\n" +
    "                                            class=\"form-control\"\n" +
    "                                            ng-required=\"metaInfo.mandatory === 'true'  && metaInfo.values\">\n" +
    "                                        <option ng-hide=\"metaInfo.mandatory === 'true'\" value=\"\"></option>\n" +
    "                                        <option ng-repeat=\"value in metaInfo.values\" ng-value=\"value\">{{value}}</option>\n" +
    "                                    </select>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <!-- selection & affichage circuit -->\n" +
    "                    <div class=\"form-group col-md-8\">\n" +
    "                        <label for=\"select-type\">{{'app.nouveau.infos.type' | i18n}}</label>\n" +
    "                        <select class=\"form-control\" id=\"select-type\" ng-disabled=\"flags.disabled\"\n" +
    "                                ng-model=\"dossier.type\" ng-change=\"dossier.sousType = ''\"\n" +
    "                                ng-options=\"value.id as value.id for value in typo | orderBy:'id'\" required>\n" +
    "                            <option value=\"\">-- {{'nouveau.Type_selection' | translate}} --</option>\n" +
    "                        </select>\n" +
    "\n" +
    "                        <div class=\"input-help\">\n" +
    "                            <h4>Requis</h4>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-8\">\n" +
    "                        <label for=\"select-sous-type\">{{'app.nouveau.infos.subtype' | i18n}}</label>\n" +
    "                        <select class=\"form-control\" id=\"select-sous-type\" ng-disabled=\"flags.disabled\"\n" +
    "                                ng-model=\"dossier.sousType\"\n" +
    "                                ng-options=\"value for value in (typo | findWithId:dossier.type).sousTypes | orderBy:'toString()'\"\n" +
    "                                required>\n" +
    "                            <option value=\"\">-- {{'nouveau.SubType_selection' | translate}} --</option>\n" +
    "                        </select>\n" +
    "\n" +
    "                        <div class=\"input-help\">\n" +
    "                            <h4>{{'Mandatory' | translate}}</h4>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-md-8\">\n" +
    "                        <!-- Affichage circuit +  si script de séléction, reload proposé ? -->\n" +
    "                        <legend ng-show=\"!empty(circuit)\" class=\"mini\">\n" +
    "                            <i class=\"fa fa-road\"></i>\n" +
    "                            {{'app.general.validation.course' | i18n}}\n" +
    "                        </legend>\n" +
    "                        <div>\n" +
    "                            <p class=\"label label-info label-block\" ng-show=\"circuit.hasSelectionScript\">\n" +
    "                                {{'nouveau.Circuit_selection_script_detected' | translate}}\n" +
    "                                {{'nouveau.You_need_to_fill_form_before_reloading_circuit' | translate}}\n" +
    "                            </p>\n" +
    "                            <span ng-disabled=\"!nouveau.$valid\" style=\"display:block;\" ng-click=\"upgrade()\"\n" +
    "                                  ng-show=\"circuit.hasSelectionScript && (metaHasChange || dossier.documents[0].id != null)\"\n" +
    "                                  class=\"btn btn-primary\">{{'nouveau.Display_circuit_preview' | translate}}</span>\n" +
    "                            <ol>\n" +
    "                                <li ng-if=\"!circuit.hasSelectionScript\" ng-repeat=\"etape in circuit.etapes\">\n" +
    "                                    <i class=\"fa-fw fa-lg\" ng-class=\"getIconClass(etape.actionDemandee)\" tooltip=\"{{getActionTooltip(etape.actionDemandee)}}\"></i>\n" +
    "                                    <span ng-if=\"etape.transition === 'VARIABLE'\" class=\"little-select\">\n" +
    "                                        <i class=\"fa fa-fw\" tooltip-trigger=\"mouseenter\"\n" +
    "                                           tooltip=\"Sélectionner un acteur pour l'étape variable\"\n" +
    "                                           ng-class=\"acteursVariables[$index] ? 'text-success fa-check-square-o' : 'fa-question'\"></i>\n" +
    "                                        <select required class=\"unvalidate\"\n" +
    "                                                ng-options=\"acteur.id as acteur.name for acteur in currentBureau.associes\"\n" +
    "                                                ng-model=\"acteursVariables[$index]\">\n" +
    "                                            <option value=\"\"></option>\n" +
    "                                        </select>\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"isPreviousVariable($index)\">\n" +
    "                                        <i class=\"fa fa-info-circle fa-fw text-info\"\n" +
    "                                           tooltip=\"Circuit à étape variable, la cible 'Chef de...' sera affichée après la création de dossier\"></i> Chef de...\n" +
    "                                    </span>\n" +
    "                                    <span ng-if=\"etape.transition !== 'VARIABLE' && !isPreviousVariable($index)\">\n" +
    "                                        {{etape.parapheurName}}\n" +
    "                                    </span>\n" +
    "                                </li>\n" +
    "                                <li ng-if=\"circuit.hasSelectionScript\" ng-repeat=\"etape in dossier.circuit.etapes\">\n" +
    "                                    <i class=\"fa-fw fa-lg\" ng-class=\"getIconClass(etape.actionDemandee)\" tooltip=\"{{getActionTooltip(etape.actionDemandee)}}\"></i>\n" +
    "                                    {{etape.parapheurName}}\n" +
    "                                </li>\n" +
    "                                <li ng-if=\"circuit.hasSelectionScript && !dossier.circuit && circuit.etapes\"\n" +
    "                                    ng-repeat=\"etape in circuit.etapes\">\n" +
    "                                    <i class=\"fa-fw fa-lg\" ng-class=\"getIconClass(etape.actionDemandee)\" tooltip=\"{{getActionTooltip(etape.actionDemandee)}}\"></i>\n" +
    "                                    {{etape.parapheurName}}\n" +
    "                                </li>\n" +
    "                            </ol>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div dropzone class=\"fade mainDocDrop dropzone\"\n" +
    "             ng-class=\"(circuit.isMultiDocument && (!isMainDocumentListFull())) ? 'mainDocDrop' : 'allDropZone'\">\n" +
    "            <div class=\"indropzone\">\n" +
    "                <span ng-if=\"circuit.isMultiDocument\">\n" +
    "                    {{'nouveau.Drop_main_documents_here' | translate}}\n" +
    "                </span>\n" +
    "                <span ng-if=\"!circuit.isMultiDocument\">\n" +
    "                    {{'nouveau.Drop_documents_here' | translate}}\n" +
    "                </span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div ng-if=\"circuit.isMultiDocument\" dropzone class=\"fade annDocDrop dropzone\"\n" +
    "             ng-class=\"(circuit.isMultiDocument && (isMainDocumentListFull())) ? 'allDropZone' : ''\">\n" +
    "            <div class=\"indropzone\">\n" +
    "                <span>{{'nouveau.Drop_annexes_here' | translate}}</span>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"col-md-4 filesHandler\">\n" +
    "            <legend>{{'app.nouveau.mainfile' | i18n}}</legend>\n" +
    "            <span ng-if=\"docsExists\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'nouveau.There_is_an_uploaded_document_already' | translate}}</span>\n" +
    "\n" +
    "            <!-- Gestion documents & sauvegarde -->\n" +
    "            <form fileupload=\"document|zip\"\n" +
    "                  main-document=\"isMainDocument()\"\n" +
    "                  signature-format=\"getSignatureFormat()\"\n" +
    "                  protocol=\"getProtocol()\"\n" +
    "                  wrong-type=\"wrongType(ext, isValid, isAuthorized)\"\n" +
    "                  check-if-exist=\"checkIfExist(name)\"\n" +
    "                  exist-file=\"existFile(name)\"\n" +
    "                  fileinput=\"#docinput\"\n" +
    "                  dropzone=\".mainDocDrop\"\n" +
    "                  file-added=\"addDocument(files, circuit.isMultiDocument || dossier.documents[0].id == null)\"\n" +
    "                  upload-success=\"documentAdded(data, index)\"\n" +
    "                  upload-finish=\"uploadFinished(data, index)\"\n" +
    "                  upload-error=\"uploadError(data, index)\"\n" +
    "                  action=\"{{addDocumentUrl}}\"\n" +
    "                  method=\"POST\"\n" +
    "                  enctype=\"multipart/form-data\">\n" +
    "                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                <div class=\"fileupload-buttonbar\">\n" +
    "                    <div tooltip=\"{{!circuit.isMultiDocument && dossier.documents.length > 0 ? 'Vous ne pouvez ajouter qu\\'un seul document principal sur cette typologie' : ''}}\" class=\"fileinput-button\">\n" +
    "                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                        <span style=\"margin-right:10px; z-index:100;\" class=\"btn btn-success fileinput-button force-display\"\n" +
    "                              ng-disabled=\"(circuit.isMultiDocument && isMainDocumentListFull()) || (!circuit.isMultiDocument && dossier.documents.length > 0)\">\n" +
    "                            <i class=\"icon-plus icon-white\"></i>\n" +
    "                            <span><i class=\"fa fa-plus-circle\"></i> {{'nouveau.Adding_a_main_document' | translate}}</span>\n" +
    "                            <input ui-multiple=\"dossier.documents.length > 0\" id=\"docinput\" type=\"file\" name=\"file\">\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "                    <input type=\"hidden\" name=\"reloadMainDocument\" value=\"false\">\n" +
    "                    <input type=\"hidden\" name=\"isMainDocument\" ng-value=\"isMainDocument()\">\n" +
    "                    <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                    <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "            <!-- Ajout de pièce annexe dans le cas du multi-document -->\n" +
    "            <form fileupload=\"document|zip\"\n" +
    "                  main-document=\"false\"\n" +
    "                  signature-format=\"getSignatureFormat()\"\n" +
    "                  protocol=\"getProtocol()\"\n" +
    "                  dropzone=\".annDocDrop\"\n" +
    "                  wrong-type=\"wrongType(ext, isValid, isAuthorized)\"\n" +
    "                  check-if-exist=\"checkIfExist(name)\"\n" +
    "                  exist-file=\"existFile(name)\"\n" +
    "                  fileinput=\"#docinputAnnexe\"\n" +
    "                  file-added=\"addDocument(files, false)\"\n" +
    "                  upload-success=\"documentAdded(data, index)\"\n" +
    "                  upload-finish=\"uploadFinished(data, index)\"\n" +
    "                  upload-error=\"uploadError(data, index)\"\n" +
    "                  action=\"{{addDocumentUrl}}\"\n" +
    "                  method=\"POST\"\n" +
    "                  enctype=\"multipart/form-data\">\n" +
    "                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                <div class=\"fileupload-buttonbar\" >\n" +
    "                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                    <div tooltip=\"{{!circuit.isMultiDocument && dossier.documents.length < 1 ? 'Merci d\\'ajouter un document principal avant d\\'ajouter une annexe' : ''}}\" class=\"fileinput-button\">\n" +
    "                        <span class=\"btn btn-info fileinput-button force-display\"\n" +
    "                              ng-disabled=\"!circuit.isMultiDocument && dossier.documents.length < 1\">\n" +
    "                            <i class=\"icon-plus icon-white\"></i>\n" +
    "                            <span><i class=\"fa fa-plus\"></i> {{'nouveau.Adding_an_annex' | translate}}</span>\n" +
    "                            <input ui-multiple=\"dossier.documents.length > 0\" id=\"docinputAnnexe\" type=\"file\" name=\"file\">\n" +
    "                        </span>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <input type=\"hidden\" name=\"reloadMainDocument\" value=\"false\">\n" +
    "                    <input type=\"hidden\" name=\"isMainDocument\" value=\"false\">\n" +
    "                    <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                    <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "            <form ng-if=\"dossier.documents.length > 0 && extension(dossier.documents[0].name).toLowerCase() === 'xml'\"\n" +
    "                  fileupload=\"pdf\"\n" +
    "                  signature-format=\"getSignatureFormat()\"\n" +
    "                  protocol=\"getProtocol()\"\n" +
    "                  wrong-type=\"wrongPDF(ext)\"\n" +
    "                  fileinput=\"#visuinput\"\n" +
    "                  file-added=\"updateVisu(files)\"\n" +
    "                  upload-success=\"updateVisuEnd(data, index)\"\n" +
    "                  action=\"{{addVisuelUrl}}\"\n" +
    "                  method=\"POST\"\n" +
    "                  enctype=\"multipart/form-data\">\n" +
    "                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                <div class=\"fileupload-buttonbar\">\n" +
    "                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                    <span class=\"btn btn-warning fileinput-button force-display\">\n" +
    "                        <i class=\"fa fa-eye\"></i>\n" +
    "                        <span ng-if=\"dossier.documents[0].visuelPdf\">{{'nouveau.Updating_visual' | translate}}</span>\n" +
    "                        <span ng-if=\"!dossier.documents[0].visuelPdf\">{{'nouveau.Adding_visual' | translate}}</span>\n" +
    "                        <input ui-multiple=\"dossier.documents.length > 0\" id=\"visuinput\" type=\"file\" name=\"file\">\n" +
    "                    </span>\n" +
    "                    <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                    <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                    <input type=\"hidden\" name=\"document\" value=\"{{dossier.documents[0].id}}\">\n" +
    "                </div>\n" +
    "            </form>\n" +
    "\n" +
    "            <div class=\"marginDocument\">\n" +
    "                <legend class=\"mini\">\n" +
    "                    {{('nouveau.Main_document' | translate)}} <span ng-if=\"circuit.isMultiDocument\" class=\"text-info\"><i\n" +
    "                        class=\"fa fa-info-circle\"></i> {{('nouveau.MultiDoc_typology_number_maximum' | translate).replace(\"-number-\", mainDocsMax)}}</span>\n" +
    "                </legend>\n" +
    "                <ul ui-sortable=\"getSortableOptions('.annexesDocList')\" class=\"mainDocList\"\n" +
    "                    ng-model=\"documentsPrincipaux\">\n" +
    "                    <li delete ng-repeat=\"document in documentsPrincipaux\">\n" +
    "                        <div>\n" +
    "                            <form ng-if=\"document.canDelete && documentsPrincipaux.length === 1\"\n" +
    "                                  fileupload=\"document\"\n" +
    "                                  signature-format=\"getSignatureFormat()\"\n" +
    "                                  protocol=\"getProtocol()\"\n" +
    "                                  main-document=\"true\"\n" +
    "                                  wrong-type=\"wrongType(ext, isValid, isAuthorized)\"\n" +
    "                                  file-added=\"beginReplace(files)\"\n" +
    "                                  upload-success=\"endReplace(data, index)\"\n" +
    "                                  upload-finish=\"uploadFinished(data, index)\"\n" +
    "                                  upload-error=\"replaceError(data, index)\"\n" +
    "                                  fileinput=\"#replaceMain\"\n" +
    "                                  action=\"{{addDocumentUrl}}\"\n" +
    "                                  method=\"POST\"\n" +
    "                                  enctype=\"multipart/form-data\">\n" +
    "                                <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "                                <div class=\"fileupload-buttonbar\">\n" +
    "                                    <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "                                    <i tooltip=\"Remplacer\" class=\"fa fa-exchange fileinput-button force-display\">\n" +
    "                                        &nbsp;\n" +
    "                                        <input id=\"replaceMain\" type=\"file\" name=\"file\">\n" +
    "                                    </i>\n" +
    "                                    <input type=\"hidden\" name=\"reloadMainDocument\" value=\"true\">\n" +
    "                                    <input type=\"hidden\" name=\"isMainDocument\" value=\"true\">\n" +
    "                                    <input type=\"hidden\" name=\"browser\" value=\"notIe\">\n" +
    "                                    <input type=\"hidden\" name=\"dossier\" value=\"{{dossier.id}}\">\n" +
    "                                </div>\n" +
    "                            </form>\n" +
    "                            <span ng-if=\"document.isLocked\">\n" +
    "                                <i class=\"fa fa-info-circle text-info\"\n" +
    "                                   tooltip=\"{{'nouveau.Transforming___' | translate}}\"></i>\n" +
    "                            </span>\n" +
    "                            <span><i ng-if=\"document.canDelete && documentsPrincipaux.length > 1\"\n" +
    "                                     ng-click=\"document.state = 'delete'; removeDocument(document)\"\n" +
    "                                     class=\"fa fa-times\"></i> {{document.name}}</span>\n" +
    "                            <br>\n" +
    "                            <span ng-if=\"document.visuelPdf\"><a target=\"_blank\"\n" +
    "                                                                href=\"{{context}}/proxy/alfresco/api/node/content%3bph%3avisuel-pdf/workspace/SpacesStore/{{document.id}}/{{document.name}}-visuel.pdf\"><i\n" +
    "                                    class=\"fa fa-eye\"></i> {{'nouveau.Visual' | translate}}</a></span>\n" +
    "\n" +
    "                            <span ng-if=\"document.isProtected\" class=\"text-warning\">\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                {{'nouveau.Protected_PDF' | translate}}\n" +
    "                            </span>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'delete'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Deleting___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'saving'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-info\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Saving___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'replace'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Replacing___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'visuel'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Updating_visual___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "                <legend class=\"mini\">\n" +
    "                    {{'nouveau.Annex_es_' | translate}}\n" +
    "                </legend>\n" +
    "                <ul ui-sortable=\"getSortableOptions('.mainDocList')\" class=\"annexesDocList\" ng-model=\"documentsAnnexes\">\n" +
    "                    <li delete ng-repeat=\"document in documentsAnnexes\">\n" +
    "                        <div>\n" +
    "                            <span ng-if=\"document.isLocked\">\n" +
    "                                <i class=\"fa fa-info-circle text-info\"\n" +
    "                                   tooltip=\"{{'nouveau.Transforming___' | translate}}\"></i>\n" +
    "                            </span>\n" +
    "                            <span><i\n" +
    "                                    ng-if=\"document.canDelete && (documentsAnnexes.length > 1 || documentsPrincipaux.length > 0)\"\n" +
    "                                    ng-click=\"document.state = 'delete'; removeDocument(document)\"\n" +
    "                                    class=\"fa fa-trash\" tooltip=\"Supprimer le document\"></i> {{document.name}}</span><br>\n" +
    "                            <span class=\"text text-info\"\n" +
    "                                  ng-if=\"documentsAnnexes.length == 1 && documentsPrincipaux.length == 0\"><i\n" +
    "                                    class=\"fa fa-info-circle\"></i> En l'absence de pièce principale, cette annexe sera transformée en pièce principale lors de la sauvegarde.</span>\n" +
    "                            <br>\n" +
    "\n" +
    "                            <span ng-if=\"document.isProtected\" class=\"text-warning\">\n" +
    "                                <i class=\"fa fa-warning\"></i>\n" +
    "                                {{'nouveau.Protected_PDF' | translate}}\n" +
    "                            </span>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'delete'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-warning\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Deleting___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div bn-slide-show=\"document.state === 'saving'\" class=\"progress progress-striped active\">\n" +
    "                                <div class=\"progress-bar progress-bar-info\" role=\"progressbar\" aria-valuenow=\"45\"\n" +
    "                                     aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                                    <span>{{'nouveau.Saving___' | translate}}</span>\n" +
    "                                </div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"alert alert-danger\" ng-if=\"existLog\">\n" +
    "                <span><i\n" +
    "                        class=\"fa fa-warning\"></i> {{'nouveau.Error_on_file_transfert' | translate}} : {{message}}</span>\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-danger\" ng-if=\"result\">\n" +
    "                {{result.data.reponse | i18n}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"typeError\" class=\"alert alert-danger\">\n" +
    "                {{'nouveau.Error_The_file_type_isnt_handled_by_the_iParapheur' | translate}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"formatError\" class=\"alert alert-danger\">\n" +
    "                {{'nouveau.Error_The_file_type_does_not_match_the_selected_type' | translate}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"pdfError\" class=\"alert alert-danger\">\n" +
    "                {{'nouveau.Error_The_visual_has_to_be_a_PDF_file' | translate}}\n" +
    "            </div>\n" +
    "            <div ng-show=\"requestError\" class=\"alert alert-danger\">\n" +
    "                {{requestErrorMessage}}\n" +
    "            </div>\n" +
    "\n" +
    "            <hr>\n" +
    "\n" +
    "            <span class=\"btn btn-warning\" ng-click=\"cancel()\">\n" +
    "                <i class=\"fa fa-times-circle-o\"></i>\n" +
    "                {{'Back' | translate}}\n" +
    "            </span>\n" +
    "            <span ng-click=\"save()\" class=\"btn btn-primary\" ng-disabled=\"!(nouveau.$valid && loadingDocuments === 0 && !upgrading)\">\n" +
    "                <i class=\"fa fa-floppy-o\"></i>\n" +
    "                {{'Save' | translate}}\n" +
    "            </span>\n" +
    "\n" +
    "            <span class=\"btn btn-success\"\n" +
    "                  ng-disabled=\"!nouveau.$valid || dossier.documents[0].id == null || loadingDocuments > 0 || upgrading\"\n" +
    "                  ng-click=\"currentBureau.isSecretaire ? saveAndSecretariat() : saveAndEmit()\">\n" +
    "                <i class=\"fa fa-floppy-o\"></i>\n" +
    "                {{'nouveau.Save_and_send' | translate}}\n" +
    "            </span>\n" +
    "\n" +
    "            <hr>\n" +
    "            <div bn-slide-show=\"upgrading\" class=\"progress progress-striped active\">\n" +
    "                <div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow=\"45\" aria-valuemin=\"0\"\n" +
    "                     aria-valuemax=\"100\" style=\"width: 100%\">\n" +
    "                    <span>{{'nouveau.Saving_properties' | translate}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"circuit.hasSelectionScript ? dossier.circuit.etapes[0].actionDemandee === 'VISA' && dossier.circuit.etapes[0].parapheurName === currentBureau.name : circuit.etapes[0].actionDemandee === 'VISA' && circuit.etapes[0].parapheurName === currentBureau.name && circuit.etapes[0].transition !== 'VARIABLE'\"\n" +
    "                 class=\"text text-info\">\n" +
    "                <i class=\"fa fa-info-circle\"></i> {{'nouveau.You_are_asked_for_a_visa_in_the_first_step' | translate}}\n" +
    "            </div>\n" +
    "\n" +
    "            <div ng-if=\"redirect\" class=\"text text-success\">\n" +
    "                <i class=\"fa fa-check\"></i> {{'nouveau.Folder_saved_Redirect_to_preview' | translate}}\n" +
    "            </div>\n" +
    "            <div ng-if=\"errorSavingProperties\" class=\"text text-danger\">\n" +
    "                <i class=\"fa fa-times\"></i> {{'nouveau.An_error_occured_on_folder_save' | translate}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/options.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options.html",
    "<div class=\"optionsPage\">\n" +
    "    <div class=\"col-md-3\">\n" +
    "        <h1 class=\"underscore\">{{\"Options.Prefs\" | translate}}</h1>\n" +
    "        <div class=\"bs-sidebar affix\" role=\"complementary\">\n" +
    "            <ul class=\"nav bs-sidenav\">\n" +
    "                <li ng-class=\"properties['parapheur.ihm.options.password.show'] === 'true' ? 'active' : ''\" ng-show=\"properties['parapheur.ihm.options.password.show'] === 'true'\">\n" +
    "                    <a bs-tab href=\"#infos\" data-toggle=\"tab\"><i class=\"fa fa-lock\"></i> {{\"Options.PasswordTitle\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-class=\"properties['parapheur.ihm.options.password.show'] !== 'true' && properties['parapheur.ihm.options.theme.show'] === 'true' ? 'active' : ''\"\n" +
    "                    ng-show=\"properties['parapheur.ihm.options.theme.show'] === 'true'\">\n" +
    "                    <a bs-tab href=\"#theme\" data-toggle=\"tab\"><i class=\"fa fa-text-width\"></i> {{\"Options.Theme\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-class=\"properties['parapheur.ihm.options.password.show'] !== 'true' && properties['parapheur.ihm.options.theme.show'] !== 'true' ? 'active' : ''\">\n" +
    "                    <a bs-tab href=\"#personaliser\" data-toggle=\"tab\"><i class=\"fa fa-tachometer\"></i> {{\"Options.Dashboard\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a bs-tab href=\"#archives\" data-toggle=\"tab\"><i class=\"fa fa-inbox\"></i> {{\"Options.Archives\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li>\n" +
    "                    <a bs-tab href=\"#notifications\" data-toggle=\"tab\"><i class=\"fa fa-envelope-o\"></i> {{\"Options.Notifs\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-show=\"properties['parapheur.ihm.options.signature.show'] === 'true'\">\n" +
    "                    <a bs-tab href=\"#signature\" data-toggle=\"tab\"><i class=\"fa fa-picture-o\"></i> {{\"Options.Signature\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-show=\"properties['parapheur.ihm.options.langue.show'] === 'true'\">\n" +
    "                    <a bs-tab href=\"#lang\" data-toggle=\"tab\"><i class=\"fa fa-globe\"></i> {{\"Options.Language\" | translate}}</a>\n" +
    "                </li>\n" +
    "                <li ng-show=\"bureaux.length > 1\">\n" +
    "                    <a bs-tab href=\"#order\" data-toggle=\"tab\"><i class=\"fa fa-list-ul\"></i> {{\"Options.BureauOrder\" | translate}}</a>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"tab-content col-md-9\">\n" +
    "        <div ng-class=\"properties['parapheur.ihm.options.password.show'] === 'true' ? 'active' : ''\" class=\"tab-pane\" id=\"infos\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/informations.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-class=\"properties['parapheur.ihm.options.password.show'] !== 'true' && properties['parapheur.ihm.options.theme.show'] === 'true' ? 'active' : ''\"\n" +
    "             class=\"tab-pane\" id=\"theme\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/theme.html'\"></div>\n" +
    "        </div>\n" +
    "        <div ng-class=\"properties['parapheur.ihm.options.password.show'] !== 'true' && properties['parapheur.ihm.options.theme.show'] !== 'true' ? 'active' : ''\" class=\"tab-pane\" id=\"personaliser\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/dashboard.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"archives\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/archives.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"notifications\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/notifications.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"signature\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/signature.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"lang\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/langue.html'\"></div>\n" +
    "        </div>\n" +
    "        <div class=\"tab-pane\" id=\"order\">\n" +
    "            <div class=\"include-animate\" ng-include=\"'templates/options/orderBureaux.html'\"></div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/options/archives.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/archives.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Arch_Title' | translate}}</h2>\n" +
    "    <form name='dashboard' class=\"form-horizontal\" ng-class=\"{launched: !archiveChanged}\" novalidate>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\" for=\"pagesizeArchives\">{{'Options.Dash_Page' | translate}} :</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-change=\"archiveChanged=true\" ng-model=\"prefs.pagesizeArchives\" ng-value=\"prefs.pagesizeArchives\" id=\"pagesizeArchives\" min=\"5\" max=\"100\" name=\"pagesizeArchives\" integer required>\n" +
    "                <div class=\"input-help\">\n" +
    "                    <h4>{{'Options.Dash_Page_Helper' | translate}} 100</h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\">{{'Options.Dash_Col_Order' | translate}} :</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <label>{{'Options.Dash_Col_Show' | translate}}</label>\n" +
    "                    <ul class=\"enabledColumns countainer-fluid\" ng-mousedown=\"archiveChanged=true\" ui-sortable=\"{connectWith:'.disabledColumns', cancel:'.ui-disabled'}\" ng-model=\"archiveColumns.enabled\">\n" +
    "                        <li title=\"{{item.i18n | translate}}\" ng-repeat=\"item in archiveColumns.enabled\" ng-class=\"{true:'ui-disabled disabled', false:''}[item.disabled]\" class=\"col-md-12 btn btn-default force-display\">{{item.i18n | translate}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <label>{{'Options.Dash_Col_Hide' | translate}}</label>\n" +
    "                    <ul class=\"disabledColumns countainer-fluid\" ng-mousedown=\"archiveChanged=true\" ui-sortable=\"{connectWith:'.enabledColumns'}\" ng-model=\"archiveColumns.disabled\">\n" +
    "                        <li title=\"{{item.i18n | translate}}\" ng-repeat=\"item in archiveColumns.disabled\" class=\"col-md-12 btn btn-default force-display\">{{item.i18n | translate}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"alert alert-success col-md-4\" ng-show=\"!archiveChanged && archiveSaved\">{{'Options.Dash_Success' | translate}}</div>\n" +
    "            <div class=\"col-md-4\" ng-show=\"!(!archiveChanged && archiveSaved)\"></div>\n" +
    "            <div class=\"controls col-md-4\">\n" +
    "                <button type=\"submit\" ng-init=\"archiveChanged = false; archiveSaved = false;\" ng-click=\"saveArchivePrefs(); archiveChanged = false; archiveSaved = true;\" class=\"btn btn-primary\">\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}\n" +
    "                </button>\n" +
    "                <button class=\"btn btn-primary\" disabled>\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/options/dashboard.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/dashboard.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Dash_Title' | translate}}</h2>\n" +
    "    <form name='dashboard' class=\"form-horizontal\" ng-class=\"{launched: !dashChanged}\" novalidate>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-md-offset-4 col-md-6\">\n" +
    "                <div class=\"checkbox\">\n" +
    "                    <label for=\"delegation\">{{'Options.Dash_Deleg' | translate}}\n" +
    "                        <input type=\"checkbox\" ng-change=\"dashChanged = true\" id=\"delegation\" ng-model=\"prefs.displayDelegation\" name=\"delegation\">\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\" for=\"pagesize\">{{'Options.Dash_Page' | translate}} :</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-change=\"dashChanged=true\" ng-model=\"prefs.pagesize\" ng-value=\"prefs.pagesize\" id=\"pagesize\" min=\"1\" max=\"{{properties['parapheur.ihm.dashboard.lignes.max'] < 0 ? 30 : properties['parapheur.ihm.dashboard.lignes.max'] === 0 ? Number.MAX_VALUE : properties['parapheur.ihm.dashboard.lignes.max']}}\" name=\"pagesize\" integer required>\n" +
    "                <div class=\"input-help\">\n" +
    "                    <h4>{{'Options.Dash_Page_Helper' | translate}} {{properties['parapheur.ihm.dashboard.lignes.max'] < 0 ? 30 : properties['parapheur.ihm.dashboard.lignes.max'] === 0 ? Number.MAX_VALUE : properties['parapheur.ihm.dashboard.lignes.max']}}</h4>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\" for=\"propSort\">{{'Options.Dash_Sort' | translate}}</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <select class=\"form-control\" ng-change=\"dashChanged=true\" ng-model=\"prefs.propSort\" id=\"propSort\" name=\"propSort\" ng-options=\"col.key as (col.i18n | translate) for col in sort\" required>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"col-md-offset-4 col-md-6\">\n" +
    "                <div class=\"checkbox\">\n" +
    "                    <label for=\"ascSort\">{{'Options.Dash_Asc' | translate}}\n" +
    "                        <input type=\"checkbox\" ng-change=\"dashChanged = true\" id=\"ascSort\" ng-model=\"prefs.asc\" name=\"ascSort\">\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\" for=\"filterDefault\">{{'Options.Dash_Default_Filter' | translate}}</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <select class=\"form-control\" ng-change=\"dashChanged=true\" ng-model=\"prefs.filterDefault\" id=\"filterDefault\" name=\"propSort\" ng-options=\"name as name for (name, filter) in prefs.savedFilters\">\n" +
    "                    <option value=\"\">--- {{'Options.Dash_Filter_None' | translate}} ---</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <label class=\"control-label col-md-4\">{{'Options.Dash_Col_Order' | translate}} :</label>\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <label>{{'Options.Dash_Col_Show' | translate}}</label>\n" +
    "                    <ul class=\"enabledColumns container-fluid\" ng-mousedown=\"dashChanged=true\" ui-sortable=\"{connectWith:'.disabledColumns', cancel:'.ui-disabled'}\" ng-model=\"columns.enabled\">\n" +
    "                        <li title=\"{{item.i18n | translate}}\" ng-repeat=\"item in columns.enabled\" ng-class=\"{true:'ui-disabled disabled', false:''}[item.disabled]\" class=\"col-md-12 btn btn-default force-display\">\n" +
    "                            {{item.i18n | translate}}\n" +
    "                        </li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <label>{{'Options.Dash_Col_Hide' | translate}}</label>\n" +
    "                    <ul class=\"disabledColumns container-fluid\" ng-mousedown=\"dashChanged=true\" ui-sortable=\"{connectWith:'.enabledColumns'}\" ng-model=\"columns.disabled\">\n" +
    "                        <li title=\"{{item.i18n | translate}}\" ng-repeat=\"item in columns.disabled\" class=\"col-md-12 btn btn-default force-display\">{{item.i18n | translate}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\" ng-if=\"false\">\n" +
    "            <label class=\"control-label col-md-4\">Coloration</label>\n" +
    "            <ul class=\"col-md-offset-4\" ui-sortable ng-model=\"colorations\" ng-mousedown=\"dashChanged=true\">\n" +
    "                <li ng-repeat=\"color in colorations\"  class=\"colorations\">\n" +
    "                    <span style=\"background-color: {{color.backgroundColor}}; color:{{color.textColor}};\">{{color.property.i18n | translate}}\n" +
    "                        <span ng-repeat=\"test in color.test\"> {{test.comparator}} {{test.value}}</span>\n" +
    "                        <span class=\"fa fa-trash-o\" ng-click=\"deleteColoration($index)\"></span>\n" +
    "                    </span>\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "            <div class=\"controls col-md-offset-4 col-md-6\">\n" +
    "                <div class=\"btn btn-success force-display\" ng-mousedown=\"dashChanged=true\" ng-click=\"addColoration()\">Ajouter une coloration</div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"alert alert-success col-md-4\" ng-show=\"!dashChanged && dashSaved\">{{'Options.Dash_Success' | translate}}</div>\n" +
    "            <div class=\"col-md-4\" ng-show=\"!(!dashChanged && dashSaved)\"></div>\n" +
    "            <div class=\"controls col-md-4\">\n" +
    "                <button type=\"submit\" ng-init=\"dashChanged = false; dashSaved = false;\" ng-click=\"saveDashboardPrefs(); dashChanged = false; dashSaved = true;\" class=\"btn btn-primary\">\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}</button>\n" +
    "                <button class=\"btn btn-primary\" disabled>\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/options/informations.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/informations.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{\"Options.Pass_Title\" | translate}}</h2>\n" +
    "    <form role=\"form\" name='password' class=\"form-horizontal\" ng-class=\"{launched: !respPass.error && !respPass.success && respPass.status.code != 401 && launched}\" novalidate>\n" +
    "        <div class=\"col-md-6\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-md-4\" for=\"password\">{{'Options.Pass_Current' | translate}}</label>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <input type=\"password\" id=\"password\" class=\"form-control\" name=\"password\"\n" +
    "                           placeholder=\"{{'Options.Pass_Current' | translate}}\" ng-model=\"newpass.old\" required>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4>{{'Options.Pass_Current_Alert' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-md-4\" for=\"newpass\">{{'Options.Pass_New' | translate}}</label>\n" +
    "                <div class=\" col-md-6\">\n" +
    "                    <input check-strength=\"{{properties['parapheur.ihm.password.strength']}}\" type=\"password\"\n" +
    "                           id=\"newpass\" class=\"form-control\" name=\"newpass\"\n" +
    "                           placeholder=\"{{'Options.Pass_New' | translate}}\" ng-model=\"newpass.newOne\" required>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <label class=\"control-label col-md-4\" for=\"confirmpass\">{{'Options.Pass_Confirm' | translate}}</label>\n" +
    "                <div class=\"col-md-6\">\n" +
    "                    <input type=\"password\" class=\"form-control\" confirm-with=\"newpass\" id=\"confirmpass\" name=\"confirm\"\n" +
    "                           placeholder=\"{{'Options.Pass_Confirm' | translate}}\" ng-model=\"newpass.confirm\" required>\n" +
    "                    <div class=\"input-help\">\n" +
    "                        <h4>{{'Options.Pass_Confirm_Alert' | translate}}</h4>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"alert alert-success col-md-4\" ng-show=\"respPass.success\">{{'Options.Pass_Success' |\n" +
    "                    translate}}\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-error col-md-4\" ng-show=\"respPass.error\">{{'Options.Pass_Error' | translate}}\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-warning col-md-4\" ng-show=\"respPass.status.code == 401\">{{'Options.Pass_Invalid'\n" +
    "                    | translate}}\n" +
    "                </div>\n" +
    "                <div class=\"alert alert-info col-md-4\"\n" +
    "                     ng-hide=\"respPass.error || respPass.success || respPass.status.code == 401 || !launched\">\n" +
    "                    <throbber></throbber>\n" +
    "                    <span>{{'Options.Pass_Saving' | translate}}</span>\n" +
    "                </div>\n" +
    "                <div class=\"col-md-4\" ng-show=\"!launched\"></div>\n" +
    "                <div class=\"controls col-md-4\">\n" +
    "                    <button type=\"submit\" ng-init=\"launched = false;\" ng-click=\"changePassword(); launched = true;\"\n" +
    "                            class=\"btn btn-primary\">\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Options.Pass_Save' | translate}}\n" +
    "                    </button>\n" +
    "                    <button class=\"btn btn-primary\" disabled>\n" +
    "                        <i class=\"fa fa-floppy-o\"></i>\n" +
    "                        {{'Options.Pass_Save' | translate}}</button>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div strength-result=\"{{properties['parapheur.ihm.password.strength']}}\" error=\"password.newpass.$error\"\n" +
    "             class=\"col-md-6\" ng-if=\"password.newpass.$error._length != undefined\"></div>\n" +
    "\n" +
    "    </form>\n" +
    "\n" +
    "</div>");
}]);

angular.module("templates/options/langue.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/langue.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Lang_Title' | translate}}</h2>\n" +
    "    <form name='lang' class=\"form-horizontal col-md-6\" novalidate>\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label class=\"control-label\" for=\"choosen\">{{'Options.Lang_Choice' | translate}}</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <select class=\"form-control unvalidate\" id=\"choosen\" name=\"choosen\" ng-model=\"prefs.language\">\n" +
    "                    <option value=\"fr\">{{'Options.Lang_FR' | translate}}</option>\n" +
    "                    <option value=\"en\">{{'Options.Lang_EN' | translate}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <div class=\"controls\">\n" +
    "                <button type=\"submit\" ng-click=\"saveLanguage()\" class=\"btn btn-primary\">\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Lang_Change' | translate}}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/options/notifications.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/notifications.html",
    "<div >\n" +
    "    <div class=\"container-fluid\">\n" +
    "    <h2 class=\"underscore\">{{'Options.Notif_Title' | translate}}</h2>\n" +
    "    <form ng-class=\"{launched: !notifications.changed}\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label class=\"block\">\n" +
    "                        {{'Notif_Mail' | translate}}\n" +
    "                        <i class=\"fa fa-info-circle\" tooltip=\"{{'Notif_Helper' | translate}}\"></i>\n" +
    "                        <input type=\"text\" ng-change=\"notifications.cronDidChange()\" class=\"form-control col-md-12\" ng-model=\"notifications.mail\" id=\"email\" name=\"email\" />\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-md-12\">\n" +
    "                <h3 class=\"small\"><strong>{{'Notif_Freq' | translate}}</strong></h3>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-radio\" id=\"radio-never\" value=\"never\" ng-model=\"notifications.mode\" />\n" +
    "                                {{'Notif_None' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-radio\" id=\"radio-always\" value=\"always\" ng-model=\"notifications.mode\" />\n" +
    "                                {{'Notif_Unit' | translate}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"hourly\" ng-model=\"notifications.mode\">\n" +
    "                                {{'Notif_Every' | translate}}\n" +
    "                            </label>\n" +
    "                            <div style=\"width:auto; display:inline-block;\">\n" +
    "                                <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.hourly\">\n" +
    "                                    <option value=\"1\">1</option>\n" +
    "                                    <option value=\"2\">2</option>\n" +
    "                                    <option value=\"3\">3</option>\n" +
    "                                    <option value=\"4\">4</option>\n" +
    "                                    <option value=\"6\">6</option>\n" +
    "                                    <option value=\"12\">12</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                            {{'Notif_Hour' | translate}}\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"daily\" ng-model=\"notifications.mode\">\n" +
    "                                {{'Notif_daily' | translate}}\n" +
    "                            </label>\n" +
    "                            <div style=\"width:auto; display:inline-block;\">\n" +
    "                                <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.daily\">\n" +
    "                                    <option value=\"0\">0h</option>\n" +
    "                                    <option value=\"1\">1h</option>\n" +
    "                                    <option value=\"2\">2h</option>\n" +
    "                                    <option value=\"3\">3h</option>\n" +
    "                                    <option value=\"4\">4h</option>\n" +
    "                                    <option value=\"5\">5h</option>\n" +
    "                                    <option value=\"6\">6h</option>\n" +
    "                                    <option value=\"7\">7h</option>\n" +
    "                                    <option value=\"8\">8h</option>\n" +
    "                                    <option value=\"9\">9h</option>\n" +
    "                                    <option value=\"10\">10h</option>\n" +
    "                                    <option value=\"11\">11h</option>\n" +
    "                                    <option value=\"12\">12h</option>\n" +
    "                                    <option value=\"13\">13h</option>\n" +
    "                                    <option value=\"14\">14h</option>\n" +
    "                                    <option value=\"15\">15h</option>\n" +
    "                                    <option value=\"16\">16h</option>\n" +
    "                                    <option value=\"17\">17h</option>\n" +
    "                                    <option value=\"18\">18h</option>\n" +
    "                                    <option value=\"19\">19h</option>\n" +
    "                                    <option value=\"20\">20h</option>\n" +
    "                                    <option value=\"21\">21h</option>\n" +
    "                                    <option value=\"22\">22h</option>\n" +
    "                                    <option value=\"23\">23h</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"form-group\">\n" +
    "                    <div class=\"col-md-12\">\n" +
    "                        <div class=\"radio\">\n" +
    "                            <label>\n" +
    "                                <input class=\"unvalidate\" ng-change=\"notifications.cronDidChange()\" type=\"radio\" name=\"notif-abo-radio\" value=\"weekly\" ng-model=\"notifications.mode\">\n" +
    "                                {{'Notif_weekly' | translate}}\n" +
    "                            </label>\n" +
    "                            <div style=\"width:auto; display:inline-block;\">\n" +
    "                                <select class=\"unvalidate form-control\" ng-change=\"notifications.cronDidChange()\" ng-model=\"notifications.cron.weekly\">\n" +
    "                                    <option value=\"1\">{{'Mon' | translate}}</option>\n" +
    "                                    <option value=\"2\">{{'Tue' | translate}}</option>\n" +
    "                                    <option value=\"3\">{{'Wed' | translate}}</option>\n" +
    "                                    <option value=\"4\">{{'Thu' | translate}}</option>\n" +
    "                                    <option value=\"5\">{{'Fri' | translate}}</option>\n" +
    "                                    <option value=\"6\">{{'Sat' | translate}}</option>\n" +
    "                                    <option value=\"7\">{{'Sun' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <span ng-click=\"notifications.saveCronPrefs()\" class=\"btn btn-primary\">\n" +
    "            <i class=\"fa fa-floppy-o\"></i>\n" +
    "            {{'Options.Dash_Save' | translate}}</span>\n" +
    "        <button class=\"btn btn-primary\" disabled>\n" +
    "            <i class=\"fa fa-floppy-o\"></i>\n" +
    "            {{'Options.Dash_Save' | translate}}</button>\n" +
    "        <span class=\"alert alert-success\" ng-show=\"!notifications.changed && notifications.saved\">{{'Options.Dash_Success' | translate}}</span>\n" +
    "        <span class=\"alert alert-danger\" ng-show=\"!notifications.changed && notifications.error\">{{notifications.error}}</span>\n" +
    "    </form>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/options/orderBureaux.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/orderBureaux.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Ord_Title' | translate}}</h2>\n" +
    "    <form name='orderBureaux' class=\"form-horizontal\" ng-class=\"{launched: !orderChanged}\" novalidate>\n" +
    "        <div class=\"form-group\">\n" +
    "            <div class=\"controls col-md-6\">\n" +
    "                <div class=\"col-md-12\">\n" +
    "                    <ul class=\"enabledColumns orderBureaux container-fluid\" ng-mousedown=\"orderChanged=true\" ui-sortable ng-model=\"orderedBureaux\">\n" +
    "                        <li ng-repeat=\"item in orderedBureaux\" class=\"col-md-12 btn btn-default force-display\">{{item.name}}</li>\n" +
    "                    </ul>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group\">\n" +
    "\n" +
    "            <div class=\"controls col-md-4\">\n" +
    "                <button type=\"submit\" ng-init=\"orderChanged = false; orderSaved = false;\" ng-click=\"saveOrderPrefs(); orderChanged = false; orderSaved = true;\" class=\"btn btn-primary\">\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}</button>\n" +
    "                <button class=\"btn btn-primary\" disabled>\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Dash_Save' | translate}}</button>\n" +
    "            </div>\n" +
    "            <div class=\"alert alert-success col-md-4\" ng-show=\"!orderChanged && orderSaved\">{{'Options.Dash_Success' | translate}}</div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/options/signature.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/signature.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Sig_Title' | translate}}</h2>\n" +
    "    <span ng-show=\"isEmptyOrNull(signNode)\" class=\"text-info\"><i class=\"fa fa-info-circle\"></i> {{'Options.Sig_NoScan' | translate}}</span>\n" +
    "\n" +
    "    <img ng-if=\"signNode\" class=\"signatureImg\" ng-cloak ng-src=\"{{context}}/proxy/alfresco/api/node/workspace/SpacesStore/{{signNode}}/content?timestamp={{timeimg || 0}}\">\n" +
    "\n" +
    "    <form fileupload=\"image\" wrong-type=\"wrongType(ext)\" fileinput=\"#fileinput\" upload-success=\"signatureSaved(data, index)\" action=\"{{changeSignatureUrl}}\" method=\"POST\" enctype=\"multipart/form-data\">\n" +
    "        <!-- The fileupload-buttonbar contains buttons to add/delete files and start/cancel the upload -->\n" +
    "        <div class=\"fileupload-buttonbar\">\n" +
    "            <!-- The fileinput-button span is used to style the file input field as button -->\n" +
    "        <span class=\"btn btn-default fileinput-button\">\n" +
    "            <i class=\"fa fa-folder-open-o\"></i>\n" +
    "            <span>{{'Browse' | translate}}</span>\n" +
    "            <input id=\"fileinput\" type=\"file\" name=\"file\">\n" +
    "        </span>\n" +
    "            <input type=\"hidden\" name=\"username\" value=\"{{config.username}}\">\n" +
    "        </div>\n" +
    "        <div ng-show=\"typeError\" class=\"alert alert-error\">{{'Options.Sig_Err1' | translate}}<br>{{'Options.Sig_Err2' | translate}}</div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "");
}]);

angular.module("templates/options/theme.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/options/theme.html",
    "<div>\n" +
    "    <h2 class=\"underscore\">{{'Options.Theme_Title' | translate}}</h2>\n" +
    "    <form name='theme' class=\"form-horizontal col-md-6\" novalidate>\n" +
    "        <div class=\"alert\" ng-class=\"{'alert-success':themeChanged, 'alert-info':!themeChanged}\">\n" +
    "            {{'Options.Theme_Actual' | translate}} : {{prefs.theme}}\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <label class=\"control-label\" for=\"choosen\">{{'Options.Theme_Choice' | translate}}</label>\n" +
    "            <div class=\"controls\">\n" +
    "                <select diff-current=\"prefs\" attr=\"theme\" class=\"form-control\" id=\"choosen\" name=\"choosen\" ng-model=\"choosen\" required>\n" +
    "                    <option ng-repeat=\"theme in themes\" ng-value=\"{{theme}}\">{{theme}}</option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"form-group col-md-12\">\n" +
    "            <div class=\"controls\">\n" +
    "                <button type=\"submit\" ng-click=\"changeTheme(choosen); themeChanged = true\" class=\"btn btn-primary\">\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Theme_Save' | translate}}</button>\n" +
    "                <button class=\"btn btn-primary\" disabled>\n" +
    "                    <i class=\"fa fa-floppy-o\"></i>\n" +
    "                    {{'Options.Theme_Save' | translate}}</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>");
}]);

angular.module("templates/policy.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/policy.html",
    "<div class=\"container about\">\n" +
    "    <div class=\"page-header\">\n" +
    "        <h1>{{'Policy' | translate}}</h1>\n" +
    "    </div>\n" +
    "\n" +
    "    <h2>\n" +
    "        Informations relatives au règlement européen sur la protection des données personnelles (RGPD)\n" +
    "    </h2>\n" +
    "\n" +
    "    <p>\n" +
    "        La création de votre compte utilisateur sur i-Parapheur demande la saisie de données personnelles vous\n" +
    "        concernant. Vous trouverez ci-dessous le détail des informations collectées ainsi que les traitements effectués.\n" +
    "        Ces données sont collectées uniquement dans le cadre de votre activité professionnelle et pour l'utilisation\n" +
    "        exclusive de l'application i-Parapheur.\n" +
    "\n" +
    "        <br><br>\n" +
    "\n" +
    "        Le fonctionnement dans les conditions nominales et recommandées de l'application, ne permet pas de partager ou\n" +
    "        de diffuser à un tiers vos informations personnelles. Vous pouvez demander à tout moment à l'administrateur de\n" +
    "        la plateforme de vous communiquer l'ensemble des informations collectées pour la création de votre compte.\n" +
    "    </p>\n" +
    "\n" +
    "    <h2>\n" +
    "        Collecte\n" +
    "    </h2>\n" +
    "\n" +
    "    <p>\n" +
    "        Lors de la création de votre compte utilisateur, les informations suivantes sont collectées :\n" +
    "    </p>\n" +
    "\n" +
    "    <ul>\n" +
    "        <li>Nom d'utilisateur</li>\n" +
    "        <li>Adresse de messagerie professionnelle</li>\n" +
    "        <li>Identifiant de connexion</li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <h2>\n" +
    "        Traitements\n" +
    "    </h2>\n" +
    "\n" +
    "\n" +
    "    <p>\n" +
    "        Vos informations personnelles sont utilisées pour le bon fonctionnement de i-Parapheur dans les cas listés\n" +
    "        ci-après :\n" +
    "    </p>\n" +
    "    <p>\n" +
    "        Affichage de vos données personnelles :\n" +
    "    </p>\n" +
    "    <ul>\n" +
    "        <li>liste des utilisateurs : votre identifiant de connexion, votre nom et votre courriel apparaissent dans la liste</li>\n" +
    "        <li>journal d'événement de dossier : votre nom apparaît pour chaque action (visa, signature, rejet, annotation publique) de votre part sur un dossier.</li>\n" +
    "    </ul>\n" +
    "\n" +
    "    <h2>\n" +
    "        Droit à l'oubli\n" +
    "    </h2>\n" +
    "\n" +
    "    <p>\n" +
    "        Sur votre demande ou à la demande de l’administrateur de i-Parapheur, votre compte utilisateur peut être supprimé\n" +
    "        définitivement.\n" +
    "        <br>\n" +
    "        La suppression de votre compte laissera les traces de votre activité sur les documents circulant dans i-Parapheur, le temps de leur présence. Ces traces disparaîtront avec l'extraction de ces documents hors de i-Parapheur.\n" +
    "    </p>\n" +
    "\n" +
    "\n" +
    "</div>");
}]);

angular.module("templates/stats.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/stats.html",
    "<div class=\"row-fluid\">\n" +
    "    <div class=\"col-md-4\">\n" +
    "        <!-- contenu -->\n" +
    "        <div class=\"col-md-11 col-md-offset-1\">\n" +
    "            <form name=\"statistiques\" novalidate=\"novalidate\">\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <h2 class=\"col-md-6\">{{'stats.my_stats' | translate}}</h2>\n" +
    "                </div>\n" +
    "\n" +
    "\n" +
    "                <h3>{{'Admin.Stats.Period' | translate}}</h3>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"debut\">{{'Admin.Stats.Begin' | translate}}\n" +
    "\n" +
    "                            </label>\n" +
    "                            <span class=\"float-right label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                            <div class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                <input id=\"debut\" name=\"debut\" placeholder=\"{{'Admin.Stats.Begin' | translate}}\"\n" +
    "                                       ng-cloak=\"\" from=\"true\" linked=\"#fin\" ip-id=\"debut\" return-format=\"@\"\n" +
    "                                       readonly=\"true\" ip-datepicker type=\"text\" ng-model=\"opt.fromTime\"\n" +
    "                                       class=\"form-control unvalidate\" required>\n" +
    "                                <span ng-if=\"!!opt.fromTime\" ng-click=\"opt.fromTime = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                    <i class=\"fa fa-times\"></i>\n" +
    "                                </span>\n" +
    "                                <label for=\"debut\" ng-if=\"!opt.fromTime\" class=\"input-group-addon\">\n" +
    "                                    <i class=\"fa fa-calendar\"></i>\n" +
    "                                </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <div class=\"form-group\">\n" +
    "                            <label for=\"fin\">{{'Admin.Stats.End' | translate}}\n" +
    "\n" +
    "\n" +
    "                            </label>\n" +
    "                            <span class=\"float-right label label-danger\"><i class=\"fa fa-warning\"></i> {{'Mandatory' | translate}}</span>\n" +
    "\n" +
    "                            <div class=\"input-group col-md-12\" style=\"padding: 0;\">\n" +
    "                                <input id=\"fin\" name=\"fin\" placeholder=\"{{'Admin.Stats.End' | translate}}\" ng-cloak=\"\"\n" +
    "                                       linked=\"#debut\" ip-id=\"fin\" return-format=\"@\" readonly=\"true\" ip-datepicker\n" +
    "                                       type=\"text\" ng-model=\"opt.toTime\" class=\"form-control unvalidate\" required>\n" +
    "                                <span ng-if=\"!!opt.toTime\" ng-click=\"opt.toTime = undefined\"\n" +
    "                                      class=\"pointer input-group-addon\">\n" +
    "                                        <i class=\"fa fa-times\"></i>\n" +
    "                                    </span>\n" +
    "                                <label for=\"fin\" ng-if=\"!opt.toTime\" class=\"input-group-addon\">\n" +
    "                                        <i class=\"fa fa-calendar\"></i>\n" +
    "                                    </label>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"form-group\">\n" +
    "                    <label for=\"cumul\">{{'Admin.Stats.Cumulation' | translate}}</label>\n" +
    "                    <select class=\"form-control unvalidate\" id=\"cumul\" name=\"cumul\" ng-model=\"cumul\">\n" +
    "                        <option value=\"1\">{{'Admin.Stats.Day' | translate}}</option>\n" +
    "                        <option value=\"2\">{{'Admin.Stats.Week' | translate}}</option>\n" +
    "                        <option value=\"3\">{{'Admin.Stats.Month' | translate}}</option>\n" +
    "                        <option value=\"4\">{{'Admin.Stats.Year' | translate}}</option>\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Stats.Filter_Types' | translate}}</h3>\n" +
    "\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"type\">{{'Admin.Stats.Types' | translate}}</label>\n" +
    "                                <select id=\"type\" ng-model=\"opt.options.type\" name=\"type\"\n" +
    "                                        class=\"form-control unvalidate\"\n" +
    "                                        ng-options=\"type.id as type.id for type in types\">\n" +
    "                                    <option value=\"\">{{'None' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                        <div class=\"col-md-12\">\n" +
    "                            <div class=\"form-group\">\n" +
    "                                <label for=\"subType\">{{'Admin.Stats.Sub' | translate}}</label>\n" +
    "                                <select id=\"subType\" ng-model=\"opt.options.sousType\" name=\"subType\"\n" +
    "                                        class=\"form-control unvalidate\"\n" +
    "                                        ng-options=\"sousType for sousType in (types | findWithId:opt.options.type).sousTypes\">\n" +
    "                                    <option value=\"\">{{'None' | translate}}</option>\n" +
    "                                </select>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-md-6\">\n" +
    "                        <h3>{{'Admin.Stats.Filter_Desks' | translate}}</h3>\n" +
    "\n" +
    "                        <div>\n" +
    "                            <div class=\"input-group\">\n" +
    "                                <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                                <input placeholder=\"{{'Search' | translate}}\" ng-model=\"searchBureau\"\n" +
    "                                       ng-change=\"listHandler.search(searchBureau)\" class=\"form-control unvalidate\"\n" +
    "                                       type=\"text\">\n" +
    "                            </div>\n" +
    "\n" +
    "                            <div style=\"height:15px;\" ng-if=\"listHandler.maxSize < listHandler.total\">\n" +
    "                                        <span class=\"text-warning float-right\">\n" +
    "                                            {{listHandler.page*listHandler.maxSize +1}}-{{(listHandler.page+1)*listHandler.maxSize < listHandler.total ? (listHandler.page+1)*listHandler.maxSize : listHandler.total}} {{'On' | translate}} {{listHandler.total}}\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-left force-display\"\n" +
    "                                                  ng-disabled=\"listHandler.page === 0\"\n" +
    "                                                  ng-click=\"listHandler.pagine(-1)\"></span>\n" +
    "                                            <span class=\"btn btn-default fa fa-chevron-right force-display\"\n" +
    "                                                  ng-disabled=\"listHandler.page+1 >= (listHandler.total/listHandler.maxSize)\"\n" +
    "                                                  ng-click=\"listHandler.pagine(1)\"></span>\n" +
    "                                        </span>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "\n" +
    "                        <span class=\"text-info\" ng-if=\"listHandler.searchResultSubList.length === 0\"><i\n" +
    "                                class=\"fa fa-info-circle\"></i> {{'Admin.Stats.No_Result' | translate}}</span>\n" +
    "\n" +
    "                        <ul class=\"list-unstyled nav nav-pills nav-stacked adminContent list-data\">\n" +
    "                            <li ng-repeat=\"bureau in listHandler.searchResultSubList\">\n" +
    "                                <a ng-click=\"listHandler.selectElement(bureau)\">\n" +
    "                                    <i ng-if=\"bureau.id === listHandler.selectedBureau.id\"\n" +
    "                                       class=\"fa fa-check text-success\"></i> {{bureau.name}}\n" +
    "                                </a>\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <span class=\"btn btn-success force-display\" ng-disabled=\"!statistiques.$valid\"\n" +
    "                      ng-click=\"updateChartData()\">\n" +
    "                            <i class=\"fa fa-eye\"></i>\n" +
    "                            {{'stats.visual' | translate}}</span>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-8\" ng-if=\"gettingStats || datalength > 0\">\n" +
    "        <div>\n" +
    "            <h2 style=\"display:inline-block\">{{'Admin.Stats.Result' | translate}} - {{'Admin.Circuits.Wo_Desk' |\n" +
    "                translate }} {{currentBureauName}}</h2>\n" +
    "        </div>\n" +
    "\n" +
    "        <div style=\"top:100px;\" class=\"nextDossierInfo\" ng-if=\"gettingStats\">\n" +
    "                    <span class=\"text text-info\">\n" +
    "                        {{'Admin.Stats.Getting_Info' | translate}}\n" +
    "                    </span>\n" +
    "            <span style=\"position: relative; width: 0px; z-index: 2000000000; right: 120px; top: 100px;\"\n" +
    "                  us-spinner=\"{radius:20, width:8, length: 16}\"></span>\n" +
    "        </div>\n" +
    "        <div ng-if=\"datalength > 0\" chart id=\"chartstat\" dataset=\"data\" cumul=\"savedCumul\" datalength=\"datalength\"/>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("templates/topbar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("templates/topbar.html",
    "<!--\n" +
    "\n" +
    "        This file is part of IPARAPHEUR-WEB.\n" +
    "\n" +
    "        Copyright (c) 2012, ADULLACT-Projet\n" +
    "        Initiated by ADULLACT-Projet S.A.\n" +
    "        Developped by ADULLACT-Projet S.A.\n" +
    "\n" +
    "        contact@adullact-projet.coop\n" +
    "\n" +
    "        IPARAPHEUR-WEB is free software: you can redistribute it and/or modify\n" +
    "        it under the terms of the GNU Affero General Public License as published by\n" +
    "        the Free Software Foundation, either version 3 of the License, or\n" +
    "        (at your option) any later version.\n" +
    "\n" +
    "        IPARAPHEUR-WEB is distributed in the hope that it will be useful,\n" +
    "        but WITHOUT ANY WARRANTY; without even the implied warranty of\n" +
    "        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n" +
    "        GNU Affero General Public License for more details.\n" +
    "\n" +
    "        You should have received a copy of the GNU Affero General Public License\n" +
    "        along with IPARAPHEUR-WEB.  If not, see <http://www.gnu.org/licenses/>.\n" +
    "\n" +
    "-->\n" +
    "\n" +
    "<div ng-controller=\"NavbarController\" class=\"navbar navbar-default navbar-fixed-top\" role=\"navigation\">\n" +
    "    <div class=\"navbar-header\">\n" +
    "        <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-exl-collapse\">\n" +
    "            <span class=\"sr-only\">Toggle navigation</span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "            <span class=\"icon-bar\"></span>\n" +
    "        </button>\n" +
    "\n" +
    "        <!--Logged in-->\n" +
    "        <a ng-if=\"isLoggedIn\" href=\"#/\" class=\"brand\" ng-show=\"!showBrand\">\n" +
    "            <img class=\"brand logo\" imageonload=\"logoLoaded()\"\n" +
    "                 ng-src=\"{{'/themes/' + (config.tenant ? config.tenant + '/' : '') + 'logo.png'}}\">\n" +
    "        </a>\n" +
    "        <a ng-if=\"showBrand && isLoggedIn\" class=\"navbar-brand\" href=\"#/\">i-Parapheur</a>\n" +
    "\n" +
    "        <!--Logged out-->\n" +
    "        <span ng-if=\"!isLoggedIn\" class=\"brand\" ng-show=\"!showBrand\">\n" +
    "            <img class=\"brand logo\" imageonload=\"logoLoaded()\"\n" +
    "                 ng-src=\"{{'/themes/' + (config.tenant ? config.tenant + '/' : '') + 'logo.png'}}\">\n" +
    "        </span>\n" +
    "        <span ng-if=\"showBrand && !isLoggedIn\" class=\"navbar-brand\">i-Parapheur</span>\n" +
    "\n" +
    "    </div>\n" +
    "    <div ng-if=\"isLoggedIn\" class=\"collapse navbar-collapse navbar-exl-collapse\">\n" +
    "        <ul class=\"nav navbar-nav\">\n" +
    "            <li ng-class=\"{active:pagename()=='/bureaux' || pagename()=='/' || pagename()==''}\" class=\"desk icon\">\n" +
    "                <a href=\"#/bureaux\" tooltip=\"{{'ChoixBureau' | translate}}\" tooltip-placement=\"bottom\">\n" +
    "                    <i class=\"fa fa-home fa-lg\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "            <li bureau is-thumbnail=\"false\" b=\"currentBureau\" ng-show=\"!empty(currentBureau)\" id=\"currentBureauLi\"\n" +
    "                ng-class=\"{active:pagename()=='/dashboard'}\">\n" +
    "            </li>\n" +
    "            <li ng-show=\"pagename().substring(0,10) == '/dashboard' || pagename()=='/archives'\">\n" +
    "                <button ng-disabled=\"flags.backdrop\" ng-click=\"showFiltersWindow()\" ip-slide=\"#dashboard-filters\"\n" +
    "                        class=\"btn btn-info show-hide-filters navbar-btn\" type=\"button\" id=\"show-hide-filters\">\n" +
    "                    <i class=\"fa fa-filter\"></i>\n" +
    "                    {{\"Filters\" | translate}}\n" +
    "                </button>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <form role=\"search\" id=\"navBarSearch\" class=\"navbar-form navbar-right\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <div class=\"input-group\">\n" +
    "                    <span class=\"input-group-addon\"><i class=\"fa fa-search fa-fw\"></i></span>\n" +
    "                    <input ng-disabled=\"flags.backdrop\" type=\"text\" size=\"22\" class=\"form-control unvalidate\"\n" +
    "                           placeholder=\"{{pagename() === '/archives' ? ('Search_Archive' | translate) : ('Search_Dossier' | translate)}}\"\n" +
    "                           ng-model=\"asyncSelected.title\"\n" +
    "                           typeahead=\"dossier as dossier.title for dossier in getDossiersNavbar($viewValue)\"\n" +
    "                           typeahead-loading=\"loadingLocations\" typeahead-on-select=\"selectAsyncDossier($model)\">\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "        </form>\n" +
    "        <ul class=\"nav navbar-nav navbar-right\">\n" +
    "            <li class=\"dropdown auto\"\n" +
    "                ng-class=\"{active:pagename()=='/options' || pagename().indexOf('/admin') !== -1 || pagename()=='/delegation' || pagename()=='/about'}\">\n" +
    "                <a class=\"dropdown-toggle\">{{config.fullname}}<b class=\"caret\"></b></a>\n" +
    "                <ul class=\"dropdown-menu user\">\n" +
    "                    <li ng-class=\"{active:pagename()=='/options'}\">\n" +
    "                        <a href=\"#/options\">\n" +
    "                            <i class=\"fa fa-fw fa-cogs\"></i>\n" +
    "                            {{\"Prefs\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-class=\"{active:pagename()=='/stats'}\">\n" +
    "                        <a href=\"#/stats\">\n" +
    "                            <i class=\"fa fa-fw fa-bar-chart-o\"></i>\n" +
    "                            {{\"Stats\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-show=\"config.isAdmin || config.isAdminCircuits() || config.isAdminFonctionnel()\"\n" +
    "                        ng-class=\"{active:pagename().indexOf('/admin') !== -1}\">\n" +
    "                        <a href=\"#/admin\">\n" +
    "                            <i class=\"fa fa-fw fa-wrench\"></i>\n" +
    "                            {{\"Admin_Title\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-show=\"!empty(currentBureau)\" id=\"topbarDelegation\"\n" +
    "                        ng-class=\"{active:pagename()=='/delegation'}\">\n" +
    "                        <a href=\"#/delegation\">\n" +
    "                            <i class=\"fa fa-fw fa-share\"></i>\n" +
    "                            {{\"Deleg\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\"></li>\n" +
    "                    <li ng-class=\"{active:pagename()=='/policy'}\">\n" +
    "                        <a href=\"#/policy\">\n" +
    "                            <i class=\"fa fa-user-secret fa-fw\"></i>\n" +
    "                            {{\"Policy\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li ng-class=\"{active:pagename()=='/about'}\">\n" +
    "                        <a href=\"#/about\">\n" +
    "                            <i class=\"fa fa-question fa-fw\"></i>\n" +
    "                            {{\"About.About\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                    <li class=\"divider\"></li>\n" +
    "                    <li>\n" +
    "                        <a ng-if=\"config.connexionType === 'default'\" id=\"logout\" ng-click=\"logout()\"\n" +
    "                           href=\"{{context + '/dologout'}}\">\n" +
    "                            <i class=\"fa fa-sign-out fa-fw\"></i>\n" +
    "                            {{\"Logout\" | translate}}\n" +
    "                        </a>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul ng-show=\"!empty(currentBureau) && currentBureau.habilitation.transmettre !== false\" id=\"newFolderNav\"\n" +
    "            class=\"nav navbar-nav navbar-right\">\n" +
    "            <li class=\"auto\">\n" +
    "                <span style=\"margin-right: 15px;\" ng-class=\"{disabled:pagename()=='/nouveau'}\"\n" +
    "                        tooltip=\"{{'NewDossier' | translate}}\" tooltip-placement=\"bottom\"\n" +
    "                        ng-click=\"cleanCurrentDossier(); redirectToNew()\"\n" +
    "                        class=\"btn btn-success  navbar-btn\">\n" +
    "                    <i class=\"fa fa-plus\"></i>\n" +
    "                    {{\"NewDossier\" | translate}}\n" +
    "                </span>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul class=\"nav navbar-nav navbar-right\" ng-if=\"properties['parapheur.ihm.archives.show'] === 'true'\">\n" +
    "            <li class=\"icon\" ng-class=\"{active:pagename()=='/archives'}\">\n" +
    "                <a href=\"#/archives\" tooltip=\"{{'ArchiveExplorer' | translate}}\" tooltip-placement=\"bottom\">\n" +
    "                    <i class=\"fa-inbox fa fa-lg\"></i>\n" +
    "                </a>\n" +
    "            </li>\n" +
    "        </ul>\n" +
    "        <ul class=\"nav navbar-right\">\n" +
    "            <li id=\"activityMonitor\"></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"loadingBureaux\" style=\"position:absolute;left:0;right:0;\">\n" +
    "    <div style=\"position:relative;\" class=\"nextDossierInfo\">\n" +
    "        <span class=\"text text-info col-md-12\" style=\"margin-bottom:3%;\">\n" +
    "            <i class=\"fa fa-info-circle\"></i> {{'Retrieving_desks___' | translate}}\n" +
    "        </span>\n" +
    "        <div style=\"width:100px;height:100px;\" class=\"css-loader\"></div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div ng-if=\"errorNotification.id\" class=\"block-notification\" ng-mouseover=\"stopErrorTask()\"\n" +
    "     ng-mouseleave=\"startErrorTask()\">\n" +
    "    <span class=\"alert alert-danger\"><i class=\"fa fa-warning\"></i> {{\"ErrorDossier\" | translate}}\n" +
    "        <a class=\"pointer\" ng-click=\"selectAsyncDossier(errorNotification)\">{{errorNotification.titre}}</a> : {{errorNotification.message}}\n" +
    "    </span>\n" +
    "</div>");
}]);
