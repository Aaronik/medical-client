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
  sessionToken: string
  userUrn: string
  isValid: boolean

  // https://www.google.com/url?q=https://docs.google.com/a/millihealth.com/document/d/1kPd3eI04tKsgPmk58aBWtpH-A1TPYVwdVjKU_lwBolo/edit?disco%3DAAAADzm_1Ww%26usp%3Dcomment_email_discussion%26usp_dm%3Dtrue%26ts%3D5d8e23a1&source=gmail&ust=1569956270956000&usg=AFQjCNFk1BFmnbIodv7Ewto4WXguho6opA
  reasonCode:
    'NONE' |
    'CREDENTIALS_NOT_VERIFIED' |
    'CREDENTIAL_MISMATCH' |
    'USER_AMBIGUITY_ERROR' |
    'INVALID_AUTHENTICATION_REQUEST' |
    'NOT_AUTHORIZED'
}

export type TLogoutResponse = {
  message: string
  expiresAt: -1,
  sessionToken64: "",
  userNameHash64: "",
  reasonCode: 'LOGGED_OUT',
  valididty: 'INVALID'
}

export type TBranchState = {
  sessionToken: string
  apiUrl: string
  userUrn: string
  csrfToken: string
  milliAtToken: string
}

export type TAction =
  { type: 'LOADED_HOST_MAP', payload: TDiscoveryResponse } |
  { type: 'AUTHENTICATED', payload: TAuthenticationResponse & { csrfToken: string, milliAtToken: string } } |
  { type: 'LOGOUT', payload: TLogoutResponse }

