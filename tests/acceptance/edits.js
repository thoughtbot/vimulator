describe("The x command", function () {
    beforeEach(function () { reset("Just some text"); });

    it("deletes the character under the cursor", function () {
        pressKeys("x");
        expect(currentText()).toBe("ust some text");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("10x");
        expect(currentText()).toBe("text");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });

    it("is limitted to the current line", function () {
        reset("First line\nSecond line");
        pressKeys("w6x");
        expect(currentText()).toBe("First \nSecond line");
        expect(cursorPosition()).toEqual({row: 0, col: 5});
    });
});

describe("The X command", function () {
    beforeEach(function () { reset("Just some text"); });

    it("deletes the character before the cursor", function () {
        pressKeys("2lX");
        expect(currentText()).toBe("Jst some text");
        expect(cursorPosition()).toEqual({row: 0, col: 1});
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("$10X");
        expect(currentText()).toBe("Just");
        expect(cursorPosition()).toEqual({row: 0, col: 3});
    });

    it("is limitted to the current line", function () {
        reset("First line\nSecond line");
        pressKeys("j2l7X");
        expect(currentText()).toBe("First line\ncond line");
        expect(cursorPosition()).toEqual({row: 1, col: 0});
    });
});

describe("The r command", function () {
    beforeEach(function () { reset("Kust some text"); });

    it("replaces the character under the cursor", function () {
        pressKeys("rJ");
        expect(currentText()).toBe("Just some text");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
        pressKeys("rr");
        expect(currentText()).toBe("rust some text");
    });

    it("accepts a numerical multiplier", function () {
        pressKeys("3rx");
        expect(currentText()).toBe("xxxt some text");
        expect(cursorPosition()).toEqual({row: 0, col: 2});
    });

    it("can replace up to the end of the line", function () {
        pressKeys("$h2r!");
        expect(currentText()).toBe("Kust some te!!");
    });

    it("does nothing if the multiplier goes beyond the EOL", function () {
        pressKeys("$h4r!");
        expect(currentText()).toBe("Kust some text");
    });
});

describe("The D command", function () {
    beforeEach(function () { reset("Starts well, ends badly"); });

    it("deletes from the cursor to the end of the line", function () {
        pressKeys("2ED");
        expect(currentText()).toBe("Starts well");
        expect(cursorPosition()).toEqual({row: 0, col: 10});
    });
});

describe("The C command", function () {
    beforeEach(function () { reset("Starts well, ends badly"); });

    it("changes from the cursor to the end of the line", function () {
        pressKeys("2EC" + " and goes down hill" + ESC);
        expect(currentText()).toBe("Starts well and goes down hill");
    });
});
