import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {
  AdministratorService,
  CustomFieldsSettings,
  CustomFieldsView, TextElementView, ValidationsExpressions
} from '../../../../core/administrator.service';
import {BehaviorSubject} from "rxjs";
import {Store} from "@ngrx/store";
import {State} from "../../../../reducers";
import {RefdataService} from "../../../../core/refdata.service";
import {ActionButton} from "../../../controls/action-menu/action-menu.component";
import * as _ from "lodash";

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
    // this.updateForm();
  }

  updateTables() {
   this.adminService.getAllCustomFieldDetails(this.customFieldsSettings.clientId, this.customFieldsSettings.fieldName).subscribe(data => {
     this.customFieldsView = data;
   });
  }

  updateForm() {
    this.formName.patchValue({
      description: this.customFieldsView.description
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
    this.customFieldsView.labelText = [{key:this.customFieldsView.fieldName.concat("_LABEL"),locale:"en_GB",text:""}];
    $("#addLabelTextOverlay").modal({show: true, backdrop: false});
  }

  addLabelText() {
    this.labelI18Grid = false;
    $("#addLabelTextOverlay").modal({show: true, backdrop: false});
  }
  addErrorTextDefault() {
    this.errorI18Grid = false;
    this.customFieldsView.errorText = [{key:this.customFieldsView.fieldName.concat("_ERROR"),locale:"en_GB",text:""}];
    $("#addErrorTextOverlay").modal({show: true, backdrop: false});
  }
  addErrorText() {
    this.errorI18Grid = false;
    $("#addErrorTextOverlay").modal({show: true, backdrop: false});
  }
  addHelpTextDefault() {
    this.helpI18Grid = false;
    this.customFieldsView.helpText = [{key:this.customFieldsView.fieldName.concat("_HELP"),locale:"en_GB",text:""}];
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

  showOnText() {
    return this.customFieldsView.fieldType === 'TEXT' || this.customFieldsView.fieldType === 'DATE';
  }

  showOnTextNew() {
    return this.customFieldsView.fieldType === 'SELECT' || this.customFieldsView.fieldType === 'RADIO_BUTTONS';
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

  removeLabelText(locale) {
    this.customFieldsView.labelText = _.remove(this.customFieldsView.labelText, (labelText) => {
      return labelText.locale != locale;
    });

    // this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

  removeErrorText(locale) {
    this.customFieldsView.errorText = _.remove(this.customFieldsView.errorText, (errorText) => {
      return errorText.locale != locale;
    });

    // this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

  removeHelpText(locale) {
    this.customFieldsView.helpText = _.remove(this.customFieldsView.helpText, (helpText) => {
      return helpText.locale != locale;
    });

    // this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

}
