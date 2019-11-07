import { dispatch } from 'store'
import { ActionKeys } from 'common/action-keys'

export const toggleGutterNav = () => {
  dispatch({ type: ActionKeys.TOGGLE_GUTTER_NAV })
}
