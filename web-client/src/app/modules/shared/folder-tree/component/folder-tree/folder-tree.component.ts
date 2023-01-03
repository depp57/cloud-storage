import { Component, ChangeDetectionStrategy, OnInit, Output, EventEmitter } from '@angular/core';
import { TreeNode } from '@modules/shared/folder-tree/model/tree-node';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { Folder, RootFolder } from '@models/item';
import { FolderTreeService } from '@modules/shared/folder-tree/service/folder-tree.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-folder-tree',
  templateUrl: './folder-tree.component.html',
  styleUrls: ['./folder-tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderTreeComponent implements OnInit {

  @Output() selectedFolder = new EventEmitter<Folder>();
  rootNode!: Observable<TreeNode>;
  selected                 = true;

  constructor(private filesRepo: FilesRepositoryService,
              private folderTree: FolderTreeService) {}

  ngOnInit(): void {
    this.rootNode = this.filesRepo.getSubFolders(new RootFolder());

    this.folderTree.selectedFolder.subscribe(
      folder => {
        this.selectedFolder.emit(folder);
        this.selected = false;
      }
    );
  }

  toggleRootFolder(): void {
    this.folderTree.selectFolder(new RootFolder());
    this.selected = true;
  }
}
