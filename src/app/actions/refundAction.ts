import { Action } from '@ngrx/store';
import { RefundView } from '../core/refund.service';
import { AdminSettings } from '../core/administrator.service';

export enum RefundActionTypes{
    SELECT_CLIENT = "[REFUND] Select Refund",
    OPEN_CLIENT_SETTING_TAB = "[REFUND] Open Client tab",
    OPEN_REFUND_REQUEST = "[REFUND] Open Refund Request",
    CREATE_REFUND = "[REFUND] Create Refund",
}

export class AddRefundAction implements Action{
    readonly type = RefundActionTypes.CREATE_REFUND;
    constructor(public payload: RefundView){}
}

export class SelectClientAction implements Action{
    readonly type = RefundActionTypes.SELECT_CLIENT;

    constructor(public payload: Number){ }
}



export type RefundAction = AddRefundAction;

export type AdminAction = SelectClientAction | AddRefundAction;