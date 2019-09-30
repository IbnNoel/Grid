import { Component, OnInit } from '@angular/core';
import {RefundService, RefundView} from '../core/refund.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-create-refunds',
  templateUrl: './create-refunds.component.html',
  styleUrls: ['./create-refunds.component.css']
})
export class CreateRefundsComponent implements OnInit {

  constructor(private refundService: RefundService) { }

  ngOnInit() {
  }

  createRefund(formData: NgForm) {
    if (formData.valid) {
      this.refundService.createRefund(formData.value)
        .subscribe(response => {
          if (response.success) {
            formData.resetForm();
          }
        });
    }
  }
}
