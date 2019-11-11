import React, { useState} from 'react'
import { RouteComponentProps } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import * as icons from '@fortawesome/free-solid-svg-icons'
// import Spinner from 'react-bootstrap/Spinner'
import FormInput from 'common/components/form-input'
import connectWithDispatch from 'util/connect-with-dispatch'
import strings from 'common/strings'
import 'signup/styles/index.sass'

interface TProps extends RouteComponentProps {
}

const Signup: React.FunctionComponent<TProps> = ({ history }) => {

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ businessUrl, setBusinessUrl ] = useState('')
  const [ password, setPassword ] = useState('')
  // const [ isLoading, setIsLoading ] = useState(false)



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
              <h4 className='p-2'>{strings('milliBlurb')}</h4>
            </Row>
          </Container>
        </Col>

        <Col lg={4} md={8} sm={8} xs={8} className='text-center pane-2'>
          <Container className=''>
            <Row className='p-4'>
              <h3>{strings('createAccount')}</h3>
            </Row>
            <Row className='p-4 text-left'>
              <Form className="w-100">

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
                  label={strings('businessUrl')}
                  type="text"
                  icon={icons.faGlobe}
                  onChange={setBusinessUrl}
                  value={businessUrl}/>

                <FormInput
                  label={strings('password')}
                  type="password"
                  icon={icons.faLock}
                  onChange={setPassword}
                  value={password}/>

              </Form>
            </Row>
            <Row className='p-4'>
              <Button block size='lg'>{strings('createAccount')}</Button>
            </Row>
          </Container>
        </Col>

      </Row>
    </Container>
  )
}

export default connectWithDispatch(Signup)
