describe("Yanking", function () {
    beforeEach(function () {
        reset("First line\nSecond line");
    });

    describe("a line at a time with Y", function () {
        it("yanks the line", function () {
            pressKeys("wY");
            expect(cursorPosition()).toEqual({row: 0, col: 6});
            pressKeys("jp");
            expect(currentText()).toBe("First line\nSecond line\nFirst line");
            expect(cursorPosition()).toEqual({row: 2, col: 0});
        });
    });

    describe("a line at a time with yy", function () {
        it("does not move the cursor", function () {
            pressKeys("2yy");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });

        it("can be put after the current line with p", function () {
            pressKeys("wyyp");
            expect(currentText()).toBe("First line\nFirst line\nSecond line");
            expect(cursorPosition()).toEqual({row: 1, col: 0});
        });

        it("can be put before the current line with P", function () {
            pressKeys("jyykP");
            expect(currentText()).toBe("Second line\nFirst line\nSecond line");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });

        it("can be put multiple times", function () {
            pressKeys("yypp");
            expect(currentText()).toBe("First line\nFirst line\n" +
                                       "First line\nSecond line");
            expect(cursorPosition()).toEqual({row: 2, col: 0});
        });

        it("accepts numeric prefixes", function () {
            pressKeys("2yy2p");
            expect(currentText()).toBe("First line\n" +
                                       "First line\nSecond line\n" +
                                       "First line\nSecond line\n" +
                                       "Second line");
            expect(cursorPosition()).toEqual({row: 1, col: 0});
        });

        it("accepts numeric prefixes for P", function () {
            pressKeys("2yy3P");
            expect(currentText()).toBe("First line\nSecond line\n" +
                                       "First line\nSecond line\n" +
                                       "First line\nSecond line\n" +
                                       "First line\nSecond line")
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });
    });
});
