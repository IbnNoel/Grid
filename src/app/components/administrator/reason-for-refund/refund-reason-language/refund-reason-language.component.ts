import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRfRI18N} from "../../../../core/administrator.service";
import {ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-refund-reason-language',
  templateUrl: './refund-reason-language.component.html',
  styleUrls: ['./refund-reason-language.component.scss'],
  providers: [ActionMenuComponent]
})
export class RefundReasonLanguageComponent implements OnInit {

  @Input() formName: FormGroup;
  @Input() languages: Array<String>;
  @Input() editMode?: boolean;
  @Input() addNewLanguage?: boolean;
  @Input() customRfRI18N: CustomRfRI18N;
  @Output() changeLanguageEvent = new EventEmitter(true);

  constructor() {

  }

  ngOnInit() {
    this.updateForm();
  }

  updateForm() {
    this.formName.patchValue({
      locale: this.customRfRI18N.locale,
      reasonForRefund: this.customRfRI18N.reasonForRefund,
      hint: this.customRfRI18N.hint
    });
  }

  changeLanguage() {
    this.changeLanguageEvent.emit();
  }
}
