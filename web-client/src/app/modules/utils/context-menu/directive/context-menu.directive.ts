import { Directive, HostListener, Input, ViewContainerRef } from '@angular/core';
import { ContextMenuService } from '@modules/utils/context-menu/service/context-menu.service';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Directive({
  selector: '[appContextMenu]'
})
export class ContextMenuDirective {

  @Input() appContextMenu!: MenuButton[];

  constructor(private elementRef: ViewContainerRef,
              private factory: ContextMenuService) {}

  @HostListener('contextmenu', ['$event']) onContextMenu(event: MouseEvent): void {
    this.factory.openMenu(this.elementRef, this.appContextMenu, event.x, event.y);

    // prevent the browser from handling the right click
    event.preventDefault();
    event.stopPropagation();
  }
}
