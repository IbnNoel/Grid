import {Component, Input, OnInit} from '@angular/core';
import {CustomFieldsView, TextElementView} from "../../../../core/administrator.service";
import * as _ from "lodash";
import {ActionButton} from "../../../controls/action-menu/action-menu.component";
import {RefdataService} from "../../../../core/refdata.service";

@Component({
  selector: 'app-custom-fields-text',
  templateUrl: './custom-fields-text.component.html',
  styleUrls: ['./custom-fields-text.component.scss']
})
export class CustomFieldsTextComponent implements OnInit {
  @Input() customFieldsView: CustomFieldsView;
  @Input() textElementView: TextElementView;
  actionButtons: Array<ActionButton>;

  constructor(private refdataService: RefdataService) { }

  ngOnInit() {

  }
/*
  removeActionButtonItem(locale) {
    this.actionButtons = _.remove(this.actionButtons, (btn) => {
      return btn.label != locale;
    });
  }


  removeLabelText(locale) {
    this.customFieldsView.labelText = _.remove(this.customFieldsView.labelText, (labelText) => {
      return labelText.locale != locale;
    });
    this.addActionButton(locale);
    // sort the action buttons in alphabetical order
  }

  addActionButton(locale) {
    let button = new ActionButton();
    button.label = locale;
    button.data = locale;
    button.action = (locale) => {
      this.addInformationalText(locale);
    };
    this.actionButtons.push(button);
  }

  addInformationalText(locale) {
    this.customFieldsView.labelText.push({locale: locale, text: ""});
    this.removeActionButtonItem(locale);
  }
  ifDefault(locale) {
    return this.refdataService.isDefaultLanguage(locale);
  }*/

}
