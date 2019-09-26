import { dispatch } from '../../store'

export const clearErrors = () => {
  dispatch({ type: 'CLEAR_ERRORS' })
}

export const clearError = (errorId: string) => {
  dispatch({ type: 'CLEAR_ERROR', payload: errorId })
}
