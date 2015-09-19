indexPage = angular.module('indexPage', ['ngStorage']);
indexPage.controller('indexController', function ($window, $localStorage) {
    var token = $localStorage.token;
    
    if (!token) {
        $window.location = '/login.html';
    } else {
        $window.location = '/main.html';
    }
});