import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefundsComponent} from '../refunds.component';
import {AuthGuardService} from '../core/auth.guard.service';
import {ManageRefundsComponent} from '../components/manage-refunds/manage-refunds.component';
import {CreateRefundsComponent} from '../components/create-refunds/create-refunds.component';
import { AdministratorComponent } from '../components/administrator/administrator.component';
import { ClientSettingsComponent } from '../components/administrator/client-settings/client-settings.component';
import { DirectRejectRequestComponent } from '../components/administrator/direct-reject-request/direct-reject-request.component';

const routes: Routes = [
  {
    path: 'refunds',
    component: RefundsComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'admin',
        component: AdministratorComponent,
        canActivate: [AuthGuardService],
        children:[{
        path:'clientSettings',
        component: ClientSettingsComponent
      },
      {
        path:'directRejectionRequest',
        component:DirectRejectRequestComponent
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
export class AppRoutingModule { }