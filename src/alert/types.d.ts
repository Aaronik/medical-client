export type TAlertType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export type TAlert = {
  id: string
  message: string
  type: TAlertType
}

export type TAction =
  { type: 'ALERT', payload: { message: string, type: TAlertType } } |
  { type: 'CLEAR_ALERTS' } |
  { type: 'CLEAR_ALERT', payload: string }

export type TBranchState = TAlert[]
