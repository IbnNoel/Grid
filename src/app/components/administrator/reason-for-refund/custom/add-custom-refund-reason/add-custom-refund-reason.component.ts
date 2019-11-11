import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddLanguageCustomRfrComponent} from "../add-language-custom-rfr/add-language-custom-rfr.component";
import {CustomRfRSettings} from "../../../../../core/administrator.service";


@Component({
  selector: 'app-add-custom-refund-reason',
  templateUrl: './add-custom-refund-reason.component.html',
  styleUrls: ['./add-custom-refund-reason.component.scss'],
  providers: [AddLanguageCustomRfrComponent]
})
export class AddCustomRefundReasonComponent implements OnInit {

  @Output() closeOverlay = new EventEmitter(true);
  @Output() addCustomRfRSettings = new EventEmitter(true);
  customRfRSetting: CustomRfRSettings;
  clientId:number;
  new:boolean;

  constructor() {
  }


  ngOnInit() {
    this.customRfRSetting = new CustomRfRSettings();
    this.customRfRSetting.clientId=this.clientId;
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.addCustomRfRSettings.emit(this.customRfRSetting);
  }
}
