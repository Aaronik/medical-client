// This is a helper to get all the kinds of a user of a particular type
// from the store

import store from 'common/store'
import { TUserType } from 'concerns/user/User.d'

const filterUsersByType = (userType: TUserType) => {
  return Object.values(store.getState().user.users).filter(u => u.type === userType)
}

export const patients = () => {
  return filterUsersByType('PATIENT')
}

export const doctors = () => {
  return filterUsersByType('DOCTOR')
}

