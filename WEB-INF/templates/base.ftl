<#--

    This file is part of IPARAPHEUR-WEB.

    Copyright (c) 2012, ADULLACT-Projet
    Initiated by ADULLACT-Projet S.A.
    Developped by ADULLACT-Projet S.A.

     contact@adullact-projet.coop

    IPARAPHEUR-WEB is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    IPARAPHEUR-WEB is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with IPARAPHEUR-WEB.  If not, see <http://www.gnu.org/licenses/>.

-->
<!DOCTYPE html>
<!--[if lt IE 10]><html class="ie" id="ng-app" ng-app="appParapheur" ng-controller="MainController"><![endif]-->
<!--[if gt IE 9]><!--> <html id="ng-app" ng-app="appParapheur" ng-controller="MainController"> <!--<![endif]-->
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta charset="utf-8">

    <title>${page.title}</title>

    <!-- get mandatory values -->
    <#-- Définition du theme utilisateur -->
    <#if user.properties.userTheme??>
        <#assign userTheme=user.properties.userTheme>
    <#else>
        <#assign userTheme="default">
    </#if>
    <#if user.properties.tenantName??>
        <#assign tenantName=user.properties.tenantName>
    <#else>
        <#assign tenantName="">
    </#if>
    <script type="text/javascript">
        var userTheme = "${userTheme}";
        var currentUserId = "${user.getId()}";
        var fullname = "${user.getFullName()}";
        var urlContext="${url.context}";
        var connectionType = "${user.properties.connectionType}";
        var signId;

        var properties = ${properties};
        <#if user.properties["signature-scan"]??>
            signId = "${user.properties["signature-scan"]?replace('://','/')}".split("/");
        </#if>

        var isBrowserIE = document.getElementsByTagName('html').className === 'ie';
        var isAdmin = ${user.isAdmin?string};
        var tenantName = "${tenantName}";
    </script>



    <!-- CSS for application -->
    <link rel="stylesheet" type="text/css" href="${url.context}/res/css/bootstrap/bootstrap.css?v=0001" />
    <link rel="stylesheet" type="text/css" ng-href="/themes/{{themeSelected}}.css?v=0002" />
    <link rel="stylesheet" type="text/css" href="${url.context}/res/css/app.min.css?v=0001" />

    <!--[if lt IE 9]>
    <script type='text/javascript' src="//cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min.js"></script>
    <script src="${url.context}/res/javascript/lib/shiv/css3-mediaqueries.js" type="text/javascript"></script>
    <script src="${url.context}/res/javascript/lib/shiv/html5shiv.min.js" type="text/javascript"></script>
    <script type='text/javascript' src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.js"></script>
    <script>
        document.createElement('abn-tree');
        document.createElement('abn-tree-types');
        document.createElement('abn-tree-groups');
    </script>
    <![endif]-->

<#assign dev = false>

    <#if dev>
        <!-- i18n -->

        <!-- libraries -->
        <script src="${url.context}/res/javascript/lib/jquery-1.9.1.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/jquery-ui-1.10.2.custom.min.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular.min.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-resource.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-locale_fr-fr.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/ui-bootstrap-tpls-0.11.0.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-local-storage.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/spin.min.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-spinner.min.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/http-throttler.js" type="text/javascript"></script>

        <script src="${url.context}/res/javascript/lib/bootstrap-colorpicker-module.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/ng-google-chart.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-sanitize.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-localize.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/canvasjs.min.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/ng-table.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/angular-translate.min.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/annotorious.min.js" type="text/javascript"></script>

        <script src="${url.context}/res/javascript/lib/i18next-1.6.0.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/polyfills/parseISO8601.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/tooltip.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/button.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/dropdown.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/collapse.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/typeahead-ajax.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/alert.js?v=0001" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/transition.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/modal.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/tab.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/bootstrap/popover.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/ace/ace.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/jquery.iframe-transport.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/jquery.fileupload.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/jquery.fileupload-process.js" type="text/javascript"></script>

        <script src="${url.context}/res/javascript/lib/compatibility.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/socket.io.js" type="text/javascript"></script>

        <script src="${url.context}/res/javascript/lib/ui-ace.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/lib/plugindetect.js" type="text/javascript"></script>


        <!--   services  -->
        <script src="${url.context}/res/javascript/app/services/services.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/baseService.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/navigationService.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/parapheurModule.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/configurationModule.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/userModule.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/utilsModule.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/services/cacheService.js" type="text/javascript"></script>

        <!--  controllers -->
        <script src="${url.context}/res/javascript/app/controllers/logoutController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/actionsController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/archivesController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/aboutController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/apercuController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/bureauController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/dashboardController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/navbarController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/nouveauController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/optionsController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/delegationController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/statsController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/policyController.js" type="text/javascript"></script>

        <!-- admin controllers -->
        <script src="${url.context}/res/javascript/app/controllers/admin/informationsAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/utilisateursAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/groupesAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/bureauxAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/circuitsAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/typologieAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/dossiersAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/statsAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/avanceAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/scriptAdminController.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/controllers/admin/tenantAdminController.js" type="text/javascript"></script>
        <!--script src="${url.context}/res/javascript/app/controllers/admin/workersAdminController.js" type="text/javascript"></script-->
        <script src="${url.context}/res/javascript/app/controllers/admin/nodeBrowserAdminController.js" type="text/javascript"></script>

        <!--    router    -->
        <script src="${url.context}/res/javascript/app/router.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/templates.js" type="text/javascript"></script>



        <!--  directives -->
        <script src="${url.context}/res/javascript/app/directives/formulaire.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/directives/view.js" type="text/javascript"></script>

        <!--   filters   -->
        <script src="${url.context}/res/javascript/app/filters.js" type="text/javascript"></script>

        <!--  resources  -->
        <script src="${url.context}/res/javascript/app/resources/bureaux.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/attestation.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/office.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/archives.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/audits.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/groupes.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/cachets.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/pastellmailsec.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/pastellconnector.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/calques.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/connecteurs.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/mails.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/types.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/sousTypes.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/circuits.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/utilisateurs.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/delegations.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/metadonnees.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/dossiers.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/horodate.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/modeles.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/annotations.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/tenants.js" type="text/javascript"></script>
        <script src="${url.context}/res/javascript/app/resources/xemelios.js" type="text/javascript"></script>

        <script src="${url.context}/res/javascript/lib/jquery.mCustomScrollbar.concat.min.js"></script>
        <script src="${url.context}/res/javascript/lib/libersign.js"></script>
    <#else>
        <script src="${url.context}/res/javascript/app.min.js"></script>
    </#if>


    ${head}
</head>

<body>
    <@region id="main" scope="page" />
    <footer>
        <@region id="footer" scope="template" />
    </footer>
</body>

</html>