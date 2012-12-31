(function () {
    var U = Vimulator.Utils;

    Vimulator.CommandMode = function (vim) {
        this.name = "command";
        this.vim = vim;
    };

    Vimulator.CommandMode.prototype.enter = function (initial) {
        this.command = initial;
    };

    Vimulator.CommandMode.prototype.keyPress = function (key) {
        var searchPosition, searchTerm;

        if (key === U.Keys.RETURN) {
            searchTerm = this.command.substr(1) || this.vim.registers['/'];
            searchPosition = this.vim.findNext(searchTerm, {wrap: true});

            if (searchPosition) {
                this.vim.moveCursor(searchPosition.row, searchPosition.col);
            }

            this.vim.registers['/'] = searchTerm;
            this.vim.setMode("normal");
        } else if (key === U.Keys.ESC) {
            this.command = "";
            this.vim.setMode("normal");
        } else {
            this.command += key;
        }
    };
}());
