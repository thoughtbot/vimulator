describe("Operation", function () {
    describe(".setCommand", function () {
        var op, arg, cmd;

        beforeEach(function () {
            op = new Vimulator.Operation();
            arg = mockArgument();
            cmd = mockCommand({argument: arg});
            op.setCommand(cmd, "x");
        });

        it("sets the operation's command", function () {
            expect(op.command).toBe(cmd);
        });

        it("sets the operation's commandKey", function () {
            expect(op.commandKey).toBe("x");
        });

        it("sets the operation's argument", function () {
            expect(op.argument).toBe(arg);
        });

        it("raises an error if the operation already has a command", function () {
            expect(function () { op.setCommand(mockCommand()); }).toThrow();
        });

        it("ignores falsy commands", function () {
            op = new Vimulator.Operation();
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

        describe("for an operation with a command", function () {
            var op;

            beforeEach(function () {
                op = new Vimulator.Operation();
                op.setCommand(mockCommand());
            });

            it("passes the key press on to its argument", function () {
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

        describe("with a command and an incomplete argument", function () {
            var cmd, arg;

            beforeEach(function () {
                arg = mockArgument({complete: false});
                cmd = mockCommand({argument: arg});
                op.setCommand(cmd);
            });

            it("is incomplete", function () {
                expect(op.complete()).toBe(false);
            });

            it("is not executable", function () {
                expect(op.execute(vim)).toBe(false);
                expect(cmd.execute).not.toHaveBeenCalled();
            });
        });

        describe("with a command and a complete argument", function () {
            var cmd, arg;

            beforeEach(function () {
                arg = mockArgument({complete: true, value: "foo"});
                cmd = mockCommand({argument: arg});
                op.setCommand(cmd);
            });

            it("is complete", function () {
                expect(op.complete()).toBe(true);
            });

            it("executes the command", function () {
                op.execute(vim);
                expect(cmd.execute).toHaveBeenCalledWith(vim, null, "foo");
            });

            it("passes the multiplier on to the command", function () {
                op.multiplier = 123;
                op.execute(vim);
                expect(cmd.execute).toHaveBeenCalledWith(vim, 123, "foo");
            });
        });

        describe("when passed a parent multiplier", function () {
            var cmd, arg;

            beforeEach(function () {
                arg = mockArgument({complete: true, value: null});
                cmd = mockCommand({argument: arg});
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

        it("is blank if the operation has been cancelled", function () {
            op.cancel();
            expect(op.description()).toBe("");
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
            var cmd = mockCommand({description: "DESCRIPTION"});
            op.setCommand(cmd, "x");
            expect(op.description()).toBe("<kbd>x</kbd> DESCRIPTION");
        });

        it("splits up multi-character command keys", function () {
            var cmd = mockCommand({description: "Go to the beginning"});
            op.setCommand(cmd, "gg");
            expect(op.description()).toBe(
                "<kbd>g</kbd> <kbd>g</kbd> Go to the beginning"
            );
        });

        it("passes the multiplier & argument to the command", function () {
            var cmd = mockCommand({description: "Replace"}),
                vim = {};
            op.multiplier = 4;
            op.setCommand(cmd, "r");
            op.argument = mockArgument({value: "p"});

            expect(op.description(vim)).toBe("<kbd>4</kbd> <kbd>r</kbd> Replace");
            expect(cmd.description).toHaveBeenCalledWith(4, "p", vim);
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

    describe(".value", function () {
        it("returns the object", function () {
            var op = new Vimulator.Operation();
            expect(op.value()).toBe(op);
        });
    });
});
