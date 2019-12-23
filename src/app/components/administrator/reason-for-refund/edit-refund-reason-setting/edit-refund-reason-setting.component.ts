import {Component, EventEmitter, OnInit} from '@angular/core';
import {CustomRfRSettings} from "../../../../core/administrator.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-refund-reason-setting',
  templateUrl: './edit-refund-reason-setting.component.html',
  styleUrls: ['./edit-refund-reason-setting.component.scss']
})
export class EditRefundReasonSettingComponent implements OnInit {
  customRfRSetting: CustomRfRSettings;
  formName: FormGroup;
  editMode: boolean;
  closeOverlay = new EventEmitter();
  updateRefundSetting = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateRefundSetting.emit(this.customRfRSetting);
  }
}
