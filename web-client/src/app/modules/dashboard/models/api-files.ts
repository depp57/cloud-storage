export enum ApiFileType {
  DIR,
  FILE
}

export interface ApiFile {
  readonly type: ApiFileType;
  readonly fullPath: string;
}

export interface ResponseList {
  readonly files: ApiFile[];
}

export interface RequestList {
  readonly fullPath: string;
}

export interface ResponseUpdate {
  readonly changed: boolean;
}

export interface RequestUpdate {
  readonly fullPath: string;
  readonly newFullPath: string;
}

export interface ResponseDelete {
  readonly deleted: boolean;
}

export interface RequestDelete {
  readonly fullPath: string;
}
