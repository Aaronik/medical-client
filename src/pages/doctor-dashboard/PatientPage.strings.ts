import strings from 'common/util/strings'

const map = {
  searchFilterPlaceholder: "Filter Events",
  groupFilterLabel: "Show",
  addPatientEvent: 'Add Patient Event',
  eventDesc: 'Event Description',
  formStartDate: '(Start) Date (yyyy-mm-dd)',
  formEndDate: 'End date (yyyy-mm-dd):',
  close: 'Close',
  save: 'Save',
  patientNotFound: 'Patient Not Found',
  yourPatient: (name: string) => `Timeline: ${name}`,
}

export default strings(map)