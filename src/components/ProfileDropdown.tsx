import React from 'react'
import { useMutation, gql } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Spinner from 'react-bootstrap/Spinner'
import Avatar from 'components/Avatar'
import { TUser } from 'types/User.d'
import strings from './ProfileDropdown.strings'

const SIGN_OUT = gql`
  mutation {
    deauthenticate
  }
`

interface IProps {
  user?: TUser
}

const ProfileDropdown: React.FunctionComponent<IProps> = ({ user }) => {

  const history = useHistory()

  const [ signout, { loading, client }] = useMutation(SIGN_OUT, { onError: console.error })

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

  return (
    <NavDropdown bsPrefix='d-flex text-decoration-none text-black-50 align-items-center' drop="left" id="auth-dropdown" className='clickable' title={
      user ? <Avatar user={user} size={40} onClick={() => {}}/> : strings('profile')}
    >
      <NavDropdown.Header>{headerText()}</NavDropdown.Header>
      <NavDropdown.Divider/>
      <NavDropdown.Item target="_blank" href="">{strings('about')}</NavDropdown.Item>
      <NavDropdown.Divider/>
      <NavDropdown.Item onClick={onSignoutPress}>{
        loading ? <Spinner animation='grow'/> : strings('signOut')
      }</NavDropdown.Item>
    </NavDropdown>
  )
}

export default ProfileDropdown
