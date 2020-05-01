import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as icons from '@fortawesome/free-solid-svg-icons'
import Spinner from 'react-bootstrap/Spinner'
import FormInput from 'components/FormInput'
import Fade from 'components/Fade'
import strings from './SignUp.strings'
import './SignUp.sass'
import { SIGNUP_MUTATION } from 'util/queries'
import { useSignin } from 'util/hooks'
import onKeyDown from 'util/onKeyDown'

interface TProps {
}

const Signup: React.FunctionComponent<TProps> = () => {

  return (
    <Container fluid className='pt-5 signup bg-primary with-background'>
      <Fade>
        <Row className='justify-content-center'>

          <Col lg={4} md={8} sm={8} xs={11} className='text-center pane-1'>
            <Container className='h-100 d-flex flex-column justify-content-around'>
              <Row className='justify-content-lg-between justify-content-md-center justify-content-sm-center justify-content-xs-center p-4'>
                <Image src="milli-logo.png" width={100} height={35}/>
              </Row>
              <Row className='justify-content-center'>
                <Image fluid src="signup-image.png" />
              </Row>
              <Row className='justify-content-center'>
                <h4 className='p-2'>{strings('milliBlurb')}</h4>
              </Row>
            </Container>
          </Col>

          <Col lg={4} md={8} sm={8} xs={11} className='text-center pane-2'>
            <SignupForm/>
          </Col>

        </Row>
      </Fade>
    </Container>
  )
}

export default Signup

// This is abstracted rather than inlined solely because of the limitation on <Fade>
// not being able to handle children that take props.
const SignupForm = () => {
  const [ signUp, { loading: signUpLoading, error: signUpError }] = useMutation(SIGNUP_MUTATION)
  const [ signIn, { loading: signInLoading, error: signInError }] = useSignin()

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ role, setRole ] = useState('')
  const [ customError, setCustomError ] = useState('')

  const onDoctorClick = () => setRole('DOCTOR')
  const onPatientClick = () => setRole('PATIENT')

  const onCreateClick = async () => {
    let error = '' // shortcut to circumvent async React setStates
    setCustomError(error = '')

    // Validate that the fields are viable before sending off to the server
    if (name === '') setCustomError(error = strings('noNameError'))
    if (email === '') setCustomError(error = strings('noEmailError'))
    if (password === '') setCustomError(error = strings('noPasswordError'))
    if (role === '') setCustomError(error = strings('noRoleError'))

    if (!!error) return

    signUp({ variables: { email, password, name, role }}).then(() => {
      signIn({ variables: { email, password }})
    }).catch(console.error)
  }

  return (
    <React.Fragment>
      <Container>
        <Row className='p-4'>
          <h3>{strings('createAccount')}</h3>
        </Row>
        <Row className='p-4 text-left'>
          <Form className="w-100" onKeyDown={onKeyDown('Enter', onCreateClick)}>

            <FormInput
              label={strings('fullName')}
              type="text"
              icon={icons.faUser}
              onChange={setName}
              value={name}/>

            <FormInput
              label={strings('email')}
              type="email"
              icon={icons.faAt}
              onChange={setEmail}
              value={email}/>

            <FormInput
              label={strings('password')}
              type="password"
              icon={icons.faLock}
              onChange={setPassword}
              value={password}/>

          </Form>
        </Row>
        <p className='text-danger'>{(signUpError || signInError)?.graphQLErrors?.[0]?.message || (signUpError || signInError)?.message || customError}</p>
        <Row className='d-flex justify-content-around'>
          <Button active={role === 'DOCTOR'} size='lg' onClick={onDoctorClick}>{strings('IAmADoctor')}</Button>
          <Button active={role === 'PATIENT'} size='lg' onClick={onPatientClick}>{strings('IAmAPatient')}</Button>
        </Row>
        <Row className='p-4'>
          <Button block size='lg' onClick={onCreateClick}>
            { (signUpLoading || signInLoading) ? <Spinner animation='grow'/> : strings('createAccount') }
          </Button>
        </Row>
      </Container>
    </React.Fragment>
  )
}
