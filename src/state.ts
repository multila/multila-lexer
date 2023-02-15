/*
  MULTILA Compiler and Computer Architecture Infrastructure
  Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
  Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
*/

import { LexerToken } from './token';

export class LexerState {
  i = 0; // current character index
  n = -1; // number of characters
  row = 1;
  col = 1;
  indent = 0;
  lastIndent = 0;
  stack: LexerToken[] = []; // tokens that must be put in subsequent next()-calls

  copy(): LexerState {
    const bak = new LexerState();
    bak.i = this.i;
    bak.n = this.n;
    bak.row = this.row;
    bak.col = this.col;
    bak.indent = this.indent;
    bak.lastIndent = this.lastIndent;
    for (let i = 0; i < this.stack.length; i++)
      bak.stack.push(this.stack[i].copy());
    return bak;
  }
}
