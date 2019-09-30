import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WINDOW_PROVIDERS} from './core/window.service';
import {Gp2Service} from './core/gp2.service';
import {RefundsComponent} from './refunds.component';
import {AppHttpInterceptor, AuthGuardService, AuthService} from './core/auth.guard.service';
import {CreateRefundsComponent} from './create-refunds/create-refunds.component';
import {ManageRefundsComponent} from './manage-refunds/manage-refunds.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefundService} from './core/refund.service';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent, RefundsComponent, CreateRefundsComponent, ManageRefundsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [WINDOW_PROVIDERS, Gp2Service, AuthGuardService, AuthService, RefundService,
    {provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
