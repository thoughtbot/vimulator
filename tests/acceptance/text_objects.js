describe("Text objects", function () {
    describe("parentheses", function () {
        beforeEach(function () {
            reset("Text (with a parenthetical) is great");
        });

        it("can specify text within brackets", function () {
            pressKeys("3wdib");
            expect(currentText()).toBe("Text () is great");
        });

        it("can specify text including the brackets", function () {
            pressKeys("3wdab");
            expect(currentText()).toBe("Text  is great");
        });
    });
});
