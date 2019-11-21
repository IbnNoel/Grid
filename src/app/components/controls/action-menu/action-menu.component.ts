import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {
  @Input() buttons: Array<ActionButton> = [];
  @Input() disabled?: boolean;

  constructor() {
  }

  ngOnInit() {
    console.log(JSON.stringify(this.buttons));
  }

}

export class ActionButton {
  label: String;
  data?;
  action: (data?) => void;

  _performAction(data?) {
    console.log("calling it" + data);
    this.action(data);
  }
}
