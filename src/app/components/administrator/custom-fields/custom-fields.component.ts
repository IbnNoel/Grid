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
 // languagesList: Array<String>;
  reasonCodeColDef: Array<ColumnDefs>;
  reasonCodeExpansionSettings: ExpansionSettings;
  private editRefundSettingForm: FormGroup;
  clientId: number;
  isStandardRfREnabled: boolean;
  // customRfR: AddCustomRfR;
  errorMessage: string;
  reasonCodes = new BehaviorSubject<Array<CustomFieldsSettings>>([]);

  reasonCodePageSettings = new PageSettings(() => {
    this.updateReasonCodeTable();
  });

  constructor(private adminService: AdministratorService, private CFR: ComponentFactoryResolver, private validator: ReasonForRefundValidatorService, private store: Store<State>, private refdataService: RefdataService) {
    this.reasonCodeExpansionSettings = this.setupReasonCodeExpansionSettings();
    // this.customRfR = {clientId: this.clientId};
    this.setupReasonCodeColDef();
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
      this.languages = data.languages.map(l=>l.locale);
      this.isStandardRfREnabled = !data.clientSettings.customRfr;
      this.clientId = data.clientSettings.clientId;
      this.customRfR = {clientId: this.clientId};
      this.updateTables();
    }, error => {
      console.error(error);
    })
  }

  updateReasonCodeTable() {
    this.adminService.getCustomFields(this.clientId).subscribe(value => {
      this.reasonCodes.next(value.list);
    });
  }

  setupReasonCodeExpansionSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve = this.CFR.resolveComponentFactory(RefundReasonSettingComponent);
        // Data table returns its own view container, so it can manage the removing of its instance on collapse of the grid
        // to prevent memory leaks.
        let component = viewContainerRef.createComponent(componentResolve);
        component.instance.customRfRSetting = rowData;
        this.editRefundSettingForm = this.validator.reasonForRefundSettingValidator();
        component.instance.formName = this.editRefundSettingForm;
        component.instance.editMode = true;
        component.instance.closeOverlay.asObservable().subscribe(value => this.reasonCodeExpansionSettings.CollapseGrid(row));
        component.instance.updateRefundSetting.asObservable().subscribe(value => this.updateRefundSetting(value));
        resolve(component);
      });
    });
  }

  private updateRefundSetting(request: CustomFieldsSettings) {
    if (this.editRefundSettingForm.valid) {
      request.clientId = this.clientId;
      Object.assign(request, this.editRefundSettingForm.value);
      this.adminService.updateRfRForClient(request).subscribe(value => {
        this.updateTables();
        this.reasonCodeExpansionSettings.CollapseGrid({propertyName: "clientId", id: value.clientId});
      })
    } else {
      this.editRefundSettingForm.markAllAsTouched();
    }
  }

  updateTables() {
    this.updateReasonCodeTable();
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: "displayed", className: "data_grid_left_align", header: "Displayed"},
      {key: "fieldName", className: "data_grid_center_align", header: "FieldName"},
      {key: "description", className: "data_grid_center_align", header: "Description"},
      {key: "fieldType", className: "data_grid_center_align", header: "FieldType"},
      {key: "mandatory", className: "data_grid_center_align", header: "Mandatory"},
     /* {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: "data_grid_center_align"
      }*/];
  }

  /*generateActionMenuForRfr(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let editButton = new ActionButton();
    editButton.label = "edit";
    editButton.data = rowData;
    editButton.action = (data) => {
      this.reasonCodeExpansionSettings.ExpandGrid(row);
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteRfR(data);
    });
    let addLanguage = new ActionButton();
    addLanguage.label = "addLanguage";
    addLanguage.data = rowData;
    addLanguage.action = (data => {
      this.createAddLanguageOverlay(data);
    });
    menu.buttons.push(editButton);
    if (!this.isStandardRfREnabled) {
      menu.buttons.push(deleteButton, addLanguage);
    }
    return menu;
  };

  createAddLanguageOverlay(data: CustomRfRSettings) {
    this.createAddLanguageForm();
    this.errorMessage = null;
    let existingLocale = this.reasonCodesI18N.getValue().filter(i18n => i18n.reasonCode == data.reasonCode).map(value => value.locale);
    this.languagesList = _.filter(this.languages, l => {
      return !(existingLocale.indexOf(l) > -1);
    });
    this.customRfR = {clientId: this.clientId, reasonCode: data.reasonCode};
    this.customRfR.reasonForRefundList = [];
    this.customRfR.reasonForRefundList.push({locale: this.languagesList[0]});
    this.generateActionButtonForAddCustomRfR(this.languagesList, false);
    $("#addNewLanguageOverlay").modal({show: true, backdrop: false});
  }

  createAddLanguageForm() {
    this.addLanguageForm = this.fb.group({
      i18n: new FormArray([this.validator.reasonForRefundI18NValidator(false)])
    });
    this.i18nArray = this.addLanguageForm.get("i18n") as FormArray;
  }
*/

}
