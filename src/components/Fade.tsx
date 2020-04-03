import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'

const TIMEOUT_DURATION = 80 // Just looked like best balance of silky smooth and stop delaying me.

// Wrap this around any views and they'll fade in and out when mounting / unmounting.
// I tried using <ReactCSSTransitionGroup> and <Transition> but I could not get them to work.
// This solution seems to work just fine.

const Fade: React.FC<{}> = ({ children }) => {
  const [ className, setClassName ] = useState('fade')
  const [ newChildren, setNewChildren ] = useState(children)

  useEffect(() => {
    setClassName('fade')

    const timerId = setTimeout(() => {
      setClassName('fade show')
      setNewChildren(children)
    }, TIMEOUT_DURATION)

    return () => {
      clearTimeout(timerId)
    }

  }, [children])

  return <Container fluid className={className + ' p-0'}>{newChildren}</Container>
}


export default Fade
