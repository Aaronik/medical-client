import { ActionKeys } from 'common/actionKeys'

export type TNotification = {
  id: string
}

export type TBranchState = {
  notifications: TNotification[]
}

export type TAction =
  { type: ActionKeys.NOTIFICATIONS_FETCHED, payload: TNotification[] }
