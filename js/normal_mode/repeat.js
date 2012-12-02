(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.NormalMode.Repeat = {
        '.': new C({
            callback: function (vim, count) {
                vim.repeatLastEdit();
            },
            description: function (count) {
                var desc = "Repeat last edit";
                if (count > 1) {
                    desc += " " + count + " times";
                }
                return desc;
            }
        })
    };
}());
