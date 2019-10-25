import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './modules/app-routing.module';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from './core/window.service';
import {Gp2Service} from './core/gp2.service';
import {RefundsComponent} from './refunds.component';
import {AppHttpInterceptor, AuthGuardService, AuthService} from './core/auth.guard.service';
import {CreateRefundsComponent} from './components/create-refunds/create-refunds.component';
import {ManageRefundsComponent} from './components/manage-refunds/manage-refunds.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefundService} from './core/refund.service';
import {FormsModule} from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// Todo:- create a seperate module for style libaries
import {MatCheckboxModule} from '@angular/material/checkbox';
import { WidgetsModule } from './modules/widgets.module';
import { ClientSettingsComponent } from './components/administrator/client-settings/client-settings.component';
import { DirectRejectRequestComponent } from './components/administrator/direct-reject-request/direct-reject-request.component';
import { OperationButtonsComponent } from './components/controls/operation-buttons/operation-buttons.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AdministratorService } from './core/administrator.service';
import { DataTableComponent } from './components/controls/data-table/data-table.component';
import { GpfiModalComponent } from './components/controls/gpfi-modal/gpfi-modal.component';
import { LoadingDirective } from './directives/loading.directive';

@NgModule({
  declarations: [
    AppComponent, RefundsComponent, CreateRefundsComponent, ManageRefundsComponent, AdministratorComponent, ClientSettingsComponent, DirectRejectRequestComponent, OperationButtonsComponent, DataTableComponent, GpfiModalComponent, LoadingDirective
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
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [WINDOW_PROVIDERS, Gp2Service, AuthGuardService, AuthService, RefundService, AdministratorService,
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
