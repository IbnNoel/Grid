import { Component, OnInit } from '@angular/core';
import { AdministratorService, AdminSettings, ClientSettings } from 'src/app/core/administrator.service';
import { forkJoin, Observable, of, from, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store'
import { State } from 'src/app/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { GetAdminSettingAction } from 'src/app/actions/refundAction';
import { RefundService } from 'src/app/core/refund.service';
import { ColumnDefs, GPFIButton } from '../controls/data-table/data-table.component';
import { ClientSettingsService, Client } from 'src/app/core/client-settings.service';
import {} from 'jquery';
import {} from 'bootstrap';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})

export class AdministratorComponent implements OnInit {

  clientId = null;
  clientName = "";
  adminSettings$: Observable<AdminSettings>;

  colDefinitions: Array<ColumnDefs>  =[{key:"name"}, {key:"cctClientId"}, {key:"refundConfigured"}]
  data = new BehaviorSubject<Array<Client>>([]);

  constructor(private adminService : AdministratorService, private store: Store<State>, private router: Router, 
    private route: ActivatedRoute, private clientService: ClientSettingsService) {
      this.colDefinitions.push({cellElement: () => { 
        return new GPFIButton("CONFIGURE", (data) => { this.onClientClick(data.id,data); });
        }
      })
  }

  ngOnInit() {
     //this.onClientClick();
  }

  onSearch(formData){
    var name = formData.form.value.clientName;
    this.clientService.getClients(name ,0 ,10 ).subscribe(clients =>{
      this.data.next(clients.list);
    });
    console.log(formData);
  }

  onClientClick(clientId, clientSettings:ClientSettings){
    clientSettings.industryTemplateId = clientSettings.industrySegment;
    clientSettings.clientId = clientId;
    this.adminService.setDefaultSettings(clientSettings).subscribe(resp => {
        this.getAllAdminSettings(clientId, resp as ClientSettings);
      }, error =>{
        console.log(error);
      })
  }

  getAllAdminSettings(clientId,clientSettings?:ClientSettings){
    let clientSettings$: Observable<ClientSettings> = (clientSettings) ? of(clientSettings):this.adminService.getRefundRequestSettings(this.clientId);
    forkJoin({
      clientId:of(clientId), 
      clientSettings: clientSettings$,
      refundRequestSettings: this.adminService.getRefundRequestSettings(clientId)
     }).subscribe(data => {
       this.clientName = data.clientSettings.name;
       this.clientId = clientId;
       this.store.dispatch(new GetAdminSettingAction(data as AdminSettings));
       this.router.navigate([ '../admin/clientSettings'], { relativeTo: this.route });
       debugger;
       $("#findClientPanel").collapse('hide');
     }, error => {
       console.error(error);
      })
  }

}

