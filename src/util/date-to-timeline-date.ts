import * as timeline from 'vis-timeline'

// Take a long date that vis-timline automatically injects, or
// a regular old Date() object, and turn it into the kind of yyyy-dd-mm
// that we use in this app.
const formatDate = (datetype: timeline.DateType): string => {
  const date = new Date(datetype)

  let month: string | number, day: string | number

  month = date.getMonth() + 1
  if (month < 10) month = `0${month}`

  day = date.getDate()
  if (day < 10) day = `0${day}`

  return `${date.getFullYear()}-${month}-${day}`
}

export default formatDate
