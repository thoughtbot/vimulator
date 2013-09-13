describe("Registers", function () {
    var registers;

    beforeEach(function () {
        registers = new Vimulator.Registers();
    });

    describe(".set", function () {
        it("sets the value in a register", function () {
            registers.set('foo', 'a');
            registers.set('gone', 'b');
            registers.set('bar', 'b');

            expect(registers.get('a')).toEqual('foo');
            expect(registers.get('b')).toEqual('bar');
        });

        it("uses the '0' register if none is given", function () {
            registers.set('default me!');

            expect(registers.get('0')).toEqual('default me!');
            expect(registers.get()).toEqual('default me!');
        });
    });

    describe(".append", function () {
        it("appends the value to an existing register", function () {
            registers.append('f', 'a');
            registers.append('o', 'a');
            registers.append('o', 'a');

            expect(registers.get('a')).toEqual('foo');
        });

        it("uses the '0' register if none is given", function () {
            registers.append('b');
            registers.append('a');
            registers.append('r');

            expect(registers.get('0')).toEqual('bar');
        });
    });

    describe(".use", function () {
        it("changes the default register for set, append, and get", function () {
            registers.set('bar');
            registers.use('x', function () {
                registers.set('fo');
                registers.append('o');
                expect(registers.get()).toEqual('foo');
            });

            expect(registers.get('x')).toEqual('foo');
            expect(registers.get()).toEqual('bar');
        });
    });

    describe(".clear", function () {
        it("clears out existing values", function () {
            registers.set('foo', 'a');
            registers.set('bar', 'b');
            registers.clear();

            expect(registers.get('a')).toBe(undefined);
            expect(registers.get('b')).toBe(undefined);
        });
    });
});
