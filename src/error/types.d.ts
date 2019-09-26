export type TError = {
  id: string
  message: string
}

export type TAction =
  { type: 'ERROR', payload: string } |
  { type: 'CLEAR_ERRORS' } |
  { type: 'CLEAR_ERROR', payload: string }

export type TBranchState = TError[]
