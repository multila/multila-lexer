/*
  MULTILA Compiler and Computer Architecture Infrastructure
  Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
  Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
*/

import { getStr, LanguageText } from './lang';
import { LexerState } from './state';
import { LexerToken, LexerTokenType } from './token';

export class LexerFile {
  stateBackup: LexerState = null;
  tokenBackup: LexerToken = null;
  id = '';
  sourceCode = '';
}

export interface LexerBackup {
  state: LexerState;
  token: LexerToken;
}

export class ParseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ParseError';
  }
}

export class Lexer {
  private terminals = new Set<string>();

  private fileStack: LexerFile[] = [];
  private token: LexerToken = null;
  private lastToken: LexerToken = null;
  private state: LexerState = null;

  private singleLineCommentStart = '//';
  private multiLineCommentStart = '/*';
  private multilineCommentEnd = '*/';
  private emitNewline = false;
  private emitHex = true;
  private emitInt = true;
  private emitReal = true;
  private emitBigint = true;
  private emitSingleQuotes = true;
  private emitDoubleQuotes = true;
  private emitIndentation = false;
  private lexerFilePositionPrefix = '!>';
  private allowBackslashLineBreaks = false;

  private allowUmlautInID = false;
  private allowHyphenInID = false;

  private putTrailingSemicolon: LexerToken[] = [];
  private multicharDelimiters: string[] = [];

  public configureSingleLineComments(pattern = '//'): void {
    this.singleLineCommentStart = pattern;
  }

  public configureMultiLineComments(
    startPattern = '/*',
    endPattern = '*/',
  ): void {
    this.multiLineCommentStart = startPattern;
    this.multilineCommentEnd = endPattern;
  }

  public configureLexerFilePositionPrefix(pattern = '!>'): void {
    this.lexerFilePositionPrefix = pattern;
  }

  public enableEmitNewlines(value: boolean): void {
    this.emitNewline = value;
  }

  public enableEmitHex(value: boolean): void {
    this.emitHex = value;
  }

  public enableEmitInt(value: boolean): void {
    this.emitInt = value;
  }

  public enableEmitReal(value: boolean): void {
    this.emitReal = value;
  }

  public enableEmitBigint(value: boolean): void {
    this.emitBigint = value;
  }

  public enableEmitSingleQuotes(value: boolean): void {
    this.emitSingleQuotes = value;
  }

  public enableEmitDoubleQuotes(value: boolean): void {
    this.emitDoubleQuotes = value;
  }

  public enableEmitIndentation(value: boolean): void {
    this.emitIndentation = value;
  }

  public enableBackslashLineBreaks(value: boolean): void {
    this.allowBackslashLineBreaks = value;
  }

  public enableUmlautInID(value: boolean): void {
    this.allowUmlautInID = value;
  }

  public enableHyphenInID(value: boolean): void {
    this.allowHyphenInID = value;
  }

  constructor() {
    //
  }

  public isEND(): boolean {
    return this.token.type === LexerTokenType.END;
  }

  public isNotEND(): boolean {
    return this.token.type !== LexerTokenType.END;
  }

  public END(): void {
    if (this.token.type === LexerTokenType.END) {
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' END',
      );
  }

  public isID(): boolean {
    return this.token.type === LexerTokenType.ID;
  }

  public ID(): string {
    let res = '';
    if (this.token.type === LexerTokenType.ID) {
      res = this.token.token;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' ID',
      );
    return res;
  }

  /**
   * lower case
   * @returns
   */
  public isLID(): boolean {
    return (
      this.token.type === LexerTokenType.ID &&
      this.token.token === this.token.token.toLowerCase()
    );
  }

  /**
   * lower case
   * @returns
   */
  public LID(): string {
    let res = '';
    if (
      this.token.type === LexerTokenType.ID &&
      this.token.token === this.token.token.toLowerCase()
    ) {
      res = this.token.token;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' LowerCaseID',
      );
    return res;
  }

