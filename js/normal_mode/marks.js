(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils,
        CR = Vimulator.CharacterRange,
        LR = Vimulator.LineRange;

    Vimulator.NormalMode.Marks = {
        'm': new C({
            argument: Vimulator.LiteralArgument,
            callback: function (vim, count, name) {
                vim.marks[name] = vim.cursorCopy();
            },
            description: function (count, name) {
                return "Create a mark at the cursor called " +
                       U.literalArgDescription(name);
            }
        })
    };

    Vimulator.NormalMode.MarkMotions = {
        '`': new C({
            argument: Vimulator.LiteralArgument,
            callback: CR.captureExclusive(function (vim, count, name) {
                var mark = vim.marks[name];
                vim.moveCursor(mark);
            }),
            description: function (count, name, vim) {
                var mark, desc;

                mark = vim.marks[name];
                desc = "Move to mark " + U.literalArgDescription(name);
                if (name && mark) {
                    desc += " (line " + (mark.row + 1) +
                            ", column " + (mark.col + 1) + ")";
                } else if (name) {
                    desc += " (No such mark is set, use <kbd>m</kbd> " +
                            U.literalArgDescription(name) + " first)";
                }
                return desc;
            }
        }),
        "'": new C({
            argument: Vimulator.LiteralArgument,
            callback: LR.capture(function (vim, count, name) {
                var mark = vim.marks[name];
                if (mark) {
                    vim.moveCursor(mark.row, '^');
                }
            }),
            description: function (count, name, vim) {
                var mark, desc;

                mark = vim.marks[name];
                desc = "Move to the line containing mark " +
                       U.literalArgDescription(name);

                if (name && mark) {
                    desc += " (line " + (mark.row + 1) + ")";
                } else if (name) {
                    desc += " (No such mark is set, use <kbd>m</kbd> " +
                            U.literalArgDescription(name) + " first)";
                }
                return desc;
            }
        })
    };
}());
