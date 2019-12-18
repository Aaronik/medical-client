import { ActionKeys } from 'common/actionKeys'

export type TUser = {
  id: string
  name: string
  userName: string
  type: TUserType
  imageUrl?: string
  birthday?: string
  joinDate?: string
  lastVisit?: string
  adherence?: number
}

export type TInvitationResponse = {
  codeName: 'SUCCESS'
  code: 0
  data: null
  message: string
}

// API user
export type TUserResponse = {
  urn: string
  name: string
  userName: string
}

export type TUserType = 'ADMIN' | 'DOCTOR' | 'PATIENT'

export type TBranchState = {
  invitationLoading: boolean
  users: {
    [userId: string]: TUser
  }
  activePatientId: string | false
}

export type TAction =
  { type: ActionKeys.USER_FETCHED, payload: TUser} |
  { type: ActionKeys.PATIENT_ADDED, payload: TUser } |
  { type: ActionKeys.INVITATION_LOADING } |
  { type: ActionKeys.INVITATION_FINISHED } |
  { type: ActionKeys.SET_ACTIVE_USER, payload: string | false } |
  { type: ActionKeys.CHANGE_USER_TO_ADMIN, payload: string } |
  { type: ActionKeys.CHANGE_USER_TO_PATIENT, payload: string } |
  { type: ActionKeys.CHANGE_USER_TO_DOCTOR, payload: string }
