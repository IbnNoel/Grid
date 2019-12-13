import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {
  AdministratorService,
  ClientSettings,
  CustomFieldsSettings,
  CustomFieldsView, ValidationsExpressions
} from '../../../../core/administrator.service';
import {BehaviorSubject, forkJoin, Observable, of} from "rxjs";
import {take} from "rxjs/operators";
import {createSelector, select, Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {RefdataService} from "../../../../core/refdata.service";
import {ActionButton} from "../../../controls/action-menu/action-menu.component";

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
  allFieldTypes = new BehaviorSubject<Array<string>>([]);
  fieldType: Array<string>;
  gridWidth: string;
  editMode: boolean;
  @Output() closeOverlay = new EventEmitter();
  @Output() updateCustomFieldsSetting = new EventEmitter();
  actionButtons: Array<ActionButton>;
  labelI18Grid = true;
  errorI18Grid = true;
  helpI18Grid = true;

  constructor(private store: Store<State>, private refdataService: RefdataService, private adminService: AdministratorService) {
  }

  ngOnInit() {
    this.gridWidth = this.editMode ? 'col-md-3' : 'col-md-4';
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
    this.updateCustomFieldsSetting.emit(this.customFieldsView);
  }

  disableActionButton() {
    return this.actionButtons.length === 0;
  }

  addLabelTextDefault() {
    this.labelI18Grid = false;
    this.customFieldsView.labelText = [{key:this.customFieldsView.fieldName.concat("_LABEL"),locale:"",text:""}];
    $("#addLabelTextOverlay").modal({show: true, backdrop: false});
  }

  addLabelText() {
    this.labelI18Grid = false;
    $("#addLabelTextOverlay").modal({show: true, backdrop: false});
  }
  addErrorTextDefault() {
    this.errorI18Grid = false;
    this.customFieldsView.errorText = [{key:this.customFieldsView.fieldName.concat("_ERROR"),locale:"",text:""}];
    $("#addErrorTextOverlay").modal({show: true, backdrop: false});
  }
  addErrorText() {
    this.errorI18Grid = false;
    $("#addErrorTextOverlay").modal({show: true, backdrop: false});
  }
  addHelpTextDefault() {
    this.helpI18Grid = false;
    this.customFieldsView.helpText = [{key:this.customFieldsView.fieldName.concat("_HELP"),locale:"",text:""}];
    $("#addHelpTextOverlay").modal({show: true, backdrop: false});
  }
  addHelpText() {
    this.helpI18Grid = false;
    $("#addHelpTextOverlay").modal({show: true, backdrop: false});
  }


  additionalLabelText(){
    this.customFieldsView.labelText.push({key:this.customFieldsView.fieldName.concat("_LABEL"),locale:"",text:""}) ;
  }

  additionalErrorText(){
    this.customFieldsView.errorText.push({key:this.customFieldsView.fieldName.concat("_ERROR"),locale:"",text:""}) ;
  }

  additionalHelpText(){
    this.customFieldsView.helpText.push({key:this.customFieldsView.fieldName.concat("_HELP"),locale:"",text:""}) ;
  }

  closeAddLabelText(name: string) {
    this.labelI18Grid = true;
    this.close(name);
  }
  closeAddErrorText(name: string) {
    this.errorI18Grid = true;
    this.close(name);
  }
  closeAddHelpText(name: string) {
    this.helpI18Grid = true;
    this.close(name);
  }
  close(overlay) {
    $("#" + overlay).modal("hide");
  }

  ifDefault(locale) {
    return this.refdataService.isDefaultLanguage(locale);
  }

  show() {
    return this.customFieldsView.fieldType === 'TEXT' || this.customFieldsView.fieldType === 'DATE';

  }

  showLabelI18Grid() {
    return this.labelI18Grid;
  }
  showErrorI18Grid() {
    return this.errorI18Grid;
  }

  showHelpI18Grid() {
    return this.helpI18Grid;
  }



}
