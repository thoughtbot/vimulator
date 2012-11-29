ESC = '\u001B';

function pressKeys(keys) {
    jQuery.each(keys.split(''), function (i, key) {
        window.vimulator.keyPress(key.charCodeAt(0));
    });
}

function pressEscape() {
    pressKeys(ESC);
}

function reset(text) {
    $('#vimulator pre').text(text);
    window.vimulator = new Vimulator.Base('#vimulator');
}

function currentText() {
    return $('#vimulator pre').text();
}

function cursorPosition() {
    var lines, row, col;

    lines = $('#vimulator pre').html().split('\n');
    for (row = 0; row < lines.length; row += 1) {
        col = lines[row].indexOf('<mark class="cursor">');
        if (col !== -1) {
            return {row: row, col: col};
        }
    }
}

function mockCommand(argumentType) {
    return {
        wantsOperation: jasmine.createSpy().andCallFake(function () {
            return argumentType === "operation";
        }),
        wantsLiteral: jasmine.createSpy().andCallFake(function () {
            return argumentType === "literal"
        }),
        execute: jasmine.createSpy()
    };
}
