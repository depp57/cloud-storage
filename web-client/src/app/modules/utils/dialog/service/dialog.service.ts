import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { RenameDialogComponent } from '@modules/utils/dialog/component/rename/rename-dialog.component';
import { Observable } from 'rxjs';
import { RenameData } from '@modules/utils/dialog/model/dialog-data';
import { first } from 'rxjs/operators';
import { Item } from '@modules/dashboard/models/items';

@Injectable()
export class DialogService {

  private openedDialog!: ComponentRef<DialogComponent<any>>;

  constructor(private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {}

  openRenameDialog(item: Item): Observable<RenameData> {
    // prevent from opening two dialogs
    if (this.openedDialog) { this.deleteDialog(); }

    const factory = this.resolver.resolveComponentFactory(RenameDialogComponent);

    const componentRef: ComponentRef<DialogComponent<RenameData>> = factory.create(this.injector);
    const hostView = componentRef.hostView;

    this.appRef.attachView(hostView);

    const domElem = (hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // listen if the dialog wants to close itself
    componentRef.instance.delete.subscribe(() => this.deleteDialog());
    componentRef.instance.inputData = {name: item.name, extension: item.extension};

    this.openedDialog = componentRef;

    return componentRef.instance.submit.pipe(
      first() // observe only one value, then auto unsubscribe
    );
  }

  deleteDialog(): void {
    this.appRef.detachView(this.openedDialog.hostView);
    this.openedDialog.destroy();
  }
}
