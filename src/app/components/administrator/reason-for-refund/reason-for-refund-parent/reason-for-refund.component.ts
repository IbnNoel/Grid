import {Component, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {AdministratorService, ClientSettings, CustomRfRSettings} from "../../../../core/administrator.service";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AddCustomRefundReasonComponent} from "../custom/add-custom-refund-reason/add-custom-refund-reason.component";
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {take} from "rxjs/operators";
import {AddCustomRfRSettingsAction, SaveClientSettingsAction} from "../../../../actions/refundAction";


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {


  overlayRef: OverlayRef;

  clientSettings: ClientSettings;

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
  }


  ngOnInit() {
    this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.adminSettings,
          (adminSettings) => adminSettings.clientSettings)))
      .subscribe((response) => {
        this.clientSettings = Object.assign({}, response);
      });
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
    instance.clientId = this.clientSettings.clientId;
    instance.closeOverlay.asObservable().subscribe(() => this.closeOverlay());
    instance.addCustomRfRSettings.asObservable().subscribe((customRfRSetting: CustomRfRSettings) => this.saveCustomRfRSettings(customRfRSetting));
  }

  closeOverlay() {
    this.overlayRef.dispose();
  }

  saveCustomRfRSettings(customRfRSetting) {
    this.adminService.addCustomRfR(customRfRSetting).subscribe(response =>{
      if(response.success){
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
