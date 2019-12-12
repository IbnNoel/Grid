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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './reducers';
import {AdministratorComponent} from './components/administrator/administrator.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// Todo:- create a seperate module for style libaries
import {ClientSettingsComponent} from './components/administrator/client-settings/client-settings.component';
import {DirectRejectRequestComponent} from './components/administrator/direct-reject-request/direct-reject-request.component';
import {OperationButtonsComponent} from './components/controls/operation-buttons/operation-buttons.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {AdministratorService} from './core/administrator.service';
import {GpfiModalComponent} from './components/controls/gpfi-modal/gpfi-modal.component';
import {LoadingDirective} from './directives/loading.directive';
import {LoaderInterceptor, LoaderService} from './core/loader.service';
import {ReasonForRefundComponent} from './components/administrator/reason-for-refund/reason-for-refund/reason-for-refund.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {RefundReasonLanguageComponent} from './components/administrator/reason-for-refund/refund-reason-language/refund-reason-language.component';
import {ActionMenuComponent} from './components/controls/action-menu/action-menu.component';
import {RefundReasonSettingComponent} from './components/administrator/reason-for-refund/refund-reason-setting/refund-reason-setting.component';
import {RefundHandlingComponent} from './components/administrator/refund-handling/refund-handling.component';
import {EditRfRI18NComponent} from './components/administrator/reason-for-refund/custom/edit-rf-ri18-n/edit-rf-ri18-n.component';
import {OverlayComponent} from './components/controls/overlay/overlay.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslationsLoader} from './core/translations.service';
import { WidgetsModule } from './modules/widgets.module';
import { DataTableModule } from './modules/dataTables.module';
import { ConfirmationBoxComponent } from './components/controls/confirmation-box/confirmation-box.component';
import { MessageComponent } from './components/controls/message/message.component';
import { CustomFieldsComponent } from './components/administrator/custom-fields/custom-fields/custom-fields.component';
import { CustomFieldsSettingComponent } from './components/administrator/custom-fields/custom-fields-setting/custom-fields-setting.component';
import { CustomFieldsTextComponent } from './components/administrator/custom-fields/custom-fields-text/custom-fields-text.component';
import {AppDropdownComponent} from './components/controls/dropdown/app.dropdown.component';


export function CustomTranslationsFactory(gp2Service: Gp2Service) {
  return new CustomTranslationsLoader(gp2Service);
}

@NgModule({
  declarations: [
    AppComponent, RefundsComponent, CreateRefundsComponent, ManageRefundsComponent, AdministratorComponent, ClientSettingsComponent,
    DirectRejectRequestComponent, OperationButtonsComponent, GpfiModalComponent,
    LoadingDirective, ReasonForRefundComponent,   RefundReasonLanguageComponent, ActionMenuComponent,
    RefundReasonSettingComponent, RefundHandlingComponent, EditRfRI18NComponent, OverlayComponent, ConfirmationBoxComponent,
    MessageComponent, AppDropdownComponent
    AppComponent, RefundsComponent, CreateRefundsComponent, ManageRefundsComponent, AdministratorComponent, ClientSettingsComponent, DirectRejectRequestComponent, OperationButtonsComponent, GpfiModalComponent, LoadingDirective, ReasonForRefundComponent,   RefundReasonLanguageComponent, ActionMenuComponent, RefundReasonSettingComponent, RefundHandlingComponent, EditRfRI18NComponent, OverlayComponent, ConfirmationBoxComponent, MessageComponent, CustomFieldsComponent, CustomFieldsSettingComponent, CustomFieldsTextComponent
  ],
  imports: [
    BrowserModule,
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useFactory: CustomTranslationsFactory, deps: [Gp2Service]}
    }),
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
    MatIconModule,
    ReactiveFormsModule,
    DataTableModule
  ],
  providers: [WINDOW_PROVIDERS, Gp2Service, AuthGuardService, AuthService, RefundService, AdministratorService, RoleAuthGuard, LoaderService, LoaderInterceptor,
    {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}],
  entryComponents: [RefundReasonLanguageComponent, ActionMenuComponent, EditRfRI18NComponent,  RefundReasonSettingComponent, CustomFieldsSettingComponent],
  bootstrap: [AppComponent]

})
export class AppModule {
}
