(function () {
    Vimulator.TextObject = function (options) {
        this.startDelim = options.start;
        this.endDelim = options.end;
        this.name = options.name;
    };

    Vimulator.TextObject.prototype.insideRange = function (vim) {
        var start, end;

        start = vim.findLast(this.startDelim, {
            offset: 1,
            wrap: true,
            inclusive: true
        });
        end = vim.findNext(this.endDelim, {
            offset: -1,
            wrap: true,
            inclusive: true
        });

        if (start && end) {
            return new Vimulator.CharacterRange(start, end, {inclusive: true});
        } else {
            return null;
        }
    };

    Vimulator.TextObject.prototype.aroundRange = function (vim) {
        var start, end;

        start = vim.findLast(this.startDelim, {
            wrap: true,
            inclusive: true
        });
        end = vim.findNext(this.endDelim, {
            wrap: true,
            inclusive: true
        });

        if (start && end) {
            return new Vimulator.CharacterRange(start, end, {inclusive: true});
        } else {
            return null;
        }
    };

    Vimulator.TextObject.Commands = (function () {
        var C, U, textObjects;

        C = Vimulator.Command;
        U = Vimulator.Utils;

        textObjects = {};
        textObjects['b'] = new Vimulator.TextObject({
            name: "brackets",
            start: '(',
            end: ')'
        });
        textObjects['('] = textObjects['b'];
        textObjects[')'] = textObjects['b'];

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
