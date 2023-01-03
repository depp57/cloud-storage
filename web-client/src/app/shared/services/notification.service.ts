import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar, private zone: NgZone) { }

  showSuccess(message: string): void {
    this.zone.run(() => {
      this.snackBar.open(message);
    });
  }

  showError(message: string): void {
    console.error(message);
    // The second parameter is the text in the button.
    // In the third, we send in the css class for the snack bar.
    this.zone.run(() => {
      this.snackBar.open(message, 'X', {panelClass: ['error'], duration: 3000});
    });
  }
}
