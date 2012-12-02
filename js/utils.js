(function () {
    Vimulator.Utils = {};

    Vimulator.Utils.pluralize = function (count, word) {
        if (count === 1) {
            return "1 " + word;
        } else {
            return count + " " + word.replace(/y$/, "ie") + "s";
        }
    };

    Vimulator.Utils.ordinalize = function (count) {
        var str = "" + count;
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
            return "<kbd>" + chr + "</kbd>";
        } else {
            return "<b>&hellip;</b>";
        }
    };
}());
