angular.module('minesweeper')
.service('boardService', function($http) {

    this.createBoard = function(username, rows, columns, mines) {
        return $http.post('/rest/v1/users/${username}/boards'.replace('${username}', username), {
            rows: rows,
            columns: columns,
            mines: mines
        })
        .then(function(res) {
            return res.data
        })
    }

    this.discoverCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url)
        .then(function(res) {
            return res.data
        })
    }

    this.flagCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/mark/flag'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url)
        .then(function(res) {
            return res.data
        })
    };

    this.questionMarkCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/mark/question'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url)
        .then(function(res) {
            return res.data
        })
    };

    this.unmarkCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/mark'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.delete(url)
        .then(function(res) {
            return res.data
        })
    };

    this.preserveBoard = function(username, boardId) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/preserve'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        return $http.put(url)
        .then(function(res) {
            return res.data.boards.filter(function(board) {
                return board.preserved
            })
        })
    }

    this.resumeBoard = function(username, boardId) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/resume'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        return $http.put(url)
        .then(function(res) {
            return res.data.boards
        })
    }

})
