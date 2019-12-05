import {Action} from '@ngrx/store';
import {AdminSettings, ClientSettings, RefundHandling, RefundRequestSettings} from '../core/administrator.service';
import {RefData} from "../core/refdata.service";

export enum RefundActionTypes {
  RETREIVE_ADMIN_SETTINGS = "[REFUND] Get admin settings",
  SAVE_REF_REQUEST_SETTINGS = "[REFUND] Save Refund Request settings",
  SAVE_CLIENT = "[REFUND] Save client setting",
  SAVE_REFUND_HANDLING = "[REFUND] Save Refund Handling",
  REF_DATA = "[REFUND] Ref Data"
}

export class GetAdminSettingAction implements Action {
  readonly type = RefundActionTypes.RETREIVE_ADMIN_SETTINGS;

  constructor(public payload: AdminSettings) {
  }
}

export class RefDataAction implements Action {
  readonly type = RefundActionTypes.REF_DATA;

  constructor(public payload: RefData) {
  }
}


export class SaveClientSettingsAction implements Action {
  readonly type = RefundActionTypes.SAVE_CLIENT;

  constructor(public payload: ClientSettings) {
  }
}

export class SaveRefundHandlingSettingAction implements Action {
  readonly type = RefundActionTypes.SAVE_REFUND_HANDLING;

  constructor(public payload: RefundHandling) {
  }
}

export class SaveRefundRequestSettingAction implements Action {
  readonly type = RefundActionTypes.SAVE_REF_REQUEST_SETTINGS;

  constructor(public payload: RefundRequestSettings) {
  }
}



export type AdminAction = GetAdminSettingAction | SaveClientSettingsAction | SaveRefundRequestSettingAction | SaveRefundHandlingSettingAction;

