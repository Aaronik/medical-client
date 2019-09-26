export type TDiscoveryHost = {
  hostUrl: string
  port: number
  token: string
  secure: boolean
  fullUrl: string
}

export type TDiscoveryResponse = {
  hosts: TDiscoveryHost[]
  serviceToken: string
  serviceMap: object // Docs are unclear on this
  unannounced: boolean
}

export type TAuthenticationResponse = {
  expiresAt: number
  sessionToken64: string
  userNameHash64: string
  reasonCode: 'NONE'
  validity: 'VALID'
}

export type TLogoutResponse = {
  message: string
}

export type TBranchState = {
  token: string
  apiUrl: string
  sampleResponse: any
}

export type TAction =
  { type: 'LOGIN_1', payload: types.TDiscoveryResponse } |
  { type: 'LOGIN_2', payload: any } |
  { type: 'LOGIN_3', payload: types.TAuthenticationResponse } |
  { type: 'LOGOUT', payload: types.TLogoutResponse }

