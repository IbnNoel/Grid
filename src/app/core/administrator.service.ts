import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from './auth.guard.service';
import { map, switchMap, tap, flatMap } from 'rxjs/operators';
import { of, throwError, Observable, OperatorFunction } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  // TODO:- Mangage these URL strings possibly put in global api dependency
  private readonly GET_CLIENT_URL = '/refund-service/admin/clientSettings/';
  private readonly GET_INDUSTRY_SEGMENT_URL = '/refund-service/admin/industrySegments';
  private readonly SET_CLIENT_URL = '/refund-service/admin/configure/clientSettings';
  private readonly GET_REFUND_URL = '/refund-service/admin/refundRequestSettings/';
  private readonly SET_REFUND_URL = '/refund-service/admin/configure/refundRequestSettings';

  private apiResponseMap: OperatorFunction<ApiResponse<any>,any> =  flatMap(response => { 
    if(response.success){
        return of(response.data);
      }else {
        return throwError(response.error);
      }
    });

  constructor(private httpClient: HttpClient) { 
    // get the token id from gp2.service and store it locally 
  }

  getClientSettings(id) {
    return this.httpClient.get<ApiResponse<ClientSettings>>(this.GET_CLIENT_URL + id).pipe(map(response => response.data));
  }

  getIndustrySegments(){
    return this.httpClient.get<ApiResponse<Array<IndustrySegment>>>(this.GET_INDUSTRY_SEGMENT_URL).pipe(this.apiResponseMap);
  }

  setClientSettings(settings: ClientSettings) {
    return this.httpClient.put<ApiResponse<ClientSettings>>(this.SET_CLIENT_URL, settings);
  }

  getRefundRequestSettings(id){
    return this.httpClient.get<ApiResponse<RefundRequestSettings>>(this.GET_REFUND_URL + id).pipe(this.apiResponseMap);
  }

  setRefundRequestSettings(settings: RefundRequestSettings) {
    return this.httpClient.put<ApiResponse<RefundRequestSettings>>(this.SET_REFUND_URL, settings);
  }
}

export interface IndustrySegment{
  industryId:number;
  name:string;
}

export interface ClientSettings{
  clientId?: number;

  cctClientId?: string;
  convenienceUrl?: string;
  industryId?: number,
  isRefundConfigured?: number;
  name?: string;
  portalDefaultLanguage?:string;
  refundPortalDomain?:string;
  securityChallengeEnabled?:boolean;
}

export interface AdminSettings{
  clientId:Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
}

export interface RefundRequestSettings {
  clientId:                 number;
  pledgeReferenceMandatory: boolean;
  pledgeReferenceVisible:   boolean;
  reasonForRefundMandatory: boolean;
  reasonForRefundVisible:   boolean;
  refundAmountMandatory:    boolean;
  refundAmountVisible:      boolean;
}
