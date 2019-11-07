import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {AdministratorService, CustomRfRI18N} from "../../../../../core/administrator.service";

@Component({
  selector: 'app-add-language-custom-rfr-child',
  templateUrl: './add-language-custom-rfr-child.component.html',
  styleUrls: ['./add-language-custom-rfr-child.component.scss']
})
export class AddLanguageCustomRfrChildComponent implements OnInit {

  languages$: Observable<Array<String>>;
  @Output() languageChangeEvent = new EventEmitter<String>(true);

  customRfRI18N: CustomRfRI18N=new CustomRfRI18N();

  constructor(private adminService: AdministratorService) {
    this.languages$ = adminService.getLanguageList();
    this.customRfRI18N.locale="en";
  }

  ngOnInit() {
  }

  addLanguage(language) {
    this.languageChangeEvent.emit(language);
  }

}
