(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.NormalMode.Insertion = {
        'i': new C({
            callback: function (vim) {
                vim.setMode("insert");
            },
            description: "Insert text before the cursor"
        }),

        'I': new C({
            callback: function (vim) {
                var col = vim.currentLine().search(/[^\s]/);
                vim.moveCursorCol(col);
                vim.setMode("insert");
            },
            description: "Insert text at the start of the line" +
                         " (after leading whitespace)"
        }),

        'gI': new C({
            callback: function (vim) {
                vim.moveCursorCol(0);
                vim.setMode("insert");
            },
            description: "Insert text at the start of the line" +
                         " (before leading whitespace)"
        }),

        'a': new C({
            callback: function (vim) {
                vim.cursor.col += 1; //FIXME
                vim.setMode("insert");
            },
            description: "Append text after the cursor"
        }),

        'A': new C({
            callback: function (vim) {
                vim.moveCursorCol('$');
                vim.cursor.col += 1; //FIXME
                vim.setMode("insert");
            },
            description: "Append text at the end of the line"
        }),

        'o': new C({
            callback: function (vim) {
                vim.insertRowBelow('');
                vim.moveCursor(vim.cursor.row + 1, 1);
                vim.setMode("insert");
            },
            description: "Insert text on a new line after the cursor"
        }),

        'O': new C({
            callback: function (vim) {
                vim.insertRowAbove('');
                vim.moveCursorCol(1);
                vim.setMode("insert");
            },
            description: "Insert text on a new line before the cursor"
        }),

        's': new C({
            callback: function (vim, count) {
                var line = vim.currentLine();
                vim.replaceRow(
                    line.substr(0, vim.cursor.col) +
                    line.substr(vim.cursor.col + count)
                );
                vim.setMode("insert");
            },
            description: function (count) {
                return "Substitute " + U.pluralize(count, "character") +
                       " under the cursor";
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
            },
            description: function (count) {
                if (count === 1) {
                    return "Substitute this line";
                } else {
                    return "Substitute this line, and the next " +
                           U.pluralize(count - 1, "line");
                }
            }
        })
    };
}());
