(function () {
    var C = Vimulator.Command,
        U = Vimulator.Utils;

    Vimulator.NormalMode.Search = {
        '/': new C({
            callback: function (vim, count) {
                vim.setMode('command', '/', function (searchTerm) {
                    vim.search.forward(searchTerm, count);
                });
            },
            description: function (count) {
                return "Search forwards for the " + U.ordinalize(count) +
                       " match";
            }
        }),

        '?': new C({
            callback: function (vim, count) {
                vim.setMode('command', '?', function (searchTerm) {
                    vim.search.backward(searchTerm, count);
                });
            },
            description: function (count) {
                return "Search backwards for the " + U.ordinalize(count) +
                       " match";
            }
        }),

        'n': new C({
            callback: function (vim, count) {
                vim.search.repeat(count);
            },
            description: function (count) {
                return "Move forward " + U.pluralize(count, "match", "matches")
                       + " for the previous search";
            }
        }),

        'N': new C({
            callback: function (vim, count) {
                vim.search.repeatReversed(count);
            },
            description: function (count) {
                return "Move back " + U.pluralize(count, "match", "matches") +
                       " for the previous search";
            }
        })
    };
}());
