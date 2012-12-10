describe("Marks", function () {
    beforeEach(function () {
        reset("def greet\n  puts 'Hello world'\nend");
        pressKeys("w" + "mm" + "jf'" + "ms" + "G$" + "me");
    });

    describe("jumping to a mark with `", function () {
        it("moves the cursor to a mark", function () {
            pressKeys("`m");
            expect(cursorPosition()).toEqual({row: 0, col: 4});
            pressKeys("`e");
            expect(cursorPosition()).toEqual({row: 2, col: 2});
            pressKeys("`s");
            expect(cursorPosition()).toEqual({row: 1, col: 7});
        });

        it("can be used as an operator motion", function () {
            pressKeys("2G$c`s" + "'Hi there" + ESC);
            expect(currentText()).toBe("def greet\n  puts 'Hi there'\nend");
        });
    });

    describe("jumping to a mark with '", function () {
        it("moves the cursor to the line containing a mark", function () {
            pressKeys("'m");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
            pressKeys("'e");
            expect(cursorPosition()).toEqual({row: 2, col: 0});
            pressKeys("'s");
            expect(cursorPosition()).toEqual({row: 1, col: 2});
        });

        it("can be used as a line-wise operator motion", function () {
            pressKeys("ggd's");
            expect(currentText()).toBe("end");
        });
    });
});
