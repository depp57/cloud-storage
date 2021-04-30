export interface InputRenameData {
  name: string;
  extension?: string;
}

export type OutputRenameData = InputRenameData | null;

export interface InputDeleteData {
  name: string;
  extension?: string;
}
