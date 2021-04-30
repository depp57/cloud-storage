export abstract class Item {
  name: string;
  extension?: string;

  constructor(name: string, extension?: string) {
    this.name = name;
    this.extension = extension;
  }

  isFile(): boolean {
    return this.extension !== undefined;
  }

  rename(newName: string, newExtension?: string): void {
    this.name = newName;
    this.extension = newExtension;
  }

  equals(item: Item): boolean {
    return item.name === this.name && this.extension === item.extension;
  }
}

export class File extends Item {
  extension: string;

  constructor(name: string, extension: string) {
    super(name, extension);
    this.extension = extension;
  }

  get iconAsset(): string {
    const asset = mapExtensionToIconAsset[this.extension];

    // use the file.png icon as default
    return asset !== undefined ? asset : 'file.png';
  }

  compareTo(file: File): number {
    if (this.name !== file.name) {
      return this.name > file.name ? 1 : -1;
    }

    return this.extension > file.extension ? 1 : this.extension === file.extension ? 0 : -1;
  }

  rename(newName: string, newExtension?: string): void {
    super.rename(newName, newExtension);
    if (!newExtension) { this.extension = '.'; }
  }

  static fromNameWithExtension(nameWithExtension: string): File {
    const index = nameWithExtension.lastIndexOf('.');
    if (index === -1) {
      return new File(nameWithExtension, '.');
    }

    const extension = nameWithExtension.substring(index);

    return new File(nameWithExtension.substring(0, index), extension);
  }
}

export class Folder extends Item {

  compareTo(folder: Folder): number {
    return this.name > folder.name ? 1 : this.name === folder.name ? 0 : -1;
  }
}

const mapExtensionToIconAsset: Record<string, string> = {
  '.': 'file.png',
  '.txt': 'text.png',
  '.xlsx': 'excel.png',
  '.pdf': 'pdf.png',
  '.docx': 'word.png'
};
