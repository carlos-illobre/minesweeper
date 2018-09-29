angular.module('minesweeper')
.service('userService', function($http) {

    let _username;

    this.login = function(username) {
        _username = username;
    };

});
