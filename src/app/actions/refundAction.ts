import {Action} from '@ngrx/store';
import {RefundView} from '../core/refund.service';
import {AdminSettings, ClientSettings, CustomRfRI18N, CustomRfRSettings, RefundRequestSettings} from '../core/administrator.service';

export enum RefundActionTypes {
  RETREIVE_ADMIN_SETTINGS = "[REFUND] Get admin settings",
  SAVE_REF_REQUEST_SETTINGS = "[REFUND] Save Refund Request settings",
  SAVE_CLIENT = "[REFUND] Save client setting",
  ADD_CUSTOM_RFR_SETTING = "[REFUND] Save custom rfr settings",
  RETRIEVE_RFR = "[REFUND] Retrieve RFR",
  RETRIEVE_RFR_I18N = "[REFUND] Retrieve RFR I18N",
}

export class GetAdminSettingAction implements Action {
  readonly type = RefundActionTypes.RETREIVE_ADMIN_SETTINGS;

  constructor(public payload: AdminSettings) {
  }
}
export class GetRFR implements Action {
  readonly type = RefundActionTypes.RETRIEVE_RFR;

  constructor(public payload: Array<CustomRfRSettings>) {
  }
}
export class GetRFRI18N implements Action {
  readonly type = RefundActionTypes.RETRIEVE_RFR_I18N;

  constructor(public payload: Array<CustomRfRI18N>) {
  }
}

export class SaveClientSettingsAction implements Action {
  readonly type = RefundActionTypes.SAVE_CLIENT;

  constructor(public payload: ClientSettings) {
  }
}

export class SaveRefundRequestSettingAction implements Action {
  readonly type = RefundActionTypes.SAVE_REF_REQUEST_SETTINGS;

  constructor(public payload: RefundRequestSettings) {
  }
}

export class AddCustomRfRSettingsAction implements Action {
  readonly type = RefundActionTypes.ADD_CUSTOM_RFR_SETTING;

  constructor(public payload: CustomRfRSettings) {
  }
}

export type AdminAction = GetAdminSettingAction | SaveClientSettingsAction | SaveRefundRequestSettingAction | AddCustomRfRSettingsAction;
