import uuid from 'uuid/v4'
import { safely } from 'common/util/safely'
import store, { dispatch } from 'common/store'
import currentUser from 'common/util/currentUser'
import api from 'common/util/api'
import * as T from './User.d'
import { TPatientInfo } from 'pages/DoctorDashboard.d'
import { ActionKeys } from 'common/actionKeys'

export const fetchUser = async () => {
  const resp = await safely<T.TUserResponse>(api({
    url: '/flagship/api/users/get?milliUserUrn=' + store.getState().auth.userUrn
  }))

  const payload: T.TUser = {
    id: resp.data.urn,
    name: resp.data.name,
    userName: resp.data.userName,
    type: 'DOCTOR' // TODO when the server starts returning these types, add them here
  }

  dispatch({ type: ActionKeys.USER_FETCHED, payload })
}

export const addPatient = async (patientInfo: TPatientInfo) => {
  const payload: T.TUser = {
    name: [patientInfo.name.first, patientInfo.name.middle, patientInfo.name.last].join(' '),
    id: uuid(),
    userName: '',
    type: 'PATIENT'
  }

  dispatch({ type: ActionKeys.PATIENT_ADDED, payload })
}

type TUserInviteSig = { email: string, senderId: string, message: string }

export const inviteUser = async ({ email, senderId, message }: TUserInviteSig) => {
  dispatch({ type: ActionKeys.INVITATION_LOADING })

  const resp = safely<T.TInvitationResponse>(api({
    url: '/flagship/api/invite/send',
    method: 'POST',
    data: {
      emailAddress: email,
      sender: senderId,
      roleId: 2,
      message: message
    }
  }))

  resp.then(() => dispatch({ type: ActionKeys.ALERT, payload: { message: `Invitation successfully sent to ${email}!`, type: 'success' }}))
  resp.finally(() => dispatch({ type: ActionKeys.INVITATION_FINISHED }))
}

// When a doctor selects a user from the dropdown in the top left
export const setActiveUser = (userId: string | false) => {
  dispatch({ type: ActionKeys.SET_ACTIVE_USER, payload: userId })
}

// TODO this is temporary for demo purposes
export const makeMeAdmin = () => {
  dispatch({ type: ActionKeys.CHANGE_USER_TO_ADMIN, payload: currentUser().id })
}

// TODO this is temporary for demo purposes
export const makeMeDoctor = () => {
  dispatch({ type: ActionKeys.CHANGE_USER_TO_DOCTOR, payload: currentUser().id })
}

// TODO this is temporary for demo purposes
export const makeMePatient = () => {
  dispatch({ type: ActionKeys.CHANGE_USER_TO_PATIENT, payload: currentUser().id })
}
