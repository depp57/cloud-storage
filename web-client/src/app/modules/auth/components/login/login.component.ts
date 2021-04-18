import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) {
    console.log(`log in login.component, router.state.cause : ${this.router.getCurrentNavigation()?.extras?.state?.cause}`);
  }

  ngOnInit(): void {}

}
