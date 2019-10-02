import { safely } from 'util/action'
import store, { dispatch } from 'store'
import api from 'api'
import * as T from 'user/types.d'

export const fetchUser = async () => {
  const resp = await safely<T.TUserResponse>(api({
    url: '/flagship/api/users/get?milliUserUrn=' + store.getState().auth.userUrn
  }))

  dispatch({ type: 'USER_FETCHED', payload: resp.data })
}
