(function () {
    function assignOrdered(subject, start, end) {
        subject.originalStart = start;
        subject.originalEnd = end;

        if (start.row < end.row || start.row == end.row && start.col < end.col) {
            subject.start = start;
            subject.end = end;
        } else {
            subject.start = end;
            subject.end = start;
        }
    }

    Vimulator.CharacterRange = function (start, end, options) {
        this.inclusive = options.inclusive;
        assignOrdered(this, start, end);
    };

    Vimulator.CharacterRange.capture = function (rangeOptions, callback) {
        return function (vim) {
            var start, end;
            start = vim.cursorCopy();
            callback.apply(this, arguments);
            end = vim.cursorCopy();
            if (start.row == end.row && start.col == end.col) {
                return null;
            } else {
                return new Vimulator.CharacterRange(start, end, rangeOptions);
            }
        };
    };
    Vimulator.CharacterRange.captureExclusive = function (callback) {
        return this.capture({inclusive: false}, callback);
    };
    Vimulator.CharacterRange.captureInclusive = function (callback) {
        return this.capture({inclusive: true}, callback);
    };

    Vimulator.CharacterRange.prototype.removeFrom = function (buffer) {
        this.replaceIn(buffer, "");
    };

    Vimulator.CharacterRange.prototype.replaceIn = function (buffer, str) {
        var endOffset = this.inclusive ? 1 : 0;

        buffer.lines[this.start.row] =
                buffer.lines[this.start.row].substr(0, this.start.col) +
                str +
                buffer.lines[this.end.row].substr(this.end.col + endOffset);

        buffer.lines.splice(this.start.row + 1, this.end.row - this.start.row);
    };

    Vimulator.CharacterRange.prototype.toEOL = function (buffer) {
        return this.originalEnd.col === buffer.lines[this.originalEnd.row].length - 1;
    };

    Vimulator.CharacterRange.prototype.contains = function (position) {
        var r = position.row,
            c = position.col,
            afterStart, beforeEnd;

        afterStart = this.start.row < r ||
                     this.start.row === r && this.start.col <= c;

        beforeEnd = this.end.row > r ||
                    this.end.row === r &&
                    (this.end.col > c || this.inclusive && this.end.col === c);

        return afterStart && beforeEnd;
    };


    Vimulator.LineRange = function (start, end) {
        assignOrdered(this, start, end);
    };

    Vimulator.LineRange.capture = function (callback) {
        return function (vim) {
            var start, end;
            start = vim.cursorCopy();
            callback.apply(this, arguments);
            end = vim.cursorCopy();
            return new Vimulator.LineRange(start, end);
        }
    };

    Vimulator.LineRange.prototype.removeFrom = function (buffer) {
        var count = this.end.row - this.start.row + 1;
        buffer.lines.splice(this.start.row, count);
    };

    Vimulator.LineRange.prototype.replaceIn = function (buffer, str) {
        var count = this.end.row - this.start.row + 1;
        buffer.lines.splice(this.start.row, count, str);
    };

    Vimulator.LineRange.prototype.toEOL = function (buffer) {
        return false;
    };
}());
