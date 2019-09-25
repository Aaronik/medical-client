import { dispatch } from '../../store'

export const clearErrors = () => {
  dispatch({ type: 'CLEAR_ERRORS' })
}
