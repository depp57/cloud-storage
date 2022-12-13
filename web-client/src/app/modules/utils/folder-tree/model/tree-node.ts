import { Item, Folder } from '@modules/dashboard/models/item';

export interface TreeNode {
  folder: Folder;
  subFolders?: TreeNode[];
}
