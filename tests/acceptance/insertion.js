describe("Inserting text", function () {
    it("inserts before the cursor using i", function () {
        reset("test copy");
        pressKeys("i" + "Just some " + ESC);
        expect(currentText()).toBe("Just some test copy");
    });

    it("inserts before the first non-space using I", function () {
        reset("  indented");
        pressKeys("I" + "still " + ESC);
        expect(currentText()).toBe("  still indented");
    });

    it("inserts at the very start of the line using gI", function () {
        reset("  indented!");
        pressKeys("gI" + "not" + ESC);
        expect(currentText()).toBe("not  indented!");
    });
});

describe("Appending text", function () {
    beforeEach(function () { reset("test copy"); });

    it("appends after the cursor using a", function () {
        pressKeys("a" + "otally the b" + ESC);
        expect(currentText()).toBe("totally the best copy");
    });

    it("appends at the end of the line using A", function () {
        pressKeys("A" + " is boring" + ESC);
        expect(currentText()).toBe("test copy is boring");
    });
});

describe("Opening lines", function () {
    beforeEach(function () {
        reset("first line\nsecond line\nthird line");
    });

    it("opens the next line using o", function () {
        pressKeys("o" + "New content!" + ESC);
        expect(currentText()).toBe(
            "first line\nNew content!\nsecond line\nthird line"
        );
    });

    it("can open new lines at the end of the file using o", function () {
        reset("Just one line");
        pressKeys("o" + "Now there are two" + ESC);
        expect(currentText()).toBe(
            "Just one line\nNow there are two"
        );
    });

    it("opens the previous line using O", function () {
        pressKeys("O" + "New content!" + ESC);
        expect(currentText()).toBe(
            "New content!\nfirst line\nsecond line\nthird line"
        );
    });
});

describe("Substituting characters with s", function () {
    beforeEach(function () {
        reset("Some text");
    });

    it("removes a character and enters insert mode", function () {
        pressKeys("s" + "Awes" + ESC);
        expect(currentText()).toBe("Awesome text");
    });

    it("accepts numerical multipliers", function () {
        pressKeys("4s" + "Boring" + ESC);
        expect(currentText()).toBe("Boring text");
    });

    it("is limited to the current line", function () {
        reset("First line\nSecond line\nThird line");
        pressKeys("w7s" + "bit" + ESC);
        expect(currentText()).toBe("First bit\nSecond line\nThird line");
    });
});

describe("Substituting lines with S", function () {
    it("blanks the current line and enters insert mode", function () {
        reset("I wandered\nLonely as\nA cloud");
        pressKeys("jwS" + "Skyward like" + ESC);
        expect(currentText()).toBe("I wandered\nSkyward like\nA cloud");
    });

    it("accepts numerical multipliers", function () {
        reset("First\nSecond\nThird\nFourth");
        pressKeys("2S" + "1 and 2" + ESC);
        expect(currentText()).toBe("1 and 2\nThird\nFourth");
    });
});

describe("Deleting characters with backspace", function () {
    it("deletes a character before the cursor", function () {
        reset("Hello world!!1");
        pressKeys("A" + BACKSPACE + BACKSPACE + ESC);
        expect(currentText()).toBe("Hello world!");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("deletes line breaks", function () {
        reset("First line\nSecond line\nThird line");
        pressKeys("ja" + BACKSPACE + BACKSPACE + ESC);
        expect(currentText()).toBe("First lineecond line\nThird line");
        expect(cursorPosition()).toEqual({row: 0, col: 9});
    });

    it("does not delete beyond the end of the document", function () {
        reset("Hello world");
        pressKeys("gI" + BACKSPACE + BACKSPACE + ESC);
        expect(currentText()).toBe("Hello world");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });
});
