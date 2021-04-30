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
    // return this.http.get<ApiFilesResponseList>(API_ENDPOINT + 'files/list/', param);

    return this.fakeApi.listDir(30, 5, 500);
  }

  update(param: RequestUpdate): Observable<ResponseUpdate> {
    // return this.http.post<ApiFilesResponseUpdate>(API_ENDPOINT + 'files/update/', param);

    return this.fakeApi.rename(param, 0);
  }

  delete(param: RequestDelete): Observable<ResponseDelete> {
    // return this.http.delete<ApiFilesResponseDelete>(API_ENDPOINT + 'files/update/', param);

    return this.fakeApi.delete(param, 0);
  }
}
