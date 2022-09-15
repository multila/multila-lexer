/*
  MULTILA Compiler and Computer Architecture Infrastructure
  Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
  Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
*/

export enum LexerTokenType {
  DEL = 'DEL',
  TER = 'TER',
  INT = 'INT',
  BIGINT = 'BIGINT',
  REAL = 'REAL',
  HEX = 'HEX',
  STR = 'STR',
  ID = 'ID',
  END = 'END',
}

export class LexerToken {
  token = '';
  type = LexerTokenType.TER;
  value = 0; // value
  valueBigint = 0n;
  fileID = '';
  row = 0;
  col = 0;

  toString(): string {
    let tk = this.token;
    tk = tk.replace(/\n/g, '\\n');
    tk = tk.replace(/\t/g, '\\t');
    let s = this.fileID + ':' + this.row + ':' + this.col;
    s += ': "' + tk + '" (' + this.type + ')';
    return s;
  }

  copy(): LexerToken {
    const bak = new LexerToken();
    bak.token = this.token;
    bak.type = this.type;
    bak.value = this.value;
    bak.fileID = this.fileID;
    bak.row = this.row;
    bak.col = this.col;
    return bak;
  }
}
