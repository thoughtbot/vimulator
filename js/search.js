(function () {
    var reverseOp, performSearch;

    reverseOp = {
        'moveToNext': 'moveToLast',
        'moveToLast': 'moveToNext'
    };

    performSearch = function (term, count, op) {
        term = term || this.vim.registers.get('/');
        count = count || 1;

        if (op && term) {
            this.vim[op](term, {wrap: true, loop: true, count: count});
            this.vim.registers.set(term, '/');
            this.lastOp = op;
        }
    };

    Vimulator.Search = function (vim) {
        this.vim = vim;
    };

    Vimulator.Search.prototype.forward = function (term, count) {
        performSearch.call(this, term, count, 'moveToNext');
    };

    Vimulator.Search.prototype.backward = function (term, count) {
        performSearch.call(this, term, count, 'moveToLast');
    };

    Vimulator.Search.prototype.repeat = function (count) {
        performSearch.call(this, null, count, this.lastOp);
    };

    Vimulator.Search.prototype.repeatReversed = function (count) {
        performSearch.call(this, null, count, reverseOp[this.lastOp]);
    };
}());
