import {Action, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AdminAction, RefDataAction, RefundActionTypes} from '../actions/refundAction';
import {AddOrRemovePymntTypeCurrency, AdminSettings, ClientSettings, CustomRfRI18N, CustomRfRSettings, RefundHandling, RefundRequestSettings} from '../core/administrator.service';
import {Country, Currency, IndustrySegment, Locale} from "../core/refdata.service";


export interface State {
  adminSettings: AdminSettings,
  refData: RefData;
}

export interface RefData {
  countries: Array<Country>;
  locales: Array<Locale>;
  currencies: Array<Currency>;
  industrySegments: Array<IndustrySegment>;
}

export class AdminSettingsState implements AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  refundHandling: RefundHandling;
  selectedData: AddOrRemovePymntTypeCurrency;
  customRfrSettings: Array<CustomRfRSettings>;
  customRfRI18N: Array<CustomRfRI18N>
}

export class RefDataState implements RefData {
  countries: Array<Country>;
  locales: Array<Locale>;
  currencies: Array<Currency>;
  industrySegments: Array<IndustrySegment>;
}

export function adminSettingsReducer(state = new AdminSettingsState(), action: AdminAction): AdminSettingsState {
  switch (action.type) {
    case RefundActionTypes.RETREIVE_ADMIN_SETTINGS:
      return action.payload;
    case RefundActionTypes.SAVE_CLIENT:
      return {...state, clientSettings: action.payload};
    case RefundActionTypes.SAVE_REF_REQUEST_SETTINGS:
      return {...state, refundRequestSettings: action.payload};
    case RefundActionTypes.SAVE_REFUND_HANDLING:
      return {...state, refundHandling: action.payload};
    default:
      return state;
  }
}

export function refDataReducer(state = new RefDataState(), action: RefDataAction): RefDataState {
  switch (action.type) {
    case RefundActionTypes.REF_DATA:
      return action.payload;
    default:
      return state;
  }
}


export const reducers: ActionReducerMap<State, Action> = {
  adminSettings: adminSettingsReducer,
  refData: refDataReducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
