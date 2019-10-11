import { Component, OnInit } from '@angular/core';

import { AdministratorService, AdminSettings } from 'src/app/core/administrator.service';
import { forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { SelectClientAction } from 'src/app/actions/refundAction';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})

export class AdministratorComponent implements OnInit {

  clientId = 1;

  constructor(private adminService : AdministratorService,  private store: Store<State>) {
    /*debugger;
    this.store.dispatch(new SelectClientAction(this.clientId));*/
  }

  ngOnInit() {
    forkJoin({ 
      clientSettings: this.adminService.getClientSettings(this.clientId),
      refundRequestSettings: this.adminService.getRefundRequestSettings(this.clientId)
     }).subscribe(data => {
       console.log(data);
       // add to store !
     })
  }
}

