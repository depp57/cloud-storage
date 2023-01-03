export enum ApiFileType {
  DIR = 'dir',
  FILE = 'file'
}

export interface ApiFile {
  readonly type: ApiFileType;
  readonly path: string;
  readonly name: string;
}

export interface ResponseCreate {
  readonly created: boolean;
}


export interface RequestList {
  readonly filePath: string;
}

export interface ResponseList {
  readonly result: ApiFile[];
}


export interface RequestUpdate {
  readonly path: string;
  readonly newPath: string;
}

export interface ResponseUpdate {
  readonly changed: boolean;
}


export interface RequestDelete {
  readonly filePath: string;
}

export interface ResponseDelete {
  readonly deleted: boolean;
}
