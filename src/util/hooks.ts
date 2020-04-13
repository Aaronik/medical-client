import { useEffect } from 'react'
import * as queries from 'util/queries'
import { useMutation, MutationHookOptions, MutationResult } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import { useState } from 'react'

// Easy helper to signin. Takes care of
// * Loading while refetch is happening
// * Redirecting to '/'
// * Knowing about SIGNIN_MUTATION
export const useSignin = (opts: MutationHookOptions = {}) => {
  const history = useHistory()

  const [ refetchLoading, setRefetchLoading ] = useState(false)

  const mutationResponse = useMutation(queries.SIGNIN_MUTATION, Object.assign({
    onError: (e: Error) => {
      console.error(e)
      setRefetchLoading(false)
    },
    onCompleted: async ({ authenticate }: { authenticate: string }) => {
      localStorage.authToken = authenticate
      await mutationResponse[1].client?.reFetchObservableQueries()
      history.push('/')
    }
  }, opts))

  const oldSignin = mutationResponse[0]

  mutationResponse[0] = (...args) => {
    setRefetchLoading(true)
    return oldSignin(...args)
  }

  mutationResponse[1].loading = mutationResponse[1].loading || refetchLoading

  return mutationResponse
}

// For doctors to choose which patient they're currently looking at
export const useSetActivePatient = (opts: MutationHookOptions = {}): [ (id: number, redirPath: string) => void, MutationResult<any> ] => {
  const history = useHistory()

  const mutate = useMutation(queries.SET_ACTIVE_PATIENT, Object.assign({ onError: console.error }, opts))

  const setActivePatient = async (id: number, redirPath: string) => {
    await mutate[0]({ variables: { id }})
    mutate[1]?.client?.reFetchObservableQueries()
    history.push(redirPath)
  }

  return [ setActivePatient, mutate[1] ]
}

// Set a hook style keyboard event listener.
//
// There are two ways of using this. First, it returns a boolean value
// which you can use to declaratively change your code when the key is pressed.
// Ex.
//
// const isEnterPressed = useKeyPress('Enter')
//
// return (
//  <Container>
//   { isEnterPressed && <p>Pressed, noice</p>}
//  </Container>
// )
//
// The other way is to give it a callback which will be called on the keyboard
// event.
// Ex.
//
// useKeyPress('Enter', doThatThingOnEnter)
export const useKeyPress = (targetKey: KeyboardEvent['key'], cb?: () => void): boolean => {
  // State for keeping track of whether key is pressed
  const [isKeyPressed, setIsKeyPressed] = useState(false)

  type KeyEventHandler = (event: KeyboardEvent) => void

  // If pressed key is our target key then set to true
  const downHandler: KeyEventHandler = ({ key }) => {
    if (key === targetKey) {
      setIsKeyPressed(true)
      cb?.()
    }
  }

  // If released key is our target key then set to false
  const upHandler: KeyEventHandler = ({ key }) => {
    if (key === targetKey) {
      setIsKeyPressed(false)
    }
  }

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [cb])

  return isKeyPressed
}
