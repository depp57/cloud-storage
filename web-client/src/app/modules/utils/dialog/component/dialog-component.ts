import { Subject } from 'rxjs';

export abstract class DialogComponent<I, O> {

  closeDialog: Subject<void> = new Subject();
  submit: Subject<O> = new Subject();
  inputData!: I;
}
