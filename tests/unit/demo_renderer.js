describe("DemoRenderer", function () {
    var demoRenderer, renderer;

    beforeEach(function () {
        $('#vimulator').html('');
        renderer = jasmine.createSpyObj(
            "renderer",
            ["init", "renderText", "renderCommandLine", "renderMode",
             "readTextContainer", "bindKeyListener"]
        );
        renderer.container = $('#vimulator');
        demoRenderer = new Vimulator.DemoRenderer(renderer).init('#vimulator');
    });

    describe("constructor", function () {
        it("accepts a renderer instance", function () {
            var renderer, demoRenderer;
            renderer = {};
            demoRenderer = new Vimulator.DemoRenderer(renderer);

            expect(demoRenderer.renderer).toBe(renderer);
        });

        it("creates a renderer if none is give", function () {
            var demoRenderer = new Vimulator.DemoRenderer();

            expect(demoRenderer.renderer)
                .toEqual(jasmine.any(Vimulator.Renderer));
        });
    });

    describe(".init", function () {
        it("uses an existing ol element as a command list", function () {
            var demoRenderer, commandList;
            $('#vimulator').html('<ol></ol>');

            demoRenderer = new Vimulator.DemoRenderer().init('#vimulator');

            commandList = $('#vimulator ol');
            expect(demoRenderer.commandList[0]).toBe(commandList[0]);
        });

        it("adds an ol element if there is none present", function () {
            var commandList;
            commandList = $('#vimulator ol');
            expect(commandList.length).toBe(1);
            expect(demoRenderer.commandList[0]).toBe(commandList[0]);
        });

        it("returns the demo renderer", function () {
            var demoRenderer = new Vimulator.DemoRenderer();
            expect(demoRenderer.init('#vimulator')).toBe(demoRenderer);
        });

        it("delegates to a renderer instance for everything else", function () {
            expect(renderer.init).toHaveBeenCalledWith('#vimulator');
        });
    });

    describe(".renderText", function () {
        it("delegates to a renderer instance after a delay", function () {
            withSetTimeoutStubbed(function () {
                demoRenderer.renderText(['first']);

                expect(window.setTimeout)
                    .toHaveBeenCalledWith(jasmine.any(Function), 500);
                expect(renderer.renderText).toHaveBeenCalledWith(['first']);
            });
        });
    });

    describe(".renderCommandLine", function () {
        it("delegates to a renderer instance after a delay", function () {
            withSetTimeoutStubbed(function () {
                demoRenderer.renderCommandLine('/foo', {col: 2});

                expect(window.setTimeout)
                    .toHaveBeenCalledWith(jasmine.any(Function), 500);
                expect(renderer.renderCommandLine)
                    .toHaveBeenCalledWith('/foo', {col: 2});
            });
        });
    });

    describe(".renderMode", function () {
        it("delegates to a renderer instance after a delay", function () {
            withSetTimeoutStubbed(function () {
                demoRenderer.renderMode('normal');

                expect(window.setTimeout)
                    .toHaveBeenCalledWith(jasmine.any(Function), 500);
                expect(renderer.renderMode).toHaveBeenCalledWith('normal');
            });
        });
    });

    describe(".renderOperation", function () {
        describe("completing an existing operation", function () {
            var op, demoRenderer;

            beforeEach(function () {
                op = mockOperation({
                    complete: true,
                    description: '<kbd>x</kbd> Whatever'
                });

                $('#vimulator').html('<ol><li>Old command</li></ol>');
                demoRenderer = new Vimulator.DemoRenderer().init('#vimulator');
                demoRenderer.renderOperation(op);
            });

            it("replaces the list item's HTML", function () {
                var listItem = $('#vimulator ol li');
                expect(listItem.length).toBe(1);
                expect(listItem.html()).toBe('<kbd>x</kbd> Whatever');
            });

            it("marks the list item as complete", function () {
                var listItem = $('#vimulator ol li');
                expect(listItem).toHaveClass('complete');
            });
        });

        describe("renderering a new operation", function () {
            var op, demoRenderer;

            beforeEach(function () {
                op = mockOperation({
                    description: '<kbd>x</kbd> Whatever'
                });

                $('#vimulator')
                    .html('<ol><li class="complete">Old command</li></ol>');
                demoRenderer = new Vimulator.DemoRenderer().init('#vimulator');
                demoRenderer.renderOperation(op);
            });

            it("adds a new list item", function () {
                var listItems = $('#vimulator ol li');
                expect(listItems.length).toBe(2);
                expect($(listItems[0]).html()).toBe('<kbd>x</kbd> Whatever');
                expect($(listItems[0])).not.toHaveClass('complete');
            });
        });
    });

    describe(".readTextContainer", function () {
        it("delegates to a renderer instance", function () {
            demoRenderer.readTextContainer();
            expect(renderer.readTextContainer).toHaveBeenCalledWith();
        });
    });

    describe(".bindKeyListener", function () {
        it("delegates to a renderer instance", function () {
            demoRenderer.bindKeyListener();
            expect(renderer.bindKeyListener).toHaveBeenCalledWith();
        });
    });
});
