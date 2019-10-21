import { ActionKeys } from 'common/action-keys'

export type TAlertType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export type TAlert = {
  id: string
  message: string
  type: TAlertType
}

export type TAction =
  { type: ActionKeys.ALERT, payload: { message: string, type: TAlertType } } |
  { type: ActionKeys.CLEAR_ALERTS } |
  { type: ActionKeys.CLEAR_ALERT, payload: string }

export type TBranchState = TAlert[]
