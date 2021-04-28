import { Injectable } from '@angular/core';
import { File } from '@modules/dashboard/models/file';
import { Folder } from '@modules/dashboard/models/folder';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '@modules/auth/services/auth.service';
import { ApiFilesResponse, ApiFileType } from '@modules/dashboard/models/api-files';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FilesFakeApiService } from '@modules/dashboard/services/files-fake-api.service';

@Injectable({
  providedIn: 'root'
})
export class FilesRepositoryService {

  private _files: File[] = [];
  private _folders: Folder[] = [];

  constructor(private auth: AuthService,
              private http: HttpClient,
              private fakeApi: FilesFakeApiService) {}

  get files(): File[] {
    return this._files;
  }

  get folders(): Folder[] {
    return this._folders;
  }

  // private sortByName(): void {
  //   const compareFn = (a: File | Folder, b: File | Folder) => {
  //     return a.name > b.name ? 1 : -1;
  //   };
  //
  //   this._files.sort(compareFn);
  //   this._folders.sort(compareFn);
  // }

  listDir(path: { path: string }): Observable<ApiFilesResponse> {
    // return this.http.get<ApiFilesResponse>(API_ENDPOINT + 'files/list/', this.auth.requestWithAuth(path)).pipe(
    //   tap(response => this.saveFiles(response))
    // );

    return this.fakeApi.generateFiles(40, 20, 500).pipe(
      tap(response => this.saveFiles(response))
    );
  }

  private saveFiles(response: ApiFilesResponse): void {
    for (const file of response.files) {
      const fileName = FilesRepositoryService.extractFileName(file.fullPath);

      if (file.type === ApiFileType.FILE) {
        this._files.push(File.fromNameWithExtension(fileName));
      }
      else {
        this._folders.push({name: fileName});
      }
    }
  }

  private static extractFileName(fullPath: string): string {
    const split = fullPath.split('/');
    return split[split.length - 1];
  }
}
