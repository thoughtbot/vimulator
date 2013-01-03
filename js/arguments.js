(function () {
    var U = Vimulator.Utils;

    Vimulator.NullArgument = function () {};
    Vimulator.NullArgument.prototype.keyPress = function () {};
    Vimulator.NullArgument.prototype.complete = function () {
        return true;
    };
    Vimulator.NullArgument.prototype.value = function () {
        return null;
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
}());
