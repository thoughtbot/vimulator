(function () {
    Vimulator.Command = function (options) {
        this.argConstructor = options.argument || Vimulator.NullArgument;
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

    Vimulator.Command.prototype.buildArgument = function () {
        return new this.argConstructor(this);
    };

    Vimulator.Command.prototype.getCommand = function (key) {
        return this.subCommands.getCommand(key);
    };

    Vimulator.Command.prototype.execute = function (vim, count, argument) {
        count = count === null ? this.defaultCount : count;
        return this.callback(vim, count, argument);
    };
}());
