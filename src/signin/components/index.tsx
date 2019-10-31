import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import InputGroup from 'react-bootstrap/InputGroup'
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import { TStoreState } from 'store'
import { authenticate } from 'auth/actions'
import { fetchUser } from 'user/actions'
import 'signin/styles/index.sass'

interface TProps extends RouteComponentProps {
}

const Signin: React.FunctionComponent<TProps> = ({ history }) => {

  const [ username, setUsername ] = useState('boomama')
  const [ password, setPassword ] = useState('11111')
  const [ isLoading, setIsLoading ] = useState(false)

  const onAuthenticateClick = async () => {
    setIsLoading(true)
    await authenticate(username, password)
    await fetchUser()
    history.push('/')
  }

  // There doesn't seem to be a good way to type changes with Form.Control
  // unfortunately.
  // https://github.com/react-bootstrap/react-bootstrap/issues/2781
  const onUsernameChange = (event: any) => {
    const username = event.currentTarget.value
    setUsername(username)
  }

  const onPasswordChange = (event: any) => {
    const password = event.currentTarget.value
    setPassword(password)
  }


  return (
    <Container fluid className='pt-5 signin bg-primary with-background'>
      <Row className='justify-content-center mt-5'>

        <Col lg={4} md={8} sm={8} xs={8} className='text-center pane'>
          <Container className=''>
            <Row className='p-4'>
              <h3>Sign In</h3>
            </Row>
            <Row className='p-4 text-left'>
              <Form className="w-100">

                <Form.Group>
                  <Form.Label className="text-muted">Email</Form.Label>
                  <InputGroup>
                    <Form.Control type="email" onChange={onUsernameChange} value={username}></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faAt} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-muted">Password</Form.Label>
                  <InputGroup>
                    <Form.Control type="password" onChange={onPasswordChange} value={password}></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faLock} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

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

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps<{ patientId: string }>): TProps => {
  return dispatchProps
})(Signin)
