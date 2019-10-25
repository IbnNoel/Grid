import { Component, OnInit } from '@angular/core';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { take } from 'rxjs/operators';
import { RefundRequestSettings, AdministratorService } from 'src/app/core/administrator.service';
import { SaveRefundRequestSettingAction } from 'src/app/actions/refundAction';

@Component({
  selector: 'app-direct-reject-request',
  templateUrl: './direct-reject-request.component.html',
  styleUrls: ['./direct-reject-request.component.scss']
})
export class DirectRejectRequestComponent implements OnInit {

  refundRequestSettings: RefundRequestSettings;

  constructor(private store: Store<State>, private adminService: AdministratorService ) { }

  ngOnInit() {
    this.store.pipe(
      take(1),
      select(createSelector((state) => state.adminSettings,
        (adminSettings) => adminSettings.refundRequestSettings)))
          .subscribe((response) => {
            this.refundRequestSettings = Object.assign({},response) as RefundRequestSettings;
      })
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
    // call an action which restores state value!
  }

}
