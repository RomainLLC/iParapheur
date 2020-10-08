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
<!--[if IE 8]><html class="no-js ie8 oldie"><![endif]-->
<!--[if IE 9]><html class="no-js ie9 oldie"><![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js"> <!--<![endif]-->
        <head>
            <meta charset="utf-8">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <title>Libriciel - i-Parapheur</title>
            <script type="text/javascript">
                var urlContext = "${url.context}";
                var properties = ${properties};
                if(properties["parapheur.auth.certificate.mandatory"] === "true") {
                    window.location.replace("https://"+ properties["parapheur.auth.certificate.url"]);
                }
            </script>
            <link rel="stylesheet" type="text/css" href="${url.context}/res/css/bootstrap/bootstrap.css?v=0001" />
            <link rel="stylesheet" type="text/css" href="${url.context}/res/css/font-awesome.css?v=0001" />
            <link rel="stylesheet" type="text/css" href="/themes/login.css"/>
            <script src="${url.context}/res/javascript/lib/jquery-1.9.1.js?v=0001" type="text/javascript"></script>
            <script src="${url.context}/res/javascript/lib/zxcvbn.js?v=0001" type="text/javascript"></script>
            <script src="${url.context}/res/javascript/lib/i18next-1.6.0.js?v=0001" type="text/javascript"></script>
            <script src="${url.context}/res/javascript/i18n-parapheur.js?v=0001" type="text/javascript"></script>
            <script src="${url.context}/res/javascript/bootstrap/tooltip.js?v=0001" type="text/javascript"></script>

            <script src="${url.context}/res/javascript/login.js?v=0001" type="text/javascript"></script>
            <script src="${url.context}/res/javascript/resetpassword.js?v=0001" type="text/javascript"></script>
            ${head}
            <#--script src="${url.context}/res/javascript/less-1.3.0.min.js" type="text/javascript"></script-->
        </head>
        <body>
            <@region id="center" scope="template" />
            <footer>
                <@region id="footer" scope="template" />
            </footer>


        </body>
        <script src="${url.context}/res/javascript/i18n-parapheur.js" type="text/javascript"></script>
    </html>