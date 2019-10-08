import axios from 'axios'
import { dispatch } from 'store'
import * as T from 'auth/types.d'
import { safely } from 'util/action'
import api from 'api'

export const loadHostMap = async () => {
  const discoveryServiceUrl =
    'http://ec2-3-19-237-167.us-east-2.compute.amazonaws.com:9000' +
    '/api/milli/dynamicdiscovery/mesh/hosts?serviceKey=flagship'


  const resp = await safely<T.TDiscoveryResponse>(axios(discoveryServiceUrl))

  dispatch({ type: 'LOADED_HOST_MAP', payload: resp.data })
}

export const authenticate = async (username: string, password: string) => {
  const authString = btoa(`${username}:${password}`)

  const resp = await safely<T.TAuthenticationResponse>(api({
    url: '/flagship/api/authenticate',
    headers: { 'Authorization': 'Basic ' + authString },
    method: 'POST',
    data: {}
  }))

  const payload = Object.assign(resp.data, {
    csrfToken: resp.headers['csrf-token']
  })

  dispatch({ type: 'AUTHENTICATED', payload })
}

export const logout = async () => {
  const resp = await safely<T.TLogoutResponse>(api({
    url: '/flagship/api/logout',
    method: 'DELETE',
    data: {}
  }))

  dispatch({ type: 'LOGOUT', payload: resp.data })
}
