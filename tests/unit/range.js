describe("CharacterRange set to inclusive", function () {
    var buffer, range;

    beforeEach(function () {
        buffer = {
            lines: [
                "The first line",
                "The second line",
                "The third line"
            ]
        };
    });

    describe(".removeFrom", function () {
        it("can remove characters in a single line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 4},
                {row: 0, col: 9},
                {inclusive: true}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The line",
                "The second line",
                "The third line"
            ]);
        });

        it("can remove chracters over multiple lines", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: true}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The firhird line"
            ]);
        });

        it("can remove characters to the end of a line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 3},
                {row: 0, col: 13},
                {inclusive: true}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The",
                "The second line",
                "The third line"
            ]);
        });

        it("can accept a start position before the end position", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 9},
                {row: 0, col: 4},
                {inclusive: true}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The line",
                "The second line",
                "The third line"
            ]);
        });
    });

    describe(".replaceIn", function () {
        it("can replace characters in a single line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 4},
                {row: 0, col: 9},
                {inclusive: true}
            );

            range.replaceIn(buffer, "l-l-");

            expect(buffer.lines).toEqual([
                "The l-l-line",
                "The second line",
                "The third line"
            ]);
        });

        it("can replace chracters over multiple lines", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: true}
            );

            range.replaceIn(buffer, "-");

            expect(buffer.lines).toEqual([
                "The fir-hird line"
            ]);
        });

        it("can replace characters to the end of a line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 3},
                {row: 0, col: 13},
                {inclusive: true}
            );

            range.replaceIn(buffer, "...");

            expect(buffer.lines).toEqual([
                "The...",
                "The second line",
                "The third line"
            ]);
        });

        it("can accept a start position before the end position", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 9},
                {row: 0, col: 4},
                {inclusive: true}
            );

            range.replaceIn(buffer, "bee-");

            expect(buffer.lines).toEqual([
                "The bee-line",
                "The second line",
                "The third line"
            ]);
        });
    });

    describe(".contains", function () {
        beforeEach(function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: true}
            );
        });

        it("returns true for the start character", function () {
            expect(range.contains({row: 0, col: 7})).toBe(true);
        });

        it("returns true for the end character", function () {
            expect(range.contains({row: 2, col: 4})).toBe(true);
        });

        it("returns true in the middle of the range", function () {
            expect(range.contains({row: 1, col: 5})).toBe(true);
        });

        it("returns false for a character outside the range", function () {
            expect(range.contains({row: 0, col: 4})).toBe(false);
            expect(range.contains({row: 2, col: 6})).toBe(false);
        });
    });
});

describe("CharacterRange set to exclusive", function () {
    var buffer, range;

    beforeEach(function () {
        buffer = {
            lines: [
                "The first line",
                "The second line",
                "The third line"
            ]
        };
    });

    describe(".removeFrom", function () {
        it("can remove characters in a single line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 4},
                {row: 0, col: 9},
                {inclusive: false}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The  line",
                "The second line",
                "The third line"
            ]);
        });

        it("can remove chracters over multiple lines", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: false}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The firthird line"
            ]);
        });

        it("cannot remove characters to the end of a line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 3},
                {row: 0, col: 13},
                {inclusive: false}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "Thee",
                "The second line",
                "The third line"
            ]);
        });

        it("can accept a start position before the end position", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 9},
                {row: 0, col: 4},
                {inclusive: false}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The  line",
                "The second line",
                "The third line"
            ]);
        });
    });

    describe(".replaceIn", function () {
        it("can replace characters in a single line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 4},
                {row: 0, col: 9},
                {inclusive: false}
            );

            range.replaceIn(buffer, "l-l-");

            expect(buffer.lines).toEqual([
                "The l-l- line",
                "The second line",
                "The third line"
            ]);
        });

        it("can replace chracters over multiple lines", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: false}
            );

            range.replaceIn(buffer, "-");

            expect(buffer.lines).toEqual([
                "The fir-third line"
            ]);
        });

        it("cannot replace characters to the end of a line", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 3},
                {row: 0, col: 13},
                {inclusive: false}
            );

            range.replaceIn(buffer, "...");

            expect(buffer.lines).toEqual([
                "The...e",
                "The second line",
                "The third line"
            ]);
        });

        it("can accept a start position before the end position", function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 9},
                {row: 0, col: 4},
                {inclusive: false}
            );

            range.replaceIn(buffer, "bee-");

            expect(buffer.lines).toEqual([
                "The bee- line",
                "The second line",
                "The third line"
            ]);
        });
    });

    describe(".contains", function () {
        beforeEach(function () {
            range = new Vimulator.CharacterRange(
                {row: 0, col: 7},
                {row: 2, col: 4},
                {inclusive: false}
            );
        });

        it("returns true for the start character", function () {
            expect(range.contains({row: 0, col: 7})).toBe(true);
        });

        it("returns false for the end character", function () {
            expect(range.contains({row: 2, col: 4})).toBe(false);
        });

        it("returns true in the middle of the range", function () {
            expect(range.contains({row: 1, col: 5})).toBe(true);
        });

        it("returns false for a character outside the range", function () {
            expect(range.contains({row: 0, col: 4})).toBe(false);
            expect(range.contains({row: 2, col: 6})).toBe(false);
        });
    });
});

describe("LineRange", function () {
    var buffer, range;

    beforeEach(function () {
        buffer = {
            lines: [
                "The first line",
                "The second line",
                "The third line"
            ]
        };
    });

    describe(".removeFrom", function () {
        it("can remove a single line", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 0},
                {row: 0, col: 3}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The second line",
                "The third line"
            ]);
        });

        it("can remove multiple lines", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 7},
                {row: 1, col: 5}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The third line"
            ]);
        });

        it("can accept an end row before the start row", function () {
            range = new Vimulator.LineRange(
                {row: 1, col: 7},
                {row: 0, col: 5}
            );

            range.removeFrom(buffer);

            expect(buffer.lines).toEqual([
                "The third line"
            ]);
        });
    });

    describe(".replaceIn", function () {
        it("can replace a single line", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 0},
                {row: 0, col: 3}
            );

            range.replaceIn(buffer, "Line 1");

            expect(buffer.lines).toEqual([
                "Line 1",
                "The second line",
                "The third line"
            ]);
        });

        it("can replace multiple lines", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 7},
                {row: 1, col: 5}
            );

            range.replaceIn(buffer, "1 & 2");

            expect(buffer.lines).toEqual([
                "1 & 2",
                "The third line"
            ]);
        });

        it("can accept an end row before the start row", function () {
            range = new Vimulator.LineRange(
                {row: 1, col: 7},
                {row: 0, col: 5}
            );

            range.replaceIn(buffer, "Replacement");

            expect(buffer.lines).toEqual([
                "Replacement",
                "The third line"
            ]);
        });
    });

    describe(".captureFrom", function () {
        it("can capture the first line", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 0},
                {row: 0, col: 2}
            );

            expect(range.captureFrom(buffer)).toBe("The first line");
        });

        it("can capture the last line", function () {
            range = new Vimulator.LineRange(
                {row: 2, col: 0},
                {row: 2, col: 2}
            );

            expect(range.captureFrom(buffer)).toBe("The third line");
        });

        it("can capture multiple lines", function () {
            range = new Vimulator.LineRange(
                {row: 0, col: 0},
                {row: 1, col: 2}
            );

            expect(range.captureFrom(buffer))
                .toBe("The first line\nThe second line");
        });
    });
});
