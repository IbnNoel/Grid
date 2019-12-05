import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageStatus } from './components/controls/message/messageStatus';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private _statusObservable: BehaviorSubject<MessageStatus>;
  
  constructor() { }

  
  get StatusSubject(){
    return this._statusObservable;
  }

  SetMessage(messageStatus){
    this._statusObservable.next(messageStatus);
  }

  ClearMessage(){
    this._statusObservable.next(null);
  }

}
