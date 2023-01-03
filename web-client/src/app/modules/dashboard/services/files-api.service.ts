import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiFile,
  RequestDelete,
  RequestList,
  RequestUpdate,
  ResponseCreate,
  ResponseDelete,
  ResponseList,
  ResponseUpdate
} from '@models/api-files';
import { FilesFakeApiService } from '@modules/dashboard/services/files-fake-api.service';
import { map, publishReplay, refCount, take, tap } from 'rxjs/operators';
import { API_FILES_CACHE_TIME, PATH_SEPARATOR } from '@shared/constants';

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

      const response = this.http.get<ResponseList>('files/list', {
        params: new HttpParams().set('filePath', filePath),
        observe: 'response'}
      ).pipe(
        publishReplay(1, API_FILES_CACHE_TIME),
        refCount(),
        take(1),
        map(resp => resp.body as ResponseList)
      );

      // const response = this.fakeApi.listDir(30, 5, 500).pipe(
      //   publishReplay(1, API_FILES_CACHE_TIME),
      //   refCount(),
      //   take(1)
      // );

      this._foldersCache.set(param.filePath, response);

      return response.pipe(
        tap(res => console.log(res))
      );
    }
  }

  createDir(param: ApiFile): Observable<ResponseCreate> {
    this.invalidateCache(param.path + param.name, param.path + PATH_SEPARATOR + param.name);

    return this.http.post<ResponseCreate>('files/createDir', param);
  }

  rename(param: RequestUpdate): Observable<ResponseUpdate> {
    this.invalidateCache(param.path, param.newPath);

    return this.http.post<ResponseUpdate>('files/rename', param);

    //console.log('update', param);
    //return this.fakeApi.rename(param, 500);
  }

  move(param: RequestUpdate): Observable<ResponseUpdate> {
    this.invalidateCache(param.path, param.newPath);
    return this.http.post<ResponseUpdate>('files/move', param);

    //console.log('move', param);
    //return this.fakeApi.move(param, 500);
  }

  delete(param: RequestDelete): Observable<ResponseDelete> {
    this.invalidateCache(param.filePath);

    return this.http.delete<ResponseDelete>('files/delete', {params: new HttpParams().set('filePath', param.filePath)});

    //console.log('delete', param);
    //return this.fakeApi.delete(param, 500);
  }

  private invalidateCache(...fullPaths: string[]): void {
    fullPaths.forEach(filePath => {
        const index               = filePath.lastIndexOf('/');
        let fullPathWithoutFile = filePath.substring(0, index);
        if (fullPathWithoutFile === '') {
          fullPathWithoutFile = '/';
        }
        this._foldersCache.delete(fullPathWithoutFile);
      }
    );
  }
}
