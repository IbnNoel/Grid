import {Component, Input, OnInit} from '@angular/core';
import {CustomRfRI18N} from "../../../../core/administrator.service";
import {ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {State} from "../../../../reducers";
import {Store} from "@ngrx/store";
import {FormGroup} from "@angular/forms";
import {RefdataService} from "../../../../core/refdata.service";

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
  class: string;

  constructor(private refDataService: RefdataService, private store: Store<State>) {

  }

  ngOnInit() {
    this.updateForm();
    this.class = (this.refDataService.isDefaultLanguage(this.customRfRI18N.locale)) ? "required" : "";
  }

  updateForm() {
    this.formName.patchValue({
      locale: this.customRfRI18N.locale,
      reasonForRefund: this.customRfRI18N.reasonForRefund,
      hint: this.customRfRI18N.hint
    });
  }
}
