import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import * as _ from 'lodash';
import {AdministratorService} from "../../../core/administrator.service";
import {RefdataService} from "../../../core/refdata.service";

@Injectable({
  providedIn: 'root'
})
export class ReasonForRefundValidatorService {

  constructor(private fb: FormBuilder, private refdataService: RefdataService) {
  }

  reasonForRefundSettingValidator() {
    return _.cloneDeep(this.fb.group({
      reasonCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      sortOrder: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,2}")
      ]),
      numOfDocument: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,0}")
      ])
    }));
  }

  reasonForRefundI18NValidator(disable?) {
    return _.cloneDeep(this.fb.group({
      locale: new FormControl({value: '', disabled: disable}, Validators.required),
      hint: new FormControl('', Validators.maxLength(255)),
      reasonForRefund: new FormControl('', [Validators.maxLength(80)])
    }, {
      validator: RequiredForDefaultLanguage("reasonForRefund", "locale", this.refdataService.getDefaultLanguage())
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

