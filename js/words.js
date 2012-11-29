(function () {
    function after(collection, col, count) {
        var found, result, i;

        result = {found: 0, col: col};
        count = count || 1;
        for (i = 0; i < collection.length; i++) {
            if (collection[i] > col) {
                result.found += 1;
                result.col = collection[i];
            }

            if (result.found >= count) {
                return result;
            }
        }

        return result;
    }

    function before(collection, col, count) {
        var found, result, i;

        result = {found: 0, col: col};
        count = count || 1;
        for (i = collection.length - 1; i >= 0; i -= 1) {
            if (collection[i] < col) {
                result.found += 1;
                result.col = collection[i];
            }

            if (result.found >= count) {
                return result;
            }
        }

        return result;
    }

    Vimulator.Words = function (line, matchWORDS) {
        var matches, words, word, regexp, col;

        this.words = [];
        this.beginnings = [];
        this.endings = [];

        regexp = matchWORDS ? /^(\s+|[^\s]+)(.*)$/i
                            : /^([a-z0-9_]+|\s+|[^a-z0-9_\s]+)(.*)$/i;

        col = 0;
        while (matches = line.match(regexp)) {
            word = matches[1];
            this.words.push(word);
            line = matches[2];

            if (!word.match(/^\s+$/)) {
                this.beginnings.push(col);
                col += word.length;
                this.endings.push(col - 1);
            } else {
                col += word.length;
            }
        }
    };

    Vimulator.Words.prototype.beginningBefore = function (col, count) {
        return before(this.beginnings, col, count);
    };

    Vimulator.Words.prototype.beginningAfter = function (col, count) {
        return after(this.beginnings, col, count);
    };

    Vimulator.Words.prototype.endingAfter = function (col, count) {
        return after(this.endings, col, count);
    };
}());
