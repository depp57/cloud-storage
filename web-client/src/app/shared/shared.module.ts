import { NgModule } from '@angular/core';
import { HighlightDirective } from '@shared/directives/highlight.directive';

@NgModule({
  declarations: [HighlightDirective],
  exports: [HighlightDirective]
})
export class SharedModule { }
