import { dispatch } from 'store'
import { AxiosResponse } from 'axios'
import errorMap from 'common/error-map'

// Helper to wrap axios calls in standard error handling practice
// Pass in the type of the expected response
export const safely = async <T>(axiosPromise: Promise<AxiosResponse<T>>) => {
  axiosPromise.catch(err => {
    const errString = errorMap[err.message] || `${err.name}: ${err.message}`
    dispatch({ type: 'ALERT', payload: { message: errString, type: 'danger' }})
  })

  return axiosPromise
}

