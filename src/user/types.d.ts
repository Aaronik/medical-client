export type TUserResponse = {
  userUrn: string
  name: string
  userName: string
}

export type TUser = {
  userUrn: string
  name: string
  userName: string
}

export type TBranchState = {
  users: { [userUrn: string]: TUser }
  patients: { [userUrn: string]: TUser }
}

export type TAction =
  { type: 'USER_FETCHED', payload: TUserResponse} |
  { type: 'PATIENT_ADDED', payload: TUser }
