import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefundsComponent} from './refunds.component';
import {AuthGuardService} from './core/auth.guard.service';
import {ManageRefundsComponent} from './manage-refunds/manage-refunds.component';
import {CreateRefundsComponent} from './create-refunds/create-refunds.component';

const routes: Routes = [
  {
    path: 'refunds',
    component: RefundsComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'manage',
        component: ManageRefundsComponent
      },
      {
        path: 'create',
        component: CreateRefundsComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: '/manage'
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
