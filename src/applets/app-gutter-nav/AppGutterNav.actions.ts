import { dispatch } from 'common/store'
import { ActionKeys } from 'common/actionKeys'

export const toggleGutterNav = () => {
  dispatch({ type: ActionKeys.TOGGLE_GUTTER_NAV })
}
