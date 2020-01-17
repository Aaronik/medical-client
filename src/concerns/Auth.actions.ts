import { ActionKeys } from 'common/actionKeys'
import axios from 'axios'
import { dispatch } from 'common/store'
import * as T from './Auth.d'
import { safely } from 'common/util/safely'
import api from 'common/util/api'
import { fetchUser } from 'concerns/User.actions'

// temporary until we get better persistent signin
const saveUnamePass = async (username: string, password: string) => {
  const encryptedUsername = btoa(username)
  const encryptedPassword = btoa(password)

  await localStorage.setItem('username', encryptedUsername)
  await localStorage.setItem('password', encryptedPassword)
}

const getUnamePass = async () => {
  const encryptedUsername = await localStorage.getItem('username')
  const encryptedPassword = await localStorage.getItem('password')

  if (!encryptedPassword || !encryptedUsername) return { username: null, password: null }

  const username = atob(encryptedUsername)
  const password = atob(encryptedPassword)

  return { username, password }
}

const clearUnamePass = async () => {
  await localStorage.removeItem('username')
  await localStorage.removeItem('password')
}

export const loadHostMap = async () => {
  // Instruct the app that pre-flight stuff is happening
  dispatch({ type: ActionKeys.APP_LOADING })

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

  dispatch({ type: ActionKeys.APP_NOT_LOADING })
}

export const authenticate = async (username: string, password: string) => {
  // temporary until we get persistent auth
  await saveUnamePass(username, password)

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
  // temporary until we get persistent auth
  await clearUnamePass()

  const resp = await safely<T.TLogoutResponse>(api({
    url: '/flagship/api/logout',
    method: 'DELETE',
    data: {}
  }))

  dispatch({ type: ActionKeys.LOGOUT, payload: resp.data })
}

// Ok, if we have the persistent state needed to sign in, use it, and sign us in.
export const signInWithPersistentStateIfExists = async () => {
  // step 1: Search for persistent state.
  const { username, password } = await getUnamePass()

  if (!username || !password) return

  // step 2: If it exists, dispatch event instructing app to go into big loading page
  dispatch({ type: ActionKeys.APP_LOADING })

  // step 3: Authenticate and fetch the signed in user.
  await authenticate(username, password)
  await fetchUser()

  dispatch({ type: ActionKeys.APP_NOT_LOADING })
}
