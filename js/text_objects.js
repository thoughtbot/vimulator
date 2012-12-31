(function () {
    function findPairs(lines, start, end) {
        var row, col, line, chr, pairs, startStack;

        pairs = [];
        startStack = [];

        for (row = 0; row < lines.length; row++) {
            line = lines[row];
            for (col = 0; col < line.length; col++) {
                chr = line.charAt(col);
                if (chr === start) {
                    startStack.push({row: row, col: col});
                } else if (chr === end && startStack.length > 0) {
                    pairs.push(new Vimulator.CharacterRange(
                        startStack.pop(),
                        {row: row, col: col},
                        {inclusive: true}
                    ));
                }
            }
        }

        return pairs;
    }

    Vimulator.TextObject = function (options) {
        this.startDelim = options.start;
        this.endDelim = options.end;
        this.name = options.name;
    };

    Vimulator.TextObject.prototype.insideRange = function (vim) {
        var pairs, i, p;

        pairs = findPairs(vim.lines, this.startDelim, this.endDelim);
        for (i = 0; i < pairs.length; i++) {
            p = pairs[i];
            if (p.contains(vim.cursor)) {
                p.start.col += 1;
                p.end.col -= 1;
                return p;
            }
        }

        return null;
    };

    Vimulator.TextObject.prototype.aroundRange = function (vim) {
        var pairs, i, p;

        pairs = findPairs(vim.lines, this.startDelim, this.endDelim);
        for (i = 0; i < pairs.length; i++) {
            p = pairs[i];
            if (p.contains(vim.cursor)) {
                return p;
            }
        }

        return null;
    };

    Vimulator.TextObject.Commands = (function () {
        var C, U, textObjects;

        C = Vimulator.Command;
        U = Vimulator.Utils;

        textObjects = {};
        textObjects['b'] = new Vimulator.TextObject({
            name: "parentheses",
            start: '(',
            end: ')'
        });
        textObjects['('] = textObjects['b'];
        textObjects[')'] = textObjects['b'];

        textObjects['['] = new Vimulator.TextObject({
            name: "square brackets",
            start: '[',
            end: ']'
        });
        textObjects[']'] = textObjects['['];

        textObjects['B'] = new Vimulator.TextObject({
            name: "curly braces",
            start: '{',
            end: '}'
        });
        textObjects['{'] = textObjects['B'];
        textObjects['}'] = textObjects['B'];

        return {
            'a': new C({
                argument: "literal",
                callback: function (vim, count, key) {
                    var textObject = textObjects[key];
                    if (textObject) {
                        return textObject.aroundRange(vim);
                    } else {
                        vim.mode.cancelOperation();
                    }
                },
                description: function (count, key) {
                    var desc, textObject;
                    desc = "around " + U.literalArgDescription(key);
                    textObject = textObjects[key];
                    if (textObject) {
                        desc += " " + textObject.name;
                    } else if (key) {
                        desc += " (unknown text object)";
                    }
                    return desc;
                }
            }),
            'i': new C({
                argument: "literal",
                callback: function (vim, count, key) {
                    var textObject = textObjects[key];
                    if (textObject) {
                        return textObject.insideRange(vim);
                    } else {
                        vim.mode.cancelOperation();
                    }
                },
                description: function (count, key) {
                    var desc, textObject;
                    desc = "inside " + U.literalArgDescription(key);
                    textObject = textObjects[key];
                    if (textObject) {
                        desc += " " + textObject.name;
                    } else if (key) {
                        desc += " (unknown text object)";
                    }
                    return desc;
                }
            })
        };
    }());
}());
