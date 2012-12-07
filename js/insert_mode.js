(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.InsertMode = function (vim) {
        this.name = "insert";
        this.vim = vim;
    };

    Vimulator.InsertMode.prototype.enter = function () {
        this.vim.registers["."] = "";
    };

    Vimulator.InsertMode.prototype.commandList = function () {
        this.commands = this.commands || new Vimulator.CommandList(
            Vimulator.InsertMode.Commands
        );
        return this.commands;
    };

    Vimulator.InsertMode.prototype.keyPress = function (key) {
        var op;

        if (Vimulator.InsertMode.Commands.hasOwnProperty(key)) {
            op = new Vimulator.Operation(this.commandList());
            op.keyPress(key);
            op.execute(this.vim);
            return op;
        } else {
            this.vim.registers["."] += key;
            this.vim.appendText(key);
        }
    };
}());
