(function () {
    var K;

    Vimulator.Utils = {};

    Vimulator.Utils.Keys = K = {
        BACKSPACE:  '\u0008',
        RETURN:     '\u000D',
        ESC:        '\u001B'
    };

    Vimulator.Utils.pluralize = function (count, word, plural) {
        if (count === 1) {
            return "1 " + word;
        } else {
            plural = plural || word.replace(/y$/, "ie") + "s";
            return count + " " + plural;
        }
    };

    Vimulator.Utils.ordinalize = function (count) {
        if (/^(.*[^1])?1$/.test(count)) {
            return count + "st";
        } else if (/^(.*[^1])?2$/.test(count)) {
            return count + "nd";
        } else if (/^(.*[^1])?3$/.test(count)) {
            return count + "rd";
        } else {
            return count + "th";
        }
    };

    Vimulator.Utils.literalArgDescription = function (chr) {
        if (chr) {
            return "<kbd>" + this.keyName(chr) + "</kbd>";
        } else {
            return "<b>&hellip;</b>";
        }
    };

    Vimulator.Utils.keyName = function (chr) {
        if (chr === K.RETURN) { return "\u23CE"; }
        if (chr === K.ESC)    { return "\u241B"; }
        return chr;
    };
}());
