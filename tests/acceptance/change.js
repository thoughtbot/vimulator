describe("The change operator c", function () {
    describe("with the argument c", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird");
            pressKeys("2l");
        });

        it("changes a whole line", function () {
            pressKeys("cc" + "Number 1" + ESC);
            expect(currentText()).toBe("Number 1\nSecond\nThird");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2cc" + "1 & 2" + ESC);
            expect(currentText()).toBe("1 & 2\nThird");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c2c" + "1 & 2" + ESC);
            expect(currentText()).toBe("1 & 2\nThird");
        });
    });

    describe("with j and k motions", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird\nFourth\nFifth");
        });

        it("changes whole lines", function () {
            pressKeys("2lcj" + "One and two" + ESC);
            expect(currentText()).toBe("One and two\nThird\nFourth\nFifth");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2cj" + "Changed" + ESC);
            expect(currentText()).toBe("Changed\nFourth\nFifth");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c2j" + "New!" + ESC);
            expect(currentText()).toBe("New!\nFourth\nFifth");
        });

        it("accepts multiple numerical multipliers", function () {
            reset("1\n2\n3\n4\n5\n6\n7");
            pressKeys("j2c2j" + "Woo" + ESC);
            expect(currentText()).toBe("1\nWoo\n7");
        });
    });

    describe("with h and l motions", function () {
        beforeEach(function () {
            reset("1234567890");
        });

        it("changes characters", function () {
            pressKeys("cl" + "one" + ESC);
            expect(currentText()).toBe("one234567890");
            pressKeys("3lch" + "three" + ESC);
            expect(currentText()).toBe("one2three4567890");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2cl" + "!@" + ESC);
            expect(currentText()).toBe("!@34567890");
            pressKeys("5l3ch" + "$%^" + ESC);
            expect(currentText()).toBe("!@3$%^7890");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c2l" + "!@" + ESC);
            expect(currentText()).toBe("!@34567890");
            pressKeys("5lc3h" + "$%^" + ESC);
            expect(currentText()).toBe("!@3$%^7890");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2c2l" + "wow" + ESC);
            expect(currentText()).toBe("wow567890");
        });
    });

    describe("with line motions", function () {
        it("changes to the end of the line with $", function () {
            reset("1234567890");
            pressKeys("2lc$" + "!" + ESC);
            expect(currentText()).toBe("12!");
            expect(cursorPosition()).toEqual({row: 0, col: 2});
        });

        it("changes to the start of the line with ^", function () {
            reset("  1234567890");
            pressKeys("4lc^" + "one, two, " + ESC);
            expect(currentText()).toBe("  one, two, 34567890");
            expect(cursorPosition()).toEqual({row: 0, col: 11});
        });

        it("changes to the start of the line with 0", function () {
            reset("  1234567890");
            pressKeys("4lc0" + "<" + ESC);
            expect(currentText()).toBe("<34567890");
            expect(cursorPosition()).toEqual({row: 0, col: 0});
        });
    });

    describe("with the w motion", function () {
        beforeEach(function () {
            reset("Here are, some words!");
        });

        it("changes words", function () {
            pressKeys("cw" + "There" + ESC);
            expect(currentText()).toBe("There are, some words!");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2cw" + "There were" + ESC);
            expect(currentText()).toBe("There were, some words!");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c3w" + "Write" + ESC);
            expect(currentText()).toBe("Write some words!");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2c2w" + "Lovely" + ESC);
            expect(currentText()).toBe("Lovely words!");
        });

        it("can change to the end of line", function () {
            pressKeys("4wc2w" + "things." + ESC);
            expect(currentText()).toBe("Here are, some things.");
        });

        it("can wrap onto multiple lines", function () {
            reset("Some words\non several lines");
            pressKeys("wc3w" + "short" + ESC);
            expect(currentText()).toBe("Some short lines");
        });
    });

    describe("with the e motion", function () {
        beforeEach(function () {
            reset("Here are, some words!");
        });

        it("changes to word endings", function () {
            pressKeys("ce" + "There" + ESC);
            expect(currentText()).toBe("There are, some words!");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2ce" + "There were" + ESC);
            expect(currentText()).toBe("There were, some words!");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c3e" + "Write" + ESC);
            expect(currentText()).toBe("Write some words!");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2c2e" + "Awful" + ESC);
            expect(currentText()).toBe("Awful words!");
        });
    });

    describe("with the f and F searches", function () {
        beforeEach(function () {
            reset("Lots of Os on one row");
        });

        it("changes up to and including the match", function () {
            pressKeys("cft" + "Bag" + ESC);
            expect(currentText()).toBe("Bags of Os on one row");
            pressKeys("ecFB" + "Stack" + ESC);
            expect(currentText()).toBe("Stacks of Os on one row");
        });

        it("accepts numerical multipliers", function () {
            pressKeys("2cfo" + "Naf" + ESC);
            expect(currentText()).toBe("Naff Os on one row");
        });

        it("accepts numerical multipliers before the argument", function () {
            pressKeys("c3fo" + "Writte" + ESC);
            expect(currentText()).toBe("Written one row");
        });

        it("accepts multiple numerical multipliers", function () {
            pressKeys("2c2fo" + "O" + ESC);
            expect(currentText()).toBe("One row");
        });
    });

    describe("with t and T searches", function () {
        beforeEach(function () {
            reset("Hello world");
        });

        it("changes up to the searched character", function () {
            pressKeys("ctw" + "Under" + ESC);
            expect(currentText()).toBe("Underworld");
            pressKeys("$c2Tr" + "groun" + ESC);
            expect(currentText()).toBe("Underground");
        });
    });

    describe("with line motions", function () {
        beforeEach(function () {
            reset("First\nSecond\nThird\nFourth");
        });

        it("changes to the end of the file with G", function () {
            pressKeys("jlcG" + "Last" + ESC);
            expect(currentText()).toBe("First\nLast");
        });

        it("changes to the beginning of the file with gg", function () {
            pressKeys("Gkcgg" + "1st, 2nd, 3rd" + ESC);
            expect(currentText()).toBe("1st, 2nd, 3rd\nFourth");
        });

        it("changes to a specific line with [count]G", function () {
            pressKeys("jc3G" + "2 and 3" + ESC);
            expect(currentText()).toBe("First\n2 and 3\nFourth");
        });
    });
});
