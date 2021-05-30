import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent implements AfterViewInit {

  positionX!: number;
  positionY!: number;
  buttons!: MenuButton[];

  constructor(private ref: ElementRef) {}

  get position(): { top: string; left: string } {
    return {
      top: `${this.positionY}px`,
      left: `${this.positionX}px`
    };
  }

  ngAfterViewInit(): void {
    // prevents the menu from exceeding the window's right-border
    const htmlContainer = this.ref.nativeElement.firstChild;

    const exceedWindow = htmlContainer.offsetLeft + htmlContainer.offsetWidth - window.innerWidth;

    if (exceedWindow > 0) {
      this.positionX -= exceedWindow;
      htmlContainer.style.left = `${this.positionX}px`;
    }
  }
}
