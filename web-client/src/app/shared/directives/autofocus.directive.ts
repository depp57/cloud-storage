import { AfterContentInit, Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]'
})
export class AutofocusDirective implements AfterContentInit {

  constructor(private element: ElementRef) {}

  ngAfterContentInit(): void {
    this.element.nativeElement.focus();
  }
}
