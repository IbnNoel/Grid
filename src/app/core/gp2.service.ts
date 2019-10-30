import {Inject, Injectable} from '@angular/core';
import {WINDOW} from './window.service';
import 'jquery';
import {BehaviorSubject, Subject} from 'rxjs';
import {distinctUntilChanged} from 'rxjs/operators';
import {AuthInfo} from './auth.guard.service';

@Injectable()
export class Gp2Service {

  private windowHeight$ = new Subject<number>();
  private readonly windowId: string;

  readonly token$ = new BehaviorSubject<string>(null);
  readonly apiUri$ = new BehaviorSubject<string>(null);
  readonly authInfo$ = new BehaviorSubject<AuthInfo>(null);

  constructor(@Inject(WINDOW) private window: Window) {
    this.windowId = window.location.hash.substr(1);
    this.setup();
  }

  private setup() {
    $('#main_content').visibility({
      once: false,
      observeChanges: true,
      onUpdate: (calculations) => {
        this.windowHeight$.next(calculations.height + 10);
      }
    });

    this.windowHeight$.pipe(
      distinctUntilChanged()
    ).subscribe(height => {
      window.parent.postMessage(
        {message: 'WINDOW_RESIZED', id: this.windowId, height},
        '*');
    });

    window.addEventListener('message', (evt) => {
      if (!!evt.data && !!evt.data.message) {
        switch (evt.data.message) {
          case 'TOKEN_UPDATED':
            this.token$.next(evt.data.token);
            // console.log(evt.data);
            break;
          case 'API_URI_UPDATED':
            this.apiUri$.next(evt.data.uri);
            break;
          case 'PROFILE_UPDATED':
          case 'TRANSLATIONS_UPDATED':
            break;
        }
      }
    });

    window.parent.postMessage(
      {message: 'GET_TOKEN', id: this.windowId},
      '*'
    );
    window.parent.postMessage(
      {message: 'GET_API_URI', id: this.windowId},
      '*'
    );
  }

}
