import axios, { AxiosResponse } from 'axios'
import store, { dispatch, TDiscoveryResponse, TAuthenticationResponse, TLogoutResponse } from '../../store'

const SERVER_ACCEPTED_PROTOCOL = 'http'
const DISCOERY_URL = "ec2-3-19-237-167.us-east-2.compute.amazonaws.com:9000"

const getApiUrl = () => store.getState().auth.apiUrl
const getApiToken = () => store.getState().auth.token

// returns the discovery service url, we use this to load the host map
const getDiscoveryServiceUrl = (path: string): string => {
  return SERVER_ACCEPTED_PROTOCOL + '://' + DISCOERY_URL + path
}

// returns a full url from the selected flagship host
const constructApiUrl = (path: string): string => {
  return SERVER_ACCEPTED_PROTOCOL + '://' + getApiUrl() + path
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
  const resp = await safely<TDiscoveryResponse>(axios({
    url: getDiscoveryServiceUrl("/api/milli/dynamicdiscovery/mesh/hosts?serviceKey=flagship"),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/jsoncharset=UTF-8'
    },
    method: "get",
    withCredentials: true
  }))

  dispatch({ type: 'LOGIN_1', payload: resp.data })
}

export const getToken = async () => {
  // Response is ambiguous, waiting on Bow for types
  const resp = await safely(axios({
    url: constructApiUrl('/token'),
    headers: {
      'Accept': 'application/json text/html',
      'Content-Type': 'application/jsoncharset=UTF-8',
    },
    method: "get",
    withCredentials: true
  }))

  dispatch({ type: 'LOGIN_2', payload: resp.data })
}

export const authenticate = async (username: string, password: string) => {
  const authString = btoa(`${username}:${password}`)

  const resp = await safely<TAuthenticationResponse>(axios({
    url: constructApiUrl('/flagship/api/authenticate'),
    headers: {
      'Authorization': 'Basic ' + authString,
      'Accept': 'application/json text/html',
      'Content-Type': 'application/json charset=UTF-8',
    },
    method: "post",
    data: { x: '1' }, // API will puke apparently without any data
    withCredentials: true,
  }))

  dispatch({ type: 'LOGIN_3', payload: resp.data })
}

export const logout = async () => {
  const resp = await safely<TLogoutResponse>(axios({
    url: constructApiUrl('/flagship/api/logout'),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'multipart/form-data',
      'Session-Token': getApiToken()
    },
    data: { x: 1 },
    method: "delete",
    withCredentials: true,
  }))

  dispatch({ type: 'LOGOUT', payload: resp.data })
}
