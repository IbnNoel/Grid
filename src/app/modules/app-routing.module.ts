import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefundsComponent} from '../refunds.component';
import {AuthGuardService, RoleAuthGuard} from '../core/auth.guard.service';
import {ManageRefundsComponent} from '../components/manage-refunds/manage-refunds.component';
import {CreateRefundsComponent} from '../components/create-refunds/create-refunds.component';
import {AdministratorComponent} from '../components/administrator/administrator.component';
import {ClientSettingsComponent} from '../components/administrator/client-settings/client-settings.component';
import {DirectRejectRequestComponent} from '../components/administrator/direct-reject-request/direct-reject-request.component';
import {ReasonForRefundComponent} from "../components/administrator/reason-for-refund/reason-for-refund-parent/reason-for-refund.component";
import {AddCustomRefundReasonComponent} from "../components/administrator/reason-for-refund/custom/add-custom-refund-reason/add-custom-refund-reason.component";
import { RefundHandlingComponent } from '../components/administrator/refund-handling/refund-handling.component';

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
        data: {roles: ["ManageRefundPortal"], redirectTo:'refunds/create'},
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
          component: ReasonForRefundComponent,
          children: [
            {
              path: 'addCustomRefundReason',
              component: AddCustomRefundReasonComponent
            }
          ]
        }
        ]
      },
      {
        path: 'create',
        component: CreateRefundsComponent
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
