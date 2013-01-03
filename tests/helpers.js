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

function mockArgument(options) {
    var arg;
    options = options || {};
    arg = jasmine.createSpyObj("argument", ["keyPress", "complete", "value"]);
    arg.complete.andReturn(!!options.complete);
    arg.value.andReturn(options.value || null);
    return arg;
}

function mockCommand(options) {
    var cmd;
    options = options || {};
    cmd = jasmine.createSpyObj("command", ["buildArgument", "description",
        "execute"]);
    cmd.buildArgument.andReturn(options.argument || mockArgument());
    cmd.description.andReturn(options.description);
    return cmd;
}
