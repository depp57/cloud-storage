import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '@modules/shared/context-menu/component/context-menu.component';
import { ContextMenuDirective } from '@modules/shared/context-menu/directive/context-menu.directive';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule
  ],
  declarations: [
    ContextMenuComponent,
    ContextMenuDirective
  ],
  exports: [
    ContextMenuDirective
  ]
})
export class ContextMenuModule {}
