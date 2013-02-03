(function () {
    window.Vimulator = {};

    Vimulator.Base = function () {};

    Vimulator.Base.prototype.init = function (container, options) {
        var vim, rendererConstructor;

        vim = this;

        options = options || {};

        this.modes = {
            normal: new Vimulator.NormalMode(this),
            insert: new Vimulator.InsertMode(this)
        };

        this.search = new Vimulator.Search(this);

        rendererConstructor = options.renderer || Vimulator.Renderer;
        this.renderer = new rendererConstructor().init(container);
        this.renderer.bindKeyListener(function (code) {
            vim.keyPress(code);
        });

        this.setMode("normal");
        this.cursor = {row: 0, col: 0};
        this.lines = this.renderer.readTextContainer();
        this.registers = {};
        this.marks = {};

        this.render();

        return this;
    };

    Vimulator.Base.prototype.setMode = function (name, argsForMode) {
        var args;

        this.mode = this.modes[name];
        if (!this.mode) {
            throw new Error("Illegal mode");
        }

        args = Array.prototype.slice.call(arguments, 1);
        this.mode.enter.apply(this.mode, args);
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
        this.renderer.renderText(this.lines, this.cursor);
        this.renderer.renderMode(this.mode.name);
        if (op) {
            this.renderer.renderOperation(op, this);
            this.renderer.renderCommandLine(op.commandLineText());
        } else {
            this.renderer.renderCommandLine();
        }
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
        if (!row && row !== 0) {
            return;
        }
        this.cursor.row = row;
        if (row === '$' || this.cursor.row >= this.lines.length) {
            this.cursor.row = this.lines.length - 1;
        }
        if (this.cursor.row < 0) {
            this.cursor.row = 0;
        }
    };
    Vimulator.Base.prototype.moveCursorCol = function (col) {
        var line;

        if (!col && col !== 0) {
            return;
        }

        line = this.currentLine() || '';
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
        if (row && typeof row === 'object') {
            col = row.col;
            row = row.row;
        }
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
        var newLines, i;
        index = index || this.cursor.row;
        newLines = text.split('\n');
        for (i = newLines.length - 1; i >= 0; i -= 1) {
            this.lines.splice(index + 1, 0, newLines[i]);
        }
    };
    Vimulator.Base.prototype.insertRowAbove = function (text, index) {
        var newLines, i;
        index = index || this.cursor.row;
        newLines = text.split('\n');
        for (i = 0; i < newLines.length; i += 1) {
            this.lines.splice(index, 0, text);
        }
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
        this.moveCursor(start);
    };

    Vimulator.Base.prototype.findNext = function (target, options) {
        var row, col, startCol;

        options = options || {};
        options.offset = options.offset || 0;
        options.from = options.from || this.cursor;

        startCol = options.from.col;
        if (!options.inclusive) {
            startCol += 1;
        }

        row = options.from.row;
        col = this.lines[row].indexOf(target, startCol);

        while (options.wrap && row < this.lines.length - 1 && col === -1) {
            row += 1;
            col = this.lines[row].indexOf(target);
        }

        if (options.loop && col === -1) {
            row = -1;
            while (row < options.from.row && col === -1) {
                row += 1;
                col = this.lines[row].indexOf(target);
            }
        }

        if (col === -1) {
            return {found: false};
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

        if (options.count && options.count > 1) {
            options.count -= 1;
            options.from = {row: row, col: col};
            options.inclusive = false;
            return this.findNext(target, options);
        } else {
            return {row: row, col: col, found: true};
        }
    };

    Vimulator.Base.prototype.moveToNext = function (target, options) {
        var position = this.findNext(target, options);
        this.moveCursor(position);
        return position.found;
    };

    Vimulator.Base.prototype.findLast = function (target, options) {
        var row, col, startCol;

        options = options || {};
        options.offset = options.offset || 0;
        options.from = options.from || this.cursor;

        startCol = options.from.col;
        if (!options.inclusive) {
            startCol -= 1;
        }

        row = options.from.row;
        col = this.lines[row].lastIndexOf(target, startCol);

        while (options.wrap && row > 0 && col === -1) {
            row -= 1;
            col = this.lines[row].lastIndexOf(target);
        }

        if (options.loop && col === -1) {
            row = this.lines.length;
            while (row > options.from.row && col === -1) {
                row -= 1;
                col = this.lines[row].lastIndexOf(target);
            }
        }

        if (col === -1) {
            return {found: false};
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

        if (options.count && options.count > 1) {
            options.count -= 1;
            options.from = {row: row, col: col};
            options.inclusive = false;
            return this.findLast(target, options);
        } else {
            return {row: row, col: col, found: true};
        }
    };

    Vimulator.Base.prototype.moveToLast = function (target, options) {
        var position = this.findLast(target, options);
        this.moveCursor(position);
        return position.found;
    };

    Vimulator.Base.prototype.cursorCopy = function () {
        return {
            row: this.cursor.row,
            col: this.cursor.col
        };
    };
}());
