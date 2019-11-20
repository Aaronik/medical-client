import store from 'common/store'

export const isSignedIn = () => (
  !!store.getState().auth.milliAtToken
)
