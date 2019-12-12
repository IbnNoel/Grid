import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BehaviorSubject, forkJoin} from 'rxjs';
import {
  AdministratorService,
  ClientSettings,
  CustomFieldsSettings,
  CustomFieldsView, TextElementViewList, ValidationsExpressions
} from '../../../../core/administrator.service';
import {BehaviorSubject, forkJoin, Observable, of} from "rxjs";
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
  validationExpressions = new BehaviorSubject<Array<ValidationsExpressions>>([]);
  labelText: TextElementViewList;
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
   this.adminService.getAllCustomFieldDetails(this.customFieldsSettings.clientId, this.customFieldsSettings.fieldName).subscribe(data => {
     this.customFieldsView = data;
   });
  }

  onCancel() {
    this.closeOverlay.emit();
  }
  onSave() {
    this.closeOverlay.emit();
   // this.updateRefundSetting.emit(this.customRfRSetting);
  }
}
