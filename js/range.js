(function () {
    Vimulator.CharacterRange = function (start, end, options) {
        this.inclusive = options.inclusive;

        if (start.row < end.row || start.row == end.row && start.col < end.col) {
            this.start = start;
            this.end = end;
        } else {
            this.start = end;
            this.end = start;
        }
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
}());
