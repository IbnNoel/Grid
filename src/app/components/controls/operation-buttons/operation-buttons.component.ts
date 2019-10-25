import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { resource } from 'selenium-webdriver/http';
import { GpfiModalComponent, GpfiModalInfo } from '../gpfi-modal/gpfi-modal.component';

@Component({
  selector: 'app-operation-buttons',
  templateUrl: './operation-buttons.component.html',
  styleUrls: ['./operation-buttons.component.scss'],
  outputs: [ 'onSave', 'onCancel' ]
})
export class OperationButtonsComponent implements OnInit {

  @ViewChild(GpfiModalComponent,{static:true}) gpfiModal:GpfiModalComponent;

  constructor() { }

  ngOnInit() {
  }

  onSave: EventEmitter<any> = new EventEmitter();

  save(){
    this.onSave.emit((gpfiModalInfo?: GpfiModalInfo) => {
       this.gpfiModal.show(gpfiModalInfo);
    });
  }

  onCancel: EventEmitter<any> = new EventEmitter();

}
