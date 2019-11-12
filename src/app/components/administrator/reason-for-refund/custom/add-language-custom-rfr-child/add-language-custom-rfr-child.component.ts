import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {AdministratorService, CustomRfRI18N} from "../../../../../core/administrator.service";
import {ActionButton, ActionMenuComponent} from "../../../../controls/action-menu/action-menu.component";

@Component({
  selector: 'app-add-language-custom-rfr-child',
  templateUrl: './add-language-custom-rfr-child.component.html',
  styleUrls: ['./add-language-custom-rfr-child.component.scss'],
  providers: [ActionMenuComponent]
})
export class AddLanguageCustomRfrChildComponent implements OnInit {

  @Output() closeOverlay = new EventEmitter(true);
  @Output() updateI18N = new EventEmitter(true);
  languages$: Observable<Array<String>>;
  editMode?:boolean;

  @Output() languageChangeEvent = new EventEmitter<String>(true);

  customRfRI18N: CustomRfRI18N = new CustomRfRI18N();
  actionButtons: Array<ActionButton> = [];

  constructor(private adminService: AdministratorService) {
    const DEFAULT_LOCALE="en";
    this.languages$ = adminService.getLanguageList();
    this.customRfRI18N.locale = DEFAULT_LOCALE;
  }

  ngOnInit() {
    this.languages$.subscribe(value => {
      value.forEach(locale => {
        let button = new ActionButton();
        button.label = locale;
        button.data = locale;
        button.action=(locale)=>{
          this.languageChangeEvent.emit(locale);
        };
        this.actionButtons.push(button);
      })
    });
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateI18N.emit();
  }
}
