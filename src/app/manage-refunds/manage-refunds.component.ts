import {Component, OnInit} from '@angular/core';
import {RefundService, RefundView} from '../core/refund.service';

@Component({
  selector: 'app-manage-refunds',
  templateUrl: './manage-refunds.component.html',
  styleUrls: ['./manage-refunds.component.css']
})
export class ManageRefundsComponent implements OnInit {

  refunds: RefundView[] = [];

  constructor(private refundService: RefundService) { }

  ngOnInit() {
    this.refundService.searchRefunds()
      .subscribe(response => {
        if (response.success) {
          this.refunds = response.data.list;
        }
      });
  }

}
