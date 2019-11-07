import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AddLanguageCustomRfrComponent} from "../add-language-custom-rfr/add-language-custom-rfr.component";
import {ReasonForRefundComponent} from "../../reason-for-refund-parent/reason-for-refund.component";


@Component({
  selector: 'app-add-custom-refund-reason',
  templateUrl: './add-custom-refund-reason.component.html',
  styleUrls: ['./add-custom-refund-reason.component.scss'],
  providers: [AddLanguageCustomRfrComponent]
})
export class AddCustomRefundReasonComponent implements OnInit {

  @Output() closeOverlay = new EventEmitter();


  constructor(private reasonForRefund: ReasonForRefundComponent) {
  }


  ngOnInit() {
  }

  onCancel() {
    this.reasonForRefund.closeOverlay();
  }

  onSave($event: any) {

  }
}
