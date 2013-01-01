(function () {
    var C = Vimulator.Command;

    Vimulator.NormalMode.Search = {
        '/': new C({
            callback: function (vim) {
                vim.setMode('command', '/');
            },
            description: 'Search forwards'
        }),

        '?': new C({
            callback: function (vim) {
                //TODO
            },
            description: 'Search backwards'
        }),

        'n': new C({
            callback: function (vim, count) {
                var searchTerm = vim.registers['/'];
                if (searchTerm) {
                    vim.moveToNext(searchTerm, {
                        wrap: true,
                        loop: true,
                        count: count
                    });
                }
            },
            description: 'Repeat last search' //TODO Count in description
        }),

        'N': new C({
            callback: function (vim, count) {
                var searchTerm = vim.registers['/'];
                if (searchTerm) {
                    vim.moveToLast(searchTerm, {
                        wrap: true,
                        loop: true,
                        count: count
                    });
                }
            },
            description: 'Repeat last search backwards' //TODO Count in description
        })
    };
}());
