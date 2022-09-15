# multila-lexer

Lexical Analyzer for the Web and Node.js written in TypeScript.

> Copyright 2022 by Andreas Schwenk

> Licensed by GPLv3

> Multila Website: https://www.multila.org

> Personal Website: https://www.arts-and-sciences.com

> Mail: contact@compiler-construction.com

## Installation

```bash
npm install @multila/multila-lexer
```

## Example

The following example program implements an LL(1) top-down parser for simple language with the following grammar, specified in EBNF.
It uses `multila-lexer` to fetch tokens.

```EBNF
program = { assignment };
assignment = ID ":=" add ";";
add = mul { "+" mul };
mul = unary { "*" unary };
unary = ID | INT | "(" add ")";
```

A valid example program is for example:

```
# comment
x := 3 * (4+5);
```

Example code:

```javascript
// import multila-lexer
const lex = require('@multila/multila-lexer');

function parse(src) {
  // create a new lexer instance
  const lexer = new lex.Lexer();

  // configuration
  lexer.configureSingleLineComments('#');

  // must add operators with two or more chars
  lexer.setTerminals([':=']);

  // source code to be parsed
  lexer.pushSource('mySource', src);
  parseProgram(lexer);
}

//G program = { assignment };
function parseProgram(lexer) {
  while (lexer.isNotEND()) {
    parseAssignment(lexer);
  }
}

//G assignment = ID ":=" add ";";
function parseAssignment(lexer) {
  const id = lexer.ID();
  console.log(id);
  lexer.TER(':=');
  parseAdd(lexer);
  lexer.TER(';');
  console.log('assign');
}

//G add = mul { "+" mul };
function parseAdd(lexer) {
  parseMul(lexer);
  while (lexer.isTER('+')) {
    lexer.next();
    parseMul(lexer);
    console.log('add');
  }
}

//G mul = unary { "*" unary };
function parseMul(lexer) {
  parseUnary(lexer);
  while (lexer.isTER('*')) {
    lexer.next();
    parseUnary(lexer);
    console.log('mul');
  }
}

//G unary = ID | INT | "(" add ")";
function parseUnary(lexer) {
  if (lexer.isID()) {
    const id = lexer.ID();
    console.log(id);
  } else if (lexer.isINT()) {
    const value = lexer.INT();
    console.log(value);
  } else if (lexer.isTER('(')) {
    lexer.next();
    parseAdd(lexer);
    lexer.TER(')');
  } else {
    lexer.error('expected ID or INT');
  }
}

// run
const src = `# comment
x := 3 * (4+5);`;
parse(src);

// the output is:
// x 3 4 5 add mul assign
```

## Methods

> Configuration

- `enableEmitNewlines(value: boolean)`

  Enables to emit newline (`\n`) tokens that can be tested by `lexer.isNEWLINE()` and consumed by `lexer.NEWLINE()`. Otherwise, newline characters are considered as white spaces.

- `enableEmitHex(value: boolean)`

  Enables to emit hexadecimal tokens that can be tested by `lexer.isHEX()` and consumed by `lexer.HEX()`.

- `enableEmitInt(value: boolean)`

  Enables to emit integer tokens that can be tested by `lexer.isINT()` and consumed by `lexer.INT()`.

- `enableEmitReal(value: boolean)`

  Enables to emit real valued tokens that can be tested by `lexer.isREAL()` and consumed by `lexer.REAL()`.

- `enableEmitBigint(value: boolean)`

  Enables to emit big integer tokens that can be tested by `lexer.isBIGINT()` and consumed by `lexer.BIGINT()`.

- `enableEmitSingleQuotes(value: boolean)`

  Enables to emit single quote tokens that can be tested by `lexer.isSTR()` and consumed by `lexer.STR()`.

- `enableEmitDoubleQuotes(value: boolean)`

  Enables to emit double quote tokens that can be tested by `lexer.isSTR()` and consumed by `lexer.STR()`.

- `enableEmitIndentation(value: boolean)`

  Enables to emit indentation tokens that can be tested by `lexer.isINDENT()` and consumed by `lexer.INDENT()`, as well as `lexer.isOUTDENT()` and consumed by `lexer.OUTDENT()`, respectively.

- `enableBackslashLineBreaks(value: boolean)`

  If enabled, a backslash (`\`) right before a newline concatenates the next line, ignoring indentation.

> Input Files

TODO

> Parsing

TODO

> Error Handling

TODO

## Tokens

- `ID` identifier
- `INT` integer constant
- `REAL` real valued constant
- `EOS` end of statement (usually `;`)
- `STR` string constant in double quotes (`"`) or single quotes (`'`)
- `TER` terminal
- `INDENT` indentation begin
- `OUTDENT` indentation end
- `NEWLINE` newline (`\n`)
- `EOS` end of statement (`;` or `\n`)
- `END`end of input
