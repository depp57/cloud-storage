import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploaderComponent implements OnInit {

  @Input() file: File | null = null;
  constructor() { }

  ngOnInit(): void {
  }

}
