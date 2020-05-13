import React, { useEffect } from 'react'
import Loading from 'pages/Loading'
import ErrorPage from 'pages/Error'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useMutation, gql } from '@apollo/client'

// This is a strange page. Its purpose is to show a loading screen while it
// submits auth codes to the server for signin purposes. Users who've requested
// a signin link or have been invited will be snt to this page.

type TProps = {
}

const SubmitAuthCodePage: React.FC<TProps> = () => {
  const match = useRouteMatch()
  const history = useHistory()

  const [ submitAuthCode, { error, client }] = useMutation(SUBMIT_AUTH_CODE, {
    onError: console.error,
    onCompleted: async ({ submitAuthCode }) => {
      localStorage.authToken = submitAuthCode
      await client?.reFetchObservableQueries()
      // For some reason, if this is not brought to the back of the event loop, the route
      // does not get registered and there's a 404 when someone is signing up.
      setTimeout(() => history.push('/'))
    }
  })

  useEffect(() => {
    submitAuthCode({
      variables: {
        code: (match.params as any).authCode
      }
    })
    // eslint is so particular about what dependencies need to be in useEffect. It's so silly
    // to me -- they are assuming a particular behavior for all use cases but even in this app
    // alone in multiple places I've had different use cases.
    // eslint-disable-next-line
  }, [])

  if (error) return <ErrorPage error={error}/>
  return <Loading/>
}

export default SubmitAuthCodePage

const SUBMIT_AUTH_CODE = gql`
  mutation SubmitAuthCode($code:String!) {
    submitAuthCode(code: $code)
  }
`
