import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRfRSettings} from "../../../../../core/administrator.service";

@Component({
  selector: 'app-add-custom-refund-setting',
  templateUrl: './add-custom-refund-setting.component.html',
  styleUrls: ['./add-custom-refund-setting.component.scss']
})
export class AddCustomRefundSettingComponent implements OnInit {

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
