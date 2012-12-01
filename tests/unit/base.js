describe("Base", function () {
    var vim;

    beforeEach(function () {
        vim = new Vimulator.Base().init();
    });

    describe(".mode", function () {
        it("defaults to normal mode", function () {
            expect(vim.mode.name).toBe("normal");
        });
    });

    describe(".setMode", function () {
        it("switches to the named mode", function () {
            vim.setMode("insert");
            expect(vim.mode.name).toBe("insert");
            vim.setMode("normal");
            expect(vim.mode.name).toBe("normal");
        });

        it("calls the enter method on the new mode", function () {
            spyOn(vim.modes.insert, "enter");
            spyOn(vim.modes.normal, "enter");

            vim.setMode("insert");
            expect(vim.modes.insert.enter).toHaveBeenCalled();
            vim.setMode("normal");
            expect(vim.modes.normal.enter).toHaveBeenCalled();
        });

        it("raises an error if the mode does not exist", function () {
            expect(function () {
                vim.setMode("jazz");
            }).toThrow();
        });
    });

    describe(".keyPress", function () {
        it("passes a string representation to the mode", function () {
            var i, chars, chr, code;
            chars = ['a', 'b', '1', ESC];

            spyOn(vim.mode, "keyPress");
            for (i = 0; i < chars.length; i++) {
                chr = chars[i];
                code = chr.charCodeAt(0);
                vim.keyPress(code);
                expect(vim.mode.keyPress).toHaveBeenCalledWith(chr);
            }
        });
    });
});
