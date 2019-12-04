import {Component} from '@angular/core';
import {Gp2Service} from './core/gp2.service';
import {AuthService} from './core/auth.guard.service';
import {TranslateService} from '@ngx-translate/core';
import {Store} from "@ngrx/store";
import {State} from "./reducers";
import {RefdataService} from "./core/refdata.service";
import {RefDataAction} from "./actions/refundAction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translateService: TranslateService, private gp2Service: Gp2Service, private authService: AuthService, private store: Store<State>, private refdataService: RefdataService) {
    refdataService.retrieveRefData().subscribe(value => {
      let refData = value;
      this.translateService.setDefaultLang(refData.locales.find(l => l.systemDefault).locale);
      this.store.dispatch(new RefDataAction(value));
    });
    // window.addEventListener('message', (evt) => { console.log(evt.data); }, false);
  }

  title = 'wubs-refunds';

}
