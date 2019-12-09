import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ExpansionSettings} from '../../controls/data-table/classes/Expansion';
import {ColumnDefs} from '../../controls/data-table/classes/Columns';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {AddCustomRfR, AdministratorService, CustomFieldsSettings} from '../../../core/administrator.service';
import {PageSettings} from '../../controls/data-table/classes/Paging';
import {RefundReasonSettingComponent} from '../reason-for-refund/refund-reason-setting/refund-reason-setting.component';
import {ReasonForRefundValidatorService} from '../../../validator/administrator/reason-for-refund/reason-for-refund-validator.service';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {take} from 'rxjs/operators';
import {createSelector, select, Store} from '@ngrx/store';
import {State} from '../../../reducers';
import {ActionButton, ActionMenuComponent} from '../../controls/action-menu/action-menu.component';
import * as _ from 'lodash';
import {RefdataService} from '../../../core/refdata.service';

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {
  languages: Array<String>;
  customFieldColDef: Array<ColumnDefs>;
  private editRefundSettingForm: FormGroup;
  clientId: number;
  isStandardRfREnabled: boolean;
  errorMessage: string;
  customFields = new BehaviorSubject<Array<CustomFieldsSettings>>([]);

  reasonCodePageSettings = new PageSettings(() => {
    this.updateReasonCodeTable();
  });

  constructor(private adminService: AdministratorService, private CFR: ComponentFactoryResolver,
              private validator: ReasonForRefundValidatorService, private store: Store<State>,
              private refdataService: RefdataService) {
    this.setupCustomFieldColDef();
  }

  ngOnInit() {
    forkJoin({
      clientSettings: this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings))),
      languages: this.refdataService.getLocales()
    }).subscribe(data => {
      this.languages = data.languages.map(l => l.locale);
      this.isStandardRfREnabled = !data.clientSettings.customRfr;
      this.clientId = data.clientSettings.clientId;
      this.updateTables();
    }, error => {
      console.error(error);
    });
  }

  updateReasonCodeTable() {
    this.adminService.getCustomFields(this.clientId, this.reasonCodePageSettings.currentPage,
      this.reasonCodePageSettings.pageSize).subscribe(value => {
      this.reasonCodePageSettings.setTotalRecords(value.totalElements);
      this.customFields.next(value.list);
    });
  }

  /*private updateRefundSetting(request: CustomFieldsSettings) {
    if (this.editRefundSettingForm.valid) {
      request.clientId = this.clientId;
      Object.assign(request, this.editRefundSettingForm.value);
      this.adminService.updateRfRForClient(request).subscribe(value => {
        this.updateTables();
        //this.reasonCodeExpansionSettings.CollapseGrid({propertyName: "clientId", id: value.clientId});
      })
    } else {
      this.editRefundSettingForm.markAllAsTouched();
    }
  }*/

  updateTables() {
    this.updateReasonCodeTable();
  }

  setupCustomFieldColDef() {
    this.customFieldColDef = [
      {
        key: 'display', className: 'data_grid_left_align', header: 'Displayed', formatter: (data) => {
          return data ? 'Yes' : 'No';
        }
      },
      {key: 'fieldName', className: 'data_grid_center_align', header: 'FieldName'},
      {key: 'description', className: 'data_grid_center_align', header: 'Description'},
      {key: 'fieldType', className: 'data_grid_center_align', header: 'FieldType'},
      {
        key: 'mandatory', className: 'data_grid_center_align', header: 'Mandatory', formatter: (data) => {
          return data ? 'Yes' : 'No';
        }
      },
    ];
  }


}
