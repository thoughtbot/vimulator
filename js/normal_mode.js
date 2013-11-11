(function () {
    var U = Vimulator.Utils;

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

    Vimulator.NormalMode.prototype.cancelOperation = function () {
        this.currentOperation.cancel();
        this.buildOperation();
    };

    Vimulator.NormalMode.prototype.commandList = function () {
        this.commands = this.commands || new Vimulator.CommandList(
            Vimulator.NormalMode.Motions,
            Vimulator.NormalMode.Insertion,
            Vimulator.NormalMode.Edits,
            Vimulator.NormalMode.LineSearch,
            Vimulator.NormalMode.Operators,
            Vimulator.NormalMode.Repeat,
            Vimulator.NormalMode.Marks,
            Vimulator.NormalMode.MarkMotions,
            Vimulator.NormalMode.Search,
            Vimulator.NormalMode.Yank
        );
        return this.commands;
    };

    Vimulator.NormalMode.prototype.keyPress = function (key) {
        var op = this.currentOperation;

        if (key === U.Keys.ESC) {
            this.cancelOperation();
        } else {
            op.keyPress(key);
            if (op.complete()) {
                op.execute(this.vim);
            }

            if (op.complete() || op.cancelled) {
                this.buildOperation();
            }
        }

        return op;
    };
}());
