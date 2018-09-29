angular.module('minesweeper')
.controller('UserController', function($scope, userService, boardService) {

    this.login = function() {
        userService.login(this.username)
        this.logged = this.username
    }

    this.createBoard = function() {
        this.board = boardService.createBoard(this.logged, this.rows, this.columns, this.mines)
    }

    this.preserveBoard = function() {
        boardService.preserveBoard(this.board)
        this.boards = boardService.getBoards(this.logged)
        this.board = null
    }

    this.resumeBoard = function(board) {
        this.boards.splice(this.boards.indexOf(board), 1)
        this.board = board
    }

    this.markCell = function(row, column) {
        var cell = this.board.cells[row][column]
        $scope.$apply(function () {
            if (!cell.value) {
                this.board = boardService.questionMarkCell(cell)
            } else if (cell.value == '?') {
                this.board = boardService.flagCell(cell)
            } else {
                this.board = boardService.unmarkCell(cell)
            }
        });
    }

    this.discoverCell = function(row, column) {
        var cell = this.board.cells[row][column]
        this.board = boardService.discoverCell(cell)
    }

})
