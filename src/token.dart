/*
PROJECT

    MULTILA Compiler and Computer Architecture Infrastructure
    Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
    Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

*/

enum LexerTokenType { DEL, TER, INT, BIGINT, REAL, HEX, STR, ID, END }

class LexerToken {
  String token = '';
  LexerTokenType type = LexerTokenType.TER;
  num value = 0; // value
  BigInt valueBigint = BigInt.from(0);
  String fileID = '';
  int row = 0;
  int col = 0;

  @override
  String toString() {
    var tk = this.token;
    tk = tk.replaceAll('\n', '\\n');
    tk = tk.replaceAll('\t', '\\t');
    var s = this.fileID + ':' + this.row.toString() + ':' + this.col.toString();
    s += ': "' + tk + '" (' + this.type.name + ')';
    return s;
  }

  LexerToken copy() {
    var bak = new LexerToken();
    bak.token = this.token;
    bak.type = this.type;
    bak.value = this.value;
    bak.fileID = this.fileID;
    bak.row = this.row;
    bak.col = this.col;
    return bak;
  }
}
