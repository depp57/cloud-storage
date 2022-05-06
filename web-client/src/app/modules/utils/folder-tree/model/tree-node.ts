import { Folder } from '@modules/dashboard/models/items';

export interface TreeNode {
  folder: Folder;
  subFolders?: TreeNode[];
}
