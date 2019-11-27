import {Action, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AdminAction, RefundActionTypes} from '../actions/refundAction';
import {
  AdminSettings,
  ClientSettings,
  CustomRfRI18N,
  CustomRfRSettings,
  IndustrySegment,
  RefundRequestSettings,
  RefundHandling,
  AddOrRemovePymntTypeCurrency
} from '../core/administrator.service';


export interface State {
  adminSettings: AdminSettings
}

export class AdminSettingsState implements AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  industrySegments: Array<IndustrySegment>;
  refundHandling: RefundHandling;
  selectedData: AddOrRemovePymntTypeCurrency;
  customRfrSettings: Array<CustomRfRSettings>;
  customRfRI18N:Array<CustomRfRI18N>
}

export function adminSettingsReducer(state = new AdminSettingsState(), action: AdminAction): AdminSettingsState {
  switch (action.type) {
    case RefundActionTypes.RETREIVE_ADMIN_SETTINGS:
      return action.payload;
    case RefundActionTypes.SAVE_CLIENT:
      return {...state, clientSettings: action.payload};
    case RefundActionTypes.SAVE_REF_REQUEST_SETTINGS:
      return {...state, refundRequestSettings: action.payload};
   /* case RefundActionTypes.ADD_CUSTOM_RFR_SETTING:
      return {...state, customRfrSettings: action.payload}*/
    case RefundActionTypes.RETRIEVE_RFR:
      return {...state, customRfrSettings: action.payload};
    case RefundActionTypes.RETRIEVE_RFR_I18N:
      return {...state, customRfRI18N: action.payload}
    case RefundActionTypes.SAVE_REFUND_HANDLING:
      return {...state, refundHandling: action.payload};
    default:
      return state;
  }
}

export const reducers: ActionReducerMap<State, Action> = {
  adminSettings: adminSettingsReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
