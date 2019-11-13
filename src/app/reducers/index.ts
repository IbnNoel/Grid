import {Action, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AdminAction, RefundActionTypes} from '../actions/refundAction';
import {AdminSettings, ClientSettings, CustomRfRSettings, RefundRequestSettings, IndustrySegment, RefundHandling} from '../core/administrator.service';


export interface State {
  adminSettings: AdminSettings
}

export class AdminSettingsState implements AdminSettings {
  clientId: Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
  customRfrSettings: CustomRfRSettings;
  industrySegments: Array<IndustrySegment>;
  refundHandling: RefundHandling;
}

export function adminSettingsReducer(state = new AdminSettingsState(), action: AdminAction): AdminSettingsState {
  switch (action.type) {
    case RefundActionTypes.RETREIVE_ADMIN_SETTINGS:
      return action.payload;
    case RefundActionTypes.SAVE_CLIENT:
      return {...state, clientSettings: action.payload};
    case RefundActionTypes.SAVE_REF_REQUEST_SETTINGS:
      return {...state, refundRequestSettings: action.payload}
    case RefundActionTypes.ADD_CUSTOM_RFR_SETTING:
      return {...state, customRfrSettings: action.payload}
    default:
      return state;
  }
}

export const reducers: ActionReducerMap<State, Action> = {
  adminSettings: adminSettingsReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
