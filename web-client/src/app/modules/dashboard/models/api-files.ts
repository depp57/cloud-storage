export enum ApiFileType {
  DIR,
  FILE
}

export interface ApiFile {
  readonly type: ApiFileType;
  readonly fullPath: string;
}

export interface ApiFilesResponse {
  readonly files: ApiFile[];
}
