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
export const useSetActivePatient = (opts: MutationHookOptions = {}): [ (id: number, redirPath?: string) => void, MutationResult<any> ] => {
  const history = useHistory()

  const mutate = useMutation(queries.SET_ACTIVE_PATIENT, Object.assign({ onError: console.error }, opts))

  const setActivePatient = async (id: number, redirPath?: string) => {
    await mutate[0]({ variables: { id }})
    mutate[1]?.client?.reFetchObservableQueries()
    redirPath && history.push(redirPath)
  }

  return [ setActivePatient, mutate[1] ]
}
