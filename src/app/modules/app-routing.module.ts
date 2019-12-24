import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefundsComponent} from '../refunds.component';
import {AuthGuardService, RoleAuthGuard} from '../core/auth.guard.service';
import {AdministratorComponent} from '../components/administrator/administrator.component';
import {ClientSettingsComponent} from '../components/administrator/client-settings/client-settings.component';
import {DirectRejectRequestComponent} from '../components/administrator/direct-reject-request/direct-reject-request.component';
import {ReasonForRefundComponent} from '../components/administrator/reason-for-refund/reason-for-refund/reason-for-refund.component';
import {RefundHandlingComponent} from '../components/administrator/refund-handling/refund-handling.component';
import {CustomFieldsComponent} from '../components/administrator/custom-fields/custom-fields/custom-fields.component';
import {ManageRefundsComponent} from "../components/manage-refunds/manage-refunds.component";

const routes: Routes = [
  {
    path: 'refunds',
    component: RefundsComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'admin',
        component: AdministratorComponent,
        canActivate: [AuthGuardService, RoleAuthGuard],
        data: {roles: ["ManageRefundPortal"], redirectTo: 'refunds/create'},
        children: [{
          path: 'clientSettings',
          component: ClientSettingsComponent
        },
          {
            path: 'directRejectionRequest',
            component: DirectRejectRequestComponent
          },
          {
            path: 'refundHandling',
            component: RefundHandlingComponent
          },
          {
            path: 'reasonForRefund',
            component: ReasonForRefundComponent
          },
          {
            path: 'customFields',
            component: CustomFieldsComponent
          }
        ]
      },
      {
        path: 'manage',
        component: ManageRefundsComponent,
        canActivate: [AuthGuardService, RoleAuthGuard],
        data: {roles: ["ViewRefund", "ManageRefundPortal", "ApproveRefund", "InitiateRefund"], redirectTo: 'refunds/manage'},
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'admin'
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/refunds'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
