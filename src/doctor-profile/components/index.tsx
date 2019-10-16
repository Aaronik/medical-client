import React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import { TStoreState } from 'store'
import { TUser } from 'user/types.d'
import 'App.scss'

interface IProps extends RouteComponentProps {
  user: TUser
}

const DoctorProfile: React.FunctionComponent<IProps> = ({ user, history }) => {

  return (
    <Container>
      <Row className="pt-5">
        <h1>Doctor Profile: { user.name }</h1>
      </Row>

      <Form className="pt-5">
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
        </Form.Row>

        <Form.Group controlId="formGridAddress1">
          <Form.Label>Address</Form.Label>
          <Form.Control placeholder="1234 Main St" />
        </Form.Group>

        <Form.Group controlId="formGridAddress2">
          <Form.Label>Address 2</Form.Label>
          <Form.Control placeholder="Apartment, studio, or floor" />
        </Form.Group>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Control />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control />
          </Form.Group>
        </Form.Row>

        <Button variant="primary">
          Update
        </Button>
      </Form>
    </Container>
  )
}

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps): IProps => {
  return {
    ...dispatchProps,
    user: storeState.user[storeState.auth.userUrn]
  }
})(DoctorProfile)
