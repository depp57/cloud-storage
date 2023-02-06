import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PathService } from '@modules/dashboard/services/path.service';
import { FilesApiService } from '@modules/dashboard/services/files-api.service';
import { WebsocketService } from '@modules/dashboard/services/websocket.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  private readonly _uploadingItems: BehaviorSubject<File | null>;

  private readonly _crc32BufferLength = 4096*1024;

  constructor(private pathSvc: PathService, private fileApi: FilesApiService, private websocket: WebsocketService) {
    this._uploadingItems = new BehaviorSubject<File | null>(null);
  }

  get uploadingItems() {
    return this._uploadingItems;
  }

  public uploadItem(list: FileList): void {
    const file = ((list.item(0) as File | unknown) as File); //TODO handle multiple files
    this.uploadingItems.next(file);

    const crc32 = this.computeCRC(file, 0, this._crc32BufferLength, 0);

    crc32.then((value) => {
      console.log('CRC32 computed');
      this.makeUploadRequest(file, value);
    });
  }

  private async computeCRC(file: File, offset: number, bufferLength: number, prevCrc: number): Promise<number> {
    if (offset >= file.size) {
      return prevCrc;
    }

    console.log((offset / file.size)*50);

    await readFromTo(file, offset, bufferLength, (buf) => {
      const prevCrcArray = crc32AsUint8Array(prevCrc);
      const dataCrcArray = crc32AsUint8Array(crc32(new Uint8Array(buf)));
      const merge = new Uint8Array(prevCrcArray.length + dataCrcArray.length);
      merge.set(prevCrcArray);
      merge.set(dataCrcArray, prevCrcArray.length);
      prevCrc = crc32(merge);

      //console.log(prevCrc); TODO remove ?
    });

    return await this.computeCRC(file, offset + bufferLength, bufferLength, prevCrc);
  }

  private makeUploadRequest(file: File, crc32: number): void {
    this.fileApi.upload({
      name: file.name,
      path: this.pathSvc.currentPath$.value,
      size: file.size,
      CRC: crc32
    }).subscribe(
      (resp) => this.startFragmentsUpload(file, resp.uploadID, resp.chunkSize).then()
    );
  }

  private async startFragmentsUpload(file: File, uploadID: string, chunkSize: number) {
    const ws = this.websocket.create(environment.uploadWebsocketEndpoint+'api/files/upload/fragment');

    // server expect to get uploadID as the first value in websocket
    ws.send(uploadID);
    console.log('uploadID sent: ' + uploadID);

    for(let offset = 0; offset < file.size; offset += chunkSize) {
      await readFromTo(file, offset, chunkSize, (buf) => {
        ws.send(buf as Uint8Array);
        console.log('chunk sent');
      });
    }

    setTimeout(() => {
      ws.close();
    }, 2000);
    this._uploadingItems.next(null); // remove UI loader
  }
}

async function readFromTo<T>(file: File, from: number, length: number, treat: ((buf: ArrayBuffer) => T)): Promise<T> {
  const blob = file.slice(from, from + length);
  const buffer = await blob.arrayBuffer();
  return treat(buffer);
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
  for(let n = 0; n < 256; n++){
    c = n;
    for(let k = 0; k < 8; k++){
      c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)); // IEEE polynomial
    }
    crcTable[n] = c;
  }
  return crcTable;
}
