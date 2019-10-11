import { Component, OnInit } from '@angular/core';
import {RefundService, RefundView} from '../../core/refund.service';
import {NgForm} from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '../../reducers';
import { AddRefundAction } from '../../actions/refundAction';

@Component({
  selector: 'app-create-refunds',
  templateUrl: './create-refunds.component.html',
  styleUrls: ['./create-refunds.component.css']
})
export class CreateRefundsComponent implements OnInit {

  constructor(private refundService: RefundService, private store: Store<State>) { }

  ngOnInit() {
  }

  createRefund(formData: NgForm) {
    if (formData.valid) {
      this.refundService.createRefund(formData.value)
        .subscribe(response => {
          if (response.success) {
            this.store.dispatch(new AddRefundAction(formData.value as RefundView))
            formData.resetForm();
          }
        });
    }
  }
}
