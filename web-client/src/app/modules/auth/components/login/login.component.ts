import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private redirectCause: string | undefined;

  constructor(private router: Router,
              private snackBar: MatSnackBar) {
    this.redirectCause = router.getCurrentNavigation()?.extras?.state?.redirect;
  }

  ngOnInit(): void {
    this.displayRedirectCause();
  }

  private displayRedirectCause(): void {
    if (this.redirectCause !== undefined) {
      this.snackBar.open(this.redirectCause, 'Fermer', {duration: 3000});

      this.redirectCause = undefined;
    }
  }
}
