export class File {
  readonly name: string;
  readonly extension: string;

  constructor(name: string, extension: string) {
    this.name = name;
    this.extension = extension;
  }

  get iconAsset(): string {
    const asset = mapExtensionToIconAsset[this.extension];

    // use the file.png icon as default
    return asset !== undefined ? asset : 'file.png';
  }

  static fromNameWithExtension(nameWithExtension: string): File {
    const index = nameWithExtension.lastIndexOf('.');
    if (index === -1) {
      return new File(nameWithExtension, '');
    }

    const extension = nameWithExtension.substring(index);

    return new File(nameWithExtension.substring(0, index), extension);
  }
}

const mapExtensionToIconAsset: Record<string, string> = {
  '': 'file.png',
  '.txt': 'text.png',
  '.xlsx': 'excel.png',
  '.pdf': 'pdf.png',
  '.docx': 'word.png'
};
