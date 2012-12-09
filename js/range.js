(function () {
    Vimulator.InclusiveCharacterRange = function (start, end) {
        if (start.row < end.row || start.row == end.row && start.col < end.col) {
            this.start = start;
            this.end = end;
        } else {
            this.start = end;
            this.end = start;
        }
    };

    Vimulator.InclusiveCharacterRange.prototype.removeFrom = function (buffer) {
        this.replaceIn(buffer, "");
    };

    Vimulator.InclusiveCharacterRange.prototype.replaceIn = function (buffer, str) {
        buffer.lines[this.start.row] =
                buffer.lines[this.start.row].substr(0, this.start.col) +
                str +
                buffer.lines[this.end.row].substr(this.end.col + 1);

        buffer.lines.splice(this.start.row + 1, this.end.row - this.start.row);
    };
}());
