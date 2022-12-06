import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  RequestDelete,
  RequestList,
  RequestUpdate,
  ResponseDelete,
  ResponseList,
  ResponseUpdate
} from '@modules/dashboard/models/api-files';
import { FilesFakeApiService } from '@modules/dashboard/services/files-fake-api.service';
import { publishReplay, refCount, take, tap } from 'rxjs/operators';
import { API_FILES_CACHE_TIME } from '@shared/constants';

@Injectable({
  providedIn: 'root'
})
export class FilesApiService {

  private _foldersCache = new Map<string, Observable<ResponseList>>();

  constructor(private http: HttpClient,
              private fakeApi: FilesFakeApiService) {}

  listDir(param: RequestList): Observable<ResponseList> {
    const cache = this._foldersCache.get(param.filePath);

    if (cache) {
      console.log('listDir | cached', param);
      return cache;
    }
    else {
      console.log('listDir | http request', param);

      // removes whitespaces
      const filePath = param.filePath.trim();

      // add URL parameters to the http request
      const options = {params: new HttpParams().set('filePath', filePath)};

      const observable = this.http.get<ResponseList>('files/list', options).pipe(
        publishReplay(1, API_FILES_CACHE_TIME),
        refCount(),
        take(1)
      );

      // const observable = this.fakeApi.listDir(30, 5, 500).pipe(
      //   publishReplay(1, API_FILES_CACHE_TIME),
      //   refCount(),
      //   take(1)
      // );
      this._foldersCache.set(param.filePath, observable);
      return observable.pipe(
        tap(res => console.log(res))
      );
    }
  }

  update(param: RequestUpdate): Observable<ResponseUpdate> {
    this.invalidateCache(param.filePath, param.newFilePath);
    // return this.http.post<ResponseUpdate>('files/update', param);
    console.log('update', param);
    return this.fakeApi.rename(param, 500);
  }

  delete(param: RequestDelete): Observable<ResponseDelete> {
    this.invalidateCache(param.filePath);
    // return this.http.delete<ResponseDelete>('files/update', param);

    console.log('delete', param);
    return this.fakeApi.delete(param, 500);
  }

  move(param: RequestUpdate): Observable<ResponseUpdate> {
    this.invalidateCache(param.filePath, param.newFilePath);
    // return this.http.post<ResponseUpdate>('files/update', param);

    console.log('move', param);
    return this.fakeApi.move(param, 500);
  }

  private invalidateCache(...fullPaths: string[]): void {
    fullPaths.forEach(filePath => {
        const index               = filePath.lastIndexOf('/');
        const fullPathWithoutFile = filePath.substring(0, index + 1);

        this._foldersCache.delete(fullPathWithoutFile);
      }
    );
  }
}
