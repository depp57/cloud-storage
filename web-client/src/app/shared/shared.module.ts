import { NgModule } from '@angular/core';
import { HighlightDirective } from '@shared/directives/highlight.directive';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';

@NgModule({
  declarations: [HighlightDirective, AutofocusDirective],
  exports: [HighlightDirective, AutofocusDirective]
})
export class SharedModule { }
