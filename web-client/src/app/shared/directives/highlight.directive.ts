import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  private static readonly defaultColor = '#e1dfdd';
  @Input() appHighlight!: string; // default color TODO should be in a constant

  constructor(private element: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter(): void {
    this.highlight(this.appHighlight || HighlightDirective.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.highlight(null);
  }

  private highlight(color: string | null): void {
    this.element.nativeElement.style.backgroundColor = color;
  }
}
