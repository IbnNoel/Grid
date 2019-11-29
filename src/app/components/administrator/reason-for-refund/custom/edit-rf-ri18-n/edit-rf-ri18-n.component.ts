import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomRfRI18N} from "../../../../../core/administrator.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-edit-rf-ri18-n',
  templateUrl: './edit-rf-ri18-n.component.html',
  styleUrls: ['./edit-rf-ri18-n.component.scss']
})
export class EditRfRI18NComponent implements OnInit {

  @Input() data: CustomRfRI18N;
  @Output() closeOverlay: any = new EventEmitter(true);
  @Output() updateRfRI18N: any = new EventEmitter(true);
  @Output() resetToStandard: any = new EventEmitter(true);
  i18nForm: FormGroup;
  isStandardRfREnabled: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  onResetToStandard($event: any) {
    this.resetToStandard.emit(this.data);
  }

  onCancel() {
    this.closeOverlay.emit();
  }

  onSave($event: any) {
    this.updateRfRI18N.emit(this.data);

  }
}
