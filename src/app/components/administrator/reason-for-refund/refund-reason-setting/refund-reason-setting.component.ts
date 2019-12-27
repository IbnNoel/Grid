import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRfRSettings} from "../../../../core/administrator.service";
import {AbstractControl, FormGroup, FormGroupName} from "@angular/forms";

@Component({
  selector: 'app-refund-reason-setting',
  templateUrl: './refund-reason-setting.component.html',
  styleUrls: ['./refund-reason-setting.component.scss']
})
export class RefundReasonSettingComponent implements OnInit {

  @Input() formName: FormGroup;
  @Input() customRfRSetting: CustomRfRSettings;
  @Input() editMode?: boolean;
  gridWidth: String;
  @Output() closeOverlay = new EventEmitter();
  @Output() updateRefundSetting = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.gridWidth = this.editMode ? "col-md-3" : "col-md-4";
    this.updateForm();
  }

  updateForm() {
    this.formName.patchValue({
      reasonCode: this.customRfRSetting.reasonCode,
      reasonForRefund: this.customRfRSetting.reasonForRefund,
      sortOrder: this.customRfRSetting.sortOrder,
      numOfDocument: this.customRfRSetting.numOfDocument
    });
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateRefundSetting.emit(this.customRfRSetting);
  }
}