  /**
   * upper case
   * @returns
   */
  public isUID(): boolean {
    return (
      this.token.type === LexerTokenType.ID &&
      this.token.token === this.token.token.toUpperCase()
    );
  }

  /**
   * upper case
   * @returns
   */
  public UID(): string {
    let res = '';
    if (
      this.token.type === LexerTokenType.ID &&
      this.token.token === this.token.token.toUpperCase()
    ) {
      res = this.token.token;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' UpperCaseID',
      );
    return res;
  }

  public isINT(): boolean {
    return this.token.type === LexerTokenType.INT;
  }

  public INT(): number {
    let res = 0;
    if (this.token.type === LexerTokenType.INT) {
      res = this.token.value;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' INT',
      );
    return res;
  }

  public isBIGINT(): boolean {
    return this.token.type === LexerTokenType.BIGINT;
  }

  public BIGINT(): bigint {
    let res = 0n;
    if (this.token.type === LexerTokenType.BIGINT) {
      res = this.token.valueBigint;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' BIGINT',
      );
    return res;
  }

  public isREAL(): boolean {
    return this.token.type === LexerTokenType.REAL;
  }

  public REAL(): number {
    let res = 0.0;
    if (this.token.type === LexerTokenType.REAL) {
      res = this.token.value;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' REAL',
      );
    return res;
  }

  public isHEX(): boolean {
    return this.token.type === LexerTokenType.HEX;
  }

  public HEX(): string {
    let res = '';
    if (this.token.type === LexerTokenType.HEX) {
      res = this.token.token;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' HEX',
      );
    return res;
  }

  public isSTR(): boolean {
    return this.token.type === LexerTokenType.STR;
  }

  public STR(): string {
    let res = '';
    if (this.token.type === LexerTokenType.STR) {
      res = this.token.token;
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' STR',
      );
    return res;
  }

  public isTER(t: string): boolean {
    return (
      (this.token.type === LexerTokenType.DEL && this.token.token === t) ||
      (this.token.type === LexerTokenType.ID && this.token.token === t)
    );
  }

  public isNotTER(t: string): boolean {
    return this.isTER(t) == false && this.token.type != LexerTokenType.END;
  }

  public TER(t: string): void {
    if (
      (this.token.type === LexerTokenType.DEL && this.token.token === t) ||
      (this.token.type === LexerTokenType.ID && this.token.token === t)
    ) {
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' "' + t + '"',
      );
  }

  // end of statement
  public isEOS(): boolean {
    // TODO: ';' OR newline
    // TODO: configure ';'
    return this.token.token === ';';
  }

