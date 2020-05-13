import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Media from 'react-bootstrap/Media'
import FormInput from 'components/FormInput'
import strings from './NotSignedIn.strings'
import { useMutation, gql } from '@apollo/client'
import * as icons from '@fortawesome/free-solid-svg-icons'
import onKeyDown from 'util/onKeyDown'

const NotSignedInPage: React.FC = () => {
  const [ requestAuthCode, { data, loading, error }] = useMutation(REQUEST_AUTH_CODE, { onError: console.error })
  const [ input, setInput ] = useState('')

  const onAuthenticateClick = async () => {
    requestAuthCode({ variables: {
      email: isEmail(input) ? input : undefined,
      phone: isPhone(input) ? input : undefined
    }})
  }

  const inputIcon = isPhone(input)
    ? icons.faHashtag
    : isEmail(input)
      ? icons.faAt
      : icons.faSpinner

  let successText = ''

  if (data && isPhone(input)) successText = `We've texted a link to ${input}.`
  if (data && isEmail(input)) successText = `We've emailed a link to ${input}.`

  return (
    <Container>
      <Media className='justify-content-between mt-5 p-5 text-center'>
        <Image width={300} height={340} src="/Hover-v2.gif"/>
        <Media.Body className='align-self-center'>
          <h1>{strings('welcomeToMilli')}</h1>

          <div className='mt-5' onKeyDown={onKeyDown('Enter', onAuthenticateClick)}>
            <FormInput
              label="Enter your email or your phone number to get started."
              type="tel"
              icon={inputIcon}
              onChange={setInput}
              value={input}/>
          </div>

          <p className='text-danger'>{error?.graphQLErrors?.[0]?.message || error?.message}</p>
          <p className='text-success'>{successText}</p>

          <Button block size='lg' onClick={onAuthenticateClick}>
            { loading ? <Spinner animation="grow"/> : 'Get link' }
          </Button>

        </Media.Body>
      </Media>
    </Container>
  )
}

export default NotSignedInPage

const REQUEST_AUTH_CODE = gql`
  mutation RequestAuthCode($email:String, $phone:String) {
    requestAuthCode(email: $email, phone: $phone)
  }
`

const isPhone = (text: string): Boolean => {
  return !!text.length && text.split('').every(char => !isNaN(Number(char)))
}

const isEmail = (text: string): Boolean => {
  // eslint mistakes characters in the regex for Things It Doesn't Like.
  // eslint-disable-next-line
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(text)
}
