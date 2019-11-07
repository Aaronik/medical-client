import { ActionKeys } from 'common/action-keys'

export type TAction =
  { type: ActionKeys.TOGGLE_GUTTER_NAV }

export type TBranchState = {
  gutterNavActive: boolean
}
