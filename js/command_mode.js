(function () {
    var U = Vimulator.Utils;

    Vimulator.CommandMode = function (vim) {
        this.name = "command";
        this.vim = vim;
    };

    Vimulator.CommandMode.prototype.enter = function (initial, callback) {
        this.command = initial;
        this.callback = callback;
    };

    Vimulator.CommandMode.prototype.keyPress = function (key) {
        var searchTerm, searchOp;

        if (key === U.Keys.RETURN) {
            this.callback(this.command.substr(1));
            this.callback = null;
            this.vim.setMode("normal");
        } else if (key === U.Keys.ESC) {
            this.command = "";
            this.vim.setMode("normal");
        } else {
            this.command += key;
        }
    };
}());
