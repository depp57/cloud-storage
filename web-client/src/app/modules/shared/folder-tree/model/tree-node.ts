import { Folder } from '@models/item';

export interface TreeNode {
  folder: Folder;
  subFolders?: TreeNode[];
}
