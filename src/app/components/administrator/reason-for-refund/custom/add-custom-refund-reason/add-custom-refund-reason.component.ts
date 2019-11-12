import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddLanguageCustomRfrComponent} from "../add-language-custom-rfr/add-language-custom-rfr.component";
import {AddCustomRfR, CustomRfRSettings} from "../../../../../core/administrator.service";
import {forkJoin} from "rxjs";
import {take} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../../reducers";


@Component({
  selector: 'app-add-custom-refund-reason',
  templateUrl: './add-custom-refund-reason.component.html',
  styleUrls: ['./add-custom-refund-reason.component.scss'],
  providers: [AddLanguageCustomRfrComponent]
})
export class AddCustomRefundReasonComponent implements OnInit {

  @Output() closeOverlay = new EventEmitter(true);
  @Output() addCustomRfRSettings = new EventEmitter(true);
  customRfRSetting: AddCustomRfR=new AddCustomRfR();
  clientId:number;
  new:boolean;
  editLanguage:boolean;

  constructor(private store:Store<State>) {
  }


  ngOnInit() {
     this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings))).
     subscribe(value => {
       this.customRfRSetting.clientId=value.clientId;
     });
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.addCustomRfRSettings.emit(this.customRfRSetting);
  }
}
