describe("Words", function () {
    var words;

    beforeEach(function () {
        words = new Vimulator.Words("Here are some words");
    });

    describe(".beginningBefore", function () {
        it("finds the last beginning before the given position", function () {
            expect(words.beginningBefore(16)).toEqual({found: 1, col: 14});
            expect(words.beginningBefore(14)).toEqual({found: 1, col: 9});
            expect(words.beginningBefore(8)).toEqual({found: 1, col: 5});
        });

        it("takes a count", function () {
            expect(words.beginningBefore(16, 2)).toEqual({found: 2, col: 9});
            expect(words.beginningBefore(14, 3)).toEqual({found: 3, col: 0});
            expect(words.beginningBefore(14, 5)).toEqual({found: 3, col: 0});
        });
    });

    describe(".beginningAfter", function () {
        it("finds the next beginning after the given position", function () {
            expect(words.beginningAfter(0)).toEqual({found: 1, col: 5});
            expect(words.beginningAfter(5)).toEqual({found: 1, col: 9});
            expect(words.beginningAfter(11)).toEqual({found: 1, col: 14});
        });

        it("takes a count", function () {
            expect(words.beginningAfter(0, 3)).toEqual({found: 3, col: 14});
            expect(words.beginningAfter(6, 2)).toEqual({found: 2, col: 14});
            expect(words.beginningAfter(6, 5)).toEqual({found: 2, col: 14});
        });
    });

    describe(".endingAfter", function () {
        it("finds the next ending after the given position", function () {
            expect(words.endingAfter(0)).toEqual({found: 1, col: 3});
            expect(words.endingAfter(5)).toEqual({found: 1, col: 7});
            expect(words.endingAfter(11)).toEqual({found: 1, col: 12});
        });

        it("takes a count", function () {
            expect(words.endingAfter(0, 3)).toEqual({found: 3, col: 12});
            expect(words.endingAfter(6, 2)).toEqual({found: 2, col: 12});
            expect(words.endingAfter(6, 5)).toEqual({found: 3, col: 18});
        });
    });
});
