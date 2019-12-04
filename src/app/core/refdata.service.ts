import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "./auth.guard.service";
import {map, take} from "rxjs/operators";
import {TranslateService} from "@ngx-translate/core";
import {State} from "../reducers";
import {createSelector, select, Store} from "@ngrx/store";

@Injectable({
  providedIn: 'root'
})
export class RefdataService {

  constructor(private httpClient: HttpClient, private translateService: TranslateService, private store: Store<State>) {
  }


  private readonly URL = '/refund-service/refdata';

  retrieveRefData() {
    return this.httpClient.get<ApiResponse<RefData>>(this.URL).pipe(map(response => response.data));
  }

  isDefaultLanguage(locale: String) {
    return locale == this.translateService.getDefaultLang();
  }

  getDefaultLanguage() {
    return this.translateService.getDefaultLang();
  }

  getLocales() {
    return this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.refData,
          (refData) => refData.locales)));
  }
  getIndustrySegments(){
    return this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.refData,
          (refData) => refData.industrySegments)));
  }
  getCountries(){
    return this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.refData,
          (refData) => refData.countries)));
  }
  getCurrencies(){
    return this.store.pipe(
      take(1),
      select(
        createSelector((state) => state.refData,
          (refData) => refData.currencies)));
  }
}

export interface RefData {
  countries: Array<Country>;
  locales: Array<Locale>;
  currencies: Array<Currency>;
  industrySegments: Array<IndustrySegment>;
}

export interface IndustrySegment {
  templateId: string;
  description: string;
}

export interface Currency {
  currencyCode: string;
  format: string;
  roundToNearest: string;
  precision: string;
  minValue: string;
  maxValue: string;
  currencyName: string;
  currencyFlag: string;
  colourCode: number;
  ccyMinorUnit: number;
}

export interface Country {
  countryCode: string;
  twoDigitCode: string;
  currency: string;
}

export interface Locale {
  locale: string;
  description: string;
  shortDateFormat: string;
  longDateFormat: string;
  timeFormat: string;
  decimalFormat: string;
  systemDefault: boolean;
}
