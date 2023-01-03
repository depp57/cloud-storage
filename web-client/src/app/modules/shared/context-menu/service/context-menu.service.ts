import { ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ContextMenuComponent } from '@modules/shared/context-menu/component/context-menu.component';
import { MenuButton } from '@modules/shared/context-menu/model/menu-button';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuService {

  private _openedMenu?: ComponentRef<ContextMenuComponent>;

  constructor(private resolver: ComponentFactoryResolver) {}

  openMenu(anchor: ViewContainerRef, buttons: MenuButton[], posX: number, posY: number): void {
    // prevent from opening two context menues
    if (this._openedMenu) { this.deleteMenu(); }

    const factory      = this.resolver.resolveComponentFactory(ContextMenuComponent);
    const componentRef = anchor.createComponent(factory);

    componentRef.instance.positionX = posX;
    componentRef.instance.positionY = posY;
    componentRef.instance.buttons   = buttons;

    this._openedMenu = componentRef;

    this.addLoseFocusListener();
  }

  deleteMenu(): void {
    if (this._openedMenu) {
      this._openedMenu.destroy();
      this._openedMenu = undefined;
    }
  }

  private addLoseFocusListener() {
    const backgroundElement = document.querySelector('mat-sidenav-content');
    const events            = ['click', 'scroll'];

    const onLoseFocus = () => {
      events.forEach(event =>
        backgroundElement?.removeEventListener(event, onLoseFocus));
      this.deleteMenu();
    };
    events.forEach(event =>
      backgroundElement?.addEventListener(event, onLoseFocus));
  }
}
