import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RefundHandling, AdministratorService } from 'src/app/core/administrator.service';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-refund-handling',
  templateUrl: './refund-handling.component.html',
  styleUrls: ['./refund-handling.component.scss']
})
export class RefundHandlingComponent implements OnInit {

  refundHandling: RefundHandling;

  constructor(private adminService : AdministratorService, private store: Store<State>) {
    this.setRefundHandlingState();
  }

  ngOnInit() {
  }

  onSave(){
    //this.adminService
  }

  setRefundHandlingState(){
    this.store.pipe(take(1),select(createSelector((state) => state.adminSettings, 
    (adminSettings) => adminSettings.refundHandling))).subscribe((settings) =>{
      this.refundHandling =  Object.assign({},settings);;
    });
  }

  onCancel(){
    this.setRefundHandlingState();
  }

}
