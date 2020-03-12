import { ApolloClient, InMemoryCache } from '@apollo/client'
import { times, random } from 'lodash'
import * as faker from 'faker'
import * as Timeline from 'types/Timeline.d'
import * as User from 'types/User.d'
import * as Alert from 'types/Alert.d'
import uuid from 'uuid/v4'
import strings from 'pages/DoctorOverview.strings'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000',
  headers: {
    get authorization() {
      return localStorage.authToken
    }
  },
  resolvers: {
    Query: {

      // Flags
      hasAuthToken() { return !!localStorage.authToken },
      gutterNavActive() { return gutterNavActive },
      activePatientId() { return localStorage.activePatientId },
      alerts() { return alerts },

      // Temporary until implemented on the server
      patients() {
        return [{
          id: 'f15c625d-9173-4ca7-a2f1-b1a1c34989d9',
          name: 'Bob Marley',
          userName: '',
          role: 'PATIENT',
          imageUrl: 'https://i.ytimg.com/vi/vdB-8eLEW8g/hqdefault.jpg',
          birthday: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
          adherence: 45,
          lastVisit: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
          joinDate: 'Tue Feb 06 1945 00:00:00 GMT-0700 (Pacific Standard Time)',
        }, {
          id: 'c545dde9-56e0-4260-a13d-cc25de10311b',
          name: 'Etta James',
          userName: '',
          role: 'PATIENT'
        }]
      },
      timeline() {
        const data = timelineData(300)
        const groups = timelineGroups(20)
        return { data, groups }
      },
      messages() {
        const patients = client.getResolvers().Query.patients() as User.TUser[]

        return [
          { id: '1', sender: patients[0], message: 'This is the first message', date: new Date() },
          { id: '2', sender: patients[1], message: 'This is the second message', date: new Date() },
        ]
      },
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

let gutterNavActive = true
let alerts: Alert.TAlert[] = []

// Takes an array, returns a random member of that array
const randomOf = <T>(...array: T[]): T => {
  const idx = random(array.length)
  return array[idx]
}

// Make some fake groups
const timelineGroups = (count: number) => {
  let groups: Timeline.TTimelineGroup[] = []

  times(count, idx => {
    groups.push({
      id: idx,
      content: faker.lorem.word(),
      style: 'max-width: 15vw; padding-left: 0px',
    })
  })

  return groups
}

// Add timeline items
const timelineData = (count: number) => {
  let items: Timeline.TTimelineItem[] = []

  times(count, () => {
    items.push({
      id: uuid(),
      type: randomOf('range', 'point'),
      start: faker.date.past(20),
      end: faker.date.future(),
      content: faker.lorem.words(),
      group: random(20)
    })
  })

  return items
}

export default client
