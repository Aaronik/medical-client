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

interface IProps extends RouteComponentProps {
  user: TUser
}

const FormInput: React.FC<{ label: string, type: string, placeholder: string }> = ({ label, type, placeholder }) => (
  <Form.Group as={Col}>
    <Form.Label>{label}</Form.Label>
    <Form.Control type={type} placeholder={placeholder}/>
  </Form.Group>
)

const DoctorProfile: React.FunctionComponent<IProps> = ({ user, history }) => {

  return (
    <Container>
      <Row className="pt-5">
        <h1>Doctor Profile: { user.name }</h1>
      </Row>

      <Form className="pt-5">
        <Form.Row>
          <FormInput label="Email" type="email" placeholder="Enter email" />
          <FormInput label="Password" type="password" placeholder="Password" />
        </Form.Row>

        <Form.Row>
          <FormInput label="Address" type="text" placeholder="1234 Main St" />
        </Form.Row>

        <Form.Row>
          <FormInput label="Address 2" type="text" placeholder="Apartment, studio, or floor" />
        </Form.Row>

        <Form.Row>
          <FormInput label="City" type="text" placeholder="New City'sbergville" />
          <FormInput label="State" type="text" placeholder="CA" />
          <FormInput label="Zip" type="text" placeholder="12345" />
          <FormInput label="Password" type="password" placeholder="Password" />
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
    user: storeState.user.users[storeState.auth.userUrn]
  }
})(DoctorProfile)
