describe("InsertMode", function () {
    describe(".name", function () {
        it("is insert", function () {
            var im = new Vimulator.InsertMode();
            expect(im.name).toBe("insert");
        });
    });

    describe(".keyPress", function () {
        var vim, im;

        beforeEach(function () {
            vim = jasmine.createSpyObj("vim", [
                "moveCursorRelative",
                "setMode",
                "appendChr"
            ]);
            vim.registers = new Vimulator.Registers();
            im = new Vimulator.InsertMode(vim);
            im.enter();
        });

        it("returns to normal mode when pressing escape", function () {
            im.keyPress(ESC);
            expect(vim.setMode).toHaveBeenCalledWith("normal");
            expect(vim.moveCursorRelative).toHaveBeenCalledWith(0, -1);
        });

        it("inserts printable characters", function () {
            var chars, chr, i;

            chars = ["a", "1", "~"];
            for (i = 0; i < chars.length; i +=1) {
                chr = chars[i];
                im.keyPress(chr);
                expect(vim.appendChr).toHaveBeenCalledWith(chr);
            }
        });

        it("appends characters to the '.' register", function () {
            var chars, chr, i;

            chars = ["a", "1", "~", ESC];
            for (i = 0; i < chars.length; i +=1) {
                chr = chars[i];
                im.keyPress(chr);
            }

            expect(vim.registers.get(".")).toBe("a1~");
        });
    });

    describe(".enter", function () {
        var vim, im;

        beforeEach(function () {
            var registers = new Vimulator.Registers();
            registers.set("Some old text", ".");
            vim = { registers: registers };
            im = new Vimulator.InsertMode(vim);
        });

        it("clears the '.' register", function () {
            im.enter();
            expect(vim.registers.get(".")).toBe("");
        });
    });
});
