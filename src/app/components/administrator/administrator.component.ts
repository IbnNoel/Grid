import { Component, OnInit } from '@angular/core';
import { AdministratorService, AdminSettings } from 'src/app/core/administrator.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store'
import { State } from 'src/app/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { GetAdminSettingAction } from 'src/app/actions/refundAction';


@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})

export class AdministratorComponent implements OnInit {

  clientId = 1;
  adminSettings$: Observable<AdminSettings>;

  constructor(private adminService : AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute) {
    /*debugger;
    this.store.dispatch(new SelectClientAction(this.clientId));*/
  }

  ngOnInit() {
     this.onClientClick();
  }

  onClientClick(){
    forkJoin({
      clientId:of(this.clientId), 
      clientSettings: this.adminService.getClientSettings(this.clientId),
      refundRequestSettings: this.adminService.getRefundRequestSettings(this.clientId)
     }).subscribe(data => {
       this.store.dispatch(new GetAdminSettingAction(data));
       this.router.navigate([ '../admin/clientSettings'], { relativeTo: this.route });
     })
  }

}

