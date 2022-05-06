import { NgModule } from '@angular/core';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';

@NgModule({
  declarations: [AutofocusDirective],
  exports: [AutofocusDirective]
})
export class SharedModule {}
