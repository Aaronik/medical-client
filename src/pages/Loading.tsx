import React from 'react'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'

const Loading = () => (
  <Container className='text-center mt-5'>
    <Spinner animation='grow' variant='primary'/>
  </Container>
)

export default Loading


