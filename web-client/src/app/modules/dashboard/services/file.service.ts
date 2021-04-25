import { Injectable } from '@angular/core';
import { File, FileType } from 'src/app/modules/dashboard/models/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private files: File[] = [];

  constructor() {
    this.generateFiles(15);
    // setInterval(() => {
    //   this.generateFiles(1);
    // }, 1000);
  }

  generateFiles(nb: number): void {
    for (let i = 0; i < nb; i++) {
      this.files.push(this.generateRandFile());
    }
  }

  getFiles(): File[] {
    return this.files;
  }

  private generateRandFile(): File {
    const rand = Math.random();
    let fileType: FileType;

    if (rand < 0.15) {
      fileType = FileType.TEXT;
    }
    else if (rand < 0.3) {
      fileType = FileType.FILE;
    }
    else if (rand < 0.45) {
      fileType = FileType.EXCEL;
    }
    else if (rand < 0.6) {
      fileType = FileType.WORD;
    }
    else if (rand < 0.75) {
      fileType = FileType.FOLDER;
    }
    else {
      fileType = FileType.PDF;
    }

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const wordLength = Math.random() * 10;

    let word = '';
    for (let i = 0; i < wordLength; i++) {
      word += characters.charAt(Math.random() * characters.length);
    }

    return {name: word, type: fileType};
  }
}
