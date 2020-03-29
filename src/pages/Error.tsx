import React, { useState } from 'react'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import ListGroupItem from 'react-bootstrap/ListGroupItem'
import { ApolloError } from '@apollo/client'
import strings from './Error.strings'

type ErrorProps = {
  error: ApolloError
}

const ErrorPage: React.FC<ErrorProps> = ({ error }) => {

  const [ isCollapsed, setIsCollapsed ] = useState(true)

  // This should not need type casting, this is a shortcoming of how Object.keys is typed.
  const keyComponents = (Object.keys(error) as (keyof ApolloError)[]).map(key => <ErrorKeyItem key={key} property={key} error={error}/>)

  return (
    <Container className='mt-5'>
      <h2>{strings('errorTitle')}</h2>
      <hr/>
      <Card>
        <Card.Header className='text-danger clickable' onClick={() => setIsCollapsed(!isCollapsed)}>
          {error.message}
        </Card.Header>

        { isCollapsed ||
          <Card.Body>
            <ListGroup>
              { keyComponents }
            </ListGroup>
          </Card.Body>
        }
      </Card>
    </Container>
  )
}

export default ErrorPage

type ErrorKeyItemProps = {
  property: keyof ApolloError
  error: ApolloError
}

const ErrorKeyItem: React.FC<ErrorKeyItemProps> = ({ property, error }) => {
  return (
    <ListGroupItem>
      <p className='text-danger'>{property}: {JSON.stringify(error[property])}</p>
    </ListGroupItem>
  )
}
