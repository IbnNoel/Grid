import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ApiResponse} from './auth.guard.service';
import {flatMap, map} from 'rxjs/operators';
import {of, OperatorFunction, throwError} from 'rxjs';
import {PagedResponse} from "./refund.service";
import {settings} from "cluster";

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  private readonly DEFAULT_LANGUAGE = "en_GB";
  // TODO:- Mangage these URL strings possibly put in global api dependency
  private readonly ROUTE_URL = '/refund-service/admin';
  private readonly GET_CLIENT_URL = `${this.ROUTE_URL}/clientSettings/`;
  private readonly GET_PAYMENT_TYPE_AND_CURRENCIES_URL = `${this.ROUTE_URL}/directRejection/currencies`;
  private readonly GET_CLIENT_PYMNT_TYPE_CURR_URL = `${this.ROUTE_URL}/directRejections/client/currencies`;
  private readonly SET_CLIENT_URL = `${this.ROUTE_URL}/configure/clientSettings`;
  private readonly ADD_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/add`;
  private readonly ADD_PYMT_TYPE_CURR = `${this.ROUTE_URL}/directRejections/client/add`;
  private readonly REMOVE_PYMT_TYPE_CURR = `${this.ROUTE_URL}/directRejections/client/remove`;
  private readonly GET_REFUND_URL = `${this.ROUTE_URL}/getRefundRequestSettings/`;
  private readonly SET_REFUND_URL = `${this.ROUTE_URL}/configure/refundRequestSettings`;
  private readonly CONFIGURE_DEFAULT_URL = `${this.ROUTE_URL}/configure/default/`;
  private readonly GET_RFR = `${this.ROUTE_URL}/client/reasonForRefunds`;
  private readonly GET_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefunds/I18N`;
  private readonly TOGGLE_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/configure/`;
  private readonly GET_REFUND_HANDLING = `${this.ROUTE_URL}/getRefundHandling/`;
  private readonly SET_REFUND_HANDLING = `${this.ROUTE_URL}/configure/updateRefundHandling`;
  private readonly UPDATE_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefunds/I18N/update`;
  private readonly UPDATE_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/update`;
  private readonly DELETE_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefunds/I18N/delete`;
  private readonly DELETE_RFR = `${this.ROUTE_URL}/client/reasonForRefunds/delete`;
  private readonly ADD_RFR_I18N = `${this.ROUTE_URL}/client/reasonForRefunds/I18N/add`;
  private readonly RESET_TO_STANDARD = `${this.ROUTE_URL}/client/reasonForRefunds/resetToStandard`;


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

  getPaymentTypes() {
    // tslint:disable-next-line:ban-type
    return this.httpClient.get<ApiResponse<Map<string, Array<string>>>>(this.GET_PAYMENT_TYPE_AND_CURRENCIES_URL).pipe(this.apiResponseMap);
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

  getClientPymntTypeCurrList(id, pageNo, size) {
    const params = new HttpParams().set('clientId', id)
      .set('page', pageNo).set('size', size);
    return this.httpClient.get<ApiResponse<PagedResponse<MethodDirectRejectionView>>>(this.GET_CLIENT_PYMNT_TYPE_CURR_URL, {params}).pipe(this.apiResponseMap);
  }


  getClientSelectedPymntTypeAndCurr(id, pageNo, size) {
    const params = new HttpParams().set('clientId', id)
      .set('page', pageNo).set('size', size);
    return this.httpClient.get<ApiResponse<PagedResponse<CustomRfRSettings>>>(this.GET_RFR, {params}).pipe(this.apiResponseMap);
  }

  setClientSettings(settings: ClientSettings) {
    return this.httpClient.put<ApiResponse<ClientSettings>>(this.SET_CLIENT_URL, settings);
  }

  addCustomRfR(settings: CustomRfRSettings) {
    return this.httpClient.post<ApiResponse<AddCustomRfR>>(this.ADD_RFR, settings).pipe(this.apiResponseMap);
  }

  addPymntTypeAndCurr(config: AddOrRemovePymntTypeCurrency) {
    return this.httpClient.post<ApiResponse<AddOrRemovePymntTypeCurrency>>(this.ADD_PYMT_TYPE_CURR, config).pipe(this.apiResponseMap);
  }

  removePymntTypeAndCurr(config: AddOrRemovePymntTypeCurrency) {
    return this.httpClient.request('delete', this.REMOVE_PYMT_TYPE_CURR, {body: config}).pipe(this.apiResponseMap);
  }

  toggleRfR(clientId) {
    return this.httpClient.put<ApiResponse<ToggleRfrResponse>>(this.TOGGLE_RFR + clientId, "").pipe(this.apiResponseMap);
  }

  updateRfRI18NForClient(updateRfRI18N: CustomRfRI18N) {
    return this.httpClient.put<ApiResponse<CustomRfRI18N>>(this.UPDATE_RFR_I18N, updateRfRI18N).pipe(this.apiResponseMap);
  }

  updateRfRForClient(data: CustomRfRSettings) {
    return this.httpClient.put<ApiResponse<CustomRfRI18N>>(this.UPDATE_RFR, data).pipe(this.apiResponseMap);
  }

  getRefundRequestSettings(id) {
    return this.httpClient.get<ApiResponse<RefundRequestSettings>>(this.GET_REFUND_URL + id).pipe(this.apiResponseMap);
  }

  deleteRfRI18N(data) {
    return this.httpClient.request("delete", this.DELETE_RFR_I18N, {body: data}).pipe(this.apiResponseMap);
  }

  deleteRfR(data) {
    return this.httpClient.request("delete", this.DELETE_RFR, {body: data}).pipe(this.apiResponseMap);
  }

  setRefundRequestSettings(settings: RefundRequestSettings) {
    return this.httpClient.put<ApiResponse<RefundRequestSettings>>(this.SET_REFUND_URL, settings);
  }

  setDefaultSettings(clientId) {
    return this.httpClient.post<ApiResponse<ClientSettings>>(this.CONFIGURE_DEFAULT_URL + clientId, "").pipe(this.apiResponseMap);
  }

  getRefundHandling(id) {
    return this.httpClient.get<ApiResponse<RefundHandling>>(this.GET_REFUND_HANDLING + id).pipe(this.apiResponseMap);
  }

  setRefundHandling(refundHandling) {
    return this.httpClient.put<ApiResponse<RefundHandling>>(this.SET_REFUND_HANDLING, refundHandling);
  }

  resetToStandard(data) {
    return this.httpClient.request("delete", this.RESET_TO_STANDARD, {body: data}).pipe(this.apiResponseMap);
  }

  /*getClients(name : string, pageNo, size){
    let GET_CLIENT_URL = `${this.ROUTE_URL}/client/search`;
    const params = new HttpParams().set('name', name)
      .set('page', pageNo).set('size', size);

    return this.httpClient.get<ApiResponse<PagedResponse<Client>>>(GET_CLIENT_URL, {params});
  }*/
  addLanguages(value: AddCustomRfR) {
    return this.httpClient.post(this.ADD_RFR_I18N, value);
  }
}


