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
import { RefundView, PagedResponse } from '../core/refund.service';
import { RefundActionTypes, RefundAction, AdminAction } from '../actions/refundAction';
import { AdminSettings, ClientSettings, RefundRequestSettings } from '../core/administrator.service';



export interface State {
   createRefund: RefundView;
   manageRefunds:PagedResponse<RefundView>;
   adminSettings:AdminSettings
}

export class IntialRefundViewState implements RefundView{
  id: number;  
  transactionId: number;
  clientId: number;
  refundReason: string;
  transactionPledgeDate: string;
  createdDate: number;

}

export class AdminSettingsState implements AdminSettings{
  clientId : Number;
  clientSettings: ClientSettings;
  refundRequestSettings: RefundRequestSettings;
}

export class IntialPagedResponseState implements PagedResponse<IntialRefundViewState>{
  page: 1;  size: 10;
  totalElements: number;
  totalPages: number;
  list: IntialRefundViewState[];
}

 /*TODO:- Add this to a seperate folder relative to create refund! */ 
 function createRefundReducer(state = new IntialRefundViewState(), action: RefundAction): IntialRefundViewState {
  switch (action.type) {
    case RefundActionTypes.CREATE_REFUND:
      return action.payload;
    default:
      return state;
  }
}

function adminSettingsReducer(state = new AdminSettingsState(), action: AdminAction): AdminSettingsState{
  switch (action.type){
    case RefundActionTypes.SELECT_CLIENT:
      return  {...state, clientId : action.payload };
    default:
      return state;
  }
}

function manageRefundReducer(state = new IntialPagedResponseState(), action: RefundAction): IntialPagedResponseState {
  switch (action.type) {
    default:
      return state;
  }
}


export const reducers: ActionReducerMap<State, Action> = {
  createRefund: createRefundReducer ,
  manageRefunds: manageRefundReducer,
  adminSettings: adminSettingsReducer
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
