(function () {
    var C = Vimulator.Command;

    Vimulator.NormalMode.Edits = {
        'x': new C({
            callback: function (vim, count) {
                var line = vim.currentLine();
                vim.replaceRow(
                    line.substr(0, vim.cursor.col) +
                    line.substr(vim.cursor.col + count)
                );
                vim.moveCursorRelative(0, 0);
            }
        }),

        'r': new C({
            argument: "literal",
            callback: function (vim, count, replacement) {
                var line, repeat;

                line = vim.currentLine();

                if (vim.cursor.col + count > line.length) {
                    return;
                }

                vim.replaceRow(
                    line.substr(0, vim.cursor.col) +
                    new Array(count + 1).join(replacement) +
                    line.substr(vim.cursor.col + count)
                );
                vim.moveCursorRelative(0, count - 1);
            }
        }),

        'D': new C({
            callback: function (vim, count) {
                var line, startRow;

                line = vim.currentLine();
                vim.replaceRow(line.substr(0, vim.cursor.col));
                vim.moveCursorRelative(0, -1);

                if (count > 1) {
                    startRow = vim.cursor.row + 1;
                    vim.removeRows(startRow, startRow + count - 1);
                }
            }
        }),

        'C': new C({
            callback: function (vim, count) {
                var line, startRow;

                line = vim.currentLine();
                vim.replaceRow(line.substr(0, vim.cursor.col));
                vim.moveCursorRelative(0, -1);

                if (count > 1) {
                    startRow = vim.cursor.row + 1;
                    vim.removeRows(startRow, startRow + count - 1);
                }

                vim.moveCursorCol('$');
                vim.cursor.col += 1; //FIXME
                vim.setMode("insert");
            }
        }),
    };
}());
