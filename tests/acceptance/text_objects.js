describe("Text objects", function () {
    describe("parentheses", function () {
        beforeEach(function () {
            reset("Text (with a parenthetical) is great");
        });

        it("can specify text within brackets", function () {
            pressKeys("3wdib");
            expect(currentText()).toBe("Text () is great");
        });

        it("matches when the cursor is on the opening bracket", function () {
            pressKeys("f(dib");
            expect(currentText()).toBe("Text () is great");
        });

        it("matches when the cursor is on the closing bracket", function () {
            pressKeys("f)dib");
            expect(currentText()).toBe("Text () is great");
        });

        it("can specify text including the brackets", function () {
            pressKeys("3wdab");
            expect(currentText()).toBe("Text  is great");
        });

        it("does nothing if there are no brackets", function () {
            reset("Some text, no brackets");
            pressKeys("dab");
            expect(currentText()).toBe("Some text, no brackets");
        });
    });
});
