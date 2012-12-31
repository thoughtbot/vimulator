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
});
