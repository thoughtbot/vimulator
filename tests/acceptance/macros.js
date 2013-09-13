describe("Macros", function () {
    beforeEach(function () {
        reset("Some text made of words");
        pressKeys("qaeas" + ESC + "wq");
    });

    it("records macros to registers", function () {
        expect(vimulator.registers.get('a')).toBe("eas" + ESC + "w");
    });

    it("allows macros to be replayed", function () {
        pressKeys("@a");
        expect(currentText()).toBe("Somes texts made of words");
    });

    it("allows macros to be replayed multiple times", function () {
        pressKeys("3@a");
        expect(currentText()).toBe("Somes texts mades ofs words");
    });
});
