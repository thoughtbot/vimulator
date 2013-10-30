describe("NoArgument", function () {
    var arg;

    beforeEach(function () {
        arg = new Vimulator.NoArgument();
    });

    describe(".keyPress", function () {
        it("does nothing", function () {
            arg.keyPress("x");
        });
    });

    describe(".complete", function () {
        it("returns true", function () {
            expect(arg.complete()).toBe(true);
        });
    });

    describe(".value", function () {
        it("returns null", function () {
            expect(arg.value()).toBe(null);
        });
    });

    describe(".commandLineText", function () {
        it("returns the empty string", function () {
            expect(arg.commandLineText('x')).toBe('');
        });
    });
});

describe("LiteralArgument", function () {
    var arg;

    beforeEach(function () {
        arg = new Vimulator.LiteralArgument();
    });

    describe(".keyPress", function () {
        it("sets the value", function () {
            expect(arg.value()).toBe(null);
            arg.keyPress("x");
            expect(arg.value()).toBe("x");
        });

        it("completes the argument", function () {
            expect(arg.complete()).toBe(false);
            arg.keyPress("x");
            expect(arg.complete()).toBe(true);
        });
    });

    describe(".commandLineText", function () {
        it("returns the empty string", function () {
            expect(arg.commandLineText('r')).toBe('');
        });
    });
});

describe("CommandLineArgument", function () {
    var arg;

    beforeEach(function () {
        arg = new Vimulator.CommandLineArgument();
    });

    describe(".keyPress", function () {
        it("adds to the value", function () {
            expect(arg.value()).toBe("");
            arg.keyPress("x");
            expect(arg.value()).toBe("x");
            arg.keyPress("y");
            expect(arg.value()).toBe("xy");
            arg.keyPress(RETURN);
            expect(arg.value()).toBe("xy");
        });

        it("completes the argument", function () {
            expect(arg.complete()).toBe(false);
            arg.keyPress("x");
            expect(arg.complete()).toBe(false);
            arg.keyPress("y");
            expect(arg.complete()).toBe(false);
            arg.keyPress(RETURN);
            expect(arg.complete()).toBe(true);
        });
    });

    describe(".commandLineText", function () {
        it("returns the command prefixed with the command key", function () {
            arg.keyPress("f");
            arg.keyPress("o");
            arg.keyPress("o");
            expect(arg.commandLineText("/")).toBe("/foo");
        });
    });
});
