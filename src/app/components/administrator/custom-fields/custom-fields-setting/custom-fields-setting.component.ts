import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {AdministratorService, CustomFieldsSettings, CustomFieldsView} from '../../../../core/administrator.service';
import {BehaviorSubject, forkJoin} from "rxjs";
import {take} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
import {ReasonForRefundValidatorService} from "../../../../validator/administrator/reason-for-refund/reason-for-refund-validator.service";
import {State} from "../../../../reducers";
import {RefdataService} from "../../../../core/refdata.service";

@Component({
  selector: 'app-custom-fields-setting',
  templateUrl: './custom-fields-setting.component.html',
  styleUrls: ['./custom-fields-setting.component.scss']
})
export class CustomFieldsSettingComponent implements OnInit {

  @Input() formName: FormGroup;
  @Input() customFieldsSettings: CustomFieldsSettings;
  customFieldsView: CustomFieldsView;
  fieldType: Array<String>;
  allCustomFields = new BehaviorSubject<CustomFieldsView>({});

  constructor(private store: Store<State>, private refdataService: RefdataService, private adminService: AdministratorService) {
  }

  ngOnInit() {
    this.updateTables();
  }

  updateTables() {
    this.adminService.getAllCustomFieldDetails(this.customFieldsSettings.id, this.customFieldsSettings.fieldName).subscribe(value => {
      this.allCustomFields.next(value);
    });
  }

  /*@Input() formName: FormGroup;
  editMode: boolean;
  gridWidth: String;
  @Output() closeOverlay = new EventEmitter();
  @Output() updateCustomFieldsSetting = new EventEmitter();

  updateForm() {
    this.formName.patchValue({
      display: this.customFieldsSettings.display,
      mandatory: this.customFieldsSettings.mandatory,
    });
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateCustomFieldsSetting.emit(this.customFieldsSettings);
  }*/
}
