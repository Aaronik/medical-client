import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'

// Wrap this around any views and they'll fade in when mounted. Not when unmounting.
// Tried using <ReactCSSTransitionGroup> and <Transition> and I
// just could not get it to work.

const Fade: React.FC<{}> = ({ children }) => {
  const [ className, setClassName ] = useState('fade')

  useEffect(() => setClassName('fade show'))

  return <Container fluid className={className + ' p-0'}>{children}</Container>
}


export default Fade
