import React from 'react'

// Simple helper to be used for react event handlers
const preventDefault = (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()

export default preventDefault
