describe("Simple motions", function () {
    beforeEach(function () {
        reset("XXXXX\nXXXXX\nXXXXX");
    });

    it("moves the cursor around with h, j, k, l", function () {
        expect(cursorPosition()).toEqual({row: 0, col: 0});
        pressKeys("j");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
        pressKeys("l");
        expect(cursorPosition()).toEqual({row: 1, col: 1});
        pressKeys("k");
        expect(cursorPosition()).toEqual({row: 0, col: 1});
        pressKeys("h");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });

    it("accepts numerical multipliers", function () {
        pressKeys("2j3l");
        expect(cursorPosition()).toEqual({row: 2, col: 3});
        pressKeys("k2h");
        expect(cursorPosition()).toEqual({row: 1, col: 1});
    });

    it("does not allow the cursor to go out of bounds", function () {
        pressKeys("2j4l");
        expect(cursorPosition()).toEqual({row: 2, col: 4});
        pressKeys("j");
        expect(cursorPosition()).toEqual({row: 2, col: 4});
        pressKeys("l");
        expect(cursorPosition()).toEqual({row: 2, col: 4});
        pressKeys("kh");
        expect(cursorPosition()).toEqual({row: 1, col: 3});
    });
});

describe("Line motions", function () {
    beforeEach(function () {
        reset("  an indented line");
        pressKeys("7l");
    });

    it("moves to the first non-space with ^", function () {
        pressKeys("^");
        expect(cursorPosition()).toEqual({row: 0, col: 2});
    });
    it("moves to the first column with 0", function () {
        pressKeys("0");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });
    it("moves to the last column with $", function () {
        pressKeys("$");
        expect(cursorPosition()).toEqual({row: 0, col: 17});
    });
});

describe("The e motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
    });

    it("moves to the end of each word", function () {
        pressKeys("e");
        expect(cursorPosition()).toEqual({row: 0, col: 4});
    });

    it("treats punctuation as separate words", function () {
        pressKeys("ee");
        expect(cursorPosition()).toEqual({row: 0, col: 10});
        pressKeys("e");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("wraps to other lines", function () {
        pressKeys("$e");
        expect(cursorPosition()).toEqual({row: 1, col: 10});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("5e");
        expect(cursorPosition()).toEqual({row: 1, col: 10});
    });
});

describe("The E motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
    });

    it("moves to the end of each word", function () {
        pressKeys("E");
        expect(cursorPosition()).toEqual({row: 0, col: 4});
    });

    it("treats punctuation as part of words", function () {
        pressKeys("EE");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
        pressKeys("E");
        expect(cursorPosition()).toEqual({row: 0, col: 21});
    });

    it("wraps to other lines", function () {
        pressKeys("$E");
        expect(cursorPosition()).toEqual({row: 1, col: 12});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("4E");
        expect(cursorPosition()).toEqual({row: 1, col: 12});
    });
});

describe("The w motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
    });

    it("moves to the end of each word", function () {
        pressKeys("w");
        expect(cursorPosition()).toEqual({row: 0, col: 2});
    });

    it("treats punctuation as separate words", function () {
        pressKeys("www");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
        pressKeys("w");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
    });

    it("wraps to other lines", function () {
        pressKeys("$w");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("4w");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
    });
});

describe("The W motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
    });

    it("moves to the end of each word", function () {
        pressKeys("W");
        expect(cursorPosition()).toEqual({row: 0, col: 2});
    });

    it("treats punctuation as part of words", function () {
        pressKeys("WWW");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
        pressKeys("WW");
        expect(cursorPosition()).toEqual({row: 1, col: 14});
    });

    it("wraps to other lines", function () {
        pressKeys("$W");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("4W");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
    });
});

describe("The b motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
        pressKeys("j$");
    });

    it("moves to the start of the previous word", function () {
        pressKeys("b");
        expect(cursorPosition()).toEqual({row: 1, col: 14});
    });

    it("treats punctuation as separate words", function () {
        pressKeys("bb");
        expect(cursorPosition()).toEqual({row: 1, col: 11});
    });

    it("wraps to other lines", function () {
        pressKeys("^b");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("4b");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
    });
});

describe("The B motion", function () {
    beforeEach(function () {
        reset("A few words; including\npunctuation?! sometimes");
        pressKeys("j$");
    });

    it("moves to the start of the previous word", function () {
        pressKeys("B");
        expect(cursorPosition()).toEqual({row: 1, col: 14});
    });

    it("treats punctuation as part of words", function () {
        pressKeys("BB");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
    });

    it("wraps to other lines", function () {
        pressKeys("^B");
        expect(cursorPosition()).toEqual({row: 0, col: 13});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("4B");
        expect(cursorPosition()).toEqual({row: 0, col: 6});
    });
});

describe("The gg motion", function () {
    beforeEach(function () {
        reset("Line 1\nLine 2\nLine 3");
    });

    it("moves the cursor to the start of the file", function () {
        pressKeys("jgg");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });

    it("skips spaces on the first line", function () {
        reset("  Line 1\nLine 2\nLine 3");
        pressKeys("jgg");
        expect(cursorPosition()).toEqual({row: 0, col: 2});
    });

    it("moves to a specific line if given a number", function () {
        pressKeys("2gg");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
        pressKeys("3gg");
        expect(cursorPosition()).toEqual({row: 2, col: 0});
    });

    it("skips spaces on the specified line", function () {
        reset("Line 1\n Line 2\n   Line 3");
        pressKeys("2gg");
        expect(cursorPosition()).toEqual({row: 1, col: 1});
        pressKeys("3gg");
        expect(cursorPosition()).toEqual({row: 2, col: 3});
    });
});

describe("The G motion", function () {
    beforeEach(function () {
        reset("Line 1\nLine 2\nLine 3");
    });

    it("moves the cursor to the last line", function () {
        pressKeys("jG");
        expect(cursorPosition()).toEqual({row: 2, col: 0});
    });

    it("skips spaces on the last line", function () {
        reset("Line 1\nLine 2\n  Line 3");
        pressKeys("jG");
        expect(cursorPosition()).toEqual({row: 2, col: 2});
    });

    it("moves to a specific line if given a number", function () {
        pressKeys("2G");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
        pressKeys("1G");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });

    it("skips spaces on the specified line", function () {
        reset("   Line 1\n Line 2\nLine 3");
        pressKeys("2G");
        expect(cursorPosition()).toEqual({row: 1, col: 1});
        pressKeys("1G");
        expect(cursorPosition()).toEqual({row: 0, col: 3});
    });
});
