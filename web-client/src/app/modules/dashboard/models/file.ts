export interface File {
  readonly name: string;
  readonly type: FileType;
}

export enum FileType {
  TEXT = 'text',
  FOLDER = 'folder',
  FILE = 'file',
  WORD = 'word',
  EXCEL = 'excel',
  PDF = 'pdf'
}
