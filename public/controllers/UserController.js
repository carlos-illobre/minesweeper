angular.module('minesweeper')
.controller('UserController', function($scope, userService, boardService) {

    this.login = function() {
        var that = this
        userService.login(this.logged)
        .then(function(boards) {
            that.boards = boards
        })
        .catch(function(error) {
            that.boards = []
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
        .catch(function(error) {
            alert('Rows, columns and mines can not be empty')
        })
    }

    this.discoverCell = function(row, column) {
        var that = this
        if (!that.waitingForResponse) {
            that.waitingForResponse = true
            boardService.discoverCell(this.logged, this.board.id, row, column)
            .then(function(board) {
                that.board = board
                that.waitingForResponse = false
            })
        }
    }

    this.markCell = function(row, column) {
        const display = this.board.cells[row][column].display
        const that = this
        if (!that.waitingForResponse) {
            that.waitingForResponse = true
            $scope.$apply(function () {
                if (display === null) {
                    boardService.flagCell(that.logged, that.board.id, row, column)
                    .then(function(board) {
                        that.board = board
                        that.waitingForResponse = false
                    })
                } else if (display == 'f') {
                    boardService.questionMarkCell(that.logged, that.board.id, row, column)
                    .then(function(board) {
                        that.board = board
                        that.waitingForResponse = false
                    })
                } else if (display == '?') {
                    boardService.unmarkCell(that.logged, that.board.id, row, column)
                    .then(function(board) {
                        that.board = board
                        that.waitingForResponse = false
                    })
                }
            })
        }
    }

    this.preserveBoard = function() {
        clearInterval(this.interval)
        var that = this
        boardService.preserveBoard(this.logged, this.board.id)
        .then(function(boards) {
            that.boards = boards
        })
        this.board = null;
    }

    this.resumeBoard = function(board) {
        var that = this
        boardService.resumeBoard(this.logged, board.id)
        .then(function(boards) {
            that.boards = boards.filter(function(board) {
                return board.preserved
            })
            that.board = boards.find(function(item) {
                return item.id == board.id
            })
            that.timer = that.board.time
            that.interval = setInterval(function() {
                $scope.$apply(function () {
                    that.timer++
                })
            }, 1000)
        })
    }

})
