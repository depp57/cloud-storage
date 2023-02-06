import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map, timeout } from 'rxjs/operators';

export class WebSock {
  private _subject: AnonymousSubject<MessageEvent>;
  private _messages: Observable<Uint8Array>;

  constructor(subject: AnonymousSubject<MessageEvent>, messages: Observable<Uint8Array>) {
    this._subject = subject;
    this._messages = messages;
  }

  get messages(): Observable<Uint8Array> {
    return this._messages;
  }

  public send(data: Uint8Array | string) {
    this._subject.next(new MessageEvent<any>('data', {data}));
  }

  public close() {
    this._subject.complete();
  }
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public create(url: string): WebSock {
    const ws = new WebSocket(url);

    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    const observer = {
      next: (data: MessageEvent<any>) => {
        //if (ws.readyState === WebSocket.OPEN) {
        //  ws.send(data.data);
        //} else {
          setTimeout(() => {
            ws.send(data.data);
          }, 1000);
        //}
      },
      error: (err: any) => {
        console.log('Websocket error: '+err.toString());
      },
      complete: () => {
        ws.close();
        console.log('Websocket closed');
      }
    };

    const subject = new AnonymousSubject<MessageEvent>(observer, observable);
    const messages = subject.pipe(
      map(
        (response: MessageEvent): Uint8Array => {
          console.log(response.data);
          return JSON.parse(response.data);
        }
      )
    );

    console.log('Successfully connected: ' + url);
    return new WebSock(subject, messages);
  }
}
