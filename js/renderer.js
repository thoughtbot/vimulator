(function () {
    Vimulator.Renderer = function () {
    };

    Vimulator.Renderer.prototype.init = function (container) {
        this.container = $(container);
        this.textContainer = findOrBuild(this.container, 'pre');
        this.commandLine = findOrBuild(this.container, 'p');

        this.container.addClass('vimulator');
        this.commandLine.addClass('command-line');

        return this;
    };

    Vimulator.Renderer.prototype.bindKeyListener = function (handler) {
        var input = $('<input type="text">').appendTo(this.container)
                                            .focus()
                                            .blur(function () {
                                                $(this).focus();
                                            });

        // Use keyup for special characters like escape
        $(window).keyup(function (e) {
            var code = e.charCode || e.keyCode;
            if (specialKeyCode(code)) {
                handler(code);
                return false;
            }
        });

        // Use keypress for general characters
        $(window).keypress(function (e) {
            var code = e.charCode || e.keyCode;
            if (code >= 32) {
                handler(code);
                return false;
            }
        });
    };

    Vimulator.Renderer.prototype.renderMode = function (modeName) {
        this.textContainer.attr('class', modeName);
    };

    Vimulator.Renderer.prototype.renderText = function (lines, cursor) {
        var renderedLines = jQuery.map(lines, function (line, i) {
            if (cursor && i == cursor.row) {
                return markWithCursor(line, cursor.col);
            } else {
                return line;
            }
        });
        this.textContainer.html(renderedLines.join('\n'));
    };

    Vimulator.Renderer.prototype.renderCommandLine = function (text, cursor) {
        var renderedText;
        if (cursor) {
            renderedText = markWithCursor(text, cursor.col);
        } else {
            renderedText = text;
        }
        this.commandLine.html(renderedText || '&nbsp;');
    };

    Vimulator.Renderer.prototype.renderOperation = function (operation, vim) {
    };

    Vimulator.Renderer.prototype.readTextContainer = function () {
        return this.textContainer.text().split('\n');
    };

    function findOrBuild(container, tagName) {
        var element = container.find(tagName);
        if (element.length === 0) {
            element = $('<' + tagName + '/>').appendTo(container);
        }
        return element;
    }

    function markWithCursor(line, column) {
        var chr = line.substr(column, 1) || ' ';
        return line.substr(0, column) +
               '<mark class="cursor">' + chr + '</mark>' +
               line.substr(column + 1);
    }

    function specialKeyCode(code) {
        return (
            code === Vimulator.Utils.Keys.BACKSPACE.charCodeAt(0) ||
            code === Vimulator.Utils.Keys.ESC.charCodeAt(0) ||
            code === Vimulator.Utils.Keys.RETURN.charCodeAt(0)
        );
    }
}());
