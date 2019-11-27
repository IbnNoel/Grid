import {Component, Input, OnInit} from '@angular/core';
import {AdministratorService, CustomRfRI18N} from "../../../../core/administrator.service";
import {ActionMenuComponent} from "../../../controls/action-menu/action-menu.component";
import {State} from "../../../../reducers";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-refund-reason-language',
  templateUrl: './refund-reason-language.component.html',
  styleUrls: ['./refund-reason-language.component.scss'],
  providers: [ActionMenuComponent]
})
export class RefundReasonLanguageComponent implements OnInit {

  @Input() languages: Array<String>;
  @Input() editMode?: boolean;
  @Input() addNewLanguage?: boolean;
  @Input() customRfRI18N: CustomRfRI18N;

  constructor(private adminService: AdministratorService, private store: Store<State>) {

  }

  ngOnInit() {

  }
}
