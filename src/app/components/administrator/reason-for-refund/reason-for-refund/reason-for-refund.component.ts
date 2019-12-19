import {Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {AddCustomRfR, AdministratorService, ClientSettings, CustomRfRI18N, CustomRfRSettings} from '../../../../core/administrator.service';
import {createSelector, select, Store} from '@ngrx/store';
import {State} from '../../../../reducers';
import {ActivatedRoute, Router} from '@angular/router';
import {take} from 'rxjs/operators';
import {ColumnDefs} from '../../../controls/data-table/classes/Columns';
import {BehaviorSubject, forkJoin, Observable} from 'rxjs';
import {ActionButton, ActionMenuComponent} from '../../../controls/action-menu/action-menu.component';
import {PageSettings} from '../../../controls/data-table/classes/Paging';
import {EditRfRI18NComponent} from '../custom/edit-rf-ri18-n/edit-rf-ri18-n.component';
import {RefundReasonSettingComponent} from '../refund-reason-setting/refund-reason-setting.component';
import * as _ from 'lodash';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ReasonForRefundValidatorService} from '../../../../validator/administrator/reason-for-refund/reason-for-refund-validator.service';
import {ConfirmationAction, ConfirmationBoxComponent} from '../../../controls/confirmation-box/confirmation-box.component';
import {ExpansionSettings} from 'src/app/components/controls/data-table/classes/Expansion';
import {RefdataService} from '../../../../core/refdata.service';
import {SaveClientSettingsAction} from '../../../../actions/refundAction';


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {
  @ViewChild("confirmationBox", {static: true}) confirmationBox: ConfirmationBoxComponent = new ConfirmationBoxComponent();
  languages: Array<string>;
  languagesList: Array<string>;
  customRfR: AddCustomRfR;
  reasonCodeColDef: Array<ColumnDefs>;
  reasonCodeI18NColDef: Array<ColumnDefs>;
  clientId: number;
  isStandardRfREnabled: boolean;
  reasonCodes = new BehaviorSubject<Array<CustomRfRSettings>>([]);

  reasonCodesI18N = new BehaviorSubject<Array<CustomRfRI18N>>([]);
  reasonCodePageSettings = new PageSettings(() => {
    this.updateReasonCodeTable();
  });
  reasonCodeI18NPageSettings = new PageSettings(() => {
    this.updateReasonCodeI18NTable();
  });
  reasonCodeExpansionSettings: ExpansionSettings;
  reasonCodeI18ExpansionSettings: ExpansionSettings;
  addCustomRfRForm: FormGroup;
  private i18nArray: FormArray;
  addLanguageForm: FormGroup;
  editRefundSettingForm: FormGroup;
  editRefundI18nForm: FormGroup;
  errorMessage: string;
  clientSettings: ClientSettings;

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private viewContainerRef: ViewContainerRef, private CFR: ComponentFactoryResolver, private validator: ReasonForRefundValidatorService, private fb: FormBuilder, private refdataService: RefdataService) {
    this.reasonCodeExpansionSettings = this.setupReasonCodeExpansionSettings();
    this.reasonCodeI18ExpansionSettings = this.setupI18ReasonCodeExpSettings();
    this.setupReasonCodeColDef();
    this.setupReasonCodeI18NColDef();
    this.createAddCustomRfRForm();
    this.createAddLanguageForm();
    this.customRfR = {clientId: this.clientId};
  }
  actionButtons: Array<ActionButton>;
  confirmationAction: ConfirmationAction;

  createAddCustomRfRForm() {
    this.addCustomRfRForm = this.fb.group({
      refundSetting: this.validator.reasonForRefundSettingValidator(),
      i18n: new FormArray([this.validator.reasonForRefundI18NValidator(true)])
    });
    this.i18nArray = this.addCustomRfRForm.get('i18n') as FormArray;
  }

  createAddLanguageForm() {
    this.addLanguageForm = this.fb.group({
      i18n: new FormArray([this.validator.reasonForRefundI18NValidator(false)])
    });
    this.i18nArray = this.addLanguageForm.get('i18n') as FormArray;
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
      this.customRfR = {clientId: this.clientId};
      this.clientSettings = _.cloneDeep(data.clientSettings);
      this.updateTables();
    }, error => {
      console.error(error);
    });
  }

  actionButtons: Array<ActionButton>;
  confirmationAction: ConfirmationAction;


  generateActionButtonForAddCustomRfR(languages, disable) {
    this.actionButtons = [];
    languages.forEach(value => {
      let button = new ActionButton();
      button.data = value;
      button.label = value;
      button.action = (data => this.addLanguage(data, disable));
      this.actionButtons.push(button);
    });
    return this.actionButtons;
  }

  generateActionMenuForRfRI18N(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let editButton = new ActionButton();
    editButton.label = "edit";
    editButton.data = rowData;
    editButton.action = (data) => {
      this.reasonCodeI18ExpansionSettings.ExpandGrid(row);
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteI18N(data);
    });
    menu.buttons.push(editButton);
    if (!this.refdataService.isDefaultLanguage(rowData.locale) && !this.isStandardRfREnabled) {
      menu.buttons.push(deleteButton);
    }
    return menu;
  }
  generateActionMenuForRfr(cellData, rowData, row) {
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
    $('#addNewLanguageOverlay').modal({show: true, backdrop: false});
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: 'reasonCode', className: 'data_grid_left_align', header: 'reasonCode'},
      {key: 'sortOrder', className: 'data_grid_center_align', header: 'sortOrder'},
      {key: 'reasonForRefund', className: 'data_grid_center_align', header: 'reasonForRefund'},
      {key: 'numOfDocument', className: 'data_grid_center_align', header: 'numOfDocument'},
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: 'data_grid_center_align'
      }];
  }

  setupReasonCodeI18NColDef() {
    this.reasonCodeI18NColDef = [
      {key: 'reasonCode', className: 'data_grid_left_align', header: 'reasonCode'},
      {key: 'locale', className: 'data_grid_center_align', header: 'language', translate: true},
      {key: 'sortOrder', className: 'data_grid_center_align', header: 'sortOrder'},
      {key: 'reasonForRefund', className: 'data_grid_center_align', header: 'reasonForRefund'},
      {key: 'hint', className: 'data_grid_center_align', header: 'hint'},
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfRI18N(cellData, rowData, row);
        }, className: 'data_grid_center_align'
      }];
  }

  addCustomRfR() {
    this.createAddCustomRfRForm();
    this.errorMessage = null;
    this.customRfR.reasonForRefundList = [];
    this.customRfR.reasonForRefundList.push({locale: this.refdataService.getDefaultLanguage()});
    this.generateActionButtonForAddCustomRfR(this.languages, true);
    $('#addCustomRfROverlay').modal({show: true, backdrop: false});
  }

  close(overlay) {
    $('#' + overlay).modal('hide');
  }

  saveCustomRfRSettings() {
    if (this.addCustomRfRForm.valid) {
      Object.assign(this.customRfR, this.addCustomRfRForm.value.refundSetting);
      Object.assign(this.customRfR.reasonForRefundList, this.addCustomRfRForm.getRawValue().i18n);
      this.adminService.addCustomRfR(this.customRfR).subscribe(response => {
        this.updateTables();
        this.closeAddCustomOverlay('addCustomRfROverlay');
      }, error => {
        this.errorMessage = error.code;
      });
    } else {
      this.addCustomRfRForm.markAllAsTouched();
    }
  }

  toggleRfR() {
    this.adminService.toggleRfR(this.clientId).subscribe(value => {
      this.isStandardRfREnabled = !value.isCustomRfr;
      this.clientSettings.customRfr = value.isCustomRfr;
      this.store.dispatch(new SaveClientSettingsAction(Object.assign({}, this.clientSettings, {
        customRfr: value.isCustomRfr
      })));
      this.updateTables();
    });
  }

  updateReasonCodeTable() {
    this.adminService.getRFR(this.clientId, this.reasonCodePageSettings.currentPage, this.reasonCodePageSettings.pageSize).subscribe(value => {
      this.reasonCodePageSettings.setTotalRecords(value.totalElements);
      this.reasonCodes.next(value.list);
    });
  }

  updateReasonCodeI18NTable() {
    this.adminService.getRFRI18N(this.clientId, this.reasonCodeI18NPageSettings.currentPage, this.reasonCodeI18NPageSettings.pageSize).subscribe(value => {
      this.reasonCodeI18NPageSettings.setTotalRecords(value.totalElements);
      this.reasonCodesI18N.next(value.list);
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

  setupI18ReasonCodeExpSettings() {
    return new ExpansionSettings(false, (viewContainerRef, rowData, row) => {
      return new Promise<any>((resolve) => {
        const componentResolve = this.CFR.resolveComponentFactory(EditRfRI18NComponent);
        let component = this.viewContainerRef.createComponent(componentResolve);
        this.editRefundI18nForm = this.validator.reasonForRefundI18NValidator();
        component.instance.i18nForm = this.editRefundI18nForm;
        component.instance.data = rowData;
        component.instance.isStandardRfREnabled = this.isStandardRfREnabled;
        component.instance.resetToStandard.asObservable().subscribe(value => this.resetToStandard(value));
        component.instance.updateRfRI18N.asObservable().subscribe(value => this.updateRfRI18N(value));
        component.instance.closeOverlay.asObservable().subscribe(value => this.reasonCodeI18ExpansionSettings.CollapseGrid(row));
        resolve(component);
      });
    });
  }

  resetToStandard(data: CustomRfRI18N) {
    data.clientId = this.clientId;
    this.adminService.resetToStandard(data).subscribe(value => {
      this.updateTables();
    });
  }

  updateTables() {
    this.updateReasonCodeTable();
    this.updateReasonCodeI18NTable();
  }

  private updateRfRI18N(data: CustomRfRI18N) {
    if (this.editRefundI18nForm.valid) {
      Object.assign(data, this.editRefundI18nForm.value);
      data.clientId = this.clientId;
      data.sortOrder = null;
      this.adminService.updateRfRI18NForClient(data).subscribe(value => {
        this.reasonCodeI18ExpansionSettings.CollapseGrid({propertyName: 'clientId', id: value.clientId});
        this.updateTables();

      });
    } else {
      this.editRefundI18nForm.markAllAsTouched();
    }

  }

  private deleteI18N(data: CustomRfRI18N) {
    let deleteI18NRfR = {locale: data.locale, reasonCode: data.reasonCode, clientId: this.clientId};
    let action = new ConfirmationAction();
    action.action = () => {
      this.adminService.deleteRfRI18N(deleteI18NRfR).subscribe(value => {
        this.updateTables();
        this.confirmationBox.close();
      });
    };
    this.confirmationAction = action;
    this.confirmationBox.show();
  }

  addNewLanguages() {
    if (this.addLanguageForm.valid) {
      Object.assign(this.customRfR.reasonForRefundList, this.addLanguageForm.value.i18n);
      this.adminService.addLanguages(this.customRfR).subscribe(value => {
        this.updateTables();
        this.closeAddCustomOverlay('addNewLanguageOverlay');
      });
    } else {
      this.addLanguageForm.markAllAsTouched();
    }


  }

  private updateRefundSetting(request: CustomRfRSettings) {
    if (this.editRefundSettingForm.valid) {
      request.clientId = this.clientId;
      Object.assign(request, this.editRefundSettingForm.value);
      this.adminService.updateRfRForClient(request).subscribe(value => {
        this.updateTables();
        this.reasonCodeExpansionSettings.CollapseGrid({propertyName: 'clientId', id: value.clientId});
      });
    } else {
      this.editRefundSettingForm.markAllAsTouched();
    }
  }

  private deleteRfR(data: CustomRfRSettings) {
    data.clientId = this.clientId;
    this.confirmationBox = new ConfirmationBoxComponent();
    let action = new ConfirmationAction();
    action.action = () => {
      this.adminService.deleteRfR(data).subscribe(value => {
        this.updateTables();
        this.confirmationBox.close();
      });
    };
    this.confirmationAction = action;
    this.confirmationBox.show();
  }

  private addLanguage(locale: string, disable: boolean) {
    if (!_.find(this.customRfR.reasonForRefundList, {locale: locale})) {
      this.customRfR.reasonForRefundList.push({locale: locale});
      this.i18nArray.push(this.validator.reasonForRefundI18NValidator(disable));
    }

  }

  i18nForm(i18nIndex: number, addRfR: boolean) {
    return this.i18nArray.controls[i18nIndex];
  }

  closeLanguageOverlay(name: string) {
    this.close(name);
  }

  closeAddCustomOverlay(name: string) {
    this.close(name);
  }
}
