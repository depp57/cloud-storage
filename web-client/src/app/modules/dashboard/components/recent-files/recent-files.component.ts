import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recent-files',
  templateUrl: './recent-files.component.html',
  styleUrls: ['./recent-files.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentFilesComponent {}
