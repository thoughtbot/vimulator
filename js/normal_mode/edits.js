(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.NormalMode.Edits = {
        'x': new C({
            repeatable: true,
            callback: function (vim, count) {
                var line = vim.currentLine();
                vim.replaceRow(
                    line.substr(0, vim.cursor.col) +
                    line.substr(vim.cursor.col + count)
                );
                vim.moveCursorRelative(0, 0);
            },
            description: function (count) {
                return "Delete " + U.pluralize(count, "character") +
                       " under the cursor";
            }
        }),

        'X': new C({
            repeatable: true,
            callback: function (vim, count) {
                var line = vim.currentLine();
                vim.replaceRow(
                    line.substr(0, vim.cursor.col - count) +
                    line.substr(vim.cursor.col)
                );
                vim.moveCursorRelative(0, -count);
            },
            description: function (count) {
                return "Delete " + U.pluralize(count, "character") +
                       " before the cursor";
            }
        }),

        'r': new C({
            repeatable: true,
            argument: Vimulator.LiteralArgument,
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
            },
            description: function (count, replacement) {
                return "Replace " + U.pluralize(count, "character") +
                       " with " + U.literalArgDescription(replacement);
            }
        }),

        'D': new C({
            repeatable: true,
            callback: function (vim, count) {
                var line, startRow;

                line = vim.currentLine();
                vim.replaceRow(line.substr(0, vim.cursor.col));
                vim.moveCursorRelative(0, -1);

                if (count > 1) {
                    startRow = vim.cursor.row + 1;
                    vim.removeRows(startRow, startRow + count - 1);
                }
            },
            description: function (count) {
                if (count === 1) {
                    return "Delete to the end of the line";
                } else {
                    return "Delete to the end of the " + U.ordinalize(count-1) +
                           " line after the cursor";
                }
            }
        }),

        'C': new C({
            repeatable: true,
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
            },
            description: function (count) {
                if (count === 1) {
                    return "Change to the end of the line";
                } else {
                    return "Change to the end of the " + U.ordinalize(count-1) +
                           " line after the cursor";
                }
            }
        })
    };
}());
