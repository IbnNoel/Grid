import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  on,
  Action
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { RefundActionTypes, AdminAction } from '../actions/refundAction';
import { AdminSettings, ClientSettings, RefundRequestSettings } from '../core/administrator.service';



export interface State {
   adminSettings:AdminSettings
}

export class AdminSettingsState implements AdminSettings{
  clientId : Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
}

export function adminSettingsReducer(state = new AdminSettingsState(), action: AdminAction): AdminSettingsState{
  switch (action.type){
    case RefundActionTypes.RETREIVE_ADMIN_SETTINGS:
      return action.payload;
    case RefundActionTypes.SAVE_CLIENT:
      return {...state, clientSettings: action.payload};
    case RefundActionTypes.SAVE_REF_REQUEST_SETTINGS:
      return {...state, refundRequestSettings: action.payload}
    default:
      return state;
  }
}

export const reducers: ActionReducerMap<State, Action> = {
  adminSettings: adminSettingsReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
