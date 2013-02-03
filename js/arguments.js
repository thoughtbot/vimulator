(function () {
    var U = Vimulator.Utils;

    Vimulator.NoArgument = function () {};
    Vimulator.NoArgument.prototype.keyPress = function () {};
    Vimulator.NoArgument.prototype.complete = function () {
        return true;
    };
    Vimulator.NoArgument.prototype.value = function () {
        return null;
    };
    Vimulator.NoArgument.prototype.commandLineText = function (key) {
        return '';
    };


    Vimulator.LiteralArgument = function () {
        this.key = null;
    };
    Vimulator.LiteralArgument.prototype.keyPress = function (key) {
        this.key = key;
    };
    Vimulator.LiteralArgument.prototype.complete = function () {
        return !!this.key;
    };
    Vimulator.LiteralArgument.prototype.value = function () {
        return this.key;
    };
    Vimulator.LiteralArgument.prototype.commandLineText = function (key) {
        return '';
    };


    Vimulator.CommandLineArgument = function () {
        this.command = "";
        this.finished = false;
    };
    Vimulator.CommandLineArgument.prototype.keyPress = function (key) {
        if (key === U.Keys.RETURN) {
            this.finished = true;
        } else {
            this.command += key;
        }
    };
    Vimulator.CommandLineArgument.prototype.complete = function () {
        return this.finished;
    };
    Vimulator.CommandLineArgument.prototype.value = function () {
        return this.command;
    };
    Vimulator.CommandLineArgument.prototype.commandLineText = function (key) {
        return key + this.command;
    };
}());
