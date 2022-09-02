/*
  PROJECT

    MULTILA Compiler and Computer Architecture Infrastructure
    Copyright (c) 2022 by Andreas Schwenk, contact@multila.org
    Licensed by GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007

  SYNOPSIS

    TODO

*/

export enum Language {
  'EN',
  'DE',
}

export enum LanguageText {
  'EXPECTED',
  'EXPECTED_ONE_OF',
  'CONDITION_NOT_BOOLEAN',
  'UNKNOWN_SYMBOL',
  'SYMBOL_IS_NOT_A_FUNCTION',
  'BIN_OP_INCOMPATIBLE_TYPES',
}

export function setLanguage(l: Language): void {
  lang = l;
}

export function getStr(str: LanguageText): string {
  const s = langStr[str + '_' + lang];
  return s;
}

let lang = Language.EN;

const langStr: { [id: string]: string } = {};

function add_EN(t: LanguageText, s: string): void {
  langStr[t + '_' + Language.EN] = s;
}

function add_DE(t: LanguageText, s: string): void {
  langStr[t + '_' + Language.DE] = s;
}

add_EN(LanguageText.EXPECTED, 'expected');
add_DE(LanguageText.EXPECTED, 'erwarte');
add_EN(LanguageText.EXPECTED_ONE_OF, 'expected one of');
add_DE(LanguageText.EXPECTED_ONE_OF, 'erwarte Token aus Liste');
add_EN(LanguageText.CONDITION_NOT_BOOLEAN, 'condition must be boolean');
add_DE(LanguageText.CONDITION_NOT_BOOLEAN, 'Bedingung muss Boolsch sein');
add_EN(LanguageText.UNKNOWN_SYMBOL, 'unknown symbol');
add_DE(LanguageText.UNKNOWN_SYMBOL, 'unbekanntes Symbol');
add_EN(LanguageText.SYMBOL_IS_NOT_A_FUNCTION, 'symbol is not a function');
add_DE(LanguageText.SYMBOL_IS_NOT_A_FUNCTION, 'Symbol ist keine Funktion');
add_EN(
  LanguageText.BIN_OP_INCOMPATIBLE_TYPES,
  'Operator $OP is incompatible for types $T1 and $T2',
);
add_DE(
  LanguageText.BIN_OP_INCOMPATIBLE_TYPES,
  'Operator $OP ist inkompatibel mit den Typen $T1 und $T2',
);
