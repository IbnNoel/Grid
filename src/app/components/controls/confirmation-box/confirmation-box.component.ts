import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-confirmation-box',
  templateUrl: './confirmation-box.component.html',
  styleUrls: ['./confirmation-box.component.scss']
})
export class ConfirmationBoxComponent implements OnInit {

  @Input() confirmationAction: ConfirmationAction;

  constructor() {
  }

  ngOnInit() {
  }

  close() {
    $("#confirmationBox").modal("hide");
  }

  OnConfirm() {
    this.confirmationAction.action();
  }

  show() {
    $("#confirmationBox").modal({show: true, backdrop: false});
  }
}

export class ConfirmationAction {
  action: () => void;
}
