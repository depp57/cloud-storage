import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  Type
} from '@angular/core';
import { DialogComponent } from '@modules/utils/dialog/component/dialog-component';
import { RenameDialogComponent } from '@modules/utils/dialog/component/rename/rename-dialog.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Item } from '@modules/dashboard/models/items';
import { DeleteDialogComponent } from '@modules/utils/dialog/component/delete/delete-dialog.component';
import { OutputRenameData } from '@modules/utils/dialog/model/dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private _openedDialog!: ComponentRef<DialogComponent<unknown, any>>;

  constructor(private resolver: ComponentFactoryResolver,
              private appRef: ApplicationRef,
              private injector: Injector) {}

  openRenameDialog(item: Item): Observable<OutputRenameData> {
    const componentRef = this.openDialog<RenameDialogComponent, Item, OutputRenameData>
                             (RenameDialogComponent, item);

    return componentRef.instance.submit$.pipe(
      take(1) // observe only one value, then auto unsubscribe
    );
  }

  openDeleteDialog(item: Item): Observable<boolean> {
    const componentRef = this.openDialog<DeleteDialogComponent, Item, boolean>
                             (DeleteDialogComponent, item);

    return componentRef.instance.submit$.pipe(
      take(1) // observe only one value, then auto unsubscribe
    );
  }

  private deleteDialog(): void {
    this.appRef.detachView(this._openedDialog.hostView);
    this._openedDialog.destroy();
  }

  private openDialog<C extends DialogComponent<I, O>, I, O>(component: Type<C>, inputData: I): ComponentRef<DialogComponent<I, O>> {
    // prevent from opening two dialogs
    if (this._openedDialog) { this.deleteDialog(); }

    const factory                                           = this.resolver.resolveComponentFactory(component);
    const componentRef: ComponentRef<DialogComponent<I, O>> = factory.create(this.injector);

    const hostView = componentRef.hostView;
    this.appRef.attachView(hostView);

    const domElem = (hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    // listen if the dialog wants to close itself
    componentRef.instance.closeDialog$.subscribe(() => this.deleteDialog());

    // send data to the component
    componentRef.instance.inputData = inputData;

    this._openedDialog = componentRef;

    return componentRef;
  }
}
