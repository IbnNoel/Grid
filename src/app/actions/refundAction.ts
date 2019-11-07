import {Action} from '@ngrx/store';
import {RefundView} from '../core/refund.service';
import {AdminSettings, ClientSettings, CustomRfRSettings, RefundRequestSettings} from '../core/administrator.service';

export enum RefundActionTypes {
  RETREIVE_ADMIN_SETTINGS = "[REFUND] Get admin settings",
  SAVE_REF_REQUEST_SETTINGS = "[REFUND] Save Refund Request settings",
  SAVE_CLIENT = "[REFUND] Save client setting",
  SAVE_CUSTOM_RFR_SETTING = "[REFUND] Save custom rfr settings"
}

export class GetAdminSettingAction implements Action {
  readonly type = RefundActionTypes.RETREIVE_ADMIN_SETTINGS;

  constructor(public payload: AdminSettings) {
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

export class SaveCustomRfRSettingsAction implements Action {
  readonly type = RefundActionTypes.SAVE_CUSTOM_RFR_SETTING;

  constructor(public payload: CustomRfRSettings) {
  }
}

export type AdminAction = GetAdminSettingAction | SaveClientSettingsAction | SaveRefundRequestSettingAction | SaveCustomRfRSettingsAction;
