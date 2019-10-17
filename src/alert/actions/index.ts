import { dispatch } from 'store'

export const clearAlerts = () => {
  dispatch({ type: 'CLEAR_ALERTS' })
}

export const clearAlert = (alertId: string) => {
  dispatch({ type: 'CLEAR_ALERT', payload: alertId })
}
