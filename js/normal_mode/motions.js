(function () {
    var C = Vimulator.Command;

    Vimulator.NormalMode.Motions = {
        // Character motions

        'h': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(0, -count);
                //TODO return '<kbd>h</kbd>: Move left ' + count + ' lines';
            }
        }),

        'j': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(count, 0);
                //TODO return '<kbd>j</kbd>: Move down ' + count + ' lines';
            }
        }),

        'k': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(-count, 0);
                //TODO return '<kbd>k</kbd>: Move up ' + count + ' lines';
            }
        }),

        'l': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(0, count);
                //TODO return '<kbd>l</kbd>: Move right ' + count + ' lines';
            }
        }),


        // Line motions

        '0': new C({
            callback: function (vim) {
                vim.moveCursorCol(0);
                //TODO return '<kbd>0</kbd>: Move to the start of the line';
            }
        }),

        '$': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(count - 1, '$');
                //TODO return '<kbd>$</kbd>: Move to the end of the line',
            }
        }),

        '^': new C({
            callback: function (vim) {
                var col = vim.currentLine().search(/[^\s]/);
                vim.moveCursorCol(col);
                //TODO return '<kbd>^</kbd>: Move to the first non-space on the line',
            }
        }),


        // Word motions
        //TODO DRY this code

        'w': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.beginningAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            }
        }),

        'W': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.beginningAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            }
        }),

        'e': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.endingAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            }
        }),

        'E': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.endingAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            }
        }),

        'b': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.beginningBefore(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row > 0) {
                        vim.moveCursorRelative(-1, '$');
                    } else {
                        return;
                    }
                }
            }
        }),

        'B': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.beginningBefore(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row > 0) {
                        vim.moveCursorRelative(-1, '$');
                    } else {
                        return;
                    }
                }
            }
        }),


        // File motions

        'gg': new C({
            defaultCount: null,
            callback: function (vim, count) {
                var col, row;
                row = count ? count - 1 : 0;
                vim.moveCursor(row, 0);
                col = vim.currentLine().search(/[^\s]/);
                vim.moveCursorCol(col);
            }
        }),

        'G': new C({
            defaultCount: null,
            callback: function (vim, count) {
                var row, col;
                row = count ? count - 1 : '$';
                vim.moveCursor(row, 0);
                col = vim.currentLine().search(/[^\s]/);
                vim.moveCursorRelative(0, col);
            }
        })
    };
}());
