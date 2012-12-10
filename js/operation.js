(function () {
    var U = Vimulator.Utils;

    Vimulator.Operation = function (context) {
        this.context = context;
        this.multiplier = null;
        this.commandPrefix = '';
        this.command = null;
        this.commandKey = null;
        this.argument = null;
        this.cancelled = false;
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
        var cmd;

        if (this.cancelled) {
            throw new Error("Operation is cancelled");
        } else if (
            !this.command &&
            !this.commandPrefix &&
            (key >= '1' && key <= '9' || key === '0' && this.multiplier)
        ) {
            this.multiplier = ~~('' + (this.multiplier || '') + key);
            return;
        } else if (!this.command && !this.commandPrefix && /[gz]/.test(key)) {
            // g and z are special: They are prefixes to other commands rather
            // than being commands in their own right.
            this.commandPrefix = key;
        } else if (!this.command) {
            key = this.commandPrefix + key;
            cmd = this.context.getCommand(key);
            if (cmd) {
                this.setCommand(cmd, key);
            } else {
                this.cancel();
            }
        } else if (this.command.wantsLiteral()) {
            this.argument = key;
        } else if (this.command.wantsOperation()) {
            this.argument.keyPress(key);
        } else {
            this.cancel();
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

    Vimulator.Operation.prototype.execute = function (vim, parentMultiplier) {
        var multiplier;

        if (!this.complete()) {
            return false;
        }

        multiplier = this.multiply(parentMultiplier);
        return this.command.execute(vim, multiplier, this.argument);
    };

    Vimulator.Operation.prototype.multiply = function (factor) {
        if (!factor) {
            return this.multiplier;
        }
        return factor * (this.multiplier || 1);
    };

    Vimulator.Operation.prototype.description = function (vim) {
        var desc, keys, multiplier;

        keys = function (str) {
            var i, keys;

            if (!str) {
                return '';
            }

            str = '' + str;
            keys = [];
            for (i = 0; i < str.length; i++) {
                keys.push("<kbd>" + U.keyName(str.charAt(i)) + "</kbd>");
            }
            return keys.join(' ') + ' ';
        };
        
        desc = keys(this.multiplier) +
               keys(this.commandKey || this.commandPrefix);

        if (this.command) {
            multiplier = this.multiplier ? ~~this.multiplier : null;
            desc += this.command.description(multiplier, this.argument, vim);
        } else if (!this.cancelled) {
            desc += '<b>&hellip;</b>';
        }

        return desc.replace(/\s+$/, "");
    };

    Vimulator.Operation.prototype.repeatable = function () {
        return this.complete() && this.command.repeatable;
    };

    Vimulator.Operation.prototype.cancel = function () {
        this.cancelled = true;
    };
}());
