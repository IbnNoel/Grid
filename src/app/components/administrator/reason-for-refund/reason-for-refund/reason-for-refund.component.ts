import {Component, ComponentFactoryResolver, OnInit, ViewContainerRef} from '@angular/core';
import {AddCustomRfR, AdministratorService, ClientSettings, CustomRfRI18N, CustomRfRSettings} from "../../../../core/administrator.service";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {take} from "rxjs/operators";
import {ColumnDefs} from "../../../controls/data-table/classes/Columns";
import {BehaviorSubject, forkJoin, Observable} from "rxjs";
import {ActionButton, ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {PageSettings} from "../../../controls/data-table/classes/Paging";
import {EditRfRI18NComponent} from "../custom/edit-rf-ri18-n/edit-rf-ri18-n.component";
import {RefundReasonSettingComponent} from "../refund-reason-setting/refund-reason-setting.component";
import * as _ from 'lodash';
import {FormGroup} from "@angular/forms";


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {

  languages: Array<String>;
  languagesList: Array<String>;
  customRfR: AddCustomRfR;
  reasonCodeColDef: Array<ColumnDefs>;
  reasonCodeI18NColDef: Array<ColumnDefs>;
  clientSettings: Observable<ClientSettings>;
  clientId: number;
  isStandardRfREnabled: boolean;
  reasonCodes = new BehaviorSubject<Array<CustomRfRSettings>>([]);
  expandReasonCodeEvent = new BehaviorSubject<any>({});
  collapseReasonCodeEvent = new BehaviorSubject<any>({});
  expandReasonCodeI18NEvent = new BehaviorSubject<any>({});
  collapseReasonCodeI18NEvent = new BehaviorSubject<any>({});
  reasonCodesI18N = new BehaviorSubject<Array<CustomRfRI18N>>([]);
  reasonCodePageSettings = new PageSettings(() => {
    this.updateReasonCodeTable();
  });
  reasonCodeI18NPageSettings = new PageSettings(() => {
    this.updateReasonCodeI18NTable();
  });
  private addCustomRfRForm: FormGroup;

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private viewContainerRef: ViewContainerRef, private CFR: ComponentFactoryResolver) {
    this.setupReasonCodeColDef();
    this.setupReasonCodeI18NColDef();
  }

  ngOnInit() {
    forkJoin({
      clientSettings: this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings))),
      languages: this.adminService.getLanguageList()
    }).subscribe(data => {
      this.languages = data.languages;
      this.isStandardRfREnabled = data.clientSettings.standardRFREnabled;
      this.clientId = data.clientSettings.clientId;
      this.updateTables();
    }, error => {
      console.error(error);
    })
  }

  actionButtons: Array<ActionButton>

  generateActionButtonForAddCustomRfR(languages) {
    this.actionButtons = [];
    languages.forEach(value => {
      let button = new ActionButton();
      button.data = value;
      button.label = value;
      button.action = (data => this.addLanguage(data));
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
      this.expandReasonCodeI18NEvent.next({row: row, data: data});
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteI18N(data);
    });
    menu.buttons.push(editButton);
    if (!this.adminService.isDefaultLanguage(rowData.locale)) {
      menu.buttons.push(deleteButton);
    }
    return menu;
  };

  generateActionMenuForRfr(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let editButton = new ActionButton();
    editButton.label = "edit";
    editButton.data = rowData;
    editButton.action = (data) => {
      this.expandReasonCodeEvent.next({row: row, data: data});
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
    menu.buttons.push(editButton, deleteButton, addLanguage);
    return menu;
  };

  createAddLanguageOverlay(data: CustomRfRSettings) {
    let existingLocale = this.reasonCodesI18N.getValue().filter(i18n => i18n.reasonCode == data.reasonCode).map(value => value.locale);
    this.languagesList = _.filter(this.languages, l => {
      return !existingLocale.includes(l)
    });
    this.customRfR = {clientId: this.clientId, reasonCode: data.reasonCode};
    this.customRfR.reasonForRefundList = [];

    this.customRfR.reasonForRefundList.push({locale: this.languagesList[0]});
    this.generateActionButtonForAddCustomRfR(this.languagesList);
    $("#addNewLanguageOverlay").modal({show: true, backdrop: true});
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: "reasonCode", className: "data_grid_left_align"},
      {key: "sortOrder", className: "data_grid_center_align"},
      {key: "reasonForRefund", className: "data_grid_center_align"},
      {key: "numOfDocument", className: "data_grid_center_align"},
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfr(cellData, rowData, row);
        }, className: "data_grid_center_align"
      }];
  }

  setupReasonCodeI18NColDef() {
    this.reasonCodeI18NColDef = [
      {key: "reasonCode", className: "data_grid_left_align"},
      {key: "locale", className: "data_grid_center_align"},
      {key: "sortOrder", className: "data_grid_center_align"},
      {key: "reasonForRefund", className: "data_grid_center_align"},
      {key: "hint", className: "data_grid_center_align"},
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenuForRfRI18N(cellData, rowData, row);
        }, className: "data_grid_center_align"
      }];
  }

  addCustomRfR() {
    this.customRfR = {clientId: this.clientId};
    this.customRfR.reasonForRefundList = [];
    this.customRfR.reasonForRefundList.push({locale: this.adminService.getDefaultLanguage()});
    this.generateActionButtonForAddCustomRfR(this.languages);
    $("#addCustomRfROverlay").modal({show: true, backdrop: true});
  }

  close(overlay) {
    $("#" + overlay).modal("hide");
  }

  saveCustomRfRSettings() {
    this.adminService.addCustomRfR(this.customRfR).subscribe(response => {
      this.updateTables();
      this.close("addCustomRfROverlay");
    })
  }

  toggleRfR() {
    this.adminService.toggleRfR(this.clientId).subscribe(value => {
      this.isStandardRfREnabled = value.isStandardRFREnabled;
      this.updateTables();
    });
  }

  updateReasonCodeTable() {
    this.adminService.getRFR(this.clientId, this.reasonCodePageSettings.currentPage, this.reasonCodePageSettings.pageSize).subscribe(value => {
      this.reasonCodes.next(value.list);
    });
  }

  updateReasonCodeI18NTable() {
    this.adminService.getRFRI18N(this.clientId, this.reasonCodeI18NPageSettings.currentPage, this.reasonCodeI18NPageSettings.pageSize).subscribe(value => {
      this.reasonCodesI18N.next(value.list);
    });
  }

  expandReasonCodeI18N() {
    return (data) => {
      const componentResolve = this.CFR.resolveComponentFactory(EditRfRI18NComponent);
      let component = this.viewContainerRef.createComponent(componentResolve);
      component.instance.data = data;
      component.instance.updateRfRI18N.asObservable().subscribe(value => this.updateRfRI18N(value));
      component.instance.closeOverlay.asObservable().subscribe(value => this.collapseReasonCodeI18NEvent.next({value}));
      return component.location.nativeElement;
    };
  }

  updateTables() {
    this.updateReasonCodeTable();
    this.updateReasonCodeI18NTable();
  }

  private updateRfRI18N(data: CustomRfRI18N) {
    data.clientId = this.clientId;
    data.sortOrder = null;
    this.adminService.updateRfRI18NForClient(data).subscribe(value => {
      this.collapseReasonCodeI18NEvent.next({});
      this.updateTables();

    })
  }

  private deleteI18N(data: CustomRfRI18N) {
    let deleteI18NRfR = {locale: data.locale, reasonCode: data.reasonCode, clientId: this.clientId}
    this.adminService.deleteRfRI18N(deleteI18NRfR).subscribe(value => {
      this.updateTables();
    });
  }

  expandReasonCode() {
    return (data) => {
      const componentResolve = this.CFR.resolveComponentFactory(RefundReasonSettingComponent);
      let component = this.viewContainerRef.createComponent(componentResolve);
      component.instance.customRfRSetting = data;
      component.instance.editMode = true;
      component.instance.closeOverlay.asObservable().subscribe(value => this.collapseReasonCodeEvent.next({}));
      component.instance.updateRefundSetting.asObservable().subscribe(value => this.updateRefundSetting(value));
      return component.location.nativeElement;
    };
  }

  private addNewLanguages() {
    this.adminService.addLanguages(this.customRfR).subscribe(value => {
      this.updateTables();
      this.close("addNewLanguageOverlay");
    });

  }

  private updateRefundSetting(request: CustomRfRSettings) {
    request.clientId = this.clientId;
    this.adminService.updateRfRForClient(request).subscribe(value => {
      this.updateTables();
      this.collapseReasonCodeEvent.next({});
    })
  }

  private deleteRfR(data: CustomRfRSettings) {
    data.clientId = this.clientId;
    this.adminService.deleteRfR(data).subscribe(value => {
      this.updateTables();
    })
  }

  private addLanguage(locale: String) {
    if (!_.find(this.customRfR.reasonForRefundList, {locale: locale})) {
      this.customRfR.reasonForRefundList.push({locale: locale});
    }

  }
}
