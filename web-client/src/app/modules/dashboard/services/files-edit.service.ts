import { Injectable } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';

@Injectable({
  providedIn: 'root'
})
export class FilesEditService {

  constructor(private repo: FilesRepositoryService) {}
}
