angular.module('minesweeper')
.controller('UserController', function($scope, userService, boardService) {

    this.login = function() {
        var that = this
        userService.login(this.username)
        .then(function(user) {
            that.boards = user.boards.filter(function(board) {
                return board.preserved
            })
            that.logged = user.username
        })
    }

    this.createBoard = function() {
        var that = this
        boardService.createBoard(this.logged, this.rows, this.columns, this.mines)
        .then(function(board) {
            that.board = board
            that.timer = 0
            that.interval = setInterval(function() {
                $scope.$apply(function () {
                    that.timer++
                })
            }, 1000)
        })
    }

    this.discoverCell = function(row, column) {
        var that = this
        boardService.discoverCell(this.logged, this.board.id, row, column)
        .then(function(board) {
            that.board = board
        })
    }

    this.markCell = function(row, column) {
        const display = this.board.cells[row][column].display
        const that = this
        $scope.$apply(function () {
            if (display === null) {
                boardService.questionMarkCell(that.logged, that.board.id, row, column)
                .then(function(board) {
                    that.board = board
                })
            } else if (display == '?') {
                boardService.flagCell(that.logged, that.board.id, row, column)
                .then(function(board) {
                    that.board = board
                })
            } else if (display == 'f') {
                boardService.unmarkCell(that.logged, that.board.id, row, column)
                .then(function(board) {
                    that.board = board
                })
            }
        })
    }

    this.preserveBoard = function() {
        boardService.preserveBoard(this.board);
        this.boards = boardService.getBoards(this.logged);
        this.board = null;
        clearInterval(this.interval); 
    };

    this.resumeBoard = function(board) {
        this.boards.splice(this.boards.indexOf(board), 1);
        this.board = board;
        const that = this;
        this.interval = setInterval(function() {
            $scope.$apply(function () {
                that.timer = new Date();
            });
        }, 1000);
    };

});
