(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.NormalMode.Motions = {
        // Character motions

        'h': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(0, -count);
            },
            description: function (count) {
                return "Move left " + U.pluralize(count, "character");
            }
        }),

        'j': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(count, 0);
            },
            description: function (count) {
                return "Move down " + U.pluralize(count, "line");
            }
        }),

        'k': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(-count, 0);
            },
            description: function (count) {
                return "Move up " + U.pluralize(count, "line");
            }
        }),

        'l': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(0, count);
            },
            description: function (count) {
                return "Move right " + U.pluralize(count, "character");
            }
        }),


        // Line motions

        '0': new C({
            callback: function (vim) {
                vim.moveCursorCol(0);
            },
            description: "Move to the start of the line"
        }),

        '$': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(count - 1, '$');
            },
            description: function (count) {
                if (count === 1) {
                    return "Move to the end of the line";
                } else {
                    return "Move to the end of the " + U.ordinalize(count - 1) +
                           " line after the cursor";
                }
            }
        }),

        '^': new C({
            callback: function (vim) {
                vim.moveCursorCol('^');
            },
            description: "Move to the first non-space on the line",
        }),


        // Word motions
        //TODO DRY this code

        'w': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.beginningAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                return "Move forward " + U.pluralize(count, "word");
            }
        }),

        'W': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.beginningAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                return "Move forward " + U.pluralize(count, "word") +
                       " (including punctuation)";
            }
        }),

        'e': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.endingAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                if (count === 1) {
                    return "Move to the next word end";
                } else {
                    return "Move the " + U.ordinalize(count) + " word end " +
                           "after the cursor";
                }
            }
        }),

        'E': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.endingAfter(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row < vim.lines.length - 1) {
                        vim.moveCursorRelative(1, 0);
                        vim.cursor.col = -1; //FIXME
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                if (count === 1) {
                    return "Move to the next word end (including punctuation)";
                } else {
                    return "Move the " + U.ordinalize(count) + " word end " +
                           "after the cursor (including punctuation)";
                }
            }
        }),

        'b': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), false);
                    result = words.beginningBefore(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row > 0) {
                        vim.moveCursorRelative(-1, '$');
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                return "Move back " + U.pluralize(count, "word");
            }
        }),

        'B': new C({
            callback: function (vim, count) {
                var words, result;

                while (true) {
                    words = new Vimulator.Words(vim.currentLine(), true);
                    result = words.beginningBefore(vim.cursor.col, count);

                    count -= result.found;
                    if (count <= 0) {
                        vim.moveCursorCol(result.col);
                        return;
                    } else if (vim.cursor.row > 0) {
                        vim.moveCursorRelative(-1, '$');
                    } else {
                        return;
                    }
                }
            },
            description: function (count) {
                return "Move back " + U.pluralize(count, "word") +
                       " (including punctuation)";
            }
        }),


        // File motions

        'gg': new C({
            defaultCount: null,
            callback: function (vim, count) {
                var row = count ? count - 1 : 0;
                vim.moveCursor(row, '^');
            },
            description: function (count) {
                if (count) {
                    return "Jump to line " + count;
                } else {
                    return "Jump to the start of the file";
                }
            }
        }),

        'G': new C({
            defaultCount: null,
            callback: function (vim, count) {
                var row = count ? count - 1 : '$';
                vim.moveCursor(row, '^');
            },
            description: function (count) {
                if (count) {
                    return "Jump to line " + count;
                } else {
                    return "Jump to the end of the file";
                }
            }
        }),

        '+': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(count, '^');
            },
            description: function (count) {
                if (count === 1) {
                    return "Move to the start of the next line";
                } else {
                    return "Move to the start of the " + U.ordinalize(count) +
                           " line after the cursor";
                }
            }
        }),
        '-': new C({
            callback: function (vim, count) {
                vim.moveCursorRelative(-count, '^');
            },
            description: function (count) {
                if (count === 1) {
                    return "Move to the start of the previous line";
                } else {
                    return "Move to the start of the " + U.ordinalize(count) +
                           " line before the cursor";
                }
            }
        })
    };

    Vimulator.NormalMode.Motions[U.Keys.RETURN] = Vimulator.NormalMode.Motions['+'];
}());
