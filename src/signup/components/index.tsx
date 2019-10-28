import React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as icons from '@fortawesome/free-solid-svg-icons'
// import Spinner from 'react-bootstrap/Spinner'
import { connect } from 'react-redux'
import { TStoreState } from 'store'

interface TProps extends RouteComponentProps {
}

const Signup: React.FunctionComponent<TProps> = ({ history }) => {

  return (
    <Container fluid className='pt-5 signup bg-primary with-background'>
      <Row className='justify-content-center'>

        <Col lg={4} md={8} sm={8} xs={8 }className='text-center pane-1'>
          <Container className='h-100 d-flex flex-column justify-content-around'>
            <Row className='justify-content-lg-between justify-content-md-center justify-content-sm-center justify-content-xs-center p-4'>
              <Image src="milli-logo.png" width={100} height={35}/>
            </Row>
            <Row className='justify-content-center'>
              <Image fluid src="signup-image.png" />
            </Row>
            <Row className='justify-content-center'>
              <h4 className='p-2'>
                self-teaching personalized medical intelligence platform built from real-time analysis of millions of patient/doctor interactions.
              </h4>
            </Row>
          </Container>
        </Col>

        <Col lg={4} md={8} sm={8} xs={8} className='text-center pane-2'>
          <Container className=''>
            <Row className='p-4'>
              <h3>Create your Account</h3>
            </Row>
            <Row className='p-4 text-left'>
              <Form className="w-100">

                <Form.Group>
                  <Form.Label className="text-muted">Full Name</Form.Label>
                  <InputGroup>
                    <Form.Control type="text"></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faUser} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-muted">Email</Form.Label>
                  <InputGroup>
                    <Form.Control type="email"></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faAt} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-muted">Business URL</Form.Label>
                  <InputGroup>
                    <Form.Control type="text"></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faGlobe} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="text-muted">Password</Form.Label>
                  <InputGroup>
                    <Form.Control type="password"></Form.Control>
                    <InputGroup.Append><InputGroup.Text><FontAwesomeIcon icon={icons.faLock} /></InputGroup.Text></InputGroup.Append>
                  </InputGroup>
                </Form.Group>

              </Form>
            </Row>
            <Row className='p-4'>
              <Button block size='lg'>Create Account</Button>
            </Row>
          </Container>
        </Col>

      </Row>
    </Container>
  )
}

export default connect((storeState: TStoreState, dispatchProps: RouteComponentProps<{ patientId: string }>): TProps => {
  return dispatchProps
})(Signup)
