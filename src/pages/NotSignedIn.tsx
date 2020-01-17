import React from 'react'
import { connect } from 'react-redux'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Media from 'react-bootstrap/Media'
import Spinner from 'react-bootstrap/Spinner'
import strings from './NotSignedIn.strings'
import { TStoreState } from 'common/store'

type TProps = {
  isLoading: boolean
}

const NotSignedInPage: React.FC<TProps> = ({ isLoading }) => {
  if (isLoading) return <Container className='text-center mt-5'><Spinner className='mt-5' variant='primary' animation='grow'/></Container>

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

export default connect((storeState: TStoreState) => {
  return {
    isLoading: storeState.auth.authenticating
  }
})(NotSignedInPage)

