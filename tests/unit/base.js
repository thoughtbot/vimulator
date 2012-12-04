describe("Base", function () {
    var vim;

    beforeEach(function () {
        vim = new Vimulator.Base().init();
    });

    describe(".mode", function () {
        it("defaults to normal mode", function () {
            expect(vim.mode.name).toBe("normal");
        });
    });

    describe(".setMode", function () {
        it("switches to the named mode", function () {
            vim.setMode("insert");
            expect(vim.mode.name).toBe("insert");
            vim.setMode("normal");
            expect(vim.mode.name).toBe("normal");
        });

        it("calls the enter method on the new mode", function () {
            spyOn(vim.modes.insert, "enter");
            spyOn(vim.modes.normal, "enter");

            vim.setMode("insert");
            expect(vim.modes.insert.enter).toHaveBeenCalled();
            vim.setMode("normal");
            expect(vim.modes.normal.enter).toHaveBeenCalled();
        });

        it("raises an error if the mode does not exist", function () {
            expect(function () {
                vim.setMode("jazz");
            }).toThrow();
        });
    });

    describe(".keyPress", function () {
        it("passes a string representation to the mode", function () {
            var i, chars, chr, code;
            chars = ['a', 'b', '1', ESC];

            spyOn(vim.mode, "keyPress");
            for (i = 0; i < chars.length; i++) {
                chr = chars[i];
                code = chr.charCodeAt(0);
                vim.keyPress(code);
                expect(vim.mode.keyPress).toHaveBeenCalledWith(chr);
            }
        });
    });

    describe(".findNext", function () {
        it("returns the position of the next match", function () {
            vim.lines = ["Lots of Os on one row"];
            vim.moveCursorRelative(0, 5);

            expect(vim.findNext('o')).toEqual({col: 11, row: 0});
        });

        it("returns null if there is no match", function () {
            vim.lines = ["The last character of the alphabet? No."];
            expect(vim.findNext('z')).toBe(null);
        });

        it("optionally wraps to other lines", function () {
            vim.lines = ["First row", "Second row"];

            expect(vim.findNext('S')).toBe(null);
            expect(vim.findNext('S', {wrap: true}))
                .toEqual({row: 1, col: 0});
        });

        it("optionally offsets the cursor", function () {
            vim.lines = ["Foo!"];

            expect(vim.findNext('!', {offset: -1}))
                .toEqual({row: 0, col: 2});
        });

        it("avoids illegal cursor positions when offsetting", function () {
            vim.lines = ["Foo!"];

            expect(vim.findNext('!', {offset: 1}))
                .toEqual({row: 0, col: 3});
        });

        it("will wrap the cursor when offsetting if wrap is enabled", function () {
            vim.lines = ["First", "Second"];

            expect(vim.findNext('s', {offset: 3}))
                .toEqual({row: 0, col: 4});
            expect(vim.findNext('s', {offset: 3, wrap: true}))
                .toEqual({row: 1, col: 1});
            expect(vim.findNext('d', {offset: 3, wrap: true}))
                .toEqual({row: 1, col: 5});
        });

        it("optionally start from somewhere other than the cursor", function () {
            vim.lines = ["Just some words"];
            vim.moveCursorRelative(0, 8);

            expect(vim.findNext('o'))
                .toEqual({row: 0, col: 11});
            expect(vim.findNext('o', {from: {row: 0, col: 0}}))
                .toEqual({row: 0, col: 6});
        });

        it("optionally includes the character under the cursor", function () {
            vim.lines = ["Foo"];
            vim.moveCursorRelative(0, 1);

            expect(vim.findNext('o'))
                .toEqual({row: 0, col: 2});
            expect(vim.findNext('o', {inclusive: true}))
                .toEqual({row: 0, col: 1});
        });
    });

    describe(".findLast", function () {
        it("returns the position of the previous match", function () {
            vim.lines = ["Lots of Os on one row"];
            vim.moveCursorRelative(0, 5);

            expect(vim.findLast('o')).toEqual({col: 1, row: 0});
        });

        it("returns null if there is no match", function () {
            vim.lines = ["The last character of the alphabet? No."];
            vim.moveCursorRelative(0, 20);
            expect(vim.findLast('z')).toBe(null);
        });

        it("optionally wraps to other lines", function () {
            vim.lines = ["First row", "Second row"];
            vim.moveCursorRelative(1, 2);

            expect(vim.findLast('F')).toBe(null);
            expect(vim.findLast('F', {wrap: true}))
                .toEqual({row: 0, col: 0});
        });

        it("optionally offsets the cursor", function () {
            vim.lines = ["Foo!"];
            vim.moveCursorRelative(0, 3);

            expect(vim.findLast('F', {offset: 1}))
                .toEqual({row: 0, col: 1});
        });

        it("avoids illegal cursor positions when offsetting", function () {
            vim.lines = ["Foo!"];
            vim.moveCursorRelative(0, 3);

            expect(vim.findLast('F', {offset: -1}))
                .toEqual({row: 0, col: 0});
        });

        it("will wrap the cursor when offsetting if wrap is enabled", function () {
            vim.lines = ["First", "Second"];
            vim.moveCursorRelative(1, 5);

            expect(vim.findLast('e', {offset: -3}))
                .toEqual({row: 1, col: 0});
            expect(vim.findLast('e', {offset: -3, wrap: true}))
                .toEqual({row: 0, col: 3});
            expect(vim.findLast('F', {offset: -3, wrap: true}))
                .toEqual({row: 0, col: 0});
        });

        it("optionally start from somewhere other than the cursor", function () {
            vim.lines = ["Just some words"];
            vim.moveCursorRelative(0, 8);

            expect(vim.findLast('o'))
                .toEqual({row: 0, col: 6});
            expect(vim.findLast('o', {from: {row: 0, col: 15}}))
                .toEqual({row: 0, col: 11});
        });

        it("optionally includes the character under the cursor", function () {
            vim.lines = ["Foo"];
            vim.moveCursorRelative(0, 2);

            expect(vim.findLast('o'))
                .toEqual({row: 0, col: 1});
            expect(vim.findLast('o', {inclusive: true}))
                .toEqual({row: 0, col: 2});
        });
    });
});
