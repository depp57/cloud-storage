import { Injectable } from '@angular/core';
import { File, FileType } from '@modules/dashboard/models/file';
import { Folder } from '@modules/dashboard/models/folder';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private _files: File[] = [];
  private _folders: Folder[] = [];

  constructor() {
    this.generateFiles(40, 20);
    // setInterval(() => {
    //   this.generateFiles(1);
    // }, 1000);
  }

  get files(): File[] {
    return this._files;
  }

  get folders(): Folder[] {
    return this._folders;
  }

  generateFiles(filesNb: number, foldersNumber: number): void {
    for (let i = 0; i < filesNb; i++) {
      this._files.push(FileService.generateRandFile());
    }

    for (let i = 0; i < foldersNumber; i++) {
      this._folders.push(FileService.generateRandFolder());
    }

    this.sortByName();
  }

  private sortByName(): void {
    const compareFn = (a: File | Folder, b: File | Folder) => {
      return a.name > b.name ? 1 : -1;
    };

    this._files.sort(compareFn);
    this._folders.sort(compareFn);
  }

  private static generateRandFile(): File {
    const rand = Math.random();
    let fileType: FileType;

    if (rand < 0.2) {
      fileType = FileType.TEXT;
    }
    else if (rand < 0.4) {
      fileType = FileType.FILE;
    }
    else if (rand < 0.6) {
      fileType = FileType.EXCEL;
    }
    else if (rand < 0.8) {
      fileType = FileType.WORD;
    }
    else {
      fileType = FileType.PDF;
    }

    return {name: this.generateRandName(), type: fileType};
  }

  private static generateRandFolder(): Folder {
    return {name: this.generateRandName()};
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
