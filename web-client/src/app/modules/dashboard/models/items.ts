export abstract class Item {

  fullPath: string;
  readonly fullName: string;

  constructor(fullPath: string) {
    this.fullPath = fullPath;
    this.fullName = Item.extractName(fullPath);
  }

  static fromJson(json: string): Item {
    const parsedItem = JSON.parse(json);
    return parsedItem.isFile ?
      new File(parsedItem.fullPath) :
      new Folder(parsedItem.fullPath);
  }

  get name(): string {
    return this.fullName.replace(/\.[^/.]+$/, '');
  }

  get extension(): string | null {
    // https://stackoverflow.com/a/12900504/11798458
    return this.fullName.slice((this.fullName.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  get parentFolderPath(): string {
    const index = this.fullPath.lastIndexOf('/');
    return this.fullPath.substring(0, index + 1);
  }

  equals(item: Item): boolean {
    return this.fullPath === item.fullPath && this.isFile() === item.isFile();
  }

  toJson(): string {
    return JSON.stringify({
      fullPath: this.fullPath,
      isFile: this.isFile()
    });
  }

  compareTo(item: Item): number {
    return this.fullName > item.fullName ? 1 : -1;
  }

  abstract isFile(): boolean;

  abstract rename(name: string, extension?: string): Item;

  private static extractName(fullPath: string): string {
    const split = fullPath.split('/');
    return split[split.length - 1];
  }
}


export class File extends Item {

  get iconAsset(): string {
    const asset = mapExtensionToIconAsset[this.extension ?? ''];

    // use the file.png icon as default
    return asset !== undefined ? asset : 'file.png';
  }

  isFile(): boolean {
    return true;
  }

  rename(name: string, extension?: string): Item {
    return new File(this.parentFolderPath + name + extension ?? '');
  }
}


export class Folder extends Item {

  public static readonly ROOT = new Folder('/');

  constructor(fullPath: string) {
    super(fullPath);
    if (!fullPath.endsWith('/')) {
      this.fullPath += '/';
    }
  }

  isFile(): boolean {
    return false;
  }

  rename(name: string): Item {
    return new Folder(this.parentFolderPath + name);
  }
}


const mapExtensionToIconAsset: Record<string, string> = {
  '': 'file.png',
  txt: 'text.png',
  xlsx: 'excel.png',
  pdf: 'pdf.png',
  docx: 'word.png'
};
