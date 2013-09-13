(function () {
    var C, U, yankSubCommands, yank;

    C = Vimulator.Command;
    U = Vimulator.Utils;
    LR = Vimulator.LineRange;

    yank = function (vim, count, motion, register) {
        var range, yankedText, cursor;

        cursor = vim.cursorCopy();
        range = motion.execute(vim, count);
        if (range) {
            yankedText = range.captureFrom(vim);
            vim.registers.set(yankedText);
        }

        vim.moveCursor(cursor.row, cursor.col);
    };

    yankSubCommands = {
        'y': new C({
            callback: LR.capture(function (vim, count) {
                vim.moveCursorRelative(count - 1, 0);
            }),
            description: function (count) {
                return U.pluralize(count, "whole line");
            }
        })
    };

    Vimulator.NormalMode.Yank = {
        'Y': new C({
            callback: function (vim, count) {
                return yank(vim, count, yankSubCommands['y'], '0');
            },
            description: function (count) {
                return "Yank " + U.pluralize(count, "whole line");
            }
        }),

        'y': new C({
            argument: Vimulator.Operation,
            callback: function (vim, count, motion) {
                return yank(vim, count, motion, '0');
            },
            subCommands: new Vimulator.CommandList(
                yankSubCommands
            ),
            description: function (count, motion, vim) {
                var desc = "Yank ";
                if (motion) {
                    return desc + motion.description(vim);
                } else {
                    return desc + "<b>&hellip;</b>";
                }
            }
        }),

        'p': new C({
            callback: function (vim, count) {
                var yankedText, i;

                yankedText = vim.registers.get();
                if (yankedText) {
                    for (i = 0; i < count; i += 1) {
                        vim.insertRowBelow(yankedText);
                    }
                }

                vim.moveCursorRelative(1, '^');
            },
            description: "Put previous yanked text after the cursor"
        }),

        'P': new C({
            callback: function (vim, count) {
                var yankedText = vim.registers.get();
                if (yankedText) {
                    for (i = 0; i < count; i += 1) {
                        vim.insertRowAbove(yankedText);
                    }
                }
            },
            description: "Put previous yanked text before the cursor"
        })
    };
}());
