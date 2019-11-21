import {TranslateLoader} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {Gp2Service} from './gp2.service';
import {filter} from 'rxjs/operators';

export class CustomTranslationsLoader implements TranslateLoader {

  constructor(private gp2Service: Gp2Service) {
  }

  getTranslation(lang: string): Observable<any> {
    return this.gp2Service.translations$.pipe(
      filter(translations => !!translations)
    );
  }

}
