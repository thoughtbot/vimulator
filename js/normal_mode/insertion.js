(function () {
    var C = Vimulator.Command;

    Vimulator.NormalMode.Insertion = {
        'i': new C({
            callback: function (vim) {
                vim.setMode("insert");
            }
        }),

        'I': new C({
            callback: function (vim) {
                var col = vim.currentLine().search(/[^\s]/);
                vim.moveCursorCol(col);
                vim.setMode("insert");
            }
        }),

        'gI': new C({
            callback: function (vim) {
                vim.moveCursorCol(0);
                vim.setMode("insert");
            }
        }),

        'a': new C({
            callback: function (vim) {
                vim.cursor.col += 1; //FIXME
                vim.setMode("insert");
            }
        }),

        'A': new C({
            callback: function (vim) {
                vim.moveCursorCol('$');
                vim.cursor.col += 1; //FIXME
                vim.setMode("insert");
            }
        }),

        'o': new C({
            callback: function (vim) {
                vim.insertRowBelow('');
                vim.moveCursor(vim.cursor.row + 1, 1);
                vim.setMode("insert");
            }
        }),

        'O': new C({
            callback: function (vim) {
                vim.insertRowAbove('');
                vim.moveCursorCol(1);
                vim.setMode("insert");
            }
        }),

        's': new C({
            callback: function (vim, count) {
                var line = vim.currentLine();
                vim.replaceRow(
                    line.substr(0, vim.cursor.col) +
                    line.substr(vim.cursor.col + count)
                );
                vim.setMode("insert");
            }
        }),

        'S': new C({
            callback: function (vim, count) {
                vim.replaceRow('');
                vim.moveCursorCol(0);

                if (count > 1) {
                    startRow = vim.cursor.row + 1;
                    vim.removeRows(startRow, startRow + count - 1);
                }

                vim.setMode("insert");
            }
        })
    };
}());
