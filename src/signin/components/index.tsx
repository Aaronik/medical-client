import React, { useState } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { connect } from 'react-redux'
import { TStoreState } from 'store'
import { authenticate } from 'auth/actions'
import { fetchUser } from 'user/actions'

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
    <Container>

      <Row className="p-5 justify-content-around">
        <h1>Sign In</h1>
      </Row>

      <Row className="justify-content-around">
        <Form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              size="lg"
              placeholder="Enter Username"
              value={username}
              onChange={onUsernameChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              size="lg"
              placeholder="Enter Password"
              value={password}
              onChange={onPasswordChange}
            />
          </Form.Group>
        </Form>
      </Row>

      <Row className="p-b5 justify-content-around">
        <Button size="lg" onClick={onAuthenticateClick}>
          { isLoading ? <Spinner animation="grow"/> : "Sign In" }
        </Button>
      </Row>
    </Container>
  )
}

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps<{ patientId: string }>): TProps => {
  return dispatchProps
})(Signin)
