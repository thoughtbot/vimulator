(function () {
    var escapeCommand = new Vimulator.Command({
        callback: function (vim) {
            vim.setMode("normal");
            vim.moveCursorRelative(0, -1);
        },
        description: function () {
            return "<kbd>ESC</kbd> Return to normal mode";
        }
    });

    Vimulator.InsertMode = function (vim) {
        this.name = "insert";
        this.vim = vim;
    };

    Vimulator.InsertMode.prototype.enter = function () {
        this.vim.registers["."] = "";
    };

    Vimulator.InsertMode.prototype.keyPress = function (key) {
        var op;

        // Escape
        if (key === '\u001B') {
            op = new Vimulator.Operation;
            op.setCommand(escapeCommand);
            op.execute(this.vim);
            return op;
        } else {
            this.vim.registers["."] += key;
            this.vim.appendText(key);
        }
    };
}());
