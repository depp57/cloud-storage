import { EventEmitter } from '@angular/core';

export abstract class DialogComponent<T> {

 delete: EventEmitter<void> = new EventEmitter();
 submit: EventEmitter<T> = new EventEmitter();
 inputData!: T;
}
