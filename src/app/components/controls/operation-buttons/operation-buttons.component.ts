import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { resource } from 'selenium-webdriver/http';
import { GpfiModalComponent, GpfiModalInfo } from '../gpfi-modal/gpfi-modal.component';
import { StatusMessageService } from 'src/app/status-message.service';
import { MessageStatus } from '../message/messageStatus';

@Component({
  selector: 'app-operation-buttons',
  templateUrl: './operation-buttons.component.html',
  styleUrls: ['./operation-buttons.component.scss'],
  outputs: [ 'onSave', 'onCancel' ]
})
export class OperationButtonsComponent implements OnInit {

  @ViewChild(GpfiModalComponent,{static:true}) gpfiModal:GpfiModalComponent;

  constructor(private statusMessageService: StatusMessageService) { }

  ngOnInit() {
  }

  onSave: EventEmitter<any> = new EventEmitter();

  save(){
    this.onSave.emit((displayInfo?: GpfiModalInfo | MessageStatus) => {
       if(displayInfo instanceof GpfiModalInfo){
        this.gpfiModal.show(displayInfo);
       }else if(displayInfo instanceof MessageStatus){
         this.statusMessageService.SetMessage(displayInfo);
       }
    });
  }

  hideButton(eventEmit: EventEmitter<any>){
    return eventEmit.observers.length > 0;
  }

  onCancel: EventEmitter<any> = new EventEmitter();

}
