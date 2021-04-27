import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuComponent } from '@modules/utils/context-menu/component/context-menu.component';
import { ContextMenuDirective } from '@modules/utils/context-menu/directive/context-menu.directive';
import { ContextMenuService } from '@modules/utils/context-menu/service/context-menu.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule
  ],
  providers: [
    ContextMenuService
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
