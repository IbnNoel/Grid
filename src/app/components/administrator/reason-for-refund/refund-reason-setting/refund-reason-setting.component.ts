import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRfRSettings} from "../../../../core/administrator.service";

@Component({
  selector: 'app-refund-reason-setting',
  templateUrl: './refund-reason-setting.component.html',
  styleUrls: ['./refund-reason-setting.component.scss']
})
export class RefundReasonSettingComponent implements OnInit {

  @Input() customRfRSetting: CustomRfRSettings;
  editMode: boolean;
  gridWidth: String;
  @Output() closeOverlay = new EventEmitter();
  @Output() updateRefundSetting = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.gridWidth = this.editMode ? "col-md-3" : "col-md-4";
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateRefundSetting.emit(this.customRfRSetting);
  }
}
