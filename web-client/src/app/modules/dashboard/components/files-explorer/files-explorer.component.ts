import { Component, OnInit } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { File, Folder } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss']
})
export class FilesExplorerComponent implements OnInit {

  loading           = true;
  files: File[]     = this.fileRepo.files;
  folders: Folder[] = this.fileRepo.folders;

  constructor(private fileRepo: FilesRepositoryService,
              private snackBar: MatSnackBar) {}

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Nouveau fichier', icon: 'add', onClick: () => this.onNewFile()},
      {text: 'Nouveau dossier', icon: 'add', onClick: () => this.onNewFolder()},
      {text: 'Charger un fichier(s)', icon: 'upload', onClick: () => this.onUploadFile()},
      {text: 'Charger un dossier', icon: 'upload', onClick: () => this.onUploadFolder()},
    ];
  }

  get searchText(): string | undefined {
    return this.fileRepo.searchText;
  }

  ngOnInit(): void {
    this.fileRepo.listFolder('').subscribe(
      _ => this.loading = false,
      error => this.showLoadingError(error.status)
    );
  }

  onNewFile(): void {
    console.log('Nouveau fichier');
  }

  onNewFolder(): void {
    console.log('Nouveau dossier');
  }

  onUploadFile(): void {
    console.log('Charger un fichier(s)');
  }

  onUploadFolder(): void {
    console.log('Charger un dossier');
  }

  // workaround for use *ngFor directive with number instead of collection
  // @see https://stackoverflow.com/questions/36354325/angular-2-ngfor-using-numbers-instead-collections
  createArrayForPlaceholder(nbItems: number): number[] {
    return Array(nbItems);
  }

  private showLoadingError(httpErrorCode: number): void {
    const message = HTTP_ERROR_CODES[httpErrorCode];
    this.snackBar.open(`Erreur lors du chargement des fichiers : ${message}`, 'Fermer', {duration: 3000});
  }
}
