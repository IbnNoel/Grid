import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiResponse} from './auth.guard.service';
import {flatMap, map} from 'rxjs/operators';
import {of, OperatorFunction, throwError} from 'rxjs';
import {PagedResponse} from "./refund.service";

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {


  // TODO:- Mangage these URL strings possibly put in global api dependency
  private readonly ROUTE_URL = '/refund-service/admin';
  private readonly GET_CLIENT_URL = `${this.ROUTE_URL}/clientSettings/`;
  private readonly GET_INDUSTRY_SEGMENT_URL = `${this.ROUTE_URL}/industrySegments`;
  private readonly SET_CLIENT_URL = `${this.ROUTE_URL}/configure/clientSettings`;
  private readonly ADD_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/addRFR`;
  private readonly GET_REFUND_URL = `${this.ROUTE_URL}/getRefundRequestSettings/`;
  private readonly SET_REFUND_URL = `${this.ROUTE_URL}/configure/refundRequestSettings`;
  private readonly CONFIGURE_DEFAULT_URL = `${this.ROUTE_URL}/configure/default`;
  private readonly GET_RFR = `${this.ROUTE_URL}/client/reasonForRefunds`;
  private readonly GET_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefunds/I18N`;
  private readonly TOGGLE_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/configure/`;
  private readonly UPDATE_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefund/updateRFRI18N`;
  private readonly DELETE_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefund/deleteRFRI18N`;


  private apiResponseMap: OperatorFunction<ApiResponse<any>, any> = flatMap(response => {
    if (response.success) {
      return of(response.data);
    } else {
      return throwError(response.error);
    }
  });

  constructor(private httpClient: HttpClient) {
    // get the token id from gp2.service and store it locally
  }

  getClientSettings(id) {
    return this.httpClient.get<ApiResponse<ClientSettings>>(this.GET_CLIENT_URL + id).pipe(map(response => response.data));
  }

  getRFR(id, pageNo, size) {
    const params = new HttpParams().set('clientId', id)
      .set('page', pageNo).set('size', size);
    return this.httpClient.get<ApiResponse<PagedResponse<CustomRfRSettings>>>(this.GET_RFR, {params}).pipe(this.apiResponseMap);
  }

  getRFRI18N(id, pageNo, size) {
    const params = new HttpParams().set('clientId', id)
      .set('page', pageNo).set('size', size);
    return this.httpClient.get<ApiResponse<PagedResponse<CustomRfRI18N>>>(this.GET_RFR_I18N, {params}).pipe(this.apiResponseMap);
  }

  getIndustrySegments() {
    return this.httpClient.get<ApiResponse<Array<IndustrySegment>>>(this.GET_INDUSTRY_SEGMENT_URL).pipe(this.apiResponseMap);
  }

  getLanguageList() {
    return of(Array.of("en", "hi", "jp"));
  }

  setClientSettings(settings: ClientSettings) {
    return this.httpClient.put<ApiResponse<ClientSettings>>(this.SET_CLIENT_URL, settings);
  }

  addCustomRfR(settings: CustomRfRSettings) {
    //return of(settings);
    return this.httpClient.post<ApiResponse<AddCustomRfR>>(this.ADD_RFR, settings);
  }

  toggleRfR(clientId) {
    return this.httpClient.put<ApiResponse<ToggleRfrResponse>>(this.TOGGLE_RFR + clientId, "");
  }

  updateRfRI18NForClient(updateRfRI18N: CustomRfRI18N) {
    return this.httpClient.post<ApiResponse<CustomRfRI18N>>(this.UPDATE_RFR_I18N, updateRfRI18N);
  }

  getRefundRequestSettings(id) {
    return this.httpClient.get<ApiResponse<RefundRequestSettings>>(this.GET_REFUND_URL + id).pipe(this.apiResponseMap);
  }
  deleteRfRI18N(data){
    return this.httpClient.request("delete",this.DELETE_RFR_I18N,{body:data});
  }

  setRefundRequestSettings(settings:RefundRequestSettings) {
    return this.httpClient.put<ApiResponse<RefundRequestSettings>>(this.SET_REFUND_URL, settings);
  }

  setDefaultSettings(settings:ClientSettings  ) {
    return this.httpClient.post<ApiResponse<ClientSettings>>(this.CONFIGURE_DEFAULT_URL, settings).pipe(this.apiResponseMap);
  }

  /*getClients(name : string, pageNo, size){
    let GET_CLIENT_URL = `${this.ROUTE_URL}/client/search`;
    const params = new HttpParams().set('name', name)
      .set('page', pageNo).set('size', size);

    return this.httpClient.get<ApiResponse<PagedResponse<Client>>>(GET_CLIENT_URL, {params});
  }*/
}

export interface IndustrySegment {
  templateId: number;
  description: string;
}

export interface ClientSettings {
  clientId?: number;
  cctClientId?: string;
  convenienceUrl?: string;
  countrySegment?: string;
  industrySegment?: string;
  industryTemplateId?: string,
  name?: string;
  portalDefaultLanguage?: string;
  refundConfigured?: boolean;
  refundPortalDomain?: string;
  securityChallengeEnabled?: boolean;
  standardRFREnabled?: boolean
}

export interface AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  customRfrSettings: Array<CustomRfRSettings>;
  customRfRI18N:Array<CustomRfRI18N>;
  industrySegments: Array<IndustrySegment>;
}

export interface RefundRequestSettings {
  clientId: number;
  pledgeReferenceMandatory: boolean;
  pledgeReferenceVisible: boolean;
  reasonForRefundMandatory: boolean;
  reasonForRefundVisible: boolean;
  refundAmountMandatory: boolean;
  refundAmountVisible: boolean;
}

export class CustomRfRSettings {
  clientId: number;
  reasonCode: String;
  sortOrder: number;
  numOfDocument: number;
}

export class CustomRfRI18N {
  clientId?:number;
  locale: String;
  hint: String;
  reasonForRefund: String;
  reasonCode?: String;
  sortOrder?: number;
}

export class AddCustomRfR extends CustomRfRSettings {
  reasonForRefundList: Array<CustomRfRI18N> = [];
}
export class ToggleRfrResponse{
  isStandardRFREnabled:boolean;
}
export class DeleteI18NRfR{
  clientId:number;
  reasonCode:String;
  locale:String;
}