export interface PaymentTypeAndCurrencies {
  paymentTypeId: string;
  currencyList: Array<string>;
}

export interface SelectedPaymentTypeAndCurrencies {
  selectedPymtTypeList: Array<string>;
  selectedCurrencyList: Array<string>;
}

export class Currencies {
  currency: string;
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
  customRfr?: boolean
}

export interface RefundHandling {
  clientId: number;
  directRejectionCard: boolean;
  directRejectionNonCard: boolean;
  nonDirectRejection: boolean;
}

export interface AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  customRfrSettings: Array<CustomRfRSettings>;
  customRfRI18N: Array<CustomRfRI18N>;
  refundHandling: RefundHandling;
  selectedData: AddOrRemovePymntTypeCurrency;
}

export interface RefundRequestSettings {
  clientId: number;
  pledgeReferenceMandatory: boolean;
  pledgeReferenceVisible: boolean;
  reasonForRefundMandatory: boolean;
  reasonForRefundVisible: boolean;
  refundAmountMandatory: boolean;
  refundAmountVisible: boolean;
  refundRequestInfoList: Array<{
    locale: string,
    text: string
  }>;
}

export interface CustomRfRSettings {
  clientId: number;
  reasonCode?: string;
  sortOrder?: number;
  numOfDocument?: number;
  reasonForRefund?: string;
}

export interface CustomRfRI18N {
  clientId?: number;
  locale: string;
  hint?: string;
  reasonForRefund?: string;
  reasonCode?: string;
  sortOrder?: number;
}

export interface AddOrRemovePymntTypeCurrency {
  clientId: number;
  paymentTypeId: string;
  currency: string;
}

export interface AddCustomRfR extends CustomRfRSettings {
  reasonForRefundList?: Array<CustomRfRI18N>;
}

export class MethodDirectRejectionView {
  paymentTypeId: string;
  currency: string;
}

export interface ToggleRfrResponse {
  isCustomRfr: boolean;
}

export interface DeleteI18NRfR {
  clientId: number;
  reasonCode: String;
  locale: String;
}

