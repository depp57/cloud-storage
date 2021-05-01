import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiFile, ApiFileType, RequestDelete, RequestUpdate, ResponseDelete, ResponseList, ResponseUpdate } from '@modules/dashboard/models/api-files';
import { delay, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilesFakeApiService {

  listDir(filesNb: number, foldersNumber: number, delayInMs: number = 0): Observable<ResponseList> {
    const files: ApiFile[] = [];

    for (let i = 0; i < filesNb; i++) {
      files.push(FilesFakeApiService.generateRandFile());
    }

    for (let i = 0; i < foldersNumber; i++) {
      files.push(FilesFakeApiService.generateRandFolder());
    }

    return of({files}).pipe(delay(delayInMs), take(1));
  }

  rename(param: RequestUpdate, delayInMs: number = 0): Observable<ResponseUpdate> {
    const response: ResponseUpdate = {changed: true};

    return of(response).pipe(delay(delayInMs), take(1));
  }

  delete(param: RequestDelete, delayInMs: number = 0): Observable<ResponseDelete> {
    const response: ResponseDelete = {deleted: true};

    return of(response).pipe(delay(delayInMs), take(1));
  }

  move(param: RequestUpdate, delayInMs: number = 0): Observable<ResponseUpdate> {
    const response: ResponseUpdate = {changed: true};

    return of(response).pipe(delay(delayInMs), take(1));
  }

  private static generateRandFile(): ApiFile {
    const rand = Math.random();
    let fileType: string;

    if (rand < 0.2) {
      fileType = '.txt';
    }
    else if (rand < 0.4) {
      fileType = '';
    }
    else if (rand < 0.6) {
      fileType = '.xlsx';
    }
    else if (rand < 0.8) {
      fileType = '.docx';
    }
    else {
      fileType = '.pdf';
    }

    return {fullPath: this.generateRandName() + fileType, type: ApiFileType.FILE};
  }

  private static generateRandFolder(): ApiFile {
    return {fullPath: this.generateRandName(), type: ApiFileType.DIR};
  }

  private static generateRandName(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const wordLength = Math.random() * 10;

    let name = '';
    for (let i = 0; i < wordLength; i++) {
      name += characters.charAt(Math.random() * characters.length);
    }

    return name;
  }
}
