(function () {
    Vimulator.InsertMode = function (vim) {
        this.name = "insert";
        this.vim = vim;
    };

    Vimulator.InsertMode.prototype.enter = function () {
        this.vim.registers["."] = "";
    };

    Vimulator.InsertMode.prototype.keyPress = function (key) {
        // Escape
        if (key === '\u001B') {
            this.vim.setMode("normal");
            this.vim.moveCursorRelative(0, -1);
        } else {
            this.vim.registers["."] += key;
            this.vim.appendText(key);
        }
    };
}());
