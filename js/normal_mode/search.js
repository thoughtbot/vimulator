(function () {
    var C = Vimulator.Command;

    Vimulator.NormalMode.Search = {
        '/': new C({
            callback: function (vim, count) {
                vim.setMode('command', '/', function (searchTerm) {
                    vim.search.forward(searchTerm, count);
                });
            },
            description: 'Search forwards'
        }),

        '?': new C({
            callback: function (vim, count) {
                vim.setMode('command', '?', function (searchTerm) {
                    vim.search.backward(searchTerm, count);
                });
            },
            description: 'Search backwards'
        }),

        'n': new C({
            callback: function (vim, count) {
                vim.search.repeat(count);
            },
            description: 'Repeat last search' //TODO Count in description
        }),

        'N': new C({
            callback: function (vim, count) {
                vim.search.repeatReversed(count);
            },
            description: 'Repeat last search backwards' //TODO Count in description
        })
    };
}());
