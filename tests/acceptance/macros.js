describe("Macros", function () {
    beforeEach(function () {
        reset("Some text made of words");
        pressKeys("qaeas" + ESC + "wq");
    });

    it("records macros to registers", function () {
        expect(vimulator.registers.get('a')).toBe("eas" + ESC + "w");
    });

    it("allows macros to be replayed", function () {
        runs(function () {
            pressKeys("@a");
        });
        waits(0);
        runs(function () {
            expect(currentText()).toBe("Somes texts made of words");
        });
    });

    it("allows macros to be replayed multiple times", function () {
        runs(function () {
            pressKeys("3@a");
        });
        waits(0);
        runs(function () {
            expect(currentText()).toBe("Somes texts mades ofs words");
        });
    });
});
