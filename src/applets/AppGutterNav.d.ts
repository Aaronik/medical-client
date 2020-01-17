import { ActionKeys } from 'common/actionKeys'

export type TAction =
  { type: ActionKeys.TOGGLE_GUTTER_NAV }

export type TBranchState = {
  gutterNavActive: boolean
}
