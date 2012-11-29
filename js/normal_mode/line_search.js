(function () {
    var C = Vimulator.Command;

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
            }
        }),

        'F': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'F', chr: chr};
                findBackwards(vim, count, chr);
            }
        }),

        't': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 't', chr: chr};
                untilForwards(vim, count, chr);
            }
        }),

        'T': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'T', chr: chr};
                untilBackwards(vim, count, chr);
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
            }
        })
    };

}());
