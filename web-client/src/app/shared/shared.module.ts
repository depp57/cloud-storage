import { NgModule } from '@angular/core';
import { AutofocusDirective } from '@shared/directives/autofocus.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NotFoundComponent } from '@shared/components/not-found/not-found.component';


const reactiveImports = [
  MatButtonModule,
  MatIconModule,
  MatInputModule,
];

@NgModule({
  declarations: [
    AutofocusDirective,
    NotFoundComponent
  ],
  imports: [
    ReactiveFormsModule,
    reactiveImports
  ],
  exports: [
    AutofocusDirective,
    NotFoundComponent
  ]
})
export class SharedModule {}
