import uuid from 'uuid/v4'
import { safely } from 'util/action'
import store, { dispatch } from 'store'
import api from 'api'
import * as T from 'user/types.d'
import { TPatientInfo } from 'doctor-dashboard/types.d'

export const fetchUser = async () => {
  const resp = await safely<T.TUserResponse>(api({
    url: '/flagship/api/users/get?milliUserUrn=' + store.getState().auth.userUrn
  }))

  dispatch({ type: 'USER_FETCHED', payload: resp.data })
}

export const addPatient = async (patientInfo: TPatientInfo) => {
  const payload = {
    name: [patientInfo.name.first, patientInfo.name.middle, patientInfo.name.last].join(' '),
    userUrn: uuid(),
    userName: ''
  }
  dispatch({ type: 'PATIENT_ADDED', payload })
}
