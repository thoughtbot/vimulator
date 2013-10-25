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

    it("accepts a numerical multiplier", function () {
        pressKeys("2/contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 1, col: 9});
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

    it("wraps to the start of the document", function () {
        pressKeys("G$/contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 0, col: 10});
    });

    it("can be used as an operator motion", function () {
        pressKeys("d/contains" + RETURN);
        expect(currentText()).toBe("contains\nThe word contains several\ntimes (contains)");
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

        it("wraps back to the start of the document", function () {
            pressKeys("gg4n");
            expect(cursorPosition()).toEqual({row: 0, col: 10});
        });

        it("can be used as an operator motion", function () {
            pressKeys("dn");
            expect(currentText())
                .toBe("Text that contains several\ntimes (contains)");
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

        it("wraps to the end of the document", function () {
            pressKeys("5N");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });

        it("can be used as an operator motion", function () {
            pressKeys("d2N");
            expect(currentText()).toBe("Text that contains\nThe word )");
        });
    });
});

describe("Backward search", function () {
    beforeEach(function () {
        reset("Text that contains\nThe word contains several\ntimes (contains)");
        pressKeys("G$");
    });

    it("populates the command line", function () {
        pressKeys("?con");
        expect(commandLineText()).toBe("?con");
        pressKeys("tains" + RETURN);
        expect(commandLineText()).toBe("?contains");
    });

    it("moves the cursor to the next instance of the search term", function () {
        pressKeys("?contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 2, col: 7});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("2?contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 1, col: 9});
    });

    it("can be cancelled with ESCAPE", function () {
        pressKeys("gg?contains" + ESC);
        expect(cursorPosition()).toEqual({row: 0, col: 0});
        expect(commandLineText()).toBe("");
    });

    it("leaves us in normal mode", function () {
        pressKeys("?contains" + RETURN + "k");
        expect(cursorPosition()).toEqual({row: 1, col: 7});
    });

    it("can be repeated with ?<return>", function () {
        pressKeys("?contains" + RETURN + "?" + RETURN);
        expect(cursorPosition()).toEqual({row: 1, col: 9});
    });

    it("wraps to the start of the document", function () {
        pressKeys("gg?contains" + RETURN);
        expect(cursorPosition()).toEqual({row: 2, col: 7});
    });

    it("can be used as an operator motion", function () {
        pressKeys("c2?contains" + RETURN + "(yeah" + ESC);
        expect(currentText()).toBe("Text that contains\nThe word (yeah)");
    });

    describe("repeated with n", function () {
        beforeEach(function () {
            pressKeys("?contains" + RETURN);
        });

        it("moves to the next match", function () {
            pressKeys("n");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });

        it("supports a numerical multiplier", function () {
            pressKeys("2n");
            expect(cursorPosition()).toEqual({row: 0, col: 10});
        });

        it("wraps back to the start of the document", function () {
            pressKeys("G$4n");
            expect(cursorPosition()).toEqual({row: 2, col: 7});
        });
    });

    describe("reversed with N", function () {
        beforeEach(function () {
            pressKeys("?contains" + RETURN + "gg");
        });

        it("moves to the previous match", function () {
            pressKeys("N");
            expect(cursorPosition()).toEqual({row: 0, col: 10});
        });

        it("supports a numerical multiplier", function () {
            pressKeys("2N");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });

        it("wraps to the end of the document", function () {
            pressKeys("5N");
            expect(cursorPosition()).toEqual({row: 1, col: 9});
        });
    });
});
