angular.module('minesweeper')
.service('boardService', function($http) {

    var boards = []

    this.createBoard = function(username, rows, columns, mines) {

        var board = {
            id: boards.length + 1,
            username: username,
            started: new Date(),
            cells: [],
        }

        for (var i=0; i<rows; i++) {
            board.cells.push([])
            for (var j=0; j<columns; j++) {
                board.cells[i][j] = {
                    board: board,
                    value: null,
                    row: i,
                    column: j,
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

    this.flagCell = function(cell) {
        cell.value = 'f'
        return cell.board
    }

    this.questionMarkCell = function(cell) {
        cell.value = '?'
        return cell.board
    }

    this.unmarkCell = function(cell) {
        cell.value = null
        return cell.board
    }

    this.discoverCell = function(cell) {
        cell.value = Math.floor(Math.random() * 10) || ''
        return cell.board
    }

})
