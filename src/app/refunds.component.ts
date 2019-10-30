import {Component} from '@angular/core';
import { AuthService } from './core/auth.guard.service';

@Component({
  selector: 'app-pricing-main',
  templateUrl: './refunds.component.html'
})
export class RefundsComponent {

  hasAdminPrivilege: boolean;

  constructor(private authService : AuthService){
    this.hasAdminPrivilege = authService.hasPrivleges(["ManageRefundPortal"]);
  }

  showDiv = false;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

}
