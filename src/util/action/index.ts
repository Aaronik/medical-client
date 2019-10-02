import { dispatch } from 'store'
import { AxiosResponse } from 'axios'

// Helper to wrap axios calls in standard error handling practice
// Pass in the type of the expected response
export const safely = async <T>(axiosPromise: Promise<AxiosResponse<T>>) => {
  axiosPromise.catch(err => {
    const errString = JSON.stringify(err, null, 2)
    dispatch({ type: 'ERROR', payload: errString })
  })

  return axiosPromise
}

