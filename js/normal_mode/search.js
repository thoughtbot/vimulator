(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils,
        CR = Vimulator.CharacterRange;

    Vimulator.NormalMode.Search = {
        '/': new C({
            argument: Vimulator.CommandLineArgument,
            callback: CR.captureExclusive(function (vim, count, searchTerm) {
                vim.search.forward(searchTerm, count);
            }),
            description: function (count, searchTerm) {
                return "Search forwards for the " + U.ordinalize(count) +
                       " match for " + (searchTerm || "&hellip;");
            }
        }),

        '?': new C({
            argument: Vimulator.CommandLineArgument,
            callback: CR.captureExclusive(function (vim, count, searchTerm) {
                vim.search.backward(searchTerm, count);
            }),
            description: function (count, searchTerm) {
                return "Search backwards for the " + U.ordinalize(count) +
                       " match for " + (searchTerm || "&hellip;");
            }
        }),

        'n': new C({
            callback: CR.captureExclusive(function (vim, count) {
                vim.search.repeat(count);
            }),
            description: function (count) {
                return "Move forward " + U.pluralize(count, "match", "matches")
                       + " for the previous search";
            }
        }),

        'N': new C({
            callback: CR.captureExclusive(function (vim, count) {
                vim.search.repeatReversed(count);
            }),
            description: function (count) {
                return "Move back " + U.pluralize(count, "match", "matches") +
                       " for the previous search";
            }
        })
    };
}());
