(function () {
    Vimulator.Demo = function () {};
    Vimulator.Demo.prototype = new Vimulator.Base();
    Vimulator.Demo.prototype.delay = 500;

    Vimulator.Demo.prototype.render = function (op) {
        var vim, li;

        vim = this;
        setTimeout(function () {
            Vimulator.Base.prototype.render.call(vim, op);
        }, this.delay);

        if (op && op.description(this)) {
            li = this.commandList.find("li:first");
            if (li.length === 0 || li.hasClass("complete")) {
                li = $("<li></li>").prependTo(this.commandList);
            }

            li.html(op.description(this))
              .toggleClass("complete", op.complete() || op.cancelled);
        }
    };
}());
