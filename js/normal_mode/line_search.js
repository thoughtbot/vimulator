(function () {
    var C, U, CR, findForwards, untilForwards, findBackwards, untilBackwards;

    C = Vimulator.Command;
    U = Vimulator.Utils;
    CR = Vimulator.CharacterRange;

    findForwards = CR.captureInclusive(function (vim, count, chr) {
        var found, position;

        found = -1;
        position = vim.cursor;
        while (position && found < count) {
            found += 1;
            vim.moveCursor(position.row, position.col);
            position = vim.findNext(chr);
        }
    });

    untilForwards = CR.captureInclusive(function (vim, count, chr, repeat) {
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
    });

    findBackwards = CR.captureExclusive(function (vim, count, chr) {
        var found, position;

        found = -1;
        position = vim.cursor;
        while (position && found < count) {
            found += 1;
            vim.moveCursor(position.row, position.col);
            position = vim.findLast(chr);
        }
    });

    untilBackwards = CR.captureExclusive(function (vim, count, chr, repeat) {
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
    });

    Vimulator.NormalMode.LineSearch = {
        'f': new C({
            argument: "literal",
            callback: function (vim, count, chr) {
                vim.lastSearch = {op: 'f', chr: chr};
                return findForwards(vim, count, chr);
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
                return findBackwards(vim, count, chr);
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
                return untilForwards(vim, count, chr);
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
                return untilBackwards(vim, count, chr);
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

                return findFuncs[vim.lastSearch.op](vim, count, vim.lastSearch.chr, true);
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
