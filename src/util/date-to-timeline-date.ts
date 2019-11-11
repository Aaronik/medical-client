import * as timeline from 'vis-timeline'

// Take a long date that vis-timline automatically injects, or
// a regular old Date() object, and turn it into the kind of yyyy-dd-mm
// that we use in this app.
const formatDate = (datetype: timeline.DateType): string => {
  const date = new Date(datetype)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export default formatDate
