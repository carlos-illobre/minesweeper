angular.module('minesweeper')
.controller('UserController', function($scope, userService, boardService) {

    this.login = function() {
        userService.login(this.username);
        this.logged = this.username;
    };

    this.createBoard = function() {
        this.board = boardService.createBoard(this.logged, this.rows, this.columns, this.mines);
        const that = this;
        this.interval = setInterval(function() {
            $scope.$apply(function () {
                that.timer = new Date();
            });
        }, 1000);
    };

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

    this.markCell = function(row, column) {
        const cell = this.board.cells[row][column];
        $scope.$apply(function () {
            if (!cell.value) {
                this.board = boardService.questionMarkCell(cell);
            } else if (cell.value == '?') {
                this.board = boardService.flagCell(cell);
            } else {
                this.board = boardService.unmarkCell(cell);
            }
        });
    };

    this.discoverCell = function(row, column) {
        const cell = this.board.cells[row][column];
        this.board = boardService.discoverCell(cell);
    };

});
