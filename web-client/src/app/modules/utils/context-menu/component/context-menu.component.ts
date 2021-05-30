import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextMenuComponent {

  positionX!: number;
  positionY!: number;
  buttons!: MenuButton[];

  get position(): { top: string; left: string } {
    return {
      top: `${this.positionY}px`,
      left: `${this.positionX}px`
    };
  }
}
