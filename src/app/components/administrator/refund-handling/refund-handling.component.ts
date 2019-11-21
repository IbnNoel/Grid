import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {
  RefundHandling,
  AdministratorService,
  AddOrRemovePymntTypeCurrency
} from 'src/app/core/administrator.service';
import { Store, select, createSelector } from '@ngrx/store';
import { State } from 'src/app/reducers';
import { SaveRefundHandlingSettingAction } from 'src/app/actions/refundAction';
import {map, take} from 'rxjs/operators';
import {ColumnDefs, GPFIButton} from '../../controls/data-table/classes/Columns';
import {PageSettings} from '../../controls/data-table/classes/Paging';

@Component({
  selector: 'app-refund-handling',
  templateUrl: './refund-handling.component.html',
  styleUrls: ['./refund-handling.component.scss']
})
export class RefundHandlingComponent implements OnInit {

  refundHandling: RefundHandling;
  selectedData: AddOrRemovePymntTypeCurrency;
  pymntTypeCurrMap: Observable<Map<string, Array<string>>>;
  colDefinitions: Array<ColumnDefs>;
  data = new BehaviorSubject<Array<AddOrRemovePymntTypeCurrency>>([]);
  pageSettings = new PageSettings(() => {
    this.updateClientPymntTypeCurrTable();
  });

  adminSettingFunc = (state) => state.adminSettings;

  constructor(private adminService: AdministratorService, private store: Store<State>) {
    this.pymntTypeCurrMap = adminService.getPaymentTypes();
    this.setRefundHandlingState();
    this.setSelectedData();
    this.setUpColumnDefintions();
  }

  ngOnInit() {
    forkJoin({
      clientSettings: this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings)))
    }).subscribe(data => {
      this.selectedData.clientId = data.clientSettings.clientId;
      this.updateClientPymntTypeCurrTable();
    }, error => {
      console.error(error);
    });
  }

  onSave(onEmit){
    this.adminService.setRefundHandling(this.refundHandling).subscribe(response =>{
      if(response.success){
        this.store.dispatch(new SaveRefundHandlingSettingAction(response.data));
        onEmit();
      }
    })
  }

  setRefundHandlingState(){
    this.store.pipe(take(1),select(createSelector((state) => state.adminSettings,
    (adminSettings) => adminSettings.refundHandling))).subscribe((settings) =>{
      this.refundHandling =  Object.assign({}, settings);
    });
  }

  setSelectedData(){
    this.store.pipe(take(1), select(createSelector((state) => state.adminSettings,
      (adminSettings) => adminSettings.selectedData))).subscribe((settings) =>{
      this.selectedData =  Object.assign({}, settings);
    });
  }

  onCancel(){
    this.setRefundHandlingState();
  }

  addPymntTypeAndCurr(selectedData) {
    this.adminService.addPymntTypeAndCurr(selectedData).subscribe(response => {
        selectedData.paymentTypeId = '';
        selectedData.currency = '';
        this.updateClientPymntTypeCurrTable();
    },
      error => {
        selectedData.paymentTypeId = '';
        selectedData.currency = '';
        console.error(error);
      });
}

  removePymntTypeAndCurr(paymentTypeId, currency) {

    this.selectedData.paymentTypeId = paymentTypeId;
    this.selectedData.currency = currency;
    this.adminService.removePymntTypeAndCurr(this.selectedData).subscribe(response => {
        this.selectedData.paymentTypeId = '';
        this.selectedData.currency = '';
        this.updateClientPymntTypeCurrTable();
      },
      error => {
        console.error(error);
      });
  }

  setUpColumnDefintions() {
    this.colDefinitions = [
      {key: 'paymentTypeId', className: 'data_grid_right_align', header: 'Payment Type'},
      {key: 'currency', className: 'data_grid_left_align', header: 'Currency'},
      { cellElement: () => {
          return new GPFIButton('DELETE', (data) => { this.removePymntTypeAndCurr(data.paymentTypeId, data.currency); });
        }, className: 'data_grid_center_align'
      }];
  }

  updateClientPymntTypeCurrTable() {
    this.adminService.getClientPymntTypeCurrList(this.selectedData.clientId, this.pageSettings.currentPage, this.pageSettings.pageSize).subscribe(value => {
      this.pageSettings.setTotalRecords(value.totalElements);
      this.data.next(value.list);
    });
  }

}
