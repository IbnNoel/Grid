import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageStatus } from './components/controls/message/messageStatus';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {
  private _messageStatusMap: Map<String,BehaviorSubject<MessageStatus>>;
  
  constructor(private router: Router) { 
    this._messageStatusMap = new Map<String,BehaviorSubject<MessageStatus>>();
    this._messageStatusMap.set("root", new BehaviorSubject<MessageStatus>(null));
    
    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.ClearMessage();
      }
    });
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
