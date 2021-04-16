export enum ApiFileType {
  DIR = 'dir',
  FILE = 'file'
}

export interface ApiFile {
  readonly type: ApiFileType;
  readonly filePath: string;
}

export interface ResponseList {
  readonly result: ApiFile[];
}

export interface RequestList {
  readonly filePath: string;
}

export interface ResponseUpdate {
  readonly changed: boolean;
}

export interface RequestUpdate {
  readonly filePath: string;
  readonly newFilePath: string;
}

export interface ResponseDelete {
  readonly deleted: boolean;
}

export interface RequestDelete {
  readonly filePath: string;
}
