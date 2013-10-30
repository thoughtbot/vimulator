(function () {
    Vimulator.DemoRenderer = function (renderer) {
        this.renderer = renderer || new Vimulator.Renderer();
    };

    Vimulator.DemoRenderer.prototype.init = function () {
        this.delay = 500;
        this.renderer.init.apply(this.renderer, arguments);

        this.commandList = this.renderer.container.find('ol');
        if (this.commandList.length === 0) {
            this.commandList = $('<ol/>')
                    .appendTo(this.renderer.container);
        }

        return this;
    };

    Vimulator.DemoRenderer.prototype.renderOperation = function (op, vim) {
        var li;

        if (op && op.description(vim)) {
            li = this.commandList.find('li:first');
            if (li.length === 0 || li.hasClass('complete')) {
                li = $('<li></li>').prependTo(this.commandList);
            }
            li.html(op.description(vim))
              .toggleClass('complete', op.complete() || op.cancelled);
        }
    };

    delegateMethod('readTextContainer');
    delegateMethod('bindKeyListener');

    delayedDelegateMethod('renderText');
    delayedDelegateMethod('renderCommandLine');
    delayedDelegateMethod('renderMode');

    function delegateMethod(name) {
        Vimulator.DemoRenderer.prototype[name] = function () {
            return this.renderer[name].apply(this.renderer, arguments);
        };
    }

    function delayedDelegateMethod(name) {
        Vimulator.DemoRenderer.prototype[name] = function () {
            var renderer = this.renderer,
                args = arguments;
            setTimeout(function () {
                renderer[name].apply(renderer, args);
            }, this.delay);
        };
    }
}());
