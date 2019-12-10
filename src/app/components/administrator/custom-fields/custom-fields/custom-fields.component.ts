import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ExpansionSettings} from '../../../controls/data-table/classes/Expansion';
import {ColumnDefs} from '../../../controls/data-table/classes/Columns';
import {BehaviorSubject, forkJoin} from 'rxjs';
import {AdministratorService, CustomFieldsSettings, CustomRfRSettings} from '../../../../core/administrator.service';
import {PageSettings} from '../../../controls/data-table/classes/Paging';
import {CustomFieldsSettingComponent} from '../../custom-fields/custom-fields-setting/custom-fields-setting.component';
import {ReasonForRefundValidatorService} from '../../../../validator/administrator/reason-for-refund/reason-for-refund-validator.service';
import {take} from 'rxjs/operators';
import {createSelector, select, Store} from '@ngrx/store';
import {State} from '../../../../reducers';
import {ActionButton, ActionMenuComponent} from '../../../controls/action-menu/action-menu.component';
import * as _ from 'lodash';
import {RefdataService} from '../../../../core/refdata.service';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent implements OnInit {
  customFieldColDef: Array<ColumnDefs>;
  clientId: number;
  customFields = new BehaviorSubject<Array<CustomFieldsSettings>>([]);
  customFieldsExpansionSettings: ExpansionSettings;
  private editCustomFieldsSettingForm: FormGroup;

  customFieldPageSettings = new PageSettings(() => {
    this.updateCustomFieldsTable();
  });

  constructor(private adminService: AdministratorService, private CFR: ComponentFactoryResolver, private validator: ReasonForRefundValidatorService, private store: Store<State>, private refdataService: RefdataService) {
    this.setupCustomFieldColDef();
    this.customFieldsExpansionSettings = this.setupCustomFieldsExpansionSettings();
  }

  ngOnInit() {
    forkJoin({
      clientSettings: this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings))),
      languages:  this.refdataService.getLocales()
    }).subscribe(data => {
      this.clientId = data.clientSettings.clientId;
      this.updateTables();
    }, error => {
      console.error(error);
    })
  }

  updateCustomFieldsTable() {
    this.adminService.getCustomFields(this.clientId, this.customFieldPageSettings.currentPage, this.customFieldPageSettings.pageSize).subscribe(value => {
      this.customFieldPageSettings.setTotalRecords(value.totalElements);
      this.customFields.next(value.list);
    });
  }

  setupCustomFieldsExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve = this.CFR.resolveComponentFactory(CustomFieldsSettingComponent);
        // Data table returns its own view container, so it can manage the removing of its instance on collapse of the grid
        // to prevent memory leaks.
        let component = viewContainerRef.createComponent(componentResolve);
        component.instance.customFieldsSettings = rowData;
       // this.editRefundSettingForm = this.validator.reasonForRefundSettingValidator();
       // component.instance.formName = this.editRefundSettingForm;
        // component.instance.editMode = true;
        // component.instance.closeOverlay.asObservable().subscribe(value => this.customFieldsExpansionSettings.CollapseGrid(row));
        // component.instance.updateCustomFieldsSetting.asObservable().subscribe(value => this.updateCustomFieldsSetting(value));
        resolve(component);
      });
    });
  }

  updateTables() {
    this.updateCustomFieldsTable();
  }

  setupCustomFieldColDef() {
    this.customFieldColDef = [
      {key: "display", className: "data_grid_left_align", header: "Displayed"},
      {key: "fieldName", className: "data_grid_center_align", header: "FieldName"},
      {key: "description", className: "data_grid_center_align", header: "Description"},
      {key: "fieldType", className: "data_grid_center_align", header: "FieldType"},
      {key: "mandatory", className: "data_grid_center_align", header: "Mandatory"},
     ];
  }


  /*private updateCustomFieldsSetting(request: CustomFieldsSettings) {
    if (this.editCustomFieldsSettingForm.valid) {
      request.clientId = this.clientId;
      Object.assign(request, this.editCustomFieldsSettingForm.value);
      this.adminService.updateRfRForClient(request).subscribe(value => {
        this.updateTables();
        this.reasonCodeExpansionSettings.CollapseGrid({propertyName: "clientId", id: value.clientId});
      })
    } else {
      this.editRefundSettingForm.markAllAsTouched();
    }
  }*/

}
