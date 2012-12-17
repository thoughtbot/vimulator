describe("TextObject", function () {
    var to, vim;

    beforeEach(function () {
        vim = new Vimulator.Base().init();
        to = new Vimulator.TextObject({start: '(', end: ')'});
    });

    describe(".insideRange", function () {
        it("finds start and end points", function () {
            var range;

            vim.lines = ["Some text (with parens)"];
            vim.cursor.col = 12;
            range = to.insideRange(vim);

            expect(range.start).toEqual({row: 0, col: 11});
            expect(range.end).toEqual({row: 0, col: 21});
            expect(range.inclusive).toBe(true);
        });

        it("works accross multiple lines", function () {
            var range;
            vim.lines = ["Some text (with a", "multi-line", "parenthetical)"];
            vim.cursor.row = 1;
            range = to.insideRange(vim);

            expect(range.start).toEqual({row: 0, col: 11});
            expect(range.end).toEqual({row: 2, col: 12});
            expect(range.inclusive).toBe(true);
        });

        it("returns null for unmatched parens", function () {
            var range;

            vim.lines = ["Some text (with unmatched parens"];
            vim.cursor.col = 15;
            range = to.insideRange(vim);

            expect(range).toBe(null);
        });

        it("handles outer nested parens", function () {
            var range;
            vim.lines = ["(Outer (inner) outer)"];
            vim.cursor.col = 17;
            range = to.insideRange(vim);

            expect(range.start).toEqual({row: 0, col: 1});
            expect(range.end).toEqual({row: 0, col: 19});
            expect(range.inclusive).toBe(true);
        });

        it("handles inner nested parens", function () {
            var range;
            vim.lines = ["(Outer (inner) outer)"];
            vim.cursor.col = 10;
            range = to.insideRange(vim);

            expect(range.start).toEqual({row: 0, col: 8});
            expect(range.end).toEqual({row: 0, col: 12});
            expect(range.inclusive).toBe(true);
        });
    });

    describe(".aroundRange", function () {
        it("finds start and end points", function () {
            var range;

            vim.lines = ["Some text (with parens)"];
            vim.cursor.col = 12;
            range = to.aroundRange(vim);

            expect(range.start).toEqual({row: 0, col: 10});
            expect(range.end).toEqual({row: 0, col: 22});
            expect(range.inclusive).toBe(true);
        });

        it("works accross multiple lines", function () {
            var range;
            vim.lines = ["Some text (with a", "multi-line", "parenthetical)"];
            vim.cursor.row = 1;
            range = to.aroundRange(vim);

            expect(range.start).toEqual({row: 0, col: 10});
            expect(range.end).toEqual({row: 2, col: 13});
            expect(range.inclusive).toBe(true);
        });

        it("returns null for unmatched parens", function () {
            var range;

            vim.lines = ["Some text (with unmatched parens"];
            vim.cursor.col = 15;
            range = to.aroundRange(vim);

            expect(range).toBe(null);
        });

        it("handles nested parens", function () {
            var range;
            vim.lines = ["(Outer (inner) outer)"];
            vim.cursor.col = 17;
            range = to.aroundRange(vim);

            expect(range.start).toEqual({row: 0, col: 0});
            expect(range.end).toEqual({row: 0, col: 20});
            expect(range.inclusive).toBe(true);
        });
    });
});
