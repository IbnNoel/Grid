import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from 'lodash';
import {AdministratorService} from "../../../core/administrator.service";

@Injectable({
  providedIn: 'root'
})
export class ReasonForRefundValidatorService {

  constructor(private fb: FormBuilder, private adminService: AdministratorService) {
  }

 /* reasonForRefundValidator() {
    return _.cloneDeep(this.fb.group({
      reasonCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      sortOrder: new FormControl('', [
        Validators.pattern("[1-9]\\d{0,3}")
      ]),
      numOfDocument: new FormControl('', [
        Validators.pattern("[1-9]\\d{0,1}")
      ]),
      reasonForRefundList: this.fb.array([this.reasonForRefundI18NValidator()])
    }));
  }*/

  reasonForRefundSettingValidator() {
    return _.cloneDeep(this.fb.group({
      reasonCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      sortOrder: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,3}")
      ]),
      numOfDocument: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,1}")
      ])
    }));
  }

  reasonForRefundI18NValidator(disable?) {
    return _.cloneDeep(this.fb.group({
      locale: new FormControl({value:'',disabled:disable}, Validators.required),
      hint: new FormControl('', Validators.maxLength(255)),
      reasonForRefund: new FormControl('', [Validators.maxLength(80)])
    }, {
      validator: RequiredForDefaultLanguage("reasonForRefund", "locale", this.adminService.getDefaultLanguage())
    }))
  }
}

export function RequiredForDefaultLanguage(controlName: string, locale: string, defaultLocale: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const localeControl = formGroup.controls[locale];

    if (localeControl.errors && !localeControl.errors.requiredForDefaultLanguage) {
      return;
    }

    if ((control.value == "" || control.value == null) && (localeControl.value === defaultLocale)) {
      control.setErrors({requiredForDefaultLanguage: true});
    } else {
      control.setErrors(null);
    }
  }
}

