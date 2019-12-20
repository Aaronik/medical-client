import React from 'react'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Media from 'react-bootstrap/Media'
import strings from './NotSignedIn.strings'

const NotSignedInContainer = () => {
  return (
    <Container>
      <Media className='justify-content-between mt-5 p-5 text-center'>
        <Image width={300} height={340} src="/Hover-v2.gif"/>
        <Media.Body className='align-self-center'>
          <h1>{strings('welcomeToMilli')}</h1>
          <h3>{strings('signInToGetStarted')}</h3>
        </Media.Body>
      </Media>
    </Container>
  )
}

export default NotSignedInContainer
