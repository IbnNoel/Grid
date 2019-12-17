import { Injectable } from '@angular/core';
import * as _ from "lodash";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {RefdataService} from "../../../core/refdata.service";

@Injectable({
  providedIn: 'root'
})
export class CustomFieldsValidatorService {

  constructor(private fb: FormBuilder, private refdataService: RefdataService) { }

/*  customFieldsSettingValidator() {
    return _.cloneDeep(this.fb.group({
      reasonCode: new FormControl('', [Validators.required, Validators.maxLength(6)]),
      sortOrder: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,2}")
      ]),
      numOfDocument: new FormControl('', [
        Validators.pattern("[0-9]\\d{0,0}")
      ])
    }));
  }*/
}
