angular.module('minesweeper')
.service('userService', function($http) {

    var _username;

    this.login = function(username) {
        _username = username
    }

})
