(function () {
    var U,
        currentMacroRegister, currentMacro,
        startCommand, stopCommand, replayCommand;

    U = Vimulator.Utils;

    startCommand = new Vimulator.Command({
        argument: Vimulator.LiteralArgument,
        callback: function (vim, count, register) {
            Vimulator.NormalMode.Macros.q = stopCommand;

            currentMacroRegister = register;
            currentMacro = '';

            vim.observeKeyPresses("macro-recorder", function (key) {
                currentMacro += key;
            });
        },
        description: function (count, register) {
            return "Start recording a macro in register " +
                   U.literalArgDescription(register);
        }
    });

    stopCommand = new Vimulator.Command({
        callback: function (vim, count) {
            Vimulator.NormalMode.Macros.q = startCommand;
            vim.stopObservingKeyPresses("macro-recorder");
            vim.registers.set(
                currentMacro.replace(/q$/, ''),
                currentMacroRegister
            );
        },
        description: function (count, register) {
            return "Stop recoding macro";
        }
    });

    replayCommand = new Vimulator.Command({
        argument: Vimulator.LiteralArgument,
        callback: function (vim, count, register) {
            // Allow the current key press event to finish before
            // replaying the macro.
            setTimeout(function () {
                var i, j, keys;

                keys = vim.registers.get(register);
                for (i = 0; i < count; i += 1) {
                    for (j = 0; j < keys.length; j += 1) {
                        vim.keyPress(keys.charCodeAt(j));
                    }
                }
            }, 0);
        },
        description: function (count, register) {
            var desc = "Replay the macro in register " +
                       U.literalArgDescription(register);
            if (count > 1) {
                desc += " " + U.pluralize(count, "time");
            }
            return desc;
        }
    });

    Vimulator.NormalMode.Macros = {
        'q': startCommand,
        '@': replayCommand
    };
}());
