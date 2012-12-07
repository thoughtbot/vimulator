(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.InsertMode.Commands = {};

    Vimulator.InsertMode.Commands[U.Keys.ESC] = new C({
        callback: function (vim) {
            vim.setMode("normal");
            vim.moveCursorRelative(0, -1);
        },
        description: function () {
            return "Return to normal mode";
        }
    });
}());
