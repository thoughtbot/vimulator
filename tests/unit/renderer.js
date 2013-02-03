describe("Renderer", function () {
    beforeEach(function () {
        this.addMatchers({
            toHaveClass: function (expected) {
                return this.actual.hasClass(expected);
            }
        });

        $('#vimulator').html('');
    });

    describe(".init", function () {
        var renderer;

        it("adds a class to the container", function () {
            $('#vimulator').removeAttr('class');
            new Vimulator.Renderer().init('#vimulator');

            expect($('#vimulator')).toHaveClass('vimulator');
        });

        it("uses an existing pre element if one is present", function () {
            var preElements;
            $('#vimulator').html('<pre>Some text</pre>');
            renderer = new Vimulator.Renderer().init('#vimulator');

            preElements = $('#vimulator pre');
            expect(preElements.length).toBe(1);
            expect(renderer.textContainer[0]).toEqual(preElements[0]);
        });

        it("adds a pre element if there is none present", function () {
            var preElements;
            renderer = new Vimulator.Renderer().init('#vimulator');

            preElements = $('#vimulator pre');
            expect(preElements.length).toBe(1);
            expect(renderer.textContainer[0]).toEqual(preElements[0]);
        });

        it("adds a command line element", function () {
            var pElements;
            renderer = new Vimulator.Renderer().init('#vimulator');

            pElements = $('#vimulator p');
            expect(pElements.length).toBe(1);
            expect(renderer.commandLine[0]).toEqual(pElements[0]);
            expect(pElements).toHaveClass('command-line');
        });
    });

    describe(".renderText", function () {
        var renderer;

        beforeEach(function () {
            renderer = new Vimulator.Renderer().init('#vimulator');
        });

        it("renders the text and marks the cursor position", function () {
            renderer.renderText(
                ['First line', 'Second line'],
                {row: 0, col: 1}
            );

            expect($('#vimulator pre').html())
                .toBe('F<mark class="cursor">i</mark>rst line\nSecond line');
        });

        it("can render the text without a cursor", function () {
            renderer.renderText(['First line', 'Second line']);

            expect($('#vimulator pre').html())
                .toBe('First line\nSecond line');
        });
    });

    describe(".renderMode", function () {
        var renderer;

        beforeEach(function () {
            renderer = new Vimulator.Renderer().init('#vimulator');
        });

        it("changes the class name of the text container", function () {
            var textContainer = $('#vimulator pre');

            expect(textContainer).not.toHaveClass('insert');
            renderer.renderMode('insert');
            expect(textContainer).toHaveClass('insert');
            renderer.renderMode('normal');
            expect(textContainer).not.toHaveClass('insert');
        });
    });

    describe(".renderOperation", function () {
        it("responds to renderOperation", function () {
            var renderer = new Vimulator.Renderer().init('#vimulator');
            renderer.renderOperation({});
        });
    });

    describe(".readTextContainer", function () {
        it("responds to renderOperation", function () {
            var text, renderer;
            $('#vimulator').html('<pre>A line\nAnother line</pre>');
            renderer = new Vimulator.Renderer().init('#vimulator');

            text = renderer.readTextContainer();

            expect(text).toEqual(['A line', 'Another line']);
        });
    });

    describe(".bindKeyListener", function () {
        it("passes key code to the given callback", function () {
            var eventHandler, renderer;
            eventHandler = jasmine.createSpy('eventHandler');
            renderer = new Vimulator.Renderer().init('#vimulator');

            renderer.bindKeyListener(eventHandler);
            pressKeys('a');

            expect(eventHandler).toHaveBeenCalledWith('a'.charCodeAt(0));

            pressKeys(ESC);
            expect(eventHandler).toHaveBeenCalledWith(ESC.charCodeAt(0));
        });
    });
});
