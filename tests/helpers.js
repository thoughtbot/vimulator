ESC = '\u001B';
RETURN = '\u000D';
BACKSPACE = '\u0008';

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
    window.vimulator = new Vimulator.Base().init('#vimulator');
}

function currentText() {
    return $('#vimulator pre').text();
}

function commandLineText() {
    var commandLine = $('#vimulator p.command-line');
    if (commandLine.html() === '&nbsp;') {
        return '';
    } else {
        return commandLine.text();
    }
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

function mockCommand(argumentType, description) {
    return {
        wantsOperation: jasmine.createSpy().andCallFake(function () {
            return argumentType === "operation";
        }),
        wantsLiteral: jasmine.createSpy().andCallFake(function () {
            return argumentType === "literal"
        }),
        description: jasmine.createSpy().andReturn(description),
        execute: jasmine.createSpy()
    };
}
