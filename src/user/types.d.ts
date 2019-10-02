export type TUserResponse = {
  userUrn: string
  name: string
  userName: string
}

export type TBranchState = {
  name: string
  userName: string
}

export type TAction =
  { type: 'USER_FETCHED', payload: TUserResponse} |
  { type: 'LOGOUT' }
