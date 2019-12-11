import { Component, OnInit, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { AdministratorService, AdminSettings, ClientSettings } from 'src/app/core/administrator.service';
import { forkJoin, Observable, of, from, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store'
import { State } from 'src/app/reducers';
import { Router, ActivatedRoute } from '@angular/router';
import { GetAdminSettingAction } from 'src/app/actions/refundAction';
import { RefundService } from 'src/app/core/refund.service';
import { ClientSettingsService, Client } from 'src/app/core/client-settings.service';
import {} from 'jquery';
import {} from 'bootstrap';
import { PageSettings } from '../controls/data-table/classes/Paging';
import { ColumnDefs, GPFIButton } from '../controls/data-table/classes/Columns';
import { ExpansionSettings } from '../controls/data-table/classes/Expansion';
import { ActionMenuComponent, ActionButton } from '../controls/action-menu/action-menu.component';
import { StatusMessageService } from 'src/app/status-message.service';
import { MessageStatus, MessageType } from '../controls/message/messageStatus';

@Component({
  selector: 'app-administrator',
  templateUrl: './administrator.component.html',
  styleUrls: ['./administrator.component.scss']
})

export class AdministratorComponent implements OnInit {

  clientId = null;
  clientName = "";
  adminSettings$: Observable<AdminSettings>;
  searchName = "";

  colDefinitions: Array<ColumnDefs>;
  data = new BehaviorSubject<Array<Client>>([]);
  pageSettings = new PageSettings(() => {
    this.onSearch();
  });

  constructor(private adminService : AdministratorService, private store: Store<State>, private router: Router,
    private route: ActivatedRoute, private clientService: ClientSettingsService, private statusMessageService: StatusMessageService) {
      this.setUpColumnDefintions();
      
  }

  ngOnInit() {
  }

  onSearch(){
    this.clientService.getClients(this.searchName, this.pageSettings.currentPage, this.pageSettings.pageSize).subscribe(clients => {
      this.pageSettings.setTotalRecords(clients.totalElements);
      this.data.next(clients.list);
    });
  }

  onCancel(){
    this.data.next([]);
    this.searchName = "";
  }

  onBack(){
    $("#findClientPanel").collapse('show');
    this.clientId = null;
  }

  onClientClick(clientId){
    this.adminService.setDefaultSettings(clientId).subscribe(resp => {
        this.getAllAdminSettings(clientId, resp as ClientSettings);
      }, error =>{
        console.log(error);
      })
  }

  setUpColumnDefintions(){
    this.colDefinitions = [
      {key:"name", className: "data_grid_left_align", header:"Name"},
      {key:"cctClientId", className: "data_grid_center_align", header:"CCT Id"},
      {key:"refundConfigured", className: "data_grid_center_align", header:"Refund Configured", formatter: (data) => {
        return data ? "Yes" : "No";
      }},
      { cellElement: () => {
        return new GPFIButton("CONFIGURE", (data) => { 
          this.onClientClick(data.clientId); 
        });
      }, className: "data_grid_center_align"
    }];
  }

  getAllAdminSettings(clientId,clientSettings?:ClientSettings){
    let clientSettings$: Observable<ClientSettings> = (clientSettings) ? of(clientSettings):this.adminService.getRefundRequestSettings(this.clientId);
    forkJoin({
      clientId:of(clientId),
      clientSettings: clientSettings$,
      refundRequestSettings: this.adminService.getRefundRequestSettings(clientId),
      refundHandling: this.adminService.getRefundHandling(clientId)
     }).subscribe(data => {
       this.clientName = data.clientSettings.name;
       this.clientId = clientId;
       this.store.dispatch(new GetAdminSettingAction(data as AdminSettings));
       this.router.navigate([ '../admin/clientSettings'], { relativeTo: this.route });
       $("#findClientPanel").collapse('hide');
     }, error => {
       this.statusMessageService.SetMessage(new MessageStatus(MessageType.Error,null, error.message));
      })
  }

}

