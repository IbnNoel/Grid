import {Component, ComponentFactoryResolver, ComponentRef, EventEmitter, OnInit, ViewContainerRef} from '@angular/core';
import {AddCustomRfR, AdministratorService, ClientSettings, CustomRfRI18N, CustomRfRSettings, DeleteI18NRfR} from "../../../../core/administrator.service";
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

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private overlay: Overlay, private viewContainerRef: ViewContainerRef, private CFR: ComponentFactoryResolver) {
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

  generateActionMenu(cellData, rowData, row) {
    let menu = new ActionMenuComponent();
    let editButton = new ActionButton();
    editButton.label = "edit";
    editButton.data = rowData;
    editButton.action = (data) => {
      this.tes.emit({row: row, data: data});
      this.expandReasonCodeI18NEvent.next({row: row, data: data});
    };
    let deleteButton = new ActionButton();
    deleteButton.label = "delete";
    deleteButton.data = rowData;
    deleteButton.action = (data => {
      this.deleteI18N(data);
    });
    menu.buttons.push(editButton, deleteButton);
    return menu;
  };

  createAddLanguageOverlay(data) {
    /* let config = new OverlayConfig();

     config.positionStrategy = this.overlay.position()
       .global().centerHorizontally().centerVertically();

     config.hasBackdrop = true;

     this.overlayRef = this.overlay.create(config);
     this.overlayRef.backdropClick().subscribe(() => {
       this.overlayRef.dispose();
     });*/
    const componentRef = this.CFR.resolveComponentFactory(EditRfRI18NComponent);
    let instance1 = this.viewContainerRef.createComponent(componentRef);
    // const portal = new ComponentPortal(EditRfRI18NComponent, this.viewContainerRef);
    // const compRef: ComponentRef<EditRfRI18NComponent> = this.overlayRef.attach(portal);
    let instance = instance1.instance;
    instance.data = data;
    instance.closeOverlay.asObservable().subscribe(value => this.closeOverlay());
    instance.updateRfRI18N.asObservable().subscribe(value => this.updateRfRI18N(value));
    return instance;
  }

  setupReasonCodeColDef() {
    this.reasonCodeColDef = [
      {key: "reasonCode", className: "data_grid_left_align"},
      {key: "sortOrder", className: "data_grid_center_align"},
      {key: "reasonForRefund", className: "data_grid_center_align"},
      {key: "numOfDocument", className: "data_grid_center_align"},
      {
        cellElement: (cellData, rowData, row) => {
          return this.generateActionMenu(cellData, rowData, row);
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
          return this.generateActionMenu(cellData, rowData, row);
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

  collapseReasonCodeI18N() {
    this.collapseReasonCodeI18NEvent.next({});
  }

  private deleteI18N(data: CustomRfRI18N) {
    let deleteI18NRfR=new DeleteI18NRfR();
    deleteI18NRfR.locale=data.locale;
    deleteI18NRfR.reasonCode=data.reasonCode;
    deleteI18NRfR.clientId = this.clientId;
    this.adminService.deleteRfRI18N(Object.assign(deleteI18NRfR, data)).subscribe(value => {
      if (value.success) {
        this.updateTables();
      }
    });
  }
}
