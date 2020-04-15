import React from 'react'

// This is a helper for responding to keyboard events from within React
// components. Great for simulating form submit events without having to use
// <form>s and messing with submit defaults.
//
// Ex:
//
// <Modal.Body onKeyDown={onKeyDown('Enter', () => console.log('Enter was pressed!'))}>
const onKeyDown = (targetKey: KeyboardEvent['key'], cb: () => void) => (evt: React.KeyboardEvent<HTMLElement>) => {
  if (evt.key === targetKey) cb()
}

export default onKeyDown
