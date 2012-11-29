describe("CommandList", function () {
    describe(".getCommand", function () {
        var source1, source2;

        beforeEach(function () {
            source1 = {
                'a': mockCommand(),
                'b': mockCommand()
            };
            source2 = {
                'b': mockCommand(),
                'c': mockCommand()
            };
        });

        it("finds a command by key", function () {
            var list = new Vimulator.CommandList(source1);
            expect(list.getCommand('a')).toBe(source1.a);
            expect(list.getCommand('b')).toBe(source1.b);
        });

        it("searches sources in order", function () {
            var list = new Vimulator.CommandList(source1, source2);
            expect(list.getCommand('a')).toBe(source1.a);
            expect(list.getCommand('b')).toBe(source1.b);
            expect(list.getCommand('c')).toBe(source2.c);
        });
    });
});
