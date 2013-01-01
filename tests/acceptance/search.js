describe("Forward search", function () {
    beforeEach(function () {
        reset("Text that contains\nThe word contains several\ntimes (contains)");
    });

    it("populates the command line", function () {
        pressKeys("/con");
        expect(commandLineText()).toBe("/con");
        pressKeys("tains" + RETURN);
        expect(commandLineText()).toBe("/contains");
    });

    it("moves the cursor to the next instance of the search term", function () {
        pressKeys("/contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 0, col: 10});
    });

    it("can be cancelled with ESCAPE", function () {
        pressKeys("/contains" + ESC);
        expect(cursorPosition()).toEqual({row: 0, col: 0});
        expect(commandLineText()).toBe("");
    });

    it("leaves us in normal mode", function () {
        pressKeys("/contains" + RETURN + "j");
        expect(cursorPosition()).toEqual({row: 1, col: 10});
    });

    it("can be repeated with /<return>", function () {
        pressKeys("/contains" + RETURN + "/" + RETURN);
        expect(cursorPosition()).toEqual({row: 1, col: 9});
    });

    describe("repeated with n", function () {
        beforeEach(function () {
            pressKeys("/contains" + RETURN);
        });

        it("moves to the next match", function () {
            pressKeys("n");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });

        it("supports a numerical multiplier", function () {
            pressKeys("2n");
            expect(cursorPosition()).toEqual({row: 2, col: 7});
        });
    });

    describe("reversed with N", function () {
        beforeEach(function () {
            pressKeys("/contains" + RETURN + "G$");
        });

        it("moves to the previous match", function () {
            pressKeys("N");
            expect(cursorPosition()).toEqual({row: 2, col: 7});
        });

        it("supports a numerical multiplier", function () {
            pressKeys("2N");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });
    });
});
