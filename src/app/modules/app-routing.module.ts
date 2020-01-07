import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RefundsComponent} from '../refunds.component';
import {AuthGuardService, RoleAuthGuard} from '../core/auth.guard.service';

const routes: Routes = [
  {
    path: 'refunds',
    component: RefundsComponent
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
