import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FilesRepositoryService } from '@modules/dashboard/services/files-repository.service';
import { Item } from '@models/item';
import { MenuButton } from '@modules/shared/context-menu/model/menu-button';
import { HTTP_ERROR_CODES } from '@shared/constants';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { slideInOutAnimation } from '@shared/animations';
import { CanContainVisitor } from '@models/itemVisitor';
import { DialogService } from '@modules/shared/dialog/service/dialog.service';

@Component({
  selector: 'app-files-explorer',
  templateUrl: './files-explorer.component.html',
  styleUrls: ['./files-explorer.component.scss'],
  animations: [slideInOutAnimation],
  changeDetection: ChangeDetectionStrategy.Default
})
export class FilesExplorerComponent implements OnInit {

  loading = new BehaviorSubject(true);

  private _onMoveItem: Item | null = null;

  constructor(private fileRepo: FilesRepositoryService,
              private snackBar: MatSnackBar,
              private dialog: DialogService,
              public canContainVisitor: CanContainVisitor) {}

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

  get items$(): Observable<Item[]> {
    return this.fileRepo.files$;
  }

  get onMoveItem(): Item | null {
    return this._onMoveItem;
  }

  ngOnInit(): void {
    this.fileRepo.checkDirectory('/').subscribe(
      () => this.loading.next(false),
      error => this.showLoadingError(error.status)
    );
  }

  onNewFile(): void {
    console.log('Nouveau fichier');
  }

  onNewFolder(): void {
    this.dialog.openCreateFolderDialog().subscribe(
      newFilePath => {
        if (newFilePath) {
          this.fileRepo.createDirectory(newFilePath);
        }
      }
    );
  }

  onUploadFile(): void {
    console.log('Charger un fichier(s)');
  }

  onUploadFolder(): void {
    console.log('Charger un dossier');
  }

  moveFileEvent(moved: Item | null): void {
    this._onMoveItem = moved;
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
