describe("Operation", function () {
    describe(".setCommand", function () {
        var op;

        beforeEach(function () {
            op = new Vimulator.Operation();
        });

        it("sets the operation's command and commandKey", function () {
            var cmd = mockCommand();
            op.setCommand(cmd, "x");
            expect(op.command).toBe(cmd);
            expect(op.commandKey).toBe("x");
        });

        describe("with a command requiring a operation argument", function () {
            it("creates a blank argument for the command", function () {
                var cmd = mockCommand("operation");
                op.setCommand(cmd);
                expect(op.argument).not.toBe(null);
                expect(op.argument.context).toBe(cmd);
            });
        });

        describe("with a command requiring no argument", function () {
            it("leaves the argument as null", function () {
                var cmd = mockCommand();
                op.setCommand(cmd);
                expect(op.argument).toBe(null);
            });
        });

        describe("with a command requiring a literal argument", function () {
            it("leaves the argument as null", function () {
                var cmd = mockCommand("literal");
                op.setCommand(cmd);
                expect(op.argument).toBe(null);
            });
        });

        it("raises an error if the operation already has a command", function () {
            op.setCommand(mockCommand());
            expect(function () { op.setCommand(mockCommand()); }).toThrow();
        });

        it("ignores falsy commands", function () {
            op.setCommand("");
            expect(op.command).toBe(null);
        });
    });

    describe(".keyPress", function () {
        describe("for a blank operation", function () {
            var op;

            beforeEach(function () {
                var ctx = {
                    getCommand: function (key) {
                        var cmd = mockCommand();
                        cmd.identity = key + "-command";
                        return cmd;
                    }
                };
                op = new Vimulator.Operation(ctx);
            });

            it("adds numbers to the multiplier", function () {
                expect(op.multiplier).toBe(null);
                op.keyPress('1');
                expect(op.multiplier).toBe(1);
                op.keyPress('4');
                expect(op.multiplier).toBe(14);
                op.keyPress('0');
                expect(op.multiplier).toBe(140);
            });

            it("treats an initial 0 as a command not a multiplier", function () {
                expect(op.command).toBe(null);
                op.keyPress('0');
                expect(op.command.identity).toBe("0-command");
            });

            it("looks up the command for a letter", function () {
                expect(op.command).toBe(null);
                op.keyPress('x');
                expect(op.command.identity).toBe("x-command");
            });

            it("accepts g as a command prefix", function () {
                expect(op.command).toBe(null);
                op.keyPress('g');
                op.keyPress('I');
                expect(op.command.identity).toBe("gI-command");
            });

            it("accepts z as a command prefix", function () {
                expect(op.command).toBe(null);
                op.keyPress('z');
                op.keyPress('z');
                expect(op.command.identity).toBe("zz-command");
            });

            it("cancels the operation if there is an unexpected key", function () {
                op = new Vimulator.Operation({
                    getCommand: function () { return undefined; }
                });

                expect(op.cancelled).toBe(false);
                op.keyPress('1');
                expect(op.cancelled).toBe(false);
                op.keyPress('g');
                expect(op.cancelled).toBe(false);
                op.keyPress('1');
                expect(op.cancelled).toBe(true);
            });
        });

        describe("for an operation expecting a literal argument", function () {
            var op;

            beforeEach(function () {
                op = new Vimulator.Operation();
                op.setCommand(mockCommand("literal"));
            });

            it("takes a letter as a literal argument", function () {
                expect(op.argument).toBe(null);
                op.keyPress('a');
                expect(op.argument).toBe("a");
            });

            it("takes a number as a literal argument", function () {
                expect(op.argument).toBe(null);
                op.keyPress('3');
                expect(op.argument).toBe("3");
            });
        });

        describe("for an operation expecting an op argument", function () {
            var op;

            beforeEach(function () {
                op = new Vimulator.Operation();
                op.setCommand(mockCommand("operation"));
            });

            it("passes the key press on to its argument", function () {
                spyOn(op.argument, "keyPress");
                op.keyPress("1");
                expect(op.argument.keyPress).toHaveBeenCalledWith("1");
            });
        });
    });

    describe(".complete and .execute", function () {
        var op, vim;

        beforeEach(function () {
            vim = {};
            op = new Vimulator.Operation();
        });

        describe("with no command", function () {
            it("is incomplete", function () {
                expect(op.complete()).toBe(false);
            });

            it("is not executable", function () {
                expect(op.execute(vim)).toBe(false);
            });
        });

        describe("with a command expecting no argument", function () {
            var cmd;

            beforeEach(function () {
                cmd = mockCommand();
                op.setCommand(cmd);
            });

            it("is complete", function () {
                expect(op.complete()).toBe(true);
            });

            it("executes the command", function () {
                expect(op.execute(vim)).toBe(true);
                expect(cmd.execute).toHaveBeenCalledWith(vim, null, null);
            });

            it("passes the multiplier on to the command", function () {
                op.multiplier = 123;
                op.execute(vim);
                expect(cmd.execute).toHaveBeenCalledWith(vim, 123, null);
            });
        });

        describe("a command waiting for an operation argument", function () {
            var cmd;

            beforeEach(function () {
                cmd = mockCommand("operation");
                op.setCommand(cmd);
            });

            it("is incomplete", function () {
                expect(op.complete()).toBe(false);
            });

            it("does not execute the command", function () {
                expect(op.execute(vim)).toBe(false);
                expect(cmd.execute).not.toHaveBeenCalled();
            });
        });

        describe("a command waiting for a literal argument", function () {
            var cmd;

            beforeEach(function () {
                cmd = mockCommand("literal");
                op.setCommand(cmd);
            });

            it("is incomplete", function () {
                expect(op.complete()).toBe(false);
            });

            it("does not execute the command", function () {
                expect(op.execute(vim)).toBe(false);
                expect(cmd.execute).not.toHaveBeenCalled();
            });
        });

        describe("a command with a literal argument", function () {
            var cmd;

            beforeEach(function () {
                cmd = mockCommand("literal");
                op.setCommand(cmd);
                op.argument = 'x';
            });

            it("is complete", function () {
                expect(op.complete()).toBe(true);
            });

            it("executes the command with the argument", function () {
                expect(op.execute(vim)).toBe(true);
                expect(cmd.execute).toHaveBeenCalledWith(vim, null, 'x');
            });
        });

        describe("a command with an incomplete operation argument", function () {
            var cmd, arg;

            beforeEach(function () {
                cmd = mockCommand("operation");
                arg = {
                    complete: jasmine.createSpy().andReturn(false)
                };

                op.setCommand(cmd);
                op.argument = arg;
            });

            it("is incomplete", function () {
                expect(op.complete()).toBe(false);
            });

            it("does not execute the command", function () {
                expect(op.execute(vim)).toBe(false);
                expect(cmd.execute).not.toHaveBeenCalled();
            });
        });

        describe("a command with a complete operation argument", function () {
            var cmd, arg;

            beforeEach(function () {
                cmd = mockCommand("operation");
                arg = {
                    complete: jasmine.createSpy().andReturn(true)
                };

                op.setCommand(cmd);
                op.argument = arg;
            });

            it("is complete", function() {
                expect(op.complete()).toBe(true);
            });

            it("executes the command with the argument", function () {
                expect(op.execute(vim)).toBe(true);
                expect(cmd.execute).toHaveBeenCalledWith(vim, null, arg);
            });
        });

        describe("when passed a parent multiplier", function () {
            var cmd;

            beforeEach(function () {
                cmd = mockCommand("none");
                op.setCommand(cmd);
            });

            it("combines the parent multiplier with its own", function () {
                op.multiplier = 3;
                op.execute(vim, 4);
                expect(cmd.execute).toHaveBeenCalledWith(vim, 12, null);
            });
        });
    });

    describe(".multiply", function () {
        var op;

        beforeEach(function () {
            op = new Vimulator.Operation();
        });

        describe("with a blank multiplier", function () {
            it("returns the given multiplier", function () {
                expect(op.multiply(7)).toBe(7);
            });

            it("doesn't change for another blank multiplier", function () {
                expect(op.multiply(null)).toBe(null);
            });
        });

        describe("with a non-blank multiplier", function () {
            it("takes the given multiplier", function () {
                op.multiplier = 3;
                expect(op.multiply(7)).toBe(21);
            });

            it("doesn't change for a blank multiplier", function () {
                op.multiplier = 3;
                expect(op.multiply(null)).toBe(3);
            });
        });
    });

    describe(".description", function () {
        var op;

        beforeEach(function () {
            op = new Vimulator.Operation();
        });

        it("defaults to a placeholder", function () {
            expect(op.description()).toBe("<b>&hellip;</b>");
        });

        it("includes the multiplier", function () {
            op.multiplier = 12;
            expect(op.description()).toBe(
                "<kbd>1</kbd> <kbd>2</kbd> <b>&hellip;</b>"
            );
        });

        it("includes the command prefix", function () {
            op.multiplier = 3;
            op.keyPress('z');
            expect(op.description()).toBe(
                "<kbd>3</kbd> <kbd>z</kbd> <b>&hellip;</b>"
            );
        });

        it("includes the command key and description", function () {
            var cmd = mockCommand("none", "DESCRIPTION");
            op.setCommand(cmd, "x");
            expect(op.description()).toBe("<kbd>x</kbd> DESCRIPTION");
        });

        it("splits up multi-character command keys", function () {
            var cmd = mockCommand("none", "Go to the beginning");
            op.setCommand(cmd, "gg");
            expect(op.description()).toBe(
                "<kbd>g</kbd> <kbd>g</kbd> Go to the beginning"
            );
        });

        it("passes the multiplier & argument to the command", function () {
            var cmd = mockCommand("literal", "Replace");
            op.multiplier = 4;
            op.setCommand(cmd, "r");
            op.argument = "p";

            expect(op.description()).toBe("<kbd>4</kbd> <kbd>r</kbd> Replace");
            expect(cmd.description).toHaveBeenCalledWith(4, "p");
        });
    });

    describe(".repeatable", function () {
        it("is always false when the operation is incomplete", function () {
            var op = new Vimulator.Operation();
            op.setCommand(mockCommand());
            spyOn(op, "complete").andReturn(false);

            expect(op.repeatable()).toBe(false);
        });

        it("delegates to the command when the operation is complete", function () {
            var op, cmd, result;

            result = {};
            op = new Vimulator.Operation();
            cmd = mockCommand();
            cmd.repeatable = result;
            op.setCommand(cmd);
            spyOn(op, "complete").andReturn(true);

            expect(op.repeatable()).toBe(result);
        });
    });
});
