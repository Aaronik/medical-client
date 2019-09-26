import axios, { AxiosResponse } from 'axios'
import store, { dispatch } from '../../store'
import * as T from '../types.d'

const getApiUrl = () => store.getState().auth.apiUrl
const getApiToken = () => store.getState().auth.sessionToken

// returns a full url from the selected flagship host
const constructApiUrl = (path: string): string => {
  return 'http://' + getApiUrl() + path
}

// Helper to wrap axios calls in standard error handling practice
// Pass in the type of the expected response
const safely = async <T>(axiosPromise: Promise<AxiosResponse<T>>) => {
  axiosPromise.catch(err => {
    const errString = JSON.stringify(err, null, 2)
    dispatch({ type: 'ERROR', payload: errString })
  })
  return axiosPromise
}

export const loadHostMap = async () => {
  const discoveryServiceUrl =
    'http://ec2-3-19-237-167.us-east-2.compute.amazonaws.com:9000' +
    '/api/milli/dynamicdiscovery/mesh/hosts?serviceKey=flagship'


  const resp = await safely<T.TDiscoveryResponse>(axios({
    url: discoveryServiceUrl,
    method: 'GET'
  }))

  dispatch({ type: 'LOADED_HOST_MAP', payload: resp.data })
}

export const authenticate = async (username: string, password: string) => {
  const authString = btoa(`${username}:${password}`)

  const resp = await safely<T.TAuthenticationResponse>(axios({
    url: constructApiUrl('/flagship/api/authenticate'),
    headers: { 'Authorization': 'Basic ' + authString },
    method: 'POST',
    data: {}
  }))

  dispatch({ type: 'AUTHENTICATED', payload: resp.data })
}

export const logout = async () => {
  const resp = await safely<T.TLogoutResponse>(axios({
    url: constructApiUrl('/flagship/api/logout'),
    headers: { 'Session-Token': getApiToken() },
    method: 'DELETE',
    data: {}
  }))

  dispatch({ type: 'LOGOUT', payload: resp.data })
}

export const fetchUser = async () => {
  const resp = await safely<any>(axios({
    url: constructApiUrl('/flagship/api/users/get?milliUserUrn=' + store.getState().auth.userUrn),
    method: 'GET'
  }))

  dispatch({ type: 'SAMPLE', payload: resp.data })
}
