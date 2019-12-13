import {Component, OnInit} from '@angular/core';
import {createSelector, select, Store} from '@ngrx/store';
import {State} from 'src/app/reducers';
import {take} from 'rxjs/operators';
import {AdministratorService, RefundRequestSettings} from 'src/app/core/administrator.service';
import {SaveRefundRequestSettingAction} from 'src/app/actions/refundAction';
import {forkJoin, Observable, of} from 'rxjs';
import {ActionButton} from '../../controls/action-menu/action-menu.component';
import * as _ from 'lodash';
import {RefdataService} from "../../../core/refdata.service";
import { MessageStatus, MessageType } from '../../controls/message/messageStatus';

@Component({
  selector: 'app-direct-reject-request',
  templateUrl: './direct-reject-request.component.html',
  styleUrls: ['./direct-reject-request.component.scss']
})
export class DirectRejectRequestComponent implements OnInit {

  refundRequestSettings: RefundRequestSettings;
  languages$: Observable<Array<string>>;
  actionButtons: Array<ActionButton>;
  infoTextList: Array<{ locale: string, text: string }> = [];


  constructor(private store: Store<State>, private adminService: AdministratorService, private refdataService: RefdataService) {
  }

  ngOnInit() {
    this.refdataService.getLocales().subscribe(value => {
      this.languages$ = of(value.map(l => l.locale));
    });
    this.setSavedState();
  }

  setSavedState() {
    forkJoin({
        rrSettings: this.store.pipe(
          take(1),
          select(createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.refundRequestSettings))),
        lang: this.languages$
      },
    ).subscribe((response) => {
      this.refundRequestSettings = _.cloneDeep(response.rrSettings) as RefundRequestSettings;
      this.setDefaultValue();
      this.setActionBtns(response.lang);

    })
  }

  setActionBtns(languages) {
    this.actionButtons = [];
    languages.forEach(locale => {
      if (!_.find(this.refundRequestSettings.refundRequestInfoList, {'locale': locale})) {
        this.addActionButton(locale);
      }
    });
  }

  addActionButton(locale) {
    let button = new ActionButton();
    button.label = locale;
    button.data = locale;
    button.action = (locale) => {
      this.addInformationalText(locale);
    };
    this.actionButtons.push(button);
  }

  addInformationalText(locale) {
    this.refundRequestSettings.refundRequestInfoList.push({locale: locale, text: ""});
    this.removeActionButtonItem(locale);
  }

  removeActionButtonItem(locale) {
    this.actionButtons = _.remove(this.actionButtons, (btn) => {
      return btn.label != locale;
    });
  }

  disableActionButton() {
    return this.actionButtons.length == 0;
  }

  setDefaultValue() {
    if (this.refundRequestSettings.refundRequestInfoList.length == 0) {
      this.refundRequestSettings.refundRequestInfoList = [];
      this.addInformationalText(this.refdataService.getDefaultLanguage());
    }
  }

  ifDefault(locale) {
    return this.refdataService.isDefaultLanguage(locale);
  }

  removeFieldText(locale) {
    this.refundRequestSettings.refundRequestInfoList = _.remove(this.refundRequestSettings.refundRequestInfoList, (fieldText) => {
      return fieldText.locale != locale;
    });
    this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

  onSave(onEmit) {
    this.adminService.setRefundRequestSettings(this.refundRequestSettings).subscribe(response => {
      let messageStatus = new MessageStatus(MessageType.Success, "", "MSG_ONADMINTABSAVE" );
      this.store.dispatch(new SaveRefundRequestSettingAction(response.data));
      onEmit(messageStatus);
    })
  }

  onCancel() {
    this.setSavedState();
  }

}
