import { ActionKeys } from 'common/actionKeys'

export type TUser = {
  id: string
  name: string
  userName: string
  role: TUserRole
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

export type TUserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT'
