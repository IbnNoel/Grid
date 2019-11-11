import {Component, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {AdministratorService, ClientSettings, CustomRfRI18N, CustomRfRSettings} from "../../../../core/administrator.service";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AddCustomRefundReasonComponent} from "../custom/add-custom-refund-reason/add-custom-refund-reason.component";
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {take} from "rxjs/operators";
import {AddCustomRfRSettingsAction} from "../../../../actions/refundAction";
import {ColumnDefs} from "../../../controls/data-table/classes/Columns";
import {BehaviorSubject} from "rxjs";
import {ActionButton, ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {AddLanguageCustomRfrChildComponent} from "../custom/add-language-custom-rfr-child/add-language-custom-rfr-child.component";


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {


  overlayRef: OverlayRef;
  reasonCodeColDef: Array<ColumnDefs>;
  reasonCodeI18NColDef: Array<ColumnDefs>;
  clientSettings: ClientSettings;
  reasonCodes = new BehaviorSubject<Array<CustomRfRSettings>>([]);
  reasonCodesI18N = new BehaviorSubject<Array<CustomRfRI18N>>([]);

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    this.setupReasonCodeColDef();
    this.setupReasonCodeI18NColDef();
  }

//TODO remove it
  mockCustomRfRSettings: Array<CustomRfRSettings> = [];
  mockCustomRfRI18NSettings: Array<CustomRfRI18N> = [{
    locale: "en",
    reasonForRefund: "Visa Rejected",
    hint: "Upload rejection letter"
  }, {
    locale: "hi",
    reasonForRefund: "Visa Rejected",
    hint: "Upload rejection letter"
  }];

  ngOnInit() {
    this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.adminSettings,
          (adminSettings) => adminSettings.clientSettings)))
      .subscribe((response) => {
        this.clientSettings = Object.assign({}, response);
      });
    this.reasonCodes.next(this.mockCustomRfRSettings);
    this.reasonCodesI18N.next(this.mockCustomRfRI18NSettings);
  }

  generateActionMenu(data) {
    let menu = new ActionMenuComponent();
    let actionMenu = [];
    let editButton = new ActionButton();
    editButton.label = "edit";
    editButton.data = data;
    editButton.action = (data) => {
      console.log("calling it");
      console.log(JSON.stringify(data));
      return this.createAddLanguageOverlay(data);
    };
    actionMenu.push(editButton);
    menu.buttons.push(editButton);
    return menu;
  };

  createAddLanguageOverlay(data) {
    let config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
      .global().centerHorizontally().centerVertically();

    config.hasBackdrop = true;

    this.overlayRef = this.overlay.create(config);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
    });
    const portal = new ComponentPortal(AddLanguageCustomRfrChildComponent, this.viewContainerRef);
    const compRef: ComponentRef<AddLanguageCustomRfrChildComponent> = this.overlayRef.attach(portal);
    let instance = compRef.instance;
    instance.customRfRI18N = data;
    instance.closeOverlay.asObservable().subscribe(value => this.closeOverlay());
    instance.updateI18N.asObservable().subscribe(value => ()=>{
      return console.log(JSON.stringify(instance.customRfRI18N));
    });

    instance.editMode = true;
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: "reasonCode", className: "data_grid_left_align"},
      {key: "sortOrder", className: "data_grid_center_align"},
      {key: "reasonForRefund", className: "data_grid_center_align"},
      {key: "noOfDocs", className: "data_grid_center_align"},
      {
        cellElement: (data) => {
          return this.generateActionMenu(data);
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
        cellElement: (cellData, rowData) => {
          return this.generateActionMenu(rowData);
        }, className: "data_grid_center_align"
      }];
  }

  addCustomRfR() {
    let config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
      .global().centerHorizontally().centerVertically();

    config.hasBackdrop = true;

    this.overlayRef = this.overlay.create(config);
    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef.dispose();
    });
    const portal = new ComponentPortal(AddCustomRefundReasonComponent, this.viewContainerRef);
    const compRef: ComponentRef<AddCustomRefundReasonComponent> = this.overlayRef.attach(portal);
    const instance = compRef.instance;
    instance.new = true;
    instance.clientId = this.clientSettings.clientId;
    instance.closeOverlay.asObservable().subscribe(() => this.closeOverlay());
    instance.addCustomRfRSettings.asObservable().subscribe((customRfRSetting: CustomRfRSettings) => this.saveCustomRfRSettings(customRfRSetting));
  }

  closeOverlay() {
    this.overlayRef.dispose();
  }

  saveCustomRfRSettings(customRfRSetting) {
    console.log(JSON.stringify(customRfRSetting));
    this.adminService.addCustomRfR(customRfRSetting).subscribe(response => {
      if (response.success) {
        this.store.dispatch(new AddCustomRfRSettingsAction(response.data));
        this.overlayRef.dispose();
      }
    })
  }

  switchToStandard() {

  }

  switchToCustom() {

  }
}
