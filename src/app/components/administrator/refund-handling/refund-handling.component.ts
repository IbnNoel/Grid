import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RefundHandling,
  AdministratorService,
  IndustrySegment,
  ClientSettings, PaymentTypeAndCurrencies, SelectedPaymentTypeAndCurrencies
} from 'src/app/core/administrator.service';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import {map, take} from 'rxjs/operators';
import {GpfiModalInfo} from "../../controls/gpfi-modal/gpfi-modal.component";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-refund-handling',
  templateUrl: './refund-handling.component.html',
  styleUrls: ['./refund-handling.component.scss']
})
export class RefundHandlingComponent implements OnInit {

  refundHandling: RefundHandling;
  pymntTypeCurrMap : Observable<Map<string, Array<string>>>;
  selectedPaymentType : string;

  adminSettingFunc = (state) => state.adminSettings;

  constructor(private adminService : AdministratorService, private store: Store<State>) {
    this.pymntTypeCurrMap = adminService.getPaymentTypes();

    this.setRefundHandlingState();
  }

  ngOnInit() {
  }

// Func for retriving the currency list for the selected payment type
  /*currencyList(paymentType){
    return this.pymntTypeCurrMap.pipe(
      map(data => data[paymentType])
    );
  }*/

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
