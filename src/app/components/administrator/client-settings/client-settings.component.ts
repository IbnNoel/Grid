import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, take } from 'rxjs/operators';
import { AdministratorService, ClientSettings, IndustrySegment } from 'src/app/core/administrator.service';
import { Observable } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { settings } from 'cluster';
import { GpfiModalComponent, GpfiModalInfo } from '../../controls/gpfi-modal/gpfi-modal.component';
import { SaveClientSettingsAction } from 'src/app/actions/refundAction';

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

  constructor(private route: ActivatedRoute, private store: Store<State>, private adminService: AdministratorService) {
      this.industrySegments$ = this.adminService.getIndustrySegments();
    }

  ngOnInit() {
     this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.adminSettings,
        (adminSettings) => adminSettings.clientSettings)))
          .subscribe((response) => {
            this.clientSettings = Object.assign({},response);
      });
  }

  onSave(onEmit){
    this.adminService.setClientSettings(this.clientSettings).subscribe(response =>{
      if(response.success){
        this.store.dispatch(new SaveClientSettingsAction(response.data));
        onEmit();
      }
    })
  }

  onCancel(){
    // call an action which restores state value!
  }

}

