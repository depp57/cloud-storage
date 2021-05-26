import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ContextMenuComponent } from '@modules/utils/context-menu/component/context-menu.component';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Injectable()
export class ContextMenuService {

  private openedMenu!: ComponentRef<ContextMenuComponent>;

  constructor(private resolver: ComponentFactoryResolver) {}

  openMenu(anchor: ViewContainerRef, buttons: MenuButton[], posX: number, posY: number): void {
    // prevent from opening two context menues
    if (this.openedMenu) { this.deleteMenu(); }

    const factory      = this.resolver.resolveComponentFactory(ContextMenuComponent);
    const componentRef = anchor.createComponent(factory);

    componentRef.instance.positionX = posX;
    componentRef.instance.positionY = posY;
    componentRef.instance.buttons   = buttons;

    this.openedMenu = componentRef;

    this.addLoseFocusListener();
  }

  deleteMenu(): void {
    this.openedMenu?.destroy();
  }

  private addLoseFocusListener() {
    const onClickOutside = () => {
      document.removeEventListener('click', onClickOutside);
      this.deleteMenu();
    };
    document.addEventListener('click', onClickOutside);
  }
}
