import { ActionKeys } from 'common/actionKeys'

export type TUser = {
  id: number
  name: string
  email: string
  role: TUserRole
  imageUrl?: string
  birthday?: string
  joinDate?: string
  lastVisit?: string
  adherence?: number
  patients?: TUser[]
  doctors?: TUser[]
}

export type TInvitationResponse = {
  codeName: 'SUCCESS'
  code: 0
  data: null
  message: string
}

export type TUserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT'
