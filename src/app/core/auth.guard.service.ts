import {Injectable} from '@angular/core';
import {Gp2Service} from './gp2.service';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {filter, first, flatMap, map} from 'rxjs/operators';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

@Injectable()
export class AuthService {

  private readonly SYNC_URI = '/refund-service/security/sync';

  private authInfoLocal: AuthInfo;
  get authInfo() {
    return this.authInfoLocal;
  }

  constructor(private httpClient: HttpClient, private gp2Service: Gp2Service) {
    combineLatest([
      this.gp2Service.token$.pipe(filter(token => !!token), first()),
      this.gp2Service.apiUri$.pipe(filter(uri => !!uri), first())
    ]).pipe(flatMap(() => this.httpClient.get<ApiResponse<AuthInfo>>(this.SYNC_URI)))
      .subscribe(info => {
      this.authInfoLocal = info.data;
      this.gp2Service.authInfo$.next(info.data);
    });
  }

}

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  constructor(private gp2Service: Gp2Service) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const uri = this.gp2Service.apiUri$.getValue();
    if (!!this.gp2Service.token$.getValue()) {
      req = req.clone({
        url: !!uri ? req.url.replace(/^\/refund-service/, uri) : req.url,
        setHeaders: {
          Authorization: 'Bearer ' + this.gp2Service.token$.getValue()
        }
      });
    }
    return next.handle(req);
  }

}

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(private gp2Service: Gp2Service) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return combineLatest([
        this.gp2Service.token$.pipe(filter(token => !!token), first()),
        this.gp2Service.apiUri$.pipe(filter(uri => !!uri), first()),
        this.gp2Service.authInfo$.pipe(filter(info => !!info), first())
      ]
    ).pipe(map(() => true));
  }

}

export interface ApiResponse<T> {
  success: boolean;
  error: string;
  data: T;
}

export interface AuthInfo {
  userId: string;
  userName: string;
  email: string;
  clientId: string;
  privileges: string[];
}
