import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { AdministratorService, ClientSettings } from 'src/app/core/administrator.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent implements OnInit {
  
  clientSettings: ClientSettings;
  industrySegments: Array<string>;
  clientSettings$: Observable<ClientSettings>;

  constructor(private route: ActivatedRoute, private adminService: AdministratorService) {
    this.industrySegments = ["test1", "test2", "test3"];
   }

  ngOnInit() {
    // TODO:- implement loading gif, and validation 
      this.route.paramMap.pipe(
        switchMap(params => this.adminService.getClientSettings({id:params.get('clientId')}))
      ).subscribe(response => this.clientSettings = response);
  }

  onSave(){
    //this.adminService.setClientSettings(this.clientSettings);
  }

  onCancel(){
    // call an action which restores state value!
  }

}

