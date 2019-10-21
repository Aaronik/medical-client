import { ActionKeys } from 'common/action-keys'
import axios from 'axios'
import { dispatch } from 'store'
import * as T from 'auth/types.d'
import { safely } from 'util/safely'
import api from 'api'

export const loadHostMap = async () => {
  const discoveryServiceUrl =
    'http://ec2-3-19-237-167.us-east-2.compute.amazonaws.com:9000' + // dev
    // 'http://ec2-18-191-250-56.us-east-2.compute.amazonaws.com:9000' + // staging
    '/api/milli/dynamicdiscovery/mesh/hosts?serviceKey=flagship'


  const resp = await safely<T.TDiscoveryResponse>(axios(discoveryServiceUrl))

  // No hosts were returned. We can't continue, so all we can do is show an error.
  if (resp.data.hosts.length === 0) return dispatch({ type: ActionKeys.ALERT, payload: {
    message: 'Fatal error: Discovery returned an empty host map. Please try using the service again later.',
    type: 'danger'
  }})

  dispatch({ type: ActionKeys.LOADED_HOST_MAP, payload: resp.data })
}

export const authenticate = async (username: string, password: string) => {
  const authString = btoa(`${username}:${password}`)

  const resp = await safely<T.TAuthenticationResponse>(api({
    url: '/flagship/api/authenticate',
    headers: { 'Authorization': 'Basic ' + authString },
    method: 'POST',
    data: {}
  }))

  const payload = {
    ...resp.data,
    csrfToken: resp.headers['csrf-token'],
    milliAtToken: resp.headers['milli-at']
  }

  dispatch({ type: ActionKeys.AUTHENTICATED, payload })
}

export const logout = async () => {
  const resp = await safely<T.TLogoutResponse>(api({
    url: '/flagship/api/logout',
    method: 'DELETE',
    data: {}
  }))

  dispatch({ type: ActionKeys.LOGOUT, payload: resp.data })
}
