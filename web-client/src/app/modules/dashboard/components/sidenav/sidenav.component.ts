import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidenavComponent {

  @Input() username!: string;
  diskQuota = 150; // TODO FETCH FROM THE API USING A SERVICE

  get quotaPercentage(): number {
    return (this.diskQuota * 100) / 1000; // TODO FETCH FROM THE API USING A SERVICE
  }
}
