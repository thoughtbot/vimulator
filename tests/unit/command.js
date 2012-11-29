describe("Command", function () {
    //TODO Support for both literal and operation, e.g. " expects both a
    //     register (literal) and an operation.

    describe(".wantsOperation", function () {
        it("returns true if the argType is 'operation'", function () {
            var cmd = new Vimulator.Command({argument: "operation"});
            expect(cmd.wantsOperation()).toBe(true);
        });

        it("returns false if the argType is 'literal'", function () {
            var cmd = new Vimulator.Command({argument: "literal"});
            expect(cmd.wantsOperation()).toBe(false);
        });

        it("returns false if the argType is 'none'", function () {
            var cmd = new Vimulator.Command({argument: "none"});
            expect(cmd.wantsOperation()).toBe(false);
        });
    });

    describe(".wantsLiteral", function () {
        it("returns false if the argType is 'operation'", function () {
            var cmd = new Vimulator.Command({argument: "operation"});
            expect(cmd.wantsLiteral()).toBe(false);
        });

        it("returns true if the argType is 'literal'", function () {
            var cmd = new Vimulator.Command({argument: "literal"});
            expect(cmd.wantsLiteral()).toBe(true);
        });

        it("returns false if the argType is 'none'", function () {
            var cmd = new Vimulator.Command({argument: "none"});
            expect(cmd.wantsLiteral()).toBe(false);
        });
    });

    describe(".getCommand", function () {
        var cmd, subCommands;

        beforeEach(function () {
            subCommands = {
                getCommand: jasmine.createSpy().andReturn("SUBCOMMAND")
            };

            cmd = new Vimulator.Command({
                subCommands: subCommands
            });
        });

        it("delegates to the subCommands object", function () {
            expect(cmd.getCommand("q")).toBe("SUBCOMMAND");
            expect(subCommands.getCommand).toHaveBeenCalledWith("q");
        });
    });

    describe(".execute", function () {
        var cmd, callback;

        beforeEach(function () {
            callback = jasmine.createSpy();
            cmd = new Vimulator.Command({
                argument: "literal",
                callback: callback
            });
        });

        it("invokes the callback with its arguments", function () {
            var vim = {};
            cmd.execute(vim, 3, 'x');
            expect(callback).toHaveBeenCalledWith(vim, 3, 'x');
        });

        it("passes the default count if the count is null", function () {
            var vim = {};
            cmd.execute(vim, null, 'x');
            expect(callback).toHaveBeenCalledWith(vim, 1, 'x');

            cmd.defaultCount = null;
            cmd.execute(vim, null, 'x');
            expect(callback).toHaveBeenCalledWith(vim, null, 'x');
        });
    });
});
