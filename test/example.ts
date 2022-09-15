/*
  MULTILA Compiler and Computer Architecture Infrastructure
  Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
  Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
*/

// import multila-lexer
import { Lexer } from '../src/lex';

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
