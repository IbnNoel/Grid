import {Component, Input, OnInit} from '@angular/core';
import {TextElementView} from '../../../../core/administrator.service';
import {Observable, of} from "rxjs";
import {RefdataService} from "../../../../core/refdata.service";
import * as _ from "lodash";

@Component({
  selector: 'app-custom-fields-text',
  templateUrl: './custom-fields-text.component.html',
  styleUrls: ['./custom-fields-text.component.scss']
})
export class CustomFieldsTextComponent implements OnInit {
  @Input() textElementView: TextElementView;
  languages$: Observable<Array<string>>;

  constructor(private refdataService: RefdataService) { }

  ngOnInit() {
    this.refdataService.getLocales().subscribe(value => {
          this.languages$ = of(value.map(l => l.locale));
        });
  }


  ifDefault(locale) {
    return this.refdataService.isDefaultLanguage(locale);
  }

}
