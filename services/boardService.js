angular.module('minesweeper')
.service('boardService', function($http) {

    var boards = []

    this.createBoard = function(username, rows, columns, mines) {

        var board = {
            started: new Date(),
            cells: []
        }

        for (var i=0; i<rows; i++) {
            board.cells.push([])
            for (var j=0; j<columns; j++) {
                board.cells[i][j] = {
                    value: null
                }
            }
        }

        return board
    }

    this.getBoards = function(username) {
        return boards;
    }

    this.preserveBoard = function(board) {
        board.preserved = new Date()
        boards.push(board)
    }

    this.resumeBoard = function(board) {
        
    }

})
