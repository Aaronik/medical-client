import { ApolloClient, InMemoryCache, defaultDataIdFromObject } from '@apollo/client'
import * as Alert from 'types/Alert.d'
import uuid from 'uuid/v4'
import strings from 'pages/DoctorOverview.strings'

const cacheOptions = {
  // This is necessary because we often fetch questionnaires with the same id, but with different data, like many
  // responses to a single questionnaire. I tried using typePolicies with keyFields: ['id', 'assignmentInstanceId']
  // like specified in https://www.apollographql.com/docs/react/v3.0-beta/caching/cache-configuration/, but apollo
  // crashed when not every questionnaire had an assignmentInstanceId on it.
  dataIdFromObject: (responseObject: any, ...args: any[]) => {
    if (responseObject.__typename === 'Questionnaire') return `Questionnaire:${responseObject.id}:${responseObject.assignmentInstanceId}`
    if (responseObject.__typename === 'TextQuestion') return uuid()
    if (responseObject.__typename === 'BooleanQuestion') return uuid()
    if (responseObject.__typename === 'SingleChoiceQuestion') return uuid()
    if (responseObject.__typename === 'MultipleChoiceQuestion') return uuid()
    if (responseObject.__typename === 'EventQuestion') return uuid()
    return defaultDataIdFromObject(responseObject)
  }
}

const client = new ApolloClient({
  cache: new InMemoryCache(cacheOptions),
  uri: process.env.REACT_APP_API_URL || 'http://localhost:4000',
  headers: {
    get authorization() { return localStorage.authToken }
  },
  resolvers: {
    Query: {

      // Flags
      hasAuthToken() { return !!localStorage.authToken },
      gutterNavActive() { return gutterNavActive },
      activePatientId() { return localStorage.activePatientId },
      alerts() { return alerts },

      updates() {
        return [
          { symbol: 'up', charge: 'bad', body: '11', footer: strings('alertsDetected') },
          { symbol: 'up', charge: 'good', body: '89%', footer: strings('milliHealthScore') },
          { symbol: 'up', charge: 'bad', body: '8', footer: strings('dystfunctionsIdentified') },
          { symbol: 'up', charge: 'neutral', body: '12', footer: strings('interventionRecommendations') },
        ]
      }
    },
    Mutation: {
      setActivePatient(_, { id }) { localStorage.activePatientId = id },
      toggleGutterNav() { gutterNavActive = !gutterNavActive },
      addAlert(_, { alert }) { alerts.push(alert) },
      clearAlerts() { alerts = [] },
      clearAlert(_, { id }) { alerts = alerts.filter(alert => alert.id !== id) },
    }
  },
})

export default client

let gutterNavActive = true
let alerts: Alert.TAlert[] = []
