describe("Utils", function () {
    describe(".keyName", function () {
        it("describes escape", function () {
            expect(Vimulator.Utils.keyName(ESC)).toBe("\u241B");
        });

        it("describes return", function () {
            expect(Vimulator.Utils.keyName(RETURN)).toBe("\u23CE");
        });

        it("returns the key for printable characters", function () {
            var keys, k, i;

            keys = "aQ1.:";
            for (i = 0; i < keys.length; i++) {
                k = keys.charAt(i);
                expect(Vimulator.Utils.keyName(k)).toBe(k);
            }
        });
    });
});
