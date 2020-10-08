//Controller for about page
function LogoutController(navigationService, $location) {
    if(navigationService.isLoggedIn) {
        $location.path("/bureaux");
    }
}
LogoutController.$inject = ['navigationService', '$location']; //For JS compilers