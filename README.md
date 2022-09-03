# multila-lexer

Lexical Analyzer for the Web and Node.js written in TypeScript.

> Copyright 2022 by Andreas Schwenk

> Licensed by GPLv3

> Multila Website: https://www.multila.org

> Personal Website: https://www.arts-and-sciences.com

> Mail: contact@compiler-construction.com

## Installation

```bash
npm install multila-lexer
```

## Example

The following example program implements an LL(1) top-down parser for simple language with the following grammar, specified in EBNF.
It uses `multila-lexer` to fetch tokens.

```
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

Example code, written in TypeScript:

```typescript
// import multila-lexer
import { Lexer } from 'multila-lexer/src/lex';

function parse(src: string): void {
  // create a new lexer instance
  const lexer = new Lexer();

  // configuration
  lexer.configureSingleLineComments('#');

  // must add operators with two or more chars
  lexer.setTerminals([':=']);

  // source code to be parsed
  lexer.pushSource('mySource', src);
  parseProgram(lexer);
}

//G program = { assignment };
function parseProgram(lexer: Lexer): void {
  while (lexer.isNotEND()) {
    parseAssignment(lexer);
  }
}

//G assignment = ID ":=" add ";";
function parseAssignment(lexer: Lexer): void {
  const id = lexer.ID();
  console.log(id);
  lexer.TER(':=');
  parseAdd(lexer);
  lexer.TER(';');
  console.log('assign');
}

//G add = mul { "+" mul };
function parseAdd(lexer: Lexer): void {
  parseMul(lexer);
  while (lexer.isTER('+')) {
    lexer.next();
    parseMul(lexer);
    console.log('add');
  }
}

//G mul = unary { "*" unary };
function parseMul(lexer: Lexer): void {
  parseUnary(lexer);
  while (lexer.isTER('*')) {
    lexer.next();
    parseUnary(lexer);
    console.log('mul');
  }
}

//G unary = ID | INT | "(" add ")";
function parseUnary(lexer: Lexer): void {
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

PLEASE NOTE: THIS DOCUMENTATION WILL BE UPDATED SOON!

Configuration

- `enableEmitNewlines(value: boolean)`

  Enables to emit newline (`\n`) tokens that can be tested by `lexer.isNEWLINE()` and consumed by `lexer.NEWLINE()`. Otherwise, newline characters are considered as white spaces.

- `enableEmitHex(value: boolean)`
- `enableEmitInt(value: boolean)`
- `enableEmitReal(value: boolean)`
- `enableEmitBigint(value: boolean)`
- `enableEmitDoubleQuotes(value: boolean)`
- `enableEmitIndentation(value: boolean)`
- `enableBackslashLineBreaks(value: boolean)`

## Tokens

- `ID`
- `INT`
- `REAL`
- `EOS`
- `STR`
