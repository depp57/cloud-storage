import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PathService } from '@modules/dashboard/services/path.service';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  private readonly _uploadingItems: BehaviorSubject<File | null>;

  constructor(private pathSvc: PathService, private fileApi: FilesApiService) {
    this._uploadingItems = new BehaviorSubject<File | null>(null);
  }

  get uploadingItems() {
    return this._uploadingItems;
  }

  public uploadItem(list: FileList): void {
    const file = ((list.item(0) as File | unknown) as File); //TODO
    this.uploadingItems.next(file);

    this.computeCRCAndUpload(file);
  }

  private computeCRCAndUpload(file: File): void {
    const reader = file.stream().getReader();
    let prevCrc = 0;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this; //TODO

    reader.read().then(function process(res: ReadableStreamDefaultReadResult<any>) {
      if (res.done) {
        reader.releaseLock();
        that.upload(that, file, prevCrc);
        return;
      }

      prevCrc = crc32(new Uint8Array(crc32AsUint8Array(prevCrc), crc32(res.value as Uint8Array)));
      reader.read().then(process);
    });
  }

  private upload(uploader: UploaderService, file: File, crc32: number): void {
    uploader.fileApi.upload({
      name: file.name,
      path: uploader.pathSvc.currentPath$.value,
      size: file.size,
      CRC: crc32
    }).subscribe(
      (resp) => uploader.uploadFragments(uploader, file, resp.uploadID, resp.chunkSize)
    );
  }

  private uploadFragments(uploader: UploaderService, file: File, uploadID: string, chunkSize: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const reader = file.stream().getReader(); //TODO bug Intellij

    reader.read().then(function process(res: ReadableStreamDefaultReadResult<any>) {
      if (res.done) {
        reader.releaseLock();
        uploader._uploadingItems.next(null);
        return;
      }

      for(let offset = 0; offset < res.value.length; offset += chunkSize) {
        const chunk = (res.value as Uint8Array).slice(offset, offset+chunkSize);

        uploader.fileApi.uploadFragment({
          uploadID,
          fragment: base64(chunk)
        });
      }

      reader.read().then(process);
    });
  }
}

function base64(dataToEncode: Uint8Array): string {
  let dataStr = '';
  dataToEncode.forEach((val) => {
    dataStr += String.fromCharCode(val);
  });

  return btoa(dataStr);
}

function crc32AsUint8Array(crc: number): Uint8Array {
  return Uint8Array.of((crc&(255*256*256*256))>>24, (crc&(255*256*256))>>16, (crc&(255*256))>>8, crc&255);
}

function crc32(data: Uint8Array): number {
  const crcTable = makeCRCTable();
  let crc = 0 ^ (-1);

  for (let i = 0; i < data.length; i++ ) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
  }

  return (crc ^ (-1)) >>> 0;
}

function makeCRCTable(): number[] {
  let c;
  const crcTable = [];
  for(let n =0; n < 256; n++){
    c = n;
    for(let k =0; k < 8; k++){
      c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    crcTable[n] = c;
  }
  return crcTable;
}
