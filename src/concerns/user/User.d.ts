import { ActionKeys } from 'common/actionKeys'

export type TInvitationResponse = {
  codeName: 'SUCCESS'
  code: 0
  data: null
  message: string
}

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
  invitationLoading: boolean
  users: {
    [userId: string]: TUser
  }
}

export type TAction =
  { type: ActionKeys.USER_FETCHED, payload: TUser} |
  { type: ActionKeys.PATIENT_ADDED, payload: TUser } |
  { type: ActionKeys.INVITATION_LOADING } |
  { type: ActionKeys.INVITATION_FINISHED } |
  { type: ActionKeys.CHANGE_USER_TO_ADMIN, payload: string } |
  { type: ActionKeys.CHANGE_USER_TO_PATIENT, payload: string } |
  { type: ActionKeys.CHANGE_USER_TO_DOCTOR, payload: string }
