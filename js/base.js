(function () {
    window.Vimulator = {};

    Vimulator.Base = function () {};

    Vimulator.Base.prototype.init = function (container) {
        this.modes = {
            normal: new Vimulator.NormalMode(this),
            insert: new Vimulator.InsertMode(this),
            command: new Vimulator.CommandMode(this)
        };

        this.container = $(container).addClass('vimulator');
        this.textContainer = this.container.find('pre');
        this.commandLine = this.container.find('p');
        this.commandList = this.container.find('ol');
        this.bindKeyListeners();

        this.setMode("normal");
        this.cursor = {row: 0, col: 0};
        this.lines = this.textContainer.text().split('\n');
        this.registers = {};
        this.marks = {};

        this.render();

        return this;
    };

    Vimulator.Base.prototype.setMode = function (name, options) {
        this.mode = this.modes[name];
        if (!this.mode) {
            throw new Error("Illegal mode");
        }

        this.mode.enter(options);
    };

    Vimulator.Base.prototype.bindKeyListeners = function () {
        var vim = this;

        this.input = $('<input type="text">').appendTo(this.container)
                                             .focus()
                                             .blur(function () {
                                                 $(this).focus();
                                             });

        // Use keyup for special characters like escape
        $(window).keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (
                code === Vimulator.Utils.Keys.BACKSPACE.charCodeAt(0) ||
                code === Vimulator.Utils.Keys.ESC.charCodeAt(0) ||
                code === Vimulator.Utils.Keys.RETURN.charCodeAt(0)
            ) {
                vim.keyPress(code);
                return false;
            }
        });

        // Use keypress for general characters
        $(window).keypress(function (e) {
            var code = e.charCode || e.keyCode;
            if (code >= 32) {
                vim.keyPress(code);
                return false;
            }
        });
    };

    Vimulator.Base.prototype.keyPress = function (code) {
        var chr, op;

        chr = String.fromCharCode(code);
        op = this.mode.keyPress(chr);

        if (op && op.repeatable()) {
            this.lastEdit = op;
        }

        this.render(op);
    };

    Vimulator.Base.prototype.render = function (op) {
        var vim, rendered;

        vim = this;
        rendered = jQuery.map(this.lines, function (line, i) {
            var chr;

            if (i == vim.cursor.row) {
                chr = line.substr(vim.cursor.col, 1) || ' ';
                return line.substr(0, vim.cursor.col) +
                       '<mark class="cursor">' + chr + '</mark>' +
                       line.substr(vim.cursor.col + 1);
            } else {
                return line;
            }
        });

        this.textContainer
                .html(rendered.join('\n'))
                .attr('class', this.mode.name);
        this.commandLine
                .html(this.modes.command.command || '&nbsp;');
    };

    Vimulator.Base.prototype.repeatLastEdit = function () {
        var i, chr, lastInsert;

        if (!this.lastEdit) {
            return;
        }

        lastInsert = this.registers['.'];
        this.lastEdit.execute(this);
        if (this.mode.name === "insert") {
            for (i = 0; i < lastInsert.length; i++) {
                this.keyPress(lastInsert.charCodeAt(i));
            }
            this.setMode("normal");
            this.moveCursorRelative(0, -1);
        }
    };

    Vimulator.Base.prototype.moveCursorRow = function (row) {
        this.cursor.row = row;
        if (row === '$' || this.cursor.row >= this.lines.length) {
            this.cursor.row = this.lines.length - 1;
        }
        if (this.cursor.row < 0) {
            this.cursor.row = 0;
        }
    };
    Vimulator.Base.prototype.moveCursorCol = function (col) {
        var line = this.currentLine();

        this.cursor.col = col;
        if (col === '$' || this.cursor.col >= line.length) {
            this.cursor.col = line.length - 1;
        }
        if (col === '^') {
            this.cursor.col = line.search(/[^\s]/);
        }
        if (this.cursor.col < 0) {
            this.cursor.col = 0;
        }
    };
    Vimulator.Base.prototype.moveCursor = function(row, col) {
        this.moveCursorRow(row);
        this.moveCursorCol(col);
    };
    Vimulator.Base.prototype.moveCursorRelative = function(rows, cols) {
        var row, col;
        if (typeof rows === 'string') {
            row = rows;
        } else {
            row = this.cursor.row + rows;
        }
        if (typeof cols === 'string') {
            col = cols;
        } else {
            col = this.cursor.col + cols;
        }
        return this.moveCursor(row, col);
    };

    Vimulator.Base.prototype.currentLine = function () {
        return this.lines[this.cursor.row];
    };

    Vimulator.Base.prototype.appendChr = function (chr) {
        var line;

        if (chr === Vimulator.Utils.Keys.BACKSPACE) {
            this.removeChr();
        } else {
            line = this.currentLine();
            this.lines[this.cursor.row] =
                    line.substr(0, this.cursor.col) +
                    chr +
                    line.substr(this.cursor.col);
            this.cursor.col += 1;
        }
    };

    Vimulator.Base.prototype.removeChr = function () {
        var line = this.currentLine();

        if (this.cursor.col === 0 && this.cursor.row > 0) {
            this.moveCursorRelative(-1, '$');
            this.cursor.col += 1; //FIXME
            this.lines[this.cursor.row] += line;
            this.removeRows(this.cursor.row + 1, this.cursor.row + 2);
        } else if (this.cursor.col > 0) {
            this.lines[this.cursor.row] =
                    line.substr(0, this.cursor.col - 1) +
                    line.substr(this.cursor.col);
            this.cursor.col -= 1;
        }
    };

    Vimulator.Base.prototype.insertRowBelow = function (text, index) {
        index = index || this.cursor.row;
        this.lines.splice(index + 1, 0, text);
    };
    Vimulator.Base.prototype.insertRowAbove = function (text, index) {
        index = index || this.cursor.row;
        this.lines.splice(index, 0, text);
    };
    Vimulator.Base.prototype.replaceRow = function (text, index) {
        index = (typeof index === "undefined" ? this.cursor.row : index);
        this.lines[index] = text;
    };
    Vimulator.Base.prototype.removeRows = function (start, end) {
        this.lines.splice(start, end - start);
    };

    Vimulator.Base.prototype.removeRange = function(start, end) {
        if (start.row > end.row || start.row == end.row && start.col > end.col) {
            return this.removeRange(end, start);
        }

        this.lines[start.row] = 
                this.lines[start.row].substr(0, start.col) +
                this.lines[end.row].substr(end.col);

        this.lines.splice(start.row + 1, end.row - start.row);
        this.moveCursor(start.row, start.col);
    };

    Vimulator.Base.prototype.findNext = function (target, options) {
        var row, col, lineAfter, lineOffset;

        options = options || {};
        options.offset = options.offset || 0;
        options.from = options.from || this.cursor;

        row = options.from.row;
        lineOffset = options.inclusive ? 0 : 1;
        lineAfter = this.lines[row].substr(options.from.col + lineOffset);
        col = lineAfter.indexOf(target);
        if (col !== -1) {
            col += options.from.col + lineOffset;
        }

        while (options.wrap && row < this.lines.length - 1 && col === -1) {
            row += 1;
            col = this.lines[row].indexOf(target);
        }

        if (col === -1) {
            return null;
        }

        col += options.offset;
        while (col >= this.lines[row].length) {
            if (options.wrap && row < this.lines.length - 1) {
                col -= this.lines[row].length;
                row += 1;
            } else {
                col = this.lines[row].length - 1;
            }
        }

        return {row: row, col: col};
    };

    Vimulator.Base.prototype.findLast = function (target, options) {
        var row, col, lineBefore, lineOffset;

        options = options || {};
        options.offset = options.offset || 0;
        options.from = options.from || this.cursor;

        row = options.from.row;
        lineOffset = options.inclusive ? 1 : 0;
        lineBefore = this.lines[row].substr(0, options.from.col + lineOffset);
        col = lineBefore.lastIndexOf(target);

        while (options.wrap && row > 0 && col === -1) {
            row -= 1;
            col = this.lines[row].lastIndexOf(target);
        }

        if (col === -1) {
            return null;
        }

        col += options.offset;
        while (col < 0) {
            if (options.wrap && row > 0) {
                col += this.lines[row].length - 1;
                row -= 1;
            } else {
                col = 0;
            }
        }

        return {row: row, col: col};
    };

    Vimulator.Base.prototype.cursorCopy = function () {
        return {
            row: this.cursor.row,
            col: this.cursor.col
        };
    };
}());
