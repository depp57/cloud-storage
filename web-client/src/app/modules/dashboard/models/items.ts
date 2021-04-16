export abstract class Item {

  filePath: string;
  readonly fullName: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    this.fullName = Item.extractName(filePath);
  }

  static fromJson(json: string): Item {
    const parsedItem = JSON.parse(json);
    return parsedItem.isFile ?
      new File(parsedItem.filePath) :
      new Folder(parsedItem.filePath);
  }

  get name(): string {
    return this.fullName.replace(/\.[^/.]+$/, '');
  }

  get extension(): string | null {
    // https://stackoverflow.com/a/12900504/11798458
    return this.fullName.slice((this.fullName.lastIndexOf('.') - 1 >>> 0) + 2);
  }

  get parentFolderPath(): string {
    const index = this.filePath.lastIndexOf('/');
    return this.filePath.substring(0, index + 1);
  }

  equals(item: Item): boolean {
    return this.filePath === item.filePath && this.isFile() === item.isFile();
  }

  toJson(): string {
    return JSON.stringify({
      filePath: this.filePath,
      isFile: this.isFile()
    });
  }

  compareTo(item: Item): number {
    return this.fullName > item.fullName ? 1 : -1;
  }

  abstract isFile(): boolean;

  abstract rename(name: string, extension?: string): Item;

  private static extractName(filePath: string): string {
    const split = filePath.split('/');
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

  constructor(filePath: string) {
    super(filePath);
    if (!filePath.endsWith('/')) {
      this.filePath += '/';
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
