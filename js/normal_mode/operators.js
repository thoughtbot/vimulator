(function () {
    var C, U, LR, deleteSubCommands, changeSubCommands;

    C = Vimulator.Command;
    U = Vimulator.Utils;
    LR = Vimulator.LineRange;

    deleteSubCommands = {
        'd': new C({
            repeatable: true,
            callback: LR.capture(function (vim, count) {
                vim.moveCursorRelative(count - 1, 0);
            }),
            description: function (count) {
                return U.pluralize(count, "whole line");
            }
        })
    };

    changeSubCommands = {
        'c': new C({
            repeatable: true,
            callback: LR.capture(function (vim, count) {
                vim.moveCursorRelative(count - 1, 0);
            }),
            description: function (count) {
                return U.pluralize(count, "whole line");
            }
        }),
        'w': Vimulator.NormalMode.Motions['e'],
        'W': Vimulator.NormalMode.Motions['E'],
    };

    Vimulator.NormalMode.Operators = {
        'd': new C({
            repeatable: true,
            argument: "operation",
            defaultCount: null,
            callback: function (vim, count, motion) {
                var range = motion.execute(vim, count);
                if (range) {
                    range.removeFrom(vim);
                    vim.moveCursor(range.start.row, range.start.col);
                }
            },
            subCommands: new Vimulator.CommandList(
                deleteSubCommands,
                Vimulator.NormalMode.Motions,
                Vimulator.NormalMode.LineSearch,
                Vimulator.TextObject.Commands
            ),
            description: function (count, motion) {
                var desc = "Delete ";
                if (motion) {
                    return desc + motion.description();
                } else {
                    return desc + "<b>&hellip;</b>";
                }
            }
        }),

        'c': new C({
            repeatable: true,
            argument: "operation",
            defaultCount: null,
            callback: function (vim, count, motion) {
                var range, toEOL;
                range = motion.execute(vim, count);
                if (range) {
                    toEOL = range.toEOL(vim);
                    range.replaceIn(vim, "");
                    vim.moveCursor(range.start.row, range.start.col);
                    if (toEOL) {
                        vim.cursor.col += 1; //FIXME
                    }
                    vim.setMode("insert");
                    return;
                }
            },
            subCommands: new Vimulator.CommandList(
                changeSubCommands,
                Vimulator.NormalMode.Motions,
                Vimulator.NormalMode.LineSearch,
                Vimulator.TextObject.Commands
            ),
            description: function (count, motion) {
                var desc = "Change ";
                if (motion) {
                    return desc + motion.description();
                } else {
                    return desc + "<b>&hellip;</b>";
                }
            }
        })
    };
}());
