import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './modules/app-routing.module';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from './core/window.service';
import {Gp2Service} from './core/gp2.service';
import {RefundsComponent} from './refunds.component';
import {AppHttpInterceptor, AuthGuardService, AuthService, RoleAuthGuard} from './core/auth.guard.service';
import {CreateRefundsComponent} from './components/create-refunds/create-refunds.component';
import {ManageRefundsComponent} from './components/manage-refunds/manage-refunds.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefundService} from './core/refund.service';
import {FormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {reducers, metaReducers} from './reducers';
import {AdministratorComponent} from './components/administrator/administrator.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// Todo:- create a seperate module for style libaries
import {MatCheckboxModule} from '@angular/material/checkbox';
import {WidgetsModule} from './modules/widgets.module';
import {ClientSettingsComponent} from './components/administrator/client-settings/client-settings.component';
import {DirectRejectRequestComponent} from './components/administrator/direct-reject-request/direct-reject-request.component';
import {OperationButtonsComponent} from './components/controls/operation-buttons/operation-buttons.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {AdministratorService} from './core/administrator.service';
import {DataTableComponent} from './components/controls/data-table/data-table.component';
import {GpfiModalComponent} from './components/controls/gpfi-modal/gpfi-modal.component';
import {LoadingDirective} from './directives/loading.directive';
import {LoaderInterceptor, LoaderService} from './core/loader.service';
import {ReasonForRefundComponent} from './components/administrator/reason-for-refund/reason-for-refund-parent/reason-for-refund.component';
import {AddCustomRefundReasonComponent} from './components/administrator/reason-for-refund/custom/add-custom-refund-reason/add-custom-refund-reason.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {AddLanguageCustomRfrComponent} from './components/administrator/reason-for-refund/custom/add-language-custom-rfr/add-language-custom-rfr.component';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {AddLanguageCustomRfrChildComponent} from './components/administrator/reason-for-refund/custom/add-language-custom-rfr-child/add-language-custom-rfr-child.component';
import {ActionMenuComponent} from './components/controls/action-menu/action-menu.component';
import { AddCustomRefundSettingComponent } from './components/administrator/reason-for-refund/custom/add-custom-refund-setting/add-custom-refund-setting.component';
import { EditRfRI18NComponent } from './components/administrator/reason-for-refund/custom/edit-rf-ri18-n/edit-rf-ri18-n.component';


@NgModule({
  declarations: [
    AppComponent, RefundsComponent, CreateRefundsComponent, ManageRefundsComponent, AdministratorComponent, ClientSettingsComponent, DirectRejectRequestComponent, OperationButtonsComponent, DataTableComponent, GpfiModalComponent, LoadingDirective, ReasonForRefundComponent, AddCustomRefundReasonComponent, AddLanguageCustomRfrComponent, AddLanguageCustomRfrChildComponent, ActionMenuComponent, AddCustomRefundSettingComponent, EditRfRI18NComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    NoopAnimationsModule,
    WidgetsModule,
    StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    OverlayModule,
    PlatformModule,
    PortalModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [WINDOW_PROVIDERS, Gp2Service, AuthGuardService, AuthService, RefundService, AdministratorService, RoleAuthGuard, LoaderService, LoaderInterceptor,
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}],
  entryComponents: [AddLanguageCustomRfrChildComponent, ActionMenuComponent,EditRfRI18NComponent],
  bootstrap: [AppComponent]

})
export class AppModule {
}
