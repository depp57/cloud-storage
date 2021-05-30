import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FolderTreeComponent } from './component/folder-tree/folder-tree.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FolderTreeNodeComponent } from './component/folder-tree-node/folder-tree-node.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  declarations: [
    FolderTreeComponent,
    FolderTreeNodeComponent
  ],
  exports: [
    FolderTreeComponent
  ]
})
export class FolderTreeModule {}
