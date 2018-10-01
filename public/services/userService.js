angular.module('minesweeper')
.service('userService', function($http) {

    this.login = function(username) {
        return $http.get('/rest/v1/users/${username}'.replace('${username}', username))
    };

});
