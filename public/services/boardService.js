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
        return $http.put(url, {
            username: username,
            boardId: boardId,
            row: row,
            column: column
        })
        .then(function(res) {
            return res.data
        })
    }

    this.flagCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/flag'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url, {
            username: username,
            boardId: boardId,
            row: row,
            column: column
        })
        .then(function(res) {
            return res.data
        })
    };

    this.questionMarkCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/questionmark'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url, {
            username: username,
            boardId: boardId,
            row: row,
            column: column
        })
        .then(function(res) {
            return res.data
        })
    };

    this.unmarkCell = function(username, boardId, row, column) {
        var url = '/rest/v1/users/${username}/boards/${boardId}/cells/${row}/${column}/unmark'
        .replace('${username}', username)
        .replace('${boardId}', boardId)
        .replace('${row}', row)
        .replace('${column}', column)
        return $http.put(url, {
            username: username,
            boardId: boardId,
            row: row,
            column: column
        })
        .then(function(res) {
            return res.data
        })
    };

    this.getBoards = function(username) {
        return boards;
    };

    this.preserveBoard = function(board) {
        board.preserved = new Date();
        boards.push(board);
    };

    this.resumeBoard = function(board) {
        
    };

});
