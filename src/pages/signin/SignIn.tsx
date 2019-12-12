import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { authenticate } from 'concerns/auth/Auth.actions'
import { fetchUser } from 'concerns/user/User.actions'
import FormInput from 'common/components/FormInput'
import connectWithDispatch from 'common/util/connectWithDispatch'
import './SignIn.sass'
import strings from './SignIn.strings'

interface TProps extends RouteComponentProps {
}

const Signin: React.FunctionComponent<TProps> = ({ history }) => {

  const [ email, setEmail ] = useState('boomama')
  const [ password, setPassword ] = useState('11111')
  const [ isLoading, setIsLoading ] = useState(false)

  const onAuthenticateClick = async () => {
    setIsLoading(true)
    await authenticate(email, password)
    await fetchUser()
    history.push('/')
  }

  return (
    <Container fluid className='pt-5 signin bg-primary with-background'>
      <Row className='justify-content-center mt-5'>

        <Col lg={4} md={8} sm={8} xs={11} className='text-center pane'>
          <Container className=''>
            <Row className='p-4'>
              <h3>{strings('signIn')}</h3>
            </Row>
            <Row className='p-4 text-left'>
              <Form className="w-100">

                <FormInput
                  label="Email"
                  type="email"
                  icon={icons.faAt}
                  onChange={setEmail}
                  value={email}/>

                <FormInput
                  label="password"
                  type="password"
                  icon={icons.faLock}
                  onChange={setPassword}
                  value={password}/>

              </Form>
            </Row>
            <Row className='p-4'>
              <Button block size='lg' onClick={onAuthenticateClick}>
                { isLoading ? <Spinner animation="grow"/> : "Sign In" }
              </Button>
            </Row>
          </Container>
        </Col>

      </Row>
    </Container>
  )
}

export default connectWithDispatch(Signin)
