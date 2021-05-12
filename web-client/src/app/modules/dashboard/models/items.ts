export abstract class Item {
  name: string;
  protected _extension?: string;

  constructor(name: string, extension?: string) {
    this.name = name;
    this._extension = extension;
  }

  abstract get extension(): string | undefined;

  get fullName(): string {
    if (this.isFile()) {
      return this.name + this._extension ?? '';
    }

    // else it's a directory which doesn't have an extension
    return this.name;
  }

  abstract isFile(): boolean;

  rename(newName: string, newExtension?: string): void {
    this.name = newName;
    this._extension = newExtension;
  }

  equals(item: Item): boolean {
    return item.name === this.name && this._extension === item._extension;
  }
}

export class File extends Item {

  get iconAsset(): string {
    const asset = mapExtensionToIconAsset[this._extension ?? ''];

    // use the file.png icon as default
    return asset !== undefined ? asset : 'file.png';
  }

  get extension(): string | undefined {
    return this._extension ?? '';
  }

  compareTo(file: File): number {
    if (this.name !== file.name) {
      return this.name > file.name ? 1 : -1;
    }

    const extension = this._extension ?? '';
    const fileExtension = file._extension ?? '';

    return extension > fileExtension ? 1 : extension === fileExtension ? 0 : -1;
  }

  isFile(): boolean {
    return true;
  }

  static fromNameWithExtension(nameWithExtension: string): File {
    const index = nameWithExtension.lastIndexOf('.');
    if (index === -1) {
      return new File(nameWithExtension);
    }

    const extension = nameWithExtension.substring(index);

    return new File(nameWithExtension.substring(0, index), extension);
  }
}

export class Folder extends Item {

  get extension(): string | undefined {
    return undefined;
  }

  compareTo(folder: Folder): number {
    return this.name > folder.name ? 1 : this.name === folder.name ? 0 : -1;
  }

  isFile(): boolean {
    return false;
  }
}

const mapExtensionToIconAsset: Record<string, string> = {
  '': 'file.png',
  '.txt': 'text.png',
  '.xlsx': 'excel.png',
  '.pdf': 'pdf.png',
  '.docx': 'word.png'
};
