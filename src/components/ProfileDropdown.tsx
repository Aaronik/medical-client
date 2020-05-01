import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Avatar from 'components/Avatar'
import { TUser, TUserRole } from 'types/User.d'
import strings from './ProfileDropdown.strings'

const SIGN_OUT = gql`
  mutation {
    deauthenticate
  }
`

const UPDATE_ROLE = gql`
  mutation UpdateMe($user: MeInput) {
    updateMe(user: $user) {
      role
    }
  }
`

interface IProps {
  user?: TUser
}

const ProfileDropdown: React.FunctionComponent<IProps> = ({ user }) => {

  const history = useHistory()

  const [ signout, { loading, client }] = useMutation(SIGN_OUT, { onError: console.error })
  const [ updateRole ] = useMutation(UPDATE_ROLE, { onError: console.error })

  const onSignoutPress = async () => {
    if (!user) return
    signout()
    localStorage.clear()
    client?.resetStore()
    history.push('/')
  }

  const headerText = () => {
    if (!user) return ""
    const { name, role } = user
    return `${name} (${role})`
  }

  const changeRole = (role: TUserRole) => {
    if (!user) return
    const updatedUser = Object.assign({}, user, { role })
    const key = 'User:' + user.id
    client?.writeData({ data: { [key]: updatedUser }})
    updateRole({ variables: {user: { role }}})
    history.push('/')
  }

  return (
    <NavDropdown bsPrefix='d-flex text-decoration-none text-black-50 align-items-center' drop="left" id="auth-dropdown" className='clickable' title={
      user ? <Avatar user={user} size={40} onClick={() => {}}/> : strings('profile')}
    >
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item target="_blank" href="https://millihealth.com">{strings('about')}</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={onSignoutPress}>{
        loading ? <Spinner animation='grow'/> : strings('signOut')
      }</NavDropdown.Item>
    </NavDropdown>
  )
}

export default ProfileDropdown
