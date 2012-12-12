describe("Text objects", function () {
    describe("parentheses", function () {
        beforeEach(function () {
            reset("Text (with a parenthetical) is great");
        });

        it("can specify text within parentheses", function () {
            pressKeys("3wdib");
            expect(currentText()).toBe("Text () is great");
        });

        it("matches when the cursor is on the opening parenthesis", function () {
            pressKeys("f(dib");
            expect(currentText()).toBe("Text () is great");
        });

        it("matches when the cursor is on the closing parenthesis", function () {
            pressKeys("f)dib");
            expect(currentText()).toBe("Text () is great");
        });

        it("can specify text including the parentheses", function () {
            pressKeys("3wdab");
            expect(currentText()).toBe("Text  is great");
        });

        it("does nothing if there are no parentheses", function () {
            reset("Some text, no parentheses");
            pressKeys("dab");
            expect(currentText()).toBe("Some text, no parentheses");
        });
    });

    describe("curly braces", function () {
        beforeEach(function () {
          reset("Text {with curly braces} is great");
        });

        it("can specify text within braces", function () {
          pressKeys("3wdi}");
          expect(currentText()).toBe("Text {} is great");
        });

        it("matches when the cursor is on the opening brace", function () {
            pressKeys("f{di{");
            expect(currentText()).toBe("Text {} is great");
        });

        it("matches when the cursor is on the closing brace", function () {
            pressKeys("f}di}");
            expect(currentText()).toBe("Text {} is great");
        });

        it("can specify text including the braces", function () {
            pressKeys("3wda}");
            expect(currentText()).toBe("Text  is great");
        });

        it("does nothing if there are no braces", function () {
            reset("Some text, no braces");
            pressKeys("da}");
            expect(currentText()).toBe("Some text, no braces");
        });
    });

      describe("square brackets", function () {
          beforeEach(function () {
            reset("Text [with a square bracket] is great");
          });

          it("can specify text within brackets", function () {
            pressKeys("3wdi]");
            expect(currentText()).toBe("Text [] is great");
          });

          it("matches when the cursor is on the opening bracket", function () {
              pressKeys("f[di[");
              expect(currentText()).toBe("Text [] is great");
          });

          it("matches when the cursor is on the closing bracket", function () {
              pressKeys("f]di]");
              expect(currentText()).toBe("Text [] is great");
          });

          it("can specify text including the brackets", function () {
              pressKeys("3wda]");
              expect(currentText()).toBe("Text  is great");
          });

          it("does nothing if there are no brackets", function () {
              reset("Some text, no brackets");
              pressKeys("da]");
              expect(currentText()).toBe("Some text, no brackets");
          });
      });
});