  // end of statement
  public EOS(): void {
    // TODO: ';' OR newline
    if (this.token.token === ';') this.next();
    else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' ";"',
      );
  }

  public isINDENT(): boolean {
    return this.token.type == LexerTokenType.DEL && this.token.token === '\t+';
  }

  public isNotINDENT(): boolean {
    return !(
      this.token.type === LexerTokenType.DEL && this.token.token === '\t+'
    );
  }

  public INDENT(): void {
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\t+') {
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' INDENT',
      );
  }

  public isOUTDENT(): boolean {
    return this.token.type == LexerTokenType.DEL && this.token.token === '\t-';
  }

  public isNotOUTDENT(): boolean {
    if (this.token.type === LexerTokenType.END) return false; // TODO: must do this for ALL "not" methods
    return !(
      this.token.type === LexerTokenType.DEL && this.token.token === '\t-'
    );
  }

  public OUTDENT(): void {
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\t-') {
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' OUTDENT',
      );
  }

  public isNEWLINE(): boolean {
    return (
      this.isOUTDENT() ||
      (this.token.type == LexerTokenType.DEL && this.token.token === '\n')
    );
  }

  public isNotNEWLINE(): boolean {
    return (
      !this.isOUTDENT() &&
      !(this.token.type === LexerTokenType.DEL && this.token.token === '\n')
    );
  }

  public NEWLINE(): void {
    if (this.isOUTDENT()) return;
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\n') {
      this.next();
    } else
      throw new ParseError(
        this.err_pos() + getStr(LanguageText.EXPECTED) + ' NEWLINE',
      );
  }

  public error(s: string, tk: LexerToken = null): void {
    throw new ParseError(this.err_pos(tk) + s);
  }

  public errorExpected(terminals: string[]): void {
    let s = getStr(LanguageText.EXPECTED_ONE_OF) + ' ';
    for (let i = 0; i < terminals.length; i++) {
      if (i > 0) s += ', ';
      s += terminals[i];
    }
    s += '.';
    this.error(s);
  }

  errorConditionNotBoolean(): void {
    this.error(getStr(LanguageText.CONDITION_NOT_BOOLEAN));
  }

  errorUnknownSymbol(symId: string): void {
    this.error(getStr(LanguageText.UNKNOWN_SYMBOL) + ' ' + symId);
  }

  errorNotAFunction(): void {
    this.error(getStr(LanguageText.SYMBOL_IS_NOT_A_FUNCTION));
  }

  errorTypesInBinaryOperation(op: string, t1: string, t2: string): void {
    this.error(
      getStr(LanguageText.BIN_OP_INCOMPATIBLE_TYPES)
        .replace('$OP', op)
        .replace('$T1', t1)
        .replace('$T2', t2),
    );
  }

  private err_pos(tk: LexerToken = null): string {
    if (tk == null) tk = this.token;
    return tk.fileID + ':' + tk.row + ':' + tk.col + ': ';
  }

  public addPutTrailingSemicolon(type: LexerTokenType, terminal = ''): void {
    const tk = new LexerToken();
    tk.type = type;
    tk.token = terminal;
    this.putTrailingSemicolon.push(tk);
  }

  /**
   * Sets a set of terminals consisting of identifiers and delimiters.
   * @param terminals
   */
  public setTerminals(terminals: string[]): void {
    this.terminals.clear();
    this.multicharDelimiters = [];
    for (const ter of terminals) {
      if (ter.length == 0) continue;
      if (
        (ter[0] >= 'A' && ter[0] <= 'Z') ||
        (ter[0] >= 'a' && ter[0] <= 'z') ||
        ter[0] == '_'
      )
        this.terminals.add(ter);
      else this.multicharDelimiters.push(ter);
    }
    // must sort delimiters by ascending length (e.g. "==" must NOT be tokenized to "=", "=")
    this.multicharDelimiters.sort(function (a, b) {
      return b.length - a.length;
    });
  }

  public getTerminals(): string[] {
    return Array.from(this.terminals);
  }

  public getMulticharDelimiters(): string[] {
    return this.multicharDelimiters;
  }

  public getToken(): LexerToken {
    return this.token;
  }

  public next(): void {
    this.lastToken = this.token;
    const src = this.fileStack.slice(-1)[0].sourceCode;
    const file_id = this.fileStack.slice(-1)[0].id;
    let s = this.state;
    if (s.stack.length > 0) {
      this.token = s.stack[0];
      s.stack.shift(); // remove first element
      return;
    }
    this.token = new LexerToken();
    this.token.fileID = file_id;
    // white spaces and comments
    s.indent = -1; // indents are disallowed, until a newline-character is read
    let outputLinefeed = false; // token == "\n"?
    for (;;) {
      // newline
      if (s.i < s.n && src[s.i] === '\n') {
        s.indent = 0;
        outputLinefeed = this.nextTokenLinefeed(s);
      }
      // space
      else if (s.i < s.n && src[s.i] === ' ') {
        s.i++;
        s.col++;
        if (s.indent >= 0) s.indent++;
      }
      // tab
      else if (s.i < s.n && src[s.i] === '\t') {
        s.i++;
        s.col += 4;
        if (s.indent >= 0) s.indent += 4;
      }
      // backslash line break -> consume all following whitespace
      else if (
        this.allowBackslashLineBreaks &&
        s.i < s.n &&
        src[s.i] === '\\'
      ) {
        s.i++;
        while (s.i < s.n) {
          if (src[s.i] == ' ') s.col++;
          else if (src[s.i] == '\t') s.col += 4;
          else if (src[s.i] == '\n') {
            s.row++;
            s.col = 1;
          } else break;
          s.i++;
        }
      }
      // single line comment (slc)
      else if (
        this.singleLineCommentStart.length > 0 &&
        this.isNext(this.singleLineCommentStart)
      ) {
        if (this.emitIndentation && s.indent >= 0) break;
        const n = this.singleLineCommentStart.length;
        s.i += n;
        s.col += n;
        while (s.i < s.n && src[s.i] != '\n') {
          s.i++;
          s.col++;
        }
        if (s.i < s.n && src[s.i] === '\n') {
          //if (this.nextTokenLinefeed(s)) return;
          outputLinefeed = this.nextTokenLinefeed(s);
        }
        s.indent = 0;
      }
      // multi line comment (mlc)
      else if (
        this.multiLineCommentStart.length > 0 &&
        this.isNext(this.multiLineCommentStart)
      ) {
        if (this.emitIndentation && s.indent >= 0) break;
        let n = this.multiLineCommentStart.length;
        s.i += n;
        s.col += n;
        while (s.i < s.n && !this.isNext(this.multilineCommentEnd)) {
          if (src[s.i] === '\n') {
            // TODO: this.nextTokenLinefeed(s)!!
            s.row++;
            s.col = 1;
            s.indent = 0;
          } else s.col++;
          s.i++;
        }
        n = this.multilineCommentEnd.length;
        s.i += n;
        s.col += n;
      }
      // FILEPOS = PREFIX ":" STR ":" INT ":" "INT";
      else if (
        this.lexerFilePositionPrefix.length > 0 &&
        src.substring(s.i).startsWith(this.lexerFilePositionPrefix)
      ) {
        s.i += this.lexerFilePositionPrefix.length;
        // path
        let path = '';
        while (s.i < s.n && src[s.i] !== ':') {
          path += src[s.i];
          s.i++;
        }
        s.i++;
        this.fileStack.slice(-1)[0].id = path;
        this.token.fileID = path;
        // row
        let rowStr = '';
        while (s.i < s.n && src[s.i] !== ':') {
          rowStr += src[s.i];
          s.i++;
        }
        s.i++;
        this.token.row = parseInt(rowStr);
        // column
        let colStr = '';
        while (s.i < s.n && src[s.i] !== ':') {
          colStr += src[s.i];
          s.i++;
        }
        s.i++;
        this.token.col = parseInt(colStr);
      } else break;
    }
    // indentation
    if (this.emitIndentation && s.indent >= 0) {
      const diff = s.indent - s.lastIndent;
      s.lastIndent = s.indent;
      if (diff != 0) {
        if (diff % 4 == 0) {
          const is_plus = diff > 0;
          const n = Math.floor(Math.abs(diff) / 4);
          for (let k = 0; k < n; k++) {
            this.token = new LexerToken();
            this.token.fileID = file_id;
            this.token.row = s.row;
            if (is_plus) this.token.col = s.col - diff + 4 * k;
            else this.token.col = s.col;
            this.token.type = LexerTokenType.DEL;
            this.token.token = is_plus ? '\t+' : '\t-';
            s.stack.push(this.token);
          }
          this.token = s.stack[0];
          s.stack.shift(); // remove first
          return;
        } else {
          this.token.row = s.row;
          this.token.col = s.col - diff;
          this.token.type = LexerTokenType.TER;
          this.token.token = '\terr';
          return;
        }
      }
    }
    // in case that this.parseNewLineEnabled == true, we must stop here
    // if "\n" was actually read
    if (outputLinefeed) return;
    // backup current state
    const s_bak = s.copy();
    this.token.row = s.row;
    this.token.col = s.col;
    s.indent = 0;
    // end?
    if (s.i >= s.n) {
      this.token.token = '$end';
      this.token.type = LexerTokenType.END;
      return;
    }
    // ID = ( "A".."Z" | "a".."z" | "_" | hyphen&&"-" | umlaut&&("ä".."ß") )
    //   { "A".."Z" | "a".."z" | "0".."9" | "_" | hyphen&&"-" | umlaut&&("ä".."ß") };
    this.token.type = LexerTokenType.ID;
    this.token.token = '';
    if (
      s.i < s.n &&
      ((src[s.i] >= 'A' && src[s.i] <= 'Z') ||
        (src[s.i] >= 'a' && src[s.i] <= 'z') ||
        src[s.i] === '_' ||
        (this.allowHyphenInID && src[s.i] == '-') ||
        (this.allowUmlautInID && 'ÄÖÜäöüß'.includes(src[s.i])))
    ) {
      this.token.token += src[s.i];
      s.i++;
      s.col++;
      while (
        s.i < s.n &&
        ((src[s.i] >= 'A' && src[s.i] <= 'Z') ||
          (src[s.i] >= 'a' && src[s.i] <= 'z') ||
          (src[s.i] >= '0' && src[s.i] <= '9') ||
          src[s.i] === '_' ||
          (this.allowHyphenInID && src[s.i] == '-') ||
          (this.allowUmlautInID && 'ÄÖÜäöüß'.includes(src[s.i])))
      ) {
        this.token.token += src[s.i];
        s.i++;
        s.col++;
      }
    }
    if (this.token.token.length > 0) {
      if (this.terminals.has(this.token.token))
        this.token.type = LexerTokenType.TER;
      this.state = s;
      return;
    }
    // STR = '"' { any except '"' and '\n' } '"'
    s = s_bak.copy();
    if (this.emitDoubleQuotes) {
      this.token.type = LexerTokenType.STR;
      if (s.i < s.n && src[s.i] === '"') {
        this.token.token = '';
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] != '"' && src[s.i] != '\n') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
        if (s.i < s.n && src[s.i] === '"') {
          s.i++;
          s.col++;
          this.state = s;
          return;
        }
      }
    }
    // STR = '\'' { any except '\'' and '\n' } '\''
    s = s_bak.copy();
    if (this.emitSingleQuotes) {
      this.token.type = LexerTokenType.STR;
      if (s.i < s.n && src[s.i] === "'") {
        this.token.token = '';
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] != "'" && src[s.i] != '\n') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
        if (s.i < s.n && src[s.i] === "'") {
          s.i++;
          s.col++;
          this.state = s;
          return;
        }
      }
    }
    // HEX = "0" "x" { "0".."9" | "A".."F" | "a".."f" }+;
    s = s_bak.copy();
    if (this.emitHex) {
      this.token.type = LexerTokenType.HEX;
      this.token.token = '';
      if (s.i < s.n && src[s.i] === '0') {
        s.i++;
        s.col++;
        if (s.i < s.n && src[s.i] === 'x') {
          s.i++;
          s.col++;
          let k = 0;
          while (
            s.i < s.n &&
            ((src[s.i] >= '0' && src[s.i] <= '9') ||
              (src[s.i] >= 'A' && src[s.i] <= 'F') ||
              (src[s.i] >= 'a' && src[s.i] <= 'f'))
          ) {
            this.token.token += src[s.i];
            s.i++;
            s.col++;
            k++;
          }
          if (k > 0) {
            this.token.token = '0x' + this.token.token;
            this.token.value = parseInt(this.token.token, 16);
            this.token.valueBigint = BigInt(this.token.token);
            this.state = s;
            return;
          }
        }
      }
    }
    // INT|BIGINT|REAL = "0" | "1".."9" { "0".."9" } [ "." { "0".."9" } ];
    s = s_bak.copy();
    if (this.emitInt) {
      this.token.type = LexerTokenType.INT;
      this.token.token = '';
      if (s.i < s.n && src[s.i] === '0') {
        this.token.token = '0';
        s.i++;
        s.col++;
      } else if (s.i < s.n && src[s.i] >= '1' && src[s.i] <= '9') {
        this.token.token = src[s.i];
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] >= '0' && src[s.i] <= '9') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
      }
      if (
        this.token.token.length > 0 &&
        this.emitBigint &&
        s.i < s.n &&
        src[s.i] === 'n'
      ) {
        s.i++;
        s.col++;
        this.token.type = LexerTokenType.BIGINT;
      } else if (
        this.token.token.length > 0 &&
        this.emitReal &&
        s.i < s.n &&
        src[s.i] === '.'
      ) {
        this.token.type = LexerTokenType.REAL;
        this.token.token += '.';
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] >= '0' && src[s.i] <= '9') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
      }
      if (this.token.token.length > 0) {
        if (this.token.type === LexerTokenType.INT)
          this.token.value = parseInt(this.token.token);
        else if (this.token.type === LexerTokenType.BIGINT)
          this.token.valueBigint = BigInt(this.token.token);
        else this.token.value = parseFloat(this.token.token);
        this.state = s;
        return;
      }
    }
    // DEL = /* element of this.multichar_delimiters */;
    this.token.type = LexerTokenType.DEL;
    this.token.token = '';
    for (let k = 0; k < this.multicharDelimiters.length; k++) {
      const d = this.multicharDelimiters[k];
      let match = true;
      s = s_bak.copy();
      for (let l = 0; l < d.length; l++) {
        const ch = d[l];
        if (s.i < s.n && src[s.i] === ch) {
          s.i++;
          s.col++;
        } else {
          match = false;
          break;
        }
      }
      if (match) {
        this.state = s;
        this.token.token = d;
        return;
      }
    }
    // unexpected
    s = s_bak.copy();
    this.token.type = LexerTokenType.DEL;
    this.token.token = '';
    if (s.i < s.n) {
      this.token.token = src[s.i];
      s.i++;
      s.col++;
      this.state = s;
    }
  }

  private nextTokenLinefeed(s: LexerState): boolean {
    let insertedSemicolon = false;
    if (this.emitNewline) {
      this.token.row = s.row;
      this.token.col = s.col;
      this.token.token = '\n';
      this.token.type = LexerTokenType.DEL;
    } else if (this.putTrailingSemicolon.length > 0) {
      let match = false;
      for (const pts of this.putTrailingSemicolon) {
        if (pts.type === this.lastToken.type) {
          if (pts.type === LexerTokenType.DEL)
            match = pts.token === this.lastToken.token;
          else match = true;
          if (match) break;
        }
      }
      if (match) {
        insertedSemicolon = true;
        this.token.row = s.row;
        this.token.col = s.col;
        this.token.token = ';';
        this.token.type = LexerTokenType.DEL;
      }
    }
    s.row++;
    s.col = 1;
    s.indent = 0;
    s.i++;
    return this.emitNewline || insertedSemicolon;
  }

  private isNext(str: string): boolean {
    const src = this.fileStack.slice(-1)[0].sourceCode;
    const s = this.state;
    const n = str.length;
    if (s.i + n >= s.n) return false;
    for (let k = 0; k < n; k++) {
      const ch = str[k];
      if (src[s.i + k] != ch) return false;
    }
    return true;
  }

  public pushSource(id: string, src: string, initialRowIdx = 1): void {
    if (this.fileStack.length > 0) {
      this.fileStack.slice(-1)[0].stateBackup = this.state.copy();
      this.fileStack.slice(-1)[0].tokenBackup = this.token.copy();
    }
    const f = new LexerFile();
    f.id = id;
    f.sourceCode = src;
    this.fileStack.push(f);
    this.state = new LexerState();
    this.state.row = initialRowIdx;
    this.state.n = src.length;
    this.next();
  }

  public popSource(): void {
    this.fileStack.pop();
    if (this.fileStack.length > 0) {
      this.state = this.fileStack.slice(-1)[0].stateBackup;
      this.token = this.fileStack.slice(-1)[0].tokenBackup;
    }
  }

  public backupState(): LexerBackup {
    return {
      state: this.state.copy(),
      token: this.token.copy(),
    };
  }

  public replayState(backup: LexerBackup): void {
    this.state = backup.state;
    this.token = backup.token;
  }
}
