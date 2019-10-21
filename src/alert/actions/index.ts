import { dispatch } from 'store'
import { ActionKeys } from 'common/action-keys'

export const clearAlerts = () => {
  dispatch({ type: ActionKeys.CLEAR_ALERTS })
}

export const clearAlert = (alertId: string) => {
  dispatch({ type: ActionKeys.CLEAR_ALERT, payload: alertId })
}
