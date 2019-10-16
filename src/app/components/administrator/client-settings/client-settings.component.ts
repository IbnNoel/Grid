import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, take } from 'rxjs/operators';
import { AdministratorService, ClientSettings } from 'src/app/core/administrator.service';
import { Observable } from 'rxjs';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { settings } from 'cluster';

@Component({
  selector: 'app-client-settings',
  templateUrl: './client-settings.component.html',
  styleUrls: ['./client-settings.component.scss']
})
export class ClientSettingsComponent implements OnInit {
  
  clientSettings: ClientSettings;
  industrySegments: Array<string>;
  clientSettings$: Observable<ClientSettings>;

  constructor(private route: ActivatedRoute, private store: Store<State>, private adminService: AdministratorService) {
      this.industrySegments = ["test1", "test2", "test3"];

      
      this.store.pipe(
        take(1),
        select(createSelector((state) => state.adminSettings,
        (adminSettings) => adminSettings.clientSettings)))
          .subscribe((response) => {
            this.clientSettings = Object.assign({},response);
        })
    }

  ngOnInit() {
    
    // TODO:- implement loading gif, and validation 

  }

  onSave(){
    //this.adminService.setClientSettings(this.clientSettings);
  }

  onCancel(){
    // call an action which restores state value!
  }

}

