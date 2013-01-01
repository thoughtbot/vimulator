# Vimulator

Vimulator is a Vim simulator for teaching and demonstrating Vim. It has a
subset of normal mode commands, and an insert mode.

[Try it out](http://thoughtbot.github.com/vimulator/) and
[run the tests](http://thoughtbot.github.com/vimulator/test.html) online.

## Supported commands

### Motions

* <kbd>h</kbd>: Move left
* <kbd>j</kbd>: Move down
* <kbd>k</kbd>: Move up
* <kbd>l</kbd>: Move right
* <kbd>0</kbd>: Move to the start of the line (before leading whitespace)
* <kbd>^</kbd>: Move to the start of the line (after leading whitespace)
* <kbd>$</kbd>: Move to the end of the line
* <kbd>w</kbd>: Move to the next word
* <kbd>W</kbd>: Move to the next WORD
* <kbd>e</kbd>: Move to the next word ending
* <kbd>E</kbd>: Move to the next WORD ending
* <kbd>b</kbd>: Move back to the previous word
* <kbd>B</kbd>: Move back to the previous WORD
* <kbd>g</kbd><kbd>g</kbd>: Move to the first line of the file (or a specific line, if a count is given)
* <kbd>G</kbd>: Move to the last line of the file (or a specific line, if a count is given)
* <kbd>+</kbd> or <kbd>Return</kbd>: Move to the start of the next line (after leading whitespace)
* <kbd>-</kbd>: Move to the start of the previous line (after leading whitespace)

### Marks

* <kbd>m</kbd>: Create a mark
* <kbd>\`</kbd>: Move to a given mark
* <kbd>'</kbd>: Move to the line containing a given mark

### Insertion

* <kbd>a</kbd>: Append text after the cursor
* <kbd>A</kbd>: Append text at the end of the line
* <kbd>i</kbd>: Insert text before the cursor
* <kbd>I</kbd>: Insert text at the start of the line (after leading whitespace)
* <kbd>g</kbd><kbd>I</kbd>: Insert text at the start of the line (before leading whitespace)
* <kbd>o</kbd>: Open the next line
* <kbd>O</kbd>: Open the previous line
* <kbd>s</kbd>: Substitute characters under the cursor
* <kbd>S</kbd>: Substitute to the end of the line

### Operators

* <kbd>c</kbd>, <kbd>c</kbd><kbd>c</kbd> and <kbd>C</kbd>: Change text
* <kbd>d</kbd>, <kbd>d</kbd><kbd>d</kbd> and <kbd>D</kbd>: Delete text

Operators work with all of the motions listed above, and the following text
objects:

* <kbd>i</kbd> or <kbd>a</kbd> followed by <kbd>b</kbd>, <kbd>(</kbd> or
  <kbd>)</kbd>: Inside or around parenthesis
* <kbd>i</kbd> or <kbd>a</kbd> followed by <kbd>B</kbd>, <kbd>{</kbd> or
  <kbd>}</kbd>: Inside or around braces
* <kbd>i</kbd> or <kbd>a</kbd> followed by <kbd>[</kbd> or <kbd>]</kbd>: Inside
  or around square brackets

### Line search

* <kbd>f</kbd>: Find the next occurrence of a character
* <kbd>F</kbd>: Find the previous occurrence of a character
* <kbd>t</kbd>: Find the character before the next occurrence of a character
* <kbd>T</kbd>: Find the character after the previous ocurrence of a character
* <kbd>;</kbd>: Repeat the last line search
* <kbd>,</kbd>: Repeat the last line search, reversing the direction

### Document search

* <kbd>/</kbd>: Search forwards
* <kbd>n</kbd>: Go to the next match for the latest search
* <kbd>N</kbd>: Go to the previous match for the latest search

### Edits

* <kbd>r</kbd>: Replace the character under the cursor
* <kbd>x</kbd>: Delete the character under the cursor
* <kbd>X</kbd>: Delete the character before the cursor
* <kbd>.</kbd>: Repeat the last edit or operator

## License

Vimulator is licensed under the [MIT license][mit].

[mit]: http://opensource.org/licenses/MIT
