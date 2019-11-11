import React from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Media from 'react-bootstrap/Media'
import strings from 'common/strings'

const NotSignedInContainer = () => {
  return (
    <Container>
      <Media className='justify-content-between p-5'>
        <Image width={555} height={555} src="Hover-v2.gif"/>
        <Media.Body className='align-self-center'>
          <h1>{strings('welcomeToMilli')}</h1>
          <h3>{strings('signInToGetStarted')}</h3>
        </Media.Body>
      </Media>
    </Container>
  )
}

export default NotSignedInContainer
