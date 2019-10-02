import axios, { AxiosRequestConfig } from 'axios'

import store from 'store'

const getApiUrl = () => store.getState().auth.apiUrl
const getApiToken = () => store.getState().auth.sessionToken

// This is a wrapper around axios to simplifier / DRY up api requests.
// It gives the correct URL and adds the requisite auth headers to
// all api requests.
const api = (config: AxiosRequestConfig) => (
  axios(Object.assign({}, config, {
    url: 'http://' + getApiUrl() + config.url,
    headers: Object.assign({}, { 'Session-Token': getApiToken() }, config.headers)
  }))
)

export default api
