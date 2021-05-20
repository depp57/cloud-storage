import { Subject } from 'rxjs';

export abstract class DialogComponent<I, O> {
  readonly closeDialog$: Subject<void> = new Subject();
  readonly submit$: Subject<O>         = new Subject();
  inputData!: I;
}
