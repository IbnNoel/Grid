import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {AdministratorService, ClientSettings} from 'src/app/core/administrator.service';
import {Observable} from 'rxjs';
import {createSelector, select, Store} from '@ngrx/store';
import {State} from 'src/app/reducers';
import {GpfiModalInfo} from '../../controls/gpfi-modal/gpfi-modal.component';
import {SaveClientSettingsAction} from 'src/app/actions/refundAction';
import {IndustrySegment, RefdataService} from "../../../core/refdata.service";
import { MessageStatus, MessageType } from '../../controls/message/messageStatus';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent implements OnInit {

  clientSettings: ClientSettings;
  industrySegments$: Observable<Array<IndustrySegment>>;
  clientSettings$: Observable<ClientSettings>;
  gpfiModalinfo: GpfiModalInfo;

  adminSettingFunc = (state) => state.adminSettings;
  refDataFunc = (state) => state.refData;

  constructor(private route: ActivatedRoute, private store: Store<State>, private adminService: AdministratorService, private refdataService: RefdataService) {
  }

  ngOnInit() {
    this.setSavedState();
  }

  setSavedState() {
    this.store.pipe(
      take(1),
      select(
        createSelector(this.adminSettingFunc,
          (adminSettings) => adminSettings.clientSettings)))
      .subscribe((response) => {
        this.clientSettings = Object.assign({}, response);
      });
    this.industrySegments$ = this.refdataService.getIndustrySegments();
  }

  onSave(onEmit) {
    this.adminService.setClientSettings(this.clientSettings).subscribe(response => {
        let messageStatus = new MessageStatus( MessageType.Success, "", "MSG_ONADMINTABSAVE" );
        this.store.dispatch(new SaveClientSettingsAction(response.data));
        onEmit(messageStatus);
    })
  }

  onCancel() {
    this.setSavedState();
  }

}

