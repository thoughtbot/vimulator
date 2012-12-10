(function () {
    Vimulator.Command = function (options) {
        this.argType = options.argument || "none";
        this.callback = options.callback;
        this.subCommands = options.subCommands;
        this.defaultCount = "defaultCount" in options ? options.defaultCount : 1;
        this.repeatable = options.repeatable || false;

        if (typeof options.description === "function") {
            this.description = function (count, arg, vim) {
                count = count === null ? this.defaultCount : count;
                return options.description(count, arg, vim);
            };
        } else {
            this.description = function () {
                return options.description || "";
            };
        }
    };

    Vimulator.Command.prototype.wantsOperation = function () {
        return this.argType === "operation";
    };

    Vimulator.Command.prototype.wantsLiteral = function () {
        return this.argType === "literal";
    };

    Vimulator.Command.prototype.getCommand = function (key) {
        return this.subCommands.getCommand(key);
    };

    Vimulator.Command.prototype.execute = function (vim, count, argument) {
        count = count === null ? this.defaultCount : count;
        return this.callback(vim, count, argument);
    };
}());
