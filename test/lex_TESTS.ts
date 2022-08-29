/*
PROJECT

    MULTILA Compiler and Computer Architecture Infrastructure
    Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
    Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

*/

import assert from 'assert';
import { LexerToken, LexerTokenType } from '../src/token';

import { Lexer } from './../src/lex';

// TODO: tests for addPutTrailingSemicolon

const result: any[] = [];

function run_internal(lexer: Lexer, id: string, src: string): void {
  lexer.pushSource(id, src);
  for (;;) {
    const tk = lexer.getToken();
    result.push(tk);
    //const tkStr = JSON.stringify(tk);
    //console.log(tkStr);
    //console.log(tk);
    if (tk.token === 'import') {
      const myImport = `a = 3\nb = 4\n`;
      run_internal(lexer, 'myImport.txt', myImport);
      lexer.popSource();
    }
    if (tk.type === LexerTokenType.END) break;
    lexer.next();
  }
}

export function run(): void {
  const lexer = new Lexer();
  lexer.enableEmitNewlines(true);
  lexer.enableEmitIndentation(true);
  lexer.configureSingleLineComments('#');
  lexer.configureMultiLineComments('/*', '*/');
  lexer.enableBackslashLineBreaks(false);

  lexer.setTerminals(['def', 'return', 'import', ':=']);

  const prog = `def add 123(x, y):
    return z  # comment test
    w = 20
        x = 2.456
                blub /* a multiline
                        comment */
    import
    y = "myString"
    z := bla
    w = 0x2Fa4
sub:
    reg@x reg@y reg@z
    -> [x := y - z]
    -> 2/8, x/8, y/8, z/8;
`;

  run_internal(lexer, 'prog0.txt', prog);

  const expected = [
    Object.assign(new LexerToken(), {
      token: 'def',
      type: 'TER',
      value: 0,
      valueBigint: 0n,
      fileID: 'prog0.txt',
      row: 1,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: 'add',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '123',
      type: 'INT',
      value: 123,
      fileID: 'prog0.txt',
      row: 1,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: '(',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 12,
    }),
    Object.assign(new LexerToken(), {
      token: 'x',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 13,
    }),
    Object.assign(new LexerToken(), {
      token: ',',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 14,
    }),
    Object.assign(new LexerToken(), {
      token: 'y',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 16,
    }),
    Object.assign(new LexerToken(), {
      token: ')',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 17,
    }),
    Object.assign(new LexerToken(), {
      token: ':',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 18,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 1,
      col: 19,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t+',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 2,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: 'return',
      type: 'TER',
      value: 0,
      fileID: 'prog0.txt',
      row: 2,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: 'z',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 2,
      col: 12,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 2,
      col: 29,
    }),
    Object.assign(new LexerToken(), {
      token: 'w',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 3,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 3,
      col: 7,
    }),
    Object.assign(new LexerToken(), {
      token: '20',
      type: 'INT',
      value: 20,
      fileID: 'prog0.txt',
      row: 3,
      col: 9,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 3,
      col: 11,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t+',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 4,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: 'x',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 4,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 4,
      col: 11,
    }),
    Object.assign(new LexerToken(), {
      token: '2.456',
      type: 'REAL',
      value: 2.456,
      fileID: 'prog0.txt',
      row: 4,
      col: 13,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 4,
      col: 18,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t+',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 5,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: '\t+',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 5,
      col: 13,
    }),
    Object.assign(new LexerToken(), {
      token: 'blub',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 5,
      col: 17,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 6,
      col: 35,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 7,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '\t-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 7,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '\t-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 7,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: 'import',
      type: 'TER',
      value: 0,
      fileID: 'prog0.txt',
      row: 7,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: 'a',
      type: 'ID',
      value: 0,
      fileID: 'myImport.txt',
      row: 1,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'myImport.txt',
      row: 1,
      col: 3,
    }),
    Object.assign(new LexerToken(), {
      token: '3',
      type: 'INT',
      value: 3,
      fileID: 'myImport.txt',
      row: 1,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'myImport.txt',
      row: 1,
      col: 6,
    }),
    Object.assign(new LexerToken(), {
      token: 'b',
      type: 'ID',
      value: 0,
      fileID: 'myImport.txt',
      row: 2,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'myImport.txt',
      row: 2,
      col: 3,
    }),
    Object.assign(new LexerToken(), {
      token: '4',
      type: 'INT',
      value: 4,
      fileID: 'myImport.txt',
      row: 2,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'myImport.txt',
      row: 2,
      col: 6,
    }),
    Object.assign(new LexerToken(), {
      token: '$end',
      type: 'END',
      value: 0,
      fileID: 'myImport.txt',
      row: 3,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 7,
      col: 11,
    }),
    Object.assign(new LexerToken(), {
      token: 'y',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 8,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 8,
      col: 7,
    }),
    Object.assign(new LexerToken(), {
      token: 'myString',
      type: 'STR',
      value: 0,
      fileID: 'prog0.txt',
      row: 8,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 8,
      col: 19,
    }),
    Object.assign(new LexerToken(), {
      token: 'z',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 9,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: ':=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 9,
      col: 7,
    }),
    Object.assign(new LexerToken(), {
      token: 'bla',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 9,
      col: 10,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 9,
      col: 13,
    }),
    Object.assign(new LexerToken(), {
      token: 'w',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 10,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 10,
      col: 7,
    }),
    Object.assign(new LexerToken(), {
      token: '0x2Fa4',
      type: 'HEX',
      value: 12196,
      valueBigint: 12196n,
      fileID: 'prog0.txt',
      row: 10,
      col: 9,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 10,
      col: 15,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 11,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: 'sub',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 11,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: ':',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 11,
      col: 4,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 11,
      col: 5,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t+',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: 'reg',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '@',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 8,
    }),
    Object.assign(new LexerToken(), {
      token: 'x',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: 'reg',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 11,
    }),
    Object.assign(new LexerToken(), {
      token: '@',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 14,
    }),
    Object.assign(new LexerToken(), {
      token: 'y',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 15,
    }),
    Object.assign(new LexerToken(), {
      token: 'reg',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 17,
    }),
    Object.assign(new LexerToken(), {
      token: '@',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 20,
    }),
    Object.assign(new LexerToken(), {
      token: 'z',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 21,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 12,
      col: 22,
    }),
    Object.assign(new LexerToken(), {
      token: '-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '>',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 6,
    }),
    Object.assign(new LexerToken(), {
      token: '[',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 8,
    }),
    Object.assign(new LexerToken(), {
      token: 'x',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: ':=',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 11,
    }),
    Object.assign(new LexerToken(), {
      token: 'y',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 14,
    }),
    Object.assign(new LexerToken(), {
      token: '-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 16,
    }),
    Object.assign(new LexerToken(), {
      token: 'z',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 18,
    }),
    Object.assign(new LexerToken(), {
      token: ']',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 19,
    }),
    Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 13,
      col: 20,
    }),
    Object.assign(new LexerToken(), {
      token: '-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 5,
    }),
    Object.assign(new LexerToken(), {
      token: '>',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 6,
    }),
    Object.assign(new LexerToken(), {
      token: '2',
      type: 'INT',
      value: 2,
      fileID: 'prog0.txt',
      row: 14,
      col: 8,
    }),
    Object.assign(new LexerToken(), {
      token: '/',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 9,
    }),
    Object.assign(new LexerToken(), {
      token: '8',
      type: 'INT',
      value: 8,
      fileID: 'prog0.txt',
      row: 14,
      col: 10,
    }),
    Object.assign(new LexerToken(), {
      token: ',',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 11,
    }),
    Object.assign(new LexerToken(), {
      token: 'x',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 13,
    }),
    Object.assign(new LexerToken(), {
      token: '/',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 14,
    }),
    Object.assign(new LexerToken(), {
      token: '8',
      type: 'INT',
      value: 8,
      fileID: 'prog0.txt',
      row: 14,
      col: 15,
    }),
    Object.assign(new LexerToken(), {
      token: ',',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 16,
    }),
    Object.assign(new LexerToken(), {
      token: 'y',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 18,
    }),
    Object.assign(new LexerToken(), {
      token: '/',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 19,
    }),
    Object.assign(new LexerToken(), {
      token: '8',
      type: 'INT',
      value: 8,
      fileID: 'prog0.txt',
      row: 14,
      col: 20,
    }),
    Object.assign(new LexerToken(), {
      token: ',',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 21,
    }),
    Object.assign(new LexerToken(), {
      token: 'z',
      type: 'ID',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 23,
    }),
    Object.assign(new LexerToken(), {
      token: '/',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 24,
    }),
    Object.assign(new LexerToken(), {
      token: '8',
      type: 'INT',
      value: 8,
      fileID: 'prog0.txt',
      row: 14,
      col: 25,
    }),
    Object.assign(new LexerToken(), {
      token: ';',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 26,
    }),
    /*Object.assign(new LexerToken(), {
      token: '\n',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 14,
      col: 27,
    }),*/
    Object.assign(new LexerToken(), {
      token: '\t-',
      type: 'DEL',
      value: 0,
      fileID: 'prog0.txt',
      row: 15,
      col: 1,
    }),
    Object.assign(new LexerToken(), {
      token: '$end',
      type: 'END',
      value: 0,
      fileID: 'prog0.txt',
      row: 15,
      col: 1,
    }),
  ];

  assert.ok(result.length == expected.length);
  for (let i = 0; i < result.length; i++) {
    assert.deepStrictEqual(
      //JSON.parse(JSON.stringify(result[i])),
      result[i],
      expected[i],
    );
  }
}

run();
