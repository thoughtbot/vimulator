describe("Repeating the last command with .", function () {
    beforeEach(function () {
        reset("Here are some words, they are all here");
    });

    it("repeats deletions", function () {
        pressKeys("dw2w.w.");
        expect(currentText()).toBe("are some , are all here");
    });

    it("repeats changes", function () {
        pressKeys("wcw" + "were" + ESC + "4W.");
        expect(currentText()).toBe("Here were some words, they were all here");
    });

    it("repeats insertions", function () {
        pressKeys("ea" + "th" + ESC + "$.");
        expect(currentText()).toBe("Hereth are some words, they are all hereth");
    });

    it("repeats replaces", function () {
        pressKeys("wro5w.");
        expect(currentText()).toBe("Here ore some words, they ore all here");
    });

    it("does not repeat motions", function () {
        pressKeys("3l");
        expect(cursorPosition()).toEqual({row: 0, col: 3});
        pressKeys(".");
        expect(cursorPosition()).toEqual({row: 0, col: 3});
        expect(currentText()).toBe("Here are some words, they are all here");
    });

    //TODO Dot should take a count
});
