import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from './auth.guard.service';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  // TODO:- Put in global api dependency
  private readonly url = "url";

  constructor(private httpClient: HttpClient) { 
    // get the token id from gp2.service and store it locally 
  }

  getClientSettings(id) {
    var obj : ApiResponse<ClientSettings> = {
      success: true,
      error: "",
      data: {
        clientId:1,
        industrySegment:"test1",
        enableSecurityChallenge:true
      }
    } 
    
    return of(obj).pipe(map(response => response.data));
    /*const params = new HttpParams().set('clientId', id);
    return this.httpClient.get<ApiResponse<ClientSettings>>('url', {params}).pipe(map(response => response.data));*/
  }

  setClientSettings(settings: ClientSettings) {
    return this.httpClient.put<ApiResponse<ClientSettings>>(this.url, settings);
  }

  getRefundRequestSettings(id){
    var obj : ApiResponse<RefundRequestSettings> = {
      success: true,
      error: "",
      data: {
        clientId:1,
        displayPledgeReference: false,
        displayRequestRefundAmount: false,
        displayReasonForRefund: false
      }
    }

    return of(obj).pipe(map(response => response.data));
    /*const params = new HttpParams().set('clientId', id);
    return this.httpClient.get<ApiResponse<RefundRequestSettings>>(this.url, {params});*/
  }

  setRefundRequestSettings(settings: RefundRequestSettings) {
    return this.httpClient.put<ApiResponse<RefundRequestSettings>>(this.url, settings);
  }
}

export interface RefundRequestSettings{
    clientId: Number;
    displayPledgeReference: Boolean;
    displayRequestRefundAmount: Boolean;
    displayReasonForRefund:Boolean;

}

export interface ClientSettings{
  clientId: Number;
  industrySegment: string;
  enableSecurityChallenge: Boolean;
}

export interface AdminSettings{
  clientId:Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
}
