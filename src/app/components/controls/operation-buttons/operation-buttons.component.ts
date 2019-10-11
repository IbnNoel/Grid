import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-operation-buttons',
  templateUrl: './operation-buttons.component.html',
  styleUrls: ['./operation-buttons.component.scss'],
  outputs: [ 'onSave', 'onCancel' ]
})
export class OperationButtonsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSave: EventEmitter<any> = new EventEmitter();

  onCancel: EventEmitter<any> = new EventEmitter();

}
