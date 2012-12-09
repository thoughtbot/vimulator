(function () {
    function assignOrdered(subject, start, end) {
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

    Vimulator.LineRange = function (start, end) {
        assignOrdered(this, start, end);
    };

    Vimulator.LineRange.prototype.removeFrom = function (buffer) {
        var count = this.end.row - this.start.row + 1;
        buffer.lines.splice(this.start.row, count);
    };

    Vimulator.LineRange.prototype.replaceIn = function (buffer, str) {
        var count = this.end.row - this.start.row + 1;
        buffer.lines.splice(this.start.row, count, str);
    };
}());
