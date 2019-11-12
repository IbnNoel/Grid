import {Component, Input, OnInit} from '@angular/core';
import {CustomRfRSettings} from "../../../../../core/administrator.service";

@Component({
  selector: 'app-add-custom-refund-setting',
  templateUrl: './add-custom-refund-setting.component.html',
  styleUrls: ['./add-custom-refund-setting.component.scss']
})
export class AddCustomRefundSettingComponent implements OnInit {

  @Input() customRfRSetting:CustomRfRSettings;

  constructor() { }

  ngOnInit() {
  }

}
