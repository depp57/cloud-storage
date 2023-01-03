import { Component, Input } from '@angular/core';
import { TreeNode } from '@modules/shared/folder-tree/model/tree-node';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { LoaderService } from '@shared/services/loader.service';
import { FolderTreeService } from '@modules/shared/folder-tree/service/folder-tree.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-folder-tree-node',
  templateUrl: './folder-tree-node.component.html'
})
export class FolderTreeNodeComponent {

  @Input() node!: TreeNode;
  expanded = false;
  selected = false;

  constructor(private filesRepo: FilesRepositoryService,
              private loader: LoaderService,
              private folderTree: FolderTreeService) {
    this.folderTree.selectedFolder.subscribe(
      () => {
        this.selected = false;
      }
    );
  }

  toggleFolder(): void {
    this.folderTree.selectFolder(this.node.folder);
    this.selected = true;

    if (this.expanded) {
      this.expanded = false;
    }
    else {
      this.filesRepo.getSubFolders(this.node.folder).subscribe(
        treeNode => {
          this.node     = treeNode;
          this.expanded = true;
        }
      );
    }
  }

  get isLoading$(): Observable<boolean> {
    return this.loader.isLoading$.pipe(
      map(value => value && this.selected)
    );
  }
}
