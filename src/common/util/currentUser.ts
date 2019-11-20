import store from 'common/store'

const currentUser = () => {
  const { user, auth } = store.getState()
  return user.users[auth.userUrn]
}

export default currentUser
