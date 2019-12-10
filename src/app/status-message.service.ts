import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageStatus } from './components/controls/message/messageStatus';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private _messageStatusMap: Map<String,BehaviorSubject<MessageStatus>>;
  
  constructor() { 
    this._messageStatusMap = new Map<String,BehaviorSubject<MessageStatus>>();
    this._messageStatusMap.set("root", new BehaviorSubject<MessageStatus>(null));
  }
  
  GetStatusSubject(model){
    return this._messageStatusMap.get( model || "root");
  }

  SetMessage(messageStatus, model?){
    let key  = model || "root";
    if(this._messageStatusMap.has(key)){
      this._messageStatusMap.get(key).next(messageStatus);
    }else{
      this._messageStatusMap.set(key , new BehaviorSubject<MessageStatus>(messageStatus));
    }
  }

  ClearMessage(model?){
    this._messageStatusMap.get( model || "root").next(null);
  }

}
