export interface File {
  readonly name: string;
  readonly type: FileType;
}

export enum FileType {
  FILE = 'file',
  TEXT = 'text',
  WORD = 'word',
  EXCEL = 'excel',
  PDF = 'pdf'
}
