import {Component} from '@angular/core';
import {Gp2Service} from './core/gp2.service';
import {AuthService} from './core/auth.guard.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private translateService: TranslateService, private gp2Service: Gp2Service, private authService: AuthService) {
    this.translateService.setDefaultLang('en');
    // window.addEventListener('message', (evt) => { console.log(evt.data); }, false);
  }

  title = 'wubs-refunds';

}
