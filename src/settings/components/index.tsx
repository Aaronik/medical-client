import React from 'react'
import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'

import strings from 'common/strings'

type TProps = {

}

const SettingsPage: React.FC<TProps> = () => {

  const appId = () => process.env.REACT_APP_VERSION && process.env.REACT_APP_VERSION.slice(0, 6)

  return (
    <Container className='p-5'>
      <ListGroup>
        <ListGroup.Item className='d-flex justify-content-between'>
          <div>{strings('version')}</div>
          <div>{appId()}</div>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  )
}

export default SettingsPage
