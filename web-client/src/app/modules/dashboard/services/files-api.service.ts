import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestDelete, RequestList, RequestUpdate, ResponseDelete, ResponseList, ResponseUpdate } from '@modules/dashboard/models/api-files';
import { FilesFakeApiService } from '@modules/dashboard/services/files-fake-api.service';

@Injectable({
  providedIn: 'root'
})
export class FilesApiService {

  constructor(private http: HttpClient,
              private fakeApi: FilesFakeApiService) {}

  listDir(param: RequestList): Observable<ResponseList> {
    // // removes whitespaces
    // const fullPath = param.fullPath.trim();
    //
    // // add URL parameters to the http request
    // const options = {params: new HttpParams().set('fullPath', fullPath)};
    //
    // return this.http.get<ResponseList>('files/list/', options);

    console.log('listDir', param);
    return this.fakeApi.listDir(30, 5, 0);
  }

  update(param: RequestUpdate): Observable<ResponseUpdate> {
    // return this.http.post<ResponseUpdate>('files/update/', param);
    console.log('update', param);
    return this.fakeApi.rename(param, 500);
  }

  delete(param: RequestDelete): Observable<ResponseDelete> {
    // return this.http.delete<ResponseDelete>('files/update/', param);

    console.log('delete', param);
    return this.fakeApi.delete(param, 500);
  }

  move(param: RequestUpdate): Observable<ResponseUpdate> {
    // return this.http.post<ResponseUpdate>('files/update/', param);

    console.log('move', param);
    return this.fakeApi.move(param, 500);
  }
}
