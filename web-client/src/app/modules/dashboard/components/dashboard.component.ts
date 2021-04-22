import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@shared/services/loader.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private loader: LoaderService) { }

  get isLoading(): BehaviorSubject<boolean> {
    return this.loader.isLoading;
  }

  ngOnInit(): void {
  }
}
