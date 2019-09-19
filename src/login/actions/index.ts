import axios from 'axios'

import { dispatch } from '../../store'

export const loginWhatever = async () => {
  const resp = await axios({
    url: 'http://ec2-18-188-238-37.us-east-2.compute.amazonaws.com:9000',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
  })
  dispatch({ type: 'LOGIN_1', payload: resp })
}
