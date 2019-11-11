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
import strings from 'common/strings'

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
        <h1>{strings('doctorProfile', user.name)}</h1>
      </Row>

      <Form className="pt-5">
        <Form.Row>
          <FormInput label={strings('email')} type="email" placeholder={strings('email')} />
          <FormInput label={strings('password')} type="password" placeholder={strings('password')} />
        </Form.Row>

        <Form.Row>
          <FormInput label={strings('address')} type="text" placeholder={strings('streetPlaceholder')} />
        </Form.Row>

        <Form.Row>
          <FormInput label={strings('address2')} type="text" placeholder={strings('apartmentPlaceholder')} />
        </Form.Row>

        <Form.Row>
          <FormInput label={strings('city')} type="text" placeholder={strings('cityPlaceholder')} />
          <FormInput label={strings('state')} type="text" placeholder={strings('statePlaceholder')} />
          <FormInput label={strings('zip')} type="text" placeholder={strings('zipPlaceholder')} />
          <FormInput label={strings('password')} type="password" placeholder={strings('password')} />
        </Form.Row>

        <Button variant="primary">
          {strings('update')}
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
