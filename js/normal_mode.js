(function () {
    Vimulator.NormalMode = function (vim) {
        this.name = "normal";
        this.vim = vim;
        this.buildOperation();
    };

    Vimulator.NormalMode.prototype.enter = function () {
    };

    Vimulator.NormalMode.prototype.buildOperation = function () {
        this.currentOperation = new Vimulator.Operation(this.commandList());
    };

    Vimulator.NormalMode.prototype.commandList = function () {
        this.commands = this.commands || new Vimulator.CommandList(
            Vimulator.NormalMode.Motions,
            Vimulator.NormalMode.Insertion,
            Vimulator.NormalMode.Edits,
            Vimulator.NormalMode.LineSearch,
            Vimulator.NormalMode.Operators,
            Vimulator.NormalMode.Repeat
        );
        return this.commands;
    };

    Vimulator.NormalMode.prototype.keyPress = function (key) {
        var op = this.currentOperation;

        // Escape
        if (key === '\u001B') {
            this.buildOperation();
        } else {
            op.keyPress(key);

            if (op.complete()) {
                op.execute(this.vim);
                this.buildOperation();
            }
        }

        return op;
    };
}());
