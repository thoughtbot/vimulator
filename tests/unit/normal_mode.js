describe("NormalMode", function () {
    describe(".name", function () {
        it("is normal", function () {
            var nm = new Vimulator.NormalMode();
            expect(nm.name).toBe("normal");
        });
    });

    describe(".currentOperation", function () {
        var nm;

        beforeEach(function () {
            nm = new Vimulator.NormalMode();
        });

        it("defaults to an empty operation", function () {
            expect(nm.currentOperation).not.toEqual(null);
        });

        it("takes the mode's command list as context", function () {
            expect(nm.currentOperation.context).toBe(nm.commandList());
        });
    });

    describe(".keyPress", function () {
        var nm, vim;

        beforeEach(function () {
            vim = {};
            nm = new Vimulator.NormalMode(vim);
        });

        it("is forwarded to the current operation", function () {
            var op = nm.currentOperation;
            spyOn(op, "keyPress");
            expect(op.keyPress).not.toHaveBeenCalled();
            nm.keyPress('2');
            expect(op.keyPress).toHaveBeenCalledWith('2');
        });

        it("returns the operation", function () {
            var op = nm.currentOperation;
            expect(nm.keyPress('2')).toBe(op);
        });

        describe('with escape', function () {
            it("is not forwarded to the current operation", function () {
                var op = nm.currentOperation;
                spyOn(op, "keyPress");
                nm.keyPress(ESC);
                expect(op.keyPress).not.toHaveBeenCalled();
            });

            it("replaces the current operation", function () {
                var op = nm.currentOperation;
                nm.keyPress(ESC);
                expect(nm.currentOperation).not.toBe(op);
            });

            it("does not execute the current operation", function () {
                var op = nm.currentOperation;
                spyOn(op, "execute");
                nm.keyPress(ESC);
                expect(op.execute).not.toHaveBeenCalled();
            });

            it("returns the operation", function () {
                var op = nm.currentOperation;
                expect(nm.keyPress(ESC)).toBe(op);
            });

            it("cancels the operation", function () {
                var op = nm.currentOperation;
                nm.keyPress(ESC);
                expect(op.cancelled).toBe(true);
            });
        });

        describe("that completes the current operation", function () {
            var originalOp;

            beforeEach(function () {
                originalOp = nm.currentOperation;
                spyOn(originalOp, "keyPress").andCallFake(function () {
                    this._test_complete = true;
                });
                spyOn(originalOp, "complete").andCallFake(function () {
                    return !!this._test_complete;
                });
                spyOn(originalOp, "execute");
            });

            it("executes the current operation", function () {
                nm.keyPress('3');
                expect(originalOp.execute).toHaveBeenCalledWith(vim);
            });

            it("replaces the current operation", function () {
                expect(nm.currentOperation).toBe(originalOp);
                nm.keyPress('x');
                expect(nm.currentOperation).not.toBe(originalOp);
            });

            it("returns the operation", function () {
                expect(nm.keyPress('3')).toBe(originalOp);
            });
        });

        describe("that does not complete the current operation", function () {
            var originalOp;

            beforeEach(function () {
                originalOp = nm.currentOperation;
                spyOn(originalOp, "keyPress").andCallFake(function () {
                    this._test_complete = false;
                });
                spyOn(originalOp, "complete").andCallFake(function () {
                    return !!this._test_complete;
                });
                spyOn(originalOp, "execute");
            });

            it("does not execute the current operation", function () {
                nm.keyPress('3');
                expect(originalOp.execute).not.toHaveBeenCalled();
            });

            it("does not replace the current operation", function () {
                expect(nm.currentOperation).toBe(originalOp);
                nm.keyPress('x');
                expect(nm.currentOperation).toBe(originalOp);
            });

            it("returns the operation", function () {
                expect(nm.keyPress('r')).toBe(originalOp);
            });
        });
    });
});
