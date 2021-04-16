import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  ApiFile,
  ApiFileType,
  RequestDelete,
  RequestUpdate,
  ResponseDelete,
  ResponseList,
  ResponseUpdate
} from '@modules/dashboard/models/api-files';
import { delay, finalize, take, tap } from 'rxjs/operators';
import { LoaderService } from '@shared/services/loader.service';
import { PathService } from '@modules/dashboard/services/path.service';

@Injectable({
  providedIn: 'root'
})
export class FilesFakeApiService {

  constructor(private path: PathService,
              private loading: LoaderService) {}

  listDir(filesNb: number, foldersNumber: number, delayInMs: number = 0): Observable<ResponseList> {
    const result: ApiFile[] = [];

    for (let i = 0; i < filesNb; i++) {
      result.push(this.generateRandFile());
    }

    for (let i = 0; i < foldersNumber; i++) {
      result.push(this.generateRandFolder());
    }

    return this.handleLoading(of({result}), delayInMs);
  }

  rename(param: RequestUpdate, delayInMs: number = 0): Observable<ResponseUpdate> {
    const response: ResponseUpdate = {changed: true};

    return this.handleLoading(of(response), delayInMs);
  }

  delete(param: RequestDelete, delayInMs: number = 0): Observable<ResponseDelete> {
    const response: ResponseDelete = {deleted: true};

    return this.handleLoading(of(response), delayInMs);
  }

  move(param: RequestUpdate, delayInMs: number = 0): Observable<ResponseUpdate> {
    const response: ResponseUpdate = {changed: true};

    return this.handleLoading(of(response), delayInMs);
  }

  private handleLoading<T>(response: Observable<T>, delayInMs: number): Observable<T> {
    return response.pipe(
      tap(() => this.startLoading()),
      delay(delayInMs),
      take(1),
      finalize(() => this.stopLoading())
    );
  }

  private startLoading(): void {
    this.loading.isLoading$.next(true);
  }

  private stopLoading(): void {
    this.loading.isLoading$.next(false);
  }

  private generateRandFile(): ApiFile {
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

    return {
      filePath: this.path.currentPath$.value + FilesFakeApiService.generateRandName() + fileType,
      type: ApiFileType.FILE
    };
  }

  private generateRandFolder(): ApiFile {
    return {filePath: this.path.currentPath$.value + FilesFakeApiService.generateRandName(), type: ApiFileType.DIR};
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
