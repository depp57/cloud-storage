import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { File, Folder, Item } from '@modules/dashboard/models/items';
import { MenuButton } from '@modules/utils/context-menu/model/menu-button';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { ItemLogic } from '@modules/dashboard/services/item-logic.service';
import { slideInOutAnimation } from '@shared/animations';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss'],
  animations: [slideInOutAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilesExplorerComponent implements OnInit {

  loading = new BehaviorSubject(true);

  constructor(private fileRepo: FilesRepositoryService,
              private snackBar: MatSnackBar,
              private itemLogic: ItemLogic) {}

  get contextMenuButtons(): MenuButton[] {
    return [
      {text: 'Nouveau fichier', icon: 'add', onClick: () => this.onNewFile()},
      {text: 'Nouveau dossier', icon: 'add', onClick: () => this.onNewFolder()},
      {text: 'Charger un fichier(s)', icon: 'upload', onClick: () => this.onUploadFile()},
      {text: 'Charger un dossier', icon: 'upload', onClick: () => this.onUploadFolder()},
    ];
  }

  get searchText$(): Observable<string> {
    return this.fileRepo.searchText$;
  }

  get files$(): Observable<File[]> {
    return this.fileRepo.files$;
  }

  get folders$(): Observable<Folder[]> {
    return this.fileRepo.folders$;
  }

  get onMoveItem$(): Observable<Item | null> {
    return this.itemLogic.onMove$;
  }

  ngOnInit(): void {
    this.fileRepo.listFolder('/').subscribe(
      () => this.loading.next(false),
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
