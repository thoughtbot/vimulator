describe("Yanking", function () {
    beforeEach(function () {
        reset("First line\nSecond line");
    });

    describe("a line at a time with yy", function () {
        it("does not move the cursor", function () {
            pressKeys("2yy");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });

        it("can be put after the current line with p", function () {
            pressKeys("yyp");
            expect(currentText()).toBe("First line\nFirst line\nSecond line");
        });

        it("can be put before the current line with P", function () {
            pressKeys("jyykP");
            expect(currentText()).toBe("Second line\nFirst line\nSecond line");
        });

        it("can be put multiple times", function () {
            pressKeys("yypp");
            expect(currentText()).toBe("First line\nFirst line\n" +
                                       "First line\nSecond line");
        });

        it("accepts numeric prefixes", function () {
            pressKeys("2yy2p");
            expect(currentText()).toBe("First line\n" +
                                       "First line\nSecond line\n" +
                                       "First line\nSecond line\n" +
                                       "Second line");
        });
    });
});
