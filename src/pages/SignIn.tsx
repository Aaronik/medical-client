import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import * as icons from '@fortawesome/free-solid-svg-icons'
import FormInput from 'components/FormInput'
import Fade from 'components/Fade'
import './SignIn.sass'
import strings from './SignIn.strings'
import onKeyDown from 'util/onKeyDown'
import { useMutation, gql } from '@apollo/client'

interface TProps {
}

const Signin: React.FunctionComponent<TProps> = () => {

  return (
    <Container fluid className='pt-5 signin bg-primary with-background'>
      <Fade>
        <Row className='justify-content-center mt-5'>
          <Col lg={4} md={8} sm={8} xs={11} className='text-center pane'>
            <Container>
              <SigninForm/>
            </Container>
          </Col>
        </Row>
      </Fade>
    </Container>
  )
}

export default Signin

// This is abstracted rather than inlined solely because of the limitation on <Fade>
// not being able to handle children that take props.
const SigninForm = () => {
  const [ requestAuthCode, { data, loading, error }] = useMutation(REQUEST_AUTH_CODE, { onError: console.error })

  const [ email, setEmail ] = useState('')
  const [ phone, setPhone ] = useState('')

  const onAuthenticateClick = async () => {
    requestAuthCode({ variables: { email, phone }})
  }

  return (
    <React.Fragment>
      <Row className='p-4'>
        <h3>{strings('signIn')}</h3>
      </Row>
      <Row className='p-4 text-left'>
        <Form className="w-100 d-flex flex-column" onKeyDown={onKeyDown('Enter', onAuthenticateClick)}>

          <FormInput
            label="Email"
            type="email"
            icon={icons.faAt}
            onChange={setEmail}
            value={email}/>

          <span className='text-center'>-- or --</span>

          <FormInput
            label="Phone number"
            type="tel"
            icon={icons.faHashtag}
            onChange={setPhone}
            value={phone}/>

        </Form>
      </Row>
      <p className='text-danger'>{error?.graphQLErrors?.[0]?.message || error?.message}</p>
      <p className='text-success'>{data && 'Link sent successfully!'}</p>
      <Row className='p-4'>
        <Button block size='lg' onClick={onAuthenticateClick}>
          { loading ? <Spinner animation="grow"/> : 'Get link' }
        </Button>
      </Row>
    </React.Fragment>
  )
}

const REQUEST_AUTH_CODE = gql`
  mutation RequestAuthCode($email:String, $phone:String) {
    requestAuthCode(email: $email, phone: $phone)
  }
`
