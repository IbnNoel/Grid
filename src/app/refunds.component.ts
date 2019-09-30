import {Component} from '@angular/core';

@Component({
  selector: 'app-pricing-main',
  templateUrl: './refunds.component.html'
})
export class RefundsComponent {

  showDiv = false;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

}
