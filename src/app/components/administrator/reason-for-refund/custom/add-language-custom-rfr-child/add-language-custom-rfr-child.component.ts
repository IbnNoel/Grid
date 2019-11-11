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

  languages$: Observable<Array<String>>;
  @Output() languageChangeEvent = new EventEmitter<String>(true);

  customRfRI18N: CustomRfRI18N = new CustomRfRI18N();
  actionButtons: Array<ActionButton> = [];

  constructor(private adminService: AdministratorService) {
    this.languages$ = adminService.getLanguageList();
    this.customRfRI18N.locale = "en";
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
}
