(function () {
    Vimulator.Demo = function () {};
    Vimulator.Demo.prototype = new Vimulator.Base();
    Vimulator.Demo.prototype.delay = 500;

    Vimulator.Demo.prototype.render = function (op) {
        var vim, li;

        vim = this;
        setTimeout(function () {
            Vimulator.Base.prototype.render.apply(vim);
        }, this.delay);

        if (op) {
            li = this.commandList.find("li:first");
            if (li.length === 0 || li.hasClass("complete")) {
                li = $("<li></li>").prependTo(this.commandList);
            }

            li.html(op.description())
              .toggleClass("complete", op.complete() || op.cancelled);
        }
    };
}());
