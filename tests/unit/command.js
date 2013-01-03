describe("Command", function () {
    //TODO Support for both literal and operation, e.g. " expects both a
    //     register (literal) and an operation.

    describe(".buildArgument", function () {
        it("returns the required argument type", function () {
            var cmd, constructor;
            constructor = function () {};
            cmd = new Vimulator.Command({argument: constructor});
            expect(cmd.buildArgument())
                .toEqual(jasmine.any(constructor));
        });

        it("defaults to a NullArgument", function () {
            var cmd = new Vimulator.Command({});
            expect(cmd.buildArgument())
                .toEqual(jasmine.any(Vimulator.NullArgument));
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

    describe(".description", function () {
        it("defaults to the empty string", function () {
            var cmd = new Vimulator.Command({});
            expect(cmd.description()).toBe("");
        });

        it("can be specified as a string", function () {
            var cmd = new Vimulator.Command({description: "foo"});
            expect(cmd.description()).toBe("foo");
        });

        it("can be specified as a function", function () {
            var cmd = new Vimulator.Command({description: function () {
                return "Functional";
            }});
            expect(cmd.description()).toBe("Functional");
        });

        it("recieves the default count", function () {
            var desc, cmd, vim;
            desc = jasmine.createSpy();
            cmd = new Vimulator.Command({description: desc});
            vim = {};

            cmd.description(null, "foo", vim);
            expect(desc).toHaveBeenCalledWith(1, "foo", vim);
            cmd.description(7, "foo", vim);
            expect(desc).toHaveBeenCalledWith(7, "foo", vim);
        });
    });
});
