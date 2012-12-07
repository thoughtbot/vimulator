describe("The delete operator d", function () {
    describe("with the argument d", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird");
            pressKeys("2l");
        });

        it("deletes a whole line", function () {
            pressKeys("dd");
            expect(currentText()).toBe("Second\nThird");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2dd");
            expect(currentText()).toBe("Third");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d2d");
            expect(currentText()).toBe("Third");
        });
    });

    describe("with j and k motions", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird\nFourth\nFifth");
        });

        it("deletes the whole line", function () {
            pressKeys("2ldj");
            expect(currentText()).toBe("Third\nFourth\nFifth");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2dj");
            expect(currentText()).toBe("Fourth\nFifth");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d2j");
            expect(currentText()).toBe("Fourth\nFifth");
        });

        it("accepts multiple numerical multipliers", function () {
            reset("1\n2\n3\n4\n5\n6\n7");
            pressKeys("j2d2j");
            expect(currentText()).toBe("1\n7");
        });
    });

    describe("with h and l motions", function () {
        beforeEach(function () {
            reset("1234567890");
        });

        it("deletes characters", function () {
            pressKeys("dl");
            expect(currentText()).toBe("234567890");
            pressKeys("2ldh");
            expect(currentText()).toBe("24567890");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2dl");
            expect(currentText()).toBe("34567890");
            pressKeys("4l3dh");
            expect(currentText()).toBe("37890");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d2l");
            expect(currentText()).toBe("34567890");
            pressKeys("4ld3h");
            expect(currentText()).toBe("37890");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2d2l");
            expect(currentText()).toBe("567890");
        });
    });

    describe("with line motions", function () {
        it("deletes to the end of the line with $", function () {
            reset("1234567890");
            pressKeys("2ld$");
            expect(currentText()).toBe("12");
            expect(cursorPosition()).toEqual({row: 0, col: 1});
        });

        it("deletes to the start of the line with ^", function () {
            reset("  1234567890");
            pressKeys("4ld^");
            expect(currentText()).toBe("  34567890");
            expect(cursorPosition()).toEqual({row: 0, col: 2});
        });

        it("deletes to the start of the line with 0", function () {
            reset("  1234567890");
            pressKeys("4ld0");
            expect(currentText()).toBe("34567890");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });
    });

    describe("with the w motion", function () {
        beforeEach(function () {
            reset("Here are, some words!");
        });

        it("deletes words", function () {
            pressKeys("dw");
            expect(currentText()).toBe("are, some words!");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2dw");
            expect(currentText()).toBe(", some words!");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d3w");
            expect(currentText()).toBe("some words!");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2d2w");
            expect(currentText()).toBe("words!");
        });
    });

    describe("with the e motion", function () {
        beforeEach(function () {
            reset("Here are, some words!");
        });

        it("deletes to word endings", function () {
            pressKeys("de");
            expect(currentText()).toBe(" are, some words!");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2de");
            expect(currentText()).toBe(", some words!");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d3e");
            expect(currentText()).toBe(" some words!");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2d2e");
            expect(currentText()).toBe(" words!");
        });
    });

    describe("with the f command", function () {
        beforeEach(function () {
            reset("Lots of Os on one row");
        });

        it("deletes up to and including the match", function () {
            pressKeys("dfo");
            expect(currentText()).toBe("ts of Os on one row");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2dfo");
            expect(currentText()).toBe("f Os on one row");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("d3fo");
            expect(currentText()).toBe("n one row");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2d2fo");
            expect(currentText()).toBe("ne row");
        });
    });

    describe("with line motions", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird\nFourth");
        });

        it("deletes to the end of the file with G", function () {
            pressKeys("jldG");
            expect(currentText()).toBe("First");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });

        it("deletes to the beginning of the file with gg", function () {
            pressKeys("Gkdgg");
            expect(currentText()).toBe("Fourth");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });

        it("deletes to a specific line with [count]G", function () {
            pressKeys("jd3G");
            expect(currentText()).toBe("First\nFourth");
            expect(cursorPosition()).toEqual({row: 1, col: 0});
        });
    });
});
