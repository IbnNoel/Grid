import {Component, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {AddCustomRfR, AdministratorService, ClientSettings, CustomRfRI18N, CustomRfRSettings} from "../../../../core/administrator.service";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AddCustomRefundReasonComponent} from "../custom/add-custom-refund-reason/add-custom-refund-reason.component";
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {take} from "rxjs/operators";
import {ColumnDefs} from "../../../controls/data-table/classes/Columns";
import {BehaviorSubject, forkJoin, Observable} from "rxjs";
import {ActionButton, ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {PageSettings} from "../../../controls/data-table/classes/Paging";
import {EditRfRI18NComponent} from "../custom/edit-rf-ri18-n/edit-rf-ri18-n.component";


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {


  overlayRef: OverlayRef;
  reasonCodeColDef: Array<ColumnDefs>;
  reasonCodeI18NColDef: Array<ColumnDefs>;
  clientSettings: Observable<ClientSettings>;
  clientId: number;
  isStandardRfREnabled: boolean;
  reasonCodes = new BehaviorSubject<Array<CustomRfRSettings>>([]);
  reasonCodesI18N = new BehaviorSubject<Array<CustomRfRI18N>>([]);
  reasonCodePageSettings = new PageSettings(() => {
    //this.onSearch();
  });
  reasonCodeI18NPageSettings = new PageSettings(() => {
    //this.onSearch();
  });

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    this.setupReasonCodeColDef();
    this.setupReasonCodeI18NColDef();
  }

  ngOnInit() {
    forkJoin({
      clientSettings: this.store.pipe(
        take(1),
        select(
          createSelector((state) => state.adminSettings,
            (adminSettings) => adminSettings.clientSettings)))
    }).subscribe(data => {
      this.isStandardRfREnabled = data.clientSettings.standardRFREnabled;
      this.clientId = data.clientSettings.clientId;
      this.updateTables();
    }, error => {
      console.error(error);
    })
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
    const portal = new ComponentPortal(EditRfRI18NComponent, this.viewContainerRef);
    const compRef: ComponentRef<EditRfRI18NComponent> = this.overlayRef.attach(portal);
    let instance = compRef.instance;
    instance.data = data;
    instance.closeOverlay.asObservable().subscribe(value => this.closeOverlay());
    instance.updateRfRI18N.asObservable().subscribe(value => this.updateRfRI18N(value));
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: "reasonCode", className: "data_grid_left_align"},
      {key: "sortOrder", className: "data_grid_center_align"},
      {key: "reasonForRefund", className: "data_grid_center_align"},
      {key: "numOfDocument", className: "data_grid_center_align"},
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
    instance.closeOverlay.asObservable().subscribe(() => this.closeOverlay());
    instance.addCustomRfRSettings.asObservable().subscribe((customRfRSetting: AddCustomRfR) => this.saveCustomRfRSettings(customRfRSetting));
  }

  closeOverlay() {
    this.overlayRef.dispose();
  }

  saveCustomRfRSettings(customRfRSetting) {
    console.log(JSON.stringify(customRfRSetting));
    this.adminService.addCustomRfR(customRfRSetting).subscribe(response => {
      if (response.success) {
        this.updateTables();
        this.overlayRef.dispose();
      }
    })
  }

  toggleRfR() {
    this.adminService.toggleRfR(this.clientId).subscribe(value => {
      this.isStandardRfREnabled = value.data.isStandardRFREnabled;
    });
  }

  updateReasonCodeTable() {
    this.adminService.getRFR(this.clientId, this.reasonCodePageSettings.currentPage, this.reasonCodePageSettings.pageSize).subscribe(value => {
      this.reasonCodes.next(value.list);
    });
  }
  updateReasonCodeI18NTable(){
    this.adminService.getRFRI18N(this.clientId, this.reasonCodeI18NPageSettings.currentPage, this.reasonCodeI18NPageSettings.pageSize).subscribe(value => {
      this.reasonCodesI18N.next(value.list);
    });
  }
  updateTables(){
    this.updateReasonCodeTable();
    this.updateReasonCodeI18NTable();
  }

  private updateRfRI18N(data: CustomRfRI18N) {
    data.clientId = this.clientId;
    data.sortOrder = null;
    this.adminService.updateRfRI18NForClient(data).subscribe(value => {
      this.updateTables();
      this.overlayRef.dispose();
    })
  }
}
