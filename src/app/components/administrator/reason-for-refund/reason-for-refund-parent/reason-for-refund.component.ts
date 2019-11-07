import {Component, ComponentRef, OnInit, ViewContainerRef} from '@angular/core';
import {AdministratorService, CustomRfRSettings} from "../../../../core/administrator.service";
import {Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {ActivatedRoute, Router} from "@angular/router";
import {AddCustomRefundReasonComponent} from "../custom/add-custom-refund-reason/add-custom-refund-reason.component";
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';


@Component({
  selector: 'app-reason-for-refund',
  templateUrl: './reason-for-refund.component.html',
  styleUrls: ['./reason-for-refund.component.scss']
})
export class ReasonForRefundComponent implements OnInit {

  standardRfREnabled: boolean;
  overlayRef: OverlayRef;

  constructor(private adminService: AdministratorService, private store: Store<State>, private router: Router, private route: ActivatedRoute, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    this.adminService.isStandardRfREnabled("id").subscribe(value => {
      this.standardRfREnabled = value.data;
    }, error => {
      console.error(error);
    })
  }


  ngOnInit() {
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
    instance.closeOverlay.asObservable().subscribe(() => this.closeOverlay());
    instance.addCustomRfRSettings.asObservable().subscribe((customRfRSetting: CustomRfRSettings) => this.saveRfRSettings(customRfRSetting));
  }

  closeOverlay() {
    this.overlayRef.dispose();
  }

  saveRfRSettings(customRfRSetting) {
    console.log(JSON.stringify(customRfRSetting));
  }

  switchToStandard() {

  }

  switchToCustom() {

  }
}
