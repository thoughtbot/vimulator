(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    function findForwards(vim, count, chr) {
        var col, line, found;

        found = 0;
        while (col !== -1 && found < count) {
            line = vim.currentLine().substr(vim.cursor.col + 1);
            col = line.indexOf(chr);
            if (col > -1) {
                found += 1;
            }
            vim.moveCursorRelative(0, col + 1);
        }

        return found > 0;
    }

    function untilForwards(vim, count, chr, repeat) {
        if (vim.currentLine().charAt(vim.cursor.col + 1) === chr) {
            if (repeat && count === 1) {
                count += 1;
            } else if (!repeat) {
                count -= 1;
            }
        }
        if (findForwards(vim, count, chr)) {
            vim.moveCursorRelative(0, -1);
        }
    }

    function findBackwards(vim, count, chr) {
        var col, line, found;

        found = 0;
        while (col !== -1 && found < count) {
            line = vim.currentLine().substr(0, vim.cursor.col);
            col = line.lastIndexOf(chr);
            if (col !== -1) {
                found += 1;
                vim.moveCursorCol(col);
            }
        }

        return found > 0;
    }

    function untilBackwards(vim, count, chr, repeat) {
        if (vim.currentLine().charAt(vim.cursor.col - 1) === chr) {
            if (repeat && count === 1) {
                count += 1;
            } else if (!repeat) {
                count -= 1;
            }
        }
        if (findBackwards(vim, count, chr)) {
            vim.moveCursorRelative(0, 1);
        }
    }

    Vimulator.NormalMode.LineSearch = {
        'f': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'f', chr: chr};
                findForwards(vim, count, chr);
            },
            description: function (count, chr) {
                return "Find the " + U.ordinalize(count) + " occurence of " +
                       U.literalArgDescription(chr) + " after the cursor";
            }
        }),

        'F': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'F', chr: chr};
                findBackwards(vim, count, chr);
            },
            description: function (count, chr) {
                return "Find the " + U.ordinalize(count) + " occurence of " +
                       U.literalArgDescription(chr) + " before the cursor";
            }
        }),

        't': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 't', chr: chr};
                untilForwards(vim, count, chr);
            },
            description: function (count, chr) {
                return "Move to the " + U.ordinalize(count) + " occurence of " +
                       U.literalArgDescription(chr) + " after the cursor";
            }
        }),

        'T': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'T', chr: chr};
                untilBackwards(vim, count, chr);
            },
            description: function (count, chr) {
                return "Move to the " + U.ordinalize(count) + " occurence of " +
                       U.literalArgDescription(chr) + " before the cursor";
            }
        }),

        ';': new C({
            callback: function (vim, count) {
                var findFuncs;

                if (!vim.lastSearch) {
                    return;
                }

                findFuncs = {
                    'f': findForwards,
                    'F': findBackwards,
                    't': untilForwards,
                    'T': untilBackwards
                };

                findFuncs[vim.lastSearch.op](vim, count, vim.lastSearch.chr, true);
            },
            description: function (count) {
                desc = "Repeat the last search ";
                if (count > 1) {
                    desc += count + " times";
                }
                return desc;
            }
        }),

        ',': new C({
            callback: function (vim, count) {
                var findFuncs;

                if (!vim.lastSearch) {
                    return;
                }

                findFuncs = {
                    'f': findBackwards,
                    'F': findForwards,
                    't': untilBackwards,
                    'T': untilForwards
                };

                findFuncs[vim.lastSearch.op](vim, count, vim.lastSearch.chr, true);
            },
            description: function (count) {
                desc = "Repeat the last search backwards ";
                if (count > 1) {
                    desc += count + " times";
                }
                return desc;
            }
        })
    };

}());
