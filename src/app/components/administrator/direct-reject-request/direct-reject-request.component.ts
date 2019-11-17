import { Component, OnInit } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { take, throwIfEmpty } from 'rxjs/operators';
import { RefundRequestSettings, AdministratorService } from 'src/app/core/administrator.service';
import { SaveRefundRequestSettingAction } from 'src/app/actions/refundAction';
import { Observable } from 'rxjs';
import { ActionButton } from '../../controls/action-menu/action-menu.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-direct-reject-request',
  templateUrl: './direct-reject-request.component.html',
  styleUrls: ['./direct-reject-request.component.scss']
})
export class DirectRejectRequestComponent implements OnInit {

  refundRequestSettings: RefundRequestSettings;
  languages$: Observable<Array<String>>;
  actionButtons: Array<ActionButton> = [];
  infoTextList: Array<{ locale : string, text: string }> = [];

  readonly defaultLangauge = "en";

  constructor(private store: Store<State>, private adminService: AdministratorService ) { }

  ngOnInit() {
    this.languages$ = this.adminService.getLanguageList();
    this.setSavedState();
    this.setActionBtns();
    this.setDefaultValue();
  }

  setSavedState(){
    this.store.pipe(
      take(1),
      select(createSelector((state) => state.adminSettings,
        (adminSettings) => adminSettings.refundRequestSettings)))
          .subscribe((response) => {
            this.refundRequestSettings = Object.assign({},response) as RefundRequestSettings;
      });
  }

  setActionBtns(){
    this.languages$.subscribe(value => {
      value.forEach(locale => {
        this.addActionButton(locale);
      });
    });
  }

  addActionButton(locale){
    let button = new ActionButton();
    button.label = locale;
    button.data = locale;
    button.action = (locale) => {
      this.addInformationalText(locale);
    };
    this.actionButtons.push(button);
  }

  addInformationalText(locale){
    this.refundRequestSettings.refundRequestInfoList.push({locale:locale, text:""});
    this.actionButtons  = _.remove(this.actionButtons, (btn)=> {
        return btn.label != locale;
    });
  }

  setDefaultValue(){
    if(this.refundRequestSettings.refundRequestInfoList.length == 0){
      this.refundRequestSettings.refundRequestInfoList = [];
      this.addInformationalText(this.defaultLangauge);
    }
  }

  ifDefault(locale){
    return locale == this.defaultLangauge;
  }

  removeFieldText(locale){
    this.refundRequestSettings.refundRequestInfoList = _.remove(this.refundRequestSettings.refundRequestInfoList, (fieldText)=> {
      return fieldText.locale != locale;
    });
    this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

  onSave(onEmit){
    this.adminService.setRefundRequestSettings(this.refundRequestSettings).subscribe(response =>{
      if(response.success){
        this.store.dispatch(new SaveRefundRequestSettingAction(response.data));
        onEmit();
      }
    })
  }

  onCancel(){
    this.setSavedState();
  }

}
