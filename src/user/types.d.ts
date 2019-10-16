export type TUserResponse = {
  urn: string
  name: string
  userName: string
}

export type TUserType = 'ADMIN' | 'DOCTOR' | 'PATIENT'

export type TUser = {
  id: string
  name: string
  userName: string
  type: TUserType
}

export type TBranchState = {
  [userId: string]: TUser
}

export type TAction =
  { type: 'USER_FETCHED', payload: TUser} |
  { type: 'PATIENT_ADDED', payload: TUser } |
  { type: 'CHANGE_USER_TO_ADMIN', payload: string } |
  { type: 'CHANGE_USER_TO_PATIENT', payload: string } |
  { type: 'CHANGE_USER_TO_DOCTOR', payload: string }
