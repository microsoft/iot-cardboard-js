export type ModelingException = ParsingException | ResolutionException;

export interface ParsingException {
  ExceptionKind: 'Parsing';
  Errors: ParsingError[];
}

export interface ParsingError {
  PrimaryID?: string;
  SecondaryID?: string;
  Property?: string;
  AuxProperty?: string;
  Type?: string;
  Value?: string;
  Restriction?: string;
  Transformation?: string;
  Violations?: string[];
  Cause: string;
  Action: string;
  ValidationID: string;
}

export interface ResolutionException {
  ExceptionKind: 'Resolution';
  UndefinedIdentifiers: string[];
}
