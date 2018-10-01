angular.module('minesweeper')
.directive('rightClick', function() {
    return {
        restrict: 'A',
        scope: {
            rightClick: '&',
        },
        link: function(scope, element, attributes, controller) {
            element.contextmenu(function() {
                scope.rightClick()
                return false
            })
        },
    }
})
