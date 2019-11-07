import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {AdministratorService} from "../../../../../core/administrator.service";
import {AddLanguageCustomRfrComponent} from "../add-language-custom-rfr/add-language-custom-rfr.component";

@Component({
  selector: 'app-add-language-custom-rfr-child',
  templateUrl: './add-language-custom-rfr-child.component.html',
  styleUrls: ['./add-language-custom-rfr-child.component.scss']
})
export class AddLanguageCustomRfrChildComponent implements OnInit {

  languages$: Observable<Array<String>>;
  @Input() selectedLanguage: String;
  @Output() languageChangeEvent = new EventEmitter<String>();


  constructor(private adminService: AdministratorService, private parent: AddLanguageCustomRfrComponent) {
    this.languages$ = adminService.getLanguageList();
    this.selectedLanguage = "en";
  }

  ngOnInit() {
  }

  addLanguage(language) {
    this.parent.createComponent(language);
  }

}
