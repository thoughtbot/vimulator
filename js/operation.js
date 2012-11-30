(function () {
    Vimulator.Operation = function (context) {
        this.context = context;
        this.multiplier = '';
        this.commandPrefix = '';
        this.command = null;
        this.commandKey = null;
        this.argument = null;
    };

    Vimulator.Operation.prototype.setCommand = function (command, key) {
        if (this.command) {
            throw new Error("This operation already has a command");
        }

        if (!command) {
            return;
        }

        this.command = command;
        this.commandKey = key;

        if (this.command.wantsOperation()) {
            this.argument = new Vimulator.Operation(this.command);
        }
    };

    Vimulator.Operation.prototype.keyPress = function (key) {
        if (!this.command) {
            if (key >= '1' && key <= '9' || key === '0' && this.multiplier) {
                this.multiplier += key;
                return;
            }

            // g and z are special: They are prefixes to other commands rather
            // than being commands in their own right.
            if (/[gz]/.test(key) && !this.commandPrefix) {
                this.commandPrefix = key;
                return;
            }

            key = this.commandPrefix + key;
            this.setCommand(this.context.getCommand(key), key);
        } else if (this.command.wantsLiteral()) {
            this.argument = key;
        } else if (this.command.wantsOperation()) {
            this.argument.keyPress(key);
        }
    };

    Vimulator.Operation.prototype.complete = function () {
        if (!this.command) {
            return false;
        }

        if (this.command.wantsOperation()) {
            return !!(this.argument && this.argument.complete());
        }

        return !!(!this.command.wantsLiteral() || this.argument);
    };

    Vimulator.Operation.prototype.execute = function (vim) {
        var multiplier;

        if (!this.complete()) {
            return false;
        }

        multiplier = this.multiplier ? ~~this.multiplier : null;
        this.command.execute(vim, multiplier, this.argument);
        return true;
    };

    Vimulator.Operation.prototype.multiply = function (factor) {
        var a, b;

        if (!factor) {
            return;
        }

        a = ~~this.multiplier || 1;
        b = ~~factor;
        this.multiplier = '' + (a * b);
    };

    Vimulator.Operation.prototype.description = function () {
        var desc, keys, multiplier;

        keys = function (str) {
            if (str) {
                return "<kbd>" + str.split("").join("</kbd> <kbd>") + "</kbd> ";
            } else {
                return "";
            }
        };
        
        desc = keys(this.multiplier) +
               keys(this.commandKey || this.commandPrefix);

        if (this.command) {
            multiplier = this.multiplier ? ~~this.multiplier : null;
            desc += this.command.description(multiplier, this.argument);
        } else {
            desc += '<b>&hellip;</b>';
        }

        return desc.replace(/\s+$/, "");
    };
}());
