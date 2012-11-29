(function () {
    Vimulator.CommandList = function () {
        var k, sources, source, commands;

        sources = Array.prototype.slice.call(arguments);
        commands = sources.pop();

        while (sources.length > 0) {
            source = sources.pop();
            (function () {
                var constructor = function () {};
                constructor.prototype = commands;
                commands = new constructor();
                for (k in source) {
                    if (source.hasOwnProperty(k)) {
                        commands[k] = source[k];
                    }
                }
            }());
        }

        this.commands = commands;
    };

    Vimulator.CommandList.prototype.getCommand = function (key) {
        return this.commands[key];
    };
}());
