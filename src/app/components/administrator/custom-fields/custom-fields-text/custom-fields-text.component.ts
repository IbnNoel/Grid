import {Component, Input, OnInit} from '@angular/core';
import {CustomFieldsView, CustomRfRSettings} from "../../../../core/administrator.service";

@Component({
  selector: 'app-custom-fields-text',
  templateUrl: './custom-fields-text.component.html',
  styleUrls: ['./custom-fields-text.component.scss']
})
export class CustomFieldsTextComponent implements OnInit {
  @Input() customFieldsView: CustomFieldsView;

  constructor() { }

  ngOnInit() {
  }

}
