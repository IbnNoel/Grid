import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {AdministratorService, CustomFieldsSettings, CustomFieldsView} from '../../../../core/administrator.service';
import {BehaviorSubject, forkJoin} from "rxjs";
import {take} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
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
  gridWidth: String;
  editMode: boolean;
  @Output() closeOverlay = new EventEmitter();
  allCustomFields = new BehaviorSubject<CustomFieldsView>({});

  constructor(private store: Store<State>, private refdataService: RefdataService, private adminService: AdministratorService) {
  }

  ngOnInit() {
    this.gridWidth = this.editMode ? "col-md-3" : "col-md-4";
    this.updateTables();
  }

  updateTables() {
    this.adminService.getAllCustomFieldDetails(this.customFieldsSettings.clientId, this.customFieldsSettings.fieldName).subscribe(value => {
      this.allCustomFields.next(value);
    });
    this.customFieldsView = this.allCustomFields.getValue();
  }

  onCancel() {
    this.closeOverlay.emit();
  }
  onSave() {
    this.closeOverlay.emit();
   // this.updateRefundSetting.emit(this.customRfRSetting);
  }
}
