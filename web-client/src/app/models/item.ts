import { ItemVisitor } from './itemVisitor';

const mapExtensionToIconAsset: Record<string, string> = {
  '': 'file.png',
  txt: 'text.png',
  xlsx: 'excel.png',
  pdf: 'pdf.png',
  docx: 'word.png'
};

export interface Item {
  get name(): string;
  get extension(): string | null;
  get path(): string;
  get parentFolderPath(): string;
  get iconAsset(): string;
  rename(name: string): File;
  toJson(): string;
  equals(item: Item): boolean;
  compareTo(file: Item): number;
  accept(visitator: ItemVisitor): boolean;
}

export class File implements Item {

  private _path: string;
  private readonly _name: string;

  constructor(path: string) {
    this._path = path;
    this._name = this.extractName(path);
  }

  //static fromJson(json: string): File {
  //  const parsedFile = JSON.parse(json);
  //  return new File(parsedFile.path)
  //}

  get name(): string {
    return this._name;
  }

  get extension(): string | null {
    // https://stackoverflow.com/a/12900504/11798458
    return this._name.slice((this._name.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  get path(): string {
    return this._path;
  }

  get parentFolderPath(): string {
    const index = this.path.lastIndexOf('/');
    return this.path.substring(0, index + 1);
  }

  get iconAsset(): string {
    const asset = mapExtensionToIconAsset[this.extension ?? ''];

    // use the file.png icon as default
    return asset !== undefined ? asset : 'file.png';
  }

  rename(name: string): File {
    return new File(this.parentFolderPath + name);
  }

  toJson(): string {
    return JSON.stringify({
      path: this.path,
      isFile: true
    });
  }

  equals(item: Item): boolean {
    return this.path === item.path && this.constructor.name === item.constructor.name;
  }

  compareTo(file: Item): number {
    return this._name > file.name ? 1 : -1;
  }

  accept(visitor: ItemVisitor): boolean {
    return visitor.visitFile(this);
  }

  private extractName(path: string): string {
    const split = path.split('/');
    return split[split.length - 1];
  }
}


export class Folder extends File {

  static fromJson(json: string): File {
    const parsedFile = JSON.parse(json);
    return new Folder(parsedFile.path);
  }
  rename(name: string): File {
    return new Folder(this.parentFolderPath + name);
  }

  toJson(): string {
    return JSON.stringify({
      path: this.path,
      isFile: false
    });
  }

  accept(visitor: ItemVisitor): boolean {
    return visitor.visitFolder(this);
  }
}


export class RootFolder extends Folder {

  constructor() {
    super('/');
  }
}
