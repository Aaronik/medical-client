import axios, { AxiosRequestConfig } from 'axios'

import store from 'store'

const getApiUrl = () => store.getState().auth.apiUrl
const getApiToken = () => store.getState().auth.sessionToken
const getCsrfToken = () => store.getState().auth.csrfToken
const getMilliAtToken = () => store.getState().auth.milliAtToken

// This is a wrapper around axios to simplifier / DRY up api requests.
// It:
// * provides correct base URL
// * adds requisite auth headers
const api = (config: AxiosRequestConfig) => (
  axios(Object.assign({}, config, {
    url: 'http://' + getApiUrl() + config.url,
    withCredentials: true,
    headers: Object.assign({}, {
      'Session-Token': getApiToken(),
      'Csrf-Token': getCsrfToken(),
      'Milli-At': getMilliAtToken()
    }, config.headers)
  }))
)

export default api
