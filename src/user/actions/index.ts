import uuid from 'uuid/v4'
import { safely } from 'util/safely'
import store, { dispatch, currentUser } from 'store'
import api from 'api'
import * as T from 'user/types.d'
import { TPatientInfo } from 'doctor-dashboard/types.d'

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

  dispatch({ type: 'USER_FETCHED', payload })
}

export const addPatient = async (patientInfo: TPatientInfo) => {
  const payload: T.TUser = {
    name: [patientInfo.name.first, patientInfo.name.middle, patientInfo.name.last].join(' '),
    id: uuid(),
    userName: '',
    type: 'PATIENT'
  }
  dispatch({ type: 'PATIENT_ADDED', payload })
}

// TODO this is temporary for demo purposes
export const makeMeAdmin = () => {
  dispatch({ type: 'CHANGE_USER_TO_ADMIN', payload: currentUser().id })
}

// TODO this is temporary for demo purposes
export const makeMeDoctor = () => {
  dispatch({ type: 'CHANGE_USER_TO_DOCTOR', payload: currentUser().id })
}

// TODO this is temporary for demo purposes
export const makeMePatient = () => {
  dispatch({ type: 'CHANGE_USER_TO_PATIENT', payload: currentUser().id })
}
