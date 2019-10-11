export type TUserResponse = {
  urn: string
  name: string
  userName: string
}

export type TUser = {
  id: string
  name: string
  userName: string
}

export type TBranchState = {
  users: { [userUrn: string]: TUser }
  patients: { [userUrn: string]: TUser }
}

export type TAction =
  { type: 'USER_FETCHED', payload: TUser} |
  { type: 'PATIENT_ADDED', payload: TUser }
