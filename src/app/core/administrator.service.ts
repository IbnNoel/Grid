import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiResponse} from './auth.guard.service';
import {flatMap, map} from 'rxjs/operators';
import {Observable, of, OperatorFunction, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  // TODO:- Mangage these URL strings possibly put in global api dependency
  private readonly ROUTE_URL = '/refund-service/admin';
  private readonly GET_CLIENT_URL = `${this.ROUTE_URL}/clientSettings/`;
  private readonly GET_INDUSTRY_SEGMENT_URL = `${this.ROUTE_URL}/industrySegments`;
  private readonly SET_CLIENT_URL = `${this.ROUTE_URL}/configure/clientSettings`;
  private readonly GET_REFUND_URL = `${this.ROUTE_URL}/getRefundRequestSettings/`;
  private readonly SET_REFUND_URL = `${this.ROUTE_URL}/configure/refundRequestSettings`;
  private readonly IS_STANDARD_RFR_ENABLED_URL = `${this.ROUTE_URL}/configure/refundRequestSettings`;
  private readonly CONFIGURE_DEFAULT_URL = `${this.ROUTE_URL}/configure/default`;

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

  getIndustrySegments() {
    return this.httpClient.get<ApiResponse<Array<IndustrySegment>>>(this.GET_INDUSTRY_SEGMENT_URL).pipe(this.apiResponseMap);
  }

  getLanguageList() {
    return of(Array.of("en", "hi", "jp"));
  }

  setClientSettings(settings: ClientSettings) {
    return this.httpClient.put<ApiResponse<ClientSettings>>(this.SET_CLIENT_URL, settings);
  }

  addCustomRfR(settings:CustomRfRSettings){
    return this.httpClient.put<ApiResponse<CustomRfRSettings>>(this.SET_CLIENT_URL, settings);
  }

  getRefundRequestSettings(id) {
    return this.httpClient.get<ApiResponse<RefundRequestSettings>>(this.GET_REFUND_URL + id).pipe(this.apiResponseMap);
  }

  setRefundRequestSettings(settings: RefundRequestSettings) {
    return this.httpClient.put<ApiResponse<RefundRequestSettings>>(this.SET_REFUND_URL, settings);
  }

  setDefaultSettings(settings: ClientSettings) {
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
  isStandardRfREnabled?:boolean
}

export interface AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  customRfrSettings: CustomRfRSettings;
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
  sortOrder: Number;
  noOfDocs: Number;
  customRFRI18NRequestList: Array<CustomRfRI18N>=[];
}

export class CustomRfRI18N {
  locale: String;
  hint: String;
  reasonForRefund: String;
}

