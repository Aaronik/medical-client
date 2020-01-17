import { dispatch } from 'common/store'
import { ActionKeys } from 'common/actionKeys'

export const clearAlerts = () => {
  dispatch({ type: ActionKeys.CLEAR_ALERTS })
}

export const clearAlert = (alertId: string) => {
  dispatch({ type: ActionKeys.CLEAR_ALERT, payload: alertId })
}
