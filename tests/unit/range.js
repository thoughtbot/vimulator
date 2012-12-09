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
});

describe("InclusiveLineRange", function () {
    describe(".removeFrom", function () {
    });

    describe(".replace", function () {
    });
});
