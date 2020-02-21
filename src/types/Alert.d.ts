import { ActionKeys } from 'common/actionKeys'

export type TAlertType = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark'

export type TAlert = {
  id: string
  message: string
  type: TAlertType
}
