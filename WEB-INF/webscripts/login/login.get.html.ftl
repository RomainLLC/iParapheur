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
<!--img src="${url.context}/res/images/adullact-logo-200x58.jpg" />
<img src="${url.context}/res/images/logo_i-parapheur_mini.jpg" /-->

<link rel="stylesheet" type="text/css" href="${url.context}/res/css/login.css?v=0001" />
<link rel="stylesheet" type="text/css" href="${url.context}/res/css/bootstra.css?v=0001" />

<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
        <div class="navbar-header">
            <a class="navbar-brand" style="padding-top: 14px" href="#">
                <img class="upper-logo" alt="i-Parapheur"
                     src="${url.context}/res/images/login/iParapheur_white_plain.svg">
            </a>
        </div>
    </div>
</nav>

<!-- Content -->

<div class="libriciel-background">

    <div class="center-block login-block">

        <div id="coll-logo" style="display:none;" class="hidden-xs
                    hidden-sm
                    col-md-3
                    col-lg-3
                    collectivity-block">
            <img class="collectivity-logo center-block"
                 src="/themes/logo-collectivite.jpg">
        </div>

        <div class="form-block">

            <img class="row center-block main-logo"
                 src="${url.context}/res/images/login/i-parapheur.svg">

            <div id="login-form">
                <div class="row buffer-top text-center">
                    Veuillez saisir vos identifiants de connexion
                </div>

                <div class="row double-buffer-top">

                    <form class="form-horizontal" role="form" accept-charset="UTF-8" method="post" action="${url.context}/dologin">
                        <div class="form-horizontal form-group">

                            <label for="login"
                                   class="col-md-4
                          control-label normal-left">Identifiant *</label>  <!-- font-family: Arial, serif; -->

                            <div class="col-md-8 input-group">
                              <span class="input-group-addon color-inverse"
                                    id="sizing-addon-login">
                                    <i class="fa fa-user"
                                       aria-hidden="true"></i>
                              </span>
                                <input type="text"
                                       class="form-control"
                                       id="login"
                                       name="username"
                                       aria-describedby="sizing-addon-login">
                            </div>
                        </div>

                        <div class="form-horizontal form-group">
                            <label for="password"
                                   class="col-md-4 control-label normal-left">Mot de passe *</label>
                            <!-- font-family: Arial, serif; -->

                            <div class="col-md-8 input-group">
                            <span class="input-group-addon color-inverse"
                                  id="sizing-addon-password">
                                <i class="fa fa-lock"
                                   aria-hidden="true"></i>
                            </span>
                                <input type="password"
                                       class="form-control"
                                       id="password"
                                       name="password"
                                       aria-describedby="sizing-addon-password">
                            </div>
                        </div>

                        <input name="success" id="successPage" type="hidden" value="${url.context}/"/>
                        <input name="failure" id="errorPage" type="hidden" value="${url.context}/login?error=true"/>

                        <div class="row form-horizontal form-group double-buffer-top no-buffer-bottom">
                            <div id="errorMsg" style="display:none;" class="col-md-7 text-danger" data-i18n="app.login.errormsg">
                            </div>
                            <button type="submit" class="pull-right btn btn-primary">
                                <i class="fa fa-sign-in fa-fw"></i> Se connecter
                            </button>
                        </div>
                    </form>

                    <a class="forget-password">Mot de passe oublié ?</a>
                </div>
            </div>

            <div id="forgot-form">
                <div class="row buffer-top text-center">
                    Formulaire de mot de passe oublié
                </div>

                <div class="alert alert-info info-reset">
                    Veuillez saisir votre identifiant et votre adresse de messagerie.
                    Un lien permettant de créer un nouveau mot de passe vous sera envoyé par mail.
                </div>

                <div class="row double-buffer-top">

                    <form id="reset-password-form" class="form-horizontal" role="form" accept-charset="UTF-8" method="post" action="${url.context}/dologin">
                        <div class="form-horizontal form-group">

                            <label for="login"
                                   class="col-md-4
                          control-label normal-left">Identifiant *</label>  <!-- font-family: Arial, serif; -->

                            <div class="col-md-8 input-group">
                              <span class="input-group-addon color-inverse"
                                    id="sizing-addon-login">
                                    <i class="fa fa-user"
                                       aria-hidden="true"></i>
                              </span>
                                <input type="text"
                                       class="form-control"
                                       id="login"
                                       name="username"
                                       aria-describedby="sizing-addon-login">
                            </div>
                        </div>

                        <div class="form-horizontal form-group">
                            <label for="mail"
                                   class="col-md-4 control-label normal-left">E-mail *</label>
                            <!-- font-family: Arial, serif; -->

                            <div class="col-md-8 input-group">
                            <span class="input-group-addon color-inverse"
                                  id="sizing-addon-mail">
                                <i class="fa fa-envelope"
                                   aria-hidden="true"></i>
                            </span>
                                <input type="text"
                                       class="form-control"
                                       id="mail"
                                       name="email"
                                       aria-describedby="sizing-addon-mail">
                            </div>
                        </div>

                        <input name="success" id="successPage" type="hidden" value="${url.context}/"/>
                        <input name="failure" id="errorPage" type="hidden" value="${url.context}/login?error=true"/>

                        <div class="row form-horizontal form-group double-buffer-top no-buffer-bottom">
                            <div id="errorMsg" style="display:none;" class="col-md-7 text-danger" data-i18n="app.login.errormsg">
                            </div>

                            <span class="pull-right btn btn-primary btn-reset">
                                <i class="fa fa-paper-plane fa-fw"></i> Réinitialiser le mot de passe
                            </span>

                            <span class="pull-right btn btn-warning btn-cancel">
                                <i class="fa fa-times-circle-o fa-fw"></i> Annuler
                            </span>
                        </div>

                        <div class="alert alert-warning" id="state-ldapuser">
                            Veuillez contacter votre administrateur
                        </div>
                        <div class="alert alert-danger" id="state-error">
                            Erreur lors de la demande de réinitialisation
                        </div>
                        <div class="alert alert-danger" id="state-ban">
                            Merci de patienter 30 secondes entre chaque demande
                        </div>
                        <div class="alert alert-success" id="state-ok">
                            Si vos informations sont correctes, un e-mail a été envoyé
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>

</div>
