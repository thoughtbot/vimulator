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
        this.argument = command.buildArgument();
    };

    Vimulator.Operation.prototype.keyPress = function (key) {
        var validKey;

        if (this.cancelled) {
            throw new Error("Operation is cancelled");
        }

        validKey = this.captureMultiplier(key) ||
                   this.captureCommandPrefix(key) ||
                   this.captureCommand(key) ||
                   this.captureArgument(key);

        if (!validKey) {
            this.cancel();
        }
    };

    Vimulator.Operation.prototype.captureMultiplier = function (key) {
        if (
            this.command || this.commandPrefix ||
            (key < '1' || key > '9') && (key !== '0' || !this.multiplier)
        ) {
            return false;
        }

        this.multiplier = ~~('' + (this.multiplier || '') + key);
        return true;
    };

    Vimulator.Operation.prototype.captureCommandPrefix = function (key) {
        if (this.command || this.commandPrefix || !/[gz]/.test(key)) {
            return false;
        }

        this.commandPrefix = key;
        return true;
    };

    Vimulator.Operation.prototype.captureCommand = function (key) {
        var cmd;

        if (this.command) {
            return false;
        }

        key = this.commandPrefix + key;
        cmd = this.context.getCommand(key);
        this.setCommand(cmd, key);
        return !!cmd;
    };

    Vimulator.Operation.prototype.captureArgument = function (key) {
        if (!this.argument || this.argument.complete()) {
            return false;
        }

        this.argument.keyPress(key);
        return true;
    };

    Vimulator.Operation.prototype.complete = function () {
        return !!(this.command && this.argument && this.argument.complete());
    };

    Vimulator.Operation.prototype.execute = function (vim, parentMultiplier) {
        var multiplier;

        if (!this.complete()) {
            return false;
        }

        multiplier = this.multiply(parentMultiplier);
        return this.command.execute(vim, multiplier, this.argument.value());
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
            desc += this.command.description(
                this.multiplier,
                this.argument.value(),
                vim
            );
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

    Vimulator.Operation.prototype.value = function () {
        return this;
    };
}());
