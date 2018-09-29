angular.module('minesweeper')
.controller('UserController', function(userService, boardService) {

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

})
