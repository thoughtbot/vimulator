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
        var searchTerm;

        if (key === U.Keys.RETURN) {
            searchTerm = this.command.substr(1) || this.vim.registers['/'];
            this.vim.moveToNext(searchTerm, {wrap: true});

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
