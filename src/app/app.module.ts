import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './modules/app-routing.module';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from './core/window.service';
import {Gp2Service} from './core/gp2.service';
import {RefundsComponent} from './refunds.component';
import {AppHttpInterceptor, AuthGuardService, AuthService, RoleAuthGuard} from './core/auth.guard.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefundService} from './core/refund.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {metaReducers, reducers} from './reducers';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
// Todo:- create a seperate module for style libaries
import {OperationButtonsComponent} from './components/controls/operation-buttons/operation-buttons.component';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {environment} from '../environments/environment';
import {AdministratorService} from './core/administrator.service';
import {GpfiModalComponent} from './components/controls/gpfi-modal/gpfi-modal.component';
import {LoadingDirective} from './directives/loading.directive';
import {LoaderInterceptor, LoaderService} from './core/loader.service';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {ActionMenuComponent} from './components/controls/action-menu/action-menu.component';
import {OverlayComponent} from './components/controls/overlay/overlay.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslationsLoader} from './core/translations.service';
import {WidgetsModule} from './modules/widgets.module';
import {DataTableModule} from './modules/dataTables.module';
import {ConfirmationBoxComponent} from './components/controls/confirmation-box/confirmation-box.component';
import {MessageComponent} from './components/controls/message/message.component';
import {AppDropdownComponent} from './components/controls/dropdown/app.dropdown.component';

export function CustomTranslationsFactory(gp2Service: Gp2Service) {
  return new CustomTranslationsLoader(gp2Service);
}

@NgModule({
  declarations: [
    AppComponent, RefundsComponent, OperationButtonsComponent, GpfiModalComponent,
    LoadingDirective, ActionMenuComponent, OverlayComponent, ConfirmationBoxComponent,
    MessageComponent, AppDropdownComponent
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
  providers: [WINDOW_PROVIDERS, Gp2Service, AuthGuardService, AuthService, RefundService, AdministratorService, RoleAuthGuard, LoaderService, LoaderInterceptor],
  entryComponents: [ActionMenuComponent],
  bootstrap: [AppComponent]

})
export class AppModule {
}
