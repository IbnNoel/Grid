import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import {} from 'jquery';
import {} from 'bootstrap'; 

@Component({
  selector: 'gpfi-modal',
  templateUrl: './gpfi-modal.component.html',
  styleUrls: ['./gpfi-modal.component.scss']
})
export class GpfiModalComponent implements OnInit, AfterViewInit{

  modalInfo: GpfiModalInfo = {
    message : "Form information successfully saved.",
    title : "Information Saved",
    messageType: GpfiModalMessageType.None
  }

  messageType: GpfiModalMessageType;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
  }

  show(modalInfo?: GpfiModalInfo){
    this.modalInfo = modalInfo || this.modalInfo;
    $("#exampleModal").modal({show:true, backdrop: false});
  }

  //TODO:- ADD ngOnDESTROY
}

export class GpfiModalInfo{
  message?: string;
  title?: string;
  messageType? : GpfiModalMessageType = 0;
  //TODO:- MAKE TYPE ENUM!

  
}

enum GpfiModalMessageType {
  None = 0,
  Save,
  Error,
};
