import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss']
})
export class BaseDialogComponent {

  @Input() title!: string;
  @Output() closeDialog = new EventEmitter<void>();

  onClose(): void {
    this.closeDialog.emit();
  }
}
