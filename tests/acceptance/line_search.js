describe("Searching the line with f", function () {
    beforeEach(function () {
        reset("Lots of Os on one row");
    });

    it("moves the cursor to the next match", function () {
        pressKeys("fo");
        expect(cursorPosition()).toEqual({row: 0, col: 1});
        pressKeys("fo");
        expect(cursorPosition()).toEqual({row: 0, col: 5});
        pressKeys("fo");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("can be repeated with ;", function () {
        pressKeys("fo;");
        expect(cursorPosition()).toEqual({row: 0, col: 5});
        pressKeys(";");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("can be repeated in reverse with ,", function () {
        pressKeys("fo;;;;,");
        expect(cursorPosition()).toEqual({row: 0, col: 14});
        pressKeys(",");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("accepts numerical multipliers", function () {
        pressKeys("3fo");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
        pressKeys("2;");
        expect(cursorPosition()).toEqual({row: 0, col: 19});
        pressKeys("3,");
        expect(cursorPosition()).toEqual({row: 0, col: 5});
    });

    it("does not move the cursor if the multiplier is too big", function () {
        pressKeys("6fo");
        expect(cursorPosition()).toEqual({row: 0, col: 0});
    });
});

describe("Searching the line with F", function () {
    beforeEach(function () {
        reset("Lots of Os on one row");
        pressKeys("$");
    });

    it("moves the cursor to the previous match", function () {
        pressKeys("Fo");
        expect(cursorPosition()).toEqual({row: 0, col: 19});
        pressKeys("Fo");
        expect(cursorPosition()).toEqual({row: 0, col: 14});
        pressKeys("Fo");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("can be repeated with ;", function () {
        pressKeys("Fo;");
        expect(cursorPosition()).toEqual({row: 0, col: 14});
        pressKeys(";");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("can be repeated in reverse with ,", function () {
        pressKeys("Fo;;;;,");
        expect(cursorPosition()).toEqual({row: 0, col: 5});
        pressKeys(",");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
    });

    it("accepts numerical multipliers", function () {
        pressKeys("3Fo");
        expect(cursorPosition()).toEqual({row: 0, col: 11});
        pressKeys("2;");
        expect(cursorPosition()).toEqual({row: 0, col: 1});
        pressKeys("3,");
        expect(cursorPosition()).toEqual({row: 0, col: 14});
    });

    it("does not move the cursor if the multiplier is too big", function () {
        pressKeys("6Fo");
        expect(cursorPosition()).toEqual({row: 0, col: 20});
    });
});

describe("Searching the line with t", function () {
    beforeEach(function () {
        reset("Yeah! Lots of Os on one row");
    });

    it("moves the cursor to just before the next match", function () {
        pressKeys("to");
        expect(cursorPosition()).toEqual({row: 0, col: 6});
    });

    it("does not move the cursor if the next charater is a match", function () {
        pressKeys("to");
        expect(cursorPosition()).toEqual({row: 0, col: 6});
        pressKeys("to");
        expect(cursorPosition()).toEqual({row: 0, col: 6});
    });

    it("can be repeated with ;", function () {
        pressKeys("to;");
        expect(cursorPosition()).toEqual({row: 0, col: 10});
        pressKeys(";");
        expect(cursorPosition()).toEqual({row: 0, col: 16});
    });

    it("can be repeated in reverse with ,", function () {
        pressKeys("to;;;;,");
        expect(cursorPosition()).toEqual({row: 0, col: 21});
        pressKeys(",");
        expect(cursorPosition()).toEqual({row: 0, col: 18});
    });

    it("accepts numerical multipliers", function () {
        pressKeys("3to");
        expect(cursorPosition()).toEqual({row: 0, col: 16});
        pressKeys("2;");
        expect(cursorPosition()).toEqual({row: 0, col: 19});
        pressKeys("3,");
        expect(cursorPosition()).toEqual({row: 0, col: 8});
    });
});

describe("Searching the line with T", function () {
    beforeEach(function () {
        reset("Lots of Os on one row. Yeah!");
        pressKeys("$");
    });

    it("moves the cursor to just after the previous match", function () {
        pressKeys("To");
        expect(cursorPosition()).toEqual({row: 0, col: 20});
    });

    it("does not move the cursor if the previous charater is a match", function () {
        pressKeys("To");
        expect(cursorPosition()).toEqual({row: 0, col: 20});
        pressKeys("To");
        expect(cursorPosition()).toEqual({row: 0, col: 20});
    });

    it("can be repeated with ;", function () {
        pressKeys("To;");
        expect(cursorPosition()).toEqual({row: 0, col: 15});
        pressKeys(";");
        expect(cursorPosition()).toEqual({row: 0, col: 12});
    });

    it("can be repeated in reverse with ,", function () {
        pressKeys("To;;;;,");
        expect(cursorPosition()).toEqual({row: 0, col: 4});
        pressKeys(",");
        expect(cursorPosition()).toEqual({row: 0, col: 10});
    });

    it("accepts numerical multipliers", function () {
        pressKeys("3To");
        expect(cursorPosition()).toEqual({row: 0, col: 12});
        pressKeys("2;");
        expect(cursorPosition()).toEqual({row: 0, col: 6});
        pressKeys("3,");
        expect(cursorPosition()).toEqual({row: 0, col: 18});
    });
});
